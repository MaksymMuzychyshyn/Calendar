import { getItem } from '../common/storage.js';

const todayDate = new Date();

const createRedlineEl = minutesNow => {
  // создать ДОМ елемент

  const redlineEl = document.createElement('div');
  redlineEl.classList.add('redline');
  redlineEl.setAttribute('style', `top: ${minutesNow}px;`);
  return redlineEl;
};

export const renderRedline = () => {
  // вставить createRedlineEl() в необходимый день и час

  const weekStartDate = new Date(getItem('displayedWeekStart'));
  if (
    todayDate.getMonth() !== weekStartDate.getMonth() ||
    todayDate.getFullYear() !== weekStartDate.getFullYear()
  ) {
    return null;
  }

  let minutesNow = todayDate.getMinutes();
  const eventCell = document
    .querySelector(`.calendar__day[data-time = '${todayDate.getDate()}']`)
    .querySelector(
      `.calendar__time-slot[data-time = '${todayDate.getHours()}']`
    );
  eventCell.append(createRedlineEl(minutesNow));
  const redlineEl = document.querySelector('.redline');

  const redlineUpdate = () => {
    if (new Date().getMinutes() === minutesNow) {
      return;
    }

    minutesNow = new Date().getMinutes();
    redlineEl.setAttribute('style', `top: ${minutesNow}px;`);
  };

  setInterval(redlineUpdate, 1000);
};
