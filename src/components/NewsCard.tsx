import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'telegram':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      );
    case 'vk':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.188 1.368 1.259 2.184 1.814.616.42 1.084.327 1.084.327l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.334-.856-.245-.856-.245l-2.45.015s-.182-.025-.316.056c-.132.079-.216.264-.216.264s-.388 1.032-.906 1.91c-1.094 1.856-1.53 1.953-1.71 1.838-.416-.268-.312-1.07-.312-1.64 0-1.783.271-2.526-.528-2.718-.265-.064-.46-.106-1.137-.113-.868-.009-1.602.003-2.018.207-.277.136-.49.438-.36.455.16.022.524.098.717.362.25.34.24 1.104.24 1.104s.144 2.098-.336 2.358c-.328.178-.778-.186-1.74-1.85-.492-.85-.864-1.79-.864-1.79s-.072-.176-.2-.27c-.156-.114-.374-.15-.374-.15l-2.327.015s-.35.01-.478.162c-.114.134-.01.412-.01.412s1.82 4.258 3.88 6.404c1.888 1.966 4.032 1.838 4.032 1.838h.97z"/>
        </svg>
      );
    case 'max':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
  }
};

const getSourceColor = (type: string) => {
  switch (type) {
    case 'telegram': return 'bg-sky-100 text-sky-700';
    case 'vk': return 'bg-blue-100 text-blue-700';
    case 'max': return 'bg-purple-100 text-purple-700';
    default: return 'bg-green-100 text-green-700';
  }
};

const getSourceLabel = (type: string) => {
  switch (type) {
    case 'telegram': return 'Telegram';
    case 'vk': return 'VK';
    case 'max': return 'Max';
    default: return 'Сайт';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days === 1) return 'Вчера';
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSourceColor(news.sourceType)}`}>
            {getSourceIcon(news.sourceType)}
            <span>{getSourceLabel(news.sourceType)}</span>
          </div>
          <span className="text-xs text-gray-500">{formatTime(news.publishedAt)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {news.title}
        </h3>

        {/* Content */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {news.content}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {news.keywords.slice(0, 4).map((keyword, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
              {keyword}
            </span>
          ))}
          {news.keywords.length > 4 && (
            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
              +{news.keywords.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{news.source}</span>
          </div>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Открыть
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
