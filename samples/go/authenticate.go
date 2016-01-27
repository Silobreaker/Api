package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
        "net/url"
	"os"
)

type keydata struct {
	SharedKey string
	ApiKey    string
}

func main() {
	signedURL := signURL("https://api.silobreaker.com/search/documents?q=Sweden&type=json")
	resp, e := http.Get(signedURL)
	if e != nil {
		fmt.Printf("Response error: %v\n", e)
		os.Exit(1)
	}
	defer resp.Body.Close()
	body, e := ioutil.ReadAll(resp.Body)
	if e != nil {
		fmt.Printf("Body error: %v\n", e)
		os.Exit(1)
	}

	fmt.Print(prettyJSON(body))
}

func prettyJSON(body []byte) string {

	var prettyJSON bytes.Buffer
	e := json.Indent(&prettyJSON, body, "", "  ")
	if e != nil {
		fmt.Printf("JSON error: %v\n", e)
		os.Exit(1)
	}

	return string(prettyJSON.Bytes())
}

func getKeys(keyfile string) keydata {
	file, e := ioutil.ReadFile(keyfile)
	if e != nil {
		fmt.Printf("File error: %v\n", e)
		os.Exit(1)
	}
	var keys keydata
	json.Unmarshal(file, &keys)
	return keys
}

func signURL(message string) string {
	keys := getKeys("../secrets.json")
	completeMessage := "GET " + message
	mac := hmac.New(sha1.New, []byte(keys.SharedKey))
	mac.Write([]byte(completeMessage))
	expectedMAC := mac.Sum(nil)
	digest := base64.StdEncoding.EncodeToString(expectedMAC)
	finalURL := message + "&apiKey=" + keys.ApiKey + "&digest=" + url.QueryEscape(digest)
	return finalURL
}
