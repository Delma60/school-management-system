<?php

namespace App\Providers;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Examination;
use App\Models\FeeType;
use App\Models\SchoolEvent;
use App\Models\Timetable;
use App\Models\User;
use App\Policies\AttendancePolicy;
use App\Policies\ClassroomPolicy;
use App\Policies\ExaminationPolicy;
use App\Policies\FeePolicy;
use App\Policies\SchoolEventPolicy;
use App\Policies\TimetablePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Classroom::class => ClassroomPolicy::class,
        Attendance::class => AttendancePolicy::class,
        Examination::class => ExaminationPolicy::class,
        Timetable::class => TimetablePolicy::class,
        SchoolEvent::class => SchoolEventPolicy::class,
        User::class => UserPolicy::class,
        FeeType::class => FeePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        $this->gate();
    }

    /**
     * Define application gates.
     */
    protected function gate(): void
    {
        // Admin gate - admin users can do anything
        \Illuminate\Support\Facades\Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        // Permission-based gates
        \Illuminate\Support\Facades\Gate::define('view-reports', function (User $user) {
            return $user->hasPermission('reports.view');
        });

        \Illuminate\Support\Facades\Gate::define('manage-staff', function (User $user) {
            return $user->hasPermission('staff.manage');
        });
    }
}
