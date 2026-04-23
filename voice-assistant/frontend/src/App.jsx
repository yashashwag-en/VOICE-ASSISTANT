import { useEffect, useState } from "react";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { sendCommand } from "./services/api";
import { createStatusSocket } from "./services/websocket";

const speak = (text) => {
  if (!window.speechSynthesis || !text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

function App() {
  const {
    isSupported,
    transcript,
    setTranscript,
    isListening,
    error: speechError,
    start,
    stop,
  } = useSpeechRecognition();

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [enableTts, setEnableTts] = useState(false);

  useEffect(() => {
    const socket = createStatusSocket(
      (message) => setEvents((prev) => [message, ...prev].slice(0, 20)),
      () => setWsConnected(true),
      () => setWsConnected(false)
    );

    return () => socket.close();
  }, []);

  const onSubmit = async (sourceText) => {
    const text = (sourceText || inputText || transcript).trim();
    if (!text) return;

    setLoading(true);
    try {
      const result = await sendCommand(text);
      setResponse(result);
      setHistory((prev) => [{ text, result, at: new Date().toISOString() }, ...prev]);
      if (enableTts) {
        speak(result?.intent?.responseText || result?.actionResult?.message || "");
      }
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Local AI Voice Assistant MVP</h1>
      <p className="muted">localhost only | safe actions only</p>

      <div className="row">
        <span className={`badge ${wsConnected ? "ok" : "bad"}`}>
          WebSocket: {wsConnected ? "Connected" : "Disconnected"}
        </span>
        <label className="tts-toggle">
          <input
            type="checkbox"
            checked={enableTts}
            onChange={(e) => setEnableTts(e.target.checked)}
          />
          Enable browser TTS
        </label>
      </div>

      {!isSupported && (
        <div className="panel warn">
          SpeechRecognition not supported in this browser. Try latest Chrome or Edge.
        </div>
      )}

      <div className="panel">
        <h3>Mic Controls</h3>
        <div className="row">
          <button disabled={!isSupported || loading} onClick={isListening ? stop : start}>
            {isListening ? "Stop Mic" : "Start Mic"}
          </button>
          <button disabled={loading} onClick={() => onSubmit(transcript)}>
            Send Transcript
          </button>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Live transcript appears here..."
          rows={4}
        />
        {speechError && <p className="error">{speechError}</p>}
      </div>

      <div className="panel">
        <h3>Text Command</h3>
        <div className="row">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Try: "what time is it"'
          />
          <button disabled={loading} onClick={() => onSubmit(inputText)}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>AI Response</h3>
        <pre>{JSON.stringify(response?.intent || response?.error || null, null, 2)}</pre>
      </div>

      <div className="panel">
        <h3>Action Result</h3>
        <pre>{JSON.stringify(response?.actionResult || null, null, 2)}</pre>
      </div>

      <div className="panel">
        <h3>Command History</h3>
        <ul>
          {history.map((item, idx) => (
            <li key={`${item.at}-${idx}`}>
              <strong>{item.text}</strong> - {item.result?.actionResult?.message || "No message"}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel">
        <h3>WebSocket Events</h3>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </div>
    </main>
  );
}

export default App;
