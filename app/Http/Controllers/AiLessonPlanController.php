<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiLessonPlanController extends Controller
{
    //
    public function generate(Request $request)
    {
        $request->validate([
            'topic' => 'required|string',
            'subject' => 'required|string',
            'grade_level' => 'required|string',
        ]);

        // 1. Construct the prompt
        $prompt = "You are an expert teacher. Create a detailed lesson plan for a '{$request->grade_level}' class on the subject of '{$request->subject}'. The specific topic for today is '{$request->topic}'. 
        
        Return ONLY a valid JSON object with no markdown formatting. It must contain exactly these three keys:
        {
            \"objectives\": \"A bulleted list of 3 to 4 learning objectives.\",
            \"materials\": \"A comma-separated list of required materials.\",
            \"content\": \"A detailed step-by-step procedure including an Introduction, Main Activity, and Conclusion.\"
        }";

        // 2. Call the AI API (Using OpenAI as an example)
        $response = Http::withToken(env('OPENAI_API_KEY'))
            ->timeout(60)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo', // or gpt-4o
                'messages' => [
                    ['role' => 'system', 'content' => 'You only output pure JSON.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to connect to AI service.'], 500);
        }

        // 3. Parse the response
        $content = $response->json('choices.0.message.content');
        
        // Clean up markdown blocks if the AI accidentally includes them
        $content = str_replace(['```json', '```'], '', $content);
        $decoded = json_decode(trim($content), true);

        if (!$decoded) {
            return response()->json(['error' => 'AI returned invalid data format.'], 500);
        }

        return response()->json($decoded);
    }
}
