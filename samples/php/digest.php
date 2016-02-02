<?php
$verb = "GET";
$url = "https://api.silobreaker.com/search/documents?q=Sweden&type=json"; # ?q= syntax must be used. /documents/Sweden doesn't work.
$message = $verb . " " . $url;

$string = file_get_contents("secrets.json");
$json_a = json_decode($string, true);

$apikey = $json_a['ApiKey'];
$sharedkey = $json_a['SharedKey'];

# Create binary hash of message
$hash = hash_hmac('sha1', $message, $sharedkey, true);

# ...and encode it to base64
$digest = base64_encode($hash);

$final_url = $url . "&apiKey=" . $apikey . "&digest=" . urlencode($digest);

# Get and pretty print API response
$json_response = json_decode(file_get_contents($final_url));
echo json_encode($json_response, JSON_PRETTY_PRINT);
?>
