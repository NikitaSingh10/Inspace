import productModel from "../models/productModel.js";

export const recommendRoom = async (req, res) => {
  try {
    console.log("🔥 GEMINI ROUTE HIT");

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is missing in backend .env",
      });
    }

    // 🔥 Remove data:image/... prefix if frontend sends it
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    const payload = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: "Describe this room. Mention room type and dominant colors only.",
            },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({
        success: false,
        error: data.error?.message || "Gemini API error",
      });
    }

    const caption =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "";

    console.log("Caption:", caption);

    // -----------------------------
    // Detect room & color
    // -----------------------------
    let roomType = "";
    let color = "";

    if (caption.includes("living")) roomType = "Living Room";
    else if (caption.includes("bedroom")) roomType = "Bedroom";
    else if (caption.includes("office")) roomType = "Office";

    if (caption.includes("white")) color = "white";
    else if (caption.includes("brown") || caption.includes("wood"))
      color = "brown";
    else if (caption.includes("black")) color = "black";
    else if (caption.includes("grey") || caption.includes("gray"))
      color = "grey";

    // -----------------------------
    // Fetch products
    // -----------------------------
    let products = await productModel.find({});

    if (roomType) {
      products = products.filter(
        (p) => p.category?.toLowerCase() === roomType.toLowerCase()
      );
    }

    if (color) {
      products = products.filter((p) =>
        p.colorOptions?.some(
          (c) => c.toLowerCase() === color
        )
      );
    }

    return res.json({
      success: true,
      caption,
      roomType,
      color,
      recommendations: products.slice(0, 5),
    });

  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gemini request failed",
    });
  }
};