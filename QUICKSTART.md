# 🚀 Быстрый старт - Пошаговая инструкция

## Что вам нужно сделать (15-20 минут):

### 1️⃣ Получить MongoDB (5 минут)

1. Зайдите на https://www.mongodb.com/cloud/atlas/register
2. Зарегистрируйтесь (бесплатно)
3. Создайте кластер:
   - Выберите **M0 FREE**
   - Provider: AWS
   - Region: Frankfurt (ближе к России)
4. Создайте пользователя БД:
   - Database Access → Add New Database User
   - Username: `elizovo_admin`
   - Password: `придумайте_пароль`
   - Role: Read and write to any database
5. Разрешите доступ отовсюду:
   - Network Access → Add IP Address
   - Выберите: `0.0.0.0/0` (Allow Access from Anywhere)
6. Получите строку подключения:
   - Connect → Connect your application
   - Скопируйте строку (выглядит как: `mongodb+srv://elizovo_admin:<password>@cluster0.xxxxx.mongodb.net/`)
   - Замените `<password>` на ваш пароль

### 2️⃣ Получить VK API Token (5 минут)

1. Зайдите на https://vk.com/editapp?act=create
2. Создайте приложение:
   - Название: `Мониторинг Елизово`
   - Платформа: `Сайт`
   - Адрес сайта: `https://localhost` (можно потом изменить)
   - Базовый домен: `localhost`
3. После создания:
   - Перейдите в настройки приложения
   - Раздел "API"
   - Создайте ключ доступа (Service access token)
   - Скопируйте токен

### 3️⃣ Загрузить на GitHub (3 минуты)

```bash
# В папке проекта
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Создайте репозиторий на GitHub, затем:
git remote add origin https://github.com/ВАШ_USERNAME/elizovo-news.git
git push -u origin main
```

### 4️⃣ Деплой бэкенда на Render (5 минут)

1. Зайдите на https://render.com (войдите через GitHub)
2. Нажмите **New +** → **Web Service**
3. Подключите ваш репозиторий
4. Настройки:
   - **Name**: `elizovo-news-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

5. Добавьте переменные окружения (Environment):
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://elizovo_admin:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/elizovo-news
   JWT_SECRET=придумайте_очень_длинный_секретный_ключ_минимум_32_символа_123456789
   VK_TOKEN=ваш_vk_токен_из_шага_2
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=elizovo2024
   ```

6. Нажмите **Create Web Service**
7. Дождитесь деплоя (2-3 минуты)
8. Скопируйте URL вашего бэкенда (например: `https://elizovo-news-backend.onrender.com`)

### 5️⃣ Инициализация базы данных (1 минута)

1. На Render откройте ваш сервис
2. Перейдите во вкладку **Shell**
3. Выполните команду:
   ```bash
   node initDb.js
   ```
4. Должно появиться: "✅ Инициализация завершена!"

### 6️⃣ Деплой фронтенда на Netlify (3 минуты)

1. Зайдите на https://app.netlify.com (войдите через GitHub)
2. Нажмите **Add new site** → **Import an existing project**
3. Подключите ваш репозиторий
4. Настройки:
   - **Root directory**: `.` (оставьте как есть)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Добавьте переменную окружения:
   ```
   VITE_API_URL=https://ваш-бэкенд.onrender.com/api
   ```

6. Нажмите **Deploy site**
7. Дождитесь деплоя (1-2 минуты)

### 7️⃣ Готово! 🎉

Откройте URL вашего сайта на Netlify (например: `https://elizovo-news.netlify.app`)

Войдите:
- Логин: `admin`
- Пароль: `elizovo2024`

## ⚠️ Важные моменты

### Render Free Tier
- Бесплатный сервис "засыпает" после 15 минут неактивности
- Первый запрос может загружаться 30-50 секунд
- Это нормально для бесплатного тарифа

### MongoDB Atlas
- Бесплатный лимит: 512 MB
- Хватит на ~100,000 новостей
- Автоматические бэкапы

### Обновление данных
- Парсинг происходит автоматически каждые 30 минут
- При первом запуске загружаются все доступные новости
- Можно запустить вручную через Shell на Render

## 🔧 Если что-то не работает

### Ошибка подключения к MongoDB
- Проверьте, что IP `0.0.0.0/0` добавлен в Network Access
- Проверьте правильность строки подключения

### Ошибка VK API
- Проверьте валидность токена
- Убедитесь, что токен имеет права `wall` и `groups`

### Фронтенд не загружает новости
- Проверьте CORS настройки в бэкенде
- Убедитесь, что `FRONTEND_URL` правильно указан

### Парсинг не работает
- Откройте Shell на Render
- Выполните: `node -e "require('./services/parserService').parseAllSources().then(() => console.log('OK'))"`
- Смотрите логи

## 📊 Мониторинг

### Проверка работоспособности
```bash
curl https://ваш-бэкенд.onrender.com/health
```

Должно вернуть:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Просмотр логов
- На Render: вкладка **Logs**
- На Netlify: **Deploys** → **Deploy log**

## 💡 Следующие шаги

1. **Добавить уведомления** - отправлять важные новости в Telegram
2. **Расширить парсеры** - улучшить извлечение данных с сайтов
3. **Добавить поиск** - полнотекстовый поиск по всем новостям
4. **Экспорт** - выгрузка новостей в CSV/Excel
5. **Аналитика** - графики и статистика по источникам

---

**Удачи!** 🚀 Если возникнут вопросы - проверяйте логи и документацию в `backend/README.md`
