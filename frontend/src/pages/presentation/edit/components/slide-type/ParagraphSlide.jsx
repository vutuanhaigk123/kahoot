import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const ParagraphSlide = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          overflow: "hidden",
          overflowWrap: "break-word",
          width: "100%",
          textAlign: "center"
        }}
      >
        {/* {presentation.slides[slideIndex].question} */}
        Đây là câu hỏi rất dài ok dsadsadsadsad asd
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "start" }}>
        {/* {presentation.slides[slideIndex].question} */}
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
        inventore quis est delectus voluptatibus fuga similique, maiores eos
        eveniet alias aliquid eius dolorem recusandae suscipit at cumque minus!
        Magni, beatae? Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        Voluptatum inventore quis est delectus voluptatibus fuga similique,
        maiores eos eveniet alias aliquid eius dolorem recusandae suscipit at
        cumque minus! Magni, beatae? Lorem, ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatum inventore quis est delectus voluptatibus
        fuga similique, maiores eos eveniet alias aliquid eius dolorem
        recusandae suscipit at cumque minus! Magni, beatae? Lorem, ipsum dolor
        sit amet consectetur adipisicing elit. Voluptatum inventore quis est
      </Typography>
    </>
  );
};

export default ParagraphSlide;
