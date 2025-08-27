# Устранение неполадок с Telegram ботом

## Проблема: Бот не отправляет сообщения

### Шаг 1: Активация бота
1. Найдите вашего бота @oldscru_bot в Telegram
2. Нажмите кнопку "Start" или отправьте команду `/start`
3. Бот должен ответить приветственным сообщением

### Шаг 2: Проверка настроек
1. Откройте файл `test_telegram.php` в браузере
2. Проверьте, что бот отвечает на команду `/getMe`
3. Убедитесь, что cURL работает на сервере

### Шаг 3: Проверка логов
После отправки формы проверьте логи сервера:
- Apache: `/var/log/apache2/error.log`
- Nginx: `/var/log/nginx/error.log`
- Или используйте `error_log()` в PHP

### Шаг 4: Альтернативные способы отправки

#### Вариант 1: file_get_contents
```php
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($telegram_data)
    ]
]);

$response = file_get_contents($telegram_url, false, $context);
```

#### Вариант 2: fsockopen
```php
$parsed_url = parse_url($telegram_url);
$fp = fsockopen('ssl://' . $parsed_url['host'], 443, $errno, $errstr, 30);

if (!$fp) {
    error_log("Ошибка соединения: $errstr ($errno)");
} else {
    $post_data = http_build_query($telegram_data);
    $request = "POST {$parsed_url['path']} HTTP/1.1\r\n";
    $request .= "Host: {$parsed_url['host']}\r\n";
    $request .= "Content-Type: application/x-www-form-urlencoded\r\n";
    $request .= "Content-Length: " . strlen($post_data) . "\r\n";
    $request .= "Connection: close\r\n\r\n";
    $request .= $post_data;
    
    fwrite($fp, $request);
    $response = '';
    while (!feof($fp)) {
        $response .= fgets($fp, 128);
    }
    fclose($fp);
}
```

### Шаг 5: Проверка блокировки
1. Убедитесь, что сервер не заблокирован файрволом
2. Проверьте, что исходящие HTTPS соединения разрешены
3. Убедитесь, что порт 443 открыт

### Шаг 6: Тестирование вручную
Откройте в браузере:
```
https://api.telegram.org/bot8275768497:AAFRLQcK7PJseN3YYJEtW5Afk5LuupJxjWc/getMe
```

Должен вернуться JSON с информацией о боте.

### Шаг 7: Проверка Chat ID
1. Убедитесь, что Chat ID правильный
2. Попробуйте отправить тестовое сообщение через браузер:
```
https://api.telegram.org/bot8275768497:AAFRLQcK7PJseN3YYJEtW5Afk5LuupJxjWc/sendMessage?chat_id=873320985&text=Тест
```

## Частые ошибки

### Ошибка 400: Bad Request
- Неправильный Chat ID
- Неправильный формат сообщения
- Бот заблокирован пользователем

### Ошибка 403: Forbidden
- Бот заблокирован
- Неправильный токен

### Ошибка 429: Too Many Requests
- Слишком много запросов
- Подождите и попробуйте снова

## Контакты для поддержки
- Telegram Bot API: https://core.telegram.org/bots/api
- @BotFather для настройки бота
- Логи сервера для диагностики
