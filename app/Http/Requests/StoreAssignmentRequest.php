<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAssignmentRequest extends FormRequest
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
            'title'        => 'required|string|max:255',
            'due_date'     => 'required|date|after_or_equal:today', // Ensures due date isn't in the past
            'max_points'   => 'required|integer|min:0',
            'subject_id'   => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'description'  => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' => 'Please select a subject.',
            'classroom_id.required' => 'Please select a target classroom.',
            'due_date.after_or_equal' => 'The due date cannot be in the past.',
        ];
    }
}
