'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
    deadline: number;
}

const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
    const [isPastDeadline, setIsPastDeadline] = useState<boolean>(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline - now;
            const seconds = Math.floor(distance / 1000);

            if (seconds <= 0) {
                setIsPastDeadline(true);
                setRemainingSeconds(0);
                clearInterval(intervalId);
            } else {
                setIsPastDeadline(false);
                setRemainingSeconds(seconds);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [deadline]);

    return (
        <div>
            {isPastDeadline ? (
                <p className="text-red-700"> The deadline has passed </p>
            ) : (
                <p className="text-green-700">
                    The deadline is in {remainingSeconds} seconds
                </p>
            )}
        </div>
    );
};

export default Countdown;
