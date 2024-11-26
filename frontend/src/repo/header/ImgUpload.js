import React, { useRef } from "react";
import axios from "axios";
import EXIF from "exif-js";
import { useAppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from "uuid";

const ImgUpload = React.forwardRef(({ repoType }, ref) => {
  const fileInputRef = useRef(null);
  const { setPeopleRepo, setThingRepo } = useAppContext();

  React.useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current.click();
    },
  }));

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
              Resolution: `${allMetaData.PixelYDimension}x${allMetaData.PixelXDimension}`, //메타데이터 해상도
              RealResolution: `${img.naturalWidth}x${img.naturalHeight}`, //실제 해상도
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

  const handleImgChange = async (event) => {
    const files = event.target.files;

    if (!files.length) {
      return;
    }

    const formData = new FormData();
    const newImages = [];

    const ISOList = [];
    const FStopList = [];
    const WhiteBalanceList = [];
    const ExposureTimeList = [];
    const ResolutionList = [];
    const RealResolutionList = [];
    const GPSLatitudeList = [];
    const GPSLongitudeList = [];
    const fileSizeList = []; // 파일 크기 리스트 추가
    const metaScoreList = [];

    for (let file of files) {
      const smallFile = await resizeImage(file, 70); // smallImage 생성
      const metadata = await extractMetadata(file); // 메타데이터 추출
      const formattedSize = formatFileSize(file.size); // 파일 크기 변환

      // 메타데이터 품질 점수 계산
      let metaScore = 0;
      if (metadata.ISO && metadata.ISO >= 100) metaScore += 1;
      if (metadata.FStop && metadata.FStop >= 1.0) metaScore += 1;
      if (metadata.WhiteBalance !== undefined) metaScore += 1;
      if (metadata.ExposureTime && metadata.ExposureTime > 0) metaScore += 1;
      if (
        metadata.Resolution &&
        metadata.Resolution !== "undefinedxundefined" &&
        metadata.Resolution !== null
      )
        metaScore += 1;

      newImages.push({
        id: uuidv4(),
        file,
        smallFile,
        metadata,
        preview: URL.createObjectURL(file),
        name: file.name,
        score: null,
        size: formattedSize, // 파일 크기 추가
      });

      ISOList.push(metadata.ISO);
      FStopList.push(metadata.FStop);
      WhiteBalanceList.push(metadata.WhiteBalance);
      ExposureTimeList.push(metadata.ExposureTime);
      ResolutionList.push(metadata.Resolution);
      RealResolutionList.push(metadata.RealResolution);
      GPSLatitudeList.push(metadata.GPSLatitude);
      GPSLongitudeList.push(metadata.GPSLongitude);
      fileSizeList.push(formattedSize); // 파일 크기 리스트에 추가
      metaScoreList.push(metaScore);

      formData.append("image", file);
      formData.append("smallFiles", smallFile); // smallImage 추가
    }

    // 리스트 형태의 메타데이터를 독립적으로 추가
    formData.append("ISO", JSON.stringify(ISOList));
    formData.append("FStop", JSON.stringify(FStopList));
    formData.append("WhiteBalance", JSON.stringify(WhiteBalanceList));
    formData.append("ExposureTime", JSON.stringify(ExposureTimeList));
    formData.append("Resolution", JSON.stringify(ResolutionList));
    formData.append("RealResolution", JSON.stringify(RealResolutionList));
    formData.append("GPSLatitude", JSON.stringify(GPSLatitudeList));
    formData.append("GPSLongitude", JSON.stringify(GPSLongitudeList));
    formData.append("size", JSON.stringify(fileSizeList));
    formData.append("metaScore", JSON.stringify(metaScoreList));

    console.log("ISO : ", JSON.stringify(ISOList));

    const titles = newImages.map((img) => img.name); // 이미지 제목 리스트
    formData.append("imageTitle", JSON.stringify({ titles })); // 제목 JSON 추가

    if (repoType === "people") {
      setPeopleRepo((prev) => [...prev, ...newImages]);
    } else if (repoType === "thing") {
      setThingRepo((prev) => [...prev, ...newImages]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/calculate/brisque",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            userId: localStorage.getItem("userId"),
          },
        }
      );
      const scores = response.data;
      console.log("userId", localStorage.getItem("userId"));

      if (repoType === "people") {
        setPeopleRepo((prev) =>
          prev.map((img) => {
            const scoreIndex = newImages.findIndex(
              (newImg) => newImg.id === img.id
            );
            return scoreIndex !== -1
              ? { ...img, score: scores[scoreIndex] }
              : img;
          })
        );
      } else if (repoType === "thing") {
        setThingRepo((prev) =>
          prev.map((img) => {
            const scoreIndex = newImages.findIndex(
              (newImg) => newImg.id === img.id
            );
            return scoreIndex !== -1
              ? { ...img, score: scores[scoreIndex] }
              : img;
          })
        );

        // 업로드 후 리스트 다시 가져오기
        const fetchThingImages = async () => {
          try {
            const response = await axios.get("/load/thing", {
              params: { userId: localStorage.getItem("userId") },
            });
            setThingRepo(response.data);
          } catch (error) {
            console.error("Error fetching thing images", error);
          }
        };

        fetchThingImages();
      }
    } catch (error) {
      console.error("Brisque 점수 계산 실패:", error);
    }

    // 파일 입력 요소의 값을 리셋하여 동일한 파일을 다시 선택할 수 있도록 함
    event.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*" // 이미지 파일만 허용
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImgChange}
      />
    </div>
  );
});

export default ImgUpload;
