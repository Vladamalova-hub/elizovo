require('dotenv').config();
const mongoose = require('mongoose');
const Source = require('./models/Source');
const User = require('./models/User');

const SOURCES = [
  // Сайты
  { name: 'KamchatInfo', url: 'https://kamchatinfo.com', type: 'website', category: 'СМИ Камчатки' },
  { name: 'KAM24', url: 'https://kam24.ru', type: 'website', category: 'СМИ Камчатки' },
  { name: 'KamToday', url: 'https://kamtoday.ru', type: 'website', category: 'СМИ Камчатки' },
  { name: 'Камчатский Край', url: 'https://kam-kray.ru', type: 'website', category: 'СМИ Камчатки' },
  { name: 'РИА Камчатка', url: 'https://ria.ru/location_Kamchatskijj_krajj/', type: 'website', category: 'Федеральные СМИ' },
  { name: 'Полуостров Камчатка', url: 'https://www.poluostrov-kamchatka.ru', type: 'website', category: 'СМИ Камчатки' },
  { name: 'Елизово БезФормата', url: 'https://elizovo.bezformata.com/', type: 'website', category: 'Елизово' },
  { name: 'Lenta.ru Елизово', url: 'https://lenta.ru/tags/geo/elizovo/', type: 'website', category: 'Федеральные СМИ' },
  { name: 'КамИнформ - Елизово', url: 'https://kaminform.online/news/segodnja-v-kamchatskom-krae/novosti-elizovo', type: 'website', category: 'Елизово' },
  { name: 'Госуслуги Елизово', url: 'https://elizovo.gosuslugi.ru/dlya-zhiteley/novosti-i-reportazhi/', type: 'website', category: 'Официальные' },
  // Telegram
  { name: 'ЧП Камчатка', url: 'https://t.me/chpkamchatka', type: 'telegram', category: 'Telegram' },
  { name: 'Без фильтра 41', url: 'https://t.me/bezfiltra_41', type: 'telegram', category: 'Telegram' },
  { name: 'Массмедиа Кам', url: 'https://t.me/massmediakam', type: 'telegram', category: 'Telegram' },
  { name: 'Камчатка СМИ', url: 'https://t.me/kamchatka_smi', type: 'telegram', category: 'Telegram' },
  { name: 'New Елизово', url: 'https://t.me/new_elizovo', type: 'telegram', category: 'Telegram' },
  { name: 'КамГов', url: 'https://t.me/kamgov41', type: 'telegram', category: 'Telegram' },
  { name: 'Камчатская жизнь', url: 'https://t.me/kamchatskaya_zhizn', type: 'telegram', category: 'Telegram' },
  { name: 'КамРепортер', url: 'https://t.me/kamreporter', type: 'telegram', category: 'Telegram' },
  // Max
  { name: 'KAM24 (Max)', url: 'https://max.ru/kam24ru', type: 'max', category: 'Max' },
  { name: 'Камчатка Now (Max)', url: 'https://max.ru/kamchatka_now', type: 'max', category: 'Max' },
  { name: 'КамРепортер (Max)', url: 'https://max.ru/kamreporter', type: 'max', category: 'Max' },
  // VK
  { name: 'Подслушано Елизово', url: 'https://vk.ru/overhear_elizovo', type: 'vk', category: 'ВКонтакте' },
  { name: 'Елизово Group', url: 'https://vk.ru/elizovo_group_41', type: 'vk', category: 'ВКонтакте' },
  { name: 'Разеб 41', url: 'https://vk.ru/razeb41', type: 'vk', category: 'ВКонтакте' },
  { name: 'ИнфоКамч', url: 'https://vk.ru/infokamch', type: 'vk', category: 'ВКонтакте' },
  { name: 'КамГов 41', url: 'https://vk.ru/kamgov41', type: 'vk', category: 'ВКонтакте' },
  { name: 'КамчаТрип', url: 'https://vk.ru/kamchatrip', type: 'vk', category: 'ВКонтакте' },
  { name: 'КамОтзовик', url: 'https://vk.ru/kamotzovik', type: 'vk', category: 'ВКонтакте' },
];

async function initDatabase() {
  try {
    console.log('🔄 Подключение к MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB подключена');

    // Создание администратора
    console.log('👤 Создание администратора...');
    const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'elizovo2024'
      });
      await admin.save();
      console.log('✅ Администратор создан');
    } else {
      console.log('ℹ️ Администратор уже существует');
    }

    // Добавление источников
    console.log('📡 Добавление источников...');
    let added = 0;
    for (const source of SOURCES) {
      const existing = await Source.findOne({ url: source.url });
      if (!existing) {
        await new Source(source).save();
        added++;
      }
    }
    console.log(`✅ Добавлено ${added} новых источников`);

    console.log('\n🎉 Инициализация завершена!');
    console.log('\n📋 Данные для входа:');
    console.log(`   Логин: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Пароль: ${process.env.ADMIN_PASSWORD || 'elizovo2024'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error);
    process.exit(1);
  }
}

initDatabase();
