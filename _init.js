let auth = new Map();
var fdb;

var commentsRef;
var notifsRef;

var commands;
var roomLink = "";

var initstate = [];

(async function () {
	console.log("Running Server...");
	var room = WLInit({
		token: window.WLTOKEN,
		roomName: "Liero-Builder [Beta] ᴰᴱᴰ",
		maxPlayers: 69,	
		public: CONFIG.public
	});

	room.setSettings({
		scoreLimit: 10,
		timeLimit: 10,
		gameMode: "dm",
		levelPool: "arenasBest",
		respawnDelay: 3,
		bonusDrops: "health",
		teamsLocked: false,
	});
	window.WLROOM = room;

	room.onRoomLink = (link) => { roomLink = link; initstate.push('roomlink: '+link); console.log(link)};
	room.onCaptcha = () => console.log("Invalid token");
})();

function printInitDone() {
    console.log(JSON.stringify(initstate))
}

function getPlayerIdFromAuth(a) {
    for (const [k,p] of auth) {
        if (p==a) {
            return k
        }
    }
    return null
}