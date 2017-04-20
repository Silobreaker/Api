'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');

// Basic Silobreaker toolbelt for creating a valid digested call URL for calls to the Silobreaker API.
// Requires api keys and api call to be supplied as command line parameters.
// Start script with -h for more information: node digest -h

// Specify default paths.
const DEFAULT_BASE_URL = "api.silobreaker.com";
const DEFAULT_CREDENTIALS_FILENAME = "api.keys.json";

let args = parseArguments();
let command = args['command'];
let method = args['method'];
let baseUrl = args['baseurl'];
let endpoint = args['endpoint'];
let keys = getKeys(args);
let bodyData = getBodyData(args);

let digestedUrl = generateDigestedUrl(method, baseUrl, endpoint, keys, bodyData);
switch (command) {
    case "make":
        console.info(digestedUrl);
        break;
    case "call":
        makeCall(method, digestedUrl, bodyData);
        break;
    default:
        console.error("Please enter a valid command");
        process.exit;
}

/** Performs the call to the api and prints the result
 * @param {string} httpMethod 
 * @param {string} digestedUri
 * @param {Buffer} requestBody
 */
function makeCall(httpMethod, digestedUri, requestBody) {
    let request = require("request");

    request({
        uri: digestedUri,
        method: httpMethod,
        headers: {
            'Content-type': 'application/json'
        },
        body: requestBody
    }, function(error, response, body) {
        if (error !== null) {
            console.log(error);
        } else {
            console.log(body);
        }
    });
}

/** Generates a digested URL with the provided information
 * @param {String} method The HTTP method to use
 * @param {String} baseUrl A base url for example `api.silobreaker.com`
 * @param {String} endpoint The endpoint URI for example `/documents?q=example`
 * @param {Object} keys JSON Object containing the `ApiKey` and `SharedKey`
 * @param {Buffer} bodyData Some form of body data that will be sent in the request (optional)
 * @returns {String} A digested URL
 */
function generateDigestedUrl(method, baseUrl, endpoint, keys, bodyData=undefined) {
    let apiUrl = url.resolve(`https://${baseUrl}/`, endpoint);
    let urlSignature = Buffer.from(`${method} ${url.format(apiUrl)}`, 'utf8');
    let signature = bodyData !== undefined
        ? Buffer.concat([urlSignature, Buffer.from(bodyData)])
        : urlSignature;

    let digest = generateHash(signature, keys.SharedKey);

    let digestedUrl = url.parse(apiUrl, true);

    digestedUrl.search += (digestedUrl.search.length > 0 ? '&' : '') + `apiKey=${keys.ApiKey}&digest=${digest}`;

    return url.format(digestedUrl);
}

/** @param {Buffer} data Data to be hashed
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

function parseArguments() {
    let ArgumentParser = require('argparse').ArgumentParser;
    let parser = new ArgumentParser({
        addHelp: true,
        description: 'Create a Silobreaker API link signed with a HMAC-SHA1 digest.'
    });

    parser.addArgument('command', {
        help: `Command to run. 
        "make" to make a digested url and print in the console. 
        "call" to make the call to the server and print the response.`,
        choices: ['call', 'make']
    });
    parser.addArgument('endpoint', {
        help: `API endpoint without base url or API key. For example: 
        "entities?q=list:Malware1&type=json".
        Enclose the endpoint in quotation marks, as the &-sign is otherwise interpreted and consumed by the shell.`
    });
    parser.addArgument(['-m', '--method'], {
        help: 'HTTP method to use',
        defaultValue: 'GET',
        choices: ['GET', 'POST', 'PUT', 'DELETE']
    });
    parser.addArgument(['--data'], {
        help: 'Path to any file that will be used as the body of the request.',
    });
    parser.addArgument(['-k', '--keyfile'], {
        help: `Path to a JSON file of the format
        {
          "ApiKey": "",
          "SharedKey": ""
        }, where ApiKey and SharedKey are supplied to you by your Silobreaker representative.`,
        defaultValue: DEFAULT_CREDENTIALS_FILENAME
    });
    parser.addArgument(['-b', '--baseurl'], {
        help: 'Domain name of the API instance, use api.silobreaker.com',
        defaultValue: DEFAULT_BASE_URL,
    });

    return parser.parseArgs();
}

/** Gets the data to use as request body from the file specified in the command line */
function getBodyData(args) {
    if (args.data !== null) {
        let dataPath = path.resolve(args.data);

        return fs.readFileSync(dataPath);
    }

    return undefined;
}

/** Gets the API keys from the file specified in the command line */
function getKeys(args) {
    let keyFilePath = path.resolve(args.keyfile);

    try {
        return require(keyFilePath);
    } catch (error) {
        console.error("Api credentials-file `" + keyFilePath + "` was not found.");
        process.exit(0);
    }
}
