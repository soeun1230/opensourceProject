import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const NaverRedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const handleOAuthNaver = async (code) => {
    try {
      // 네이버로부터 받아온 code를 서버에 전달하여 카카오로 회원가입 & 로그인한다
      const response = await axios.post(
        `http://localhost:8080/oauth/login/naver?code=${code}`
      );
      const data = response.data; // 응답 데이터
      alert("로그인 성공");
      localStorage.setItem("email", data.email);
      localStorage.setItem("nickname", data.nickname);
      localStorage.setItem("picture", data.picture);
      localStorage.setItem("userId", data.userId);
      setUser({
        userId: data.userId,
        email: data.email,
        nickname: data.nickname,
        picture: data.picture,
      });
      navigate("/mainRepo");
    } catch (error) {
      navigate("/fail");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code"); // 네이버는 Redirect 시키면서 code를 쿼리 스트링으로 준다.
    if (code) {
      handleOAuthNaver(code);
    }
  }, [location]);

  return (
    <div>
      <div>Processing...</div>
    </div>
  );
};

export default NaverRedirectPage;
