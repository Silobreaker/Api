# How to authenticate with the Silobreaker API using Go

This example shows you how to sign a link using your API key and shared secret key.

The security is based on a HMAC-SHA1 digest. This
allows you to sign an API url using the shared key for your account.

## Usage

Make sure you have go set up on your computer, and your go paths configured correctly.

Then run

```
go run authenticate.go
```

It should display a json object showing the response for a document search for Sweden.