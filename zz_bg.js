initFirebase();
setBuildMod();
cleanMap();

window.WLROOM.onPlayerLeave = function(player) {  
	writeLogins(player, "logout");
	auth.delete(player.id);

	if (!hasActivePlayers()) {
		setBuildMod();
	}
}


window.WLROOM.onGameEnd = function() {		
    if (!hasActivePlayers()) {
		console.log("end no active player")
		setBuildMod();
	}
}

window.WLROOM.onGameEnd2 = function() {	
	// switch players here	
	reload();
}

function announce(msg, player, color, style) {
	window.WLROOM.sendAnnouncement(msg, player!=null?player.id:null, color!=null?color:0xb2f1d3, style !=null?style:"", 1);
}
function notifyAdmins(msg, logNotif = false) {
	getAdmins().forEach((a) => { window.WLROOM.sendAnnouncement(msg, a.id); });
	if (logNotif) {
		notifsRef.push({msg:msg, time:Date.now(), formatted:(new Date(Date.now()).toLocaleString())});
	}
}

function getAdmins() {
	return window.WLROOM.getPlayerList().filter((p) => p.admin);
}

function moveAllPlayersToSpectator() {
    for (let p of window.WLROOM.getPlayerList()) {
        window.WLROOM.setPlayerTeam(p.id, 0);
    }
}

function reload() {
	if (isBuild()) {
		setBuildMod();
		return;
	}
	setFight()
}

function setBuildMod() {
	console.log("set build");
	let bm = mods.get("build");
	if (typeof bm.json == "undefined") {
		console.log("oho");
	}
	loadMod(bm);
	var sett = window.WLROOM.getSettings();
	sett.timeLimit = 0;
	sett.scoreLimit = 0;
	window.WLROOM.setSettings(sett);
	currState=BUILDING_STATE;
	window.WLROOM.restartGame();
}

function setFight() {
	loadMod(getCurrentMod());
	var sett = window.WLROOM.getSettings();
	sett.timeLimit = 10;
	sett.scoreLimit = 15;
	window.WLROOM.setSettings(sett);
	currState=GAME_RUNNING_STATE;
	window.WLROOM.restartGame();
}