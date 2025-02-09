import React, { Fragment, type MouseEventHandler, useState } from "react";
import { useModalStore } from "store/useModalStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import OnlineIndicator from "components/OnlineIndicator";
import {
  AppBar,
  IconButton,
  Avatar,
  Popover,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  { text: "Home", icon: <BuildCircleIcon />, path: "/" },
  { text: "Builder", icon: <BuildCircleIcon />, path: "/resume-builder" },
  { text: "Analyzer", icon: <AutoGraphIcon />, path: "/resume-analyzer" }
];

const Header: React.FC<Props> = (props: Props) => {
  const { isLoggedIn, account, logout } = useAuth();
  const { setCurrentModal } = useModalStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const [popover, setPopover] = useState(false);

  const openPopover: MouseEventHandler<HTMLButtonElement> = (e) => {
    setPopover(true);
    setAnchorEl(e.currentTarget);
  };

  const closePopover = () => {
    setPopover(false);
    setAnchorEl(null);
  };

  const clickLogin = () => {
    setCurrentModal("LOGIN");
    closePopover();
  };

  const clickRegister = () => {
    setCurrentModal("REGISTER");
    closePopover();
  };
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    // setOpen(false);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={() => handleNavigation(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
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
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            CareerCrafter
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item.text} sx={{ color: "#fff" }} onClick={() => handleNavigation(item.path)}>
                {item.text}
              </Button>
            ))}
          </Box>
          <IconButton onClick={openPopover}>
            <OnlineIndicator online={isLoggedIn}>
              <Avatar
                src={account?.username || ""}
                alt={account?.username || "Guest"}
              />
            </OnlineIndicator>
          </IconButton>

          <Popover
            anchorEl={anchorEl}
            open={popover}
            onClose={closePopover}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <List style={{ minWidth: "100px" }}>
              <ListSubheader style={{ textAlign: "center" }}>
                Hello, {account?.username || "Guest"}
              </ListSubheader>

              {isLoggedIn ? (
                <ListItemButton onClick={logout}>Logout</ListItemButton>
              ) : (
                <Fragment>
                  <ListItemButton onClick={clickLogin}>Login</ListItemButton>
                  <ListItemButton onClick={clickRegister}>
                    Register
                  </ListItemButton>
                </Fragment>
              )}
            </List>
          </Popover>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Header;
