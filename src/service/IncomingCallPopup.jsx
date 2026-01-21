import React, { useState, useEffect } from "react";
import { acceptCall, rejectCall } from "../service/twilio";

export default function IncomingCallPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showPopup = () => setShow(true);
    window.addEventListener("incoming-call", showPopup);
    return () => window.removeEventListener("incoming-call", showPopup);
  }, []);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3>📞 Incoming Call...</h3>
        <button
          style={styles.answer}
          onClick={() => {
            acceptCall();
            setShow(false);
          }}
        >
          Answer
        </button>
        <button
          style={styles.reject}
          onClick={() => {
            rejectCall();
            setShow(false);
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: { background: "#fff", padding: "20px 40px", borderRadius: 10 },
  answer: { marginRight: 10, padding: 10, background: "green", color: "#fff" },
  reject: { padding: 10, background: "red", color: "#fff" },
};
