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

if (!empty($data['botcheck'])) {
    echo json_encode(['success' => true]);
    exit;
}

function sanitizeField(string $value, int $maxLength = 5000): string
{
    $value = trim(strip_tags($value));
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}

function sanitizeMessage(string $value, int $maxLength = 5000): string
{
    $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}

function isValidEmail(string $email): bool
{
    if ($email === '') {
        return false;
    }

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return true;
    }

    return (bool) preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email);
}

function encodeSubject(string $subject): string
{
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
    }
    return $subject;
}

$name = sanitizeField((string)($data['name'] ?? ''), 200);
$email = sanitizeField((string)($data['email'] ?? ''), 200);
$phone = sanitizeField((string)($data['phone'] ?? ''), 50);
$preferredContactMethod = sanitizeField(
    (string)($data['preferredContactMethod'] ?? $data['contactMethod'] ?? ''),
    50
);
$selectedService = sanitizeField((string)($data['selectedService'] ?? ''), 200);
$selectedServiceId = sanitizeField((string)($data['selectedServiceId'] ?? ''), 100);
$otherService = sanitizeField((string)($data['otherService'] ?? ''), 300);
$preferredDateTime = sanitizeField((string)($data['preferredDateTime'] ?? ''), 300);
$address = sanitizeField((string)($data['address'] ?? ''), 300);
$subject = sanitizeField((string)($data['subject'] ?? ''), 200);
$message = sanitizeMessage((string)($data['message'] ?? ''));
$language = sanitizeField((string)($data['language'] ?? 'de'), 10);
$source = sanitizeField((string)($data['source'] ?? 'contact_form'), 50);
$appointmentRequest = !empty($data['appointmentRequest']);

if ($selectedService === '' && $selectedServiceId !== '') {
    $selectedService = $selectedServiceId;
}

$errors = [];

if ($name === '') {
    $errors[] = 'name';
}
if (!isValidEmail($email)) {
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

require_once __DIR__ . '/send-mail.php';

$recipient = getInquiryRecipient();

$sourceLabel = $source === 'vera_assistant' ? 'Vera Assistant' : 'Contact Form';
$appointmentLabel = $appointmentRequest ? 'Ja / Yes' : 'Nein / No';

$contactMethodLabels = [
    'email' => 'E-Mail / Email',
    'phone' => 'Telefon / Phone',
    'whatsapp' => 'WhatsApp',
    'noPreference' => 'Keine Präferenz / No preference',
];
$contactMethodLabel = $contactMethodLabels[$preferredContactMethod] ?? $preferredContactMethod;

$emailSubject = $subject !== ''
    ? 'Anfrage: ' . $selectedService . ' — vera-mountney.de'
    : 'Neue Anfrage: ' . $selectedService . ' — vera-mountney.de';

require_once __DIR__ . '/format-email.php';

$rows = [
    'Name' => $name,
    'E-Mail' => $email,
    'Telefon / Phone' => displayValue($phone),
    'Kontaktart / Contact' => $contactMethodLabel,
    'Leistung / Service' => $selectedService,
    'Sonstige Leistung / Other' => displayValue($otherService),
    'Wunschtermin / Preferred time' => displayValue($preferredDateTime),
    'Adresse / Address' => displayValue($address),
    'Terminwunsch / Appointment' => $appointmentLabel,
    'Sprache / Language' => strtoupper($language),
    'Betreff / Subject' => displayValue($subject),
];

$footer = 'Eingegangen am ' . date('d.m.Y, H:i') . ' Uhr · vera-mountney.de';
$plainBody = buildInquiryPlainText($rows, $message, $footer);
$htmlBody = buildInquiryHtml($rows, $message, $footer, $sourceLabel);

$mailResult = sendInquiryEmail(
    $recipient,
    encodeSubject($emailSubject),
    $plainBody,
    $email,
    $name,
    $htmlBody
);

$sent = $mailResult['sent'];

$backupPayload = [
    'savedAt' => date('c'),
    'mailSent' => $sent,
    'mailMethod' => $mailResult['method'],
    'mailHost' => $mailResult['host'] ?? null,
    'mailError' => $mailResult['error'],
    'recipient' => $recipient,
    'data' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'preferredContactMethod' => $preferredContactMethod,
        'selectedService' => $selectedService,
        'selectedServiceId' => $selectedServiceId,
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

$backupSaved = saveInquiryBackup($backupPayload);

if (!$sent) {
    if ($backupSaved) {
        echo json_encode(['success' => true, 'saved' => true]);
        exit;
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Email could not be sent',
    ]);
    exit;
}

echo json_encode(['success' => true]);
