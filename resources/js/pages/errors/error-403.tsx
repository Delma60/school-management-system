import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function Error403() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="403 - Access Forbidden" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-yellow-50 to-amber-100 p-6 dark:from-slate-900 dark:to-slate-800">
                {/* Error Content */}
                <div className="max-w-2xl text-center">
                    {/* Error Code */}
                    <div className="mb-6">
                        <h1 className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-9xl font-black text-transparent dark:from-amber-400 dark:to-yellow-400">
                            403
                        </h1>
                    </div>

                    {/* Error Title */}
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Access Forbidden</h2>

                    {/* Error Description */}
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                        You don't have permission to access this resource. This action is restricted to authorized users only.
                    </p>

                    {/* Alert Box */}
                    <div className="mb-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/30">
                        <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-left text-sm text-amber-800 dark:text-amber-300">
                            If you believe this is an error, please contact an administrator.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={auth.user ? route('dashboard') : route('welcome')}>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-white hover:from-blue-700 hover:to-indigo-700">
                                {auth.user ? 'Go to Dashboard' : 'Go to Home'}
                            </Button>
                        </Link>
                        <Button variant="outline" className="px-6 py-2" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>

                {/* Illustration Area */}
                <div className="mt-12 w-full max-w-md">
                    <div className="relative flex h-64 items-center justify-center rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-100 to-yellow-100 dark:border-amber-800 dark:from-amber-900/30 dark:to-yellow-900/30">
                        <div className="text-center">
                            <div className="mb-4 text-6xl">🔒</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Access restricted</p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-12 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>Error Code: 403</p>
                </div>
            </div>
        </>
    );
}
