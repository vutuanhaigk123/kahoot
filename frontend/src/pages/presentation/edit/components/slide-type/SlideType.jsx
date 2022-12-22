import React from "react";
import { useSelector } from "react-redux";
import { questionType } from "../../../../../commons/constants";
import MultipleChoiceSlides from "./MultipleChoiceSlides";
import HeadingSlide from "./HeadingSlide";
import ParagraphSlide from "./ParagraphSlide";

const SlideType = ({ slideIndex }) => {
  const presentation = useSelector((state) => state.presentation);

  if (presentation._id && presentation.slides.length > 0) {
    switch (presentation.slides[slideIndex].type) {
      case questionType.MULTIPLE_CHOICE:
        return <MultipleChoiceSlides slideIndex={slideIndex} />;
      case questionType.HEADING:
        return <HeadingSlide slideIndex={slideIndex} />;
      case questionType.PARAGRAPH:
        return <ParagraphSlide slideIndex={slideIndex} />;
      default:
        return null;
    }
  }
};

export default SlideType;
