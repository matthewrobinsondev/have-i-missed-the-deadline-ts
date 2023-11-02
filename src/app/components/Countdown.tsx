'use client';

import React, { useState, useEffect } from 'react';

interface CountdownProps {
    deadline: number;
}

const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
    const [remainingTime, setRemainingTime] = useState<string>('');
    const [isPastDeadline, setIsPastDeadline] = useState<boolean>(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const distance = deadline - now;
            const seconds = Math.floor(distance / 1000);

            if (seconds <= 0) {
                setIsPastDeadline(true);
                setRemainingTime('');
                clearInterval(intervalId);
            } else {
                setIsPastDeadline(false);
                const days = Math.floor(seconds / (3600 * 24));
                const hours = Math.floor((seconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const remainingSeconds = seconds % 60;
                setRemainingTime(`${days}d ${hours}h ${minutes}m ${remainingSeconds}s`);
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
                    The deadline is in {remainingTime}
                </p>
            )}
        </div>
    );
};

export default Countdown;
