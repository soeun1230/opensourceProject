import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from "uuid";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Modal from "react-modal";
import "../../css/PersonImgUpload.css";

Modal.setAppElement("#root");

const ContPersonImgUpload = React.forwardRef(({ repoType }, ref) => {
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setContPeopleRepo } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState([]); // 여러 파일 상태 추가
  const [selectedFileNames, setSelectedFileNames] = useState([]); // 원래 파일명 상태 추가
  const [formData, setFormData] = useState(new FormData()); // formData 상태 추가
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태 추가

  React.useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current.click();
    },
  }));

  useEffect(() => {
    if (selectedFiles.length) {
      const url = URL.createObjectURL(selectedFiles[0]);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length) {
      setSelectedFiles(files); // 여러 파일 객체 저장
      setSelectedFileNames(files.map((file) => file.name)); // 원래 파일명 저장
      const newFormData = new FormData();
      files.forEach((file) => newFormData.append("images", file));
      setFormData(newFormData); // formData 상태 저장
      setIsModalOpen(true); // 파일이 선택되면 모달 열기

      // 파일 입력 요소의 값을 리셋하여 동일한 파일을 다시 선택할 수 있도록 함
      event.target.value = "";
    }
  };

  const handleCropComplete = async () => {
    if (cropperRef.current && selectedFiles.length) {
      const cropper = cropperRef.current.cropper;
      const cropData = cropper.getData();

      formData.append(
        "cropData",
        new Blob([JSON.stringify(cropData)], { type: "application/json" })
      );
      formData.append(
        "imageTitles",
        new Blob([JSON.stringify({ titles: selectedFileNames })], {
          type: "application/json",
        })
      );
      formData.append("fileType", selectedFileNames[0].split(".").pop());

      formData.append("userId", localStorage.getItem("userId"));

      const newImages = selectedFiles.map((file, index) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        name: selectedFileNames[index],
        fileType: selectedFileNames[index].split(".").pop(),
        score: null,
      }));

      setContPeopleRepo((prev) => [...prev, ...newImages]);

      try {
        const response = await axios.post(
          "http://localhost:8080/calculate/continuousImage/people",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              userId: localStorage.getItem("userId"),
            },
          }
        );
        const scores = response.data;

        setContPeopleRepo((prev) =>
          prev.map((img) => {
            const newImgIndex = newImages.findIndex(
              (newImg) => newImg.id === img.id
            );
            if (newImgIndex !== -1) {
              return { ...img, score: scores[newImgIndex] };
            }
            return img;
          })
        );
      } catch (error) {
        console.error("Brisque score calculation failed:", error);
        console.log("user.id", localStorage.getItem("userId"));
      } finally {
        // 상태 초기화
        setIsModalOpen(false); // 업로드 완료 후 모달 닫기
        setSelectedFiles([]); // 파일 객체 초기화
        setSelectedFileNames([]); // 파일명 초기화
        setFormData(new FormData()); // formData 초기화
        setImageUrl(""); // 이미지 URL 초기화
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple // 여러 파일 선택 가능
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {selectedFiles.length > 0 && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Image Crop Modal"
          style={{
            content: {
              height: "80%", // 모달 높이 줄이기
              width: "80%", // 모달 너비 줄이기
              margin: "auto",
              padding: 0,

              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <Cropper
            src={imageUrl}
            style={{ height: "80%", width: "100%" }} // 크로퍼를 모달에 맞게 조정
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
});

export default ContPersonImgUpload;
