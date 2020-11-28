initFirebase();
loadSplash(); 

window.WLROOM.onPlayerJoin = (player) => {
	if (admins.has(player.auth) ) {
		window.WLROOM.setPlayerAdmin(player.id, true);
	}
	auth.set(player.id, player.auth);
	writeLogins(player);
	let mod = getCurrentMod();
	let bmod = mods.get("build");
	announce("Welcome to the 1v1 room!", player, 0xFF2222, "bold");
	announce("current fighting mod is `"+mod.name+"` version `"+mod.version+"` by `"+mod.author+"`", player, 0xDD2222);
	announce("current building mod is version `"+bmod.version+"`", player, 0xDD2222);

	if (isFight()) {
		announce("game is running in fighting mod", player, 0xDD2222);
	} else if(isBuild()) {
		announce("game is running in build mod, you can join and help making this map!", player, 0xDD2222);
	}
	
	announce("please join us on discord if you're not there yet! "+CONFIG.discord_invite, player, 0xDD00DD, "italic");
	if (player.auth){		
		auth.set(player.id, player.auth);
	}
}

window.WLROOM.onPlayerLeave = function(player) {  
	writeLogins(player, "logout");
	auth.delete(player.id);

	if (!hasActivePlayers()) {
	   setBuild();
	}
}


window.WLROOM.onPlayerChat = function (p, m) {
	console.log(p.name+" "+m);
	writeLog(p,m);
}


window.WLROOM.onGameEnd = function() {		
    if (!hasActivePlayers()) {
		console.log("end no active player")
		setBuild();
	}
}

window.WLROOM.onGameEnd2 = function() {	
	// switch players here	
	reload();
}

function announce(msg, player, color, style) {
	window.WLROOM.sendAnnouncement(msg, player.id, color!=null?color:0xb2f1d3, style !=null?style:"", 1);
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
		setBuild();
		return;
	}
	setFight()
}

function setBuild() {
	loadMod(mods.get("build"));
	var sett = window.WLROOM.getSettings();
	sett.timeLimit(0);
	sett.timeScoreLimit(0);
	window.WLROOM.loadSettings(sett);
	window.WLROOM.restartGame();
	currState=BUILDING_SATE;
}

function setFight() {
	loadMod(getCurrentMod());
	currState=BUILDING_SATE;
	var sett = window.WLROOM.getSettings();
	sett.timeLimit(10);
	sett.timeScoreLimit(15);
	window.WLROOM.loadSettings(sett);
	window.WLROOM.restartGame();
	currState=GAME_RUNNING_STATE;
}