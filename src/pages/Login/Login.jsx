import { Button, Checkbox, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { host } from '../../constants/constants';
import './index.scss';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/auth/authSlice';
import useFetch from '../../hooks/useFetch';

const Login = () => {
  const [pass, setPass] = useState();
  const [login, setLogin] = useState();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { getUsers, usersData } = useFetch({
    headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
    urlUsers: `${host}/itemsTest`,
    urlEvents: `${host}/news`,
  });

  //отправляем запрос на получение юзеров
  useEffect(() => {
    const fetchUsers = async () => {
      await getUsers();
    };
    fetchUsers();
  }, []);

  const onFinish = (values) => {
    console.log('usersData: ', usersData);
    const userExist = usersData.find((user) => user.login === login && user.pass === pass);
    if (userExist) {
      dispatch(setUser({ isAuth: true, login: userExist.login, password: userExist.password }));

      localStorage.setItem('isAuth', true);
      localStorage.setItem('user', userExist.username);
      localStorage.setItem('login', login);
      navigate('/');
    } else {
      alert('Пользователя с таким логином и паролем не существует');
    }
  };

  return (
    <div className="container__login">
      <div className="container__form">
        <h2 className="form__title">Авторизация</h2>
        <Form
          className="form__auth"
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="login"
            label="Логин"
            rules={[
              {
                type: 'login',
                message: 'The input is not valid login!',
              },
              {
                required: true,
                message: 'Please input your login!',
              },
            ]}
          >
            <Input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="form__input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="form__input"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            className="form__checkbox"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
              },
            ]}
          >
            <Checkbox>
              Я прочитал <a href="">соглашение</a>
            </Checkbox>
          </Form.Item>
          <div className="link_container">
            <span>У вас еще нет аккаунта?</span>
            <span>
              <Link to="/register" className="link ">
                Зарегистрироваться
              </Link>
            </span>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
