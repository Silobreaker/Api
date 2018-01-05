import base64
import hashlib
import hmac
import html
import json
import urllib.request
import argparse

# Command line arguments 

parser = argparse.ArgumentParser()
parser.add_argument("URL", help="the endpoint of the API, inside quotation marks")
parser.add_argument("-P", "--POST", help="perform a POST request. Data can be modified in post_data.json", action='store_true')
args = parser.parse_args()

url = args.URL

with open("../secrets.json") as f: # The secrets file has the same format as the node example.
    secrets = json.load(f)

sharedKey = secrets["SharedKey"]
apiKey = secrets["ApiKey"]

if args.POST:
    verb = "POST"
    with open('post_data.json', 'rb') as f:
        body = f.read()

    # Sign the URL
    urlSignature = verb + " " + url
    message = urlSignature.encode() + body

    hmac_sha1 = hmac.new(sharedKey.encode(), message, digestmod=hashlib.sha1)
    digest = base64.b64encode(hmac_sha1.digest())

    # Fetch the data

    final_url = url + "?apiKey=" + apiKey + "&digest=" + urllib.parse.quote(digest.decode())
    req = urllib.request.Request(final_url, data=body, headers={'Content-Type': 'application/json'})

else:
    verb = "GET"
    message = verb + " " + url

    # Sign the URL

    hmac_sha1 = hmac.new(sharedKey.encode(), message.encode(), digestmod=hashlib.sha1)
    digest = base64.b64encode(hmac_sha1.digest())

    # Fetch the data

    final_url = url + "&apiKey=" + apiKey + "&digest=" + urllib.parse.quote(digest.decode())
    req = urllib.request.Request(final_url)


# Perform the request

with urllib.request.urlopen(req) as response:
    responseJson = response.read()

# Pretty print the data

responseObject = json.loads(responseJson.decode("utf-8"))
print(json.dumps(responseObject, sort_keys=True, indent=2, separators=(',', ': ')))
