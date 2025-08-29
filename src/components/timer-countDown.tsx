"use client";
import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function TimerCountDown({ initialMinutes = 59, initialSeconds = 13, onExpire }: {
  initialMinutes?: number;
  initialSeconds?: number;
  onExpire?: () => void;
}) {
  const initialTime = initialMinutes * 60 + initialSeconds;
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const endTime = Date.now() + timeRemaining * 1000;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeRemaining(diff);

      if (diff === 0) {
        clearInterval(interval);
        onExpire?.(); // optional callback
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center text-sm text-gray-600">
      <Clock className="w-4 h-4 mr-2" />
      Pay within {formatTime(timeRemaining)} min
    </div>
  );
}
