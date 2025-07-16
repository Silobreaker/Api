# Read config JSON file
$configPath = "config.json"
if (-not (Test-Path $configPath)) {
    Write-Error "Config file not found: $configPath"
    exit 1
}

$config = Get-Content $configPath | ConvertFrom-Json

# Extract values with defaults
$apiKey = $config.ApiKey
$sharedKey = $config.SharedKey
$baseUrl = $config.BaseUrl
$apiCall = $config.ApiCall
$verb = if ($config.Verb) { $config.Verb } else { "GET" }
$outputFile = $config.OutputFile

# Compose message and compute digest
$message = "$verb $baseUrl$apiCall"

$keyBytes = [Text.Encoding]::UTF8.GetBytes($sharedKey)
$messageBytes = [Text.Encoding]::UTF8.GetBytes($message)

$hmac = New-Object System.Security.Cryptography.HMACSHA512
$hmac.Key = $keyBytes
$hashBytes = $hmac.ComputeHash($messageBytes)

$digest = [Convert]::ToBase64String($hashBytes)
$encodedDigest = [System.Web.HttpUtility]::UrlEncode($digest)

$sep = if ($apiCall -like "*?*") { "&" } else { "?" }
$finalUrl = "$baseUrl$apiCall$sep" + "apiKey=$apiKey&digest=$encodedDigest"

# Output or save
if ($outputFile -and $outputFile.Trim() -ne "") {
    $finalUrl | Out-File -Encoding UTF8 -FilePath $outputFile
    Write-Output "Signed URL saved to $outputFile"
} else {
    Write-Output $finalUrl
}