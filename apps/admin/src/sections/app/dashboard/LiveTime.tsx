import { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

const LiveTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <FiClock className="w-4 h-4 animate-pulse" />
      <span className="font-mono">{formattedTime}</span>
    </div>
  );
};

export default LiveTime;
