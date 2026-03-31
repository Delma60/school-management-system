
<?php

use App\Http\Controllers\AiLessonPlanController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\ExamMarkController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FeeController;
use App\Http\Controllers\GradingScaleController;
use App\Http\Controllers\LessonPlanController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PerformanceLogController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\SchoolEventController;
use App\Http\Controllers\Settings\SchoolProfileController;
use App\Http\Controllers\Settings\SettingsController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SystemLogController;
use App\Http\Controllers\TeachersController;
use App\Http\Controllers\TimetableController;
use App\Models\Examination;
use App\Models\SchoolEvent;
use App\Models\Setting;
use App\Models\Staff;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Explicit route model binding
Route::bind('exam', function ($value) {
    return Examination::findOrFail($value);
});



Route::get('/', function () {
    $stats = [
        'students' => Student::count(),
        'teachers' => Staff::count(),
        'courses' => 45, // You can replace this with Subject::count() later
    ];

    // 2. Fetch Upcoming Events (Next 3 events)
    $upcomingEvents = SchoolEvent::where('date', '>=', now())
        ->orderBy('date', 'asc')
        ->take(3)
        ->get()
        ->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => Carbon::parse($event->date)->format('M d, Y'),
                'day' => Carbon::parse($event->date)->format('d'),
                'month' => Carbon::parse($event->date)->format('M'),
                'type' => $event->type ?? 'General',
            ];
        });

    // 3. Fetch Global School Settings (For the footer and nav)
    $settings = Setting::pluck('value', 'key')->toArray();
    $schoolInfo = [
        'name' => $settings['school_name'] ?? 'Delma International',
        'email' => $settings['contact_email'] ?? 'info@school.com',
        'phone' => $settings['school_phone'] ?? '+234 800 000 0000',
        'address' => $settings['address'] ?? '123 Education Way, Tech City',
        'logo' => $settings['school_logo'] ?? null,
    ];

    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'stats' => $stats,
        'events' => $upcomingEvents,
        'school' => $schoolInfo,
    ]);
})->name('welcome');

Route::middleware(['auth'])->group(function () {
    // Navigation API endpoints
    Route::get('/api/navigation/main', [NavigationController::class, 'getMainNav'])->name('api.navigation.main');
    Route::get('/api/navigation/settings', [NavigationController::class, 'getSettingsNav'])->name('api.navigation.settings');

    Route::prefix("dashboard")->group( function(){
        Route::get("/", [DashboardController::class, "index"])->name("dashboard");

        Route::prefix("academics")->group(function(){
            Route::get("/classes",  [ClassroomController::class, "index"]);
            Route::resource("classrooms", ClassroomController::class);
            Route::resource("subjects", SubjectController::class);
            Route::resource("timetables", TimetableController::class);
            Route::resource("exams", ExaminationController::class)->parameters(['exam' => 'exam:id']);
            Route::resource("grades", GradingScaleController::class);
            Route::post("/classrooms/{classroom}/students/attach", [ClassroomController::class, 'attachStudents'])->name("classrooms.students.attach");
        });
        Route::resource("exam_marks", ExamMarkController::class);
        Route::get('/exam-marks/subjects-by-exam', [ExamMarkController::class, 'getSubjectsByExam'])->name('exam_marks.subjects_by_exam');
        Route::get('/exam-marks/classrooms-by-subject', [ExamMarkController::class, 'getClassroomsBySubject'])->name('exam_marks.classrooms_by_subject');
        Route::get('/exam-marks/students-by-subject', [ExamMarkController::class, 'getStudentsBySubject'])->name('exam_marks.students_by_subject');

        Route::prefix("staff")->group(function(){
            Route::resource("teachers", TeachersController::class);
            Route::get("/others", [StaffController::class, "index"])->name("staffs.others");
            Route::post("/teachers/{teacher}", [TeachersController::class, "assignSubjects"])->name("teachers.assign-subjects");
            Route::get("/create", [StaffController::class, "create"])->name("staff.create");

            Route::resource("records", StaffController::class)->names("staff")->parameters([
                'records' => 'staff'
            ]);

            Route::post('/records/{user}/password', [StaffController::class, 'updatePassword'])
        ->name('staff.password.update');

            Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
            Route::post('/payroll/run', [PayrollController::class, 'runPayroll'])->name('payroll.run');
            Route::patch('/leave/{leaveRequest}', [PayrollController::class, 'updateLeaveStatus'])->name('leave.update');
        });

        Route::resource("events", SchoolEventController::class);
        Route::prefix("students")->group(function(){
            Route::resource("performance", PerformanceLogController::class);
            Route::resource("attendances", AttendanceController::class);
            Route::get('admissions', [StudentController::class, 'create'])->name('admissions.create');
            Route::resource("/", StudentController::class)->names('students')->parameters(['' => 'student']);

        });
        Route::resource("roles", RolesController::class);

// Displays the form
        Route::get('/school-profile', [SchoolProfileController::class, 'index'])
            ->name('school-profile.index');

                // Saves the form (Using POST so the logo image uploads perfectly)
                Route::post('/school-profile', [SchoolProfileController::class, 'update'])
                    ->name('school-profile.update');
                        Route::resource("system-logs", SystemLogController::class);

        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::prefix('finance')->group(function () {
            Route::resource('fees', FeeController::class);
            Route::resource('payments', PaymentController::class);
            Route::resource('expenses', ExpenseController::class);
            Route::resource('reports', ReportController::class);
            // Future routes to build out:
            // Route::post('/fees/payment', [FeeController::class, 'storePayment'])->name('fees.payment.store');
            // Route::post('/fees/structure', [FeeController::class, 'storeStructure'])->name('fees.structure.store');
        });

        Route::prefix('classes')->name("classes.")->group(function(){
            Route::get("/rosters", [TeachersController::class, 'roosters'])->name("roosters");
        });
        Route::resource('assignments', AssignmentController::class);
        Route::resource('lesson-plans', LessonPlanController::class);
        Route::post('/lesson-plans/ai-generate', [AiLessonPlanController::class, 'generate'])->name('lesson-plans.ai-generate');

        Route::get("/timetable", [TeachersController::class, 'timetable'])->name("timetable");
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
