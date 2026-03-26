<?php

namespace App\Http\Controllers;

use App\Models\SchoolEvent;
use App\Http\Requests\StoreSchoolEventRequest;
use App\Http\Requests\UpdateSchoolEventRequest;
use Illuminate\Support\Facades\Redirect;

class SchoolEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreSchoolEventRequest $request)
    {
        //
        SchoolEvent::create($request->validated());
        return Redirect::back()->with('success', 'Event created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(SchoolEvent $schoolEvent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SchoolEvent $schoolEvent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolEventRequest $request, SchoolEvent $schoolEvent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolEvent $schoolEvent)
    {
        //
    }
}
