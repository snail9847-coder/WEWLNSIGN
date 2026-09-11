// OTA-манифест для itms-services://
// iOS скачивает этот plist и показывает системное уведомление «Установить «Name»?»
function esc(s) {
	return String(s || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

export default function handler(req, res) {
	const url = new URL(req.url, "https://" + (req.headers.host || "localhost"))
	const ipa = url.searchParams.get("ipa") || ""
	const name = url.searchParams.get("name") || "App"
	const bundle = url.searchParams.get("bundle") || "com.wewlnsign.app"
	const version = url.searchParams.get("version") || "1.0"

	if (!/^https:\/\//i.test(ipa)) {
		res.statusCode = 400
		res.setHeader("Content-Type", "text/plain; charset=utf-8")
		res.end("IPA must be a direct https:// link")
		return
	}

	const plist =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
		'<plist version="1.0">\n' +
		"<dict>\n" +
		"\t<key>items</key>\n" +
		"\t<array>\n" +
		"\t\t<dict>\n" +
		"\t\t\t<key>assets</key>\n" +
		"\t\t\t<array>\n" +
		"\t\t\t\t<dict>\n" +
		"\t\t\t\t\t<key>kind</key>\n" +
		"\t\t\t\t\t<string>software-package</string>\n" +
		"\t\t\t\t\t<key>url</key>\n" +
		"\t\t\t\t\t<string>" + esc(ipa) + "</string>\n" +
		"\t\t\t\t</dict>\n" +
		"\t\t\t</array>\n" +
		"\t\t\t<key>metadata</key>\n" +
		"\t\t\t<dict>\n" +
		"\t\t\t\t<key>bundle-identifier</key>\n" +
		"\t\t\t\t<string>" + esc(bundle) + "</string>\n" +
		"\t\t\t\t<key>bundle-version</key>\n" +
		"\t\t\t\t<string>" + esc(version) + "</string>\n" +
		"\t\t\t\t<key>kind</key>\n" +
		"\t\t\t\t<string>software</string>\n" +
		"\t\t\t\t<key>title</key>\n" +
		"\t\t\t\t<string>" + esc(name) + "</string>\n" +
		"\t\t\t</dict>\n" +
		"\t\t</dict>\n" +
		"\t</array>\n" +
		"</dict>\n" +
		"</plist>\n"

	res.statusCode = 200
	res.setHeader("Content-Type", "application/xml; charset=utf-8")
	res.setHeader("Cache-Control", "no-store")
	res.end(plist)
}
