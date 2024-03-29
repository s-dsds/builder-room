window.WLROOM.onPlayerChat = function (p, m) {
	console.log(p.name+" "+m);
	writeLog(p,m);
}

window.WLROOM.onPlayerJoin = (player) => {
	if (admins.has(player.auth) ) {
		window.WLROOM.setPlayerAdmin(player.id, true);
	}
	auth.set(player.id, player.auth);
	writeLogins(player);

	//let bmod = mods.get("build");

	announce("Welcome to the Liero Builder room!", player, COLORS.ROOM_ANNOUNCE, "bold");	
    printCurrentMod('current fighting is ', player, COLORS.ANNOUNCE)
    //announce("current building mod is version `"+bmod.version+"`", player, COLORS.ANNOUNCE);
    announce("This is currently an early Beta version, so it might break, please tell dsds if you encounter any errors or if you have any comments", player, COLORS.ANNOUNCE, "small");

	if (isFight()) {
		announce("game is running in fighting mod", player, COLORS.ANNOUNCE_BRIGHT);
	} else if(isBuild()) {
		announce("game is running in build mod, you can join and help making this map!", player, COLORS.ANNOUNCE_BRIGHT);
	}
	
	announce("please join us on discord if you're not there yet! "+CONFIG.discord_invite, player, COLORS.ROOM_ANNOUNCE, "italic");
	if (player.auth){		
		auth.set(player.id, player.auth);
	}
    // if (!admins.has(player.auth) && window.WLROOM.getPlayerList().length==1) {
	// 	window.WLROOM.setPlayerAdmin(player.id, true);
    //     announce("enjoy admin command type !help for commands", player, COLORS.ANNOUNCE_BRIGHT, "bold");
	// }
}
