import React from "react";
import { useParams } from "react-router-dom";
import BackgroundContainer from "./../../../components/misc/BackgroundContainer";

const SlidesEditPage = () => {
  const { id: slideId } = useParams();
  return (
    <BackgroundContainer>This is slides edit {slideId}</BackgroundContainer>
  );
};

export default SlidesEditPage;
