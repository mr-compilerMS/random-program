import React, {useState} from "react";
import {Box, Button, IconButton, InputAdornment, OutlinedInput, Snackbar, TextField} from "@material-ui/core";
import FirebaseApp from "../firebase";
import {FileCopy} from "@material-ui/icons";
import {Alert} from "@material-ui/lab";

const db = FirebaseApp.firestore()

export default function ShareLink({user, handleBack, docId, setStudentCount}) {

    const [batchName, setBatchName] = useState('');
    const [subject, setSubject] = useState('');
    const [generatedLink, setGeneratedLink] = useState(null);
    const [success, setSuccess] = useState(false);
    const generateLink = () => {
        if (batchName && subject) {
            console.log(docId)
            db.doc(docId)
                .update({batchName, subject})
                .then((ref) => {
                    db.doc('link/content')
                        .collection('wheel')
                        .add({url: docId})
                        .then((pr) => {
                            setGeneratedLink(`${window.location.origin}/wheel/${pr.id}`)
                            console.log(generatedLink)
                        })

                })

        }
    }

        return (<Box flexDirection='row' display='flex' justifyContent='center'>
            <Box flexDirection='column' display='flex' padding='20px' width={300}>
                {!generatedLink ? <>
                    <TextField id="bactchName" label="Enter Batch Name" value={batchName}
                               onChange={(e) => setBatchName(e.target.value)}/>
                    <TextField id="subject" label="Enter Subject" value={subject}
                               onChange={(e) => setSubject(e.target.value)}/>
                    <Button onClick={generateLink}>Generate Link</Button>
                </> : <>
                    <OutlinedInput value={generatedLink}
                                   endAdornment={
                                       <InputAdornment position="end">
                                           <IconButton
                                               aria-label="toggle password visibility"
                                               onClick={() => {
                                                   navigator.clipboard.writeText(generatedLink.toString()).then(() => setSuccess(true))
                                               }}
                                               edge="end"
                                           >
                                               <FileCopy/>
                                           </IconButton>
                                       </InputAdornment>
                                   }>
                    </OutlinedInput>
                    <Snackbar open={success} color='success' autoHideDuration={600} onClose={() => setSuccess(false)}>
                        <Alert onClose={() => setSuccess(false)} severity="success">
                            Copied To Clipboard
                        </Alert>
                    </Snackbar>

                </>}
            </Box>
        </Box>);
    }
