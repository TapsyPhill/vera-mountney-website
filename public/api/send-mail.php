<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/phpmailer/phpmailer/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/SMTP.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/Exception.php';

/**
 * @return array{sent: bool, method: string, error: string|null}
 */
function sendInquiryEmail(
    string $recipient,
    string $subject,
    string $body,
    string $replyToEmail,
    string $replyToName
): array {
    $configPath = __DIR__ . '/smtp.config.php';
    if (is_readable($configPath)) {
        /** @var array<string, mixed> $smtpConfig */
        $smtpConfig = require $configPath;
        $result = sendViaSmtp($smtpConfig, $recipient, $subject, $body, $replyToEmail, $replyToName);
        if ($result['sent']) {
            return $result;
        }
    }

    $fallbackFrom = 'vera_deploy@vera-mountney.de';
    $headers = [
        'MIME-Version: 1.0',
        'From: Vera Mountney Website <' . $fallbackFrom . '>',
        'Reply-To: ' . $replyToName . ' <' . $replyToEmail . '>',
        'Return-Path: ' . $fallbackFrom,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    ini_set('sendmail_from', $fallbackFrom);
    $headerString = implode("\r\n", $headers);

    $sent = @mail($recipient, $subject, $body, $headerString, '-f' . $fallbackFrom);
    if (!$sent) {
        $sent = @mail($recipient, $subject, $body, $headerString);
    }

    return [
        'sent' => $sent,
        'method' => 'mail',
        'error' => $sent ? null : 'PHP mail() returned false',
    ];
}

/**
 * @param array<string, mixed> $config
 * @return array{sent: bool, method: string, error: string|null}
 */
function sendViaSmtp(
    array $config,
    string $recipient,
    string $subject,
    string $body,
    string $replyToEmail,
    string $replyToName
): array {
    $host = (string)($config['host'] ?? '');
    $username = (string)($config['username'] ?? '');
    $password = (string)($config['password'] ?? '');

    if ($host === '' || $username === '' || $password === '') {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => 'SMTP config incomplete',
        ];
    }

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->Port = (int)($config['port'] ?? 587);
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        $mail->Password = $password;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;

        $encryption = strtolower((string)($config['encryption'] ?? 'tls'));
        if ($encryption === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($encryption === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPAutoTLS = false;
            $mail->SMTPSecure = false;
        }

        $fromEmail = (string)($config['from_email'] ?? $username);
        $fromName = (string)($config['from_name'] ?? 'Vera Mountney Website');

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($recipient);
        $mail->addReplyTo($replyToEmail, $replyToName);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->isHTML(false);

        $mail->send();

        return [
            'sent' => true,
            'method' => 'smtp',
            'error' => null,
        ];
    } catch (MailException $exception) {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => $exception->getMessage(),
        ];
    }
}
