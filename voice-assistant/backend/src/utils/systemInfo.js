import os from "os";

export const getSystemInfo = () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    platform: os.platform(),
    uptimeSeconds: os.uptime(),
    cpuLoadAverage: os.loadavg(),
    memory: {
      totalBytes: totalMem,
      usedBytes: usedMem,
      freeBytes: freeMem,
      usedPercent: Number(((usedMem / totalMem) * 100).toFixed(2)),
    },
  };
};
