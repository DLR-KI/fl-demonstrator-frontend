// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Logout } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Badge, Button, Link, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { IUser, getMyself, logout } from "../services/User";
import DlrLogo from "../static/img/DLR_Signet_black_cropped.png";
import GithubLogo from "../static/img/github-mark.png";
import UserAvatar from "./UserAvatar";

const drawerWidth = 240;



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface ButtonConfig {
  url: string;
  label: string;
  icon: JSX.Element;
  requiresAdmin?: boolean;
}

const buttons: ButtonConfig[] = [
  { url: '/', label: 'Home', icon: <DashboardIcon /> },
  { url: '/trainings', label: 'Trainings', icon: <BarChartIcon /> },
  { url: '/admin', label: 'Admin', icon: <AdminPanelSettingsIcon />, requiresAdmin: true },
  { url: '/about', label: 'About', icon: <InfoIcon /> },
];

/**
 * A component that renders a dashboard.
 *
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export default function PersistentDrawerLeft() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<null | IUser>(null);


  useEffect(() => {
    getMyself().then(myself => setUser(myself));
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={0} sx={{ bgcolor: "white" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon style={{ color: 'black' }} />
          </IconButton>
          <IconButton
            onClick={() => navigate("/")}
            edge="start"
            color="inherit"
          >
            <img src={DlrLogo} alt="Logo" width="60" />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{
              flexGrow: 1,
              ml: 5,
              mr: 5,
              color: "black",
            }}
          >
            DLR Federated Learning Demonstrator
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Stack direction="row" justifyContent="center">
              <Link sx={{ display: "flex" }} href="https://github.com/DLR-KI/" target="_blank">
                <img src={GithubLogo} alt="Logo" width="30" height="30" />
              </Link>
            </Stack>
          </Box>
          <Button onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{ textTransform: 'none' }}>
            <Typography
              component="h6"
              variant="h6"
              color="inherit"
              noWrap
              sx={{
                // flexGrow: 1,
                ml: 2,
                // mr: 5,
                color: "black",
              }}
            >
              {user && user.firstName + " " + user.lastName}
            </Typography>
            <Box sx={{ flexGrow: 0, ml: 2 }} >

              <Badge color="secondary">
                {user && <UserAvatar user={user} />}
              </Badge>

            </Box>
          </Button>

          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => { navigate("/profile"); handleCloseUserMenu(); }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>

              Profile
            </MenuItem>
            <MenuItem onClick={() => { logout(); window.location.reload(); handleCloseUserMenu(); }}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {buttons.map((button, index) => {
            if (button.requiresAdmin && !user?.actor) {
              return null;
            }
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => { navigate(button.url); handleDrawerClose(); }}>
                  <ListItemIcon>
                    {button.icon}
                  </ListItemIcon>
                  <ListItemText primary={button.label} />
                </ListItemButton>
              </ListItem>)
          })
          }

        </List>

      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box >
  );
}
