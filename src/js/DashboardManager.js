/**
 * Класс для работы с Dashboard
 */

export class DashboardManager {
  constructor(httpService, sseService, dashboardView) {
    this.httpService = httpService;
    this.sseService = sseService;
    this.dashboardView = dashboardView;
    this.instances = [];
  }

  // метод для добавления слушателей
  init() {
    // Загружаем инстансы при инициализации
    this.loadInstances();

    // Подключаем SSE для получения обновлений
    this.sseService.connectSse((data) => {
      this.handleSseMessage(data);
    });

    // Подключаем WebSocket для управления инстансами
    this.sseService.connectWebSocket((data) => {
      this.handleWebSocketMessage(data);
    });

    // Устанавливаем обработчики событий для UI
    this.dashboardView.setOnCreateInstance(() => {
      this.createInstance();
    });

    this.dashboardView.setOnInstanceAction((id, action) => {
      this.handleInstanceAction(id, action);
    });

    // Обработчик для корректного закрытия соединений при покидании страницы
    window.addEventListener('beforeunload', () => {
      this.sseService.disconnectWebSocket();
      this.sseService.disconnectSse();
    });
  }

  // Загрузка инстансов с сервера
  async loadInstances() {
    try {
      this.instances = await this.httpService.getInstances();
      this.dashboardView.renderInstances(this.instances.data);
    } catch (error) {
      console.error('Error loading instances:', error);
    }
  }

  // Создание нового инстанса
  async createInstance() {
    try {
      await this.httpService.createInstance();
      // Обновления будут получены через SSE
    } catch (error) {
      console.error('Error creating instance:', error);
    }
  }

  // Удаление инстанса
  async deleteInstance(id) {
    try {
      await this.httpService.deleteInstance(id);
      // Обновления будут получены через SSE
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  }

  // Обработка действия с инстансом
  handleInstanceAction(id, action) {
    if (action === 'delete') {
      // Для удаления используем HTTP-запрос
      this.deleteInstance(id);
    } else {
      // Для других действий (start, stop) используем WebSocket
      this.sseService.sendCommand({
        id,
        action,
      });
    }
  }

  // Обработка сообщения от SSE
  handleSseMessage(data) {
    // Добавляем логирование полученных данных
    console.log('Получено сообщение от сервера SSE:', data);

    // Обновляем состояние инстанса в UI в соответствии с принимаемой информацией от сервера
    if (!data.id) return;

    const instanceIndex = this.instances.data.findIndex(
      (instance) => instance.id === data.id
    );

    switch (data.info) {
    case 'Created':
      if (instanceIndex === -1) {
        // Если инстанс был создан и его еще нет в списке, добавляем его
        const newInstance = {
          id: data.id,
          state: 'stopped',
          timestamp: new Date().toISOString(),
        };
        this.instances.data.push(newInstance);
        this.dashboardView.renderInstances(this.instances.data);
      }
      break;
    case 'Removed':
      if (instanceIndex !== -1) {
        this.instances.data.splice(instanceIndex, 1);
        this.dashboardView.removeInstance(data.id);
      }
      break;
    }

    // Добавляем запись в worklog
    this.dashboardView.addWorklogEntry(data);
  }

  // Обработка сообщения от WebSocket
  handleWebSocketMessage(data) {
    // Добавляем логирование полученных данных
    console.log('Получено сообщение по WebSocket:', data);

    // Проверяем, является ли сообщение массивом инстансов
    if (Array.isArray(data) && data.length > 0) {
      // Обновляем состояние инстансов в UI
      data.forEach((instance) => {
        const instanceIndex = this.instances.data.findIndex(
          (inst) => inst.id === instance.id
        );

        if (instanceIndex !== -1) {
          // Обновляем состояние существующего инстанса
          this.instances.data[instanceIndex].state = instance.state;
          this.dashboardView.updateInstanceStatus(instance.id, instance.state);
        }
      });
    }
  }
}
