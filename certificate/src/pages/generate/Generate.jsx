import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./generate.scss";

const Generate = () => {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleUpload = async () => {
    if (file == null) {
      setError("Please select a file");
    } else {
      try {
        setError("");
        setMsg("");
        setStatus("");
        const formData = new FormData();
        formData.append("file", file);

        setMsg("Uploading...");
        setProgress((prev) => {
          return { ...prev, started: true };
        });
        const res = await apiRequest.post("/user/importUser", formData, {
          onUploadProgress: (progressEvent) => {
            setProgress((prev) => {
              return { ...prev, pc: progressEvent.progress * 100 };
            });
          },
          headers: {
            "Custom-header": "value",
          },
        });

        setMsg("Upload Successful");
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (generating) {
      handleGenerate();
    }
  }, [generating]);

  const handleGenerate = async () => {
    try {
      const res = await apiRequest.get("generate/generateCertificate");
      setStatus("Generated certificates and sent to recipients mail!!");
    } catch (error) {
      console.log(error);
      setStatus("Failed to generate!!");
    } finally {
      setGenerating(false); // Reset generating state to false
    }
  };

  useEffect(() => {
    if (!generating) {
      setMsg("");
    }
  }, [generating]);

  return (
    <div className="container">
      <div className="upload">
        <div className="wrapper">
          <h1>Upload a CSV file</h1>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} className="btn">
            Upload
          </button>
          {progress.started && (
            <progress max="100" value={progress.pc}></progress>
          )}
          {msg && <span className="msg">{msg}</span>}
          {error && <span>{error}</span>}
        </div>
        <div className="generate">
          <button
            disabled={msg !== "Upload Successful"}
            className={msg !== "Upload Successful" ? "inactive" : ""}
            onClick={() => setGenerating(true)}
          >
            {generating ? (
              <span>
                Generating... {generating && <i className="spinner"></i>}
              </span>
            ) : (
              "Generate Certificates"
            )}
          </button>
          {status && <span>{status}</span>}
        </div>
      </div>
      <div className="sideContainer"></div>
    </div>
  );
};

export default Generate;
