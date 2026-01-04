/**
 * Класс для работы с SSE и WebSocket
 */

export class SseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.sseConnection = null;
    this.wsConnection = null;
    this.eventListeners = {};
  }

  // Подключение к SSE для получения логов
  connectSse(onMessage) {
    this.sseConnection = new EventSource(`${this.baseUrl}/sse`);

    this.sseConnection.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    });

    this.sseConnection.onerror = (error) => {
      console.error("SSE connection error:", error);
    };
  }

  disconnectSse() {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
    }
  }

  // Подключение к WebSocket для управления инстансами
  connectWebSocket(onMessage) {
    const wsUrl = this.baseUrl
      .replace("https://", "wss://")
      .replace("http://", "ws://");
    this.wsConnection = new WebSocket(wsUrl);

    this.wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.wsConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.wsConnection.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  disconnectWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Отправка команды через WebSocket
  sendCommand(command) {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(command));
    } else {
      console.error("WebSocket is not connected");
    }
  }
}
