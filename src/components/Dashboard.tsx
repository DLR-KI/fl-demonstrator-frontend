import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";
import { Badge, Container, Link, Menu, MenuItem, Stack } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import DlrLogo from "../static/img/DLR_Signet_white.png";
import { IUser, userService } from "../services/User";
import UserAvatar from "./UserAvatar";
import GitlabLogo from "../static/img/gitlab.png";


const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<null | IUser>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    async function fetchData() {
      const user = await userService.getMyself();
      setUser(user[0]);
    }

    fetchData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const icons = [<DashboardIcon key="0" />, <BarChartIcon key="0" />, <LayersIcon key="0" />, <PeopleIcon key="0" />];
  const links = ["/", "/models", "/trainings"/*, "/participants"*/];  // TODO: participants

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {["Home", "Models", "Trainings"/*, "Participants"*/].map((text, index) => (  // TODO: participants
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => { navigate(links[index]); }}>
              <ListItemIcon>
                {icons[index]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
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
            }}
          >
            DLR Federated Learning Demonstrator
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Stack direction="row" justifyContent="center">
              <Container>
                <Link sx={{ display: "flex" }} href="https://github.com/DLR-KI/" target="_blank">
                  <img src={GitlabLogo} alt="Logo" width="30" height="30" />
                </Link>
              </Container>
            </Stack>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Badge color="secondary">
                {user && <UserAvatar user={user} />}
              </Badge>
            </IconButton>

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
                Profile
              </MenuItem>
              <MenuItem onClick={() => { userService.logout(); window.location.reload(); handleCloseUserMenu(); }}>
                Log Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container>
          <Box mt={5}>
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
