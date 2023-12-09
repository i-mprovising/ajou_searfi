import React from 'react';
import ReactDOM from 'react-dom/client';
import "css/index.css";
import "css/style.css";
import App from "App";
import { BrowserRouter } from "react-router-dom";
import BarHeader from "barHeader";
import reportWebVitals from "reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> {/* StrictMode를 사용하면 렌더링이 두 번 발생함 (Strict는 개발 모드에서만 활성화되고 프로덕션 빌드에는 영향을 주지 않음) */}
    <BrowserRouter>
      <BarHeader />
      <div className="appContainer">
      <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
