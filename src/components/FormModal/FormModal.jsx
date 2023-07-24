import React, { useState } from 'react';
import { TimePicker } from 'antd';
import { generateId } from '../../utils/generateId';
import { host } from '../../constants/constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import moment from 'moment';
import BtnModal from '../UI/BtnModal';
import InputModal from '../UI/InputModal';
import useFetch from '../../hooks/useFetch';
dayjs.extend(customParseFormat);

const FormModal = ({
  setOpenModal,
  time,
  setTime,
  userName,
  userLogin,
  curEditEvent,
  selectedDay,
  newEvent,
  setNewEvent,
  setAllEvents,
  allEvents,
  onModalClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { appendEvent, putEvent } = useFetch({
    urlEvents: `${host}/news`,
    headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    curEditEvent,
    body: {
      username: userName,
      login: userLogin,
      event: newEvent,
      date: selectedDay,
      time,
    },
  });

  //обработчик изменения времени
  const onChange = (time, timeString) => {
    setTime(timeString);
  };
  //отправка формы
  const clickAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let idEvent = generateId();
    let date = new Date();
    let timeString = date.toLocaleTimeString();
    let isCurDate = selectedDay === moment().clone().format('DD.MM.YYYY');

    if (time < timeString && isCurDate) {
      alert('Введенное вами время уже прошло');
      setIsLoading(false);
    } else {
      if (newEvent.length < 3) {
        alert('Введите больше 3 символов');
        setIsLoading(false);
      } else {
        if (curEditEvent) {
          await putEvent();
          setAllEvents(
            allEvents.map((obj) =>
              obj.id === curEditEvent ? { ...obj, event: newEvent, time: time } : obj,
            ),
          );
        } else {
          const dataId = await appendEvent();
          setAllEvents([
            ...allEvents,
            {
              id: dataId.id,
              idEvent,
              username: userName,
              login: userLogin,
              event: newEvent,
              date: selectedDay,
              time,
            },
          ]);
        }
        setTimeout(() => {
          setNewEvent('');
          setTime('00:00:00');
          setIsLoading(false);
          setOpenModal(false);
        }, 2000);
      }
    }
  };

  return (
    <>
      <h3 className="modal__title">Новое событие</h3>

      <form className="modal__form" onSubmit={clickAdd}>
        <div className="events__new">
          <label htmlFor="event">Событие</label>
          <InputModal newEvent={newEvent} setNewEvent={setNewEvent} isLoading={isLoading} />
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
          <BtnModal
            type="submit"
            className="events__btns-add"
            onClick={clickAdd}
            isLoading={isLoading}
          >
            Добавить
          </BtnModal>
          <BtnModal
            type="button"
            className="events__btns-close"
            onClick={onModalClose}
            isLoading={isLoading}
          >
            Закрыть
          </BtnModal>
        </div>
      </form>
    </>
  );
};

export default FormModal;
