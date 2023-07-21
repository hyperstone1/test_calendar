import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';
import Events from '../../components/Events/Events';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/auth/authSlice';
import useFetch from '../../hooks/useFetch';
import { host } from '../../constants/constants';
import moment from 'moment';

const Home = () => {
  const currentDate = moment().format('DD.MM.YYYY');
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('');
  const [userName, setUserName] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { getUsers, getEvents, usersData, data } = useFetch({
    headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    urlUsers: `${host}/itemsTest`,
    urlEvents: `${host}/news`,
  });

  //запросы на получение всех событий и юзеров
  useEffect(() => {
    const fetchData = async () => {
      await getEvents();
      await getUsers();
    };
    fetchData();
  }, []);

  //проверка - прошедшее ли событие
  useEffect(() => {
    if (data) {
      let time = new Date();
      let timeString = time.toLocaleTimeString();
      const newData = data.map((item) => ({
        ...item,
        isPast: item.date === currentDate && item.time < timeString,
      }));
      setAllEvents(newData);
    }
  }, [data]);
 
  useEffect(() => {
    const storage = localStorage.getItem('isAuth');
    if (storage) {
      const login = localStorage.getItem('login');
      const username = localStorage.getItem('user');
      dispatch(setUser({ isAuth: true, username, login }));
      setUserName(localStorage.getItem('user'));
      setUserLogin(localStorage.getItem('login'));
    } else {
      navigate('/login');
    }
  }, [isAuth]);

  return isAuth ? (
    <>
      <section className="home">
        <div className="home_container">
          <Calendar
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            userName={userName}
            allEvents={allEvents}
          />
          <Events
            selectedDay={selectedDay}
            userName={userName}
            users={usersData}
            isAuth={isAuth}
            userLogin={userLogin}
            allEvents={allEvents}
            setAllEvents={setAllEvents}
          />
        </div>
      </section>
    </>
  ) : null;
};

export default Home;
