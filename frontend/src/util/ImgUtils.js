import EXIF from "exif-js";

export const resizeImage = (file, maxSize) => {
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

export const extractMetadata = (file) => {
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
