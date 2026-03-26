<?php

namespace App\Http\Controllers;

use App\Models\GradingScale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradingScaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

          $authType = Auth::user()->role->name ?? "admin";
          $scales = GradingScale::all();
        return inertia("$authType/grading_scale/index", compact("scales"));
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
        $validated = $request->validate([
            'grade' => 'required|string|max:10|unique:grading_scales,grade',
            'min_score' => 'required|integer|min:0|max:100',
            'max_score' => 'required|integer|min:0|max:100|gte:min_score',
            'remark' => 'nullable|string|max:255',
        ]);

        GradingScale::create($validated);

        return redirect()->back()->with('success', 'Grade level added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(GradingScale $gradingScale)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GradingScale $gradingScale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GradingScale $gradingScale)
    {
        //
        $validated = $request->validate([
            'grade' => 'required|string|max:10|unique:grading_scales,grade,' . $gradingScale->id,
            'min_score' => 'required|integer|min:0|max:100',
            'max_score' => 'required|integer|min:0|max:100|gte:min_score',
            'remark' => 'nullable|string|max:255',
        ]);

        $gradingScale->update($validated);

        return redirect()->back()->with('success', 'Grade level updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GradingScale $gradingScale)
    {
        //
        $gradingScale->delete();
        return redirect()->back()->with('success', 'Grade level removed.');
    }
}
