# How to authenticate with the Silobreaker API using Java

This example shows how to sign a URL using your API key and shared secret.

The signature uses an HMAC-SHA512 digest to securely sign the URL with your account’s shared secret.

## Usage

Make sure you have Java installed, ensuring you have a JSON file containing your API key (as shown in other examples).

```json
{
    "ApiKey": "SilobreakerApiKey",
    "SharedKey": "SilobreakerSharedSecret"
}
```

Compile the program, making sure that `json.jar` is on your classpath.

```bash
javac -cp json.jar App.java
```

Run the program with two arguments:
* The path to the API key file.
* The API call to make, without a leading slash.

Make sure to properly escape/quote the API call to protect it against the shell.

```bash
java -cp json.jar:. App.java ../secrets.json 'v2/infocus?query=country:Iran&type=json'
```

If you encounter a JSON parsing error, check for the following:
* The API key file contains malformed JSON.
* The request does not specify that the response should be JSON.
* The API key is invalid, and the server returns an HTML blob instead of JSON.
