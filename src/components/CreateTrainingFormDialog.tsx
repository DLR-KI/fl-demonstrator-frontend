import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Checkbox, Chip, Container, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack } from '@mui/material';
import { AggregationMethod, AggregationMethodLabel, ITraining, TrainingStateLabel, createTraining, getTrainings } from '../services/Trainings';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IUser, userService } from '../services/User';
import { IModel, getModels } from '../services/Models';
import MultipleSelectCheckmarks from './MultipleSelect';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getAllParticipants = (trainings: any) => {
  const allParticipants: string[] = [];
  for (let i of trainings) {
    for (let j of i.participants) {
      if (! (j in allParticipants) )
        allParticipants.push(j)
    }
  }
  return allParticipants;
}


export default function CreateTrainingFormDialog() {
  const [open, setOpen] = useState(false);
  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [group, setGroup] = useState<[Object]>([{}]); // get available Users to add to training
  const [models, setModels] = useState<IModel[]>([]);
  const [allParticipants, setAllParticipants] = useState<Array<string>>([""]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modelFileUrl, setModelFileUrl] = useState<string>("");


  useEffect(() => {
    getTrainings().then(setTrainings);
    getModels().then(setModels);
  }, []);

  useEffect(() => {
    if (!trainings) return;
    userService.getGroups().then(setGroup);
    setAllParticipants(getAllParticipants(trainings))
  }, [trainings]);


  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const {
      target: { value },
    } = event;
    setSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const modelName = String(data.get("modelName"));
    const modelId = String(models.find((x) => x.name === modelName)?.id); // TODO: if models can have the same name, this may fail to get the correct id
    const target_num_updates = Number(data.get("target_num_updates"));
    const metric_names = String(data.get("metric_names")).split(",");
    const aggregation_method = String(data.get("aggregation_method"));

    createTraining({
      "model_id": modelId,
      "target_num_updates": target_num_updates,
      "metric_names": metric_names,
      "aggregation_method": aggregation_method,
      "clients": selected,
    })
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Create Training
      </Button>
      <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}
      >
        <DialogTitle>Create Training</DialogTitle>
        <DialogContent >
          <DialogContentText>
            You can create a new training here.
          </DialogContentText>
          <TextField
          margin="normal"
          id="modelName"
          name="modelName"
          select
          required
          fullWidth
          label="modelName"
          defaultValue=""
          >
            {models.map((x) =>
              <MenuItem key={x.id} value={x.name}>
                {x.name}
              </MenuItem>
              )
            }
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="target_num_updates"
            label="target_num_updates"
            name="target_num_updates"
            type="number"
            defaultValue="0"
            InputProps={{
              inputProps: {
                min: 0,
                max: 1000,
              },
            }}
          />
          <TextField
          margin="normal"
          required
          fullWidth
          id="metric_names"
          label="metric_names"
          name="metric_names"
          defaultValue="accuracy, f1_score"
          />
          <TextField
          margin="normal"
          id="aggregation_method"
          name="aggregation_method"
          select
          required
          fullWidth
          label="aggregation_method"
          defaultValue={Object.values(AggregationMethodLabel)[0]}
          >
          {Object.values(AggregationMethodLabel).map( x =>
              <MenuItem key={x} value={x}>
                {x}
              </MenuItem>
              )
            }
          </TextField>
          <FormControl sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap'}}>
          <InputLabel id="clients-helper-label">Clients</InputLabel>
          <Select
          labelId="clients-helper-label"
          label="Clients"
          id="clients-checkbox"
          multiple
          fullWidth
          value={selected}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {allParticipants.map((d: any) => (
            <MenuItem key={d} value={d}>
              <Checkbox checked={selected.indexOf(d) > -1} />
              <ListItemText primary={d} />
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
