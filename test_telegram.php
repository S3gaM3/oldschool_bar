<?php
// Тестовый файл для проверки Telegram бота
$bot_token = '8275768497:AAFRLQcK7PJseN3YYJEtW5Afk5LuupJxjWc';
$chat_id = '873320985';

echo "<h2>Тестирование Telegram бота</h2>";

// Проверяем информацию о боте
$bot_info_url = "https://api.telegram.org/bot{$bot_token}/getMe";
$bot_info = file_get_contents($bot_info_url);

echo "<h3>Информация о боте:</h3>";
echo "<pre>" . htmlspecialchars($bot_info) . "</pre>";

// Отправляем тестовое сообщение
$test_message = "🧪 *ТЕСТОВОЕ СООБЩЕНИЕ!*\n\nЭто тестовая отправка от бота Трактир Старая Школа.\n\n⏰ Время: " . date('d.m.Y H:i:s');

$telegram_url = "https://api.telegram.org/bot{$bot_token}/sendMessage";
$telegram_data = [
    'chat_id' => $chat_id,
    'text' => $test_message,
    'parse_mode' => 'Markdown',
    'disable_web_page_preview' => true
];

echo "<h3>Отправка тестового сообщения:</h3>";
echo "<p>URL: " . htmlspecialchars($telegram_url) . "</p>";
echo "<p>Данные: " . htmlspecialchars(json_encode($telegram_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) . "</p>";

// Отправляем через cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegram_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $telegram_data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

echo "<h3>Результат отправки:</h3>";
echo "<p>HTTP код: " . $http_code . "</p>";
echo "<p>cURL ошибка: " . ($curl_error ?: 'Нет') . "</p>";
echo "<p>Ответ Telegram:</p>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

curl_close($ch);

// Проверяем, поддерживает ли сервер cURL
echo "<h3>Проверка cURL:</h3>";
if (function_exists('curl_version')) {
    $curl_info = curl_version();
    echo "<p>cURL версия: " . $curl_info['version'] . "</p>";
    echo "<p>SSL версия: " . $curl_info['ssl_version'] . "</p>";
} else {
    echo "<p style='color: red;'>cURL не поддерживается!</p>";
}

// Проверяем, поддерживает ли сервер file_get_contents для внешних URL
echo "<h3>Проверка file_get_contents:</h3>";
if (ini_get('allow_url_fopen')) {
    echo "<p style='color: green;'>allow_url_fopen включен</p>";
} else {
    echo "<p style='color: red;'>allow_url_fopen отключен</p>";
}
?>
