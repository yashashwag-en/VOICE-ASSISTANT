const now = () => new Date().toISOString();

export const logger = {
  info(message, meta = {}) {
    console.log(`[INFO] ${now()} ${message}`, meta);
  },
  warn(message, meta = {}) {
    console.warn(`[WARN] ${now()} ${message}`, meta);
  },
  error(message, meta = {}) {
    console.error(`[ERROR] ${now()} ${message}`, meta);
  },
};
