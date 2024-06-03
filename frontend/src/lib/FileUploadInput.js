import { useState, useContext, useEffect } from "react";
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import Axios from "axios";

import { SetPopupContext } from "../App";
import { FileContext } from "../lib/FileContext";

const FileUploadInput = (props) => {
  const setPopup = useContext(SetPopupContext);
  const { uploadedFile, setUploadedFile } = useContext(FileContext);

  const { uploadTo, identifier, handleInput } = props;

  const [file, setFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  useEffect(() => {
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  }, [uploadedFile]);

  const handleUpload = () => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor((loaded / total) * 100);
        setUploadPercentage(percentage);
      },
    })
      .then((response) => {
        console.log(response.data);
        handleInput(identifier, `/resume/${response.data.fileName}`);
        setUploadedFile(file); // Save file information to context
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
      })
      .catch((err) => {
        const message = err.response?.data?.message || err.message || "Upload failed";
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: message,
        });
      });
  };

  return (
    <Grid container item xs={12} direction="column" className={props.className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {props.icon}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                console.log(event.target.files);
                setUploadPercentage(0);
                setFile(event.target.files[0]);
              }}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={props.label}
            value={file ? file.name : ""}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", height: "100%" }}
            onClick={handleUpload}
            disabled={!file}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>
      {uploadPercentage > 0 && (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      )}
    </Grid>
  );
};

export default FileUploadInput;
