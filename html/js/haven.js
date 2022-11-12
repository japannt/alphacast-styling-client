/* CLIENT STUFF */

let guest = true

$("#globalBanner").on("click", function() { bannerText('') })

$("input").on("click", function() {
	if($(this).hasClass("invalid")) {
		$(this).removeClass("invalid")
		$(this).select()
	}
})

function bannerText(text) {
	$("#globalBanner").innerHTML = text
}

async function clientSleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/* CLIENT <-> SERVER STUFF */

async function tryHelloServer() {
	while (true) {
		console.log("[ClientUI] Hello Server?")
		const result = await helloServer()
		if (result == "error") {
			console.log("[ClientUI] Server error, trying again in 5 seconds.")
			bannerText("Instance seems to be offline. Try again later, or switch to a different instance.")
			await clientSleep(5000)
		} else if (result == "ok") {
			console.log("[ClientUI] Got OK.")
			bannerText("")

			$("#player-window").removeClass("hidden")
			$("#loading-window").css("animation", "window-hide 0.25s ease-out forwards")
			await clientSleep(250)
			$("#loading-window").addClass("hidden")
			break
		} else {
			console.log("[ClientUI] Weird server error, ABORTING.")
			bannerText("Instance seems to be in big trouble. Try again in the later future, or switch to a different instance.")
			break
		}
	}
}

/* SETTINGS HANDLING */

$(".settings-menu-button").on("click", async function() {
	$("#settings-window").removeClass("hidden")
	$("#settings-window").css("animation", "window-show 0.25s ease-out forwards")

	$("#settings-tabs").children().each(function() {
		if($(this).html() == "Account" && guest) {
			$(this).addClass("hidden")
		} else {
			$(this).removeClass("hidden")
		}
	})
})



function loadSettings() {
	if(localStorage.getItem("bgurl") != null) {
		$("body").css("background-image", "url(" + localStorage.getItem("bgurl") + ")")
		$("#settings-appearance-bgurl").val(localStorage.getItem("bgurl"))
	}
	
	$("body").css("backdrop-filter", "blur(" + localStorage.getItem("bgblur") + "px)")
	$("#settings-appearance-bgblur").val(localStorage.getItem("bgblur"))
}

$("#settings-save").on("click", async function() {
	// CUSTOMISATION SETTINGS

	if($("#settings-appearance-bgurl").val() != "") {
		if(isValidHttpUrl($("#settings-appearance-bgurl").val())) {
			localStorage.setItem("bgurl", $("#settings-appearance-bgurl").val())
			$("body").css("background-image", "url(" + $("#settings-appearance-bgurl").val() + ")")
		} else {
			$("#settings-appearance-bgurl").addClass("invalid")
			return
		}
	} else {
		localStorage.removeItem("bgurl")
		$("body").css("background-image", "url(./assets/generic.png)")
	}

	localStorage.setItem("bgblur", $("#settings-appearance-bgblur").val())
	$("body").css("backdrop-filter", "blur(" + $("#settings-appearance-bgblur").val() + "px)")

	$("#settings-window").css("animation", "window-hide 0.25s ease-out forwards")
	await clientSleep(250)
	$("#settings-window").addClass("hidden")
})

$(".settings-tab-button").on("click", function(e) {
	if($(e.target).html().toLowerCase() != null) {
		let tab = $(e.target)
		let tabs = $(".settings-tab")
		
		let tabId = "settings-tab-" + tab.html().toLowerCase()

		tabs.each(function() {
			if($(this).attr("id") == tabId) {
				$(this).removeClass("hidden")
			} else {
				$(this).addClass("hidden")
			}
		})
	}
})

/* CLICK HANDLERS */

$(".popup-window").on("click", async function(e) {
	if ($(e.target).parent().hasClass("popup-window")) {
		$(this).css("animation", "window-hide 0.25s ease-out forwards")
		await clientSleep(250)
		$(this).addClass("hidden")
	}
})

$("#welcome-guest-mode").on("click", async function() {
	console.log("[ClientUI] Skipping login.")
	$("#welcome-window").css("animation", "window-hide 0.25s ease-out forwards")

	$("#loading-window").removeClass("hidden")
	$("#loading-window").css("animation", "window-show 0.25s ease-out forwards")

	await clientSleep(250)

	$("#welcome-window").addClass("hidden")

	guest = true

	tryHelloServer()
})

$("#welcome-login-box").on("click", async function() {	
	$("#welcome-intro").css("animation", "blur-inactive 0.25s ease forwards")
	
	$("#welcome-login-window").removeClass("hidden")
	$("#welcome-login-window").css("animation", "window-show 0.25s ease-out forwards")
	
})

console.log("[ClientUI] Loading user settings...")
loadSettings()

console.log("[ClientUI] Ready!")