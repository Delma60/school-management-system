<?php

namespace Database\Seeders;

use App\Models\TimeBreak;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BreakSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $breaks = TimeBreak::getDefaultBreaks();

        foreach ($breaks as $break) {
            TimeBreak::firstOrCreate(
                ['name' => $break['name']],
                $break
            );
        }
    }
    
}
