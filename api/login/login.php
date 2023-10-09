<?php

die;
if($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit;
}

if(!isset($_POST["username"], $_POST["password"])) {
    http_response_code(400);
    exit;
}



$host = "localhost";

$config_file_path = __DIR__ . "/../../../site.ini";


// Read config file for secrets
$config = (object) parse_ini_file($config_file_path);

$username = $config->database_username;
$password = $config->database_password;

// Connect to DB
$conn = new mysqli($host, $username, $password, "excs");

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    exit;
}

// Haha no SQL injection happening today
$sql = "SELECT password FROM users WHERE username=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $_POST["username"]);
$stmt->execute();
$result = $stmt->get_result(); // get the mysqli result
$user = $result->fetch_assoc(); // fetch data

echo var_dump($user);


?>