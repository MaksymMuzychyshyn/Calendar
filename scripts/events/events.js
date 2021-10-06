/* eslint-disable no-alert */
/* eslint-disable import/no-cycle */
/* eslint-disable no-new */
/* eslint-disable import/extensions */

import { getItem, setItem } from '../common/storage.js';
import shmoment from '../common/shmoment.js';
import { openPopup, closePopup } from '../common/popup.js';
import { renderWeek } from '../calendar/calendar.js';
import { getDateTime } from '../common/time.utils.js';
import {
  deleteEvent,
  getEvents,
  updateEvent,
} from '../common/eventsGateway.js';

const weekElem = document.querySelector('.calendar__week');
const deleteEventBtn = document.querySelector('.delete-event-btn');
const confirmEventBtn = document.querySelector('.confirm-event-btn');
const startTimeEl = document.querySelector('.popup-event-form__start-time');
const endTimeEl = document.querySelector('.popup-event-form__end-time');
const titleEl = document.querySelector('.popup-event-form__field');
const descriptionEl = document.querySelector('.popup-event-form__description');
const MS_TO_MIN = 1000 * 60;
const calendarWeek = document.querySelector('.calendar__week');
const changeEventForm = document.querySelector('.popup-event-form');
const popupColorInp = document.querySelector('.popup__color-inp');

function handleEventClick(event) {
  // если произошел клик по событию, то нужно паказать попап с кнопкой удаления
  // установите eventIdToDelete с id события в storage

  if (
    !event.target.classList.contains('event') &&
    !event.target.classList.contains('event__title') &&
    !event.target.classList.contains('event__time')
  )
    return;

  const y = event.pageY;
  const x = event.pageX;

  openPopup(x, y);
  setItem('eventIdToDelete', event.target.closest('.event').dataset.id);
  getEvents()
    .then(events => {
      const eventInArr = events.find(
        el => el.id === event.target.closest('.event').dataset.id
      );

      startTimeEl.value = `${eventInArr.startTime}`;
      endTimeEl.value = `${eventInArr.endTime}`;
      titleEl.value = `${eventInArr.title}`;
      descriptionEl.value = `${eventInArr.description}`;
      popupColorInp.value = `${eventInArr.color}`;
    })
    .catch(() => {
      new Error('Internal Server Error');
      alert('Internal Server Error');
    });
}

function removeEventsFromCalendar() {
  // ф-ция для удаления всех событий с календаря
  calendarWeek.innerHTML = '';
  renderWeek();
}

const createEventElement = event => {
  // ф-ция создает DOM элемент события
  // событие должно позиционироваться абсолютно внутри нужной ячейки времени внутри дня
  // нужно добавить id события в дата атрибут
  // здесь для создания DOM элемента события используйте document.createElement

  const eventBlock = document.createElement('div');
  eventBlock.classList.add('event');
  eventBlock.dataset.id = event.id;
  eventBlock.innerHTML = `<span class="event__title">${event.title}</span>
  <span class="event__time">${event.startTime} - ${event.endTime}</span>`;
  eventBlock.setAttribute(
    'style',
    `top: ${new Date(event.start).getMinutes()}px; height: ${
      (new Date(event.end) - new Date(event.start)) / MS_TO_MIN
    }px; background-color: ${event.color}`
  );

  return eventBlock;
};

export const renderEvents = () => {
  // достаем из storage все события и дату понедельника отображаемой недели
  // фильтруем события, оставляем только те, что входят в текущую неделю
  // создаем для них DOM элементы с помощью createEventElement
  // для каждого события находим на странице временную ячейку (.calendar__time-slot)
  // и вставляем туда событие
  // каждый день и временная ячейка должно содержать дата атрибуты, по которым можно будет найти нужную временную ячейку для события
  // не забудьте удалить с календаря старые события перед добавлением новых

  const weekStart = getItem('displayedWeekStart');
  getEvents()
    .then(events => {
      const weekEventsList = events.filter(
        eventEl =>
          new Date(eventEl.start).getTime() > new Date(weekStart).getTime() &&
          new Date(eventEl.start).getTime() <
            shmoment(weekStart).add('days', 7).result().getTime()
      );

      weekEventsList.forEach(eventEl => {
        const eventCell = document
          .querySelector(
            `.calendar__day[data-time = '${new Date(eventEl.start).getDate()}']`
          )
          .querySelector(
            `.calendar__time-slot[data-time = '${new Date(
              eventEl.start
            ).getHours()}']`
          );
        eventCell.append(createEventElement(eventEl));
      });
    })
    .catch(() => {
      new Error('Internal Server Error');
      alert('Internal Server Error');
    });
};

function onDeleteEvent() {
  // достаем из storage массив событий и eventIdToDelete
  // удаляем из массива нужное событие и записываем в storage новый массив
  // закрыть попап
  // перерисовать события на странице в соответствии с новым списком событий в storage (renderEvents)

  const eventIdToDelete = getItem('eventIdToDelete');
  deleteEvent(eventIdToDelete)
    .then(() => {
      document.querySelector(
        `.event[data-id = '${eventIdToDelete}']`
      ).parentElement.innerHTML = '';

      renderEvents();
    })
    .catch(() => {
      new Error('Internal Server Error');
      alert('Internal Server Error');
    });

  closePopup();
}

const onChangeEvent = () => {
  getEvents()
    .then(events => {
      const eventInArr = events.find(
        el => el.id === getItem('eventIdToDelete')
      );

      const eventDate = new Date(eventInArr.start).toDateString();
      const eventObj = Object.fromEntries(new FormData(changeEventForm));

      eventObj.start = getDateTime(eventDate, eventInArr.startTime);
      eventObj.end = getDateTime(eventDate, eventInArr.endTime);

      updateEvent(eventObj, eventInArr.id).then(() => {
        document.querySelector(
          `.event[data-id = '${getItem('eventIdToDelete')}']`
        ).parentElement.innerHTML = '';
        renderEvents();
      });
    })
    .catch(() => {
      new Error('Internal Server Error');
      alert('Internal Server Error');
    });
  closePopup();
};

confirmEventBtn.addEventListener('click', onChangeEvent);

deleteEventBtn.addEventListener('click', onDeleteEvent);

weekElem.addEventListener('click', handleEventClick);