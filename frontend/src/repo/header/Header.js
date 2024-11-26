import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, MenuItem, IconButton } from "@mui/material";
import "../../css/Header.css";
import "../../css/sb-admin-2.css";
import "../../css/sb-admin-2.min.css";

const Header = ({ theme }) => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // State to manage Menu open/close
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleMenuClose(); // Close menu after logout
  };

  return (
    <div className="header">
      <div className="h4 mb-0 text-gray-800">
        {theme === "cont" ? "Image Upload" : theme === "function" ? "기능 설명" : "Storage"}
      </div>

      <div className="userInfo">
        <div>{localStorage.getItem("nickname")}</div>
        <IconButton onClick={handleMenuOpen}>
          <img
            className="img-profile rounded-circle"
            src="img/undraw_profile.svg"
            alt="profile"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem disabled>{localStorage.getItem("email")}</MenuItem>
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
