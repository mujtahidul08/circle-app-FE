// import './css/App.css'

import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Reset from './pages/reset';
import Register from './pages/Register';
import Forgot from './pages/forgot';
import PrivateRoute from './routes/privateRoute';
import Follows from './pages/follows';
import Search from './pages/search';
import UserProvider from './hooks/contexts/userContexts';
import useUserStore from './hooks/store/userStore';
import { useEffect, useState } from 'react';
import DetailThread from './pages/detailThread';
import PageProfileUser from './pages/pageProfileUser';
import PageProfileAccount from './pages/pageProfileAccount';

export default function App() {
  const { setUser, setToken } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsInitialized(true);
  }, [setUser, setToken]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route
            element={
              <PrivateRoute />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/follows" element={<Follows />} />
            <Route path="/profile" element={<PageProfileUser/>} />
            <Route path="/profile/:authorId" element={<PageProfileHandler />} />
            <Route path="/search" element={<Search />} />
            <Route path="/thread/:id" element={<DetailThread/>} />
          </Route>
        </Routes>
      </UserProvider>
    </>
  );
}

function PageProfileHandler() {
  const { user } = useUserStore(); // Ambil data user dari state
  const params = useParams<{ authorId: string }>();

  // Jika `authorId` sama dengan `user.id`, arahkan ke halaman profil pengguna
  if (params.authorId === user?.id) {
    return <Navigate to="/profile" replace />;
  }

  return <PageProfileAccount />;
}
