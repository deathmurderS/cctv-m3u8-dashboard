let streams = [
  {
    id: 'cctv 001',
    name: 'nama jalan atau lokasi',
    url: 'url yang kamu dapatkan dari pihak penyedia',
    location: 'tepat lokasi kamera',
    status: 'active',
    region: 'Indonesia',
    code: '001',
    startTime: new Date().toISOString(),
    lastOnline: new Date().toISOString(),
    lastOffline: null,
    totalUptime: 0,
    totalDowntime: 0,
    uptimePercentage: 100,
    downtimePercentage: 0,
    uptimeHistory: [],
    downtimeHistory: [],
    currentStatus: 'online',
    errorCount: 0,
    lastError: null
  },
];

// Calculate current session duration
const calculateCurrentDuration = (stream) => {
  const now = new Date();
  if (stream.currentStatus === 'online' && stream.lastOnline) {
    const duration = Math.floor((now - new Date(stream.lastOnline)) / 1000);
    return duration;
  } else if (stream.currentStatus === 'offline' && stream.lastOffline) {
    const duration = Math.floor((now - new Date(stream.lastOffline)) / 1000);
    return duration;
  }
  return 0;
};

// Calculate percentages
const calculatePercentages = (stream) => {
  const totalTime = stream.totalUptime + stream.totalDowntime;
  if (totalTime === 0) return { uptimePercentage: 100, downtimePercentage: 0 };
  
  return {
    uptimePercentage: ((stream.totalUptime / totalTime) * 100).toFixed(2),
    downtimePercentage: ((stream.totalDowntime / totalTime) * 100).toFixed(2)
  };
};

const calculateAverages = (stream) => {
  const avgUptime = stream.uptimeHistory.length > 0
    ? stream.uptimeHistory.reduce((sum, h) => sum + h.duration, 0) / stream.uptimeHistory.length
    : 0;
  
  const avgDowntime = stream.downtimeHistory.length > 0
    ? stream.downtimeHistory.reduce((sum, h) => sum + h.duration, 0) / stream.downtimeHistory.length
    : 0;
  
  return { avgUptime, avgDowntime };
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { hours, minutes, seconds: secs };
};

export const getStreams = async () => {
  return streams.map(stream => {
    const currentDuration = calculateCurrentDuration(stream);
    const percentages = calculatePercentages(stream);
    const averages = calculateAverages(stream);
    
    return {
      ...stream,
      currentDuration,
      currentDurationFormatted: formatDuration(currentDuration),
      ...percentages,
      avgUptimeFormatted: formatDuration(Math.floor(averages.avgUptime)),
      avgDowntimeFormatted: formatDuration(Math.floor(averages.avgDowntime))
    };
  });
};

export const getStreamById = async (id) => {
  const stream = streams.find(s => s.id === id);
  if (!stream) return null;
  
  const currentDuration = calculateCurrentDuration(stream);
  const percentages = calculatePercentages(stream);
  const averages = calculateAverages(stream);
  
  return {
    ...stream,
    currentDuration,
    currentDurationFormatted: formatDuration(currentDuration),
    ...percentages,
    avgUptimeFormatted: formatDuration(Math.floor(averages.avgUptime)),
    avgDowntimeFormatted: formatDuration(Math.floor(averages.avgDowntime))
  };
};

// Update stream status (online/offline)
export const updateStreamStatus = async (id, status, errorMessage = null) => {
  const streamIndex = streams.findIndex(s => s.id === id);
  if (streamIndex === -1) return null;
  if (status !== 'online' && status !== 'offline') return null;
  const stream = streams[streamIndex];
  const now = new Date().toISOString();
  
  if (status === 'online' && stream.currentStatus === 'offline') {
    // Transitioning from offline to online
    const offlineDuration = Math.floor((new Date() - new Date(stream.lastOffline)) / 1000);
    stream.totalDowntime += offlineDuration;
    stream.downtimeHistory.push({
      start: stream.lastOffline,
      end: now,
      duration: offlineDuration,
      reason: stream.lastError
    });
    stream.lastOnline = now;
    stream.currentStatus = 'online';
    stream.lastError = null;
  } else if (status === 'offline' && stream.currentStatus === 'online') 
    {
      
    const onlineDuration = Math.floor((new Date() - new Date(stream.lastOnline)) / 1000);
    stream.totalUptime += onlineDuration;
    stream.uptimeHistory.push({
      start: stream.lastOnline,
      end: now,
      duration: onlineDuration
    });
    stream.lastOffline = now;
    stream.currentStatus = 'offline';
    stream.lastError = errorMessage;
    stream.errorCount++;
  }
  
  streams[streamIndex] = stream;
  return await getStreamById(id);
};

export const resetStreamStats = async (id) => {
  const streamIndex = streams.findIndex(s => s.id === id);
  if (streamIndex === -1) return null;
  
  streams[streamIndex] = {
    ...streams[streamIndex],
    startTime: new Date().toISOString(),
    lastOnline: new Date().toISOString(),
    lastOffline: null,
    totalUptime: 0,
    totalDowntime: 0,
    uptimePercentage: 100,
    downtimePercentage: 0,
    uptimeHistory: [],
    downtimeHistory: [],
    currentStatus: 'online',
    errorCount: 0,
    lastError: null
  };
  
  return await getStreamById(id);
};

export const getStreamAnalytics = async (id) => {
  const stream = streams.find(s => s.id === id);
  if (!stream) return null;
  
  return {
    id: stream.id,
    name: stream.name,
    uptimeHistory: stream.uptimeHistory,
    downtimeHistory: stream.downtimeHistory,
    totalUptime: stream.totalUptime,
    totalDowntime: stream.totalDowntime,
    errorCount: stream.errorCount
  };
};