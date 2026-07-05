<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = ['https://vera-mountney.de', 'https://www.vera-mountney.de'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body']);
    exit;
}

if (!empty($data['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

function sanitize(string $value, int $maxLength = 5000): string
{
    $value = trim(strip_tags($value));
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}

function encodeSubject(string $subject): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
    }
    return $subject;
}

$name = sanitize((string)($data['name'] ?? ''), 200);
$email = sanitize((string)($data['email'] ?? ''), 200);
$phone = sanitize((string)($data['phone'] ?? ''), 50);
$preferredContactMethod = sanitize((string)($data['preferredContactMethod'] ?? ''), 50);
$selectedService = sanitize((string)($data['selectedService'] ?? ''), 200);
$otherService = sanitize((string)($data['otherService'] ?? ''), 300);
$preferredDateTime = sanitize((string)($data['preferredDateTime'] ?? ''), 300);
$address = sanitize((string)($data['address'] ?? ''), 300);
$subject = sanitize((string)($data['subject'] ?? ''), 200);
$message = sanitize((string)($data['message'] ?? ''), 5000);
$language = sanitize((string)($data['language'] ?? 'de'), 10);
$source = sanitize((string)($data['source'] ?? 'contact_form'), 50);
$appointmentRequest = !empty($data['appointmentRequest']);

$errors = [];

if ($name === '') {
    $errors[] = 'name';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($message === '') {
    $errors[] = 'message';
}
if ($selectedService === '') {
    $errors[] = 'selectedService';
}
if ($preferredContactMethod === '') {
    $errors[] = 'preferredContactMethod';
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors,
    ]);
    exit;
}

// Recipient comes from smtp.config.php (RECIPIENT_EMAIL secret at deploy time)
require_once __DIR__ . '/send-mail.php';

$recipient = getInquiryRecipient();

$sourceLabel = $source === 'vera_assistant' ? 'Vera Assistant' : 'Contact Form';
$appointmentLabel = $appointmentRequest ? 'Yes / Ja' : 'No / Nein';

$emailSubject = $subject !== ''
    ? 'Neue Anfrage über vera-mountney.de: ' . $subject
    : 'Neue Anfrage über vera-mountney.de';

$bodyLines = [
    'New inquiry from vera-mountney.de',
    '',
    'Source:',
    $sourceLabel,
    '',
    'Name:',
    $name,
    'Email:',
    $email,
    'Phone:',
    $phone !== '' ? $phone : '-',
    'Preferred contact method:',
    $preferredContactMethod,
    'Selected service:',
    $selectedService,
    'Other service:',
    $otherService !== '' ? $otherService : '-',
    'Preferred appointment date/time:',
    $preferredDateTime !== '' ? $preferredDateTime : '-',
    'Address:',
    $address !== '' ? $address : '-',
    'Appointment request:',
    $appointmentLabel,
    'Language:',
    $language,
    'Subject:',
    $subject !== '' ? $subject : '-',
    '',
    'Message:',
    '',
    $message,
    '',
    'Submitted at:',
    date('Y-m-d H:i:s T'),
    'User agent:',
    sanitize((string)($_SERVER['HTTP_USER_AGENT'] ?? '-'), 500),
    'Website:',
    'https://vera-mountney.de',
];

$body = implode("\r\n", $bodyLines);

$mailResult = sendInquiryEmail(
    $recipient,
    encodeSubject($emailSubject),
    $body,
    $email,
    $name
);

$sent = $mailResult['sent'];

$backupDir = __DIR__ . '/inquiries';
if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}

$backupPayload = [
    'savedAt' => date('c'),
    'mailSent' => $sent,
    'mailMethod' => $mailResult['method'],
    'mailError' => $mailResult['error'],
    'recipient' => $recipient,
    'data' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'preferredContactMethod' => $preferredContactMethod,
        'selectedService' => $selectedService,
        'otherService' => $otherService,
        'preferredDateTime' => $preferredDateTime,
        'address' => $address,
        'subject' => $subject,
        'message' => $message,
        'appointmentRequest' => $appointmentRequest,
        'language' => $language,
        'source' => $source,
    ],
];

@file_put_contents(
    $backupDir . '/inquiry-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.json',
    json_encode($backupPayload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
    LOCK_EX
);

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Email could not be sent',
    ]);
    exit;
}

echo json_encode(['success' => true]);
