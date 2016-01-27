// Basic Silobreaker toolbelt for making calls using Forms Authentication 
// to the Silobreaker API. This sample uses a cookie jar to store authentication cookie,
// and only log in once as long as the cookie jar contains a valid cookie.
// Requires login credentials and api call to be supplied as command line parameters.

var request = require("request");
var fs = require("fs");
var FileCookieStore = require("tough-cookie-filestore");

// Open the cookie jar - file must exist, otherwise the FileCookieStore will fail.
var filepath = "cookiejar";
fs.openSync(filepath, "a"); // Create a new or touch an existing cookie jag
var store = new FileCookieStore(filepath);

var j = request.jar(store);
var baseUrl = "https://api.silobreaker.com";

var contents = getCredentials();

var loginUri = baseUrl + "/v1/login";

var call = getCall();

// Check for existing login credentials and log in of none are present in the cookie jar
if(j.getCookies(loginUri).length < 1)
{
   console.log("logging in");
   signIn(formsCall, call);
} 
else 
{
   console.info("already logged in");
   formsCall(call);
}


function signIn(continuation, continuationparam)
{
   var cont = continuation;
   var contp = continuationparam;
   
   request(
      { method: "POST"
      , jar: j
      , uri: loginUri
      , headers: {
         "Content-Type": "application/json",
      } 
      , body: contents
      }
    , function (error, response, body) {
         if(response.statusCode == 200){
            console.log("Logged in.");
         } else {
            console.error("error: "+ response.statusCode)
            console.log(response)
         }

         cont(contp);
      }
   );
}

function formsCall(call)
{
   request.get(
      {
         uri: baseUrl + call, 
         jar: j,
         json: true
      },
   function(error, response, body)
   {
      console.log(body);
   });   
}

function getCredentials()
{
   // Get credentials from command line
   var credentialsFileName = process.argv[2];
   if(typeof credentialsFileName === "undefined" )
   {
      console.error("Please supply full file name for Silobreaker credentials file in JSON format.");
      help();
      process.exit(0);
   }
   
   return fs.readFileSync(credentialsFileName, "utf8");
}


function getCall()
{
   // Get API call command line
   var call = process.argv[3];
   if(typeof call === "undefined" ) {
      console.error("Please supply your API call as a parameter.");
      help();
      process.exit(0);
   }
   if(call.indexOf("?") <= 0) {
      console.error("Please use ?-syntax (/documents?q=foo, not /documents/foo)");
      help();
      process.exit(0);
   }
   return call;   
}

function help()
{
   var help = `
USAGE: node formsauth CREDENTIALSFILE "APICALL"

CREDENTIALSFILE is a json file of the format:
{
   "Username": "",
   "Password": ""
}
where Username and Password are your normal Silobreaker credentials.

APICALL is the API call to perform, without base url or API key. For example:
"/documents?q=stuxnet&type=atom10"
"/entities?q=list:Malware1&type=json"

In most shells, the APICALL need to be enclosed in quotation marks, as the &-sign
is otherwise interpreted and consumed by the shell.`;
   
   console.info(help);
}