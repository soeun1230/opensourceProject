import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import EXIF from "exif-js";
import { useAppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from "uuid";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Modal from "react-modal";
import "../../css/PersonImgUpload.css";

Modal.setAppElement("#root");

const PersonImgUpload = React.forwardRef(({ repoType }, ref) => {
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setPeopleRepo, user } = useAppContext();
  const [selectedFileObject, setSelectedFileObject] = useState(null); // 파일 객체 상태 추가
  const [selectedFileName, setSelectedFileName] = useState(""); // 원래 파일명 상태 추가
  const [formData, setFormData] = useState(new FormData()); // formData 상태 추가
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태 추가

  React.useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current.click();
    },
  }));

  useEffect(() => {
    if (selectedFileObject) {
      const url = URL.createObjectURL(selectedFileObject);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [selectedFileObject]);

  const resizeImage = (file, maxSize) => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const scale = maxSize / Math.max(img.width, img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, file.type);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const convertDMSToString = (dmsArray) => {
    if (!dmsArray || dmsArray.length !== 3) {
      return "";
    }

    const degrees = dmsArray[0].numerator;
    const minutes = dmsArray[1].numerator;
    const seconds = dmsArray[2].numerator / dmsArray[2].denominator;

    return `${degrees}:${minutes}:${seconds.toFixed(2)}`;
  };

  const extractMetadata = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          EXIF.getData(img, function () {
            const allMetaData = EXIF.getAllTags(this);

            const fNumber = allMetaData.FNumber
              ? allMetaData.FNumber.numerator / allMetaData.FNumber.denominator
              : null;

            const exposureTimeDenominator = allMetaData.ExposureTime
              ? allMetaData.ExposureTime.denominator
              : null;

            const metadata = {
              ISO: allMetaData.ISOSpeedRatings,
              FStop: fNumber,
              WhiteBalance: allMetaData.WhiteBalance,
              ExposureTime: exposureTimeDenominator,
              Resolution: `${allMetaData.PixelYDimension}x${allMetaData.PixelXDimension}`, // 메타데이터 해상도
              RealResolution: `${img.naturalWidth}x${img.naturalHeight}`, // 실제 해상도
              GPSLatitude: convertDMSToString(allMetaData.GPSLatitude), // 위도
              GPSLongitude: convertDMSToString(allMetaData.GPSLongitude), // 경도
            };

            console.log(`Metadata for ${file.name}:`, metadata);
            resolve(metadata);
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const formatFileSize = (size) => {
      return (size/104876).toFixed(2)+" MB";
    };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length) {
      const file = files[0];
      setSelectedFileObject(file); // 파일 객체 저장
      setSelectedFileName(file.name); // 원래 파일명 저장
      const newFormData = new FormData();
      newFormData.append("image", file);
      const formattedSize = formatFileSize(file.size); // 파일 크기 변환
      newFormData.append("size", formattedSize); // 변환된 파일 크기 추가
      console.log("size", formattedSize);
      setFormData(newFormData); // formData 상태 저장
      setIsModalOpen(true); // 파일이 선택되면 모달 열기

      // 파일 입력 요소의 값을 리셋하여 동일한 파일을 다시 선택할 수 있도록 함
      event.target.value = "";
    }
  };

  const handleCropComplete = async () => {
    if (cropperRef.current && selectedFileObject) {
      const cropper = cropperRef.current.cropper;
      const cropData = cropper.getData();
      const fileType = selectedFileObject.name.split(".").pop(); // 파일 확장자 추출

      const smallFile = await resizeImage(selectedFileObject, 70); // smallImage 생성
      const metadata = await extractMetadata(selectedFileObject); // 메타데이터 추출

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

      console.log("메타데이터 점수 : ", metaScore);

      formData.append(
        "cropData",
        new Blob([JSON.stringify(cropData)], { type: "application/json" })
      );
      formData.append("fileType", fileType);
      formData.append("smallFiles", smallFile);
      formData.append(
        "imageTitle",
        new Blob([JSON.stringify({ titles: [selectedFileName] })], {
          type: "application/json",
        })
      );
      if (metadata.Fstop === null || metadata.Fstop === undefined) {
        formData.append(
          "FStop",
          new Blob([JSON.stringify(0.0)], {
            type: "application/json",
          })
        );
      } else {
        formData.append(
          "FStop",
          new Blob([JSON.stringify(metadata.FStop)], {
            type: "application/json",
          })
        );
      }

      if (metadata.ISO === null || metadata.ISO === undefined) {
        formData.append(
          "ISO",
          new Blob([JSON.stringify(0.0)], { type: "application/json" })
        );
      } else {
        formData.append(
          "ISO",
          new Blob([JSON.stringify(metadata.ISO)], { type: "application/json" })
        );
      }

      if (
        metadata.ExposureTime === null ||
        metadata.ExposureTime === undefined
      ) {
        formData.append(
          "ExposureTime",
          new Blob([JSON.stringify(0.0)], {
            type: "application/json",
          })
        );
      } else {
        formData.append(
          "ExposureTime",
          new Blob([JSON.stringify(metadata.ExposureTime)], {
            type: "application/json",
          })
        );
      }

      formData.append(
        "GPSLatitude",
        new Blob([JSON.stringify(metadata.GPSLatitude)], {
          type: "application/json",
        })
      );
      formData.append(
        "GPSLongitude",
        new Blob([JSON.stringify(metadata.GPSLongitude)], {
          type: "application/json",
        })
      );
      formData.append(
        "RealResolution",
        new Blob([JSON.stringify(metadata.RealResolution)], {
          type: "application/json",
        })
      );
      formData.append(
        "Resolution",
        new Blob([JSON.stringify(metadata.Resolution)], {
          type: "application/json",
        })
      );
      formData.append(
        "WhiteBalance",
        new Blob([JSON.stringify(metadata.WhiteBalance)], {
          type: "application/json",
        })
      );
      formData.append("userId", localStorage.getItem("userId"));
      formData.append(
        "metaScore",
        new Blob([JSON.stringify(metaScore)], { type: "application/json" })
      );

      const newImage = {
        id: uuidv4(),
        file: selectedFileObject,
        preview: URL.createObjectURL(selectedFileObject),
        name: selectedFileName,
        score: null,
        metaScore: metaScore,
      };

      setPeopleRepo((prev) => [...prev, newImage]);

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
            img.id === newImage.id ? { ...img, score: scores[0] } : img
          )
        );

        // 업로드 후 리스트 다시 가져오기
        const fetchPeopleImages = async () => {
          try {
            const response = await axios.get("/load/people", {
              params: { userId: localStorage.getItem("userId") },
            });
            setPeopleRepo(response.data);
          } catch (error) {
            console.error("Error fetching people images", error);
          }
        };

        fetchPeopleImages();
      } catch (error) {
        console.error("Brisque score calculation failed:", error);
        console.log("user.id", localStorage.getItem("userId"));
      } finally {
        // 상태 초기화
        setIsModalOpen(false); // 업로드 완료 후 모달 닫기
        setSelectedFileObject(null); // 파일 객체 초기화
        setSelectedFileName(""); // 파일명 초기화
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
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {selectedFileObject && (
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

export default PersonImgUpload;
