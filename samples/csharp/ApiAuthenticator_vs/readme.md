# How to authenticate with the Silobreaker API using CSharp and Visual Studio 2010

This example shows you how to sign a link using your API key and shared secret key.

The security is based on a HMAC-SHA1 digest. This allows you to sign an API url using the shared key for your account.

## Usage

Make sure you have Visual Studio 2010 set up on your computer. It might also work with other versions
of Visual Studio, but Silobreaker has only tested it using Visual Studio 2010.

Open `ApiAuthenticator.sln` and run it using debug mode.

You might need to set a command line argument. In case you do,
go to `Project -> ApiAuthenticator Properties ...`, click on the Debug tab, and set Startup Options Command Line Arguments
to be the path to your json file with API keys:

```
../../../../../secrets.json
```
