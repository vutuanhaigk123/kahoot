import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import CarouselItem from "./CarouselItem";
import { iconButton } from "../../../../../commons/globalStyles";

const Carousel = ({ slides }) => {
  const [current, setCurrent] = React.useState(0);
  const length = slides.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        m: "auto"
      }}
    >
      <ArrowLeft
        onClick={nextSlide}
        fontSize="large"
        sx={[
          {
            position: "absolute",
            top: "20%",
            left: "-20%"
          },
          iconButton
        ]}
      />
      <ArrowRight
        onClick={prevSlide}
        fontSize="large"
        sx={[{ position: "absolute", top: "20%", right: "-20%" }, iconButton]}
      />
      {slides.map((slide, index) => {
        if (index === current) return <CarouselItem key={index} data={slide} />;
      })}
    </Box>
  );
};

export default Carousel;
