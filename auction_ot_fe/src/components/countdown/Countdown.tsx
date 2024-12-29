import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { openNotification } from '../../utility/Utility';

interface CountdownProps {
  timeStamp: number;
  onCountdownComplete: () => void;
}

const Countdown: React.ForwardRefRenderFunction<any, CountdownProps> = ({ timeStamp, onCountdownComplete }, ref) => {
  // const targetTimeRef = useRef(new Date().getTime() + duration * 60 * 1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const calculateTimeLeft = () => {
    const difference = timeStamp - new Date().getTime();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
  
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

        if (newTimeLeft.minutes <= 0 && newTimeLeft.seconds <= 0 && newTimeLeft.hours <= 0 && newTimeLeft.days <= 0) {
          clearInterval(intervalRef.current!);
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
  const [firstDaysNum, secondDaysNum] = formatTime(timeLeft.days)?.split('');
  const [firstHoursNum, secondHoursNum] = formatTime(timeLeft.hours)?.split('');
  const [firstMinNum, secondMinNum] = formatTime(timeLeft.minutes)?.split('');
  const [firstSecNum, secondSecNum] = formatTime(timeLeft.seconds)?.split('');

  return (
    <div className="countdown-timer">
      <ul data-countdown="2024-08-24 12:00:00">
        <li style={{ color: "#434343" }} data-days={0}>
          {firstDaysNum} {secondDaysNum}
          <span style={{ color: "#434343" }}>Days</span>{" "}
          <span style={{ color: "#434343" }}>Ngày</span>
        </li>
        <li style={{ color: "#434343" }} className="clone">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={4}
            height={13}
            viewBox="0 0 4 13"
          >
            <path d="M0 11.0633C0 11.5798 0.186992 12.0317 0.560976 12.419C0.95122 12.8063 1.43089 13 2 13C2.58537 13 3.06504 12.8063 3.43903 12.419C3.81301 12.0317 4 11.5798 4 11.0633C4 10.5146 3.81301 10.0546 3.43903 9.68343C3.06504 9.29609 2.58537 9.10242 2 9.10242C1.43089 9.10242 0.95122 9.29609 0.560976 9.68343C0.186992 10.0546 0 10.5146 0 11.0633ZM0 1.96089C0 2.49348 0.186992 2.95345 0.560976 3.34078C0.95122 3.72812 1.43089 3.92179 2 3.92179C2.58537 3.92179 3.06504 3.72812 3.43903 3.34078C3.81301 2.95345 4 2.49348 4 1.96089C4 1.42831 3.81301 0.968343 3.43903 0.581006C3.06504 0.193669 2.58537 0 2 0C1.43089 0 0.95122 0.193669 0.560976 0.581006C0.186992 0.968343 0 1.42831 0 1.96089Z" />
          </svg>
        </li>
        <li style={{ color: "#434343" }} data-hours={0}>
          {firstHoursNum} {secondHoursNum}
          <span style={{ color: "#434343" }}>Giờ</span>{" "}
          <span style={{ color: "#434343" }}>Giờ</span>
        </li>
        <li style={{ color: "#434343" }} className="clone">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={4}
            height={13}
            viewBox="0 0 4 13"
          >
            <path d="M0 11.0633C0 11.5798 0.186992 12.0317 0.560976 12.419C0.95122 12.8063 1.43089 13 2 13C2.58537 13 3.06504 12.8063 3.43903 12.419C3.81301 12.0317 4 11.5798 4 11.0633C4 10.5146 3.81301 10.0546 3.43903 9.68343C3.06504 9.29609 2.58537 9.10242 2 9.10242C1.43089 9.10242 0.95122 9.29609 0.560976 9.68343C0.186992 10.0546 0 10.5146 0 11.0633ZM0 1.96089C0 2.49348 0.186992 2.95345 0.560976 3.34078C0.95122 3.72812 1.43089 3.92179 2 3.92179C2.58537 3.92179 3.06504 3.72812 3.43903 3.34078C3.81301 2.95345 4 2.49348 4 1.96089C4 1.42831 3.81301 0.968343 3.43903 0.581006C3.06504 0.193669 2.58537 0 2 0C1.43089 0 0.95122 0.193669 0.560976 0.581006C0.186992 0.968343 0 1.42831 0 1.96089Z" />
          </svg>
        </li>
        <li style={{ color: "#434343" }} data-minutes={0}>
          {firstMinNum} {secondMinNum}{" "}
          <span style={{ color: "#434343" }}>Phút</span>{" "}
          <span style={{ color: "#434343" }}>Phút</span>
        </li>
        <li style={{ color: "#434343" }} className="clone">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={4}
            height={13}
            viewBox="0 0 4 13"
          >
            <path d="M0 11.0633C0 11.5798 0.186992 12.0317 0.560976 12.419C0.95122 12.8063 1.43089 13 2 13C2.58537 13 3.06504 12.8063 3.43903 12.419C3.81301 12.0317 4 11.5798 4 11.0633C4 10.5146 3.81301 10.0546 3.43903 9.68343C3.06504 9.29609 2.58537 9.10242 2 9.10242C1.43089 9.10242 0.95122 9.29609 0.560976 9.68343C0.186992 10.0546 0 10.5146 0 11.0633ZM0 1.96089C0 2.49348 0.186992 2.95345 0.560976 3.34078C0.95122 3.72812 1.43089 3.92179 2 3.92179C2.58537 3.92179 3.06504 3.72812 3.43903 3.34078C3.81301 2.95345 4 2.49348 4 1.96089C4 1.42831 3.81301 0.968343 3.43903 0.581006C3.06504 0.193669 2.58537 0 2 0C1.43089 0 0.95122 0.193669 0.560976 0.581006C0.186992 0.968343 0 1.42831 0 1.96089Z" />
          </svg>
        </li>
        <li style={{ color: "#434343" }} data-seconds={0}>
          {firstSecNum} {secondSecNum}{" "}
          <span style={{ color: "#434343" }}>Giây</span>{" "}
          <span style={{ color: "#434343" }}>Giây</span>
        </li>
      </ul>
    </div>
  );
};

export default forwardRef(Countdown);
