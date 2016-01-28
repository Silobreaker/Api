'use strict';

// Basic Silobreaker toolbelt for creating a valid digested call URL for calls to the Silobreaker API.
// Requires api keys and api call to be supplied as command line parameters, see
// help() function or just start the script.

// Specify default paths.
const DEFAULT_BASE_URL = "api.silobreaker.com";
const DEFAULT_CREDENTIALS_FILENAME = "api.keys.json";

var digestedUrl = generateDigestedUrl(getBaseUrl(), getCall(), getKeys());
console.info(digestedUrl);

/** Generates a digested URL with the provided information
 * @param {String} baseUrl A base url for example `api.silobreaker.com`
 * @param {String} call The call URI for example `/documents?q=example`
 * @param {Object} keys JSON Object containing the `ApiKey` and `SharedKey`
 * @returns {String} A digested URL
 */
function generateDigestedUrl(baseUrl, call, keys) {
    let verb = "GET";
    let digest = generateHash(`${verb} https://${baseUrl}${call}`, keys.SharedKey);
    let digestUri = `https://${baseUrl}${call}&apiKey=${keys.ApiKey}&digest=${ encodeURIComponent(digest) }`;

    return digestUri;
}

/** @param {string} data Data to be hashed 
 * @param {string} key Key to be used to hashed
 * @returns {string} The generated hash
*/
function generateHash(data, key) {
    const crypto = require("crypto");

    let hmac = crypto.createHmac("sha1", key);
    hmac.setEncoding("base64");
    hmac.write(data);
    hmac.end();
    let hash = hmac.read().toString();

    return hash;
}

/** Gets the call from the commandline */
function getCall() {
    let call = process.argv[2];
    console.log(call);
    if (typeof call === "undefined") {
        console.error("Please supply your API call as a parameter.");
        help();
        process.exit(0);
    }
    if (call.indexOf("?") <= 0) {
        console.error("Please use ?-syntax (documents?q=foo, not documents/foo)");
        help();
        process.exit(0);
    }
    /* leading slash is optional */
    if(call.charAt(0) != "/"){
        call = "/" + call;
    }
    return call;
}

/** Gets the API keys from the file specified in the commandline. If no command for this was present, default is used.*/
function getKeys() {
    let keyFileName = process.argv[3];
    if (typeof keyFileName === "undefined") {
        keyFileName = DEFAULT_CREDENTIALS_FILENAME;
    }
    try {
        return require(keyFileName);
    } catch (error) {
        console.error("Api credentials-file `" + keyFilePath + "` was not found.");
        process.exit(0);
    }
}

/** Gets the base url from the commandline if it was given. if none is specified use default. */
function getBaseUrl() {
    let baseUrl = process.argv[4];
    if (typeof baseUrl === "undefined") {
        baseUrl = DEFAULT_BASE_URL;
    }
    return baseUrl;
}

function help() {
    let help = `
USAGE: node makeDigest.js "APICALL" {APIKEYFILE} {BASEURL}

APIKEYFILE is a json file of the format:
{
   "ApiKey": "",
   "SharedKey": ""
}
where ApiKey and SharedKey are supplied to you by your Silobreaker representative.

APICALL is the API call to perform, without base url or API key. For example:
"documents?q=stuxnet&type=atom10"
"entities?q=list:Malware1&type=json"

Enclose the APICALL in quotation marks, as the &-sign
is otherwise interpreted and consumed by the shell.
BASEURL (optional) is the domain name of the api instance, use api.silobreaker.com
`;

    console.info(help);
}
