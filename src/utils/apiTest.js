// Test Gemini API connection
export const testGeminiConnection = async apiKey => {
  if (!apiKey.trim()) {
    throw new Error('API key không được để trống');
  }

  const testPrompt = 'Say "Hello" in JSON format: {"message": "Hello"}';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: testPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('API response không hợp lệ');
    }

    return {
      success: true,
      message: 'Kết nối API thành công!',
    };
  } catch (error) {
    throw new Error(`Lỗi kết nối API: ${error.message}`);
  }
};
