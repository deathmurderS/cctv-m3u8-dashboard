import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Utility: Format duration
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">CCTV Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to access monitoring</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          Demo: admin/admin123, zaky/zaky2024
        </p>
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, subtitle, color = 'blue' }) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <p className={`text-2xl font-bold text-${color}-500 mt-1`}>{value}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

// Analytics Modal
const AnalyticsModal = ({ stream, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    if (stream) {
      fetch(`/api/streams/${stream.id}/analytics`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setAnalytics(data));
    }
  }, [stream]);

  if (!analytics) return null;

  const chartData = [
    { name: 'Uptime', value: analytics.totalUptime, color: '#10b981' },
    { name: 'Downtime', value: analytics.totalDowntime, color: '#ef4444' }
  ];

  const historyData = [
    ...analytics.uptimeHistory.slice(-10).map((h, i) => ({
      time: `Session ${i + 1}`,
      uptime: Math.floor(h.duration / 60),
      downtime: 0
    })),
    ...analytics.downtimeHistory.slice(-10).map((h, i) => ({
      time: `Error ${i + 1}`,
      uptime: 0,
      downtime: Math.floor(h.duration / 60)
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Analytics: {stream.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartType('pie')}
              className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}
            >
              Line Chart
            </button>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'pie' && (
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="uptime" fill="#10b981" name="Uptime (min)" />
                  <Bar dataKey="downtime" fill="#ef4444" name="Downtime (min)" />
                </BarChart>
              )}
              {chartType === 'line' && (
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} name="Uptime (min)" />
                  <Line type="monotone" dataKey="downtime" stroke="#ef4444" strokeWidth={2} name="Downtime (min)" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="Total Uptime" 
              value={formatDuration(analytics.totalUptime)} 
              color="green"
            />
            <StatCard 
              title="Total Downtime" 
              value={formatDuration(analytics.totalDowntime)} 
              color="red"
            />
            <StatCard 
              title="Error Count" 
              value={analytics.errorCount} 
              subtitle="Total errors recorded"
              color="yellow"
            />
            <StatCard 
              title="Sessions" 
              value={analytics.uptimeHistory.length} 
              subtitle="Uptime sessions"
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Player with Monitoring
const VideoPlayer = ({ stream, onStatusChange, onReload, token }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!videoRef.current || !stream.url) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });

      hls.loadSource(stream.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus('ready');
        setError(null);
        onStatusChange(stream.id, 'online');
        video.play().catch(e => console.log('Autoplay prevented'));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setStatus('error');
          setError(data.type);
          onStatusChange(stream.id, 'offline', `Error: ${data.type}`);
        }
      });

      hlsRef.current = hls;
      return () => hls.destroy();
    }
  }, [stream.url]);

  const handleReload = () => {
    setStatus('loading');
    setError(null);
    setCurrentDuration(0);
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }
    onReload();
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-video relative">
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading stream...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
              <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xl font-bold text-red-400 mb-2">🚧 Sedang Perbaikan</p>
              <p className="text-sm text-gray-400 mb-4">Stream mengalami gangguan</p>
              <p className="text-xs text-gray-500 mb-4">Downtime: {stream.downtimePercentage}%</p>
              <button
                onClick={handleReload}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reload Stream
              </button>
            </div>
          )}
          <video ref={videoRef} className="w-full h-full object-cover" controls muted playsInline />
        </div>

        <div className="p-4 bg-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{stream.name}</h3>
              <p className="text-sm text-gray-400">{stream.location}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'ready' ? 'bg-green-100 text-green-800' : 
              status === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status === 'ready' ? '● Live' : status === 'error' ? '● Error' : '● Loading'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900 p-2 rounded">
              <span className="text-gray-400">Current Session:</span>
              <p className="text-white font-mono">{formatDuration(currentDuration)}</p>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <span className="text-gray-400">Uptime:</span>
              <p className="text-green-400 font-mono">{stream.uptimePercentage}%</p>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <span className="text-gray-400">Avg Uptime:</span>
              <p className="text-white font-mono">
                {stream.avgUptimeFormatted?.hours}h {stream.avgUptimeFormatted?.minutes}m
              </p>
            </div>
            <div className="bg-gray-900 p-2 rounded">
              <span className="text-gray-400">Downtime:</span>
              <p className="text-red-400 font-mono">{stream.downtimePercentage}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReload}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>
      </div>

      {showAnalytics && (
        <AnalyticsModal 
          stream={stream} 
          onClose={() => setShowAnalytics(false)} 
        />
      )}
    </>
  );
};

// Main App
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreams();
      const interval = setInterval(fetchStreams, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams', {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      console.error('Error fetching streams:', err);
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setStreams([]);
  };

  const handleStatusChange = async (streamId, status, errorMessage) => {
    await fetch(`/api/streams/${streamId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status, errorMessage })
    });
    fetchStreams();
  };

  const handleReload = () => {
    fetchStreams();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const totalUptime = streams.reduce((sum, s) => sum + parseFloat(s.uptimePercentage || 0), 0) / streams.length;
  const totalDowntime = streams.reduce((sum, s) => sum + parseFloat(s.downtimePercentage || 0), 0) / streams.length;

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold text-white">CCTV Monitoring</h1>
                <p className="text-xs text-gray-400">Logged in: {user?.name} ({user?.role})</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-green-400">{totalUptime.toFixed(1)}% Up</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="text-red-400">{totalDowntime.toFixed(1)}% Down</span>
              </div>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6' : 
          'space-y-6'
        }>
          {streams.map((stream) => (
            <VideoPlayer 
              key={stream.id} 
              stream={stream} 
              onStatusChange={handleStatusChange}
              onReload={handleReload}
              token={token}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;