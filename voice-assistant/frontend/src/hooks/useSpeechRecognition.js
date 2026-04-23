import { useEffect, useMemo, useRef, useState } from "react";

export const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition,
    []
  );

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };

    recognition.onerror = (event) => {
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [SpeechRecognition]);

  const start = () => {
    if (!recognitionRef.current) return;
    setError("");
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return {
    isSupported: Boolean(SpeechRecognition),
    transcript,
    setTranscript,
    isListening,
    error,
    start,
    stop,
  };
};
