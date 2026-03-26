<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExaminationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'name' => 'required|string|max:255',
            'term' => 'required|string',
            'session' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',

            'classroom_ids' => 'required|array|min:1', // Validate classrooms
            'classroom_ids.*' => 'exists:classrooms,id',
            // Validate the timetable array
            'schedules' => 'required|array|min:1',
            'schedules.*.subject_id' => 'required|exists:subjects,id',
            'schedules.*.date' => 'required|date|after_or_equal:start_date|before_or_equal:end_date',
            'schedules.*.start_time' => 'required|date_format:H:i',
            'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
        ];
    }
}
