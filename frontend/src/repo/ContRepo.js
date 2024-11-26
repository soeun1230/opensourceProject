//연속레포의 메인레포
import Header from "./header/Header";
import ContThingRepo from "./ContThingRepo";
import ContPeopleRepo from "./ContPeopleRepo";
import SideBar from "./SideBar";
import "../css/sb-admin-2.css";
import "../css/sb-admin-2.min.css";

const ContRepo = () => {
  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <SideBar />
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Header theme="cont" style={{ flexShrink: 0 }} />
          <div className="container-fluid">
            <div style={{ display: "flex", flexGrow: 1 }}>
              <ContThingRepo style={{ flexGrow: 1 }} />
              <ContPeopleRepo style={{ flexGrow: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContRepo;
