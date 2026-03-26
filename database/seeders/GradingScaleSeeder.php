<?php

namespace Database\Seeders;

use App\Models\GradingScale;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradingScaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            [
                'grade' => 'A',
                'min_score' => 90,
                'max_score' => 100,
                'remark' => 'Excellent',
            ],
            [
                'grade' => 'B',
                'min_score' => 80,
                'max_score' => 89,
                'remark' => 'Very Good',
            ],
            [
                'grade' => 'C',
                'min_score' => 70,
                'max_score' => 79,
                'remark' => 'Good',
            ],
            [
                'grade' => 'D',
                'min_score' => 60,
                'max_score' => 69,
                'remark' => 'Satisfactory',
            ],
            [
                'grade' => 'E',
                'min_score' => 50,
                'max_score' => 59,
                'remark' => 'Pass',
            ],
            [
                'grade' => 'F',
                'min_score' => 0,
                'max_score' => 49,
                'remark' => 'Fail',
            ],
        ];

        foreach ($grades as $grade) {
            GradingScale::firstOrCreate(
                ['grade' => $grade['grade']],
                $grade
            );
        }
    }
}
