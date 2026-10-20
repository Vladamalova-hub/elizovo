const express = require('express');
const News = require('../models/News');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Получить все новости (с фильтрацией)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      sources, 
      keywords, 
      search, 
      sortBy = 'publishedAt',
      limit = 100,
      page = 1
    } = req.query;

    const query = {};

    // Фильтр по источникам
    if (sources) {
      const sourceArray = sources.split(',');
      query.source = { $in: sourceArray };
    }

    // Фильтр по ключевым словам
    if (keywords) {
      const keywordArray = keywords.split(',').map(k => k.toLowerCase());
      query.keywords = { $in: keywordArray };
    }

    // Поиск по тексту
    if (search) {
      query.$text = { $search: search };
    }

    // Сортировка
    const sort = sortBy === 'source' 
      ? { source: 1, publishedAt: -1 }
      : { publishedAt: -1 };

    const skip = (page - 1) * limit;

    const news = await News.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await News.countDocuments(query);

    res.json({
      news,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Ошибка получения новостей:', error);
    res.status(500).json({ error: 'Ошибка получения новостей' });
  }
});

// Получить одну новость по ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'Новость не найдена' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения новости' });
  }
});

// Получить статистику
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const stats = await News.aggregate([
      {
        $group: {
          _id: '$sourceType',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await News.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await News.countDocuments({ publishedAt: { $gte: today } });

    res.json({
      byType: stats.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
      total,
      today: todayCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения статистики' });
  }
});

module.exports = router;
