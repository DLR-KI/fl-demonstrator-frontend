// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { IParticipantLocations, IUser } from '../services/User';

interface ParticipantsMapProps {
  participants: IUser[];
  locations: IParticipantLocations;
}

const ParticipantsMap: React.FC<ParticipantsMapProps> = ({ participants, locations }) => {

  // Fix the issue with default icon not loading properly
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });


  return (
    <Container>
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(locations).map(([userId, location]) => {
          const user = participants.find(u => u.id === userId);
          return (
            <Marker key={userId} position={[location.lat, location.lng]}>
              <Popup>{user?.username}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map(user => {
              const location = locations[user.id];
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{location ? location.lat : '-'}</TableCell>
                  <TableCell>{location ? location.lng : '-'}</TableCell>
                  <TableCell>{location ? 'Location found' : 'Location could not be found'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

    </Container>
  );
};

export default ParticipantsMap;
