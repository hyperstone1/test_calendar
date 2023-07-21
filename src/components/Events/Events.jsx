import React, { useState, useEffect, useMemo } from 'react';
import { host } from '../../constants/constants';
import './index.scss';
import moment from 'moment';
import Modal from '../Modal/Modal';
import useFetch from '../../hooks/useFetch';

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

  //получение всех ивентов для выбранного дня
  useEffect(() => {
    setCurrentEvents(allEvents.filter((item) => item.date.trim() === selectedDay.trim()));
    console.log('allEvents: ', allEvents);
    console.log('users: ', users);
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
    if (event && time) {
      setCurEditEvent(id);
      setNewEvent(event);
      setTime(time);
      setOpenModal(true);
    } else {
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
                                    <button
                                      onClick={() =>
                                        modalOpenHandle(item.event, item.time, item.id)
                                      }
                                      className={'events__list-edit  events-btn'}
                                    >
                                      <svg
                                        className="feather feather-edit"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </svg>
                                    </button>
                                  ) : null}

                                  <button
                                    onClick={() => delEvent(item.id)}
                                    className="events__list-del events-btn"
                                  >
                                    <svg
                                      width="15px"
                                      height="15px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M18.7069 7.79289C19.0974 8.18342 19.0974 8.81658 18.7069 9.20711L15.914 12L18.7069 14.7929C19.0974 15.1834 19.0974 15.8166 18.7069 16.2071C18.3163 16.5976 17.6832 16.5976 17.2926 16.2071L14.4998 13.4142L11.7069 16.2071C11.3163 16.5976 10.6832 16.5976 10.2926 16.2071C9.90212 15.8166 9.90212 15.1834 10.2926 14.7929L13.0855 12L10.2926 9.20711C9.90212 8.81658 9.90212 8.18342 10.2926 7.79289C10.6832 7.40237 11.3163 7.40237 11.7069 7.79289L14.4998 10.5858L17.2926 7.79289C17.6832 7.40237 18.3163 7.40237 18.7069 7.79289Z"
                                        fill="#000000"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.30958 3.54424C7.06741 2.56989 8.23263 2 9.46699 2H20.9997C21.8359 2 22.6103 2.37473 23.1614 2.99465C23.709 3.61073 23.9997 4.42358 23.9997 5.25V18.75C23.9997 19.5764 23.709 20.3893 23.1614 21.0054C22.6103 21.6253 21.8359 22 20.9997 22H9.46699C8.23263 22 7.06741 21.4301 6.30958 20.4558L0.687897 13.2279C0.126171 12.5057 0.126169 11.4943 0.687897 10.7721L6.30958 3.54424ZM9.46699 4C8.84981 4 8.2672 4.28495 7.88829 4.77212L2.2666 12L7.88829 19.2279C8.2672 19.7151 8.84981 20 9.46699 20H20.9997C21.2244 20 21.4674 19.9006 21.6665 19.6766C21.8691 19.4488 21.9997 19.1171 21.9997 18.75V5.25C21.9997 4.88294 21.8691 4.5512 21.6665 4.32337C21.4674 4.09938 21.2244 4 20.9997 4H9.46699Z"
                                        fill="#000000"
                                      />
                                    </svg>
                                  </button>
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
            <Modal
              openModal={openModal}
              setOpenModal={setOpenModal}
              userName={userName}
              userLogin={userLogin}
              time={time}
              setTime={setTime}
              curEditEvent={curEditEvent}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              selectedDay={selectedDay}
              allEvents={allEvents}
              setAllEvents={setAllEvents}
            />
            {Object.keys(userEvents).length === 0 && selectedDay ? (
              <span className="events__list-none">На выбранный день нету событий</span>
            ) : null}
          </div>
        </div>
        <div className="events__btns">
          {selectedDay ? (
            <button onClick={modalOpenHandle} className="events__btns-add">
              Новое
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Events;
