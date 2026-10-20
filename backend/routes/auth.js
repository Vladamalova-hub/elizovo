const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Создание админа при первом запуске (если его нет)
router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Укажите логин и пароль' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const user = new User({ username, password });
    await user.save();

    res.json({ message: 'Администратор создан', username });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Укажите логин и пароль' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка авторизации' });
  }
});

// Проверка токена
router.get('/check', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, username: decoded.username });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

module.exports = router;
