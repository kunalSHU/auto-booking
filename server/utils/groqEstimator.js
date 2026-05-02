// Price estimation using Groq API
// Groq provides fast LLM inference for web searches and estimates

const fetchWithTimeout = (url, options = {}, timeoutMs = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

const getGroqEstimate = async (year, make, model, trim, serviceTitle) => {
  try {
    const apiKey = process.env.groq_api_key;
    if (!apiKey) {
      console.error('❌ Groq API key not configured in environment variables');
      return null;
    }

    console.log(`✓ Groq API key found (${apiKey.substring(0, 10)}...)`);

    const prompt = `You are an automotive service pricing expert. A customer is looking for a service estimate.

Vehicle: ${year} ${make} ${model}${trim ? ` ${trim}` : ''}
Service: ${serviceTitle}
Location: Mississauga, Ontario, Canada

Search the internet and provide a realistic cost estimate for this specific service on this vehicle. Consider parts costs and labor.
All engine oil are synthetic oil.
Show me the sources (with links) you used to get the price along with the price in a table format please`;

    console.log('📤 Sending request to Groq API...');

    const response = await fetchWithTimeout(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a factual automotive pricing expert. Provide only accurate, research-based estimates. Do not make up numbers.'
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
      console.error('❌ Groq API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    console.log("------------------------------");
    console.log(response.status, response.statusText);
    console.log(data);
    console.log("------------------------------");

    const estimate = data.choices?.[0]?.message?.content?.trim();

    console.log('✓ Groq response:', estimate);

    if (!estimate) {
      console.error('❌ No estimate generated from Groq');
      return null;
    }

    // Extract price in format $XX-YY from the response (can be anywhere in the text)
    const priceMatch = estimate.match(/\$(\d+)[-–](\d+)/);  // handles both - and – dashes
    if (!priceMatch) {
      console.warn('⚠️  No price estimate found in Groq response:', estimate);
      return null;
    }

    const extractedPrice = `$${priceMatch[1]}-${priceMatch[2]}`;
    console.log('✓ Valid estimate format:', extractedPrice);
    return extractedPrice;
  } catch (error) {
    console.error('❌ Error getting estimate from Groq:', error.message);
    return null;
  }
};

module.exports = {
  getGroqEstimate,
};
