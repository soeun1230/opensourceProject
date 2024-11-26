import React, { useRef } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from "uuid";

const ContImgUpload = React.forwardRef(({ repoType }, ref) => {
  const fileInputRef = useRef(null);
  const { setContPeopleRepo, setContThingRepo } = useAppContext();

  React.useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current.click();
    },
  }));

  const handleImgChange = async (event) => {
    const files = event.target.files;

    if (!files.length) {
      return;
    }

    const formData = new FormData();
    const newImages = [];

    for (let file of files) {
      newImages.push({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
        score: null,
      });
      formData.append("image", file);
    }

    const titles = newImages.map((img) => img.name); // 이미지 제목 리스트
    formData.append("imageTitle", JSON.stringify({ titles })); // 제목 JSON 추가

    if (repoType === "contPeople") {
      setContPeopleRepo((prev) => [...prev, ...newImages]);
    } else if (repoType === "contThing") {
      setContThingRepo((prev) => [...prev, ...newImages]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/calculate/continuousImage",
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

      if (repoType === "contPeople") {
        setContPeopleRepo((prev) =>
          prev.map((img) => {
            const scoreIndex = newImages.findIndex(
              (newImg) => newImg.id === img.id
            );
            return scoreIndex !== -1
              ? { ...img, score: scores[scoreIndex] }
              : img;
          })
        );
      } else if (repoType === "contThing") {
        setContThingRepo((prev) =>
          prev.map((img) => {
            const scoreIndex = newImages.findIndex(
              (newImg) => newImg.id === img.id
            );
            return scoreIndex !== -1
              ? { ...img, score: scores[scoreIndex] }
              : img;
          })
        );
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

export default ContImgUpload;
