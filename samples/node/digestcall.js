// Basic Silobreaker toolbelt for making digested calls to the Silobreaker API.
// Requires api keys and api call to be supplied as command line parameters, see
// help() function or just start the script.

var keys = getKeys();
var call = getCall();

digestedCall(call, keys);

function digestedCall(call, keys) {
    var request = require("request");
    var baseUrl = "https://api.silobreaker.com";
    var verb = "GET";
    var digest = signCall(verb + " " + baseUrl + call, keys.SharedKey);
    var digestUri = baseUrl + call + "&apiKey=" + keys.ApiKey + "&digest=" + encodeURIComponent(digest);

    request.get(
        {
            uri: digestUri,
            json: true
        },
        function (error, response, body) {
            console.log(body);
        });
}

function signCall(uri, key) {
    var crypto = require("crypto");
    var hash, hmac;

    hmac = crypto.createHmac("sha1", key);
    hmac.setEncoding("base64");
    hmac.write(uri);
    hmac.end();
    hash = hmac.read();

    return hash;
}

function getKeys() {
    // Get API credentials from command line
    var keyFileName = process.argv[2];
    if (typeof keyFileName === "undefined") {
        console.error("Please supply full file name for Silobreaker apiKey file in JSON format.");
        help();
        process.exit(0);
    }
    return require(keyFileName);
}

function getCall() {
    // Get API call command line
    var call = process.argv[3];
    if (typeof call === "undefined") {
        console.error("Please supply your API call as a parameter.");
        help();
        process.exit(0);
    }
    if (call.indexOf("?") <= 0) {
        console.error("Please use ?-syntax (/documents?q=foo, not /documents/foo)");
        help();
        process.exit(0);
    }
    return call;
}

function help() {
    var help = `
USAGE: node digestcall APIKEYFILE "APICALL"

APIKEYFILE is a json file of the format:

{
    "ApiKey": "",
    "SharedKey": ""
}
where ApiKey and SharedKey are supplied to you by your Silobreaker representative.

APICALL is the API call to perform, without base url or API key. For example:
"/documents?q=stuxnet&type=atom10"
"/entities?q=list:Malware1&type=json"
\n\
In most shells, the APICALL need to be enclosed in quotation marks, as the &-sign
is otherwise interpreted and consumed by the shell.`;

    console.info(help);
}
