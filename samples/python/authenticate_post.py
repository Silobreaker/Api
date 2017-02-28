import base64
import hashlib
import hmac
import html
import json
import urllib.request

# Set up the URL

verb = "POST"
url = "https://api.silobreaker.com/v1/network"
urlSignature = verb + " " + url

# Load request body data

with open('post_data.json', 'rb') as f:
    body = f.read()

# Sign the URL
message = urlSignature.encode() + body

with open("../secrets.json") as f: # The secrets file has the same format as the node example.
    secrets = json.load(f)

sharedKey = secrets["SharedKey"]
apiKey = secrets["ApiKey"]

hmac_sha1 = hmac.new(sharedKey.encode(), message, digestmod=hashlib.sha1)
digest = base64.b64encode(hmac_sha1.digest())

# Fetch the data

final_url = url + "?apiKey=" + apiKey + "&digest=" + html.escape(digest.decode())

req = urllib.request.Request(final_url, data=body, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as response:
    responseJson = response.read()

# Pretty print the data

responseObject = json.loads(responseJson.decode("utf-8"))
print(json.dumps(responseObject, sort_keys=True, indent=2, separators=(',', ': ')))
