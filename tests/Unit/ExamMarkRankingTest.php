<?php

namespace Tests\Unit;

use App\Models\ExamMark;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\ExamSubject;
use App\Models\Examination;
use App\Models\Subject;
use Tests\TestCase;

class ExamMarkRankingTest extends TestCase
{
    protected $classroom;
    protected $examSubject;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $this->classroom = Classroom::factory()->create();
        $exam = Examination::factory()->create();
        $subject = Subject::factory()->create();
        $this->examSubject = ExamSubject::factory()->create([
            'examination_id' => $exam->id,
            'subject_id' => $subject->id,
        ]);
    }

    /**
     * Test ranking with different marks
     */
    public function test_ranking_with_different_marks(): void
    {
        // Create students with different marks
        $students = Student::factory(5)->create(['classroom_id' => $this->classroom->id]);
        
        $marks_data = [90, 85, 75, 70, 60];
        
        foreach ($students as $index => $student) {
            ExamMark::factory()->create([
                'student_id' => $student->id,
                'exam_subject_id' => $this->examSubject->id,
                'marks_obtained' => $marks_data[$index],
            ]);
        }

        // Manually call the ranking method
        $controller = new \App\Http\Controllers\ExamMarkController();
        $method = new \ReflectionMethod($controller, 'updateClassRanks');
        $method->setAccessible(true);
        $method->invoke($controller, $this->classroom->id, $this->examSubject->id);

        // Verify ranks
        $this->assertEquals(1, Student::find($students[0]->id)->rank);
        $this->assertEquals(2, Student::find($students[1]->id)->rank);
        $this->assertEquals(3, Student::find($students[2]->id)->rank);
        $this->assertEquals(4, Student::find($students[3]->id)->rank);
        $this->assertEquals(5, Student::find($students[4]->id)->rank);
    }

    /**
     * Test ranking with tied marks
     */
    public function test_ranking_with_tied_marks(): void
    {
        // Create students with some tied marks
        $students = Student::factory(6)->create(['classroom_id' => $this->classroom->id]);
        
        $marks_data = [90, 90, 85, 85, 75, 70];
        
        foreach ($students as $index => $student) {
            ExamMark::factory()->create([
                'student_id' => $student->id,
                'exam_subject_id' => $this->examSubject->id,
                'marks_obtained' => $marks_data[$index],
            ]);
        }

        // Manually call the ranking method
        $controller = new \App\Http\Controllers\ExamMarkController();
        $method = new \ReflectionMethod($controller, 'updateClassRanks');
        $method->setAccessible(true);
        $method->invoke($controller, $this->classroom->id, $this->examSubject->id);

        // Verify ranks (with ties)
        $this->assertEquals(1, Student::find($students[0]->id)->rank); // 90
        $this->assertEquals(1, Student::find($students[1]->id)->rank); // 90
        $this->assertEquals(3, Student::find($students[2]->id)->rank); // 85
        $this->assertEquals(3, Student::find($students[3]->id)->rank); // 85
        $this->assertEquals(5, Student::find($students[4]->id)->rank); // 75
        $this->assertEquals(6, Student::find($students[5]->id)->rank); // 70
    }

    /**
     * Test ranking with zero marks (no exam marks assigned)
     */
    public function test_ranking_with_no_marks_assigned(): void
    {
        // Create students without exam marks
        $students = Student::factory(3)->create(['classroom_id' => $this->classroom->id]);
        
        // Only create marks for 2 students
        ExamMark::factory()->create([
            'student_id' => $students[0]->id,
            'exam_subject_id' => $this->examSubject->id,
            'marks_obtained' => 85,
        ]);
        ExamMark::factory()->create([
            'student_id' => $students[1]->id,
            'exam_subject_id' => $this->examSubject->id,
            'marks_obtained' => 75,
        ]);
        // Student 3 has no exam mark - should get 0 marks

        // Manually call the ranking method
        $controller = new \App\Http\Controllers\ExamMarkController();
        $method = new \ReflectionMethod($controller, 'updateClassRanks');
        $method->setAccessible(true);
        $method->invoke($controller, $this->classroom->id, $this->examSubject->id);

        // Verify ranks
        $this->assertEquals(1, Student::find($students[0]->id)->rank); // 85
        $this->assertEquals(2, Student::find($students[1]->id)->rank); // 75
        $this->assertEquals(3, Student::find($students[2]->id)->rank); // 0 (no marks)
    }
}
