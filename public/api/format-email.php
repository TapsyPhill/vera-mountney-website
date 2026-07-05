<?php
declare(strict_types=1);

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function displayValue(string $value, string $fallback = '—'): string
{
    $trimmed = trim($value);
    return $trimmed !== '' ? $trimmed : $fallback;
}

/**
 * @param array<string, string> $rows
 */
function buildInquiryPlainText(array $rows, string $message, string $footer): string
{
    $lines = ['Neue Anfrage — vera-mountney.de', str_repeat('=', 40), ''];

    foreach ($rows as $label => $value) {
        $lines[] = $label;
        $lines[] = $value;
        $lines[] = '';
    }

    $lines[] = 'Nachricht / Message';
    $lines[] = str_repeat('-', 24);
    $lines[] = $message;
    $lines[] = '';
    $lines[] = $footer;

    return implode("\n", $lines);
}

/**
 * @param array<string, string> $rows
 */
function buildInquiryHtml(array $rows, string $message, string $footer, string $sourceLabel): string
{
    $rowHtml = '';
    foreach ($rows as $label => $value) {
        $rowHtml .= '
        <tr>
          <td style="padding:10px 16px 4px;font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7c6a9a;">'
            . escapeHtml($label) .
          '</td>
        </tr>
        <tr>
          <td style="padding:0 16px 14px;font-size:15px;line-height:1.5;color:#2e1065;">'
            . nl2br(escapeHtml($value)) .
          '</td>
        </tr>';
    }

    return '<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Anfrage</title>
</head>
<body style="margin:0;padding:0;background:#f3f0ff;font-family:Arial,Helvetica,sans-serif;color:#2e1065;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0ff;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ddd6fe;box-shadow:0 8px 30px rgba(46,16,101,0.08);">
          <tr>
            <td style="padding:28px 24px 20px;background:linear-gradient(135deg,#4c1d95,#6d28d9);color:#ffffff;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">vera-mountney.de</p>
              <h1 style="margin:0;font-size:24px;line-height:1.2;font-family:Georgia,\'Times New Roman\',serif;">Neue Anfrage</h1>
              <p style="margin:10px 0 0;font-size:14px;opacity:0.92;">Quelle: ' . escapeHtml($sourceLabel) . '</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">' . $rowHtml . '</table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#7c6a9a;">Nachricht / Message</p>
              <div style="padding:16px;border-radius:12px;background:#f8f5ff;border:1px solid #e9e0ff;font-size:15px;line-height:1.6;color:#2e1065;white-space:pre-wrap;">'
                . escapeHtml($message) .
              '</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;font-size:12px;line-height:1.6;color:#6b5f80;">'
              . escapeHtml($footer) .
            '</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}
