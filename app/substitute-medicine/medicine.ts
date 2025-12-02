import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { z } from "zod";
import * as cheerio from "cheerio";

const llm = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.2,
    maxTokens: 1000
});

// ============================================================================
// APPROACH 1: Web Scraping (Most Accurate)
// ============================================================================
const getMedicinesWithScraping = tool(
    async ({ name }) => {
        try {
            const searchUrl = `https://www.1mg.com/search/all?name=${encodeURIComponent(name)}`;
            
            const response = await fetch(searchUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Cache-Control": "max-age=0"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            
            const medicines: Array<{
                name: string;
                price: string;
                mrp: string;
                priceRange: string;
                manufacturer: string;
                packSize: string;
                rating: string;
                source: string;
            }> = [];
            
            // Parse the medicine cards from 1mg search results
            $('.style__product-card___1gbex, .style__container___cTDz0').each(function(this: cheerio.Element, index: number) {
                if (index >= 5) return false; // Limit to 5 results
                
                const $element = $(this);
                
                const name = $element.find('.style__pro-title___3zxNC, .style__product-description___1UMxv a').first().text().trim();
                const priceText = $element.find('.style__price-tag___B2csA, .style__discount-price___qs09C').first().text().trim();
                const mrpText = $element.find('.style__striked-price___2IIo1, .style__crossed-price___xyYEe').first().text().trim();
                const manufacturer = $element.find('.style__manufacturer___eTAab, .style__brand___2kxLK').first().text().trim();
                const packSize = $element.find('.style__pack-size___254Cd, .style__pack___2gqsN').first().text().trim();
                const rating = $element.find('.style__star-rating___2W-Hm span, [class*="rating"]').first().text().trim();
                
                // Extract numeric price
                const price = priceText.replace(/[^0-9.]/g, '') || "N/A";
                const mrp = mrpText.replace(/[^0-9.]/g, '') || price;
                
                if (name) {
                    medicines.push({
                        name: name,
                        price: price !== "N/A" ? `₹${price}` : "N/A",
                        mrp: mrp !== "N/A" ? `₹${mrp}` : "N/A",
                        priceRange: price !== "N/A" ? `₹${Math.max(0, parseFloat(price) - 20)}-${parseFloat(price) + 20}` : "N/A",
                        manufacturer: manufacturer || "N/A",
                        packSize: packSize || "N/A",
                        rating: rating || "N/A",
                        source: "1mg.com"
                    });
                }
            });

            if (medicines.length === 0) {
                return JSON.stringify([{
                    error: "No medicines found",
                    suggestion: "Try searching with generic name or check spelling"
                }]);
            }

            return JSON.stringify(medicines);
            
        } catch (error) {
            console.error("Scraping error:", error);
            return JSON.stringify([{
                error: "Failed to fetch medicine data",
                details: error instanceof Error ? error.message : "Unknown error"
            }]);
        }
    },
    {
        name: "search_medicine_price",
        description: "Search for Indian medicine prices by scraping 1mg.com for accurate real-time pricing",
        schema: z.object({
            name: z.string().describe("Medicine name to search for (generic or brand name)"),
        }),
    }
);

// ============================================================================
// APPROACH 2: Multi-Source API Aggregation
// ============================================================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMedicinesMultiSource = tool(
    async ({ name }) => {
        interface Medicine {
            name: string;
            price: string | number;
            mrp: string | number;
            manufacturer?: string;
            packSize?: string;
            rating?: string | number;
            source: string;
            discount?: string;
        }
        const medicines: Medicine[] = [];
        
        // Source 1: Try 1mg API
        try {
            const url1mg = `https://www.1mg.com/api/drug_skus/by_name?name=${encodeURIComponent(name)}&page=1&per_page=10`;
            const response1mg = await fetch(url1mg, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "application/json",
                    "Referer": "https://www.1mg.com/"
                }
            });

            if (response1mg.ok) {
                const data = await response1mg.json();
                const skus = data.data?.skus || [];
                
                skus.slice(0, 5).forEach((item: Record<string, unknown>) => {
                    medicines.push({
                        name: String(item.name),
                        price: ((item.price as Record<string, unknown>)?.discount_price || (item.price as Record<string, unknown>)?.mrp || "N/A") as string | number,
                        mrp: ((item.price as Record<string, unknown>)?.mrp || "N/A") as string | number,
                        manufacturer: String(item.manufacturer_name || "N/A"),
                        packSize: String(item.pack_size_label || "N/A"),
                        rating: String(item.rating || "N/A"),
                        source: "1mg API"
                    });
                });
            }
        } catch (e) {
            console.log("1mg API failed, trying scraping...", e);
        }

        // Source 2: Fallback to scraping if API fails
        if (medicines.length === 0) {
            try {
                const scrapingResult = await getMedicinesWithScraping.invoke({ name });
                return scrapingResult;
            } catch (e) {
                console.log("Scraping also failed", e);
            }
        }

        // Source 3: PharmEasy fallback
        if (medicines.length === 0) {
            try {
                const urlPharmEasy = `https://pharmeasy.in/api/otc/search?query=${encodeURIComponent(name)}`;
                const responsePharmEasy = await fetch(urlPharmEasy, {
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "application/json"
                    }
                });

                if (responsePharmEasy.ok) {
                    const data = await responsePharmEasy.json();
                    const products = data.data?.products || [];
                    
                    products.slice(0, 5).forEach((item: Record<string, unknown>) => {
                        medicines.push({
                            name: String(item.name),
                            price: String(item.selling_price || "N/A"),
                            mrp: String(item.mrp || "N/A"),
                            manufacturer: String(item.manufacturer || "N/A"),
                            packSize: String(item.pack_size || "N/A"),
                            rating: String(item.rating || "N/A"),
                            discount: item.discount_percentage ? `${item.discount_percentage}%` : "N/A",
                            source: "PharmEasy"
                        });
                    });
                }
            } catch (e) {
                console.log("PharmEasy failed", e);
            }
        }

        if (medicines.length === 0) {
            return JSON.stringify([{
                error: "Unable to fetch medicine data from any source",
                suggestion: "Please try with a different medicine name or check manually on 1mg.com or PharmEasy.in"
            }]);
        }

        return JSON.stringify(medicines);
    },
    {
        name: "search_medicine_price_multi",
        description: "Search medicine prices across multiple Indian pharmacy sources (1mg, PharmEasy)",
        schema: z.object({
            name: z.string().describe("Medicine name to search"),
        }),
    }
);

