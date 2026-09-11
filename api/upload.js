import { handleUpload } from "@vercel/blob/client"

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" })
		return
	}

	let body = req.body
	if (typeof body === "string") {
		try {
			body = JSON.parse(body)
		} catch (e) {
			body = {}
		}
	}

	let token = process.env.BLOB_READ_WRITE_TOKEN || ""
	try {
		const u = new URL(req.url, "http://localhost")
		const q = u.searchParams.get("token")
		if (q) token = q
	} catch (e) {}
	if (req.headers && req.headers["x-blob-token"]) {
		token = String(req.headers["x-blob-token"])
	}

	try {
		const result = await handleUpload({
			body,
			request: req,
			token: token || undefined,
			onBeforeGenerateToken: async () => ({
				access: "public",
				addRandomSuffix: true,
				allowedContentTypes: [
					"application/octet-stream",
					"application/x-itunes-ipa",
					"application/zip",
					"",
				],
				maximumSizeInBytes: 2 * 1024 * 1024 * 1024,
			}),
			onUploadCompleted: async () => {},
		})
		res.status(200).json(result)
	} catch (e) {
		res.status(400).json({ error: (e && e.message) || "upload failed" })
	}
}
