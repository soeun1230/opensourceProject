import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import "../../css/ImgList.css";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";

const ContThingList = ({ onSelectedIdsChange }) => {
  const { contThingRepo } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 6; // 페이지당 항목 수

  const handleCheckboxChange = (file) => {
    setSelectedFiles((prevSelectedFiles) => {
      const isSelected = prevSelectedFiles.some((f) => f.id === file.id);
      const newSelectedFiles = isSelected
        ? prevSelectedFiles.filter((f) => f.id !== file.id)
        : [...prevSelectedFiles, file];

      onSelectedIdsChange(newSelectedFiles);
      return newSelectedFiles;
    });
  };

  // 페이지 전환 핸들러
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // 현재 페이지에 맞는 항목들 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contThingRepo.slice(indexOfFirstItem, indexOfLastItem);

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
          <div key={img.id} className="sort2">
            <div className="blank">
              <div className="checkBox">
                <Checkbox
                  checked={selectedFiles.some((file) => file.id === img.id)}
                  onChange={() => handleCheckboxChange(img)}
                />
              </div>
              <img
                src={URL.createObjectURL(img.file)}
                style={{ width: "70px", height: "70px", objectFit: "cover" }}
                alt={img.imageTitle}
              />
            </div>
            <div className="filename2">{img.file.name}</div>
            <div className="score2">{img.score}</div>
          </div>
        ))}
      </div>

      {/* Pagination 컴포넌트 추가 */}
      <div
        style={{
          flexGrow: 1, // 리스트가 페이지 안에서 남은 공간을 차지하게 만듦
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end", // 하단에 고정
          paddingTop: "30px",
        }}
      >
        <Pagination
          count={Math.ceil(contThingRepo.length / itemsPerPage)} // 전체 페이지 수 계산
          page={currentPage} // 현재 페이지
          onChange={handlePageChange} // 페이지 변경 핸들러
          shape="rounded"
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default ContThingList;
