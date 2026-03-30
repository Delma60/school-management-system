import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';
import React from 'react';

export function TeacherSchedule({ schedule = [] }: { schedule: any[] }) {
    if (schedule.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your classes for today.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="h-6 w-6 opacity-20" />
                    </div>
                    <p>No classes scheduled for today. Enjoy your free time!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes for today.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {schedule.map((cls, index) => {
                        // Determine styling based on status
                        const isOngoing = cls.status === 'ongoing';
                        const isCompleted = cls.status === 'completed';

                        return (
                            <div
                                key={cls.id || index}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${
                                    isOngoing ? 'bg-primary/5 border-primary/20' :
                                    isCompleted ? 'bg-muted/30 opacity-60' : 'bg-background hover:bg-muted/50'
                                }`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`font-bold ${isOngoing ? 'text-primary' : ''}`}>
                                            {cls.subject}
                                        </h4>
                                        <Badge variant="outline" className="text-xs bg-background">
                                            {cls.class_group}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> {cls.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" /> {cls.room}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 sm:mt-0">
                                    {isOngoing ? (
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 animate-pulse">
                                            Happening Now
                                        </Badge>
                                    ) : isCompleted ? (
                                        <Badge variant="secondary">Completed</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                                            Upcoming
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
