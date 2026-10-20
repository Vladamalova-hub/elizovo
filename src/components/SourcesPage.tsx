import React from 'react';
import { SOURCES } from '../types';

const SourcesPage: React.FC = () => {
  const typeGroups = {
    website: SOURCES.filter(s => s.type === 'website'),
    telegram: SOURCES.filter(s => s.type === 'telegram'),
    max: SOURCES.filter(s => s.type === 'max'),
    vk: SOURCES.filter(s => s.type === 'vk'),
  };

  const typeConfig: Record<string, { icon: string; label: string; color: string; bgColor: string }> = {
    website: { icon: '🌐', label: 'Сайты СМИ', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    telegram: { icon: '✈️', label: 'Telegram каналы', color: 'text-sky-700', bgColor: 'bg-sky-50 border-sky-200' },
    max: { icon: '📱', label: 'Max (бывш. Mail.ru)', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
    vk: { icon: '💬', label: 'ВКонтакте', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Источники мониторинга</h2>
        <p className="text-gray-600">
          Всего подключено <strong>{SOURCES.length}</strong> источников из 4 платформ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(typeGroups).map(([type, sources]) => {
          const config = typeConfig[type];
          return (
            <div key={type} className={`rounded-xl border p-5 ${config.bgColor}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{config.icon}</span>
                <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
                <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color} border`}>
                  {sources.length}
                </span>
              </div>
              <div className="space-y-2">
                {sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 bg-white/70 rounded-lg hover:bg-white transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {source.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[250px]">{source.url}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keywords section */}
      <div className="mt-8 bg-amber-50 rounded-xl border border-amber-200 p-5">
        <h3 className="text-lg font-bold text-amber-800 mb-3">🔑 Ключевые слова для фильтрации</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Елизово', 'Елизовский', 'ЕМО', 'ЕМР', 'Елизове', 'Елизова',
            'Сокочи', 'Нагорный', 'Раздольный', 'Николаевка',
            'Сосновка', 'Пионерский', 'Светлый', 'Крутоберековый', 'Вулканный',
            'Ганалы', 'Дальний', 'Малки', 'Начики', 'Паратунка', 'Термальный',
            'Коряки', 'Северные Коряки', 'Зелёный', 'Новый', 'Красный',
            'Двуречье', 'Керкино', 'Пиначево', 'Лесной', 'Березняки', 'Южные Коряки'
          ].map((kw) => (
            <span key={kw} className="px-3 py-1 bg-white text-amber-800 text-sm rounded-full border border-amber-200">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
