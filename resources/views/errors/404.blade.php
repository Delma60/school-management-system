<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        html {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    <div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
        <!-- Error Content -->
        <div class="text-center max-w-2xl">
            <!-- Error Code -->
            <div class="mb-6">
                <h1
                    class="text-9xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    404
                </h1>
            </div>

            <!-- Error Title -->
            <h2 class="text-3xl font-bold text-slate-900 mb-4">
                Page Not Found
            </h2>

            <!-- Error Description -->
            <p class="text-lg text-slate-600 mb-8">
                Sorry, the page you are looking for doesn't exist or has been moved. It might have been removed or the
                URL might be incorrect.
            </p>

            <!-- Search Suggestion -->
            <div class="mb-8 p-4 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-sm text-slate-700">
                    Try using the navigation menu or going back to the home page.
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="{{ url('/') }}"
                    class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all">
                    Go to Home
                </a>
                <button onclick="window.history.back()"
                    class="px-6 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-all">
                    Go Back
                </button>
            </div>
        </div>

        <!-- Illustration Area -->
        <div class="mt-12 w-full max-w-md">
            <div
                class="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border border-blue-200">
                <div class="text-center">
                    <div class="text-6xl mb-4">🔍</div>
                    <p class="text-sm text-slate-600">
                        Page not found
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer Message -->
        <div class="mt-12 text-center text-sm text-slate-600">
            <p class="mb-2">If you think this is an error, please contact support.</p>
            <p class="text-xs text-slate-500">Error Code: 404</p>
        </div>
    </div>
</body>

</html>
