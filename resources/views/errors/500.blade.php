<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Server Error</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        html {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-red-50 to-orange-100">
    <div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
        <!-- Error Content -->
        <div class="text-center max-w-2xl">
            <!-- Error Code -->
            <div class="mb-6">
                <h1
                    class="text-9xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    500
                </h1>
            </div>

            <!-- Error Title -->
            <h2 class="text-3xl font-bold text-slate-900 mb-4">
                Server Error
            </h2>

            <!-- Error Description -->
            <p class="text-lg text-slate-600 mb-8">
                Something went wrong on our end. We're working to fix it. Please try again later.
            </p>

            <!-- Alert Box -->
            <div class="mb-8 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3">
                <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4v2m0 4v2M12 5a7 7 0 110 14 7 7 0 010-14z"></path>
                </svg>
                <p class="text-sm text-red-800 text-left">
                    Our team has been notified about this issue and will investigate it shortly.
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="{{ url('/') }}"
                    class="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all">
                    Go to Home
                </a>
                <button onclick="window.location.reload()"
                    class="px-6 py-2 border border-slate-300 text-slate-900 rounded-lg font-medium hover:bg-slate-50 transition-all">
                    Try Again
                </button>
            </div>
        </div>

        <!-- Illustration Area -->
        <div class="mt-12 w-full max-w-md">
            <div
                class="relative h-64 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center border border-red-200">
                <div class="text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <p class="text-sm text-slate-600">
                        Server error occurred
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer Message -->
        <div class="mt-12 text-center text-sm text-slate-600">
            <p>Error Code: 500</p>
        </div>
    </div>
</body>

</html>