// ============================================================================
// APPROACH 3: With Puppeteer (Uncomment if you want to use headless browser)
// ============================================================================
/*
// Install: npm install puppeteer
import puppeteer from 'puppeteer';

const getMedicinesWithPuppeteer = tool(
    async ({ name }) => {
        let browser;
        try {
            browser = await puppeteer.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            
            await page.goto(`https://www.1mg.com/search/all?name=${encodeURIComponent(name)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for results to load
            await page.waitForSelector('.style__product-card___1gbex', { timeout: 10000 });

            const medicines = await page.evaluate(() => {
                const items = document.querySelectorAll('.style__product-card___1gbex');
                return Array.from(items).slice(0, 5).map(item => {
                    const name = item.querySelector('.style__pro-title___3zxNC')?.textContent?.trim() || 'N/A';
                    const price = item.querySelector('.style__price-tag___B2csA')?.textContent?.trim() || 'N/A';
                    const mrp = item.querySelector('.style__striked-price___2IIo1')?.textContent?.trim() || 'N/A';
                    const manufacturer = item.querySelector('.style__manufacturer___eTAab')?.textContent?.trim() || 'N/A';
                    const packSize = item.querySelector('.style__pack-size___254Cd')?.textContent?.trim() || 'N/A';
                    const rating = item.querySelector('.style__star-rating___2W-Hm span')?.textContent?.trim() || 'N/A';
                    
                    return { name, price, mrp, manufacturer, packSize, rating, source: '1mg.com (Puppeteer)' };
                });
            });

            await browser.close();
            return JSON.stringify(medicines);
            
        } catch (error) {
            if (browser) await browser.close();
            return JSON.stringify([{
                error: "Puppeteer scraping failed",
                details: error instanceof Error ? error.message : "Unknown error"
            }]);
        }
    },
    {
        name: "search_medicine_price_puppeteer",
        description: "Search medicine prices using headless browser for maximum accuracy",
        schema: z.object({
            name: z.string(),
        }),
    }
);
*/

// ============================================================================
// AGENT CONFIGURATION
// ============================================================================

export const medicineAgent = createAgent({
    model: llm,
    tools: [getMedicinesWithScraping], // Change to getMedicinesMultiSource for multi-source
    systemPrompt: `
You are an expert Indian pharmacist AI assistant with access to real-time medicine pricing data from Indian online pharmacies.

YOUR WORKFLOW:
1. **ALWAYS** call the search_medicine_price tool FIRST with the medicine name provided by the user
2. **WAIT** for the tool results before generating any response
3. **ANALYZE** the returned data carefully
4. **GENERATE** a comprehensive response based on the actual data received

OUTPUT FORMAT:
Provide the following information in a well-structured format:

**Medicine Overview:**
- Generic name and use-case
- Common indications
- Typical dosage forms

**Available Alternatives (from search results):**

| Medicine Name | Pack Size | Current Price | Price Range | Source |
|---------------|-----------|---------------:|-------------|--------:|
| [Fill from actual tool data] | | | | |

**Important Information:**
- List 2-3 common side effects for each medicine category
- Mention any important precautions
- Add disclaimer: "Prices may vary by ±10-20 INR based on location, pharmacy, and current offers. Always consult a healthcare professional before taking any medication."

CRITICAL RULES:
- ✅ DO call the tool and wait for results
- ✅ DO use ONLY the data returned by the tool
- ✅ DO format prices clearly with ₹ symbol
- ✅ DO provide accurate manufacturer names from tool data
- ✅ DO mention the source (1mg.com, PharmEasy, etc.)
- ❌ DON'T make up or hallucinate any prices
- ❌ DON'T invent medicine names not in the tool results
- ❌ DON'T use old/cached information
- ❌ DON'T proceed without tool results

If the tool returns an error:
1. Acknowledge the error to the user
2. Suggest alternative search terms (generic name vs brand name)
3. Recommend visiting 1mg.com or PharmEasy.in directly
4. Do NOT provide made-up pricing information

Remember: Patient safety and accurate information are paramount. When in doubt, direct users to consult healthcare professionals.
`,
    name: "medicine-alternative-prescriber",
    description: "Provides Indian medicine alternatives with accurate real-time pricing from online pharmacies",
}) as ReturnType<typeof createAgent>;

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

export async function searchMedicine(medicineName: string) {
    try {
        console.log(`Searching for: ${medicineName}`);
        
        const result = await medicineAgent.invoke({
            messages: [
                {
                    role: "user",
                    content: `Find alternatives and pricing for ${medicineName}`
                }
            ]
        });

        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Example usage:
// searchMedicine("paracetamol").then(result => console.log(result));
// searchMedicine("metformin 500mg").then(result => console.log(result));
// searchMedicine("azithromycin").then(result => console.log(result));
