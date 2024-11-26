import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../../css/DetailModal.css";
import imageCompression from "browser-image-compression";
import { jsPDF } from "jspdf";
import { canvasRGBA } from "stackblur-canvas";
import axios from "axios";
import { Tabs, Tab } from "@mui/material";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

// ImageConverter 컴포넌트 정의
const ImageConverter = ({
  blobData,
  setTransformedImageUrl,
  setDownloadLink,
  setChangeFileExtension,
  setTransformedFileName,
  detailData,
  setShowRealResolution2,
  setShowBrisque,
  setImageConvertUrl,
}) => {
  const [convertedSizeMB, setConvertedSizeMB] = useState("");
  const [showFormatOptions, setShowFormatOptions] = useState(false);

  const handleImageTypeChange = async (type) => {
    try {
      let newBlob;
      const originalFileName = detailData.imageTitle[0] || "image"; // blobData에 파일 이름이 포함되어 있지 않다면 기본 이름 사용
      const fileNameWithoutExtension =
        originalFileName.substring(0, originalFileName.lastIndexOf(".")) ||
        originalFileName;

      if (type === "pdf") {
        // PDF로 변환
        const imgData = await convertBlobToDataUrl(blobData);
        const img = new Image();
        img.src = imgData;

        img.onload = () => {
          const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height],
          });

          pdf.addImage(imgData, "JPEG", 0, 0, img.width, img.height); // 이미지 전체를 PDF에 추가
          const pdfBlob = pdf.output("blob");
          newBlob = new Blob([pdfBlob], { type: "application/pdf" });

          const newFileName = `${fileNameWithoutExtension}.pdf`;
          setTransformedFileName(newFileName);
          const newImageUrl = URL.createObjectURL(newBlob);

          setImageConvertUrl(newImageUrl);
          setDownloadLink(newImageUrl);
          setChangeFileExtension("pdf");
        };

        return;
      } else {
        // JPEG 또는 PNG로 변환
        const newType = type === "jpeg" ? "image/jpeg" : "image/png";
        newBlob = new Blob([blobData], { type: newType });

        const newFileName = `${fileNameWithoutExtension}.${type}`;
        setTransformedFileName(newFileName);
        const newSize = newBlob.size;
        const newSizeMB = (newSize / (1024 * 1024)).toFixed(2);
        setConvertedSizeMB(newSizeMB);

        const newImageUrl = URL.createObjectURL(newBlob);
        setImageConvertUrl(newImageUrl);
        setDownloadLink(newImageUrl);
        setChangeFileExtension(type);
      }
    } catch (error) {
      console.error("Image conversion error:", error);
    }
  };

  const convertBlobToDataUrl = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFormatButtonClick = () => {
    setShowFormatOptions(!showFormatOptions);
  };

  const handleFormatOptionClick = (format) => {
    setShowFormatOptions(false);
    setShowRealResolution2(false);
    setShowBrisque(false);
    handleImageTypeChange(format);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingTop={2} // 원하는 값으로 조정, 예: 4는 32px
      >
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
          onClick={handleFormatButtonClick}
        >
          파일 포맷 변환
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginTop="10px"
      >
        {showFormatOptions && (
          <div className="formatOptions">
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
              onClick={() => handleFormatOptionClick("jpeg")}
            >
              JPEG로 변환
            </Button>
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
              onClick={() => handleFormatOptionClick("png")}
            >
              PNG로 변환
            </Button>
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
              onClick={() => handleFormatOptionClick("pdf")}
            >
              PDF로 변환
            </Button>
          </div>
        )}
      </Box>
    </>
  );
};

