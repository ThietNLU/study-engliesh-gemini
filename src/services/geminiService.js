// Gemini API service
class GeminiService {
  constructor() {
    this.baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async generateVocabulary(aiRequest, existingWords, apiKey) {
    if (!aiRequest.trim()) {
      throw new Error('Vui lòng nhập yêu cầu tạo từ vựng');
    }

    if (!apiKey.trim()) {
      throw new Error('Vui lòng nhập API Key của Gemini');
    }

    const prompt = this.createPrompt(aiRequest, existingWords);

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini Response:', data);

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content
      ) {
        throw new Error('Response từ AI không hợp lệ');
      }

      const aiText = data.candidates[0].content.parts[0].text;
      console.log('AI Text:', aiText);

      return this.parseResponse(aiText);
    } catch (error) {
      console.error('Error generating vocabulary:', error);
      throw new Error(`Lỗi tạo từ vựng: ${error.message}`);
    }
  }

  createPrompt(aiRequest, existingWords) {
    return `You are an English vocabulary AI. Create vocabulary words based on this request: "${aiRequest}"

Existing words (DO NOT duplicate): ${existingWords.slice(0, 50).join(', ')}

Return ONLY valid JSON in this EXACT format:

{
  "words": [
    {
      "english": "example",
      "vietnamese": "ví dụ",
      "pronunciation_us": "ɪɡˈzæmpəl",
      "pronunciation_uk": "ɪɡˈzɑːmpəl",
      "category": "nouns",
      "definition": "A thing characteristic of its kind or illustrating a general rule",
      "example": "This painting is a perfect example of the Impressionist style.",
      "level": "B1"
    }
  ]
}

STRICT REQUIREMENTS:
1. Return ONLY JSON - NO explanations, NO markdown, NO extra text
2. Generate 10-12 new words (not in existing list)
3. All fields must be filled with proper values
4. Use double quotes only, no trailing commas
5. Level: A1, A2, B1, B2, C1, C2
6. Category: nouns, verbs, adjectives, adverbs, prepositions, conjunctions, pronouns, interjections, phrases, idioms, collocations, business, technology, travel, food, academic
7. Pronunciation: Standard IPA format
8. Example: Clear, practical sentence
9. Definition: Concise English definition

Start JSON response now:`;
  }

  parseResponse(aiText) {
    try {
      // Clean the response text
      let cleanedText = aiText.trim();

      // Remove markdown code blocks
      cleanedText = cleanedText
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/g, '');
      cleanedText = cleanedText.replace(/```\s*/g, '');

      // Remove any leading explanatory text before JSON
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('No JSON found in AI response:', aiText);
        throw new Error('Không tìm thấy JSON trong phản hồi từ AI');
      }

      let jsonString = cleanedText.substring(jsonStart, jsonEnd);
      console.log('Extracted JSON string:', jsonString);

      // Fix common JSON formatting issues
      jsonString = this.fixJsonFormat(jsonString);

      const aiVocabulary = JSON.parse(jsonString);

      if (!aiVocabulary.words || !Array.isArray(aiVocabulary.words)) {
        console.error('Invalid vocabulary structure:', aiVocabulary);
        throw new Error(
          'Format dữ liệu từ AI không đúng - không tìm thấy mảng words'
        );
      }

      if (aiVocabulary.words.length === 0) {
        throw new Error('AI không tạo được từ vựng nào');
      }

      // Validate each word has required fields
      const validWords = aiVocabulary.words.filter(word => {
        const isValid =
          word.english && word.vietnamese && word.category && word.level;
        if (!isValid) {
          console.warn('Invalid word structure:', word);
        }
        return isValid;
      });

      if (validWords.length === 0) {
        throw new Error('Không có từ vựng hợp lệ nào từ AI');
      }

      return validWords;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('JSON Parse Error:', error);
        console.error('Raw AI Text:', aiText);
        throw new Error(`Không thể phân tích JSON từ AI: ${error.message}`);
      }
      throw error;
    }
  }

  fixJsonFormat(jsonString) {
    return (
      jsonString
        // Remove trailing commas before closing braces/brackets
        .replace(/,(\s*[}\]])/g, '$1')

        // Ensure property names are properly quoted
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?(\s*):/g, '"$2"$4:')

        // Convert single quotes to double quotes for strings
        .replace(/:\s*'([^']*)'/g, ': "$1"')

        // Clean up whitespace
        .replace(/\n/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/\s+/g, ' ')

        // Fix missing quotes around values (basic attempt)
        .replace(
          /:\s*([a-zA-Z][a-zA-Z0-9\s]*[a-zA-Z0-9])\s*([,}])/g,
          ': "$1"$2'
        )
    );
  }
}

export default new GeminiService();
