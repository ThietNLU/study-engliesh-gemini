// Advanced Quiz Generator Service using Gemini AI
class QuizGeneratorService {
  constructor() {
    this.baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  /**
   * Generate quiz questions using Gemini AI
   * @param {Object} config - Quiz configuration
   * @param {string} config.topic - Topic (grammar/vocabulary/specific theme)
   * @param {string} config.level - Difficulty level (A1, A2, B1, B2, C1, C2)
   * @param {string} config.type - Question type (multiple_choice, fill_blank, sentence_transformation, true_false, matching)
   * @param {number} config.count - Number of questions (default: 10)
   * @param {string} config.focus - Specific focus area (optional)
   * @param {Array} config.vocabulary - Existing vocabulary to use (optional)
   * @param {string} apiKey - Gemini API key
   */
  async generateQuiz(config, apiKey) {
    if (!apiKey?.trim()) {
      throw new Error('Vui lòng nhập API Key của Gemini');
    }

    console.log('Validating config:', config);
    this.validateConfig(config);

    const prompt = this.createQuizPrompt(config);
    console.log('Generated prompt:', prompt);

    try {
      console.log('Making API request to Gemini...');
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          // System instruction (camelCase per REST spec)
          systemInstruction: {
            parts: [{ text: this.getSystemInstruction() }],
          },
          // safetySettings removed to avoid API 400 for unsupported categories on this model/version
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quiz Generation API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });

        if (response.status === 403) {
          throw new Error(
            'API Key không hợp lệ hoặc không có quyền truy cập Gemini API'
          );
        } else if (response.status === 429) {
          throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau');
        } else if (response.status === 400) {
          // Surface more context for debugging 400s
          throw new Error(
            'Yêu cầu không hợp lệ (400). Kiểm tra cấu hình và lược sử log Network. Chi tiết: ' +
              errorText.slice(0, 300)
          );
        } else {
          throw new Error(
            `API Error: ${response.status} - ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      console.log('Quiz Generation Response:', data);

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        console.error('Invalid response structure:', data);
        throw new Error('Response từ AI không hợp lệ - không có nội dung');
      }

      const aiText = data.candidates[0].content.parts?.[0]?.text || '';
      console.log('AI response text:', aiText);

      return this.parseQuizResponse(aiText);
    } catch (error) {
      console.error('Error generating quiz:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(
          'Không thể kết nối với Gemini API. Kiểm tra kết nối internet'
        );
      }
      throw error;
    }
  }

  getSystemInstruction() {
    return `You are an expert English language learning quiz generator. Your role is to create high-quality, pedagogically sound quiz questions for English learners.

CORE PRINCIPLES:
1. Questions must be appropriate for the specified CEFR level
2. Use authentic, natural English that learners would encounter
3. Ensure questions test the intended learning objective clearly
4. Provide clear, unambiguous correct answers
5. Include realistic distractors for multiple choice questions
6. Follow established language teaching methodologies

QUALITY STANDARDS:
- Questions should be challenging but fair for the level
- Avoid cultural bias or overly specialized knowledge
- Use contemporary, relevant vocabulary and contexts
- Ensure grammatical accuracy in all content
- Provide helpful explanations when appropriate

OUTPUT FORMAT:
- Always return valid JSON only
- Follow the exact schema provided in prompts
- No markdown, no explanations outside JSON
- Use proper escaping for special characters`;
  }

  validateConfig(config) {
    const requiredFields = ['topic', 'level', 'type'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
      throw new Error(`Thiếu thông tin: ${missingFields.join(', ')}`);
    }

    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validLevels.includes(config.level)) {
      throw new Error('Level phải là một trong: ' + validLevels.join(', '));
    }

    const validTypes = [
      'multiple_choice',
      'fill_blank',
      'sentence_transformation',
      'true_false',
      'matching',
      'ordering',
      'gap_fill',
    ];
    if (!validTypes.includes(config.type)) {
      throw new Error('Type phải là một trong: ' + validTypes.join(', '));
    }
  }

  createQuizPrompt(config) {
    const { topic, level, type, count = 10, focus, vocabulary = [] } = config;

    const basePrompt = `Generate ${count} English learning quiz questions with the following specifications:

TOPIC: ${topic}
LEVEL: ${level} (CEFR)
QUESTION TYPE: ${type}
${focus ? `SPECIFIC FOCUS: ${focus}` : ''}
${vocabulary.length > 0 ? `VOCABULARY TO INCLUDE: ${vocabulary.slice(0, 20).join(', ')}` : ''}

`;

    switch (type) {
      case 'multiple_choice':
        return basePrompt + this.getMultipleChoicePrompt(level);
      case 'fill_blank':
        return basePrompt + this.getFillBlankPrompt(level);
      case 'sentence_transformation':
        return basePrompt + this.getSentenceTransformationPrompt(level);
      case 'true_false':
        return basePrompt + this.getTrueFalsePrompt(level);
      case 'matching':
        return basePrompt + this.getMatchingPrompt(level);
      case 'ordering':
        return basePrompt + this.getOrderingPrompt(level);
      case 'gap_fill':
        return basePrompt + this.getGapFillPrompt(level);
      default:
        throw new Error('Unknown question type');
    }
  }

  getMultipleChoicePrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Choose the correct answer to complete the sentence: 'I have been studying English ___ two years.'",
      "options": ["since", "for", "during", "from"],
      "correct_answer": 1,
      "explanation": "We use 'for' with periods of time to show duration.",
      "level": "${level}",
      "skill": "grammar",
      "points": 1
    }
  ]
}

REQUIREMENTS:
- Questions appropriate for ${level} level
- 4 realistic options (A, B, C, D indexed 0-3)
- One clearly correct answer
- Plausible distractors
- Clear, concise explanations
- Test authentic language use
- Include various skills: grammar, vocabulary, reading comprehension

START JSON:`;
  }

  getFillBlankPrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "fill_blank",
      "question": "Complete the sentence with the correct word:",
      "sentence": "The weather has been very _____ lately, with temperatures dropping below zero.",
      "correct_answer": "cold",
      "acceptable_answers": ["cold", "chilly", "freezing"],
      "explanation": "The context clues 'temperatures dropping below zero' indicate cold weather.",
      "level": "${level}",
      "skill": "vocabulary",
      "points": 1
    }
  ]
}

