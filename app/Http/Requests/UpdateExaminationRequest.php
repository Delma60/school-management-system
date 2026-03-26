<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExaminationRequest extends FormRequest
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
            'classroom_ids' => 'required|array|min:1',
            'classroom_ids.*' => 'exists:classrooms,id',
            'schedules' => 'required|array',
            'schedules.*.id' => 'nullable|exists:exam_subjects,id', // Existing records
            'schedules.*.subject_id' => 'required|exists:subjects,id',
            'schedules.*.exam_date' => 'required|date',
            'schedules.*.start_time' => 'required',
            'schedules.*.end_time' => 'required',
        ];
    }
}
