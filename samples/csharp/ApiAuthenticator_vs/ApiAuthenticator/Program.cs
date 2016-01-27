using System;
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

        private static string GetBase64Digest(string signatureString, string secretKey)
        {
            var enc = Encoding.UTF8;
            var hmac = new HMACSHA1(enc.GetBytes(secretKey));
            hmac.Initialize();

            var buffer = enc.GetBytes(signatureString);
            return Convert.ToBase64String(hmac.ComputeHash(buffer));
        }

        static void Main(string[] args)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("USAGE: ApiAuthenticator secretsfile.json");
                return;
            }
            
            var secretFile = args[0];
            
            SecretTokens secretTokens;
            
            try 
            {
                secretTokens = JsonConvert.DeserializeObject<SecretTokens>(File.ReadAllText(secretFile));
            }
            catch (System.IO.FileNotFoundException)
            {
                Console.WriteLine("Secrets file " + secretFile + " not found.");
                return;
            }
            
            const string verb = "GET";
            const string message = "https://api.silobreaker.com/search/documents?q=Sweden&type=json";
            var digest = GetBase64Digest(verb + " " + message, secretTokens.SharedKey);
            var url = message + "&apiKey=" + secretTokens.ApiKey + "&digest=" + HttpUtility.UrlEncode(digest);

            var request = (HttpWebRequest)WebRequest.Create(url);
            var response = (HttpWebResponse)request.GetResponse();

            string responseString;
            using (var stream = response.GetResponseStream())
            {
                var reader = new StreamReader(stream, Encoding.UTF8);
                responseString = reader.ReadToEnd();
            }
            Console.Write(responseString);
        }
    }
}
