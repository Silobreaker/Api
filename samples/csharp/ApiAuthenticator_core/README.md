# How to authenticate with the Silobreaker API using CSharp and .NET with DNU/DNX

This example shows you how to sign a link using your API key and shared secret
key.

The security is based on a HMAC-SHA1 digest. This allows you to sign an API url
using the shared key for your account.

## Usage

Install the .NET Version Manager (DNVM)

Make sure you have ASP.NET 5 set up on your computer
(https://www.asp.net/vnext).

To resolve dependencies, run

```
dnu restore
```

You can now run the sample using

```
dnx run pathtosecrets query
```

Example:

```
dnx run ../../secrets.json 'v1/infocus?q=hillary'
```