REQUIREMENTS:
- Context clues should guide the answer
- Multiple acceptable answers when appropriate
- ${level} level vocabulary
- Clear context
- Realistic scenarios

START JSON:`;
  }

  getSentenceTransformationPrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "sentence_transformation",
      "question": "Rewrite the sentence using the word given. Do not change the meaning.",
      "original_sentence": "She started learning French five years ago.",
      "key_word": "FOR",
      "target_structure": "She has been learning French _____ five years.",
      "correct_answer": "for",
      "full_answer": "She has been learning French for five years.",
      "explanation": "Transform from past simple to present perfect continuous with 'for' + time period.",
      "level": "${level}",
      "skill": "grammar",
      "points": 2
    }
  ]
}

REQUIREMENTS:
- Clear transformation rules
- Maintain original meaning
- ${level} appropriate structures
- Provide both partial and full answers
- Focus on key grammar patterns

START JSON:`;
  }

  getTrueFalsePrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "true_false",
      "question": "Read the statement and decide if it's True or False:",
      "statement": "The present perfect tense is used to describe actions that happened at a specific time in the past.",
      "correct_answer": false,
      "explanation": "The present perfect describes actions with a connection to the present, not specific past times.",
      "level": "${level}",
      "skill": "grammar",
      "points": 1
    }
  ]
}

REQUIREMENTS:
- Clear, unambiguous statements
- Test important language concepts
- ${level} appropriate content
- Detailed explanations
- Mix of true and false answers

