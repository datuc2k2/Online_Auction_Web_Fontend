import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const pad = (num: number) => {
  return num < 10 ? '0' + num : num.toString();
};

const CountUp = forwardRef((props, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [isCounting, setIsCounting] = useState(true);

  // Retrieve stored timer value when component mounts
  useEffect(() => {
    const storedSeconds = localStorage.getItem('countUp');
    if (storedSeconds) {
      setSeconds(Number(storedSeconds));
    }
  }, []);

  useEffect(() => {
    if (isCounting) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          localStorage.setItem('countUp', newSeconds.toString());
          return newSeconds;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCounting]);

  useImperativeHandle(ref, () => ({
    stopCounting() {
      setIsCounting(false);
    },
    resetCount() {
      setIsCounting(true);
      setSeconds(0);
      localStorage.removeItem('countUp');
    },
    getCount() {
      return seconds;
    }
  }));

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      {pad(minutes)}:{pad(remainingSeconds)}
    </div>
  );
});

export default CountUp;
