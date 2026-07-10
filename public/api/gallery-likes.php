<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/gallery-likes.json';

$defaults = [
    'appreciation' => 164,
    'bremen' => 218,
    'career' => 247,
    'classroom' => 136,
    'communication' => 201,
    'travel' => 189,
];

function readLikes(string $path, array $defaults): array
{
    if (!is_readable($path)) {
        return $defaults;
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        return $defaults;
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return $defaults;
    }

    $merged = $defaults;
    foreach ($defaults as $key => $value) {
        if (isset($decoded[$key]) && is_numeric($decoded[$key])) {
            $merged[$key] = max((int) $decoded[$key], (int) $value);
        }
    }

    return $merged;
}

function writeLikes(string $path, array $likes): bool
{
    $json = json_encode($likes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }

    return file_put_contents($path, $json . "\n", LOCK_EX) !== false;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => true,
        'likes' => readLikes($dataFile, $defaults),
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input') ?: '', true);
    $imageId = is_array($input) ? trim((string) ($input['imageId'] ?? '')) : '';

    if ($imageId === '' || !array_key_exists($imageId, $defaults)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid image id']);
        exit;
    }

    $likes = readLikes($dataFile, $defaults);
    $likes[$imageId] = (int) $likes[$imageId] + 1;

    if (!writeLikes($dataFile, $likes)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Could not save likes']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'imageId' => $imageId,
        'likes' => $likes[$imageId],
        'all' => $likes,
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
