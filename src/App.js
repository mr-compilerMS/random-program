import {useEffect, useState} from "react";

import {AppBar, Button, makeStyles, Menu, MenuItem, Toolbar, Typography,} from "@material-ui/core";

import FirebaseApp from "./firebase";
import LoginModal from "./component/LoginModal";
import StaffDashboard from "./component/StaffDashboard";

import {Route, Switch, useHistory} from "react-router-dom";
import Login from "./component/Login";
import SelectFromWheel from "./component/SelectFromWheel";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));
export default function App() {
    const classes = useStyles();
    const history = useHistory()
    const [user, setUser] = useState(null);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openLogoutMenu, setOpenLogoutMenu] = useState(false);
    const [staff, setStaff] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    useEffect(() => {
        const unsub = FirebaseApp.auth().onAuthStateChanged(async (u) => {
            if (u) {
                FirebaseApp.firestore()
                    .doc("pusers/" + u.uid)
                    .get()
                    .then((data) => {
                        if (data.data().isStaff) setStaff(true);
                    });
                setOpenLoginModal(false);
                setUser(u);
            }
        });
        return () => {
            unsub();
        };
    }, []);
    const handleClose = () => {
        setAnchorEl(null);
        setOpenLogoutMenu(false);
    };
    const handleLoginClick = () => {
        history.replace('/new')
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenLogoutMenu(true);
    };

    const login = () => {
        if (!user)
            return (
                <Button color="inherit" onClick={handleLoginClick}>
                    Login
                </Button>
            );
        else
            return (
                <div>
                    <Button
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Typography>I am {user.displayName}</Typography>
                    </Button>
                    <Menu
                        id="menu-logout"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={openLogoutMenu}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={() => {
                                FirebaseApp.auth().signOut();
                                setUser(null)
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            );
    };

    return (
        <div>
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        DKTE
                    </Typography>
                    {login()}
                </Toolbar>
            </AppBar>


            <Switch>
                <Route path={"/new"}>
                    <Login/>
                </Route>
                <Route path={"/wheel/:doc"}>
                    <SelectFromWheel user={user}/>
                </Route>
                <Route path={"/"}>
                    {(user!==null && staff===true) ? <StaffDashboard user={user}/> :
                        <>{user===null ?
                        <Typography align={'center'} variant={'h3'}>Login To Continue</Typography>:
                            <Typography variant={'h6'} align={'center'}>Paste url provided by staff in address bar to continue</Typography>
                    }
                        </>}
                </Route>
            </Switch>

            <LoginModal open={openLoginModal} handleClose={handleLoginClick}/>
        </div>
    );
}
