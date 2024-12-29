import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { openNotification } from '../../utility/Utility';

interface CountdownProps {
  duration: number; // Duration in minutes
  onCountdownComplete: () => void;
}

const Countdown: React.ForwardRefRenderFunction<any, CountdownProps> = ({ duration, onCountdownComplete }, ref) => {
  const targetTimeRef = useRef(new Date().getTime() + duration * 60 * 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeLeft = () => {
    const difference = targetTimeRef.current - new Date().getTime();
    let timeLeft = {
      minutes: Math.floor(difference / 1000 / 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isRunning, setIsRunning] = useState(true);

  useImperativeHandle(ref, () => ({
    startCountdown() {
      setIsRunning(true);
    },
    stopCountdown() {
      setIsRunning(false);
    },
    getCurrentTime() {
      return timeLeft.minutes * 60 + timeLeft.seconds;
    }
  }));

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        localStorage.setItem('timeDown', ((newTimeLeft.minutes + newTimeLeft.seconds/60) + ''))
        setTimeLeft(newTimeLeft);

        if (newTimeLeft.minutes <= 0 && newTimeLeft.seconds <= 0) {
          clearInterval(intervalRef.current!);
          openNotification('error', '', 'Time Up!');
          onCountdownComplete();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [isRunning]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div>
      {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </div>
  );
};

export default forwardRef(Countdown);
