import base64
import hashlib
import hmac
import html
import json
import urllib.request

# Set up the URL

verb = "GET"
url = "https://api.silobreaker.com/search/documents?q=Sweden&type=json" # ?q= syntax must be used. /documents/Sweden doesn't work.
message = verb + " " + url

# Sign the URL

with open("../secrets.json") as f: # The secrets file has the same format as the node example.
    secrets = json.load(f)

sharedKey = secrets["SharedKey"]
apiKey = secrets["ApiKey"]

hmac_sha1 = hmac.new(sharedKey.encode(), message.encode(), digestmod=hashlib.sha1)
digest = base64.b64encode(hmac_sha1.digest())

# Fetch the data

final_url = url + "&apiKey=" + apiKey + "&digest=" + urllib.parse.quote(digest.decode())

req = urllib.request.Request(final_url)
with urllib.request.urlopen(req) as response:
    responseJson = response.read()

# Pretty print the data

responseObject = json.loads(responseJson.decode("utf-8"))
print(json.dumps(responseObject, sort_keys=True, indent=2, separators=(',', ': ')))