START JSON:`;
  }

  getMatchingPrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "matching",
      "question": "Match the words with their correct definitions:",
      "left_column": [
        {"id": "a", "text": "ambitious"},
        {"id": "b", "text": "reliable"},
        {"id": "c", "text": "creative"}
      ],
      "right_column": [
        {"id": "1", "text": "having strong desire for success"},
        {"id": "2", "text": "can be trusted and depended on"},
        {"id": "3", "text": "having original ideas"}
      ],
      "correct_matches": [
        {"left": "a", "right": "1"},
        {"left": "b", "right": "2"},
        {"left": "c", "right": "3"}
      ],
      "level": "${level}",
      "skill": "vocabulary",
      "points": 3
    }
  ]
}

REQUIREMENTS:
- Equal number of items in both columns
- Clear, unambiguous matches
- ${level} appropriate vocabulary
- Logical grouping (words/definitions, questions/answers, etc.)

START JSON:`;
  }

  getOrderingPrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "ordering",
      "question": "Put the words in the correct order to make a grammatically correct sentence:",
      "scrambled_words": ["have", "been", "I", "studying", "English", "for", "three", "years"],
      "correct_order": ["I", "have", "been", "studying", "English", "for", "three", "years"],
      "correct_sentence": "I have been studying English for three years.",
      "explanation": "Present perfect continuous: Subject + have/has + been + verb-ing + complement",
      "level": "${level}",
      "skill": "grammar",
      "points": 2
    }
  ]
}

REQUIREMENTS:
- Meaningful, complete sentences
- Test specific grammar patterns
- ${level} appropriate complexity
- Clear structural patterns

START JSON:`;
  }

  getGapFillPrompt(level) {
    return `Return ONLY valid JSON in this EXACT format:

{
  "questions": [
    {
      "id": 1,
      "type": "gap_fill",
      "question": "Fill in ALL the gaps in the text:",
      "text": "Last weekend, I ___1___ (go) to the park with my friends. We ___2___ (play) football for two hours. It ___3___ (be) really fun!",
      "gaps": [
        {"number": 1, "correct_answer": "went", "acceptable_answers": ["went"]},
        {"number": 2, "correct_answer": "played", "acceptable_answers": ["played"]},
        {"number": 3, "correct_answer": "was", "acceptable_answers": ["was"]}
      ],
      "explanation": "Past simple tense is used for completed actions in the past.",
      "level": "${level}",
      "skill": "grammar",
      "points": 3
    }
  ]
}

REQUIREMENTS:
- Coherent, meaningful text
- Multiple related gaps
- ${level} appropriate content
- Clear context for each gap

