<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
            'name'        => 'required|string|max:100|unique:subjects,name',
            'code'        => 'required|string|max:10|unique:subjects,code',
            'department'  => 'required|string',
            'type'        => 'required|in:core,elective,vocational',
            'credits'     => 'required|numeric|min:0.5|max:5',
            'description' => 'nullable|string',
            //
        ];
    }
}
