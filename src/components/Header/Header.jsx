import React from 'react';
import './index.scss';
import BtnExit from '../UI/BtnExit';
import logo from '../../logo.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="header_container">
        <div className="header__logo">
          <div className="header__logo-img">
            <img src={logo} alt="" />
          </div>
          <div className="header__logo-text">
            React<b>Calendar</b>
          </div>
        </div>
        <div className="header__buttons">
          <BtnExit />
        </div>
      </div>
    </header>
  );
};

export default Header;
