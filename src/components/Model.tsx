// import MoreVertIcon from "@mui/icons-material/MoreVert";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Button, Card, CardActions, CardContent, CardHeader, Tooltip } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import { IModel, getModelFile } from "../services/Models";
import { getUser, getUserRepresentation } from "../services/User";
import { useState } from "react";
import { saveAs } from 'file-saver';


const makeTextWithTooltip = (text: string, tooltip: string) => (
  <Tooltip title={tooltip}>
    <span>{text}</span>
  </Tooltip>
)




const Model = ({ model }: { model: IModel }) => {
  const navigate = useNavigate();
  const [ownerRepresentation, setOwnerRepresentation] = useState<string>("");
  getUser(model.owner).then((user) => setOwnerRepresentation(getUserRepresentation(user)));


  const download = () => {
    getModelFile(model.id).then((x) =>
    saveAs(x, "model.pickle"));
  }
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        avatar={<BarChartIcon />}
        // TODO: Empty hamburger menu? Maybe add functions: download, remove, etc.
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={makeTextWithTooltip(model.name ?? "", "Name")}
        subheader={makeTextWithTooltip(ownerRepresentation, "Owner")}
      />
      <CardContent>
        <Typography sx={{ mb: "16px" }}>{/* TODO: Formation? 16px? */}
          {model.description}
        </Typography>

        {/* TODO: Format data table (data below this point) */}
        <Typography>
          Id: {model.id}
        </Typography>
        {/* NOTE: weights is by default undefined (special get call necessary) */}
        {/* <Typography>
          Weights: {model.weights}
        </Typography> */}
        <Typography>
          Round: {model.round}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={download}>
          Download Model
        </Button>
        </CardActions>
    </Card >
  );
};

export default Model;
