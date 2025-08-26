# 🚀 Настройка GitHub Pages для сайта "Трактир Старая Школа"

Пошаговая инструкция по развертыванию сайта на GitHub Pages.

## 📋 Предварительные требования

- GitHub аккаунт
- Репозиторий с файлами сайта
- Базовые знания Git

## 🔧 Пошаговая настройка

### 1. Создание репозитория

1. **Перейдите на GitHub** и создайте новый репозиторий
2. **Название**: `staraya-shkola` или любое другое
3. **Описание**: "Сайт-визитка бара Трактир Старая Школа"
4. **Тип**: Public (для бесплатного хостинга)
5. **Инициализация**: Не добавляйте README, .gitignore или лицензию

### 2. Загрузка файлов

#### Вариант A: Через веб-интерфейс GitHub

1. **Перейдите в созданный репозиторий**
2. **Нажмите "Add file" → "Upload files"**
3. **Перетащите все файлы сайта** в область загрузки:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `sw.js`
   - `site.webmanifest`
   - `robots.txt`
   - `sitemap.xml`
   - `.htaccess`
   - `README.md`
4. **Добавьте commit message**: "Initial commit: сайт-визитка бара"
5. **Нажмите "Commit changes"**

#### Вариант B: Через Git (рекомендуется)

```bash
# Клонируйте репозиторий
git clone https://github.com/username/staraya-shkola.git
cd staraya-shkola

# Скопируйте все файлы сайта в папку
# Затем добавьте и закоммитьте
git add .
git commit -m "Initial commit: сайт-визитка бара"
git push origin main
```

### 3. Настройка GitHub Pages

1. **Перейдите в Settings** вашего репозитория
2. **В левом меню выберите "Pages"**
3. **В разделе "Source" выберите "Deploy from a branch"**
4. **Выберите ветку**: `main` (или `master`)
5. **Выберите папку**: `/ (root)`
6. **Нажмите "Save"**

### 4. Ожидание развертывания

- **Статус**: GitHub покажет "Your site is being built"
- **Время**: Обычно 2-5 минут
- **Результат**: "Your site is published at https://username.github.io/staraya-shkola/"

## 🌐 Настройка кастомного домена (опционально)

### 1. Покупка домена

- **Рекомендуемые регистраторы**: REG.RU, RU-CENTER, Namecheap
- **Домен**: `staraya-shkola.ru` или похожий

### 2. Настройка DNS

Добавьте в настройки домена:

```
Тип: CNAME
Имя: @
Значение: username.github.io
TTL: 3600
```

### 3. Настройка в GitHub

1. **В Settings → Pages** добавьте ваш домен в поле "Custom domain"
2. **Поставьте галочку "Enforce HTTPS"**
3. **Нажмите "Save"**

### 4. Создание CNAME файла

Создайте файл `CNAME` в корне репозитория:

```
staraya-shkola.ru
```

## 🔄 Автоматическое обновление

### Настройка GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📱 Настройка PWA

### 1. Обновление манифеста

В файле `site.webmanifest` замените:

```json
{
  "name": "Трактир Старая Школа",
  "short_name": "Старая Школа",
  "start_url": "https://staraya-shkola.ru/",
  "scope": "https://staraya-shkola.ru/"
}
```

### 2. Добавление иконок

Создайте и добавьте иконки разных размеров:
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

## 🔍 SEO оптимизация

### 1. Обновление мета-тегов

В `index.html` замените:

```html
<meta property="og:url" content="https://staraya-shkola.ru">
<meta property="og:image" content="https://staraya-shkola.ru/images/restaurant.jpg">
<link rel="canonical" href="https://staraya-shkola.ru">
```

### 2. Обновление sitemap

В `sitemap.xml` замените все URL на ваш домен.

### 3. Обновление robots.txt

В `robots.txt` замените:

```
Sitemap: https://staraya-shkola.ru/sitemap.xml
```

## 📊 Аналитика и метрики

### 1. Google Analytics

Добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Yandex.Metrika

Добавьте в `index.html`:

```html
<!-- Yandex.Metrika -->
<script type="text/javascript">
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  ym(YOUR_METRIKA_ID, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true
  });
</script>
```

## 🧪 Тестирование

### 1. Проверка функциональности

- [ ] Главная страница загружается
- [ ] Навигация работает
- [ ] Меню отображается корректно
- [ ] Форма бронирования работает
- [ ] Адаптивность на разных устройствах

### 2. Проверка производительности

- [ ] **Lighthouse**: Проверьте в Chrome DevTools
- [ ] **PageSpeed Insights**: Google
- [ **Yandex.Webmaster**: Проверьте скорость

### 3. Проверка SEO

- [ ] **Google Search Console**: Добавьте сайт
- [ ] **Yandex.Webmaster**: Добавьте сайт
- [ ] **robots.txt**: Доступен по `/robots.txt`
- [ ] **sitemap.xml**: Доступен по `/sitemap.xml`

## 🚨 Решение проблем

### Сайт не загружается

1. **Проверьте статус развертывания** в Settings → Pages
2. **Проверьте ветку** - должна быть `main` или `master`
3. **Подождите 5-10 минут** после push

### PWA не работает

1. **Проверьте HTTPS** - обязательно для PWA
2. **Проверьте манифест** - должен быть доступен
3. **Проверьте Service Worker** - должен регистрироваться

### SEO проблемы

1. **Проверьте мета-теги** в исходном коде
2. **Проверьте robots.txt** и sitemap.xml
3. **Добавьте сайт в поисковые системы**

## 📈 Мониторинг и поддержка

### 1. Регулярные проверки

- **Еженедельно**: Проверяйте работоспособность
- **Ежемесячно**: Обновляйте контент
- **Ежеквартально**: Проверяйте производительность

### 2. Обновления

```bash
# Обновление сайта
git add .
git commit -m "Обновление контента"
git push origin main
```

### 3. Резервное копирование

- **GitHub**: Автоматическое резервное копирование
- **Локально**: Регулярно клонируйте репозиторий

## 🎯 Дополнительные возможности

### 1. Интеграция с внешними сервисами

- **Google My Business**: Для локального SEO
- **Яндекс.Справочник**: Для российских пользователей
- **Социальные сети**: VK, Instagram, Telegram

### 2. Автоматизация

- **GitHub Actions**: Автоматическое развертывание
- **Webhooks**: Уведомления об изменениях
- **CI/CD**: Автоматическое тестирование

## 📞 Поддержка

Если возникли проблемы:

1. **Проверьте документацию** GitHub Pages
2. **Создайте issue** в репозитории
3. **Обратитесь в поддержку** GitHub

---

**Успешного развертывания! 🚀**
