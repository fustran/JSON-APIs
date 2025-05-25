
export default async function handler(req, res) {
    try {
        const nasaRes = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&count=1`
        );
        if (!nasaRes.ok) {
            return res
                .status(nasaRes.status)
                .json({ error: `NASA API error ${nasaRes.status}` });
        }
        const data = await nasaRes.json();
        const item = Array.isArray(data) ? data[0] : data;

        res.setHeader(
            'Cache-Control',
            's-maxage=86400, stale-while-revalidate'
        );

        return res.json({
            date:        item.date,
            title:       titleEs,
            url:         item.url,
            explanation: explanationEs,
            media_type:  item.media_type
        });
    } catch (err) {
        console.error('api/apod error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}