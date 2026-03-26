<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'name'          => 'required|string',
            'email'         => 'required|email|unique:users',
            'classroom_id'  => 'required|exists:classrooms,id',
            'password' => 'required|string|min:8',

            'admission_date' => 'required|date',
            'dob' => 'required|date',
            'gender' => 'required|in:male,female,other',
            'phone' => 'nullable|string|max:20',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:20',
            'parent_email' => 'nullable|email',
            'medical_notes' => 'nullable|string',
            'parent_email' => 'nullable|email',
        ];
    }
}
