const express = require('express');
const Source = require('../models/Source');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Получить все источники
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sources = await Source.find().sort({ type: 1, name: 1 });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения источников' });
  }
});

// Добавить источник (только для админа)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, url, type, category } = req.body;

    if (!name || !url || !type || !category) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }

    const existing = await Source.findOne({ url });
    if (existing) {
      return res.status(400).json({ error: 'Источник уже существует' });
    }

    const source = new Source({ name, url, type, category });
    await source.save();

    res.json(source);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка добавления источника' });
  }
});

// Обновить источник
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const source = await Source.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!source) {
      return res.status(404).json({ error: 'Источник не найден' });
    }

    res.json(source);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления источника' });
  }
});

// Удалить источник
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const source = await Source.findByIdAndDelete(req.params.id);

    if (!source) {
      return res.status(404).json({ error: 'Источник не найден' });
    }

    res.json({ message: 'Источник удалён' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления источника' });
  }
});

module.exports = router;
