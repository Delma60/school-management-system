import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck } from 'lucide-react';
import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface AttendanceData {
    name: string;
    students: number;
    staff: number;
}

export function DailyAttendanceChart({ data }: { data: AttendanceData[] }) {
    // Custom Tooltip to make it look sleek in both light and dark modes
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
                    <p className="font-bold mb-2 border-b pb-1">{label} Attendance</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 py-1">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground capitalize">{entry.name}:</span>
                            <span className="font-medium">{entry.value} present</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Daily Attendance</CardTitle>
                        <CardDescription>Present & Late counts over the last 7 days</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
                {data && data.length > 0 ? (
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                                <Legend 
                                    iconType="circle" 
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px', opacity: 0.8 }}
                                />
                                
                                {/* Students Bar (Blue) */}
                                <Bar 
                                    dataKey="students" 
                                    name="Students" 
                                    fill="#3b82f6" 
                                    radius={[4, 4, 0, 0]} 
                                    maxBarSize={40}
                                />
                                
                                {/* Staff Bar (Emerald Green) */}
                                <Bar 
                                    dataKey="staff" 
                                    name="Staff" 
                                    fill="#10b981" 
                                    radius={[4, 4, 0, 0]} 
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mt-4">
                        <UserCheck className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">No attendance data available yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}