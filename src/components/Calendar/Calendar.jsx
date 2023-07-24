import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import 'moment/locale/ru';
import './index.scss';
import { parseDate } from '../../utils/parseDate';

const Calendar = ({ allEvents, setSelectedDay, selectedDay }) => {
  const [currentMonth, setCurrentMonth] = useState(moment().locale('ru'));
  const [calendar, setCalendar] = useState([]);
  const [calendarWithEvents, setCalendarWithEvents] = useState([]);
  const refMonth = useRef(null);
  const currentDay = moment().format('DD.MM.YYYY');

  //обработчик предыдущий на следующий месяц
  const previousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };
  //обработчик переключения на следующий месяц
  const nextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  useEffect(() => {
    let newCalendar = calendar.reduce((result, item) => {
      const matchingEvents = allEvents.filter((event) => event.date === item.date);
      if (matchingEvents.length > 0) {
        item.isEventsExist = true;
        item.events = matchingEvents.map((event) => ({
          userName: event.username,
          event: event.event,
          time: event.time,
        }));
      }
      result.push(item);
      return result;
    }, []);

    setCalendarWithEvents(newCalendar);
  }, [allEvents, calendar]);

  // функция рендера дней календаря
  const renderCalendar = () => {
    const monthStart = currentMonth.clone().startOf('month').startOf('week');
    const monthEnd = currentMonth.clone().endOf('month').endOf('week');
    const today = moment().startOf('day');

    let currentDate = monthStart.clone();
    const calendarLoc = [];

    while (currentDate.isSameOrBefore(monthEnd, 'day')) {
      const isPastDay = currentDate.isBefore(today, 'day');
      const classNames = ['calendar__days-day'];

      if (isPastDay) {
        classNames.push('past-day');
      }

      calendarLoc.push({
        day: currentDate.format('D'),
        date: currentDate.format('DD.MM.YYYY'),
        dateKey: currentDate.format('YYYY-MM-DD'),
        classNames,
        events: [],
        isEventsExist: false,
      });

      currentDate.add(1, 'day');
    }
    setCalendar(calendarLoc);
  };

  // вызывыаем функция рендера
  useEffect(() => {
    renderCalendar();
    //eslint-disable-next-line
  }, [currentMonth, allEvents]);

  //обработчик клика на день
  const onClickDay = async (item) => {
    setSelectedDay(item.date.trim());
  };

  return (
    <div className="wrapper">
      <div className="calendar">
        <div className="calendar__header">
          <button className="calendar__header-prev" onClick={previousMonth}>
            &lt;
          </button>
          <h2 ref={refMonth}>{currentMonth.format('MMMM YYYY')}</h2>
          <button className="calendar__header-next" onClick={nextMonth}>
            &gt;
          </button>
        </div>
        <div className="calendar__body">
          <div className="calendar__week">
            <div className="calendar__week-day">Пн</div>
            <div className="calendar__week-day">Вт</div>
            <div className="calendar__week-day">Ср</div>
            <div className="calendar__week-day">Чт</div>
            <div className="calendar__week-day">Пт</div>
            <div className="calendar__week-day">Сб</div>
            <div className="calendar__week-day">Вс</div>
          </div>
          <div className="calendar__days">
            {calendarWithEvents.map((item) => (
              <div
                key={item.dateKey}
                className={item.classNames.join(' ')}
                onClick={() => onClickDay(item)}
              >
                <span className="date">{item.day}</span>
                {parseDate(item.date) >= parseDate(currentDay) && item.events ? (
                  <ul className="calendar__days-events">
                    {item.events.map((event, id) => (
                      <li key={id} className="calendar__days-event">
                        {event.event}, user: <b>{event.userName}</b>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
