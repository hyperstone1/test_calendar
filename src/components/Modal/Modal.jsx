import React, { useState, useRef } from 'react';
import { TimePicker } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { generateId } from '../../utils/generateId';
import axios from 'axios';
import { host } from '../../constants/constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const Modal = ({
  setOpenModal,
  time,
  setTime,
  openModal,
  userName,
  userLogin,
  curEditEvent,
  selectedDay,
  newEvent,
  setNewEvent,
  setAllEvents,
  allEvents,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const refModal = useRef(null);

  //закрытие модального окна
  const onModalClose = () => {
    if (refModal.current) {
      refModal.current.classList.add('disapp');
      setTimeout(() => {
        refModal.current.classList.remove('disapp');
        setOpenModal(false);
      }, 500);
    }
  };

  //обработчик изменения времени
  const onChange = (time, timeString) => {
    console.log(time);
    console.log(timeString);
    setTime(timeString);
  };
  //отправка формы
  const clickAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let idEvent = generateId();
    let date = new Date();
    let timeString = date.toLocaleTimeString();

    console.log(time, timeString);
    if (time < timeString) {
      alert('Введенное вами время уже прошло');
      setIsLoading(false);
    } else {
      if (curEditEvent) {
        await axios.put(`${host}/news/${curEditEvent}`, {
          event: newEvent,
          time,
        });
        setAllEvents(
          allEvents.map((obj) =>
            obj.id === curEditEvent
              ? { ...obj, idEvent: idEvent, event: newEvent, time: time }
              : obj,
          ),
        );
      } else {
        const { data } = await axios.post(`${host}/news`, {
          idEvent,
          username: userName,
          login: userLogin,
          event: newEvent,
          day: selectedDay,
          time,
        });
        setAllEvents([
          ...allEvents,
          {
            id: data.id,
            idEvent,
            username: userName,
            login: userLogin,
            event: newEvent,
            day: selectedDay,
            time,
          },
        ]);
        console.log('idEdatavent: ', data);
      }
      setTimeout(() => {
        setNewEvent('');
        setIsLoading(false);
        setOpenModal(false);
      }, 2000);
    }
  };

  //спиннер
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return openModal ? (
    <div className="modal" ref={refModal}>
      <div className="modal_container">
        <h3 className="modal__title">Новое событие</h3>
        <form className="modal__form" onSubmit={clickAdd}>
          <div className="events__new">
            <label htmlFor="event">Событие</label>
            <input
              name="event"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="events__new-input"
              placeholder="Напишите событие"
              disabled={isLoading ? true : false}
            />
          </div>
          <div className="events__new">
            <label htmlFor="event">Время</label>
            <TimePicker
              disabled={isLoading ? true : false}
              onChange={onChange}
              value={dayjs(time, 'HH:mm:ss')}
              placeholder="Выберите время"
            />
          </div>
          <div className="events__btns">
            <button type="submit" className="events__btns-add" disabled={isLoading ? true : false}>
              {isLoading ? <Spin indicator={antIcon} /> : 'Добавить'}
            </button>
            <button
              onClick={onModalClose}
              type="button"
              className="events__btns-close"
              disabled={isLoading ? true : false}
            >
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default Modal;
