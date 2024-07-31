// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import Box from '@mui/material/Box';

import { Divider, Link, Typography } from '@mui/material';
import CreateModelDialog from '../components/CreateModelDialog';
import CreateTrainingDialog from '../components/CreateTrainingDialog';

/**
 * AdminPage is a React functional component that renders the administration page.
 * The administration page includes sections for training and model creation.
 *
 * @returns {JSX.Element} A JSX element containing the administration page layout and functionality.
 */
const AdminPage = () => {
  return (
    <>
      <Box m={5}>
        <Typography variant="h4">
          Model
        </Typography>
        <Typography m={2}>
          Here you can create a model to be trainined with federated-learning. All torch models are supported. However, the preferred way to upload the model is
          the <Link href="https://pytorch.org/docs/stable/jit.html" target="_blank" rel="noopener">TorchScript</Link> format.
        </Typography>
        <CreateModelDialog />
      </Box>

      <Divider />

      <Box m={5}>
        <Typography variant="h4">
          Training
        </Typography>
        <Typography m={2}>
          Here you can create a new federated-learning training process. If you create the training you will be administrator of it,
          meaning you can start and stop the training and add or remove participants. Note that a training process is always connected
          to the specific model you want to train. First you will need to create the model, then you can create the training for it.
        </Typography>
        <CreateTrainingDialog />
      </Box>
    </>
  );
};

export default AdminPage;
