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

  const [firstMinNum, secondMinNum, thirdMinNum] = pad(minutes)?.split('');
  const [firstSecNum, secondSecNum] = pad(remainingSeconds)?.split('');
  
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {
        thirdMinNum ?
        <>
          <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{firstMinNum}</div>
          <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{secondMinNum}</div>
          <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{thirdMinNum}</div>
        </>:
        <>
          <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{firstMinNum}</div>
          <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{secondMinNum}</div>
        </>
      }
      <div style={{fontSize: 48, fontWeight: 700, color: '#000000', marginLeft: 6, marginRight: 10}}>:</div>
      <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{firstSecNum}</div>
      <div style={{marginRight: 6, paddingLeft: 8, paddingRight: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#E8EAEC', border: '1px solid rgba(25, 79, 159, 0.50)', fontSize: 40, fontWeight: 700, color: '#000000'}}>{secondSecNum}</div>
      {/* {pad(minutes)}:{pad(remainingSeconds)} */}
    </div>
  );
});

export default CountUp;
