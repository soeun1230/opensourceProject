import React, { useState } from "react";
import Sort from "./header/Sort";
import ContRepoNavi from "./continuousRepo/ContRepoNavi";
import ContThingList from "./continuousRepo/ContThingList";
import { Card, CardContent } from "@mui/material";

const ContThingRepo = () => {
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
          repoName="전체 영역 품질 분석"
          repoType="contThing"
          selectedFiles={selectedFiles}
        />
        <Sort />
        <ContThingList onSelectedIdsChange={handleSelectedIdsChange} />
      </CardContent>
    </Card>
  );
};

export default ContThingRepo;
