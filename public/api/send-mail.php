<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/phpmailer/phpmailer/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/SMTP.php';
require_once __DIR__ . '/vendor/phpmailer/phpmailer/Exception.php';

const DEFAULT_RECIPIENT = 'phillmhembere@gmail.com';

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
 * @param array<string, mixed> $config
 * @return list<array{host: string, port: int, encryption: string}>
 */
function buildSmtpAttempts(array $config): array
{
    $primaryHost = trim((string)($config['host'] ?? ''));
    $primaryPort = (int)($config['port'] ?? 465);
    $primaryEncryption = strtolower((string)($config['encryption'] ?? 'ssl'));
    $username = (string)($config['username'] ?? '');

    $domain = '';
    if (preg_match('/@([^@]+)$/', $username, $matches) === 1) {
        $domain = $matches[1];
    }

    $candidates = [
        ['host' => $primaryHost, 'port' => $primaryPort, 'encryption' => $primaryEncryption],
    ];

    if ($domain !== '') {
        $mailHost = 'mail.' . $domain;
        $candidates[] = ['host' => $mailHost, 'port' => 465, 'encryption' => 'ssl'];
        $candidates[] = ['host' => $mailHost, 'port' => 587, 'encryption' => 'tls'];
        $candidates[] = ['host' => $domain, 'port' => 465, 'encryption' => 'ssl'];
        $candidates[] = ['host' => $domain, 'port' => 587, 'encryption' => 'tls'];
    }

    $unique = [];
    $seen = [];
    foreach ($candidates as $candidate) {
        if ($candidate['host'] === '') {
            continue;
        }
        $key = $candidate['host'] . ':' . $candidate['port'] . ':' . $candidate['encryption'];
        if (isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $unique[] = $candidate;
    }

    return $unique;
}

/**
 * @return array{sent: bool, method: string, error: string|null}
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
        return sendViaSmtp($smtpConfig, $recipient, $subject, $plainBody, $replyToEmail, $replyToName, $htmlBody);
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
    string $plainBody,
    string $replyToEmail,
    string $replyToName,
    ?string $htmlBody = null
): array {
    $username = (string)($config['username'] ?? '');
    $password = (string)($config['password'] ?? '');

    if ($username === '' || $password === '') {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => 'SMTP config incomplete',
        ];
    }

    $attempts = buildSmtpAttempts($config);
    $errors = [];

    foreach ($attempts as $attempt) {
        $result = attemptSmtpSend(
            $config,
            $attempt['host'],
            $attempt['port'],
            $attempt['encryption'],
            $recipient,
            $subject,
            $plainBody,
            $replyToEmail,
            $replyToName,
            $htmlBody
        );

        if ($result['sent']) {
            $result['method'] = 'smtp:' . $attempt['host'] . ':' . $attempt['port'];
            return $result;
        }

        $errors[] = $attempt['host'] . ':' . $attempt['port'] . ' — ' . ($result['error'] ?? 'unknown');
    }

    // Final fallback: plain text only (some hosts reject HTML)
    if ($htmlBody !== null && $htmlBody !== '') {
        foreach ($attempts as $attempt) {
            $result = attemptSmtpSend(
                $config,
                $attempt['host'],
                $attempt['port'],
                $attempt['encryption'],
                $recipient,
                $subject,
                $plainBody,
                $replyToEmail,
                $replyToName,
                null
            );

            if ($result['sent']) {
                $result['method'] = 'smtp-plain:' . $attempt['host'] . ':' . $attempt['port'];
                return $result;
            }

            $errors[] = $attempt['host'] . ':' . $attempt['port'] . ' (plain) — ' . ($result['error'] ?? 'unknown');
        }
    }

    return [
        'sent' => false,
        'method' => 'smtp',
        'error' => implode(' | ', $errors),
    ];
}

/**
 * @param array<string, mixed> $config
 * @return array{sent: bool, method: string, error: string|null}
 */
function attemptSmtpSend(
    array $config,
    string $host,
    int $port,
    string $encryption,
    string $recipient,
    string $subject,
    string $plainBody,
    string $replyToEmail,
    string $replyToName,
    ?string $htmlBody
): array {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->Port = $port;
        $mail->SMTPAuth = true;
        $mail->Username = (string)($config['username'] ?? '');
        $mail->Password = (string)($config['password'] ?? '');
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Timeout = 20;
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ];

        if ($encryption === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($encryption === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPAutoTLS = false;
            $mail->SMTPSecure = false;
        }

        $fromEmail = (string)($config['from_email'] ?? $mail->Username);
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
        ];
    } catch (MailException $exception) {
        return [
            'sent' => false,
            'method' => 'smtp',
            'error' => $exception->getMessage(),
        ];
    }
}
