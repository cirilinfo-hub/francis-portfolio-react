<?php
// Contact form endpoint for https://francisciril.com (Hostinger, PHP mail()).
// POST JSON { name, email, message, website? } -> { ok: true } | { ok: false, error }.
// `website` is a honeypot: real visitors never fill it.

declare(strict_types=1);

const MAIL_TO = 'francis_jeni@yahoo.com';
const MAIL_CC = 'no-reply@francisciril.com';
// Sender must be on our own domain so SPF/DKIM pass; the visitor goes in Reply-To.
const MAIL_FROM = 'no-reply@francisciril.com';
const MAIL_FROM_NAME = 'francisciril.com contact form';
const ALLOWED_HOSTS = ['francisciril.com', 'www.francisciril.com'];
const RATE_LIMIT = 5;          // messages per IP...
const RATE_WINDOW = 3600;      // ...per hour

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function fail(int $status, string $error): void
{
    reply($status, ['ok' => false, 'error' => $error]);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'Method not allowed.');
}

// Only accept posts from our own pages.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    if (!in_array($host, ALLOWED_HOSTS, true)) {
        fail(403, 'Forbidden.');
    }
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw === false ? '' : $raw, true);
if (!is_array($data)) {
    fail(400, 'The message could not be read. Try again.');
}

// Honeypot filled: pretend success so bots learn nothing.
if (trim((string)($data['website'] ?? '')) !== '') {
    reply(200, ['ok' => true]);
}

// Single-line fields: strip control characters (blocks header injection).
$oneLine = static fn($v): string => trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)$v) ?? '');
$name = $oneLine($data['name'] ?? '');
$email = $oneLine($data['email'] ?? '');
$message = trim(str_replace("\0", '', (string)($data['message'] ?? '')));

if ($name === '' || mb_strlen($name) > 100) {
    fail(422, 'Enter your name (up to 100 characters).');
}
if (mb_strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    fail(422, 'Enter a full email address, like name@company.com.');
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
    fail(422, 'Write a message between 10 and 5000 characters.');
}

// Per-IP rate limit, stored outside the web root.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$store = sys_get_temp_dir() . '/fc-contact-' . hash('sha256', $ip);
$now = time();
$hits = [];
if (is_file($store)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string)file_get_contents($store))),
        static fn(int $t): bool => $t > $now - RATE_WINDOW
    );
}
if (count($hits) >= RATE_LIMIT) {
    fail(429, 'Too many messages. Try again in an hour, or email me directly.');
}

$encode = static fn(string $s): string => '=?UTF-8?B?' . base64_encode($s) . '?=';
$subject = $encode('Portfolio message from ' . $name);
$body = "Name: {$name}\r\nEmail: {$email}\r\nSent: " . gmdate('Y-m-d H:i') . " UTC\r\n\r\n"
    . str_replace(["\r\n", "\r", "\n"], "\r\n", $message) . "\r\n";

$headers = implode("\r\n", [
    'From: ' . $encode(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . $encode($name) . ' <' . $email . '>',
    'Cc: ' . MAIL_CC,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: francisciril.com',
]);

$sent = mail(MAIL_TO, $subject, $body, $headers, '-f' . MAIL_FROM);
if (!$sent) {
    error_log('contact.php: mail() returned false');
    fail(502, 'The message could not be sent. Try again or email me.');
}

$hits[] = $now;
@file_put_contents($store, implode(',', $hits), LOCK_EX);

reply(200, ['ok' => true]);
