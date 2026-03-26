<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Access Forbidden</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

        html {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>

<body class="bg-gradient-to-br from-yellow-50 to-amber-100">
    <div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
        <!-- Error Content -->
        <div class="text-center max-w-2xl">
            <!-- Error Code -->
            <div class="mb-6">
                <h1
                    class="text-9xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    403
                </h1>
            </div>

            <!-- Error Title -->
            <h2 class="text-3xl font-bold text-slate-900 mb-4">
                Access Forbidden
            </h2>

            <!-- Error Description -->
            <p class="text-lg text-slate-600 mb-8">
                You don't have permission to access this resource. This action is restricted to authorized users only.
            </p>

            <!-- Alert Box -->
            <div class="mb-8 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                    </path>
                </svg>
                <p class="text-sm text-amber-800 text-left">
                    If you believe this is an error, please contact an administrator.
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
                class="relative h-64 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center border border-amber-200">
                <div class="text-center">
                    <div class="text-6xl mb-4">🔒</div>
                    <p class="text-sm text-slate-600">
                        Access restricted
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer Message -->
        <div class="mt-12 text-center text-sm text-slate-600">
            <p>Error Code: 403</p>
        </div>
    </div>
</body>

</html>
