import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function RealTimeDate() {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg border border-border w-fit">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(dateTime)}</span>
            </div>
            <div className="hidden sm:block text-border">|</div>
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="tabular-nums">{formatTime(dateTime)}</span>
            </div>
        </div>
    );
}
