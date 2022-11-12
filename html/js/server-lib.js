let FAKE_ERROR = false

function helloServer() {
	console.log("[ServerTalk] Requesting status.")
	return new Promise(resolve => {
		setTimeout(() => {
			if(FAKE_ERROR) {
				resolve("error")
				console.log("[ServerTalk] Server error.")
			} else {
				resolve("ok")
				console.log("[ServerTalk] Server is online.")
			}
		}, 500)
	})
}

console.log("[ServerTalk] Ready!")