<?php
// Настройки Telegram Bot
$bot_token = '8275768497:AAFRLQcK7PJseN3YYJEtW5Afk5LuupJxjWc'; // Токен вашего бота
$chat_id = '873320985'; // Chat ID Сергея Андреевича

// Получаем данные из формы
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$date = $_POST['date'] ?? '';
$time = $_POST['time'] ?? '';
$guests = $_POST['guests'] ?? '';
$message = $_POST['message'] ?? '';

// Валидация данных
if (empty($name) || empty($phone) || empty($date) || empty($time) || empty($guests)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните все обязательные поля']);
    exit;
}

// Форматируем дату
$formatted_date = date('d.m.Y', strtotime($date));

// Формируем сообщение для персонала
$staff_message = "🆕 *НОВОЕ БРОНИРОВАНИЕ!*\n\n";
$staff_message .= "👤 *Имя:* $name\n";
$staff_message .= "📞 *Телефон:* $phone\n";
$staff_message .= "📅 *Дата:* $formatted_date\n";
$staff_message .= "🕐 *Время:* $time\n";
$staff_message .= "👥 *Гостей:* $guests\n";

if (!empty($message)) {
    $staff_message .= "💬 *Дополнительно:* $message\n";
}

$staff_message .= "\n⏰ *Получено:* " . date('d.m.Y H:i:s') . "\n";
$staff_message .= "🔗 *Источник:* Сайт";

// Отправляем уведомление в Telegram
$telegram_url = "https://api.telegram.org/bot{$bot_token}/sendMessage";
$telegram_data = [
    'chat_id' => $chat_id,
    'text' => $staff_message,
    'parse_mode' => 'Markdown',
    'disable_web_page_preview' => true
];

// Логируем данные для отладки
error_log("Telegram URL: " . $telegram_url);
error_log("Telegram Data: " . json_encode($telegram_data));

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

// Логируем результат
error_log("Telegram Response: " . $response);
error_log("Telegram HTTP Code: " . $http_code);
error_log("Telegram cURL Error: " . $curl_error);

curl_close($ch);

// Сохраняем бронирование в файл (для резервной копии)
$booking_data = [
    'timestamp' => time(),
    'name' => $name,
    'phone' => $phone,
    'date' => $date,
    'time' => $time,
    'guests' => $guests,
    'message' => $message,
    'telegram_sent' => $http_code === 200
];

$bookings_file = 'bookings.json';
$bookings = [];
if (file_exists($bookings_file)) {
    $bookings = json_decode(file_get_contents($bookings_file), true) ?? [];
}
$bookings[] = $booking_data;
file_put_contents($bookings_file, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Отправляем ответ клиенту
if ($http_code === 200) {
    echo json_encode([
        'success' => true, 
        'message' => 'Столик успешно забронирован! Мы свяжемся с вами для подтверждения.'
    ]);
} else {
    echo json_encode([
        'success' => true, 
        'message' => 'Столик забронирован! Мы свяжемся с вами для подтверждения.'
    ]);
    
    // Логируем ошибку отправки в Telegram
    error_log("Telegram notification failed for booking: " . json_encode($booking_data));
}
?>
