using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ApiAuthenticator
{
    struct SecretTokens
    {
        public string SharedKey;
        public string ApiKey;
    }

    class Program
    {

        private static string GetBase64Digest(string signatureString, string secretKey)
        {
            var enc = Encoding.UTF8;
            var hmac = new HMACSHA1(enc.GetBytes(secretKey));
            hmac.Initialize();

            var buffer = enc.GetBytes(signatureString);
            return Convert.ToBase64String(hmac.ComputeHash(buffer));
        }

        private static JObject getAPIResponse(SecretTokens secret, string url)
        {
            const string verb = "GET";
            var digest = GetBase64Digest(verb + " " + url, secret.SharedKey);
            var signedUrl = url + "&apiKey=" + secret.ApiKey + "&digest=" + WebUtility.UrlEncode(digest);

            var request = (HttpWebRequest)WebRequest.Create(signedUrl);
            var response = (HttpWebResponse)request.GetResponse();

            using (var stream = response.GetResponseStream())
            {
                var reader = new StreamReader(stream, Encoding.UTF8);
                var str = reader.ReadToEnd();
                return JObject.Parse(str);
            }
        }

        static void Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("USAGE: ApiAuthenticator secretsfile.json query");
                return;
            }

            var secretFile = args[0];

            const string host = "https://api.silobreaker.com/";
            string url = host + args[1] + "&type=json";

            try
            {
                SecretTokens secretTokens = JsonConvert.DeserializeObject<SecretTokens>(File.ReadAllText(secretFile));
                JObject o = getAPIResponse(secretTokens, url);
                Console.WriteLine(o.ToString());
            }
            catch (System.IO.FileNotFoundException)
            {
                Console.WriteLine("Secrets file " + secretFile + " not found.");
            }
            catch (WebException e)
            {
                Console.WriteLine(e.Message);
            }
            catch (JsonReaderException)
            {
                Console.WriteLine("Error parsing json. Either the secrets file is malformed or\nthe authentication failed. Check that your api keys are correct.");
            }

        }
    }
}
