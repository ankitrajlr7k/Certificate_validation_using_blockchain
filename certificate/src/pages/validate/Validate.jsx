import { useState } from "react";
import "./validate.scss";
import apiRequest from "../../lib/apiRequest";
import QrScanner from "react-qr-scanner";

function Validate() {
  const [isValid, setIsValid] = useState(false);
  const [err, setErr] = useState("");

  const handleScan = async (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text);
        const res = await apiRequest.post(
          "/generate/verifyCertificate",
          parsedData
        );
        setIsValid(true);
        setErr("");
      } catch (error) {
        setIsValid(false);
        setErr("Certificate is not valid!!");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="container">
      <div className="validate">
        <h1>Certificate Validator</h1>
        <div className="qr-reader">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "80%" }}
          />
        </div>
        {isValid ? (
          <p className="text">Certificate is valid!!</p>
        ) : (
          <p className="text">{err}</p>
        )}
      </div>
      <div className="sideContainer"></div>
    </div>
  );
}

export default Validate;
