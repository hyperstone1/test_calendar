import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { host } from './constants/constants';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${host}/itemsTest`);
      setUsers(data);
      console.log(data);
    };
    fetchUsers();
    localStorage.getItem('isAuth') ? setIsAuth(true) : setIsAuth(false);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home isAuth={isAuth} users={users} />} />
      <Route path="/login" element={<Login isAuth={isAuth} setIsAuth={setIsAuth} />} />
      <Route path="/register" element={<Register isAuth={isAuth} setIsAuth={setIsAuth} />} />
    </Routes>
  );
}

export default App;
