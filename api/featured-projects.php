<?php


// INFO:
// This scrips is used to return the list of featured-project winners

if($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(401);
    exit;
}

// Get the list of winners
$winners_path = __DIR__ . "../resources/";



?>