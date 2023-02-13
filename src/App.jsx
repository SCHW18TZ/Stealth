import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import MyAccount from "./Pages/MyAccount";
import CreatePost from "./Pages/CreatePost";
import Reset from "./Pages/Reset";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route
          path="*"
          element={<h1 className="NotFound">404: Not Found</h1>}
        />
      </Routes>
    </Router>
  );
}

export default App;
