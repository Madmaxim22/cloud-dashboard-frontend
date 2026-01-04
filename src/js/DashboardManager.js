/**
 * Класс для работы с Dashboard
 */

export class DashboardManager{
  constructor(httpService, sseService, dashboardView) {
    this.httpService = httpService;
    this.sseService = sseService;
    this.dashboardView = dashboardView;
  }

  // метод для добавления слушателей
  init() {

  }
}