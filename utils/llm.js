import fetch from "node-fetch";

export async function callLLM(messages) {
  try {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry, I couldn’t generate a reply."
    );
  } catch (err) {
    console.error("Gemini API error:", err);
    return "⚠️ Error: Unable to reach Gemini API.";
  }
}
