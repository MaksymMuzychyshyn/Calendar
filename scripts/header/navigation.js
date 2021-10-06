/* eslint-disable import/extensions */
import { getItem, setItem } from '../common/storage.js';
import { renderRedline } from '../calendar/redline.js';
import { renderWeek } from '../calendar/calendar.js';
import { renderHeader } from '../calendar/header.js';
import shmoment from '../common/shmoment.js';
import { getStartOfWeek, getDisplayedMonth } from '../common/time.utils.js';

const navElem = document.querySelector('.navigation');
const displayedMonthElem = document.querySelector(
  '.navigation__displayed-month'
);

function renderCurrentMonth() {
  // отрисовать месяц, к которому относиться текущая неделя (getDisplayedMonth)
  // вставить в .navigation__displayed-month

  displayedMonthElem.innerHTML = getDisplayedMonth(
    getItem('displayedWeekStart')
  );
}

const onChangeWeek = event => {
  // при переключении недели обновите displayedWeekStart в storage
  // и перерисуйте все необходимые элементы страницы (renderHeader, renderWeek, renderCurrentMonth)
  if (!event.target.closest('button')) {
    return null;
  }

  if (event.target.closest('button').dataset.direction === 'next') {
    setItem(
      'displayedWeekStart',
      shmoment(getItem('displayedWeekStart')).add('days', 7).result()
    );
  }

  if (event.target.closest('button').dataset.direction === 'prev') {
    setItem(
      'displayedWeekStart',
      shmoment(getItem('displayedWeekStart')).subtract('days', 7).result()
    );
  }

  if (event.target.closest('button').dataset.direction === 'today') {
    setItem('displayedWeekStart', getStartOfWeek(new Date()));
  }
  renderHeader();
  renderWeek();
  renderCurrentMonth();
  renderRedline();
};

export const initNavigation = () => {
  renderCurrentMonth();
  navElem.addEventListener('click', onChangeWeek);
};