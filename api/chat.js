export default async function handler(req, res) {
  try {
    const userMessage =
      req.method === "POST"
        ? req.body?.message
        : req.query?.message || "Hello";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json，
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userMessage
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // 👇 关键修复（防止 undefined 崩溃）
    const reply =
      data?.content?.[0]?.text ||
      data?.error?.message ||
      "No response";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
