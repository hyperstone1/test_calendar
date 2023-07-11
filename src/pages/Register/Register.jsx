import { Button, Checkbox, Form, Input } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { host } from '../../constants/constants';

const Register = ({ setIsAuth }) => {
  const [userName, setUserName] = useState();
  const [pass, setPass] = useState();
  const [login, setLogin] = useState();

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const { data } = await axios.post(`${host}/itemsTest`, { username: userName, login, pass });
    alert('успешно зарегистрирован');
    setIsAuth(true);
    localStorage.setItem('isAuth', true);
    localStorage.setItem('user', userName);
    localStorage.setItem('login', login);
    navigate('/');
  };

  return (
    <div className="container__login">
      <div className="container__form">
        <h2 className="form__title">Регистрация</h2>
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
            name="username"
            label="Имя пользователя"
            rules={[
              {
                type: 'username',
                message: 'Введено неверное имя пользователя!',
              },
              {
                required: true,
                message: 'Пожалуйста, введите имя пользователя!',
              },
            ]}
          >
            <Input
              className="form__input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="login"
            label="Логин"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш логин!',
              },
            ]}
            hasFeedback
          >
            <Input
              className="form__input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: 'Пожалуйста, введите ваш пароль!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              className="form__input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Пожалуйста, подтвердите свой пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Новый пароль, который вы ввели, не совпадает!'));
                },
              }),
            ]}
          >
            <Input.Password className="form__input" />
          </Form.Item>
          <Form.Item
            name="agreement"
            className="form__checkbox"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Необходимо принять соглашение')),
              },
            ]}
          >
            <Checkbox>Я прочитал соглашение</Checkbox>
          </Form.Item>
          <div className="link_container">
            <span>У вас уже есть аккаунт?</span>
            <span>
              <Link to="/login" className="link">
                Авторизоваться
              </Link>
            </span>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
