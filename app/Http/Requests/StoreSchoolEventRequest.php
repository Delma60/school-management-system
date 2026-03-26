<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolEventRequest extends FormRequest
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
            'title'    => 'required|string|max:100',
            'date'     => 'required|date',
            'time'     => 'required|string',
            'location' => 'required|string|max:100',
            'type'     => 'required|in:academic,holiday,meeting,sports',
        ];
    }
}
