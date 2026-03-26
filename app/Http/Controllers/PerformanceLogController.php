<?php

    namespace App\Http\Controllers;

    use App\Models\ExamMark;
    use App\Models\Classroom;
    use App\Models\Examination;
use App\Services\ViewResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PerformanceLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    public function index(Request $request)
    {
        $query = ExamMark::with(['student.classroom', 'examSubject.subject', 'examSubject.exam', 'teacher'])
            ->orderBy('updated_at', 'desc');

        // Apply Filters
        if ($request->filled('classroom_id')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('classroom_id', $request->classroom_id);
            });
        }
        if ($request->filled('exam_id')) {
            $query->whereHas('examSubject', function($q) use ($request) {
                $q->where('examination_id', $request->exam_id);
            });
        }
        if ($request->filled('search')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        $logs = $query->paginate(15)->withQueryString();


        return inertia(ViewResolver::resolve("students/performance/index", "admin"), [
            'logs' => $logs,
            'filters' => $request->only(['classroom_id', 'exam_id', 'search']),
            'classrooms' => Classroom::select('id', 'name')->get(),
            'exams' => Examination::select('id', 'name')->orderBy('start_date', 'desc')->get(),
            // Mocking some quick stats for the UI
            'stats' => [
                'average_score' => ExamMark::avg('marks_obtained') ?? 0,
                'total_entries' => ExamMark::count(),
                'pass_rate' => 85, // You can calculate this based on your pass_marks logic
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
