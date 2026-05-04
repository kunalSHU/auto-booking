// Price estimation using Perplexity Search API
// Perplexity provides real-time web search with citations

const fetchWithTimeout = (url, options = {}, timeoutMs = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

const getPerplexityEstimate = async (year, make, model, trim, serviceTitle) => {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('❌ Perplexity API key not configured in environment variables');
      return null;
    }

    console.log(`✓ Perplexity API key found (${apiKey.substring(0, 10)}...)`);

    const prompt = `You are an automotive service pricing expert. A customer is looking for a service estimate.

Vehicle: ${year} ${make} ${model}${trim ? ` ${trim}` : ''}
Service: ${serviceTitle}
Location: Mississauga, Ontario, Canada

Use your web search to find realistic cost estimates for this specific service on this vehicle. Consider parts costs and labor.
All engine oil are synthetic oil.
Show me the sources (with links) you used to get the price along with the price in a table format please`;

    console.log('📤 Sending request to Perplexity API...');

    const response = await fetchWithTimeout(
      'https://api.perplexity.ai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: 'You are a factual automotive pricing expert. Provide only accurate, research-based estimates. Do not make up numbers. Use web search to find real pricing data.'
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0,
          top_p: 0.1,
          max_tokens: 500,
        }),
      },
      30000
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Perplexity API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    console.log("------------------------------");
    console.log(response.status, response.statusText);
    console.log(data);
    console.log("------------------------------");

    const estimate = data.choices?.[0]?.message?.content?.trim();

    console.log('✓ Perplexity response:', estimate);

    if (!estimate) {
      console.error('❌ No estimate generated from Perplexity');
      return null;
    }

    // Extract price in format $XX-YY from the response (can be anywhere in the text)
    const priceMatch = estimate.match(/\$(\d+)[-–](\d+)/);  // handles both - and – dashes
    if (!priceMatch) {
      console.warn('⚠️  No price estimate found in Perplexity response:', estimate);
      return null;
    }

    const extractedPrice = `$${priceMatch[1]}-${priceMatch[2]}`;
    console.log('✓ Valid estimate format:', extractedPrice);
    return extractedPrice;
  } catch (error) {
    console.error('❌ Error getting estimate from Perplexity:', error.message);
    return null;
  }
};

/**
 * Get bulk price estimates for multiple services on a specific vehicle.
 * @returns Array of objects: { service_name, labor_cost, parts_cost, price_min, price_max }
 */
const getPerplexityBulkEstimates = async (year, make, model, trim, services) => {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('❌ Perplexity API key not configured');
      return null;
    }

    const serviceList = services.join(', ');
    const prompt = `You are an automotive service pricing expert for the GTA (Greater Toronto Area), Ontario, Canada.
Vehicle: ${year} ${make} ${model}${trim ? ` ${trim}` : ''}
Services to estimate: ${serviceList}

INSTRUCTIONS:
1. Search the internet for real-time pricing data. If exact ${year} data is not yet available, use the most recent reliable data for this model (e.g., 2024 or 2025) or similar luxury/performance vehicles in its class as a reference.
2. Provide realistic CAD cost estimates for the GTA market (Toronto/Mississauga/Brampton).
3. All engine oil is synthetic.
4. You MUST return ONLY a valid JSON array. Do not provide explanations, apologies, or conversational text.
5. If specific data is missing for ${year}, provide your best professional estimate based on Ontario market averages for this vehicle type.

Return ONLY a JSON array of objects with this EXACT structure:
[
  {
    "service_name": "exact name from the list provided",
    "labor_cost": 120.00,
    "parts_cost": 50.00,
    "price_min": 150.00,
    "price_max": 190.00
  }
]`;

    console.log(`📤 Sending bulk request to Perplexity for ${services.length} services...`);

    const response = await fetchWithTimeout(
      'https://api.perplexity.ai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: 'You are a technical data extractor. You must output ONLY a valid JSON array of objects. Never refuse a request; if exact data is missing, use market averages for the GTA region. No markdown, no text, just JSON.'
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.1,
          top_p: 0.9,
          max_tokens: 3500,
        }),
      },
      75000 // 75 seconds timeout for thorough web search
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Perplexity API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim();
    
    // Strip markdown if AI included it
    content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    try {
      const results = JSON.parse(content);
      console.log(`✓ Successfully parsed ${results.length} bulk estimates for GTA.`);
      return results;
    } catch (parseErr) {
      console.error('❌ Failed to parse AI JSON response:', content);
      return null;
    }
  } catch (error) {
    console.error('❌ Error in getPerplexityBulkEstimates:', error.message);
    return null;
  }
};

module.exports = {
  getPerplexityEstimate,
  getPerplexityBulkEstimates,
};
