# 📡 Мониторинг новостей Елизовского округа

Полноценное веб-приложение для мониторинга новостей из различных источников (сайты, Telegram, VK, Max) с фильтрацией по ключевым словам.

## 🎯 Возможности

- ✅ Сбор новостей из 28+ источников
- ✅ Фильтрация по 32 ключевым словам (Елизово, Паратунка, Начики и др.)
- ✅ Автоматический парсинг каждые 30 минут
- ✅ Авторизация через логин/пароль
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Бесплатный хостинг на Render + Netlify

## 🏗️ Структура проекта

```
elizovo-news/
├── backend/          # Node.js + Express сервер
│   ├── models/       # MongoDB модели
│   ├── routes/       # API endpoints
│   ├── services/     # Парсеры для источников
│   └── server.js     # Главный сервер
└── src/              # React фронтенд
    ├── components/   # UI компоненты
    ├── services/     # API клиент
    └── App.tsx       # Главный компонент
```

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/elizovo-news.git
cd elizovo-news

# Установить зависимости фронтенда
npm install

# Установить зависимости бэкенда
cd backend
npm install
```

### 2. Настройка бэкенда

```bash
cd backend

# Создать .env файл
cp .env.example .env

# Отредактировать .env и заполнить:
# - MONGODB_URI (получить на MongoDB Atlas)
# - JWT_SECRET (придумать сложный пароль)
# - VK_TOKEN (получить на vk.com/dev)
# - ADMIN_USERNAME и ADMIN_PASSWORD

# Инициализировать базу данных
node initDb.js
```

### 3. Настройка фронтенда

```bash
# В корне проекта
cp .env.example .env

# Отредактировать .env:
# VITE_API_URL=http://localhost:3001/api (для локальной разработки)
# или
# VITE_API_URL=https://ваш-бэкенд.onrender.com/api (для продакшена)
```

### 4. Запуск локально

**Терминал 1 - Бэкенд:**
```bash
cd backend
npm run dev
```

**Терминал 2 - Фронтенд:**
```bash
npm run dev
```

Откройте http://localhost:5173

Войдите с данными из `.env` (по умолчанию: admin / elizovo2024)

## 🌐 Деплой на Render + Netlify

### Вариант 1: Render (бэкенд) + Netlify (фронтенд)

#### Шаг 1: MongoDB Atlas (бесплатно)

1. Зарегистрируйтесь на [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте бесплатный кластер (M0)
3. Создайте пользователя базы данных
4. Network Access → Add IP Address → `0.0.0.0/0`
5. Скопируйте **Connection String**

#### Шаг 2: Деплой бэкенда на Render

1. Загрузите проект на GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/elizovo-news.git
git push -u origin main
```

2. На [render.com](https://render.com):
   - New + → Web Service
   - Connect your GitHub repo
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

3. Добавьте Environment Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elizovo-news
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
VK_TOKEN=ваш_vk_токен
FRONTEND_URL=https://ваш-фронтенд.netlify.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=elizovo2024
```

4. Deploy!

5. После деплоя откройте Shell и выполните:
```bash
node initDb.js
```

#### Шаг 3: Деплой фронтенда на Netlify

1. На [netlify.com](https://netlify.com):
   - Add new site → Import an existing project
   - Connect GitHub repo
   - **Root directory**: `.` (корень)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

2. Добавьте Environment Variable:
```
VITE_API_URL=https://ваш-бэкенд.onrender.com/api
```

3. Deploy!

### Вариант 2: Всё на Render

#### Бэкенд (Web Service)
- См. Шаг 2 выше

#### Фронтенд (Static Site)

1. На Render:
   - New + → Static Site
   - Connect GitHub repo
   - **Root Directory**: `.`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

2. Environment Variables:
```
VITE_API_URL=https://ваш-бэкенд.onrender.com/api
```

## 🔑 Получение API ключей

### VK API Token

1. [vk.com/dev](https://vk.com/dev) → Создать приложение
2. Платформа: "Сайт"
3. Адрес сайта: `https://ваш-сайт.netlify.app`
4. Получите **Service access token**

Права: `wall`, `groups`

### Telegram (опционально)

Для базового парсинга токен не нужен (используется scraping публичных каналов).

Для продвинутого парсинга:
1. [@BotFather](https://t.me/BotFather) → `/newbot` → получите токен
2. [my.telegram.org](https://my.telegram.org) → API development tools → получите api_id и api_hash

### MongoDB Atlas

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Register
2. Create Cluster → M0 Free
3. Database Access → Add New User
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Connect your application → Copy connection string

## 📡 API Endpoints

### Авторизация

```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "elizovo2024"
}

Ответ:
{
  "token": "jwt_token",
  "username": "admin"
}
```

### Новости

```bash
GET /api/news?sources=s1,s2&keywords=елизово,паратунка&search=дороги&sortBy=publishedAt

Headers:
Authorization: Bearer YOUR_TOKEN
```

### Источники

```bash
GET /api/sources
POST /api/sources (требует авторизации)
DELETE /api/sources/:id (требует авторизации)
```

## 🔄 Как работает парсинг

1. **Автоматически**: каждые 30 минут (cron job)
2. **При запуске**: первичный парсинг
3. **Фильтрация**: сохраняются только новости с ключевыми словами
4. **Дедупликация**: проверка по URL

### Парсеры

- **Сайты**: Cheerio (HTML parsing)
- **Telegram**: scraping через `t.me/s/channel`
- **VK**: официальный API
- **Max**: scraping (нет API)

## 🎨 Ключевые слова

Елизово, Елизовский, ЕМО, ЕМР, Сокочи, Нагорный, Раздольный, Николаевка, Сосновка, Пионерский, Светлый, Крутоберековый, Вулканный, Ганалы, Дальний, Малки, Начики, Паратунка, Термальный, Коряки, Двуречье, Керкино, Пиначево, Лесной, Березняки и др.

Изменить можно в `backend/services/parserService.js`

## 🐛 Отладка

### Проверка бэкенда

```bash
curl https://ваш-бэкенд.onrender.com/health
# Должно вернуть: {"status":"ok","timestamp":"..."}
```

### Логи на Render

1. Откройте сервис на Render
2. Вкладка "Logs"
3. Смотрите вывод в реальном времени

### Ручной запуск парсинга

Добавьте в `backend/server.js`:

```javascript
app.post('/api/parse', authMiddleware, async (req, res) => {
  await parserService.parseAllSources();
  res.json({ message: 'Парсинг запущен' });
});
```

Затем:
```bash
curl -X POST https://ваш-бэкенд.onrender.com/api/parse \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💰 Стоимость

- **Render Free Tier**: 750 часов/месяц
- **MongoDB Atlas Free**: 512 MB
- **Netlify Free**: 100 GB bandwidth
- **Итого**: $0/месяц

## 🔧 Настройка

### Изменить интервал парсинга

В `backend/server.js`:
```javascript
// Каждые 15 минут
cron.schedule('*/15 * * * *', ...)

// Каждый час
cron.schedule('0 * * * *', ...)
```

### Добавить источник

Через API или в `backend/initDb.js`

### Изменить ключевые слова

В `backend/services/parserService.js` массив `KEYWORDS`

## 📝 Лицензия

MIT

## 🤝 Поддержка

При проблемах:
1. Проверьте логи на Render
2. Убедитесь, что все переменные окружения заполнены
3. Проверьте доступность MongoDB
4. Проверьте валидность API токенов

---

**Готово!** Теперь у вас есть полноценная система мониторинга новостей. 🎉
