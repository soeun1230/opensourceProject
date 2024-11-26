//src\repo\MainRepo.js

import PeopleRepo from "./PeopleRepo";
import ThingRepo from "./ThingRepo";
import Header from "./header/Header";
import SideBar from "./SideBar";
import "../css/sb-admin-2.css";
import "../css/sb-admin-2.min.css";

const MainRepo = () => {
  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <SideBar />
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Header style={{ flexShrink: 0 }} />
          <div className="container-fluid">
            <div style={{ display: "flex", flexGrow: 1 }}>
              <ThingRepo style={{ flexGrow: 1 }} />
              <PeopleRepo style={{ flexGrow: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainRepo;
