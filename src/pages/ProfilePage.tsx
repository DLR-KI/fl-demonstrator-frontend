// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UserAvatar from '../components/UserAvatar';
import { getMyself, IUser } from '../services/User';

const ProfilePage = () => {
  const [user, setUser] = useState<null | IUser>(null);


  useEffect(() => {
    getMyself().then(myself => setUser(myself));
  }, []);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box mt={5} mx={2}>
      <Card>
        <CardHeader
          avatar={<UserAvatar user={user}></UserAvatar>}
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" component="div">
                <strong>Username:</strong> {user.username}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" component="div">
                <strong>Actor:</strong> {user.actor ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" component="div">
                <strong>Client:</strong> {user.client ? 'Yes' : 'No'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" component="div">
                <strong>Message Endpoint:</strong> {user.messageEndpoint}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
