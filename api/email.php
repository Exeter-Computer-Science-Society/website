<?php
    // recipient list use an array of emails
    $recipients = [ "eb968@exeter.ac.uk", "edward.blewitt2@gmail.com" ];
    
    // email subject
    $subject = "💻 EXCS News";
    
    // email body
    $message = file_get_contents(__DIR__ . "/../resources/newsletter/oct-2023-1/newsletter.html");

    $headers = "From: Exeter Computer Science Society";


    try {
        mail(
            join(
                ",",
                $recipients,
            ),
            $subject,
            $message,
            $headers
        );
    } catch (\Throwable $th) {
        echo "Error";
        echo var_dump($th);
        exit;
    }

    echo "OK";
?>