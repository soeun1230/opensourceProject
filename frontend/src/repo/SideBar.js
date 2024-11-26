import React from "react";
import { Link } from "react-router-dom";
import "../css/sb-admin-2.css";
import "../css/sb-admin-2.min.css";

const SideBar = () => {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/contRepo"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="logo">
          <img src="img/imgcloud_whitelogo.png" />
        </div>
      </Link>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
        <Link className="nav-link" to="/contRepo">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Image Upload</span>
        </Link>
        <Link className="nav-link" to="/mainRepo">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Storage</span>
        </Link>
        <Link className="nav-link" to="/FunctionExplainRepo">
           <i className="fas fa-fw fa-tachometer-alt"></i>
           <span>기능 설명</span>
        </Link>
      </li>


      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item active">
        <a className="nav-link collapsed" href="/">
          <span>Main Page</span>
        </a>
        <div
          id="collapseTwo"
          className="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        ></div>
      </li>

      {/* Nav Item - Utilities Collapse Menu */}

    </ul>
  );
};

export default SideBar;
