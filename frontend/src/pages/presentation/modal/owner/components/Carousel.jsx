import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Stack } from "@mui/material";
import React from "react";
import CarouselItem from "./CarouselItem";
import { iconButton } from "../../../../../commons/globalStyles";

const Carousel = ({ slides, currentQues, setCurrentQues }) => {
  const length = slides.length;

  const nextSlide = () => {
    setCurrentQues(currentQues === length - 1 ? 0 : currentQues + 1);
  };

  const prevSlide = () => {
    setCurrentQues(currentQues === 0 ? length - 1 : currentQues - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <Stack
      sx={{
        m: "auto",
        alignItems: "center"
      }}
    >
      <KeyboardArrowUp
        onClick={prevSlide}
        fontSize="large"
        sx={[{ mb: 1 }, iconButton]}
      />
      {slides.map((slide, index) => {
        if (index === currentQues)
          return <CarouselItem key={index} data={slide} />;
      })}
      <KeyboardArrowDown
        onClick={nextSlide}
        fontSize="large"
        sx={[{ mt: 1 }, iconButton]}
      />
    </Stack>
  );
};

export default Carousel;
