import React, { useEffect, useRef, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
} from "lucide-react";

const VoiceCallUser = () => {
  const deviceRef = useRef(null);
  const callRef = useRef(null);
  const [identity] = useState(
    "user_" + Math.random().toString(36).substr(2, 9)
  );
  const [to, setTo] = useState("+447879175585");
  const [callState, setCallState] = useState("idle"); // idle, calling, connecting, connected, ended
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  // Setup Twilio Device
  const setupTwilio = async () => {
    try {
      setError("");

      // Get access token from Laravel backend
      const response = await fetch(
        "https://apiboltix.aideepseek.uk/api/twilio/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const data = await response.json();
      const token = data.token;

      // Initialize Twilio Device
      const device = new Device(token, {
        logLevel: 1,
        codecPreferences: ["opus", "pcmu"],
      });

      // Device event listeners
      device.on("registered", () => {
        console.log("Twilio Device ready to make calls");
      });

      device.on("error", (error) => {
        console.error("Twilio Device error:", error);
        setError("Device error: " + error.message);
        setCallState("idle");
      });

      device.on("incoming", (call) => {
        console.log("Incoming call from:", call.parameters.From);
        handleIncomingCall(call);
      });

      deviceRef.current = device;
      await device.register();
    } catch (err) {
      console.error("Setup error:", err);
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to initialize. Please check your connection."
      );
    }
  };

  // Handle incoming calls
  const handleIncomingCall = (call) => {
    callRef.current = call;
    setCallState("calling");
    setTo(call.parameters.From);

    call.on("accept", () => {
      console.log("Incoming call accepted");
      setCallState("connected");
      startTimer();
    });

    call.on("disconnect", () => {
      console.log("Incoming call disconnected");
      endCall();
    });

    call.on("cancel", () => {
      console.log("Incoming call cancelled");
      setCallState("idle");
    });

    // Auto-accept after 1 second (or you can show accept/reject buttons)
    setTimeout(() => {
      call.accept();
    }, 1000);
  };

  // Make outgoing call
  const makeCall = async () => {
    if (callState !== "idle" || !deviceRef.current) return;

    if (!to || to.trim() === "") {
      setError("Please enter a phone number");
      return;
    }

    try {
      setError("");
      setCallState("connecting");

      // Connect call through Twilio Device
      const call = await deviceRef.current.connect({
        params: {
          To: to,
        },
      });

      callRef.current = call;

      // Call event listeners
      call.on("accept", () => {
        console.log("Call connected");
        setCallState("connected");
        startTimer();
      });

      call.on("disconnect", () => {
        console.log("Call disconnected");
        endCall();
      });

      call.on("cancel", () => {
        console.log("Call cancelled");
        setCallState("idle");
      });

      call.on("reject", () => {
        console.log("Call rejected");
        setCallState("idle");
        setError("Call was rejected");
      });

      call.on("error", (error) => {
        console.error("Call error:", error);
        setError("Call error: " + error.message);
        setCallState("idle");
      });

      // Update to calling state
      setCallState("calling");
    } catch (err) {
      console.error("Make call error:", err);
      setError("Failed to make call: " + err.message);
      setCallState("idle");
    }
  };

  // End active call
  const endCall = () => {
    if (callRef.current) {
      callRef.current.disconnect();
      callRef.current = null;
    }

    setCallState("ended");
    stopTimer();

    setTimeout(() => {
      setCallState("idle");
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeaker(false);
    }, 2000);
  };

  // Timer functions
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Audio controls
  const toggleMute = () => {
    if (callRef.current) {
      callRef.current.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    // Note: Speaker toggle requires additional audio output selection logic
    // This is a placeholder - actual implementation depends on browser capabilities
    setIsSpeaker(!isSpeaker);

    if (callRef.current && callRef.current.getRemoteStream) {
      const audioElement = new Audio();
      audioElement.srcObject = callRef.current.getRemoteStream();
      // Additional audio routing logic would go here
    }
  };

  // Initialize on mount
  useEffect(() => {
    setupTwilio();

    return () => {
      stopTimer();
      if (callRef.current) {
        callRef.current.disconnect();
      }
      if (deviceRef.current) {
        deviceRef.current.unregister();
        deviceRef.current.destroy();
      }
    };
  }, []);

  // Format phone number display
  const formatPhoneNumber = (phone) => {
    return phone || "Unknown";
  };

  // Idle state - number input
  if (callState === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-12 h-12 text-teal-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Voice Call
              </h1>
              <p className="text-gray-500 text-sm">Enter a number to call</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
                />
              </div>

              <button
                onClick={makeCall}
                disabled={!deviceRef.current}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-5 h-5" />
                {deviceRef.current ? "Call" : "Initializing..."}
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              Identity: {identity}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active call states
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 via-teal-600 to-teal-700 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <User className="w-16 h-16 text-white" />
        </div>

        <h2 className="text-white text-2xl font-semibold mb-2">
          {formatPhoneNumber(to)}
        </h2>

        <div className="text-white/90 text-lg">
          {callState === "connecting" && (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-pulse">Connecting</span>
              <span className="flex gap-1">
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </span>
            </div>
          )}
          {callState === "calling" && (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-pulse">Calling</span>
              <span className="flex gap-1">
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </span>
            </div>
          )}
          {callState === "connected" && formatDuration(callDuration)}
          {callState === "ended" && "Call ended"}
        </div>

        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-lg text-white text-sm max-w-xs mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Control buttons */}
      <div className="pb-12 px-8">
        {callState === "connected" && (
          <div className="flex justify-center gap-8 mb-12">
            <button
              onClick={toggleSpeaker}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isSpeaker
                  ? "bg-white text-teal-600"
                  : "bg-white/20 backdrop-blur-sm text-white"
              }`}
            >
              {isSpeaker ? (
                <Volume2 className="w-7 h-7" />
              ) : (
                <VolumeX className="w-7 h-7" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isMuted
                  ? "bg-white text-teal-600"
                  : "bg-white/20 backdrop-blur-sm text-white"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-7 h-7" />
              ) : (
                <Mic className="w-7 h-7" />
              )}
            </button>
          </div>
        )}

        {/* End call button */}
        <div className="flex justify-center">
          <button
            onClick={endCall}
            disabled={callState === "ended"}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 disabled:bg-red-400 rounded-full flex items-center justify-center shadow-2xl transition-all transform active:scale-95 disabled:cursor-not-allowed"
          >
            <PhoneOff className="w-9 h-9 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallUser;
