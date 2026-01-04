/**
 * Класс для отображения Dashboard
 */

export class DashboardView {
  constructor() {
    this.instancesContainer = document.getElementById('instancesContainer');
    this.worklogContainer = document.getElementById('worklogContainer');
    this.createInstanceBtn = document.getElementById('createInstanceBtn');

    this.instanceElements = new Map();
  }

  // Отрисовка инстансов
  renderInstances(instances) {
    this.instancesContainer.innerHTML = '';

    instances.forEach((instance) => {
      const instanceElement = this.createInstanceElement(instance);
      this.instancesContainer.append(instanceElement);
      this.instanceElements.set(instance.id, instanceElement);
    });
  }

  // Создание элемента инстанса
  createInstanceElement(instance) {
    const instanceCard = document.createElement('div');
    instanceCard.className = 'instance-card';
    instanceCard.dataset.id = instance.id;

    const statusClass =
      instance.state === 'running' ? 'status-running' : 'status-stopped';

    instanceCard.innerHTML = `
      <div class="instance-id">ID: ${instance.id}</div>
      <div class="status ${statusClass}">Status: ${instance.state}</div>
      <div class="actions">
        <div class="actions-label">Action:</div>
        <button class="btn-start">Start</button>
        <button class="btn-stop">Stop</button>
        <button class="btn-delete">Delete</button>
      </div>
    `;

    // Добавляем обработчики событий
    const startBtn = instanceCard.querySelector('.btn-start');
    const stopBtn = instanceCard.querySelector('.btn-stop');
    const deleteBtn = instanceCard.querySelector('.btn-delete');

    // Устанавливаем видимость кнопок в зависимости от состояния
    this.setButtonVisibility(startBtn, stopBtn, instance.state);

    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.onInstanceAction && this.onInstanceAction(instance.id, 'start');
    });

    stopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.onInstanceAction && this.onInstanceAction(instance.id, 'stop');
    });

    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.onInstanceAction && this.onInstanceAction(instance.id, 'delete');
    });

    return instanceCard;
  }

  // Обновление статуса инстанса
  updateInstanceStatus(id, state) {
    const instanceElement = this.instanceElements.get(id);
    if (instanceElement) {
      const statusElement = instanceElement.querySelector('.status');
      statusElement.textContent = `Status: ${state}`;
      statusElement.className = `status ${
        state === 'running' ? 'status-running' : 'status-stopped'
      }`;

      // Обновляем видимость кнопок в зависимости от состояния
      const startBtn = instanceElement.querySelector('.btn-start');
      const stopBtn = instanceElement.querySelector('.btn-stop');

      this.setButtonVisibility(startBtn, stopBtn, state);
    }
  }

  // Удаление инстанса из UI
  removeInstance(id) {
    const instanceElement = this.instanceElements.get(id);
    if (instanceElement) {
      instanceElement.remove();
      this.instanceElements.delete(id);
    }
  }

  // Добавление записи в worklog
  addWorklogEntry(entry) {
    const entryElement = document.createElement('div');
    entryElement.className = `worklog-entry ${entry.type}`;

    entryElement.innerHTML = `
      <div class="worklog-timestamp">${entry.timeStamp || entry.timestamp}</div>
      <div class="worklog-server">Server: ${entry.id}</div>
      <div class="worklog-type">INFO: ${entry.info}</div>
    `;

    this.worklogContainer.append(entryElement);

    // Прокручиваем вниз, чтобы видеть последнюю запись
    this.worklogContainer.scrollTop = this.worklogContainer.scrollHeight;
  }

  // Установка обработчика для кнопки создания инстанса
  setOnCreateInstance(handler) {
    this.createInstanceBtn.addEventListener('click', handler);
  }

  // Установка обработчика для действий с инстансами
  setOnInstanceAction(handler) {
    this.onInstanceAction = handler;
  }

  // Метод для установки видимости кнопок в зависимости от состояния инстанса
  setButtonVisibility(startBtn, stopBtn, state) {
    if (state === 'running') {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
    } else {
      startBtn.style.display = 'inline-block';
      stopBtn.style.display = 'none';
    }
  }
}
