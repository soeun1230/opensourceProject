import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import "../../css/ImgList.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import DetailModal from "./DetailModal";
import Pagination from "@mui/material/Pagination"; // mui Pagination 추가

const PeopleList = ({ onSelectedIdsChange }) => {
  const { peopleRepo, setPeopleRepo } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 6; // 페이지당 표시할 항목 수

  const userId = localStorage.getItem("userId");

  const fetchPeopleImages = async () => {
    try {
      const response = await axios.get("/load/people", {
        params: { userId },
      });
      setPeopleRepo(response.data);
      console.log(peopleRepo);
    } catch (error) {
      console.error("Error fetching people images", error);
    }
  };

  const handleCheckboxChange = (file) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = prevSelectedFiles.some(
        (f) => f.peopleId === file.peopleId
      )
        ? prevSelectedFiles.filter((f) => f.peopleId !== file.peopleId)
        : [...prevSelectedFiles, file];
      onSelectedIdsChange(newSelectedFiles);
      return newSelectedFiles;
    });
  };

  const handleDetailClick = async (img) => {
    try {
      console.log("people ID : ", img.peopleId);
      const response = await axios.get("/load/meta/people", {
        params: {
          peopleId: img.peopleId,
        },
      });

      let imgId;

      if (img.peopleId) {
        imgId = "person";
      } else {
        imgId = "thing";
      }

      console.log("이미지 분류 : ", imgId);

      const getBase64 = await axios.post(
        `/base64?id=${img.peopleId}&detail=${imgId}`
      );

      const metadata = response.data;
      const base64 = getBase64.data;

      console.log("metadata : ", metadata);
      console.log("\n base64 : ", base64);

      setSelectedDetail({ ...img, metadata, base64 });

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching metadata", error);
    }
  };

  useEffect(() => {
    fetchPeopleImages();
  }, [userId]);

  // 페이지 전환 핸들러
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // 현재 페이지에 맞는 데이터를 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = peopleRepo.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div
        className="list"
        style={{
          minHeight: "600px", // 전체 높이 고정
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 리스트 컨테이너 */}
        <div style={{ flexGrow: 0 }}>
          {currentItems.map((img) => (
            <div key={img.peopleId} className="sort2">
              <div className="blank">
                <div className="checkBox">
                  <Checkbox
                    checked={selectedFiles.some(
                      (file) => file.peopleId === img.peopleId
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
                      variant: "contained", // 호버 시 contained 스타일 적용
                      backgroundColor: "primary.main", // 기본 색상 유지
                      color: "white", // 텍스트 색상
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

        {/* Pagination을 하단에 고정 */}
        <div
          style={{
            flexGrow: 1, // 남은 공간을 차지하지 않음
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end", // Pagination을 하단에 붙임
            paddingTop: "30px",
          }}
        >
          <Pagination
            count={Math.ceil(peopleRepo.length / itemsPerPage)} // 전체 페이지 수 계산
            page={currentPage} // 현재 페이지
            onChange={handlePageChange} // 페이지 변경 핸들러
            shape="rounded"
            color="primary"
            size="large"
          />
        </div>
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

export default PeopleList;
