# AI Quiz Generator Documentation

## Overview

AI Quiz Generator là một hệ thống tạo bài quiz thông minh sử dụng Gemini AI, cho phép tạo ra các bài kiểm tra đa dạng theo chủ đề, mức độ và dạng câu hỏi khác nhau.

## Features

### 1. Quiz Generation
- **Multiple Question Types**: Hỗ trợ 7 dạng câu hỏi khác nhau
- **Smart Prompting**: Sử dụng system instruction và prompt engineering
- **CEFR Level Support**: Từ A1 đến C2
- **Topic Variety**: Grammar, vocabulary, và theme-based topics

### 2. Question Types

#### Multiple Choice
- 4 lựa chọn A, B, C, D
- Một đáp án đúng duy nhất
- Distractors hợp lý

#### Fill in the Blank
- Điền từ vào chỗ trống
- Hỗ trợ nhiều đáp án chấp nhận được
- Context clues rõ ràng

#### Sentence Transformation
- Viết lại câu với từ gợi ý
- Giữ nguyên nghĩa gốc
- Test grammar patterns

#### True/False
- Xác định câu đúng/sai
- Giải thích chi tiết
- Test language concepts

#### Matching
- Nối từ với nghĩa
- Words/definitions pairing
- Logical grouping

#### Word Ordering
- Sắp xếp từ thành câu
- Test sentence structure
- Grammar pattern recognition

#### Gap Fill
- Điền nhiều từ vào đoạn văn
- Coherent text passages
- Multiple related blanks

### 3. Topic Categories

#### Grammar Topics
- Present Tenses (Simple, Continuous, Perfect)
- Past Tenses (Simple, Continuous, Perfect) 
- Future Tenses (Will, Going to, Present Continuous)
- Conditionals (Zero to Third conditionals)
- Passive Voice
- Reported Speech
- Modal Verbs

#### Vocabulary Topics
- Business English
- Travel & Tourism
- Technology
- Health & Medicine
- Environment
- Education

#### Theme-based Topics
- Daily Life
- Food & Cooking
- Sports & Fitness
- Entertainment

### 4. CEFR Levels
- **A1 (Beginner)**: Basic vocabulary and simple grammar
- **A2 (Elementary)**: Common situations and topics
- **B1 (Intermediate)**: Complex ideas and situations
- **B2 (Upper-Intermediate)**: Abstract topics and nuanced language
- **C1 (Advanced)**: Complex texts and implicit meaning
- **C2 (Proficient)**: Native-like fluency and understanding

## Technical Implementation

### Prompt Engineering

#### System Instruction
```
You are an expert English language learning quiz generator. Your role is to create high-quality, pedagogically sound quiz questions for English learners.

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
- Use proper escaping for special characters
```

#### Prompt Structure
1. **Base Configuration**: Topic, level, type, count
2. **Type-Specific Instructions**: Detailed format requirements
3. **JSON Schema**: Exact output format
4. **Quality Requirements**: Level-appropriate content

### API Configuration
```javascript
{
  contents: [{ parts: [{ text: prompt }] }],
  systemInstruction: { parts: [{ text: systemInstruction }] },
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  }
}
```

### JSON Schema Examples

#### Multiple Choice
```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Choose the correct answer...",
      "options": ["option1", "option2", "option3", "option4"],
      "correct_answer": 1,
      "explanation": "Explanation text...",
      "level": "B1",
      "skill": "grammar",
      "points": 1
    }
  ]
}
```

#### Fill Blank
```json
{
  "questions": [
    {
      "id": 1,
      "type": "fill_blank",
      "question": "Complete the sentence:",
      "sentence": "The weather has been very _____ lately.",
      "correct_answer": "cold",
      "acceptable_answers": ["cold", "chilly", "freezing"],
      "explanation": "Context clues indicate cold weather.",
      "level": "A2",
      "skill": "vocabulary",
      "points": 1
    }
  ]
}
```

## Components

### QuizGenerator
- Main quiz generation interface
- Configuration panel
- Preview generated questions
- Save/export functionality

### QuizPlayer
- Interactive quiz taking experience
- Progress tracking
- Real-time scoring
- Answer explanations

### QuizModeAdvanced
- Complete quiz management system
- Quiz library
- Statistics tracking
- Results history

## Usage Guide

### Creating a Quiz

1. **Select Topic**
   - Choose from predefined topics
   - Or enter custom topic

2. **Configure Settings**
   - Set CEFR level (A1-C2)
   - Choose question type
   - Specify number of questions (5-50)
   - Add optional focus area

3. **Generate Quiz**
   - AI processes request
   - Returns structured quiz data
   - Preview questions before saving

4. **Save & Export**
   - Save to local library
   - Export as JSON/TXT
   - Ready for taking or sharing

### Taking a Quiz

1. **Start Quiz**
   - Select from saved quizzes
   - Progress bar shows completion
   - Timer tracks study time

2. **Answer Questions**
   - Type-specific interfaces
   - Immediate feedback option
   - Navigation between questions

3. **View Results**
   - Detailed scoring breakdown
   - Grade assignment (A-F)
   - Time spent analysis
   - Option to retake

## Best Practices

### Question Quality
- Use authentic English contexts
- Avoid cultural bias
- Ensure clear correct answers
- Provide meaningful explanations

### Level Appropriateness
- Vocabulary matches CEFR level
- Grammar complexity is suitable
- Topics are age/level appropriate
- Instructions are clear

### Prompt Design
- Specific, detailed instructions
- Clear JSON schema requirements
- Examples when helpful
- Consistent formatting rules

## Error Handling

### API Errors
- Network timeout handling
- Invalid API key detection
- Rate limit management
- Graceful error messages

### Data Validation
- JSON parsing validation
- Required field checking
- Type-specific validation
- Fallback for malformed data

## Storage

### Local Storage
- Quiz library persistence
- Results history tracking
- Configuration preferences
- Export/import capabilities

### Data Structure
```javascript
{
  savedQuizzes: [],    // Generated quizzes
  quizResults: [],     // Completion results
  preferences: {}      // User settings
}
```

## Future Enhancements

### Planned Features
- Adaptive difficulty adjustment
- Multi-modal questions (audio/image)
- Collaborative quiz creation
- Advanced analytics
- Custom scoring rubrics

### Integration Possibilities
- Learning Management Systems
- Progress tracking with spaced repetition
- Social sharing features
- Classroom management tools

## API Reference

### QuizGeneratorService Methods

#### generateQuiz(config, apiKey)
Generates quiz using Gemini AI

**Parameters:**
- `config`: Quiz configuration object
- `apiKey`: Gemini API key

**Returns:** Promise resolving to quiz data

#### getQuestionTypes()
Returns available question types

#### getTopics()
Returns predefined topic categories

#### getLevels()
Returns CEFR level definitions

## Troubleshooting

### Common Issues

1. **API Key Problems**
   - Verify key is valid
   - Check quota limits
   - Ensure proper permissions

2. **Generation Failures**
   - Check prompt complexity
   - Verify topic validity
   - Retry with different settings

3. **JSON Parsing Errors**
   - AI output formatting issues
   - Retry generation
   - Check for special characters

### Debug Information
- Enable console logging
- Review AI response text
- Check JSON validation errors
- Monitor API response status
