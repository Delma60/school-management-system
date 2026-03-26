import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';

export default function Error404() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="404 - Page Not Found" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
                {/* Error Content */}
                <div className="max-w-2xl text-center">
                    {/* Error Code */}
                    <div className="mb-6">
                        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-9xl font-black text-transparent dark:from-blue-400 dark:to-indigo-400">
                            404
                        </h1>
                    </div>

                    {/* Error Title */}
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>

                    {/* Error Description */}
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                        Sorry, the page you are looking for doesn't exist or has been moved. It might have been removed or the URL might be incorrect.
                    </p>

                    {/* Search Suggestion */}
                    <div className="mb-8 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                        <Search className="h-5 w-5 text-slate-400" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">Try using the navigation menu or search to find what you need.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href={auth?.user ? route('dashboard') : route('welcome')}>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-white hover:from-blue-700 hover:to-indigo-700">
                                {auth?.user ? 'Go to Dashboard' : 'Go to Home'}
                            </Button>
                        </Link>
                        <Button variant="outline" className="px-6 py-2" onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>

                {/* Illustration Area */}
                <div className="mt-12 w-full max-w-md">
                    <div className="relative flex h-64 items-center justify-center rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100 dark:border-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30">
                        <div className="text-center">
                            <div className="mb-4 text-6xl">🔍</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Page not found</p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-12 space-y-2 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>Need help? Check out these links:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {auth?.user && (
                            <>
                                <Link href={route('dashboard')} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Dashboard
                                </Link>
                                <span>•</span>
                                <Link href={"/"} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Settings
                                </Link>
                            </>
                        )}
                        {!auth?.user && (
                            <>
                                <Link href={route('login')} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Sign In
                                </Link>
                                <span>•</span>
                                <Link href={route('register')} className="text-blue-600 hover:underline dark:text-blue-400">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
