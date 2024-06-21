import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ initialTime, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime === 0) {
                    clearInterval(timer);
                    onTimeout();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeout]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <span>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</span>
    );
};

export default CountdownTimer;
