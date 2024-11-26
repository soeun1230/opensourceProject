import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import "../../css/ImgList.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import DetailModal from "./DetailModal";
import Pagination from "@mui/material/Pagination"; // mui Pagination 추가

const ThingList = ({ onSelectedIdsChange }) => {
  const { thingRepo, setThingRepo } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 6; // 페이지당 표시할 항목 수

  const userId = localStorage.getItem("userId");

  const fetchThingImages = async () => {
    try {
      const response = await axios.get("/load/thing", {
        params: { userId },
      });
      setThingRepo(response.data);
    } catch (error) {
      console.error("Error fetching thing images", error);
    }
  };

  const handleCheckboxChange = (file) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = prevSelectedFiles.some(
        (f) => f.thingId === file.thingId
      )
        ? prevSelectedFiles.filter((f) => f.thingId !== file.thingId)
        : [...prevSelectedFiles, file];
      onSelectedIdsChange(newSelectedFiles); // 부모 컴포넌트로 선택된 파일들 전달
      return newSelectedFiles;
    });
  };

  useEffect(() => {
    fetchThingImages();
  }, [userId, setThingRepo]);

  const handleDetailClick = async (img) => {
    try {
      console.log("thing ID : ", img.thingId);
      const response = await axios.get("/load/meta/thing", {
        params: {
          thingId: img.thingId,
        },
      });

      let imgId;

      if (img.peopleId) {
        imgId = "people";
      } else {
        imgId = "thing";
      }

      console.log("이미지 분류 : ", imgId);
      console.log("id 타입 : ", typeof img.thingId);

      const getBase64 = await axios.post(
        `/base64?id=${img.thingId}&detail=${imgId}`
      );

      const metadata = response.data;
      const base64 = getBase64.data;

      console.log("metadata : ", metadata);

      setSelectedDetail({ ...img, metadata, base64 });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching metadata", error);
    }
  };

  // 페이지 전환 핸들러
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // 현재 페이지에 맞는 데이터를 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = thingRepo.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      className="list"
      style={{
        minHeight: "600px", // pagination 높이 고정
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flexGrow: 0 }}>
        {currentItems.map((img) => (
          <div key={img.thingId} className="sort2" style={{}}>
            <div className="blank">
              <div className="checkBox">
                <Checkbox
                  checked={selectedFiles.some(
                    (file) => file.thingId === img.thingId
                  )}
                  onChange={() => handleCheckboxChange(img)}
                />
              </div>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  backgroundImage: `url(${img.smallImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
            <div className="filename">{img.imageTitle}</div>
            <div className="score">{img.brisqueScore}</div>
            <div className="detail">
              <Button
                variant="outlined"
                sx={{
                  fontWeight: "bold",
                  "&:hover": {
                    variant: "contained",
                    backgroundColor: "primary.main",
                    color: "white",
                  },
                }}
                onClick={() => handleDetailClick(img)}
              >
                상세보기
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end", // 하단에 고정
          paddingTop: "30px",
        }}
      >
        <Pagination
          count={Math.ceil(thingRepo.length / itemsPerPage)} // 전체 페이지 수 계산
          page={currentPage} // 현재 페이지
          onChange={handlePageChange} // 페이지 변경
          shape="rounded"
          color="primary"
          size="large"
        />
      </div>

      {isModalOpen && (
        <DetailModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          detailData={selectedDetail}
        />
      )}
    </div>
  );
};

export default ThingList;
