<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends Controller
{
    public function index()
    {
        // Pluck settings into a simple key-value array for React
        $settings = Setting::pluck('value', 'key')->toArray();

        // Provide defaults if the database is empty
        $defaultSettings = array_merge([
            'school_name' => 'Delma International School',
            'school_email' => 'contact@school.com',
            'school_phone' => '+234 800 000 0000',
            'school_address' => '123 Education Way',
            'current_session' => '2025/2026',
            'current_term' => 'First Term',
            'school_logo' => null,
        ], $settings);

        return inertia('admin/settings/school-profile', [
            'settings' => $defaultSettings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'school_name' => 'required|string|max:255',
            'school_email' => 'required|email|max:255',
            'school_phone' => 'required|string|max:20',
            'school_address' => 'required|string',
            'current_session' => 'required|string',
            'current_term' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048', // Max 2MB
        ]);

        // 1. Handle Logo Upload separately
        if ($request->hasFile('logo')) {
            // Delete old logo if it exists
            $oldLogo = Setting::where('key', 'school_logo')->first();
            if ($oldLogo && $oldLogo->value) {
                Storage::disk('public')->delete($oldLogo->value);
            }

            // Save new logo
            $path = $request->file('logo')->store('school', 'public');
            Setting::updateOrCreate(['key' => 'school_logo'], ['value' => $path, 'group' => 'general']);
        }

        // 2. Update text settings
        $keys = ['school_name', 'school_email', 'school_phone', 'school_address', 'current_session', 'current_term'];
        
        foreach ($keys as $key) {
            if (isset($validated[$key])) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $validated[$key], 'group' => in_array($key, ['current_session', 'current_term']) ? 'academic' : 'general']
                );
            }
        }

        return redirect()->back()->with('success', 'School profile updated successfully.');
    }
}