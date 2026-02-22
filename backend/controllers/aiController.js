import productModel from "../models/productModel.js";
import { COLOR_MAP, COMPLEMENTARY_MAP } from "../utils/colorTags.js";

function normalizeColors(caption) {
  const lower = caption.toLowerCase();
  const found = new Set();
  for (const [keyword, tag] of Object.entries(COLOR_MAP)) {
    if (lower.includes(keyword)) found.add(tag);
  }
  return [...found];
}

/** For room accent colors, get all product color tags that would look good (complementary/harmonious). */
function getRecommendedProductColors(roomAccentColors) {
  const set = new Set();
  for (const roomColor of roomAccentColors) {
    const recommended = COMPLEMENTARY_MAP[roomColor];
    if (recommended) recommended.forEach((c) => set.add(c));
  }
  return set;
}

function extractRoomType(caption) {
  const lower = caption.toLowerCase();
  if (lower.includes("living")) return "LIVING ROOM";
  if (lower.includes("bedroom")) return "BEDROOM";
  if (lower.includes("office") || lower.includes("study")) return "OFFICE";
  if (lower.includes("dining")) return "DINING";
  if (lower.includes("bathroom")) return "BATHROOM";
  if (lower.includes("kitchen")) return "KITCHEN";
  return "";
}

export const recommendRoom = async (req, res) => {
  try {
    console.log("Gemini route hit");

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

    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    const prompt = `Look at this room image and reply in this exact format:

ROOM: [one of: living room, bedroom, office, dining, kitchen, bathroom, or "room"]
COLORS: [list 3 to 6 dominant or accent colors, comma-separated, e.g. white, light wood, green, grey]
FIT: [list 1 to 3 product types that would fit this room best or that the room is missing. Use ONLY these exact codes, comma-separated:
Categories: LIGHTING, WALLDECOR, PLANTSANDVASES, HOMEACCESSORIES
Sub-categories: TABLELAMPS, FLOORLAMPS, PAINTINGS, MIRROR, PLANTS, CLOCK, SCULPTURE
Examples: LIGHTING,TABLELAMPS or WALLDECOR,PAINTINGS,MIRROR. Pick what would improve the room most.]

Describe the room type, main/accent colors, and which product types would be the best fit or what the room is missing. Keep colors to simple names (white, grey, brown, wood, green, blue, gold, etc.).`;

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
            { text: prompt },
          ],
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    console.log("Caption:", rawText);

    const roomType = extractRoomType(rawText);
    let accentColors = [];
    const colorsLine = rawText.match(/COLORS?\s*:\s*([^\n]+)/i);
    if (colorsLine) {
      accentColors = colorsLine[1]
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean)
        .map((c) => COLOR_MAP[c.trim().toLowerCase()] || c.replace(/\s+/g, "").toLowerCase())
        .filter(Boolean);
      accentColors = [...new Set(accentColors)];
    }
    if (accentColors.length === 0) accentColors = normalizeColors(rawText);

    const validFitCodes = new Set([
      "LIGHTING", "WALLDECOR", "PLANTSANDVASES", "HOMEACCESSORIES",
      "TABLELAMPS", "FLOORLAMPS", "PAINTINGS", "MIRROR", "PLANTS", "CLOCK", "SCULPTURE",
    ]);
    let fitCodes = new Set();
    const fitLine = rawText.match(/FIT\s*:\s*([^\n]+)/i);
    if (fitLine) {
      fitLine[1]
        .split(",")
        .map((c) => c.trim().toUpperCase().replace(/\s/g, ""))
        .filter(Boolean)
        .forEach((c) => {
          if (validFitCodes.has(c)) fitCodes.add(c);
        });
    }

    let products = await productModel.find({});

    products = products.filter((p) => (p.colorTags || []).length > 0);

    const recommendedProductColors = getRecommendedProductColors(accentColors);

    // Score: color fit +3 per complementary tag; +2 if category/subcategory is in FIT (what room needs); +1 room-type match
    const scored = products.map((p) => {
      const tags = (p.colorTags || []).map((t) => t.toLowerCase().trim());
      let complementaryCount = 0;
      for (const tag of tags) {
        if (recommendedProductColors.has(tag)) complementaryCount += 1;
      }
      const colorScore = complementaryCount * 3;
      let fitBonus = 0;
      const catNorm = (p.category || "").toUpperCase().replace(/\s/g, "");
      const subNorm = (p.subcategory || "").toUpperCase().replace(/\s/g, "");
      if (fitCodes.has(catNorm) || fitCodes.has(subNorm)) fitBonus = 2;
      let categoryMatch = 0;
      if (roomType && p.category) {
        const roomNorm = roomType.replace(/\s/g, "");
        if (catNorm.includes(roomNorm) || roomNorm.includes(catNorm)) categoryMatch = 1;
      }
      const score = colorScore + fitBonus + categoryMatch;
      return { product: p, score, complementaryCount, categoryMatch, fitBonus };
    });

    const aboveThreshold = scored.filter((s) => s.complementaryCount >= 1);
    aboveThreshold.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.complementaryCount !== a.complementaryCount) return b.complementaryCount - a.complementaryCount;
      if (b.fitBonus !== a.fitBonus) return b.fitBonus - a.fitBonus;
      return b.categoryMatch - a.categoryMatch;
    });
    const recommendations = aboveThreshold.slice(0, 5).map((s) => s.product);

    return res.json({
      success: true,
      caption: rawText,
      roomType: roomType || null,
      accentColors,
      fitCategories: fitCodes.size ? [...fitCodes] : null,
      recommendations,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gemini request failed",
    });
  }
};
