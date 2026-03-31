<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClassroomRequest extends FormRequest
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
            'name' => 'nullable|string|max:100',
            'grade_level' => 'nullable|string',
            'room_number' => 'nullable|string',
            'classroom_id' => 'nullable|exists:classrooms,id',
            'capacity' => 'nullable|integer|min:1',
            'teacher_id' => 'nullable|exists:users,id',
        ];
    }
}
