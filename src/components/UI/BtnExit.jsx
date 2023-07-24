import React from 'react';
import { logout } from '../../store/slices/auth/authSlice';
import { useDispatch } from 'react-redux';

const HeaderBtn = () => {
  const dispatch = useDispatch();
  const logoutEvt = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('login');
    localStorage.removeItem('user');
    dispatch(logout());
  };
  return (
    <div className="header__buttons-logout">
      <button onClick={logoutEvt} className="btn-logout">
        Выйти
      </button>
    </div>
  );
};

export default HeaderBtn;
