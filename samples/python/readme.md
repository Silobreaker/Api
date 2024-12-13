# How to authenticate with the Silobreaker API using Python

This example shows you how to sign a link using your API key and shared secret key.

The security is based on a HMAC-SHA1 digest. This allows you to sign an API url using the shared key for your account.

## Usage

Make sure you have Python 3 installed on your computer, including the `requests` package. You can install this package using the command `pip3 install requests`. 
You need to have a file called `secrets.json` in the `samples` directory. The secrets file should contain your api key and shared key, and be of the format

```json
{
    "ApiKey": "SilobreakerApiKey",
    "SharedKey": "SilobreakerSharedSecret"
}
```

You can either perform a GET or a POST request. For a POST request use the command option `-P`.

An example of a GET request is

```
python3 authenticate.py "https://api.silobreaker.com/search/documents?q=Sweden&type=json"
```

It should display a JSON object showing the response for a document search for Sweden.

A POST example is 

```
python3 authenticate.py -P "https://api.silobreaker.com/v1/network"
```

It should display a JSON object showing the entity relationships suitable for drawing as a network.

## Troubleshooting

### SSL: CERTIFICATE_VERIFY_FAILED / MacOS
If you run into a problem regarding the verification of the certificate try executing the command `/Applications/Python 3.6/Install Certificates.command`. More information regarding this issue [here](https://stackoverflow.com/questions/41691327/ssl-sslerror-ssl-certificate-verify-failed-certificate-verify-failed-ssl-c/41692664).

For any other problems, feel free to reach out to the Silobreaker team.