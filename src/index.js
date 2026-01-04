import './css/style.css';
import { HttpService } from './js/сonnection/HttpService.js';
import { SseService } from './js/сonnection/SseService.js';
import { DashboardView } from './js/DasboardView.js';
import { DashboardManager } from './js/DashboardManager.js';

const URL = 'https://cloud-dashboard-backend-vkvl.onrender.com';

const httpService = new HttpService(URL);
const sseService = new SseService(URL);
const dashboardView = new DashboardView();
const dashboardManager = new DashboardManager(
  httpService,
  sseService,
  dashboardView
);
dashboardManager.init();

