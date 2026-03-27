<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    //
    public function index()
    {
        // Fetch all settings and pluck them into a simple key-value array
        $settings = Setting::pluck('value', 'key')->toArray();

        // Merge with sensible defaults so the UI never breaks on first load
        $defaultSettings = array_merge([
            // General
            'school_name' => 'Delma International School',
            'school_phone' => '+234 800 000 0000',
            'contact_email' => 'contact@school.com',
            'address' => '123 Education Way',
            
            // Academic
            'current_session' => '2025/2026',
            'current_term' => 'First Term',
            'grading_system' => 'standard_waec', // e.g., standard, waec, gpa
            
            // Financial
            'currency' => 'NGN',
            'payment_gateway' => 'paystack',
            'gateway_public_key' => '',
            'tax_percentage' => '0',
            
            // System & Notifications
            'smtp_host' => 'smtp.mailtrap.io',
            'smtp_port' => '2525',
            'maintenance_mode' => 'false',
        ], $settings);

        return inertia('admin/settings/index', [
            'settings' => $defaultSettings
        ]);
    }

    public function update(Request $request)
    {
        // Validate the incoming array of settings
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string'
        ]);

        // Loop through and update or create each setting
        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return redirect()->back()->with('success', 'System settings updated successfully.');
    }
}
