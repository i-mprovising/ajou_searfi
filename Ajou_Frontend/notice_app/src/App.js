import { Route, Routes } from "react-router-dom";
//import logo from "./logo.svg";
//import './css/App.css';
import Home from "route/Home";
import Join from "route/Join";
import Login from "route/Login";
import MyPage from "route/MyPage";
import Notice from "route/Notice";
import NoticeMonthly from "route/NoticeMonthly";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/notice/monthly" element={<NoticeMonthly />} />
    </Routes>
  );
}

export default App;
