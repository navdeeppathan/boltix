import axios from "axios";
import { Device } from "@twilio/voice-sdk";
import { toast } from "react-toastify";

let device = null;
let incomingCall = null;

export async function registerClient(identity) {
  const res = await axios.post(
    "https://apiboltix.aideepseek.uk/api/twilio/token",
    {
      identity,
    }
  );
  device = new Device(res.data.token, { logLevel: 1 });

  device.on("ready", () => console.log("Twilio Ready!"));
  device.on("error", (e) => console.log("Error", e));

  device.on("incoming", (call) => {
    incomingCall = call;
    window.dispatchEvent(new Event("incoming-call"));
  });
}

export function callUser(targetIdentity) {
  if (!device) return toast.error("Device not ready");

  device.connect({ params: { To: targetIdentity } });
  toast.info(`📞 Calling ${targetIdentity}`);
}

export function acceptCall() {
  if (incomingCall) incomingCall.accept();
}

export function rejectCall() {
  if (incomingCall) incomingCall.reject();
}

export function endCall() {
  if (device) device.disconnectAll();
}
