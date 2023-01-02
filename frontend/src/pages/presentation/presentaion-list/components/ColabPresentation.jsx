import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  List,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { API, PAGE_ROUTES } from "../../../../commons/constants";
import BasicButton from "../../../../components/button/BasicButton";
import { handleGet } from "../../../../utils/fetch";
import Empty from "../../../group/components/Empty";

const ColabPresentation = () => {
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery("presentationListColab", () =>
    handleGet(API.PRESENTATION_LIST_COLLAB)
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <Paper
      sx={{
        p: "40px 40px 20px 40px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        maxWidth: "100%",
        margin: "auto",
        gap: 2,
        maxHeight: "60vh"
      }}
      elevation={5}
    >
      {/* Slide item */}
      {data?.info?.length > 0 ? (
        <List sx={{ maxHeight: "100%", overflowY: "scroll" }}>
          {data.info.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                boxShadow: 4,
                mb: 2
              }}
            >
              {/* Left side */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Slide img */}
                <CardMedia
                  component="img"
                  sx={{ width: 200 }}
                  image="/Slides/SlidesList.png"
                  alt="Slides image"
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // margin: "auto",
                    p: "20px 0 20px 0"
                  }}
                >
                  <Typography variant="h5">{item.title}</Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Avatar></Avatar>
                    <Typography variant="h7">{item.ownerName}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right side */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <CardActions sx={{ alignSelf: "end" }}></CardActions>
                <CardActions>
                  <BasicButton
                    size="small"
                    width="100%"
                    icon={<Edit />}
                    variant="contained"
                    onClick={() =>
                      navigate(PAGE_ROUTES.PRESENTATION + `/${item.id}`)
                    }
                  >
                    Edit
                  </BasicButton>
                </CardActions>
              </Box>
            </Card>
          ))}
        </List>
      ) : isLoading ? (
        <CircularProgress sx={{ m: "auto" }} />
      ) : (
        <Empty img={"/Groups/EmptyActivites.jpg"}>
          You haven't been invite to any presentation
        </Empty>
      )}
    </Paper>
  );
};

export default ColabPresentation;
