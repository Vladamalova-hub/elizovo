# 🚀 Бэкенд для мониторинга новостей Елизовского округа

Полноценный сервер на Node.js + Express для парсинга новостей из различных источников.

## 📋 Требования

- Node.js 18+
- MongoDB (бесплатно на MongoDB Atlas или Render)
- Аккаунт на Render.com для хостинга

## 🛠️ Локальная разработка

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните необходимые переменные (см. раздел "Получение API ключей").

### 3. Инициализация базы данных

```bash
node initDb.js
```

Это создаст:
- Администратора (логин/пароль из .env)
- Все источники мониторинга

### 4. Запуск сервера

**Для разработки:**
```bash
npm run dev
```

**Для продакшена:**
```bash
npm start
```

Сервер запустится на `http://localhost:3001`

## 🌐 Деплой на Render

### 1. Подготовка GitHub

```bash
# В корне проекта
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/elizovo-news.git
git push -u origin main
```

### 2. Создание MongoDB на Render

1. Зайдите на [render.com](https://render.com)
2. Нажмите "New +" → "MongoDB"
3. Выберите бесплатный план
4. Скопируйте **Connection String** (формат: `mongodb+srv://...`)

### 3. Деплой бэкенда

1. На Render нажмите "New +" → "Web Service"
2. Подключите ваш GitHub репозиторий
3. Настройки:
   - **Name**: `elizovo-news-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. Добавьте переменные окружения (Environment):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=придумайте_сложный_пароль_минимум_32_символа
   VK_TOKEN=ваш_vk_токен
   FRONTEND_URL=https://ваш-фронтенд.onrender.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=elizovo2024
   ```

5. Нажмите "Create Web Service"

### 4. Инициализация базы данных на Render

После деплоя откройте Shell в Render и выполните:

```bash
node initDb.js
```

## 🔑 Получение API ключей

### VK API Token

1. Зайдите на [vk.com/dev](https://vk.com/dev)
2. Создайте приложение:
   - Название: "Мониторинг новостей"
   - Платформа: "Сайт"
   - Адрес сайта: `https://ваш-сайт.onrender.com`
   - Базовый домен: `ваш-сайт.onrender.com`
3. В настройках приложения получите **Service access token**
4. Или создайте **Personal access token** через: https://vk.com/dev/implicit_flow_user

**Права доступа**: `wall`, `groups`

### Telegram Bot Token (опционально)

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте полученный токен

### Telegram API ID и Hash (для продвинутого парсинга)

1. Зайдите на [my.telegram.org](https://my.telegram.org)
2. Войдите по номеру телефона
3. Перейдите в "API development tools"
4. Создайте приложение
5. Скопируйте **api_id** и **api_hash**

### MongoDB Atlas (альтернатива Render MongoDB)

1. Зарегистрируйтесь на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте бесплатный кластер (M0)
3. Создайте пользователя базы данных
4. Добавьте IP адрес `0.0.0.0/0` (разрешить отовсюду)
5. Скопируйте Connection String

## 📡 API Endpoints

### Авторизация

**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "elizovo2024"
}
```

Ответ:
```json
{
  "token": "jwt_token_here",
  "username": "admin"
}
```

### Новости

**GET** `/api/news`

Параметры:
- `sources` - список источников через запятую
- `keywords` - ключевые слова через запятую
- `search` - поиск по тексту
- `sortBy` - `publishedAt` или `source`
- `limit` - количество (по умолчанию 100)
- `page` - номер страницы

Headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Источники

**GET** `/api/sources` - получить все источники

**POST** `/api/sources` - добавить источник (требует авторизации)

## 🔄 Как работает парсинг

1. **Автоматический парсинг**: каждые 30 минут (cron job)
2. **При запуске**: первичный парсинг всех источников
3. **Фильтрация**: только новости с ключевыми словами сохраняются
4. **Дедупликация**: проверка по URL для избежания дубликатов

### Парсеры

- **Сайты**: Cheerio (аналог jQuery для Node.js)
- **Telegram**: scraping публичных каналов через `t.me/s/`
- **VK**: официальный API через `vk-io`
- **Max**: scraping (нет официального API)

## 🐛 Отладка

### Проверка логов на Render

1. Откройте ваш сервис на Render
2. Перейдите во вкладку "Logs"
3. Смотрите вывод в реальном времени

### Ручной запуск парсинга

Добавьте endpoint для ручного запуска:

```javascript
// В server.js
app.post('/api/parse', authMiddleware, async (req, res) => {
  await parserService.parseAllSources();
  res.json({ message: 'Парсинг запущен' });
});
```

Затем выполните:
```bash
curl -X POST https://ваш-бэкенд.onrender.com/api/parse \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Мониторинг

### Статистика

**GET** `/api/news/stats/summary`

Ответ:
```json
{
  "byType": {
    "website": 45,
    "telegram": 32,
    "vk": 28,
    "max": 15
  },
  "total": 120,
  "today": 8
}
```

## 🔧 Настройка под свои нужды

### Добавление нового источника

Через API:
```bash
curl -X POST https://ваш-бэкенд.onrender.com/api/sources \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Новый источник",
    "url": "https://example.com",
    "type": "website",
    "category": "Другое"
  }'
```

### Изменение ключевых слов

Отредактируйте массив `KEYWORDS` в `services/parserService.js`

### Изменение интервала парсинга

В `server.js` измените cron выражение:
```javascript
// Каждые 15 минут
cron.schedule('*/15 * * * *', ...)

// Каждый час
cron.schedule('0 * * * *', ...)

// Каждый день в 9:00
cron.schedule('0 9 * * *', ...)
```

## 💰 Стоимость

- **Render Free Tier**: 750 часов/месяц бесплатно
- **MongoDB Atlas Free**: 512 MB бесплатно
- **Итого**: $0/месяц для небольших объёмов

## 📝 Лицензия

MIT

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи на Render
2. Убедитесь, что все переменные окружения заполнены
3. Проверьте доступность MongoDB
4. Проверьте валидность API токенов

---

**Готово!** Теперь у вас есть полноценный бэкенд для мониторинга новостей. 🎉
