// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0


import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, InputLabel, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { FormEvent, useEffect, useState } from 'react';
import { createModel } from '../services/Models';
import CustomAlert from './CustomAlert';

/**
 * A component that renders a dialog for creating a model.
 *
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export default function CreateModelDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPreprocessingFile, setModelPreprocessingFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    setIsFormValid(name !== '' && description !== '' && modelFile !== null);
  }, [name, description, modelFile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name"));
    const description = String(data.get("description"));

    try {
      const response = await createModel({
        name,
        description,
        model_file: modelFile,
      });

      if (response) {
        setSuccess(true);
        setOpen(false);
      } else {
        throw new Error("Failed to create Model");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setOpen(false);
    }
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setModelFile(file);
  };

  const handleModelPreprocessingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setModelPreprocessingFile(file)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onExit = () => {
    setSuccess(false);
    setError(null);
  };

  const handleModelPreprocessingFileRemove = () => {
    setModelPreprocessingFile(null);
  };

  const handleModelFileRemove = () => {
    setModelFile(null);
  };

  return (
    <React.Fragment>
      {success && <CustomAlert message={"Model successfully created!"} onExit={onExit} />}
      {error && <CustomAlert message={"Model not created! " + error} severity="error" onExit={onExit} />}

      <Button variant="contained" onClick={handleClickOpen} sx={{ m: 2 }}>
        Create Model
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Create Model</DialogTitle>
          <DialogContent>
            <DialogContentText>You can create a new model here.</DialogContentText>
            <TextField
              margin="normal"
              id="name"
              name="name"
              required
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <InputLabel id="clients-helper-label" sx={{ mt: 2 }}>
              Model File *
            </InputLabel>
            <Button component="label" sx={{ mt: 1 }}>
              Upload Model
              <input
                type="file"
                hidden
                required
                accept="*"
                onChange={handleModelFileChange}
              />
            </Button>
            {modelFile && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Selected File:</strong> {modelFile.name}
                </Typography>
                <IconButton onClick={handleModelFileRemove} sx={{ ml: 2 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            <InputLabel id="clients-helper-label" sx={{ 'mt': 2 }}>
              Preprocessing File
            </InputLabel>
            <Button
              component="label"
              sx={{ 'mt': 1 }}
            >
              Upload Preprocessing Model
              <input
                type="file"
                hidden
                accept="*"
                onChange={handleModelPreprocessingFileChange}
              />
            </Button>
            {modelPreprocessingFile && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Selected File:</strong> {modelPreprocessingFile.name}
                </Typography>
                <IconButton onClick={handleModelPreprocessingFileRemove} sx={{ ml: 2 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">Cancel</Button>
            <Button type="submit" disabled={!isFormValid} color="primary">Create</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
