# How to authenticate with the Silobreaker API using PowerShell

This example shows you how to sign a link using your API key and shared secret. It will output a signed URL, which you can view in your browser.

The security is based on a HMAC-SHA512 digest. This allows you to sign an API url using the shared key for your account.

## Usage

You must have PowerShell installed, usually included by default in modern versions of Windows, and available for other operating systems from the [Microsoft site](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.5). 

You also need to configure `config.json` with your keys, and the query you wish to perform.


```json
{
  "ApiKey": "",
  "SharedKey": "",
  "BaseUrl": "https://api.silobreaker.com",
  "ApiCall": "/v2/documents/search?query=entitytype:Malware",
  "Verb": "GET",
  "OutputFile": "SignedURL.txt"
}
```

To perform the `GET` request, you can run the script from Windows PowerShell or Terminal by running `.\SignRequest.ps1`.

It should save an authenticated URL to the specified output file, which is `SignedURL.txt` in the default example.


## Troubleshooting

Running this example may require elevated security settings, depending on your organization's security policy.