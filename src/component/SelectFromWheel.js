import Wheel from "./wheel/wheel";
import {forwardRef, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogContentText, DialogTitle, Slide, Typography} from "@material-ui/core";
import {useParams} from 'react-router-dom'
import FirebaseApp from "../firebase";

const db = FirebaseApp.firestore()
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function SelectFromWheel() {
    const {doc} = useParams()
    const [enabled, setEnabled] = useState(true);
    const [selectedItem, setSelectedItem] = useState(0);
    const [url, setUrl] = useState(null);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        const unsub = FirebaseApp.auth().onAuthStateChanged(async (u) => {
            if (u !== null) {
                setUser(u);
                unsub()
            }
        });
        return () => {
            unsub();
        };
    }, []);
    useEffect(() => {
        if (user && doc)
            db.doc('link/content/wheel/' + doc).get().then((d) => {
                setUrl(d.get('url'))
            })
        return () => {
        };
    }, [user])
    useEffect(() => {
        console.log('In Url')
        let unsub = () => {
        };
        if (url) {
            db.doc(url.toString()).get().then((res) => {
                const data = res.data();
                var students = data.students;
                var list = Array.from(students)
                list.forEach(value => {
                    if (('+91' + value.mobileNo) === user.phoneNumber) {
                        setItems(Array.from(data.experiments))
                        console.log('verify')
                        if (url) {
                            unsub = db.doc(url.toString()).onSnapshot((res) => {
                                const data = res.data();
                                var students = data.students;
                                var list = Array.from(students)
                                list.forEach(value => {
                                    if (('+91' + value.mobileNo) === user.phoneNumber) {
                                        setItems(Array.from(data.experiments))
                                    }
                                })
                            })
                        }

                    }
                })

            })
        }
        return () => {
            unsub()
        };
    }, [url]);
    const onSelectItem = (item) => {
        console.log(items[item]);
        setEnabled(false)
        setSelectedItem(item)
        setTimeout(() => {
            setOpenDialog(true)
        }, 3500);
    }
    const handleClick = () => {

    }

    return (
        <>
            {user && <>
                <Wheel items={items} onSelectItem={onSelectItem} enabled={enabled} handleClick={handleClick}/>

                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="title"
                    aria-describedby="description"
                >
                    <DialogTitle id="title">{"You Got"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="description">
                            <Typography variant={'h5'}> {items[selectedItem]}</Typography>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </>}
        </>);
}
