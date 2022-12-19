import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardMedia,
  Paper,
  Typography
} from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { API, PAGE_ROUTES } from "../../../../commons/constants";
import BasicButton from "../../../../components/button/BasicButton";
import Loading from "../../../../components/Loading";
import { handleGet } from "../../../../utils/fetch";
import Empty from "../../../group/components/Empty";

const ColabPresentation = () => {
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery("presentationListColab", () =>
    handleGet(API.PRESENTATION_LIST_COLAB)
  );

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Paper
          sx={{
            p: "40px 40px 20px 40px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "70%",
            margin: "auto",
            gap: 2
          }}
          elevation={5}
        >
          {/* Slide item */}
          {data?.info?.length > 0 ? (
            data.info.map((item) => (
              <Card
                key={item._id}
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  boxShadow: 4
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
                      <Typography variant="h7">ten ng</Typography>
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
                        navigate(PAGE_ROUTES.PRESENTATION + `/${item._id}`)
                      }
                    >
                      Edit
                    </BasicButton>
                  </CardActions>
                </Box>
              </Card>
            ))
          ) : (
            <Empty img={"/Groups/EmptyActivites.jpg"}>
              You haven't been invite to any presentation
            </Empty>
          )}
        </Paper>
      )}
    </>
  );
};

export default ColabPresentation;
