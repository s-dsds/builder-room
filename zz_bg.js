initFirebase();


window.WLROOM.onPlayerLeave = function(player) {  
	writeLogins(player, "logout");
	auth.delete(player.id);

	if (!hasActivePlayers()) {
		setFight();
	}
}


window.WLROOM.onGameEnd = function() {		
    if (!hasActivePlayers()) {
		console.log("end no active player")
		setFight();
	}
}

window.WLROOM.onGameEnd2 = function() {	
	// switch players here	
	reload();
}

// undo history 
UNDO_HISTORY.init(window.WLROOM, {});
//

function announce(msg, player, color, style) {
	window.WLROOM.sendAnnouncement(msg, player!=null?player.id:null, color!=null?color:COLORS.NORMAL, style !=null?style:"", 1);
}
function notifyAdmins(msg, logNotif = false) {
	getAdmins().forEach((a) => { window.WLROOM.sendAnnouncement(">>"+msg+"<<", a.id, COLORS.PRIVATE, "bold"); });
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
    (async () => {
        if (isPalette()) {
            var undo = UNDO_HISTORY.getStep(1);
            if (undo != null) {              
                loadLev(undo.level);                
            }
        }
        let mod = await builderfactory.getMod();
        window.WLROOM.loadMod(mod.zip);
        var sett = window.WLROOM.getSettings();
        sett.timeLimit = 0;
        sett.scoreLimit = 999;
        sett.bonusDrops = 'none'
        window.WLROOM.setSettings(sett);
        currState=BUILDING_STATE;
        votes.reset();
        window.WLROOM.restartGame();
    })()
}

function setPalettedMod() {
	console.log("set palette");
    (async () => {        
        if (isBuild()) {
            UNDO_HISTORY.pushStep();
        }        
        let mod = await builderfactory.getMod();
        window.WLROOM.loadMod(mod.zip);
        var sett = window.WLROOM.getSettings();
        sett.timeLimit = 0;
        sett.scoreLimit = 999;
        sett.bonusDrops = 'none'
        window.WLROOM.setSettings(sett);
        currState=PALETTE_STATE;
        votes.reset();
        loadMapByName("bg/palette.png");
    })()
}

function setFight() {
	if (randomizeFightMod) {
		setNextRandomMod();
	}
    (async () => {
        await loadMod(getCurrentMod());
        printCurrentMod('current mod is ',null,COLORS.ANNOUNCE_BRIGHT);
        var sett = window.WLROOM.getSettings();
        sett.timeLimit = 10;
        sett.scoreLimit = 15;
        window.WLROOM.setSettings(sett);
        currState=GAME_RUNNING_STATE;
        votes.reset();
        window.WLROOM.restartGame();
    })()
}