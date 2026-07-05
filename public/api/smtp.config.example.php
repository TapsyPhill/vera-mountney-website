<?php
/**
 * Production config is generated at deploy from GitHub Actions secrets:
 * SMTP_HOST, SMTP_PORT, SMTP_ENCRYPTION, SMTP_USER, SMTP_PASS,
 * SMTP_FROM, SMTP_FROM_NAME, RECIPIENT_EMAIL
 */
return [
    'host' => 'vera-mountney.de',
    'port' => 465,
    'encryption' => 'ssl',
    'username' => 'noreply@vera-mountney.de',
    'password' => 'your-mailbox-password',
    'from_email' => 'noreply@vera-mountney.de',
    'from_name' => 'Vera Mountney Website',
    'recipient_email' => 'phillmhembere@gmail.com',
];