const DetailModal = ({ isOpen, onRequestClose, detailData }) => {
  const [metaScore, setMetaScore] = useState(0);
  const [fileExtension, setFileExtension] = useState("");
  const [changeFileExtension, setChangeFileExtension] = useState("");
  const [transformedImageUrl, setTransformedImageUrl] = useState(""); //압축 이미지 url
  const [removeNoiseUrl, setRemoveNoiseUrl] = useState(""); //노이즈제거 이미지 url
  const [imageConvertUrl, setImageConvertUrl] = useState(""); //파일 확장자 변경 url
  const [downloadLink, setDownloadLink] = useState("");
  const [blobData, setBlobData] = useState(null);
  const [compressedSizeMB, setCompressedSizeMB] = useState("");
  const [showRealResolution, setShowRealResolution] = useState(false);
  const [showRealResolution2, setShowRealResolution2] = useState(false);
  const [showBrisque, setShowBrsique] = useState(false);
  const [transformedFileName, setTransformedFileName] = useState(""); // 오른쪽 파일 이름
  const [transfomedBrisque, setTransformedBrisque] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const fileFromUrl = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type });
      return file;
    } catch (error) {
      console.error("Error creating file from URL:", error);
      return null;
    }
  };

  const calculateBrisque = async () => {
    if (detailData.peopleId) {
      console.log("people입니다.");
      try {
        const image = await fileFromUrl(downloadLink, detailData.imageTitle[0]);
        if (!image) {
          throw new Error("Failed to create file from URL");
        }

        const formData = new FormData();
        formData.append("image", image);

        formData.append(
          "fileType",
          new Blob([JSON.stringify(fileExtension)], {
            type: "application/json",
          })
        );
        formData.append(
          "imageId",
          new Blob([JSON.stringify(detailData.peopleId)], {
            type: "application/json",
          })
        );

        const response = await axios.post(
          "http://localhost:8080/calculate/transformed/person",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const score = response.data;
        setTransformedBrisque(score);
        console.log("transfomed score", score);
        setShowBrsique(true);
      } catch (error) {
        console.error("Error calculating transformed function:", error);
      }
    } else {
      //thing Img brisque 계산
      try {
        const image = await fileFromUrl(downloadLink, detailData.imageTitle[0]);
        if (!image) {
          throw new Error("Failed to create file from URL");
        }

        const formData = new FormData();
        formData.append("image", image);

        const response = await axios.post(
          "http://localhost:8080/calculate/transformed/thing",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const score = response.data;
        setTransformedBrisque(score);
        console.log("transfomed score", score);
        setShowBrsique(true);
      } catch (error) {
        console.error("Error calculating transformed function:", error);
      }
    }
  };

  const calculateMetaScore = (metadata) => {
    let score = 0;

    if (metadata.iso >= 100) score += 1;
    if (metadata.fstop >= 1.0) score += 1;
    if (metadata.whiteBalance) score += 1;
    if (metadata.exposureTime > 0) score += 1;
    if (metadata.resolution && metadata.resolution !== "0x0") score += 1;

    return score;
  };

  useEffect(() => {
    if (detailData && detailData.metadata) {
      const score = calculateMetaScore(detailData.metadata);
      setMetaScore(score);
      const title = detailData.imageTitle[0];

      let extension = title.slice(-4).toLowerCase(); // 먼저 4자리를 추출
      if (extension === "jpeg") {
        setFileExtension("jpeg");
      } else {
        extension = title.slice(-3).toLowerCase(); // 그 외의 경우, 3자리 추출
        setFileExtension(extension);
      }

      setChangeFileExtension(extension);

      if (detailData.base64) {
        let contentType = "";
        if (extension === "jpg" || extension === "jpeg") {
          contentType = "image/jpeg";
        } else if (extension === "png") {
          contentType = "image/png";
        }
        const blob = base64ToBlob(detailData.base64, contentType);
        setBlobData(blob);
      }
    }
  }, [detailData]);

  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleCompressImage = async () => {
    setShowRealResolution2(false);
    setShowBrsique(false);
    const blob = blobData;

    const options = {
      initialQuality: 0.8,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(blob, options);
      const compressedSize = compressedBlob.size;
      const compressedSizeMB = (compressedSize / (1024 * 1024)).toFixed(2);
      setCompressedSizeMB(compressedSizeMB);
      const compressedImageUrl = URL.createObjectURL(compressedBlob);
      setTransformedImageUrl(compressedImageUrl);
      setTransformedFileName(detailData.imageTitle);

      setDownloadLink(compressedImageUrl);
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  useEffect(() => {
    // tabValue가 변경될 때 다운로드 링크를 설정
    setShowBrsique(false);
    setShowRealResolution2(false);
    if (tabValue === 1 && transformedImageUrl) {
      setDownloadLink(transformedImageUrl);
    } else if (tabValue === 2 && removeNoiseUrl) {
      setDownloadLink(removeNoiseUrl);
    } else if (tabValue === 3 && imageConvertUrl) {
      setDownloadLink(imageConvertUrl);
    } else {
      setDownloadLink(""); // 해당 링크가 없는 경우 빈 값 설정
    }
  }, [tabValue, transformedImageUrl, removeNoiseUrl, imageConvertUrl]);

  const handleDownload = () => {
    if (downloadLink && detailData.imageTitle) {
      const originalFileName = detailData.imageTitle[0];
      const fileNameWithoutExtension =
        originalFileName.substring(0, originalFileName.lastIndexOf(".")) ||
        originalFileName;
      const newFileName = `${fileNameWithoutExtension}.${changeFileExtension}`; // 새 확장자를 적용한 파일 이름 생성

      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = newFileName; // 수정된 파일 이름 사용
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRemoveNoise = () => {
    setShowRealResolution2(false);
    setShowBrsique(false);
    if (blobData) {
      const img = new Image();
      const url = URL.createObjectURL(blobData);
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // canvasRGBA를 사용하여 노이즈 제거
        canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 10); // 반경 10의 블러 적용

        canvas.toBlob((blob) => {
          const transformedUrl = URL.createObjectURL(blob);
          setRemoveNoiseUrl(transformedUrl);
          setDownloadLink(transformedUrl);
        }, blobData.type);
      };
      setTransformedFileName(detailData.imageTitle);
    }
  };

  //실제 해상도 계산
  const handleShowRealResolution = () => {
    setShowRealResolution(true);
  };

  //실제 해상도 계산 (오른쪽)
  const handleShowRealResolution2 = () => {
    setShowRealResolution2(true);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ content: { width: "80%", margin: "auto" } }}
    >
      <div className="modalHeader">
        <button onClick={onRequestClose} className="closeButton">
          ✕
        </button>
      </div>
      <div className="total">
        <div className="original">
          <div className="originalImg">
            {tabValue === 1 && transformedImageUrl !== "" ? (
              <img
                src={transformedImageUrl}
                alt={detailData.imageTitle}
                className="detailImg"
              />
            ) : tabValue === 2 && removeNoiseUrl !== "" ? (
              <img
                src={removeNoiseUrl}
                alt={detailData.imageTitle}
                className="detailImg"
              />
            ) : tabValue === 3 && imageConvertUrl !== "" ? (
              <img
                src={imageConvertUrl}
                alt={detailData.imageTitle}
                className="detailImg"
              />
            ) : (
              <img
                src={detailData.imageUrl}
                alt={detailData.imageTitle}
                className="detailImg"
              />
            )}
          </div>
        </div>

        <div className="transformed">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="Image options"
          >
            <Tab label="원본 이미지" />
            <Tab label="압축" />
            <Tab label="노이즈 제거" />
            <Tab label="파일 변환" />
          </Tabs>

          {/* tabValue가 0일 때 카드가 항상 표시 */}
          {tabValue === 0 && (
            <Card>
              <CardContent>
                {detailData && (
                  <>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="h7"
                        gutterBottom
                        sx={{ fontFamily: "IBM Plex Sans KR" }}
                      >
                        파일명:
                      </Typography>
                      <Typography
                        variant="h7"
                        gutterBottom
                        sx={{ fontFamily: "IBM Plex Sans KR" }}
                      >
                        {detailData.imageTitle}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        gutterBottom
                        sx={{ fontFamily: "IBM Plex Sans KR" }}
                      >
                        BRISQUE 품질점수:
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ fontFamily: "IBM Plex Sans KR" }}
                      >
                        {detailData.brisqueScore}
                      </Typography>
                    </Box>
                  </>
                )}
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    메타데이터 품질 점수:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {metaScore}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    용량:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.size}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    확장자:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {fileExtension}
                  </Typography>
                </Box>
                {showRealResolution && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      측정한 해상도:
                    </Typography>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {detailData?.metadata?.realResolution}
                    </Typography>
                  </Box>
                )}
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    메타데이터의 해상도:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.resolution}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    White Balance:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.whiteBalance}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    F-stop:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.fstop}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    Exposure time:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.exposureTime}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    Iso:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.iso}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    GPS:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {detailData?.metadata?.gpslatitude} :{" "}
                    {detailData?.metadata?.gpslongitude}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* tabValue가 1일 때 transformedImageUrl 여부에 따른 조건 */}
          {tabValue === 1 && !transformedImageUrl && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              paddingTop={4} // 원하는 값으로 조정, 예: 4는 32px
            >
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
                onClick={handleCompressImage}
              >
                이미지 압축
              </Button>
            </Box>
          )}
          {tabValue === 1 && transformedImageUrl && (
            <Card>
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontFamily: "IBM Plex Sans KR" }}
                >
                  이미지 압축이 완료되었습니다.
                </Typography>
                <br />
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    압축 후 이미지 용량:
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {compressedSizeMB} MB
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    압축 후 BRISQUE 품질 점수:
                  </Typography>
                  {showBrisque && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {transfomedBrisque}
                    </Typography>
                  )}
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    압축 후 해상도 :
                  </Typography>
                  {showRealResolution2 && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {detailData.metadata.realResolution}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* tabValue가 2일 때 removeNoiseUrl 여부에 따른 조건 */}
          {tabValue === 2 && !removeNoiseUrl && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              paddingTop={4} // 원하는 값으로 조정, 예: 4는 32px
            >
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
                onClick={handleRemoveNoise}
              >
                노이즈 제거
              </Button>
            </Box>
          )}
          {tabValue === 2 && removeNoiseUrl && (
            <Card>
              <CardContent>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontFamily: "IBM Plex Sans KR" }}
                >
                  노이즈 제거가 완료되었습니다.
                </Typography>
                <br />
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    노이즈 제거 후 BRISQUE 품질 점수:
                  </Typography>
                  {showBrisque && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {transfomedBrisque}
                    </Typography>
                  )}
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    노이즈 제거 후 해상도 :
                  </Typography>
                  {showRealResolution2 && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {detailData.metadata.realResolution}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* tabValue가 3일 때 imageConvertUrl 여부에 따른 조건 */}
          {tabValue === 3 && !imageConvertUrl && (
            <ImageConverter
              blobData={blobData}
              setTransformedImageUrl={setTransformedImageUrl}
              setDownloadLink={setDownloadLink}
              setChangeFileExtension={setChangeFileExtension}
              setTransformedFileName={setTransformedFileName}
              detailData={detailData}
              setShowRealResolution2={setShowRealResolution2}
              setShowBrisque={setShowBrsique}
              setImageConvertUrl={setImageConvertUrl}
            />
          )}
          {tabValue === 3 && imageConvertUrl && (
            <Card>
              <CardContent>
                <ImageConverter
                  blobData={blobData}
                  setTransformedImageUrl={setTransformedImageUrl}
                  setDownloadLink={setDownloadLink}
                  setChangeFileExtension={setChangeFileExtension}
                  setTransformedFileName={setTransformedFileName}
                  detailData={detailData}
                  setShowRealResolution2={setShowRealResolution2}
                  setShowBrisque={setShowBrsique}
                  setImageConvertUrl={setImageConvertUrl}
                />
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontFamily: "IBM Plex Sans KR" }}
                >
                  {changeFileExtension} 형식으로 파일 변환이 완료되었습니다.
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    파일 포맷 변환 후 BRISQUE 품질 점수:
                  </Typography>
                  {showBrisque && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {transfomedBrisque}
                    </Typography>
                  )}
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    파일 포맷 변환 후 해상도 :
                  </Typography>
                  {showRealResolution2 && (
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {detailData.metadata.realResolution}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
          {tabValue !== 0 && (
            <div className="buttonList2">
              <button
                onClick={handleDownload}
                disabled={
                  (tabValue === 1 && !transformedImageUrl) ||
                  (tabValue === 2 && !removeNoiseUrl) ||
                  (tabValue === 3 && !imageConvertUrl)
                }
              >
                다운로드
              </button>
              <button
                onClick={calculateBrisque}
                disabled={
                  (tabValue === 1 && !transformedImageUrl) ||
                  (tabValue === 2 && !removeNoiseUrl) ||
                  (tabValue === 3 && !imageConvertUrl)
                }
              >
                Brisque 품질 점수 계산
              </button>
              <button
                onClick={handleShowRealResolution2}
                disabled={
                  (tabValue === 1 && !transformedImageUrl) ||
                  (tabValue === 2 && !removeNoiseUrl) ||
                  (tabValue === 3 && !imageConvertUrl)
                }
              >
                해상도 측정
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
