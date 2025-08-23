// Gemini API service
class GeminiService {
  constructor() {
    this.baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    // Built-in instruction fallback if public/instruction.md is removed
    this.string_instruction = `Audience: 20-year-old learner, intermediate English proficiency.

Style:
- Clear, concise definitions suitable for B1 level.
- One short, practical example per meaning.
- Include a brief Vietnamese translation for each meaning (translation_vi).
- Prefer common senses first; avoid rare/archaic senses.

Formatting:
- Follow the provided JSON schema exactly.
- Keep IPA phonetics consistent (en-US, en-GB).

Notes:
- If the query is a phrase or phrasal verb, include the correct part_of_speech and an example showing natural usage.
- If multiple parts of speech exist, return up to 3 entries total.`;
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

  // Dictionary lookup via Gemini
  async lookupDictionary(query, apiKey) {
    if (!query.trim()) {
      throw new Error('Vui lòng nhập từ/cụm từ cần tra');
    }
    if (!(apiKey && apiKey.trim())) {
      throw new Error('Vui lòng nhập API Key của Gemini');
    }

    const instructionText = await this.getInstructionText();
    const prompt = this.createDictionaryPrompt(query, {
      instructionText,
      age: 20,
      level: 'intermediate',
    });

    try {
      const response = await fetch(`${this.baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return this.parseDictionaryResponse(aiText);
    } catch (error) {
      throw new Error(`Lỗi tra từ điển: ${error.message}`);
    }
  }

  createDictionaryPrompt(query, ctx = {}) {
    const age = ctx.age || 20;
    const level = ctx.level || 'intermediate';
    const extra = ctx.instructionText
      ? `\nAdditional instructor guidance:\n${ctx.instructionText}\n`
      : '';
    return `You are a precise English dictionary. Return ONLY valid JSON for the query: "${query}".

User Context:
- Age: ${age}
- Proficiency: ${level}
${extra}

Schema (Cambridge-style JSON):
{
  "entries": [
    {
      "headword": "string",
      "phonetic_us": "string",
      "phonetic_uk": "string",
      "part_of_speech": "string",
      "senses": [
        {
          "definition": "string",
          "example": "string",
          "synonyms": ["string"],
          "antonyms": ["string"],
          "translation_vi": "string"
        }
      ]
    }
  ]
}

Rules:
1) JSON only. No markdown, no explanations.
2) Return 1–2 entries only (keep concise). If multiple parts of speech exist, choose the most common.
3) Each sense MUST include: definition, example, translation_vi. Keep definition ≤ 18 words; example ≤ 18 words.
4) Use standard IPA for phonetics: en-US and en-GB.
5) Limit synonyms and antonyms to up to 5 items each.
6) If instruction text contains a sample format, align ordering and tone to that style.
Start JSON now:`;
  }

  async getInstructionText() {
    try {
      if (this._dictionaryInstruction) return this._dictionaryInstruction;
      const tryPaths = ['/instruction.md', '/Instruction.md'];
      for (const p of tryPaths) {
        try {
          const res = await fetch(p);
          if (res && res.ok) {
            const txt = await res.text();
            this._dictionaryInstruction =
              txt && txt.trim().length > 0 ? txt : this.string_instruction;
            return this._dictionaryInstruction;
          }
        } catch (e) {
          // ignore and try next path
        }
      }
      // No file found; use built-in fallback
      this._dictionaryInstruction = this.string_instruction;
      return this._dictionaryInstruction;
    } catch (e) {
      return this.string_instruction;
    }
  }

  parseDictionaryResponse(aiText) {
    try {
      const cleaned = aiText
        .trim()
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/g, '')
        .replace(/```\s*/g, '');
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}') + 1;
      if (start === -1 || end === 0)
        throw new Error('Không tìm thấy JSON trong phản hồi');
      let jsonString = cleaned.substring(start, end);
      jsonString = this.fixJsonFormat(jsonString);
      const obj = JSON.parse(jsonString);
      if (
        !obj.entries ||
        !Array.isArray(obj.entries) ||
        obj.entries.length === 0
      ) {
        throw new Error('Dữ liệu từ điển không hợp lệ');
      }
      // Basic normalization
      obj.entries = obj.entries.map(e => {
        const senses = Array.isArray(e.senses)
          ? e.senses
          : Array.isArray(e.meanings)
            ? e.meanings
            : [];
        return {
          headword: e.headword,
          phonetic_us: e.phonetic_us || '',
          phonetic_uk: e.phonetic_uk || '',
          part_of_speech: e.part_of_speech || '',
          meanings: senses.map(m => ({
            definition: m.definition || '',
            example: m.example || '',
            synonyms: Array.isArray(m.synonyms) ? m.synonyms : [],
            antonyms: Array.isArray(m.antonyms) ? m.antonyms : [],
            translation_vi: m.translation_vi || '',
          })),
        };
      });
      return obj;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Không thể phân tích JSON từ AI: ${error.message}`);
      }
      throw error;
    }
  }
}

export default new GeminiService();