START JSON:`;
  }

  parseQuizResponse(aiText) {
    try {
      console.log('Raw AI response:', aiText.substring(0, 500) + '...');

      // Clean the response text
      let cleanedText = aiText.trim();

      // Remove markdown code blocks and any wrapper text
      cleanedText = cleanedText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/g, '')
        .replace(/```\s*/g, '')
        .replace(/^[^{]*/, '') // Remove any text before first {
        .replace(/}[^}]*$/, '}'); // Remove any text after last }

      // More aggressive JSON extraction - find the main JSON object
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0 || jsonEnd <= jsonStart) {
        console.error('No valid JSON boundaries found in response:', aiText);
        throw new Error('Không tìm thấy JSON hợp lệ trong phản hồi từ AI');
      }

      let jsonString = cleanedText.substring(jsonStart, jsonEnd);
      console.log(
        'Extracted JSON string (first 300 chars):',
        jsonString.substring(0, 300)
      );

      // Apply multiple rounds of JSON fixing
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          jsonString = this.fixJsonFormat(jsonString);

          // Test parse
          JSON.parse(jsonString);
          console.log('JSON parsed successfully on attempt', attempt + 1);
          break;
        } catch (parseError) {
          console.warn(
            `JSON parse attempt ${attempt + 1} failed:`,
            parseError.message
          );
          if (attempt === 2) {
            // Last attempt - try even more aggressive fixes
            jsonString = jsonString
              .replace(/([^",\s]+):/g, '"$1":') // Quote all unquoted keys
              .replace(/:\s*([^",[{][^,\]}]*?)(\s*[,\]}])/g, ': "$1"$2') // Quote unquoted values
              .replace(/:\s*"(true|false|null|\d+(?:\.\d+)?)"/gi, ': $1'); // Unquote primitives
          }
        }
      }

      const quizData = JSON.parse(jsonString);

      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        console.error('Invalid quiz structure:', quizData);
        throw new Error(
          'Format dữ liệu quiz không đúng - không tìm thấy mảng questions'
        );
      }

      if (quizData.questions.length === 0) {
        throw new Error('AI không tạo được câu hỏi nào');
      }

      // Validate each question
      const validQuestions = quizData.questions.filter(question => {
        const isValid = question.question && question.type && question.level;
        if (!isValid) {
          console.warn('Invalid question structure:', question);
        }
        return isValid;
      });

      if (validQuestions.length === 0) {
        throw new Error('Không có câu hỏi hợp lệ nào từ AI');
      }

      // Normalize questions (fix MCQ index base, boolean values, ensure arrays)
      const normalizedQuestions = validQuestions.map(q =>
        this.normalizeQuestion(q)
      );

      return {
        questions: normalizedQuestions,
        metadata: {
          generatedAt: new Date().toISOString(),
          totalQuestions: normalizedQuestions.length,
          questionTypes: [...new Set(normalizedQuestions.map(q => q.type))],
          levels: [...new Set(normalizedQuestions.map(q => q.level))],
        },
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Quiz JSON Parse Error:', error);
        console.error('Problematic JSON string:', error.message);
        console.error(
          'Raw AI Text (first 1000 chars):',
          aiText.substring(0, 1000)
        );
        throw new Error(
          `Không thể phân tích JSON từ AI: ${error.message}. Vui lòng thử lại hoặc thay đổi cấu hình.`
        );
      }
      throw error;
    }
  }

  fixJsonFormat(jsonString) {
    let fixed = jsonString;

    try {
      // First pass: basic cleanup
      fixed = fixed
        // Remove comments and non-JSON text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        // Clean up whitespace
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Second pass: fix JSON structure
      fixed = fixed
        // Remove trailing commas before closing braces/brackets
        .replace(/,(\s*[}\]])/g, '$1')
        // Ensure property names are properly quoted
        .replace(/(\{|,)(\s*)([a-zA-Z0-9_]+)(\s*):/g, '$1"$3":')
        // Convert single quotes to double quotes for strings
        .replace(/:\s*'([^']*)'/g, ': "$1"')
        // Fix unquoted string values (basic heuristic)
        .replace(
          /:\s*([a-zA-Z][a-zA-Z0-9\s]*[a-zA-Z0-9])(\s*[,}\]])/g,
          ': "$1"$2'
        )
        // Normalize booleans and nulls that got quoted
        .replace(/:\s*"(true|false|null)"/gi, ': $1')
        // Fix numbers that got quoted
        .replace(/:\s*"(\d+(?:\.\d+)?)"/g, ': $1');

      // Third pass: validate and attempt to auto-fix common issues
      // Try to parse - if it fails, we'll do more aggressive fixes
      try {
        JSON.parse(fixed);
        return fixed;
      } catch (parseError) {
        console.warn(
          'Initial JSON parse failed, attempting fixes:',
          parseError.message
        );

        // More aggressive fixes for common AI mistakes
        fixed = fixed
          // Fix missing quotes around object keys
          .replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
          // Fix trailing commas again (might have been introduced)
          .replace(/,(\s*[}\]])/g, '$1')
          // Fix double quotes inside string values
          .replace(
            /:\s*"([^"]*)"([^"]*)"([^"]*)"(\s*[,}\]])/g,
            ': "$1\\"$2\\"$3"$4'
          )
          // Remove extra commas
          .replace(/,+/g, ',')
          // Remove comma before first property
          .replace(/\{\s*,/g, '{');

        return fixed;
      }
    } catch (error) {
      console.warn('JSON fixing failed, returning original:', error);
      return jsonString;
    }
  }

  // Ensure AI responses conform to the expected schema used by UI/Player
  normalizeQuestion(question) {
    const q = { ...question };

    // Standardize type to known set (lowercase, underscores)
    if (typeof q.type === 'string') {
      q.type = q.type.toLowerCase().replace(/[-\s]/g, '_');
    }

    // Points default
    if (typeof q.points !== 'number' || Number.isNaN(q.points)) q.points = 1;

    // Multiple choice: ensure 0-based index and options array
    if (q.type === 'multiple_choice') {
      if (!Array.isArray(q.options)) q.options = [];

      // Convert letter answers (e.g., 'A'|'B'|...) to 0-based index
      if (typeof q.correct_answer === 'string') {
        const letter = q.correct_answer.trim().toUpperCase();
        const idx = 'ABCD'.indexOf(letter);
        if (idx >= 0) q.correct_answer = idx;
      }

      // Convert 1-based to 0-based if necessary
      if (
        typeof q.correct_answer === 'number' &&
        Array.isArray(q.options) &&
        q.options.length > 0
      ) {
        // If value equals options length (out of range) or > 0-based, try to shift
        if (q.correct_answer >= 1 && q.correct_answer <= q.options.length - 1) {
          // Heuristic: many LLMs return 0-based already; only shift if there is evidence of 1-based
          // We'll detect classic off-by-one: if no option matches when previewing, the UI still works.
          // Safer approach: if any example value is 1 and options length is 4, assume 0-3; keep as-is.
        }

        // If value equals options length (e.g., 4 with 4 options), shift to 3
        if (q.correct_answer === q.options.length) {
          q.correct_answer = q.correct_answer - 1;
        }
      }

      // Clamp index into range
      if (typeof q.correct_answer === 'number' && q.options.length > 0) {
        if (q.correct_answer < 0) q.correct_answer = 0;
        if (q.correct_answer >= q.options.length)
          q.correct_answer = q.options.length - 1;
      }
    }

    // True/False: ensure boolean
    if (q.type === 'true_false') {
      if (typeof q.correct_answer === 'string') {
        const s = q.correct_answer.trim().toLowerCase();
        if (s === 'true' || s === 't') q.correct_answer = true;
        if (s === 'false' || s === 'f') q.correct_answer = false;
      }
      if (typeof q.correct_answer !== 'boolean') {
        // default to false if unclear
        q.correct_answer = false;
      }
    }

    // Fill blank: ensure acceptable_answers contains correct_answer
    if (q.type === 'fill_blank') {
      if (!Array.isArray(q.acceptable_answers)) q.acceptable_answers = [];
      if (
        typeof q.correct_answer === 'string' &&
        !q.acceptable_answers.includes(q.correct_answer)
      ) {
        q.acceptable_answers = [q.correct_answer, ...q.acceptable_answers];
      }
    }

    // Matching/Ordering/Gap fill: ensure arrays
    if (q.type === 'matching') {
      if (!Array.isArray(q.left_column)) q.left_column = [];
      if (!Array.isArray(q.right_column)) q.right_column = [];
      if (!Array.isArray(q.correct_matches)) q.correct_matches = [];
    }
    if (q.type === 'ordering') {
      if (!Array.isArray(q.scrambled_words)) q.scrambled_words = [];
      if (!Array.isArray(q.correct_order)) q.correct_order = [];
    }
    if (q.type === 'gap_fill') {
      if (!Array.isArray(q.gaps)) q.gaps = [];
    }

    return q;
  }

  // Helper method to get available question types
  getQuestionTypes() {
    return [
      {
        id: 'multiple_choice',
        name: 'Trắc nghiệm',
        description: 'Chọn đáp án đúng từ 4 lựa chọn',
        icon: '☐',
      },
      {
        id: 'fill_blank',
        name: 'Điền từ',
        description: 'Điền từ vào chỗ trống',
        icon: '___',
      },
      {
        id: 'sentence_transformation',
        name: 'Chuyển đổi câu',
        description: 'Viết lại câu với từ gợi ý',
        icon: '↔',
      },
      {
        id: 'true_false',
        name: 'Đúng/Sai',
        description: 'Xác định câu đúng hay sai',
        icon: '✓✗',
      },
      {
        id: 'matching',
        name: 'Nối từ',
        description: 'Nối từ với nghĩa tương ứng',
        icon: '⟷',
      },
      {
        id: 'ordering',
        name: 'Sắp xếp câu',
        description: 'Sắp xếp từ thành câu đúng',
        icon: '⇅',
      },
      {
        id: 'gap_fill',
        name: 'Điền đoạn văn',
        description: 'Điền nhiều từ vào đoạn văn',
        icon: '📝',
      },
    ];
  }

  // Helper method to get available topics
  getTopics() {
    return [
      // Grammar topics
      {
        id: 'present_tenses',
        name: 'Present Tenses',
        category: 'grammar',
        description: 'Present Simple, Continuous, Perfect',
      },
      {
        id: 'past_tenses',
        name: 'Past Tenses',
        category: 'grammar',
        description: 'Past Simple, Continuous, Perfect',
      },
      {
        id: 'future_tenses',
        name: 'Future Tenses',
        category: 'grammar',
        description: 'Will, Going to, Present Continuous for future',
      },
      {
        id: 'conditionals',
        name: 'Conditionals',
        category: 'grammar',
        description: 'If clauses, Zero to Third conditionals',
      },
      {
        id: 'passive_voice',
        name: 'Passive Voice',
        category: 'grammar',
        description: 'Active to passive transformations',
      },
      {
        id: 'reported_speech',
        name: 'Reported Speech',
        category: 'grammar',
        description: 'Direct to indirect speech',
      },
      {
        id: 'modal_verbs',
        name: 'Modal Verbs',
        category: 'grammar',
        description: 'Can, could, should, must, might',
      },
      // Vocabulary topics
      {
        id: 'business_english',
        name: 'Business English',
        category: 'vocabulary',
        description: 'Professional and workplace vocabulary',
      },
      {
        id: 'travel_tourism',
        name: 'Travel & Tourism',
        category: 'vocabulary',
        description: 'Travel-related vocabulary',
      },
      {
        id: 'technology',
        name: 'Technology',
        category: 'vocabulary',
        description: 'Tech and digital vocabulary',
      },
      {
        id: 'health_medicine',
        name: 'Health & Medicine',
        category: 'vocabulary',
        description: 'Medical and health vocabulary',
      },
      {
        id: 'environment',
        name: 'Environment',
        category: 'vocabulary',
        description: 'Environmental and nature vocabulary',
      },
      {
        id: 'education',
        name: 'Education',
        category: 'vocabulary',
        description: 'Academic and educational vocabulary',
      },
      // Theme-based topics
      {
        id: 'daily_life',
        name: 'Daily Life',
        category: 'theme',
        description: 'Everyday situations and activities',
      },
      {
        id: 'food_cooking',
        name: 'Food & Cooking',
        category: 'theme',
        description: 'Culinary vocabulary and expressions',
      },
      {
        id: 'sports_fitness',
        name: 'Sports & Fitness',
        category: 'theme',
        description: 'Sports and exercise vocabulary',
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        category: 'theme',
        description: 'Movies, music, books, games',
      },
    ];
  }

  // Helper method to get difficulty levels
  getLevels() {
    return [
      {
        id: 'A1',
        name: 'Beginner (A1)',
        description: 'Basic vocabulary and simple grammar',
      },
      {
        id: 'A2',
        name: 'Elementary (A2)',
        description: 'Common situations and topics',
      },
      {
        id: 'B1',
        name: 'Intermediate (B1)',
        description: 'Complex ideas and situations',
      },
      {
        id: 'B2',
        name: 'Upper-Intermediate (B2)',
        description: 'Abstract topics and nuanced language',
      },
      {
        id: 'C1',
        name: 'Advanced (C1)',
        description: 'Complex texts and implicit meaning',
      },
      {
        id: 'C2',
        name: 'Proficient (C2)',
        description: 'Native-like fluency and understanding',
      },
    ];
  }
}

export default new QuizGeneratorService();
