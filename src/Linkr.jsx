import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FeedPage from "./pages/feed";
import { useState } from "react";
import TokenContext from "./contexts/TokenContext";
import MyProfilePage from "./pages/myProfile";

export default function Linkr() {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/user/my-profile" element={<MyProfilePage />} />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
}
