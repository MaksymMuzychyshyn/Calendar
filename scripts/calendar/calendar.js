/* eslint-disable import/extensions */
import { getItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { renderEvents } from '../events/events.js';
import { createNumbersArray } from '../common/createNumbersArray.js';

const calendarWeek = document.querySelector('.calendar__week');

export const generateDay = () => {
  // функция должна сгенерировать и вернуть разметку дня в виде строки
  // разметка состоит из 24 часовых временных слотов (.calendar__time-slot)

  let innerString = '';
  const timeArr = createNumbersArray(0, 23);
  timeArr.forEach(hour => {
    innerString += `<div class="calendar__time-slot" data-time="${hour}"></div>`;
  });
  return innerString;
};

export const renderWeek = () => {
  // функция должна сгенерировать разметку недели в виде строки и вставить ее на страницу (в .calendar__week)
  // разметка недели состоит из 7 дней (.calendar__day) отображаемой недели
  // массив дней, которые нужно отобразить, считаем ф-цией generateWeekRange на основе displayedWeekStart из storage
  // каждый день должен содержать в дата атрибуте порядковый номер дня в месяце
  // после того, как отрисовали всю сетку для отображаемой недели, нужно отобразить события этой недели с помощью renderEvents

  let innerString = '';
  const weekRange = generateWeekRange(getItem('displayedWeekStart'));
  weekRange.forEach(el => {
    innerString += `<div class="calendar__day" data-time="${new Date(
      el
    ).getDate()}">${generateDay()}</div>`;
  });
  calendarWeek.innerHTML = innerString;
  renderEvents();
};