export default async function handler(req, res) {
  try {
    const userMessage =
      req.method === "POST"
        ? req.body?.message
        : req.query?.message || "Hello";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
       model: "claude-3-sonnet-20240307"
        max_tokens: 200,
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.content?.[0]?.text || JSON.stringify(data)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
