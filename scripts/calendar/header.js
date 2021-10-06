/* eslint-disable import/extensions */
import { getItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { openModal, closeModal } from '../common/modal.js';

const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const calendarHeader = document.querySelector('.calendar__header');
const createEventBtn = document.querySelector('.create-event-btn');
const createEventCloseBtn = document.querySelector('.create-event__close-btn');

export const renderHeader = () => {
  // на основе displayedWeekStart из storage с помощью generateWeekRange сформируйте массив дней текущей недели
  // на основе полученного массива сформируйте разметку в виде строки - 7 дней (день недели и число в месяце)
  // полученную разметку вставить на страницу с помощью innerHTML в .calendar__header
  // в дата атрибуте каждой ячейки должно хранить для какого часа эта ячейка

  const weekRange = generateWeekRange(getItem('displayedWeekStart'));
  const innerString = weekRange
    .map(
      day =>
        `<div class="calendar__day-label day-label"><span class="day-label__day-name">${daysOfWeek[
          new Date(day).getDay()
        ].toUpperCase()}</span><span class="day-label__day-number">${new Date(
          day
        ).getDate()}</span></div>`
    )
    .join('');
  calendarHeader.innerHTML = innerString;
};

// при клике на кнопку "Create" открыть модальное окно с формой для создания события
// назначьте здесь обработчик

createEventBtn.addEventListener('click', openModal);
createEventCloseBtn.addEventListener('click', closeModal);