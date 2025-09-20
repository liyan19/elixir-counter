import React, { useState, useEffect, useRef } from "react";

const TOTAL_TIME = 300;
const BASE_INTERVAL = 2.8; // seconds per 1 elixir 
const START_ELIXIR = 7;
const MAX_ELIXIR = 10;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [elixir, setElixir] = useState(START_ELIXIR);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);

  // rate in elixir per second depending on remaining time
  const getRate = (time) => {
    const baseRate = 1 / BASE_INTERVAL; // elixir/sec at normal speed
    if (time <= 60) return baseRate * 3;  // last minute
    if (time <= 180) return baseRate * 2; // 2–3 min left
    return baseRate * 1;                  // first 2 minutes
  };

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          setRunning(false);
          return 0;
        }
        return +(t - 0.1).toFixed(1);
      });

      setElixir((e) => {
        const rate = getRate(timeLeft);
        const gain = rate * 0.1;
        return Math.min(MAX_ELIXIR, +(e + gain).toFixed(2));
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [running, timeLeft]);

  const spendElixir = (amount) => {
    setElixir((e) => Math.max(0, +(e - amount).toFixed(2)));
  };

  const startGame = () => {
    if (!running) setRunning(true);
  };

  const resetGame = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(TOTAL_TIME);
    setElixir(START_ELIXIR);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#222",
        fontFamily: "sans-serif",
        color: "white"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Elixir Counter</h1>
        <p style={{ fontSize: "20px" }}>Time Left: {formatTime(timeLeft)}</p>

        {/* Elixir bar */}
        <div
          style={{
            width: "300px",
            height: "25px",
            border: "1px solid black",
            margin: "10px auto",
            background: "#585454ff",
            position: "relative",
          }}
        >

          <div
            style={{
              width: `${(elixir / MAX_ELIXIR) * 100}%`,
              height: "100%",
              background: "purple",
              transition: "width 0.1s linear",
            }}
          />

         
          {[...Array(MAX_ELIXIR + 1)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i / MAX_ELIXIR) * 100}%`,
                top: 0,
                bottom: 0,
                width: "1px",
                background: "black",
                opacity: 0.8,
              }}
            />
          ))}

          
          <span
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "center",
              top: 0,
              left: 0,
              color: "white",
              fontWeight: "bold",
            }}
          >
            {Math.floor(elixir)}
          </span>
        </div>

        {/* Buttons 1–9 */}
        <div style={{ marginTop: 10 }}>
          {[...Array(9)].map((_, i) => (
            <button
              key={i}
              style={{
                margin: "2px",
                padding: "5px 10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => spendElixir(i + 1)}
              disabled={!running}
            >
              -{i + 1}
            </button>
          ))}
        </div>
        {/* +1 button*/}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <button
            onClick={() => setElixir((prev) => Math.min(prev + 1, MAX_ELIXIR))}
            style={{
              margin: "2px",
              padding: "5px 10px",
              background: "limegreen",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            +1
          </button>
        </div>

        {/* Start & Reset */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={startGame}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Start Game
          </button>

          <button
            onClick={resetGame}
            style={{
              padding: "10px 20px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
