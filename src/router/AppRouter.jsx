import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import { useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';

const AppRouter = ({ users }) => {
  const { isAuth } = useSelector((state) => state.auth);
  const routes = {
    Home: <Home users={users} />,
    Login: <Login />,
    Register: <Register />,
    // ErrorPage: ,
  };
  return (
    <Routes>
      {isAuth ? (
        <>
          <Route path="/" element={routes.Home} />
          <Route path="/login" element={routes.Login} />
          <Route path="/register" element={routes.Register} />
        </>
      ) : (
        <>
          <Route path="/login" element={routes.Login} />
          <Route path="/register" element={routes.Register} />
          <Route path="/" element={<Navigate to="/login" />} />
        </>
      )}
      {/* <Route path="*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
};

export default AppRouter;
