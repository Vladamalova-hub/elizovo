import React from 'react';
import { SOURCES, KEYWORDS } from '../types';

interface SidebarProps {
  selectedSources: string[];
  onSourceToggle: (sourceId: string) => void;
  selectedKeywords: string[];
  onKeywordToggle: (keyword: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedSources,
  onSourceToggle,
  selectedKeywords,
  onKeywordToggle,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  const sourceTypes = ['website', 'telegram', 'vk', 'max'] as const;
  const typeLabels: Record<string, string> = {
    website: '🌐 Сайты',
    telegram: '✈️ Telegram',
    vk: '💬 ВКонтакте',
    max: '📱 Max',
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Фильтры</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onClearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Сбросить
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active filters count */}
          {(selectedSources.length > 0 || selectedKeywords.length > 0) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700">
                Активных фильтров: <strong>{selectedSources.length + selectedKeywords.length}</strong>
              </p>
            </div>
          )}

          {/* Sources Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Источники
            </h3>
            {sourceTypes.map((type) => {
              const typeSources = SOURCES.filter((s) => s.type === type);
              return (
                <div key={type} className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">{typeLabels[type]}</p>
                  <div className="space-y-1">
                    {typeSources.map((source) => (
                      <label
                        key={source.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSources.includes(source.id)}
                          onChange={() => onSourceToggle(source.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 truncate">{source.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Keywords Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Ключевые слова
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => onKeywordToggle(keyword)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all duration-150 ${
                    selectedKeywords.includes(keyword)
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
