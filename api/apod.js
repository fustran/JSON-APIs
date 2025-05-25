
export default async function handler(req, res) {
    try {
        const nasaRes = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=18`
        );
        if (!nasaRes.ok) {
            return res
                .status(nasaRes.status)
                .json({ error: `NASA API error ${nasaRes.status}` });
        }
        const data = await nasaRes.json();
        const items = Array.isArray(data) ? data : [data];

        async function translate(text) {
            try {
                const trRes = await fetch(
                    'https://translate.argosopentech.com/translate',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            q: text,
                            source: 'en',
                            target: 'es',
                            format: 'text'
                        })
                    }
                );
                if (!trRes.ok) throw new Error(`Status ${trRes.status}`);
                const { translatedText } = await trRes.json();
                return translatedText;
            } catch {
                return text;
            }
        }

        const translatedItems = await Promise.all(
            items.map(async item => {
                const [titleEs, explanationEs] = await Promise.all([
                    translate(item.title),
                    translate(item.explanation)
                ]);
                return {
                    ...item,
                    title:       titleEs,
                    explanation: explanationEs
                };
            })
        );

        res.setHeader(
            'Cache-Control',
            's-maxage=86400, stale-while-revalidate'
        );

        return res.json(translatedItems);

    } catch (err) {
        console.error('api/apod error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}