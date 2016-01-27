# How to authenticate with the Silobreaker API using Python

This example shows you how to sign a link using your API key and shared secret key.

The security is based on a HMAC-SHA1 digest. This
allows you to sign an API url using the shared key for your account.

## Usage

Make sure you have python3 installed on your computer, including the `requests`
package. You need to have a file called `secrets.json` in the `samples`
directory. The secrets-file should contain your api key and shared key, and be
of the format

```json
{
    "ApiKey": "SilobreakerApiKey",
    "SharedKey": "SilobreakerSharedSecret"
}
```

Then run

```
python authenticate.py
```

It should display a json object showing the response for a document search for Sweden.