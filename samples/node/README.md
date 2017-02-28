# How to authenticate with the Silobreaker API using Node

The Node examples demonstrate two different ways to authenticate using the Silobreaker
API - by signing a link using your API key and shared secret key, and by logging in and
saving a cookie.

### To run

To run the samples you will need [Node.js](https://nodejs.org/en/download/). `=>5.12.0`

Before you can run any of the below scripts you will also need to install the NPM-dependencies.
In the directory of this sample, run 
```bash
npm install
```

## Signing a link

The recommended way of authenticating with Silobreaker is based on signing the link
with a HMAC-SHA1 digest. This allows you to sign an API url using the shared key for your account.
If you are unsure of what your shared key is, please contact Silobreaker support.

### Usage

Prepare a JSON-file with your API-keys.

```json
{
    "ApiKey": "YourSilobreakerApiKey",
    "SharedKey": "YourSilobreakerSharedKey"
}
```

You can get a digested url by running:

```bash
node digest make "entities?q=dridex&type=json" -k PATH/TO/APIKEYFILE
```

Or get the result of the call by running

```bash
node digest call "entities?q=dridex&type=json" -k PATH/TO/APIKEYFILE
```

### Usage for POST requests

Prepare a file with the request body. This can be any format that the endpoint requires.

```json
{
  "query": "Iran",
  "items":  "barack obama [person],hillary clinton [person],Republican Party (US) [organization]",
  "normalize": true,
  "weightAlgorithm": "iwmc"
}
```

You can get a digested url for a POST request by running:

```bash
node digest make "v1/network" -k PATH/TO/APIKEYFILE -m POST --data PATH/TO/BODY
```

Or get the result of the call by running

```bash
node digest call "v1/network" -k PATH/TO/APIKEYFILE -m POST --data PATH/TO/BODY
```

## Logging in using a cookie

Silobreaker's API also allows you to log in using a cookie. This is not recommended in general, 
but can be appropriate for browser based clients.

### Usage

Make sure you have node installed on your computer, and that you have a
a credentials file prepared, and a cookie jar file called `cookiejar` in the
current working directory. The credentials file should be of the format 

```json
{
   "Username": USERNAME,
   "Password": SILOBREAKER PASSWORD
}
```

Then run

```bash
node formsauth.js CREDENTIALSFILE "/entities?q=list:Malware1&type=json"
```


