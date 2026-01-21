const API_BASE = 'https://alix-renderer.com';

export const apiClient = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE}${endpoint}`);
    return res.json();
  },
  post: async (endpoint: string, body: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};