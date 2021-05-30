import React from "react";
import {Button, Snackbar, TextField} from "@material-ui/core";
import {DataGrid, setGridPageStateUpdate} from "@material-ui/data-grid";
import readXlsxFile from "read-excel-file";
import FirebaseApp from "../firebase";

const addMultipleStudentExcelFormat =
    "https://firebasestorage.googleapis.com/v0/b/course-manage.appspot.com/o/samples%2FExperiments.xlsx?alt=media&token=f9f62cba-98e5-43aa-b084-a24b2ebec7b4";

const db = FirebaseApp.firestore();

export default function UploadExperimentList({user, handleNext, docId, handleBack, studentCount}) {
    const [data, setData] = React.useState([]);
    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [valid, setValid] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState(false);
    const handleFileChoosen = (e) => {
        if (e.target.files.length > 0)
            readXlsxFile(e.target.files[0]).then((rows) => {
                const columnNames = rows.shift();
                if (columnNames.includes("title")) {
                    const objs = rows.map((row, i) => {
                        const obj = {id: i};
                        row.forEach((cell, i) => {
                            obj[columnNames[i]] = cell;
                        });
                        return obj;
                    });
                    setData(objs);
                    if(studentCount!=objs.length){
                        setSnackbar(true)
                        setValid(false);
                        return;
                    }
                    setSnackbar(false)
                    setValid(true);
                    setLoading(false)
                } else setData([]);
            });
    };

    const handleSave = () => {
        if(studentCount!=data.length){
            setValid(false);
            setLoading(true);
            return;
        }
        setLoading(true);
        console.log(typeof (data))
        let d=Object.keys(data).map((key)=>{
            console.log(key)
            return data[key].title;})
        console.log(d)
        db.doc(docId).update({experiments:d})
                    .then((ref) => {
                        setSaved(true);
                        setLoading(false);
                    });
    };

    const columns = [
        {field: "title", headerName: "Titles", width: 150},
    ];
    return (
        <div>
            <h1>
                Sample excel sheet :
                <a href={addMultipleStudentExcelFormat}>Click here</a>
            </h1>
            <Button variant="contained" component="label">
                Upload File
                <input
                    type="file"
                    onChange={handleFileChoosen}
                    id="excel-sheet"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    aria-describedby="file-input-help"
                    hidden
                />
            </Button>
            <Snackbar
                anchorOrigin={{vertical:'bottom',horizontal:'center'}}
                open={snackbar}
                onClose={()=>{setSnackbar(false)}}
                message={`Experiment Numbers(${data.length}) and Students Numbers(${studentCount}) should be same`}
            />
            {data.length > 0 && (
                <>
                    <div style={{height: "40vh", width: "100vw"}}>
                        <DataGrid columns={columns} rows={data}/>
                    </div>
                    {!saved ? (
                        <Button
                            disabled={loading || !valid}
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Upload
                        </Button>
                    ) : (<>
                            <Button variant="contained" color="primary" onClick={handleBack}>
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext}>
                                Next
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
