const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../models/News');
const Source = require('../models/Source');

// Ключевые слова для фильтрации
const KEYWORDS = [
  'елизово', 'елизовский', 'емо', 'емр', 'елизове', 'елизова',
  'сокочи', 'нагорный', 'раздольный', 'николаевка',
  'сосновка', 'пионерский', 'светлый', 'крутоберековый', 'вулканный',
  'ганалы', 'дальний', 'малки', 'начики', 'паратунка', 'термальный',
  'коряки', 'северные коряки', 'зеленый', 'новый', 'красный',
  'двуречье', 'керкино', 'пиначево', 'лесной', 'березняки', 'южные коряки'
];

class ParserService {
  // Проверка текста на наличие ключевых слов
  findKeywords(text) {
    const lowerText = text.toLowerCase();
    return KEYWORDS.filter(keyword => lowerText.includes(keyword));
  }

  // Парсинг всех источников
  async parseAllSources() {
    const sources = await Source.find({ active: true });
    
    for (const source of sources) {
      try {
        console.log(`🔍 Парсинг: ${source.name} (${source.type})`);
        
        let news = [];
        switch (source.type) {
          case 'website':
            news = await this.parseWebsite(source);
            break;
          case 'telegram':
            news = await this.parseTelegram(source);
            break;
          case 'vk':
            news = await this.parseVK(source);
            break;
          case 'max':
            news = await this.parseMax(source);
            break;
        }

        // Сохранение новостей
        for (const item of news) {
          await this.saveNews(item, source);
        }

        // Обновление времени последнего парсинга
        await Source.findByIdAndUpdate(source._id, { lastParsed: new Date() });
        
        console.log(`✅ ${source.name}: найдено ${news.length} новостей`);
      } catch (error) {
        console.error(`❌ Ошибка парсинга ${source.name}:`, error.message);
      }
    }
  }

  // Парсинг сайтов
  async parseWebsite(source) {
    try {
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const news = [];

      // Универсальный парсер для разных сайтов
      // Каждый сайт имеет свою структуру, поэтому нужны адаптеры
      const articles = $('article, .news-item, .post, .entry').slice(0, 20);

      articles.each((i, elem) => {
        const title = $(elem).find('h1, h2, h3, .title, .entry-title').first().text().trim();
        const content = $(elem).find('p, .content, .excerpt').first().text().trim();
        const link = $(elem).find('a').first().attr('href');
        const date = $(elem).find('time, .date, .published').first().attr('datetime') || 
                     $(elem).find('time, .date, .published').first().text();

        if (title && content) {
          const fullUrl = link ? new URL(link, source.url).href : source.url;
          const keywords = this.findKeywords(title + ' ' + content);

          if (keywords.length > 0) {
            news.push({
              title,
              content: content.substring(0, 500),
              url: fullUrl,
              keywords,
              publishedAt: date ? new Date(date) : new Date()
            });
          }
        }
      });

      return news;
    } catch (error) {
      console.error(`Ошибка парсинга сайта ${source.url}:`, error.message);
      return [];
    }
  }

  // Парсинг Telegram (через публичный API или scraping)
  async parseTelegram(source) {
    // Для Telegram нужен бот или API
    // Здесь пример через scraping публичных каналов
    try {
      const channelUsername = source.url.replace('https://t.me/', '');
      const response = await axios.get(`https://t.me/s/${channelUsername}`, {
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const news = [];

      $('.tgme_widget_message').slice(0, 20).each((i, elem) => {
        const text = $(elem).find('.tgme_widget_message_text').text().trim();
        const date = $(elem).find('time').attr('datetime');
        const link = $(elem).find('a.tgme_widget_message_date').attr('href');

        if (text) {
          const keywords = this.findKeywords(text);
          if (keywords.length > 0) {
            news.push({
              title: text.substring(0, 100) + '...',
              content: text,
              url: link || source.url,
              keywords,
              publishedAt: date ? new Date(date) : new Date()
            });
          }
        }
      });

      return news;
    } catch (error) {
      console.error(`Ошибка парсинга Telegram ${source.url}:`, error.message);
      return [];
    }
  }

  // Парсинг VK (нужен API токен)
  async parseVK(source) {
    if (!process.env.VK_TOKEN) {
      console.warn('VK_TOKEN не указан, пропускаем VK');
      return [];
    }

    try {
      // Извлечение ID группы из URL
      const groupId = source.url.split('/').pop();
      
      const response = await axios.get('https://api.vk.com/method/wall.get', {
        params: {
          domain: groupId,
          count: 20,
          access_token: process.env.VK_TOKEN,
          v: '5.131'
        }
      });

      const news = [];
      const posts = response.data.response?.items || [];

      for (const post of posts) {
        const text = post.text || '';
        if (text) {
          const keywords = this.findKeywords(text);
          if (keywords.length > 0) {
            news.push({
              title: text.substring(0, 100) + '...',
              content: text,
              url: `https://vk.com/wall-${groupId}_${post.id}`,
              keywords,
              publishedAt: new Date(post.date * 1000)
            });
          }
        }
      }

      return news;
    } catch (error) {
      console.error(`Ошибка парсинга VK ${source.url}:`, error.message);
      return [];
    }
  }

  // Парсинг Max (бывш. Mail.ru)
  async parseMax(source) {
    // Max не имеет публичного API, используем scraping
    try {
      const response = await axios.get(source.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const news = [];

      // Адаптер для структуры Max
      $('.post, .article, .news-item').slice(0, 20).each((i, elem) => {
        const title = $(elem).find('h1, h2, h3, .title').first().text().trim();
        const content = $(elem).find('p, .text, .content').first().text().trim();
        const link = $(elem).find('a').first().attr('href');

        if (title && content) {
          const keywords = this.findKeywords(title + ' ' + content);
          if (keywords.length > 0) {
            news.push({
              title,
              content: content.substring(0, 500),
              url: link ? new URL(link, source.url).href : source.url,
              keywords,
              publishedAt: new Date()
            });
          }
        }
      });

      return news;
    } catch (error) {
      console.error(`Ошибка парсинга Max ${source.url}:`, error.message);
      return [];
    }
  }

  // Сохранение новости в базу
  async saveNews(item, source) {
    try {
      // Проверка на дубликаты
      const existing = await News.findOne({ url: item.url });
      if (existing) {
        return;
      }

      const news = new News({
        title: item.title,
        content: item.content,
        source: source.name,
        sourceUrl: source.url,
        sourceType: source.type,
        url: item.url,
        keywords: item.keywords,
        publishedAt: item.publishedAt || new Date()
      });

      await news.save();
    } catch (error) {
      if (error.code !== 11000) { // Игнорируем дубликаты
        console.error('Ошибка сохранения новости:', error.message);
      }
    }
  }
}

module.exports = new ParserService();
