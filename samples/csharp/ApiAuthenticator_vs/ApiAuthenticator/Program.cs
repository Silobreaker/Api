using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

namespace ApiAuthenticator
{
    struct SecretTokens
    {
        public string SharedKey;
        public string ApiKey;
    }

    class Program
    {
        private static string GetBase64Digest(string secretKey, string signatureString, byte[] postData)
        {
            Encoding encoding = Encoding.UTF8;

            var hmac = new HMACSHA1(encoding.GetBytes(secretKey));
            hmac.Initialize();

            List<byte> buffer = new List<byte>();

            buffer.AddRange(encoding.GetBytes(signatureString));

            if (postData != null)
            {
                buffer.AddRange(postData);
            }

            return Convert.ToBase64String(hmac.ComputeHash(buffer.ToArray()));
        }

        static void Main(string[] args)
        {
            if (args.Length < 2 || args.Length > 3)
            {
                Console.WriteLine("USAGE: ApiAuthenticator secretsfile.json URL [POSTDATA]");
                Console.WriteLine("URL: The api url to use (without the api key), for example: https://api.silobreaker.com/search/documents?q=Sweden&type=json");
                Console.WriteLine("POSTDATA: Path to postdata file, if specified http POST will be used. Otherwise http GET will be used");
                return;
            }

            SecretTokens secretTokens;

            var secretFile = args[0];
            try
            {
                secretTokens = JsonConvert.DeserializeObject<SecretTokens>(File.ReadAllText(secretFile));
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("Secrets file " + secretFile + " not found.");
                return;
            }

            string verb = "GET";

            byte[] postData = null;
            if (args.Length == 3)
            {
                var postDataFile = args[2];
                try
                {
                    postData = File.ReadAllBytes(postDataFile);
                    verb = "POST";
                }
                catch (Exception)
                {
                    Console.WriteLine("POST data file " + postDataFile + " not found.");
                    return;
                }
            }

            string url = args[1];
            var digestUrl = BuildDigestUrl(secretTokens, verb, url, postData);

            Console.WriteLine(digestUrl);

            var request = (HttpWebRequest) WebRequest.Create(digestUrl);
            request.Method = verb;

            if (postData != null)
            {
                request.ContentType = "application/json"; // Remove this if posting binary data

                Stream stream = request.GetRequestStream();
                stream.Write(postData, 0, postData.Length);
                stream.Flush();
                stream.Close();
            }

            Console.WriteLine(ReadResponse(request));
        }

        private static string BuildDigestUrl(SecretTokens secretTokens, string verb, string url, byte[] postData)
        {
            var digest = GetBase64Digest(secretTokens.SharedKey, verb + " " + url, postData);

            var digestUrl = url + (url.Contains("?") ? "&" : "?");
            digestUrl += "apiKey=" + secretTokens.ApiKey + "&digest=" + HttpUtility.UrlEncode(digest);
            return digestUrl;
        }

        private static string ReadResponse(HttpWebRequest request)
        {
            try
            {
                var response = (HttpWebResponse)request.GetResponse();
                using (var stream = response.GetResponseStream())
                {
                    var reader = new StreamReader(stream, Encoding.UTF8);
                    return reader.ReadToEnd();
                }
            }
            catch (WebException we)
            {
                using (var stream = we.Response.GetResponseStream())
                {
                    var reader = new StreamReader(stream, Encoding.UTF8);
                    return reader.ReadToEnd();
                }
            }
        }
    }
}
