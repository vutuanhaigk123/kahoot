import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography
} from "@mui/material";

const BasicCard = ({ data, navigateTo }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: "5px", boxShadow: 3 }}>
      <CardActionArea component={Link} to={navigateTo}>
        <CardMedia
          component="img"
          height="140"
          image="/Groups/GroupCard.png"
          alt="Group photo"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BasicCard;
