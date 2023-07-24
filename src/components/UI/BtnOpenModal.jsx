import React from 'react';

const OpenModalBtn = ({modalOpenHandle}) => {
  return (
    <button onClick={modalOpenHandle} className="events__btns-add">
      Новое
    </button>
  );
};

export default OpenModalBtn;
