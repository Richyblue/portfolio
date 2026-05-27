<?php

if($_SERVER['REQUEST_METHOD'] == 'POST') {

    // 🔐 Sanitize Inputs
    $name = strip_tags(trim($_POST['name']));
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message']));
    $recaptcha = $_POST['g-recaptcha-response'];

    // 🔒 Verify reCAPTCHA
    $secret = 'YOUR_RECAPTCHA_SECRET_KEY';

    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$recaptcha"
    );

    $responseKeys = json_decode($response, true);

    // ❌ Failed reCAPTCHA
    if(intval($responseKeys["success"]) !== 1) {

        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>

        <script>
            Swal.fire({
                icon: 'error',
                title: 'reCAPTCHA Required',
                text: 'Please complete the reCAPTCHA verification.'
            }).then(() => {
                window.history.back();
            });
        </script>
        ";

        exit;
    }

    // 📩 Receiver Email
    $to = "info@bluesplash.name.ng";

    // 📌 Subject
    $subject = "New Contact Message From {$name}";

    // ✨ Email Body
    $body = "
    Name: {$name}

    Email: {$email}

    Message:
    {$message}
    ";

    // 📧 Email Headers
    $headers = "From: info@bluesplash.name.ng\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 🚀 Send Mail
    if(mail($to, $subject, $body, $headers)) {

        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>

        <script>
            Swal.fire({
                icon: 'success',
                title: 'Message Sent',
                text: 'Thank you! Your message has been sent successfully.',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                window.location.href = 'index.html';
            });
        </script>
        ";

    } else {

        echo "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>

        <script>
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sorry, there was an error sending your message.',
                confirmButtonColor: '#d33'
            }).then(() => {
                window.history.back();
            });
        </script>
        ";
    }
}
?>