import React from "react";
import {Box, Button, Card, CardContent, makeStyles, Typography} from "@material-ui/core";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Login from "./Login";
import CreateNew from "./CreateNew";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#63c9c1",
        minWidth: "350px",
        maxWidth: '600px',
        margin: '20px',
        color: 'primary'
    }
}));
export default function StaffDashboard({user}) {
    const classes = useStyles();
    return (<>
        <Router>
            <Switch>
                <Route path={'/create'}>
                    <CreateNew user={user}/>
                </Route>
                <Route path='/'>
                    <Box flexDirection='row' display='flex'>
                        <Typography variant='h4'>Your Contents</Typography>
                        <Button variant="contained" component={Link} to={'/create'} color="primary">Create New</Button>
                    </Box>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        alignContent="flex-start"
                        p={1}
                        m={1}
                        bgcolor="background.paper"
                        // css={{ maxWidth: 300 }}
                    >
                        <Card className={classes.root}>
                            <CardContent>
                                <Typography variant='h6'>AMP B1</Typography>
                                <Typography>10 Students remaining</Typography>
                            </CardContent>
                        </Card>

                    </Box>
                </Route>
            </Switch>
        </Router>

    </>);
}
