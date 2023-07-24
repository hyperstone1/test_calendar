import React from 'react';

const InputModal = ({ newEvent, setNewEvent, isLoading }) => {
  return (
    <input
      name="event"
      value={newEvent}
      onChange={(e) => setNewEvent(e.target.value)}
      className="events__new-input"
      placeholder="Напишите событие"
      disabled={isLoading ? true : false}
    />
  );
};

export default InputModal;
