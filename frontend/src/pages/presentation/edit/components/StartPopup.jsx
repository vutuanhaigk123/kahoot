import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from "@mui/material";
import React from "react";
import Transition from "../../modal/components/Transition";
import { useSelector } from "react-redux";
import BasicButton from "../../../../components/button/BasicButton";
import { useNavigate } from "react-router-dom";
import { API, PAGE_ROUTES } from "../../../../commons/constants";
import { useQuery } from "react-query";
import { handleGet } from "../../../../utils/fetch";
import Empty from "./../../../group/components/Empty";

const PRESNETATION_TYPE = {
  PUBLIC: 1,
  GROUP: 2
};

const options = [
  {
    value: PRESNETATION_TYPE.PUBLIC,
    label: "Public"
  },
  {
    value: PRESNETATION_TYPE.GROUP,
    label: "Group"
  }
];

const StartPopup = ({ isOpen, handleClose, slideIndex }) => {
  const { error: errorCreated, data: createdGroup } = useQuery(
    "created-groups",
    () => handleGet(`${API.CREATED_GROUP}?page=${0}&limit=${100}`)
  );

  const presentation = useSelector((state) => state.presentation);
  const navigate = useNavigate();
  const [startType, setStartType] = React.useState(options[0].value);
  const handleChangeType = (event) => {
    setStartType(event.target.value);
  };
  const [group, setGroup] = React.useState(createdGroup?.info?.groups[0]._id);
  React.useEffect(() => {
    setGroup(createdGroup?.info?.groups[0]._id);
  }, [createdGroup]);
  const handleChangeGroup = (event) => {
    setGroup(event.target.value);
  };

  const [isStarting, setIsStarting] = React.useState(false);
  const handleStart = () => {
    setIsStarting(true);
    var navPath = `${PAGE_ROUTES.SLIDES_PRESENT}?id=${presentation._id}&slide=${presentation.slides[slideIndex]._id}`;
    if (startType === PRESNETATION_TYPE.GROUP) {
      navPath = `${navPath}&group=${group}`;
    }
    navigate(navPath);
    setIsStarting(false);
    handleClose();
  };

  if (errorCreated) return "An error has occurred: " + errorCreated.message;

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
        {/* Type select */}
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>Presentation's type</InputLabel>
          <Select
            label="Presentation's type"
            onChange={handleChangeType}
            value={startType}
          >
            {options.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Group select */}
        {startType === PRESNETATION_TYPE.GROUP ? (
          createdGroup?.info?.groups.length > 0 ? (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <FormLabel>Choose group to present</FormLabel>
              <RadioGroup
                defaultValue={createdGroup?.info?.groups[0]._id}
                value={group}
                onChange={handleChangeGroup}
              >
                {createdGroup?.info?.groups.map((item) => (
                  <FormControlLabel
                    key={item._id}
                    value={item._id}
                    control={<Radio />}
                    label={item.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <Empty img="/Presentation/empty-collab.png" textVariant="h6">
              You haven't create any group yet
            </Empty>
          )
        ) : null}
        <BasicButton
          fullWidth
          sx={{ mt: 2 }}
          disabled={
            createdGroup?.data === null && startType === PRESNETATION_TYPE.GROUP
          }
          onClick={handleStart}
          loading={isStarting}
        >
          Start
        </BasicButton>
        {/* </form> */}
      </DialogContent>
    </Dialog>
  );
};

export default StartPopup;
