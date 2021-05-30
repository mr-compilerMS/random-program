import React from 'react'
import FirebaseApp from "../firebase";
import {StyledFirebaseAuth} from "react-firebaseui";
import firebase from "firebase";
import {Dialog, DialogTitle, Slide} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginModal({open, handleClose}) {

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
            <DialogTitle>Login To Continue</DialogTitle>
            <StyledFirebaseAuth
                uiConfig={{
                    signInFlow: 'popup',
                    signInSuccessUrl:'/new',
                    callbacks:{signInSuccessWithAuthResult(authResult, redirectUrl) {
                        return true
                        }},
                        signInOptions: [
                        {
                            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                            recaptchaParameters: {type:'image',size:'invisible',badge:'bottomleft'},
                            defaultCountry:'IN'
                        }]
                }}
                firebaseAuth={FirebaseApp.auth()}
            />
        </Dialog>)
}