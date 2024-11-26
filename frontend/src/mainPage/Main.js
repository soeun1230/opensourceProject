import React, { useState, useEffect } from "react";
import "../css/styles.css";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import SendIcon from "@mui/icons-material/Send";

const Main = () => {
  const navigate = useNavigate();

  const moveRepo = () => {
    navigate("/mainRepo");
  };

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth/kakao";
  };

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth/naver";
  };

  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleMenuClick = (event) => {
    if (userId) {
      moveRepo();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="" />
      <meta name="author" content="" />
      <title>New Age - Start Bootstrap Theme</title>
      <link rel="icon" type="image/x-icon" href="../public/img/favicon.ico" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <link href="../css/styles.css" rel="stylesheet" />

      <div className="navbar">
        <div style={{ marginTop: "30px",marginLeft: "180px", fontFamily: "Kanit", fontWeight: "600", fontSize: "21px" }}>
          Img Cloud
        </div>
        <div>
          <Button
            variant="contained"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="large"
            endIcon={userId ? <SendIcon /> : <LoginIcon />}
            sx={{
              marginRight: "180px",
              marginTop: "30px",
              fontFamily: "Kanit",
              fontWeight: "bold",
              borderRadius: "20px",
            }}
          >
            {userId ? "Get Started" : "Login"}
          </Button>

          {!userId && (
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <img
                  src="img/kakao_login_large.png"
                  alt="카카오로 로그인"
                  onClick={handleKakaoLogin}
                  style={{
                    cursor: "pointer",
                    width: "200px",
                    height: "50px",
                  }}
                />
              </MenuItem>
              <MenuItem>
                <img
                  src="img/btnW.png"
                  alt="네이버로 로그인"
                  onClick={handleNaverLogin}
                  onMouseOver={(e) => (e.currentTarget.src = "img/btnG.png")}
                  onMouseOut={(e) => (e.currentTarget.src = "img/btnW.png")}
                  style={{
                    cursor: "pointer",
                    width: "200px",
                    height: "50px",
                  }}
                />
              </MenuItem>
            </Menu>
          )}
        </div>
      </div>

      <section id="features">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-8 order-lg-1 mb-5 mb-lg-0">
              {/* Features content */}
              <div className="container-fluid px-5">
                <div className="row gx-5">
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-image icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Choose Best Shot</h3>
                      <p className="text-muted mb-0">
                        Explore our photo quality assessment tool and choose your best shot with confidence.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-tools icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Additional Functions</h3>
                      <p className="text-muted mb-0">
                        You can convert your file format, compress files without quality loss, and remove noise.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-5 mb-md-0">
                    <div className="text-center">
                      <i className="bi-cloud-upload icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Store Pictures</h3>
                      <p className="text-muted mb-0">
                        You can store you best shots with just one click.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center">
                      <i className="bi-patch-check icon-feature text-gradient d-block mb-3" />
                      <h3 className="font-alt">Open Source</h3>
                      <p className="text-muted mb-0">
                        OpenCV and BRISQUE were used to measure image quality scores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 order-lg-0">
              <div className="screen" style={{ position: "relative", zIndex: 2, backgroundColor: "transparent" }}>
                <img
                  src="img/mainpic.png"
                  alt="Main Picture"
                  style={{
                    width: "270%", // 이미지 크기 키우기
                    height: "300%", // 높이 조정
                    position: "relative",
                    zIndex: 3,
                    transform: "translate(-33%, -15%)" // 위치 조정
                  }}
                />
              </div>
              <div className="features-device-mockup" style={{ position: "relative", zIndex: 1 }}>
                {/* Other shapes removed */}
                <svg className="shape-1 d-none d-sm-block" viewBox="0 0 240.83 240.83" xmlns="http://www.w3.org/2000/svg">
                  <rect x="-32.54" y="78.39" width="305.92" height="84.05" rx="42.03" transform="translate(120.42 -49.88) rotate(45)" />
                  <rect x="-32.54" y="78.39" width="305.92" height="84.05" rx="42.03" transform="translate(-49.88 120.42) rotate(-45)" />
                </svg>
                <svg className="shape-2 d-none d-sm-block" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx={50} cy={50} r={50} />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
