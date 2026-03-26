<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreTimetableRequest extends FormRequest
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
        Log::info($this->entry_type);
        return [
            'classroom_id' => 'required|exists:classrooms,id',
            'day_of_week'  => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'entry_type'   => 'required|in:class,break',
            
            // Conditional Rules
            'subject_id'   => 'nullable|required_if:entry_type,class|exists:subjects,id',
            'teacher_id'   => 'nullable|required_if:entry_type,class|exists:users,id',
            'timebreak_id' => 'nullable|required_if:entry_type,break|exists:breaks,id',
        ];
    }
}
