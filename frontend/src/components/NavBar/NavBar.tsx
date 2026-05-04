import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import {  CssBaseline } from "@mui/material";
// import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
  // const onClickLogout = async () => {
  //   await fetch("/logout");
  //   window.location.reload();
  // };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static" sx={{ bgcolor: "white" }}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "center",
              flexGrow: 1,
              mx: 4,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                // margin: "auto",
                color: "black",
              }}
            >
              AI SkillSync by{" "}
              <span style={{ fontWeight: 600, fontSize: "1.25rem" }}>
                Dainik Bhaskar
              </span>
            </Typography>

            {/* <img src={logo_hindi} style={{ height: "30px" }} /> */}
          </Box>
          {/* <Button onClick={onClickLogout} sx={{ mx: 4, color: "black" }}>
            Logout
          </Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
