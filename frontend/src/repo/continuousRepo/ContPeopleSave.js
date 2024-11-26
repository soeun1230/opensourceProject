import React, { useState, useRef } from "react";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Modal from "react-modal";
import { useAppContext } from "../../context/AppContext";
import { resizeImage, extractMetadata } from "../../util/ImgUtils";

Modal.setAppElement("#root");

const ContPeopleSave = ({ selectedFiles = [] }) => {
  const { setPeopleRepo } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const cropperRef = useRef(null);

  const formatFileSize = (size) => {
      return (size/104876).toFixed(2)+" MB";
    };

  const handleSaveClick = () => {
    if (selectedFiles.length > 0) {
      setCurrentFileIndex(0);
      openModalForCurrentFile(0);
    }
  };

  const openModalForCurrentFile = (index) => {
    const file = selectedFiles[index];
    if (file) {
      const url = URL.createObjectURL(file.file);
      setImageUrl(url);
      setIsModalOpen(true);
    }
  };

  const handleCropComplete = async () => {
    if (cropperRef.current && selectedFiles[currentFileIndex]) {
      const cropper = cropperRef.current.cropper;
      const cropData = cropper.getData();
      const currentFile = selectedFiles[currentFileIndex];
      const fileType = currentFile.file.name.split(".").pop(); // 파일 확장자 추출
      const smallFile = await resizeImage(currentFile.file, 70); // smallImage 생성
      const metadata = await extractMetadata(currentFile.file); // 메타데이터 추출
      const fileSize = formatFileSize(currentFile.file.size); // 파일 크기 변환

      // 메타데이터 품질 점수 계산
      let metaScore = 0;
      if (metadata.ISO && metadata.ISO >= 100) metaScore += 1;
      if (metadata.FStop && metadata.FStop >= 1.0) metaScore += 1;
      if (metadata.WhiteBalance !== undefined) metaScore += 1;
      if (metadata.ExposureTime && metadata.ExposureTime > 0) metaScore += 1;
      if (
        metadata.Resolution &&
        metadata.Resolution !== "0x0" &&
        metadata.Resolution !== null
      )
        metaScore += 1;

      // 메타데이터 undefined 값 변환
      const safeMetadata = {
        ISO: metadata.ISO ?? 0,
        FStop: metadata.FStop ?? 0.0,
        WhiteBalance: metadata.WhiteBalance ?? 0,
        ExposureTime: metadata.ExposureTime ?? 0.0,
        Resolution: metadata.Resolution ?? "0x0",
        RealResolution: metadata.RealResolution ?? "0x0",
        GPSLatitude: metadata.GPSLatitude ?? "0:0:0",
        GPSLongitude: metadata.GPSLongitude ?? "0:0:0",
      };

      const formData = new FormData();
      formData.append("image", currentFile.file);
      formData.append("size", fileSize);
      formData.append(
        "cropData",
        new Blob([JSON.stringify(cropData)], { type: "application/json" })
      );
      formData.append("fileType", fileType);
      formData.append("smallFiles", smallFile);
      formData.append(
        "imageTitle",
        new Blob([JSON.stringify({ titles: [currentFile.file.name] })], {
          type: "application/json",
        })
      );
      formData.append(
        "FStop",
        new Blob([JSON.stringify(safeMetadata.FStop)], {
          type: "application/json",
        })
      );
      formData.append(
        "ISO",
        new Blob([JSON.stringify(safeMetadata.ISO)], {
          type: "application/json",
        })
      );
      formData.append(
        "ExposureTime",
        new Blob([JSON.stringify(safeMetadata.ExposureTime)], {
          type: "application/json",
        })
      );
      formData.append(
        "GPSLatitude",
        new Blob([JSON.stringify(safeMetadata.GPSLatitude)], {
          type: "application/json",
        })
      );
      formData.append(
        "GPSLongitude",
        new Blob([JSON.stringify(safeMetadata.GPSLongitude)], {
          type: "application/json",
        })
      );
      formData.append(
        "RealResolution",
        new Blob([JSON.stringify(safeMetadata.RealResolution)], {
          type: "application/json",
        })
      );
      formData.append(
        "Resolution",
        new Blob([JSON.stringify(safeMetadata.Resolution)], {
          type: "application/json",
        })
      );
      formData.append(
        "WhiteBalance",
        new Blob([JSON.stringify(safeMetadata.WhiteBalance)], {
          type: "application/json",
        })
      );
      formData.append("userId", localStorage.getItem("userId"));
      formData.append(
        "metaScore",
        new Blob([JSON.stringify(metaScore)], { type: "application/json" })
      );

      try {
        const response = await axios.post(
          "http://localhost:8080/calculate/personBrisque",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              userId: localStorage.getItem("userId"),
            },
          }
        );

        const scores = response.data;

        setPeopleRepo((prev) =>
          prev.map((img) =>
            img.id === currentFile.id ? { ...img, score: scores[0] } : img
          )
        );
      } catch (error) {
        console.error("Error saving image:", error);
      } finally {
        URL.revokeObjectURL(imageUrl);
        setIsModalOpen(false);

        // Process the next file
        if (currentFileIndex < selectedFiles.length - 1) {
          const nextIndex = currentFileIndex + 1;
          setCurrentFileIndex(nextIndex);
          openModalForCurrentFile(nextIndex);
        }
      }
    }
  };

  return (
    <div>
      <div className="button" onClick={handleSaveClick}>
        <img src="img/move1.png" alt="Save" />
        <div>Repo에 저장하기</div>
      </div>
      {isModalOpen && selectedFiles.length > 0 && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Image Crop Modal"
          style={{
            content: {
              height: "80%",
              width: "80%",
              margin: "auto",
              padding: 0,
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <Cropper
            src={imageUrl}
            style={{ height: "80%", width: "100%" }}
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
          />
          <button className="upload-button" onClick={handleCropComplete}>
            Upload
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ContPeopleSave;
