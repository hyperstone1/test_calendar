import React, { useState, useEffect, useMemo } from 'react';
import { host } from '../../constants/constants';
import './index.scss';
import moment from 'moment';
// import Modal from '../Modal/Modal';
import useFetch from '../../hooks/useFetch';
import OpenModalBtn from '../UI/BtnOpenModal';
import Modal from '../UI/Modal';
import BtnEventControl from '../UI/BtnEventControl';

const Events = ({ allEvents, setAllEvents, selectedDay, userName, userLogin, users }) => {
  const [openModal, setOpenModal] = useState(false);
  const [newEvent, setNewEvent] = useState('');
  const [currentEvents, setCurrentEvents] = useState([]);
  const [showBtns, setShowBtns] = useState(false);
  const [time, setTime] = useState('00:00:00');
  const [curEditEvent, setCurEditEvent] = useState('');
  const [hoverCurEvent, setHoverCurEvent] = useState('');
  const [eventNow, setEventNow] = useState({});
  const currentDate = moment().format('DD.MM.YYYY');
  const { deleteEvent } = useFetch({
    urlEvents: `${host}/news`,
    headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
  });
  const modalProps = useMemo(
    () => ({
      openModal,
      setOpenModal,
      userName,
      userLogin,
      time,
      setTime,
      curEditEvent,
      newEvent,
      setNewEvent,
      selectedDay,
      allEvents,
      setAllEvents,
    }),
    [
      openModal,
      setOpenModal,
      userName,
      userLogin,
      time,
      setTime,
      curEditEvent,
      newEvent,
      setNewEvent,
      selectedDay,
      allEvents,
      setAllEvents,
    ],
  );

  //получение всех ивентов для выбранного дня
  useEffect(() => {
    setCurrentEvents(allEvents.filter((item) => item.date.trim() === selectedDay.trim()));
  }, [selectedDay, allEvents]);

  //проверка совпадает ли время какого-либо ивента с текущим временем
  useEffect(() => {
    const timeInterval = setInterval(async () => {
      let date = new Date();
      let timeString = date.toLocaleTimeString();
      // eslint-disable-next-line
      allEvents.map((event) => {
        if (event.date === currentDate && event.time === timeString) {
          setEventNow(event);
          setAllEvents(
            allEvents.map((obj) => (obj.id === event.id ? { ...obj, isPast: true } : obj)),
          );
        }
      });
    }, 700);
    return () => {
      clearInterval(timeInterval);
    };
  }, [allEvents]);

  useEffect(() => {
    if (Object.keys(eventNow).length !== 0) {
      alert(`Событие "${eventNow.event}" только что было воспроизведено, время: ${eventNow.time}`);
    }
  }, [eventNow]);

  // группировка ивентов по пользователям
  const userEvents = useMemo(() => {
    return currentEvents.reduce((acc, item) => {
      if (!acc[item.username]) {
        acc[item.username] = [];
      }
      acc[item.username].push({
        event: item.event,
        time: item.time,
        id: item.id,
        isPast: item.isPast,
      });
      return acc;
    }, {});
  }, [currentEvents]);

  //обработчик удаления ивента
  const delEvent = async (id) => {
    await deleteEvent(id);
    setAllEvents(allEvents.filter((item) => Number(item.id) !== Number(id)));
  };

  //обработчик открытия модалки
  const modalOpenHandle = (event, time, id) => {
    if (event && time && id) {
      setCurEditEvent(id);
      setNewEvent(event);
      setTime(time);
      setOpenModal(true);
    } else {
      setCurEditEvent(null);
      setOpenModal(true);
    }
  };

  //обработчики ховеров
  const handleMouseEnter = (id) => {
    setShowBtns(true);
    setHoverCurEvent(id);
  };

  const handleMouseLeave = () => {
    setShowBtns(false);
    setHoverCurEvent('');
  };

  return (
    <section className="events">
      <div className="events_container">
        <div className="events__main">
          <div className="events__main-title">
            {selectedDay ? `События на ${selectedDay}` : 'Нет выбранного дня'}
          </div>
          <div className="events__main_container">
            {users && users.length > 0
              ? users.map((user) => (
                  <>
                    {userEvents[user.username] ? (
                      <>
                        <h5 className="events__list-item events__list-user">
                          Пользователь: <b>{user.username}</b>
                        </h5>
                        <ul className="events__list">
                          {userEvents[user.username].map((item) => (
                            <li
                              key={item.id}
                              onMouseEnter={() => handleMouseEnter(item.id)}
                              onMouseLeave={handleMouseLeave}
                              className={
                                item.isPast ? 'events__list-item past' : 'events__list-item'
                              }
                            >
                              {item.event}, время: {item.time}
                              {showBtns &&
                              Number(item.id) === Number(hoverCurEvent) &&
                              userName === user.username ? (
                                <div key={item.id} className="events__list-control">
                                  {!item.isPast ? (
                                    <BtnEventControl
                                      className={'events__list-edit  events-btn'}
                                      onClick={() =>
                                        modalOpenHandle(item.event, item.time, item.id)
                                      }
                                      type="edit"
                                    />
                                  ) : null}

                                  <BtnEventControl
                                    className="events__list-del events-btn"
                                    onClick={() => delEvent(item.id)}
                                    type="del"
                                  />
                                </div>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </>
                ))
              : null}
            <Modal {...modalProps} />
            {Object.keys(userEvents).length === 0 && selectedDay ? (
              <span className="events__list-none">На выбранный день нету событий</span>
            ) : null}
          </div>
        </div>
        <div className="events__btns">
          {selectedDay ? <OpenModalBtn modalOpenHandle={modalOpenHandle} /> : null}
        </div>
      </div>
    </section>
  );
};

export default Events;
