<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permission>
 */
class PermissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Permission>
     */
    protected $model = Permission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $groups = ['Academics', 'Attendance', 'Exams & Marks', 'Timetables', 'School Events', 'User Management', 'Reports'];
        $actions = ['view', 'create', 'edit', 'delete'];

        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->sentence(),
            'group' => $this->faker->randomElement($groups),
        ];
    }
}
