import base64
import hashlib
import hmac
import html
import json
import urllib.request
from urllib import parse

'''
Document Search

The script requests a named file containing search queries, each placed on a separate line. These can be entity or free-text searches. The doc_search_example.txt contains some example queries. 

Each query is added to the list termsList and then searched using the /search/documents endpoint. Any additional parameters such as "&sortby=relevance" or number of documents can be altered as necessary.

Authentication requires a file containing the user's shared and secret key. Instructions for this are available in the root python folder and on https://github.com/Silobreaker/Api/tree/master/samples/python.
The final URL including apikey and digest is printed to the command line for reference. The results of all searches are written to a file called output.json or output.csv depending on format selection.
'''

# Select file of search terms - put each term on a new line

searchTerms = input("Specify search file: ")
outputType = input("Specify output type (json,csv): ")
while outputType != "json" and outputType != "csv":
	outputType = input("Please specify a valid output type (json,csv): ")
outputString = "output." + outputType
termsList = []

# Prepare files for reading & writing

with open(searchTerms, 'r') as Terms, open(outputString, 'w', encoding='utf-8-sig') as rawOutput:
	if outputType == "csv":
		rawOutput.write("Id,Description,Type,PublicationDate,Publisher,SourceUrl,SilobreakerUrl\n")
	for i in Terms:
		termsList.append(i)
		
		# Create each line in searchTerms as a document query
	
	for i in termsList:
		print("Running search: " + i)

		suburl = "https://api.silobreaker.com/search/documents?q=" + parse.quote(i) + "&sortby=relevance&extras=documentTeasers&type=json"

		# Set up the URL

		verb = "GET"
		url = suburl # ?q= syntax must be used.
		message = verb + " " + url

		# Sign the URL

		with open("secrets.json") as f: # The secrets file has the same format as the node example.
			secrets = json.load(f)

		sharedKey = secrets["SharedKey"]
		apiKey = secrets["ApiKey"]

		hmac_sha1 = hmac.new(sharedKey.encode(), message.encode(), digestmod=hashlib.sha1)
		digest = base64.b64encode(hmac_sha1.digest())

		# Fetch the data

		final_url = url + "&apiKey=" + apiKey + "&digest=" + urllib.parse.quote(digest.decode())
		
		## Uncomment for easier debugging
		## print("Final URL: " + final_url)

		req = urllib.request.Request(final_url)
		
		with urllib.request.urlopen(req) as response:
			responseJson = response.read()

			# Pretty print the data
			responseObject = json.loads(responseJson.decode("utf-8"))
		if outputType == "json":
			rawOutput.write(json.dumps(responseObject, ensure_ascii=False, sort_keys=True, indent=2, separators=(',', ': ')))
		elif outputType == "csv":
			rawOutput.write(i)
			for each in responseObject["Items"]:
				rawOutput.write(each["Id"] + ',')
				rawOutput.write('"' + each["Description"] + '",')
				rawOutput.write(each["Type"] + ',')
				rawOutput.write(each["PublicationDate"] + ',')
				rawOutput.write(each["Publisher"] + ',')
				rawOutput.write(each["SourceUrl"] + ',')
				rawOutput.write(each["SilobreakerUrl"] + '\n')