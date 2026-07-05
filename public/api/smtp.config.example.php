<?php
/**
 * Copy to smtp.config.php on the server, or set GitHub Actions secrets:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM (optional)
 */
return [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'encryption' => 'tls',
    'username' => 'phillmhembere@gmail.com',
    'password' => 'your-app-password-here',
    'from_email' => 'phillmhembere@gmail.com',
    'from_name' => 'Vera Mountney Website',
];
