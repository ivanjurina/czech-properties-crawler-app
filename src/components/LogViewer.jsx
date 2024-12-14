import React, { useEffect, useState, useRef } from 'react';

export function LogViewer({ loading }) {
  const [logs, setLogs] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        setLogs(prev => [...prev, log].slice(-100)); // Keep only last 5 logs
      } catch (error) {
        console.error('Error parsing log message:', error);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    return () => ws.close();
  }, []);

  // Auto-scroll to the latest log
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            Searching...
          </h3>
        </div>

        {/* Log Messages Container */}
        <div 
          ref={logsContainerRef}
          className="bg-gray-50 rounded p-4 shadow-inner space-y-2 max-h-48 overflow-y-auto"
        >
          {logs.map((log, index) => (
            <div 
              key={index}
              className={`p-2 rounded transition-all duration-300 ${
                index === logs.length - 1 ? 'bg-white shadow' : 'bg-transparent'
              }`}
            >
              <p className={`${
                log.type === 'error' ? 'text-red-600' : 
                log.message.includes('SReality') ? 'text-purple-600' :
                log.message.includes('iDNES') ? 'text-blue-600' :
                log.message.includes('Remax') ? 'text-yellow-600' :
                'text-gray-600'
              } ${
                index === logs.length - 1 ? 'font-medium' : 'text-opacity-75'
              }`}>
                {log.message}
              </p>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-gray-500 italic">
              Waiting for updates...
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}