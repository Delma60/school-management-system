import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

export default function Error500() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="500 - Server Error" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-red-50 to-orange-100 p-6 dark:from-slate-900 dark:to-slate-800">
                {/* Error Content */}
                <div className="max-w-2xl text-center">
                    {/* Error Code */}
                    <div className="mb-6">
                        <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-9xl font-black text-transparent dark:from-red-400 dark:to-orange-400">
                            500
                        </h1>
                    </div>

                    {/* Error Title */}
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Server Error</h2>

                    {/* Error Description */}
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                        Something went wrong on our end. We're working to fix it. Please try again later.
                    </p>

                    {/* Alert Box */}
                    <div className="mb-8 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-left text-sm text-red-800 dark:text-red-300">
                            Our team has been notified about this issue and will investigate it shortly.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={auth?.user ? route('dashboard') : route('welcome')}>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-white hover:from-blue-700 hover:to-indigo-700">
                                {auth?.user ? 'Go to Dashboard' : 'Go to Home'}
                            </Button>
                        </Link>
                        <Button variant="outline" className="px-6 py-2" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>

                {/* Illustration Area */}
                <div className="mt-12 w-full max-w-md">
                    <div className="relative flex h-64 items-center justify-center rounded-2xl border border-red-200 bg-gradient-to-br from-red-100 to-orange-100 dark:border-red-800 dark:from-red-900/30 dark:to-orange-900/30">
                        <div className="text-center">
                            <div className="mb-4 text-6xl">⚠️</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Server error occurred</p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-12 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>Error Code: 500</p>
                </div>
            </div>
        </>
    );
}
