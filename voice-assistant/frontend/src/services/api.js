const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const sendCommand = async (text) => {
  const response = await fetch(`${BACKEND_URL}/api/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Request failed.");
  }

  return response.json();
};

export const getBackendUrl = () => BACKEND_URL;
