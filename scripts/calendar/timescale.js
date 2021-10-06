import { createNumbersArray } from '../common/createNumbersArray.js';

const timeScale = document.querySelector('.calendar__time-scale');
export const renderTimescale = () => {
  // ф-ция должна генерировать разметку для боковой шкалы времени (24 часа)
  // полученную разметку вставьте на страницу с помощью innerHTML в .calendar__time-scale

  const timeArr = createNumbersArray(0, 23);
  timeArr.map(hour => {
    const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    timeScale.innerHTML += `<div class="time-scale"><span>${time}</span></div>`;
  });
};