import { list } from "@vercel/blob"

export default async function handler(req, res) {
	res.setHeader("Cache-Control", "no-store")

	let token = process.env.BLOB_READ_WRITE_TOKEN || ""
	try {
		const u = new URL(req.url, "http://localhost")
		const q = u.searchParams.get("token")
		if (q) token = q
	} catch (e) {}

	try {
		const opts = { prefix: "", limit: 100 }
		if (token) opts.token = token
		const { blobs } = await list(opts)
		const items = (blobs || [])
			.filter((b) => /\.ipa$/i.test(b.pathname || ""))
			.map((b) => ({
				name: b.pathname,
				url: b.url,
				size: b.size,
				uploadedAt: b.uploadedAt,
			}))
			.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
		res.status(200).json({ items })
	} catch (e) {
		res.status(200).json({ items: [], error: (e && e.message) || "list failed" })
	}
}
