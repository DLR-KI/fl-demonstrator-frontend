// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Container, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import DlrLogo from "../static/img/DLR_Logo_EN_black.png";
import EcoSystem from "../static/img/ecosystem.drawio.png";

/**
 * This function represents the AboutPage component.
 *
 * @returns {JSX.Element} The rendered AboutPage component.
 */
const AboutPage = () => {

  return (
    <React.Fragment>
      <Typography variant="h5">
        Architecture
      </Typography>
      <Divider />
      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Stack direction="row" justifyContent="center">
          <img src={EcoSystem} alt="ecosystem" style={{ maxWidth: "100%" }} />
        </Stack>
      </Container>

      <Typography variant="h5">
        Information
      </Typography>
      <Divider />
      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Typography>
          Federated learning (also known as collaborative learning) is a machine learning technique that trains an algorithm via multiple independent sessions, each using its own dataset. This approach stands in contrast to traditional centralized machine learning techniques where local datasets are merged into one training session, as well as to approaches that assume that local data samples are identically distributed.

          Federated learning enables multiple actors to build a common, robust machine learning model without sharing data, thus addressing critical issues such as data privacy, data security, data access rights and access to heterogeneous data. Its applications engage industries including defense, telecommunications, Internet of Things, and pharmaceuticals. A major open question is when/whether federated learning is preferable to pooled data learning. Another open question concerns the trustworthiness of the devices and the impact of malicious actors on the learned model.
        </Typography>
      </Container>

      <Divider />

      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Stack direction="row">
          <img src={DlrLogo} alt="Logo" width="280" />
        </Stack>
      </Container>
    </React.Fragment>
  );
};

export default AboutPage;
