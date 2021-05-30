import React from "react";
import {Button, TextField} from "@material-ui/core";
import {DataGrid, setGridPageStateUpdate} from "@material-ui/data-grid";
import readXlsxFile from "read-excel-file";
import FirebaseApp from "../firebase";

const addMultipleStudentExcelFormat =
    "https://firebasestorage.googleapis.com/v0/b/course-manage.appspot.com/o/samples%2FStudents.xlsx?alt=media&token=1a72c25e-fb4c-47a3-900f-2e6e40b88354";

const db = FirebaseApp.firestore();

export default function UploadStudentList({user, handleNext, docId, setDocId, setStudentCount}) {
    const [data, setData] = React.useState([]);
    const [saved, setSaved] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleFileChoosen = (e) => {
        if (e.target.files.length > 0)
            readXlsxFile(e.target.files[0]).then((rows) => {
                const columnNames = rows.shift();
                if (columnNames.includes("prn") && columnNames.includes("mobileNo")) {
                    const objs = rows.map((row, i) => {
                        const obj = {id: i};
                        row.forEach((cell, i) => {
                            obj[columnNames[i]] = cell;
                        });
                        return obj;
                    });
                    setData(objs);
                } else setData([]);
            });
    };

    const handleSave = () => {
        setLoading(true);
        if (!docId)
            db.doc("pusers/" + user.uid)
                .collection("content")
                .add({students: data})
                .then((ref) => {
                    setDocId(ref.path);
                    setStudentCount(data.length)
                    setSaved(true);
                    setLoading(false);
                });
        else
            db.doc(docId)
                .update({students: data})
                .then((ref) => {
                    setSaved(true);
                    setLoading(false);
                });

    };

    const columns = [
        {field: "prn", headerName: "PRN", width: 150},
        {field: "mobileNo", headerName: "Mobile No", width: 200},
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
            {data.length > 0 && (
                <>
                    <div style={{height: "40vh", width: "100vw"}}>
                        <DataGrid columns={columns} rows={data}/>
                    </div>
                    {!saved ? (
                        <Button
                            disabled={loading}
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                        >
                            Upload
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </>
            )}
        </div>
    );
}
