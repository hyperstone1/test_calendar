import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';
import Events from '../../components/Events/Events';
import './index.scss';

const Home = ({ isAuth, users }) => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('');
  const [userName, setUserName] = useState('');
  const [userLogin, setUserLogin] = useState('');

  useEffect(() => {
    if (isAuth) {
      setUserName(localStorage.getItem('user'));
      setUserLogin(localStorage.getItem('login'));
    } else {
      navigate('/login');
    }
  }, [isAuth]);

  return isAuth ? (
    <section className="home">
      <div className="home_container">
        <Calendar setSelectedDay={setSelectedDay} userName={userName} />
        <Events
          selectedDay={selectedDay}
          userName={userName}
          users={users}
          isAuth={isAuth}
          userLogin={userLogin}
        />
      </div>
    </section>
  ) : null;
};

export default Home;
