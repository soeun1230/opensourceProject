import React from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { resizeImage, extractMetadata } from "../../util/ImgUtils";

const ContThingSave = ({ selectedFiles }) => {
  const { setThingRepo } = useAppContext();

  const formatFileSize = (size) => {
      return (size/104876).toFixed(2)+" MB";
    };

  const handleSaveClick = async () => {
    const formData = new FormData();

    const updatedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        const smallFile = await resizeImage(file.file, 70);
        const metadata = await extractMetadata(file.file);
        const formattedSize = formatFileSize(file.file.size);

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

        return {
          ...file,
          smallFile,
          metadata,
          size: formattedSize,
          metaScore,
        };
      })
    );

    updatedFiles.forEach((file) => {
      formData.append("image", file.file);
      formData.append("smallFiles", file.smallFile);
    });

    const ISOList = updatedFiles.map((file) => file.metadata?.ISO || null);
    const FStopList = updatedFiles.map((file) => file.metadata?.FStop || null);
    const WhiteBalanceList = updatedFiles.map(
      (file) => file.metadata?.WhiteBalance || null
    );
    const ExposureTimeList = updatedFiles.map(
      (file) => file.metadata?.ExposureTime || null
    );
    const ResolutionList = updatedFiles.map(
      (file) => file.metadata?.Resolution || null
    );
    const RealResolutionList = updatedFiles.map(
      (file) => file.metadata?.RealResolution || null
    );
    const GPSLatitudeList = updatedFiles.map(
      (file) => file.metadata?.GPSLatitude || null
    );
    const GPSLongitudeList = updatedFiles.map(
      (file) => file.metadata?.GPSLongitude || null
    );
    const fileSizeList = updatedFiles.map((file) => file.size || null);
    const metaScoreList = updatedFiles.map((file) => file.metaScore || null);

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

    const titles = updatedFiles.map((file) => file.file.name);
    formData.append("imageTitle", JSON.stringify({ titles }));

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

      setThingRepo((prev) =>
        prev.map((img) => {
          const scoreIndex = updatedFiles.findIndex(
            (file) => file.id === img.id
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
    } catch (error) {
      console.error("Brisque 점수 계산 실패:", error);
    }
  };

  return (
    <div>
      <div className="button" onClick={handleSaveClick}>
        <img src="img/move1.png" alt="Save" />
        <div>Repo에 저장하기</div>
      </div>
    </div>
  );
};

export default ContThingSave;
