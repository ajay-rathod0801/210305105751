const express = require('express');
const axios = require('axios');
const app = express();

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    const promises = urls.map(fetchNos);
    try {
        const results = await Promise.all(promises);
        const mergedNos = results.reduce((merged, data) => {
            if (data && data.numbers) {
                merged.push(...data.numbers);
            }
            return merged;
        }, []);
        const uniqueNos = Array.from(new Set(mergedNos)).sort((a, b) => a - b);
        res.json({ numbers: uniqueNos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function fetchNos(url) {
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data;
    } catch (error) {
        return [];
    }
}

app.listen(3000, () => console.log('Server running on port 3000'));