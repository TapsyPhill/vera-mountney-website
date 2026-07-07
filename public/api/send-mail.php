<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/phpmailer/phpmailer/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/SMTP.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/Exception.php';

const DEFAULT_RECIPIENT = 'veramountney@gmx.net';
const SMTP_TIMEOUT_SECONDS = 12;

/**
 * @return array<string, mixed>|null
 */
function loadMailConfig(): ?array
{
    $configPath = __DIR__ . '/smtp.config.php';
    if (!is_readable($configPath)) {
        return null;
    }

    /** @var array<string, mixed>|null $config */
    $config = require $configPath;

    return is_array($config) ? $config : null;
}

function getInquiryRecipient(): string
{
    $config = loadMailConfig();
    $recipient = trim((string)($config['recipient_email'] ?? ''));

    if ($recipient !== '' && filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        return $recipient;
    }

    return DEFAULT_RECIPIENT;
}

/**
 * @return list<string>
 */
function smtpHostCandidates(string $primaryHost): array
{
    $hosts = array_values(array_unique(array_filter([
        $primaryHost,
        'mail.vera-mountney.de',
        'vera-mountney.de',
        'premium309.web-hosting.com',
    ])));

    return $hosts;
}

/**
 * @return array{sent: bool, method: string, error: string|null, host: string|null}
 */
function sendInquiryEmail(
    string $recipient,
    string $subject,
    string $plainBody,
    string $replyToEmail,
    string $replyToName,
    ?string $htmlBody = null
): array {
    $smtpConfig = loadMailConfig();
    if ($smtpConfig !== null) {
        return sendViaSmtpWithFallback($smtpConfig, $recipient, $subject, $plainBody, $replyToEmail, $replyToName, $htmlBody);
    }

    $fallbackFrom = 'noreply@vera-mountney.de';
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

    $sent = @mail($recipient, $subject, $plainBody, $headerString, '-f' . $fallbackFrom);
    if (!$sent) {
        $sent = @mail($recipient, $subject, $plainBody, $headerString);
    }

    return [
        'sent' => $sent,
        'method' => 'mail',
        'error' => $sent ? null : 'PHP mail() returned false',
        'host' => null,
    ];
}

/**
 * @param array<string, mixed> $config
 * @return array{sent: bool, method: string, error: string|null, host: string|null}
 */
function sendViaSmtpWithFallback(
    array $config,
    string $recipient,
    string $subject,
    string $plainBody,
    string $replyToEmail,
    string $replyToName,
    ?string $htmlBody = null
): array {
    $primaryHost = (string)($config['host'] ?? '');
    $username = (string)($config['username'] ?? '');
    $password = (string)($config['password'] ?? '');

    if ($username === '' || $password === '') {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => 'SMTP config incomplete',
            'host' => null,
        ];
    }

    $errors = [];
    foreach (smtpHostCandidates($primaryHost) as $host) {
        $attempt = sendViaSmtpHost(
            $config,
            $host,
            $recipient,
            $subject,
            $plainBody,
            $replyToEmail,
            $replyToName,
            $htmlBody
        );

        if ($attempt['sent']) {
            return $attempt;
        }

        $errors[] = $host . ': ' . ($attempt['error'] ?? 'unknown error');
    }

    return [
        'sent' => false,
        'method' => 'smtp',
        'error' => implode(' | ', $errors),
        'host' => null,
    ];
}

/**
 * @param array<string, mixed> $config
 * @return array{sent: bool, method: string, error: string|null, host: string|null}
 */
function sendViaSmtpHost(
    array $config,
    string $host,
    string $recipient,
    string $subject,
    string $plainBody,
    string $replyToEmail,
    string $replyToName,
    ?string $htmlBody = null
): array {
    $username = (string)($config['username'] ?? '');
    $password = (string)($config['password'] ?? '');

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->Port = (int)($config['port'] ?? 587);
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        $mail->Password = $password;
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Timeout = SMTP_TIMEOUT_SECONDS;
        $mail->SMTPKeepAlive = false;

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

        if ($htmlBody !== null && $htmlBody !== '') {
            $mail->isHTML(true);
            $mail->Body = $htmlBody;
            $mail->AltBody = $plainBody;
        } else {
            $mail->isHTML(false);
            $mail->Body = $plainBody;
        }

        $mail->send();

        return [
            'sent' => true,
            'method' => 'smtp',
            'error' => null,
            'host' => $host,
        ];
    } catch (MailException $exception) {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => $exception->getMessage(),
            'host' => $host,
        ];
    }
}

function saveInquiryBackup(array $payload): bool
{
    $backupDir = __DIR__ . '/inquiries';
    if (!is_dir($backupDir)) {
        if (!@mkdir($backupDir, 0755, true) && !is_dir($backupDir)) {
            return false;
        }
    }

    $file = $backupDir . '/inquiry-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.json';

    return @file_put_contents(
        $file,
        json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    ) !== false;
}
