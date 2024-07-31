// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Box, Checkbox, FormControl, Link, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { IModel, getModels } from '../services/Models';
import { AggregationMethodLabel, ITraining, createTraining, getTrainings } from '../services/Trainings';
import { IUser, getAllUsers } from '../services/User';
import CustomAlert from './CustomAlert';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * A component that renders a dialog for creating a training.
 *
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export default function CreateTrainingDialog() {
  const [open, setOpen] = useState(false);
  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [models, setModels] = useState<IModel[]>([]);
  const [selected, setSelected] = useState<IUser[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [newTrainingId, setNewTrainingId] = useState<string>("");
  const [modelName, setModelName] = useState<string>('');
  const [targetNumUpdates, setTargetNumUpdates] = useState<number>(1);
  const [metricNames, setMetricNames] = useState<string>('accuracy, f1_score');
  const [aggregationMethod, setAggregationMethod] = useState<string>(Object.values(AggregationMethodLabel)[0]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    getTrainings().then(setTrainings);
    getModels().then(setModels);
  }, []);

  useEffect(() => {
    getAllUsers().then(setUsers)
  }, [trainings]);

  useEffect(() => {
    setIsFormValid(
      modelName !== '' &&
      targetNumUpdates > 0 &&
      metricNames !== '' &&
      aggregationMethod !== '' &&
      selected.length > 0
    );
  }, [modelName, targetNumUpdates, metricNames, aggregationMethod, selected]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const modelName = String(data.get("modelName"));
    const modelId = String(models.find((x) => x.name === modelName)?.id); // TODO: if models can have the same name, this may fail to get the correct id
    const target_num_updates = Number(data.get("target_num_updates"));
    const metric_names = String(data.get("metric_names")).split(",");
    const aggregation_method = String(data.get("aggregation_method"));

    let response = await createTraining({
      "model_id": modelId,
      "target_num_updates": target_num_updates,
      "metric_names": metric_names,
      "aggregation_method": aggregation_method,
      "clients": selected.map(user => user.id),
    });

    if (response) {
      setNewTrainingId(response.trainingId)
      setSuccess(true);
      setOpen(false);
    }
    else {
      setError(true);
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onExit = () => {
    setSuccess(false);
    setError(false);
  };

  return (
    <React.Fragment>
      {success && <CustomAlert message={<>Training successfully created! <Link href={"/training/" + newTrainingId}>Go to Training</Link> </>} onExit={onExit} />}
      {error && <CustomAlert message="Training not created!" severity="error" onExit={onExit} />}
      {users &&
        <React.Fragment>
          <Button variant="contained" onClick={handleClickOpen} sx={{ 'm': 2 }}>
            Create Training
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <Box component="form" onSubmit={handleSubmit}>
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
                  label="Model Name"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                >
                  {models.map((x) =>
                    <MenuItem key={x.id} value={x.name}>
                      {x.name}
                    </MenuItem>
                  )}
                </TextField>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="target_num_updates"
                  label="Target Num Updates"
                  name="target_num_updates"
                  type="number"
                  value={targetNumUpdates}
                  onChange={(e) => setTargetNumUpdates(Number(e.target.value))}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 1000,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="metric_names"
                  label="Metric Names"
                  name="metric_names"
                  value={metricNames}
                  onChange={(e) => setMetricNames(e.target.value)}
                />
                <TextField
                  margin="normal"
                  id="aggregation_method"
                  name="aggregation_method"
                  select
                  required
                  fullWidth
                  label="Aggregation Method"
                  value={aggregationMethod}
                  onChange={(e) => setAggregationMethod(e.target.value)}
                >
                  {Object.values(AggregationMethodLabel).map(x =>
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  )}
                </TextField>
                <FormControl sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap' }}>
                  <Autocomplete
                    multiple
                    id="participants-input"
                    options={users}
                    disableCloseOnSelect
                    onChange={(ev, inp) => setSelected(inp)}
                    getOptionLabel={(option) => option.firstName + " " + option.lastName}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.firstName + " " + option.lastName}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Participants" />
                    )}
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button type="submit" color="primary" disabled={!isFormValid}>Create</Button>
              </DialogActions>
            </Box>
          </Dialog>
        </React.Fragment>
      }
    </React.Fragment>
  );
}
