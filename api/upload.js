import { handleUpload } from "@vercel/blob/client"

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" })
		return
	}
	try {
		const body =
			typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}
		const jsonResponse = await handleUpload({
			body,
			request: req,
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
		res.status(200).json(jsonResponse)
	} catch (e) {
		res.status(400).json({ error: (e && e.message) || "Upload failed" })
	}
}
