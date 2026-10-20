export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  sourceType: 'website' | 'telegram' | 'vk' | 'max';
  publishedAt: Date;
  keywords: string[];
  url: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'website' | 'telegram' | 'vk' | 'max';
  category: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string;
}

export const KEYWORDS = [
  'елизово', 'елизовский', 'емо', 'емр', 'елизове', 'елизова',
  'сокочи', 'нагорный', 'раздольный', 'николаевка',
  'сосновка', 'пионерский', 'светлый', 'крутоберековый', 'вулканный',
  'ганалы', 'дальний', 'малки', 'начики', 'паратунка', 'термальный',
  'коряки', 'северные коряки', 'зеленый', 'новый', 'красный',
  'двуречье', 'керкино', 'пиначево', 'лесной', 'березняки', 'южные коряки'
];

export const SOURCES: Source[] = [
  // Сайты
  { id: 's1', name: 'KamchatInfo', url: 'https://kamchatinfo.com', type: 'website', category: 'СМИ Камчатки' },
  { id: 's2', name: 'KAM24', url: 'https://kam24.ru', type: 'website', category: 'СМИ Камчатки' },
  { id: 's3', name: 'KamToday', url: 'https://kamtoday.ru', type: 'website', category: 'СМИ Камчатки' },
  { id: 's4', name: 'Камчатский Край', url: 'https://kam-kray.ru', type: 'website', category: 'СМИ Камчатки' },
  { id: 's5', name: 'РИА Камчатка', url: 'https://ria.ru/location_Kamchatskijj_krajj/', type: 'website', category: 'Федеральные СМИ' },
  { id: 's6', name: 'Полуостров Камчатка', url: 'https://www.poluostrov-kamchatka.ru', type: 'website', category: 'СМИ Камчатки' },
  { id: 's7', name: 'Елизово БезФормата', url: 'https://elizovo.bezformata.com/', type: 'website', category: 'Елизово' },
  { id: 's8', name: 'Lenta.ru Елизово', url: 'https://lenta.ru/tags/geo/elizovo/', type: 'website', category: 'Федеральные СМИ' },
  { id: 's9', name: 'КамИнформ - Елизово', url: 'https://kaminform.online/news/segodnja-v-kamchatskom-krae/novosti-elizovo', type: 'website', category: 'Елизово' },
  { id: 's10', name: 'Госуслуги Елизово', url: 'https://elizovo.gosuslugi.ru/dlya-zhiteley/novosti-i-reportazhi/?cur_cc=45&filter%5B45%5D%5BCategory%5D=13', type: 'website', category: 'Официальные' },
  // Telegram
  { id: 't1', name: 'ЧП Камчатка', url: 'https://t.me/chpkamchatka', type: 'telegram', category: 'Telegram' },
  { id: 't2', name: 'Без фильтра 41', url: 'https://t.me/bezfiltra_41', type: 'telegram', category: 'Telegram' },
  { id: 't3', name: 'Массмедиа Кам', url: 'https://t.me/massmediakam', type: 'telegram', category: 'Telegram' },
  { id: 't4', name: 'Камчатка СМИ', url: 'https://t.me/kamchatka_smi', type: 'telegram', category: 'Telegram' },
  { id: 't5', name: 'New Елизово', url: 'https://t.me/new_elizovo', type: 'telegram', category: 'Telegram' },
  { id: 't6', name: 'КамГов', url: 'https://t.me/kamgov41', type: 'telegram', category: 'Telegram' },
  { id: 't7', name: 'Камчатская жизнь', url: 'https://t.me/kamchatskaya_zhizn', type: 'telegram', category: 'Telegram' },
  { id: 't8', name: 'КамРепортер', url: 'https://t.me/kamreporter', type: 'telegram', category: 'Telegram' },
  // Max
  { id: 'm1', name: 'KAM24 (Max)', url: 'https://max.ru/kam24ru', type: 'max', category: 'Max' },
  { id: 'm2', name: 'Камчатка Now (Max)', url: 'https://max.ru/kamchatka_now', type: 'max', category: 'Max' },
  { id: 'm3', name: 'КамРепортер (Max)', url: 'https://max.ru/kamreporter', type: 'max', category: 'Max' },
  // VK
  { id: 'v1', name: 'Подслушано Елизово', url: 'https://vk.ru/overhear_elizovo', type: 'vk', category: 'ВКонтакте' },
  { id: 'v2', name: 'Елизово Group', url: 'https://vk.ru/elizovo_group_41', type: 'vk', category: 'ВКонтакте' },
  { id: 'v3', name: 'Разеб 41', url: 'https://vk.ru/razeb41', type: 'vk', category: 'ВКонтакте' },
  { id: 'v4', name: 'ИнфоКамч', url: 'https://vk.ru/infokamch', type: 'vk', category: 'ВКонтакте' },
  { id: 'v5', name: 'КамГов 41', url: 'https://vk.ru/kamgov41', type: 'vk', category: 'ВКонтакте' },
  { id: 'v6', name: 'КамчаТрип', url: 'https://vk.ru/kamchatrip', type: 'vk', category: 'ВКонтакте' },
  { id: 'v7', name: 'КамОтзовик', url: 'https://vk.ru/kamotzovik', type: 'vk', category: 'ВКонтакте' },
];
