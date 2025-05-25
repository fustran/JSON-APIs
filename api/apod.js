
export default async function handler(req, res) {
    try {
        // 1) Llamada a la API de la NASA
        const nasaRes = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=1`
        );
        if (!nasaRes.ok) {
            return res
                .status(nasaRes.status)
                .json({ error: `NASA API error ${nasaRes.status}` });
        }

        const dataArray = await nasaRes.json().then(data =>
            Array.isArray(data) ? data : [data]
        );
        const item = dataArray[0];

        // 2) Traducción a español
        let explanationEs = item.explanation;
        try {
            const trRes = await fetch(
                'https://translate.argosopentech.com/translate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        q: item.explanation,
                        source: 'en',
                        target: 'es',
                        format: 'text'
                    })
                }
            );
            if (trRes.ok) {
                const trJson = await trRes.json();
                explanationEs = trJson.translatedText;
            }
        } catch (_) {

        }

        // 3) Enviamos la respuesta y cachea en CDN
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
        return res.json({
            date: item.date,
            title: item.title,
            url: item.url,
            explanation: explanationEs,
            media_type: item.media_type
        });
    } catch (err) {
        console.error('API function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}