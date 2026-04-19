import { useState } from "react";
import axios from "axios";
import "./App.css";

// 🔥 Firebase imports
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function App() {
  const [hour, setHour] = useState("");
  const [day, setDay] = useState("");
  const [device, setDevice] = useState("6"); // default TV
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    console.log("Button clicked");

    // 🔹 STEP 1: Call Backend API
    let res;
    try {
      res = await axios.get(
        `https://energy-optimizer-c1iv.onrender.com/predict?hour=${hour}&day=${day}&device=${device}`
      );

      console.log("API Response:", res.data);
      setResult(res.data);

    } catch (apiError) {
      console.error("API ERROR:", apiError);
      alert("Backend not connected");
      return; // stop execution if API fails
    }

    // 🔹 STEP 2: Save to Firebase (separate try-catch)
    console.log("Saving to Firebase...");

    try {
      await addDoc(collection(db, "energy_logs"), {
        hour: Number(hour),
        day: Number(day),
        device: device,
        predicted_duration: res.data.predicted_duration,
        suggestion: res.data.suggestion,
        cost: res.data.predicted_duration * 8,
        efficiency: Math.max(100 - res.data.predicted_duration * 10, 50),
        timestamp: new Date()
      });

      console.log("✅ Saved successfully to Firebase!");

    } catch (firebaseError) {
      console.error("🔥 FIREBASE ERROR:", firebaseError);
      alert("Firebase error — check console");
    }
  };

  const cost = result ? (result.predicted_duration * 8).toFixed(0) : 0;
  const efficiency = result
    ? Math.max(100 - result.predicted_duration * 10, 50).toFixed(0)
    : 0;

  const getTip = () => {
    switch (device) {
      case "1": return "💡 Set AC temperature to 24°C to save energy.";
      case "2": return "💡 Use fan at medium speed to reduce power usage.";
      case "3": return "💡 Avoid continuous heater usage.";
      case "4": return "💡 Run washing machine on full load.";
      case "5": return "💡 Avoid frequent refrigerator opening.";
      case "6": return "💡 Enable auto-brightness on your TV to cut screen power by 20%.";
      default: return "";
    }
  };

  return (
    <div className="app">
      <div className="header">
        <span className="live">● LIVE ANALYSIS</span>
        <h1>Energy <span>Optimizer</span></h1>
      </div>

      {/* INPUT */}
      <div className="card input-card">
        <p className="label">USAGE DETAILS</p>

        <div className="row">
          <div>
            <p>HOURS / DAY</p>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
          </div>

          <div>
            <p>DAYS / WEEK</p>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>

          <div>
            <p>APPLIANCE</p>
            <select value={device} onChange={(e) => setDevice(e.target.value)}>
              <option value="1">AC</option>
              <option value="2">Fan</option>
              <option value="3">Heater</option>
              <option value="4">Washing Machine</option>
              <option value="5">Refrigerator</option>
              <option value="6">TV</option>
            </select>
          </div>
        </div>

        <button className="predict" onClick={handlePredict}>
          Predict Usage
        </button>
      </div>

      {result && (
        <>
          <div className="cards">
            <div className="card small">
              <p>PREDICTED DURATION</p>
              <h2>{result.predicted_duration.toFixed(2)} hrs</h2>
              <span>hours per day (effective)</span>
              <div className="bar"><div style={{ width: "40%" }}></div></div>
            </div>

            <div className="card small">
              <p>ESTIMATED MONTHLY COST</p>
              <h2>₹{cost}</h2>
              <span>based on ₹8/kWh</span>
              <div className="bar"><div style={{ width: "20%" }}></div></div>
            </div>
          </div>

          <div className="card efficiency">
            <p>EFFICIENCY SCORE</p>

            <div className="eff-content">
              <div className="circle">{efficiency}%</div>
              <div>
                <span>Weekly kWh</span>
                <h3>{(result.predicted_duration * 0.8).toFixed(1)} kWh</h3>
              </div>
            </div>
          </div>

          <div className="tip">{getTip()}</div>
        </>
      )}
    </div>
  );
}

export default App;