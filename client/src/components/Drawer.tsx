import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[
          { text: "Resume Builder", icon: <BuildCircleIcon />, path: "/resume-builder" },
          { text: "Resume Analyzer", icon: <AutoGraphIcon />, path: "/resume-analyzer" }
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton  onClick={() => handleNavigation(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>{open ? <MenuOpenIcon/> : <MenuIcon />}</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
