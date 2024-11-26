import React from "react";
import "../index.css";

const Login = () => {
  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth/kakao";
  };

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth/naver";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src="/img/imgcloud_logo.png"
          alt="Logo"
          style={{ margin: "50px" }}
          width="250px"
        />
      </div>

      {/* 카카오 로그인 버튼 */}
      <div>
        <button
          onClick={handleKakaoLogin}
          style={{
            backgroundColor: "#FFF067",
            opacity: "67%",
            border: "None",
            padding: "10px 20px",
            marginTop: "70px",
            cursor: "pointer",
            width: "300px",
            height: "50px",
            borderRadius: "15px",
            fontSize: "14px",
            fontFamily: "Nanum Gothic",
            fontWeight: "700",
          }}
        >
          카카오로 로그인
        </button>
      </div>

      {/* 네이버 로그인 버튼 */}
      <div>
        <button
          onClick={handleNaverLogin}
          style={{
            backgroundColor: "#0DBD14",
            opacity: "67%",
            border: "None",
            padding: "10px 20px",
            marginTop: "30px",
            cursor: "pointer",
            width: "300px",
            height: "50px",
            borderRadius: "15px",
            fontSize: "14px",
            fontFamily: "Nanum Gothic",
            fontWeight: "700",
          }}
        >
          네이버로 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
