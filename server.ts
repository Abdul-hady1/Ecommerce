import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_STORES } from './src/data.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client loader
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Shopping Assistant Proxy API
app.post('/api/chat', async (req, res) => {
  try {
    const { storeId, messages, customProducts } = req.body;

    // Resolve active store configuration
    // Use customProducts if passed (user might have customized them in Studio), fallback to defaults
    const activeStore = DEFAULT_STORES.find(s => s.id === storeId);
    if (!activeStore) {
      return res.status(404).json({ error: `Store with ID '${storeId}' not found.` });
    }

    const storeProducts = customProducts || activeStore.products;

    // Build highly detailed inventory text for Gemini to know what exists in the active store
    const inventoryText = storeProducts
      .map((p: any) => {
        return `- ID: "${p.id}", Name: "${p.name}", Price: $${p.price}, Category: "${p.category}", Colors/Variants: ${JSON.stringify(
          p.colors
        )}, Sizes: ${JSON.stringify(p.sizes || [])}, Description: "${p.description}", Special Features: ${JSON.stringify(
          p.features || []
        )}`;
      })
      .join('\n');

    const systemInstruction = `You are a helpful and charismatic mobile AI shopping assistant for "${
      activeStore.name
    }" (${activeStore.tagline}).
Your goal is to guide the user in finding the best products, recommending specific collections or sizes, and checking out.

Here is the entire current active product inventory of the store:
${inventoryText}

RULES OF CONVERSATION:
1. Speak warmly and helper-like. Keep your responses engaging, helpful, and concise (under 3 sentences where possible).
2. If the user asks to add a specific item to their cart, or states they want to buy a product, try to identify the matching product ID from the inventory list.
3. If you suggest a specific action (like adding to cart, or opening a product's details), you should specify it in the "action" JSON field.
4. If a discount is discussed, you can apply a discount code. Valid discount codes: "RUNATHLETICS" (15% off for Aether), "NOVASOUND" ($20 off for Nova), "ARTIFACT" (10% off for Vellum).
5. ALWAYS yield your response strictly conforming to the requested JSON schema. Do not output anything other than JSON.`;

    // Map incoming messages to the SDK format
    // The @google/genai SDK chats or generateContent accepts standard structures: { role: 'user'|'model', parts: [{ text: string }] }
    // Let's map our format to parts structure
    const mappedContents = messages.map((m: any) => {
      // Mapping 'assistant' or 'model' properly
      const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: m.text }],
      };
    });

    try {
      const ai = getGeminiClient();
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: mappedContents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Your conversational reply text to the user.',
              },
              action: {
                type: Type.OBJECT,
                description: 'Optional physical UI action to trigger in the store app. Set to null if there is no matching trigger.',
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Event trigger. Must be either 'add_to_cart', 'view_product', 'apply_discount', or 'none'.",
                  },
                  productId: {
                    type: Type.STRING,
                    description: 'The exact ID of the inventory product (e.g. aether-1) matching the action.',
                  },
                  discountCode: {
                    type: Type.STRING,
                    description: 'The uppercase coupon code matching the discount.',
                  },
                },
              },
            },
            required: ['reply'],
          },
        },
      });

      const responseText = response.text || '{}';
      const parsedResult = JSON.parse(responseText.trim());
      return res.json(parsedResult);
    } catch (apiError: any) {
      console.warn('Gemini API call failed or is unconfigured. Falling back to rule-based assistant.', apiError.message);
      
      // Smart Rule-based Fallback for demo state when API is offline or key is missing
      const lastMessageText = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = `Welcome to the ${activeStore.name} assistant! I'm here in Demo Mode. (To experience smart generative recommendations, plug in your GEMINI_API_KEY in the Secrets panel)`;
      let action: any = null;

      // Simple keywords search helper for nice interactive demo
      const foundProduct = storeProducts.find((p: any) => 
        lastMessageText.includes(p.name.toLowerCase().split(' ')[0]) || 
        lastMessageText.includes(p.category.toLowerCase()) ||
        (p.features && p.features.some((f: string) => lastMessageText.includes(f.toLowerCase())))
      );

      if (lastMessageText.includes('add') || lastMessageText.includes('buy') || lastMessageText.includes('cart')) {
        if (foundProduct) {
          reply = `I've gone ahead and added the premium ${foundProduct.name} ($${foundProduct.price}) to your shopping cart! Let me know if you want to proceed to checkout!`;
          action = { type: 'add_to_cart', productId: foundProduct.id };
        } else {
          reply = "Which item would you like to add to your cart? I can help with footwear, accessories, or tech products on our active shelf.";
        }
      } else if (foundProduct) {
        reply = `You might really like the ${foundProduct.name}! It features: ${foundProduct.features?.[0] || 'high build standards'}. Let me load product details for you!`;
        action = { type: 'view_product', productId: foundProduct.id };
      } else if (lastMessageText.includes('discount') || lastMessageText.includes('coupon') || lastMessageText.includes('code')) {
        const code = storeId === 'aether' ? 'RUNATHLETICS' : storeId === 'nova' ? 'NOVASOUND' : 'ARTIFACT';
        reply = `Lucky you! You can apply the discount code "${code}" during checkout to unlock special store-wide savings of up to 15%!`;
        action = { type: 'apply_discount', discountCode: code };
      }

      return res.json({ reply, action });
    }
  } catch (err: any) {
    console.error('Server error inside /api/chat:', err);
    res.status(500).json({ reply: 'Sorry, I encountered an internal server error. Please try again.', error: err.message });
  }
});

// App environment configurations
app.get('/api/config', (req, res) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

// Serve frontend and integrate with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E-commerce developer server listening on http://localhost:${PORT}`);
  });
}

startServer();
