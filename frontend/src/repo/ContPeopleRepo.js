import React, { useState } from "react";
import ContPeopleList from "./continuousRepo/ContPeopleList";
import Sort from "./header/Sort";
import ContRepoNavi from "./continuousRepo/ContRepoNavi";
import { Card, CardContent } from "@mui/material";

const ContPeopleRepo = () => {
  const style = {
    width: "50%",
    height: "95vh",
    padding: "15px 0px",
    boxSizing: "border-box",
    borderLeft: "1px solid #d9d9d9",
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelectedIdsChange = (files) => {
    setSelectedFiles(files);
  };

  return (
    <Card
      sx={{
        width: "45%",
        height: "85vh",
        padding: "15px 0px",
        margin: "20px auto",
        boxShadow: 3,
      }}
    >
      <CardContent>
        <ContRepoNavi
          repoName="특정 영역 품질 분석"
          repoType="contPeople"
          selectedFiles={selectedFiles}
        />
        <Sort />
        <ContPeopleList onSelectedIdsChange={handleSelectedIdsChange} />
      </CardContent>
    </Card>
  );
};

export default ContPeopleRepo;
