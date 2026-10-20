import React, { useState, useEffect, useMemo } from 'react';
import { NewsItem, KEYWORDS } from '../types';
import NewsCard from './NewsCard';
import Sidebar from './Sidebar';
import SourcesPage from './SourcesPage';
import { apiService } from '../services/api';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

type Tab = 'news' | 'sources';

const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'source'>('date');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    loadNews();
    loadStats();
  }, [selectedSources, selectedKeywords, searchQuery, sortBy]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await apiService.getNews({
        sources: selectedSources,
        keywords: selectedKeywords,
        search: searchQuery,
        sortBy: sortBy === 'date' ? 'publishedAt' : 'source',
      });
      setNews(data.news);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]
    );
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const clearFilters = () => {
    setSelectedSources([]);
    setSelectedKeywords([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeTab === 'news' && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">📡 Мониторинг Елизово</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Новости Елизовского округа из всех источников</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tabs */}
              <nav className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('news')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'news'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📰 Новости
                </button>
                <button
                  onClick={() => setActiveTab('sources')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === 'sources'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Источники
                </button>
              </nav>

              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{news.length} новостей</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Выйти"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile tabs */}
          <nav className="sm:hidden flex items-center mt-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'news'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📰 Новости
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'sources'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Источники
            </button>
          </nav>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        {/* Sidebar - only on news tab */}
        {activeTab === 'news' && (
          <Sidebar
            selectedSources={selectedSources}
            onSourceToggle={handleSourceToggle}
            selectedKeywords={selectedKeywords}
            onKeywordToggle={handleKeywordToggle}
            onClearFilters={clearFilters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {activeTab === 'news' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🌐</span>
                    <span className="text-xs text-gray-500 uppercase font-medium">Сайты</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.byType?.website || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">✈️</span>
                    <span className="text-xs text-gray-500 uppercase font-medium">Telegram</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.byType?.telegram || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">💬</span>
                    <span className="text-xs text-gray-500 uppercase font-medium">VK</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.byType?.vk || 0}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">📱</span>
                    <span className="text-xs text-gray-500 uppercase font-medium">Max</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.byType?.max || 0}</p>
                </div>
              </div>

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по новостям..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'source')}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                >
                  <option value="date">По дате</option>
                  <option value="source">По источнику</option>
                </select>
              </div>

              {/* Active Keywords Tags */}
              {selectedKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500 font-medium">Ключевые слова:</span>
                  {selectedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                    >
                      {kw}
                      <button
                        onClick={() => handleKeywordToggle(kw)}
                        className="hover:text-amber-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* News Grid */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Загрузка новостей...</p>
                </div>
              ) : news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {news.map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Новости не найдены</h3>
                  <p className="text-gray-500 text-sm mb-4">Попробуйте изменить фильтры или поисковый запрос</p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </>
          ) : (
            <SourcesPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
