/* eslint-disable no-alert */
/* eslint-disable no-new */
/* eslint-disable import/extensions */

import { renderEvents } from './events.js';
import { getDateTime } from '../common/time.utils.js';
import { closeModal } from '../common/modal.js';
import { createEvent } from '../common/eventsGateway.js';

const eventFormElem = document.querySelector('.event-form');
const closeEventFormBtn = document.querySelector('.create-event__close-btn');
const eventFormSubmitBtn = document.querySelector('.event-form__submit-btn');

function clearEventForm() {
  // ф-ция должна очистить поля формы от значений
  eventFormElem.reset();
}

function onCloseEventForm() {
  // здесь нужно закрыть модальное окно и очистить форму
  closeModal();
  clearEventForm();
}

function onCreateEvent(event) {
  // задача этой ф-ции только добавить новое событие в массив событий, что хранится в storage
  // создавать или менять DOM элементы здесь не нужно. Этим займутся другие ф-ции

  // при подтверждении формы нужно считать данные с формы
  // с формы вы получите поля date, startTime, endTime, title, description
  // на основе полей date, startTime, endTime нужно посчитать дату начала и окончания события
  // date, startTime, endTime - строки. Вам нужно с помощью getDateTime из утилит посчитать start и end объекта события
  // полученное событие добавляем в массив событий, что хранится в storage
  // закрываем форму
  // и запускаем перерисовку событий с помощью renderEvents

  event.preventDefault();
  const eventObj = Object.fromEntries(new FormData(eventFormElem));
  createEvent({
    id: Math.random(),
    title: eventObj.title,
    description: eventObj.description,
    start: getDateTime(eventObj.date, eventObj.startTime),
    end: getDateTime(eventObj.date, eventObj.endTime),
    startTime: eventObj.startTime,
    endTime: eventObj.endTime,
    color: eventObj.color,
  })
    .then(() => renderEvents())
    .catch(() => {
      new Error('Internal Server Error');
      alert('Internal Server Error');
    });
  onCloseEventForm();
}

export function initEventForm() {
  // подпишитесь на сабмит формы и на закрытие формы
  eventFormSubmitBtn.addEventListener('click', onCreateEvent);
  closeEventFormBtn.addEventListener('click', onCloseEventForm);
}