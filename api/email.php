<?php
    // recipient list use an array of emails
    $recipients = array("eb968@exeter.ac.uk");
    
    // email subject
    $subject = "💻 EXCS News";
    
    // email body
    $message = file_get_contents(__DIR__ . "../resources/newsletter/oct-2023-1/newsletter.html");

    $headers = "From: Exeter Computer Science Society";


    try {
        mail(implode(",". $recipients), $subject, $content, $headers);
    } catch (\Throwable $th) {
        echo "Error";
        exit;
    }

    echo "OK";
?>