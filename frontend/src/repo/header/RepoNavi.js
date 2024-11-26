import "../../css/RepoNavi.css";
import React, { useRef } from "react";
import ImgUpload from "./ImgUpload";
import PersonImgUpload from "./PersonImgUpload";

// 나중에 .png .svg 파일로 바꾸기
const RepoNavi = ({
  repoName,
  repoType,
  onDeleteClick,
  onDownloadClick,
  onZipDownloadClick,
}) => {
  const imgUploadRef = useRef(null);

  const handleUploadClick = () => {
    imgUploadRef.current.triggerFileInput();
  };

  return (
    <div className="RepoNavi">
      <div className="RepoName">{repoName}</div>
      <div className="buttonList">
        {repoType === "thing" ? (
          <ImgUpload ref={imgUploadRef} repoType={repoType} />
        ) : (
          <PersonImgUpload ref={imgUploadRef} />
        )}
        <div className="button" onClick={handleUploadClick}>
          <img src="img/upload.png" />
          <div>사진 올리기</div>
        </div>
        <div className="button" onClick={onDownloadClick}>
          <img src="img/download.png" />
          <div>사진 내려받기</div>
        </div>
        <div className="button" onClick={onZipDownloadClick}>
          <img src="img/zip.png" />
          <div>사진 압축하기</div>
        </div>
        <div className="button" onClick={onDeleteClick}>
          <img src="img/delete.png" />
          <div>사진 삭제하기</div>
        </div>
      </div>
    </div>
  );
};

export default RepoNavi;
