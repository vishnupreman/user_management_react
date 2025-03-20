
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/user/Login';
import Profile from './components/user/Profile';
import Register from './components/user/Registration';
import Home from './components/user/Home';
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import AdminLogin from "./components/admin/AdminLogin";

function App() {


  return(
    <Router>
      <Routes>
      <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/profile" element={<ProtectedUserRoute element={<Profile/>} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
      </Routes>
    </Router>
  )
}

export default App
