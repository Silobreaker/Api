# How to authenticate with the Silobreaker API using Java

This example shows you how to sign a link using your API key and shared secret key.

The security is based on a HMAC-SHA1 digest. This allows you to sign an API
url using the shared key for your account.

## Usage

Make sure you have Java installed.

Make sure you have a json file with your api key somewhere (as in the other examples)

```json
{
    "ApiKey": "SilobreakerApiKey",
    "SharedKey": "SilobreakerSharedSecret"
}
```

Compile the program and make sure json.jar is on you classpath.

```bash
javac -cp json.jar App.java
```

Run the program. It takes two arguments, the first the path to the api key file and
the second is the api call to make. Without leading slash and don't forget to
protect it against the shell:

```bash
java -cp json.jar:. App.java ../secrets.json 'v1/infocus?q=obama&type=json'
```

If you get a json parsing error it might be because:
* The json in your api key file is malformed.
* You don't tell the endpoint to return json.
* Your api key is wrong which causes the api to respond with and html blob
  telling you about the error.
