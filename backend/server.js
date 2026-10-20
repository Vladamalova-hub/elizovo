require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const sourcesRoutes = require('./routes/sources');
const parserService = require('./services/parserService');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB подключена'))
.catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/sources', sourcesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cron job - парсинг каждые 30 минут
cron.schedule('*/30 * * * *', async () => {
  console.log('🔄 Запуск автоматического парсинга...');
  try {
    await parserService.parseAllSources();
    console.log('✅ Парсинг завершён');
  } catch (error) {
    console.error('❌ Ошибка парсинга:', error);
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 Режим: ${process.env.NODE_ENV || 'development'}`);
  
  // Первый парсинг при запуске
  parserService.parseAllSources().catch(err => {
    console.error('❌ Ошибка первичного парсинга:', err);
  });
});
