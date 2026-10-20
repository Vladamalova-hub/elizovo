const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Авторизация
  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка авторизации');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    return data;
  }

  async checkAuth() {
    const token = this.getToken();
    if (!token) return { authenticated: false };

    try {
      const response = await fetch(`${API_URL}/auth/check`, {
        headers: this.getHeaders(),
      });
      const data = await response.json();
      return data;
    } catch {
      return { authenticated: false };
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  // Новости
  async getNews(params: {
    sources?: string[];
    keywords?: string[];
    search?: string;
    sortBy?: string;
    limit?: number;
    page?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.sources?.length) {
      searchParams.set('sources', params.sources.join(','));
    }
    if (params.keywords?.length) {
      searchParams.set('keywords', params.keywords.join(','));
    }
    if (params.search) {
      searchParams.set('search', params.search);
    }
    if (params.sortBy) {
      searchParams.set('sortBy', params.sortBy);
    }
    if (params.limit) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.page) {
      searchParams.set('page', params.page.toString());
    }

    const response = await fetch(`${API_URL}/news?${searchParams}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения новостей');
    }

    return response.json();
  }

  async getStats() {
    const response = await fetch(`${API_URL}/news/stats/summary`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения статистики');
    }

    return response.json();
  }

  // Источники
  async getSources() {
    const response = await fetch(`${API_URL}/sources`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения источников');
    }

    return response.json();
  }

  async addSource(source: { name: string; url: string; type: string; category: string }) {
    const response = await fetch(`${API_URL}/sources`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(source),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка добавления источника');
    }

    return response.json();
  }

  async deleteSource(id: string) {
    const response = await fetch(`${API_URL}/sources/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка удаления источника');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
