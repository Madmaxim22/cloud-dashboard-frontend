/**
 * Класс для работы с http запросами
 */

export class HttpService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getInstances() {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async createInstance() {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async deleteInstance(id) {
    const response = await fetch(`${this.baseUrl}?id=${id}`, { method: 'DELETE', });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
