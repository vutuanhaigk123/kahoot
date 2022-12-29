import React from "react";
import { useSelector } from "react-redux";
import { API, questionType } from "../../../../../commons/constants";
import MultiChoiceOptions from "./MultiChoiceOptions";
import EditableTextBox from "./EditableTextBox";

const EditType = ({ slideIndex, refetch }) => {
  const presentation = useSelector((state) => state.presentation);

  if (presentation._id && presentation.slides.length > 0) {
    switch (presentation.slides[slideIndex].type) {
      case questionType.MULTIPLE_CHOICE:
        return (
          <>
            {/* Question */}
            <EditableTextBox
              refetch={refetch}
              slideIndex={slideIndex}
              title="Question"
              api={API.UPDATE_SLIDE}
              defaultValue={
                presentation._id ? presentation.slides[slideIndex].question : ""
              }
              fieldName="question"
              otherField={{
                presentationId: presentation._id,
                slideId: presentation.slides[slideIndex]._id
              }}
              placeholder="Enter your question"
            />
            {/* Options */}
            <MultiChoiceOptions slideIndex={slideIndex} refetch={refetch} />
          </>
        );
      case questionType.HEADING:
        return (
          <>
            {/* Heading */}
            <EditableTextBox
              refetch={refetch}
              slideIndex={slideIndex}
              title="Heading"
              api={API.UPDATE_SLIDE}
              defaultValue={
                presentation._id ? presentation.slides[slideIndex].question : ""
              }
              fieldName="question"
              otherField={{
                presentationId: presentation._id,
                slideId: presentation.slides[slideIndex]._id
              }}
              placeholder="Enter your heading"
            />
            {/* Sub heading */}
            <EditableTextBox
              refetch={refetch}
              slideIndex={slideIndex}
              title="Sub heading"
              fieldName="content"
              contentName="heading"
              otherField={{
                presentationId: presentation._id,
                slideId: presentation.slides[slideIndex]._id
              }}
              api={API.UPDATE_SLIDE_CONTENT}
              placeholder="Enter your sub heading"
            />
          </>
        );
      case questionType.PARAGRAPH:
        return (
          <>
            {/* Heading */}
            <EditableTextBox
              refetch={refetch}
              slideIndex={slideIndex}
              title="Heading"
              api={API.UPDATE_SLIDE}
              defaultValue={
                presentation._id ? presentation.slides[slideIndex].question : ""
              }
              fieldName="question"
              otherField={{
                presentationId: presentation._id,
                slideId: presentation.slides[slideIndex]._id
              }}
              placeholder="Enter your heading"
            />
            {/* Paragraph */}
            <EditableTextBox
              refetch={refetch}
              slideIndex={slideIndex}
              title="Paragraph"
              api={API.UPDATE_SLIDE_CONTENT}
              fieldName="content"
              contentName="paragraph"
              otherField={{
                presentationId: presentation._id,
                slideId: presentation.slides[slideIndex]._id
              }}
              placeholder="Enter your paragraph"
              isMultiline={true}
            />
          </>
        );
      default:
        return null;
    }
  }
};

export default EditType;
