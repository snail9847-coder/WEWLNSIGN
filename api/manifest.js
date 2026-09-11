export default function handler(req, res) {
	const ipa = String(req.query.ipa || "")
	const name = String(req.query.name || "App")
	const bundle = String(req.query.bundle || "com.wewlnsign.app")

	if (!/^https:\/\//i.test(ipa)) {
		res.status(400).send("IPA must be a direct https:// link")
		return
	}

	const esc = (s) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")

	const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${esc(ipa)}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${esc(bundle)}</string>
        <key>bundle-version</key>
        <string>1.0</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${esc(name)}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>
`

	res.setHeader("Content-Type", "application/xml; charset=utf-8")
	res.setHeader("Cache-Control", "no-store")
	res.status(200).send(plist)
}
