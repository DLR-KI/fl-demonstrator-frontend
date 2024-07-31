// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { createInference } from '../services/Inference';
import { IModel } from '../services/Models';

const InferenceContainer = (props: { model: IModel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [returnFormat, setReturnFormat] = useState<string>('json');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setJsonInput('');
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonInput(event.target.value);
    setFile(null);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    setError('');
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('model_id', props?.model?.id);
        formData.append('model_input', file);
        formData.append('return_format', returnFormat);
        response = await createInference(formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else if (jsonInput) {
        response = await createInference(JSON.parse(jsonInput), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setResult(JSON.stringify(response?.data, null, 2));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardHeader
          title="Inference"
          subheader="Test the global model, collaboratively trained by all participants, directly on the server."
          sx={{ p: 2 }}
        />
        <CardContent>
          <Box mb={2}>
            <Typography variant="body2">
              <strong>Name:</strong> {props?.model?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Description:</strong> {props?.model?.description}
            </Typography>
          </Box>
          <Box component="form" noValidate autoComplete="off" sx={{ mb: 2, pt: 2 }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span" sx={{ mb: 2 }}>
                Upload File
              </Button>
            </label>
            {file && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Selected File:</strong> {file.name}
                </Typography>
                <IconButton onClick={handleFileRemove} sx={{ ml: 2 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            <Typography variant="body1" component="p" gutterBottom>
              or
            </Typography>
            <TextField
              label="JSON Input"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={jsonInput}
              onChange={handleJsonChange}
              disabled={Boolean(file)}
              sx={{ mt: 2 }}
            />

          </Box>
          {result && (
            <Box mt={2}>
              <Typography variant="h6" component="h2">
                Inference Result
              </Typography>
              <Typography variant="body1" component="pre">
                {result}
              </Typography>
            </Box>
          )}
          {error && (
            <Box mt={2}>
              <Typography variant="h6" component="h2" color="error">
                Error
              </Typography>
              <Typography variant="body1" component="p" color="error">
                {error}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || (!file && !jsonInput)}
            sx={{ m: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default InferenceContainer;
