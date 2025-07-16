# How to authenticate with the Silobreaker API using Python

This example shows you how to sign a link using your API key and shared secret.

The security is based on a HMAC-SHA512 digest. This allows you to sign an API url using the shared key for your account.

## Usage

Make sure you have Python 3 installed, and ensure you have a JSON file containing your API key and shared secret in a file called `secrets.json` in the `samples` directory.

```json
{
    "ApiKey": "SilobreakerApiKey",
    "SharedKey": "SilobreakerSharedSecret"
}
```

You can either perform a `GET` or a `POST` request. For a `POST` request use the command option `-P`.

An example of a `GET` request is

```
python3 authenticate.py "https://api.silobreaker.com/v2/documents/search?query=country:Sweden&type=json"
```

It should display a JSON object showing the response for a document search for Sweden.

A `POST` example is 

```
python3 authenticate.py -P "https://api.silobreaker.com/v2/heat"
```

It should display a JSON object showing the trending entities in a Heat response, like what is shown in the tool in the UI.

## Troubleshooting

### SSL: CERTIFICATE_VERIFY_FAILED / MacOS
If you run into a problem regarding the verification of the certificate try executing the command `/Applications/Python 3.6/Install Certificates.command`. More information regarding this issue [here](https://stackoverflow.com/questions/41691327/ssl-sslerror-ssl-certificate-verify-failed-certificate-verify-failed-ssl-c/41692664).

For any other problems, feel free to reach out to the Silobreaker team.