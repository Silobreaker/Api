# How to authenticate with the Silobreaker API using Node

The Node examples demonstrate two different ways to authenticate using the Silobreaker
API - by signing a link using your API key and shared secret key, and by logging in and
saving a cookie.

### To run

To run the samples you will need [Node.js](https://nodejs.org/en/download/). `=>4.2.6`

Before you can run any of the bellow scripts you will also need to install the NPM-dependencies.
In the directory of this sample, run 
```bash
npm install
```

## Signing a link

The recommended way of authenticating with Silobreaker is based on signing the link
with a HMAC-SHA1 digest. This allows you to sign an API url using the shared key for your account.
If you are unsure of what your shared key is, please contact Silobreaker support.

### Usage

Prepare a JSON-file with your API

```json
{
    "ApiKey": "YourSilobreakerApiKey",
    "SharedKey": "YourSilobreakerSharedKey"
}
```
> You can make a copy [api.keys.json.example](api.keys.json.example) called `api.keys.json`, this is the default name for the api key file.

Run the program by executing

```bash
node digestcall "entities?q=dridex&type=json" PATH/TO/APIKEYFILE
```
> If your API key file is called `api.keys.json` you can omit _PATH/TO/APIKEYFILE_ 

Node should print a JSON-object showing entities with names containing the string _dridex_.

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


