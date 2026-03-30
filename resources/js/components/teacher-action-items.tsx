import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-react';
import React from 'react';

export function TeacherActionItems({ items = [] }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                    <CardDescription>Pending tasks requiring your attention.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500/20 mb-3" />
                    <p>You're all caught up!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Pending tasks requiring your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.id || index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                            item.is_urgent ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30' : 'bg-muted/30'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${item.is_urgent ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-background text-muted-foreground shadow-sm'}`}>
                                {item.type === 'attendance' ? <ClipboardCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                                {item.is_urgent && <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Urgent</span>}
                            </div>
                        </div>

                        <Button asChild size="sm" variant={item.is_urgent ? 'default' : 'outline'} className={item.is_urgent ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
                            <Link href={item.link}>
                                Resolve <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
