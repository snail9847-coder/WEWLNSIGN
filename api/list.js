import { list } from "@vercel/blob"

export default async function handler(req, res) {
	try {
		const { blobs } = await list({ prefix: "", limit: 100 })
		const items = (blobs || [])
			.filter((b) => /\.ipa$/i.test(b.pathname))
			.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
			.map((b) => ({
				name: b.pathname.split("/").pop(),
				url: b.url,
				size: b.size,
				uploadedAt: b.uploadedAt,
			}))
		res.setHeader("Cache-Control", "no-store")
		res.status(200).json({ items })
	} catch (e) {
		res.status(200).json({ items: [], error: (e && e.message) || "list failed" })
	}
}
