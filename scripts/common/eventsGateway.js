const baseUrl = 'https://613b202e110e000017a4549e.mockapi.io/v1/events';

export const getEvents = () => fetch(baseUrl).then(response => response.json());

export const createEvent = newEvent =>
  fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(newEvent),
  });

export const updateEvent = (updatedEvent, eventId) =>
  fetch(`${baseUrl}/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(updatedEvent),
  });

export const deleteEvent = eventId =>
  fetch(`${baseUrl}/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });