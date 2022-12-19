import { Dialog, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import React from "react";
import TextBox from "../../../../components/input/TextBox";
import Transition from "../../modal/components/Transition";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import BasicButton from "../../../../components/button/BasicButton";
import { useNavigate } from "react-router-dom";
import { API, PAGE_ROUTES } from "../../../../commons/constants";
import { useQuery } from "react-query";
import { handleGet } from "../../../../utils/fetch";

const options = [
  {
    value: 0,
    label: "Public"
  },
  {
    value: 1,
    label: "Group"
  }
];

const StartPopup = ({ isOpen, handleClose, slideIndex }) => {
  const { error: errorCreated, data: createdGroup } = useQuery(
    "created-groups",
    () => handleGet(`${API.CREATED_GROUP}?page=${0}&limit=${100}`)
  );

  const { error: errorJoined, data: joinedGroup } = useQuery(
    "joined-groups",
    () => handleGet(`${API.JOINED_GROUP}?page=${0}&limit=${100}`)
  );

  const [allGroup, setAllGroup] = React.useState([]);
  React.useEffect(() => {
    if (createdGroup && joinedGroup) {
      setAllGroup([...createdGroup?.info.groups, ...joinedGroup?.info.groups]);
    }
  }, [createdGroup, joinedGroup]);

  // Form
  const schema = yup.object({
    questionType: yup.number().required("Required"),
    group: yup.string().required("Required")
  });
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const presentation = useSelector((state) => state.presentation);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    // Process data
    data.id = presentation._id;
    data.slide = presentation.slides[slideIndex]._id;
    console.log(data);

    if (data.questionType === 0) {
      handleClose();
      navigate(
        PAGE_ROUTES.SLIDES_PRESENT +
          `?id=${presentation._id}&slide=${presentation.slides[slideIndex]._id}`
      );
    } else {
      console.log("handle presentation group");
    }

    // // Handle submit
    // const resp = await handlePost(API.CREATE_SLIDE, data);
    // handleStatus(resp, "");

    // // Close current popup form
    // handleClose();
    // // Open popup message
    // handleOpenMsg();
    // // Refetch groups data
    // refetch();
  };

  if (errorCreated) return "An error has occurred: " + errorCreated.message;
  if (errorJoined) return "An error has occurred: " + errorJoined.message;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      sx={{ zIndex: 800 }}
    >
      <DialogTitle>Choose your presentation's type</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: 10 }}>
          {/* Type select */}
          <TextBox
            label="Presentation's type"
            select
            defaultValue={options[0].value}
            name="questionType"
            control={control}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextBox>
          {/* Group select */}
          {allGroup.length > 0 ? (
            <TextBox
              label="Group"
              select
              defaultValue={allGroup[0].name}
              name="group"
              control={control}
              fullWidth
              sx={{ mt: 2 }}
            >
              {allGroup.map((group) => (
                <MenuItem key={group._id} value={group.name}>
                  {group.name}
                </MenuItem>
              ))}
            </TextBox>
          ) : null}

          <BasicButton type="submit" fullWidth sx={{ mt: 2 }}>
            Start
          </BasicButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartPopup;
