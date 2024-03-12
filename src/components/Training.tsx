import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Menu, MenuItem, SvgIconProps } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StartIcon from "@mui/icons-material/Start";
import StorageIcon from "@mui/icons-material/Storage";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LayersIcon from "@mui/icons-material/Layers";

import { useNavigate } from "react-router-dom";

import { ITraining, TrainingState } from "../services/Trainings";
import { IModel, getModel } from "../services/Models";
import { useEffect, useState } from "react";
import AlertDialogSlide from "./SlideInDialog";


export const TrainingStatusIcon = (props: SvgIconProps & { state: TrainingState }) => {
  let { state, ...iconProps } = props;
  if (state === TrainingState.INITIAL)
    return <StartIcon {...iconProps} />;
  else if (state === TrainingState.COMPLETED)
    return <CheckCircleOutlineIcon {...iconProps} />;
  else if (state === TrainingState.ONGOING)
    return <StorageIcon {...iconProps} />;
  else if (state === TrainingState.SWAG_ROUND)
    return <AutorenewIcon {...iconProps} />;
  else
    return <ErrorOutlineIcon {...iconProps} />;
};


const Training = ({ training }: { training: ITraining }) => {
  const navigate = useNavigate();
  const [model, setModel] = useState<IModel>();

  useEffect(() => {
    getModel(training.model).then(setModel);
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <AlertDialogSlide buttonTitle="Delete" dialogTitle="Do you really want to delete this?" dialogContent="If I were you, I would think twice..." ></AlertDialogSlide>
    </Menu>
  );


  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        avatar={<LayersIcon />}
        action={
          <IconButton aria-label="settings" onClick={handleProfileMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        }
        title={"Training for the " + model?.name }
        subheader={"Last Update: " + new Date(training.lastUpdate).toLocaleString()}
      />
      <CardContent>
        {/* TODO: Format data table (data below this point) */}
        <Typography>
          Id: {training.id}
        </Typography>
        <Typography>
          State: <TrainingStatusIcon state={training.state} sx={{ verticalAlign: "bottom" }} />
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={() => { navigate("/training/" + training.id); }}>Details</Button>
      </CardActions>
      {renderMenu}
    </Card>
  );
};

export default Training;
