var fdb;
var commentsRef;
var notifsRef;
var loginsRef;
var statsRef;
var adminsRef;
var admins = new Map();

function initFirebase() {
    async function load_scripts(script_urls) {
        function load(script_url) {
            return new Promise(function(resolve, reject) {
                if (load_scripts.loaded.has(script_url)) {
                    resolve();
                } else {
                    var script = document.createElement('script');
                    script.onload = resolve;
                    script.src = script_url
                    document.head.appendChild(script);
                }
            });
        }
        var promises = [];
        for (const script_url of script_urls) {
            promises.push(load(script_url));
        }
        await Promise.all(promises);
        for (const script_url of script_urls) {
            load_scripts.loaded.add(script_url);
        }
    }
    load_scripts.loaded = new Set();

    (async () => {
		await load_scripts([
			'https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js',
			'https://www.gstatic.com/firebasejs/7.20.0/firebase-database.js',
		]);
		
		firebase.initializeApp(CONFIG.firebase);
		fdb = firebase.database();
		commentsRef = fdb.ref('bg/comments');
        notifsRef = fdb.ref('bg/notifs');

        loginsRef = fdb.ref('bg/logins');

        adminsRef = fdb.ref(`bg/admins`);

        listenForAdminsEvents();

		console.log('firebase ok');        
        initstate.push('firebase ok')
	})();		
}

function writeLogins(p, type ="login") {
    const now = Date.now();
    loginsRef.child(now).set({name: p.name, auth:auth.get(p.id), type:type, formatted:(new Date(now).toLocaleString())});
}

function writeLog(p, msg) {
    const now = Date.now();
    commentsRef.child(now).set({name: p.name, auth:auth.get(p.id), msg:msg, formatted:(new Date(now).toLocaleString())});
}

function writeGameStats(event, stats) {
  const now = Date.now();
  statsRef.child(now).set({event: event, stats:stats});
}

function listenForAdminsEvents() {
    adminsRef.on('child_added', loadnewAdmin);
    adminsRef.on('child_changed', loadnewAdmin);
}

function loadnewAdmin(childSnapshot) {
	var v = childSnapshot.val();
	var k = childSnapshot.key;

  loadAdmin(k,v);
  
  console.log("admin `"+k+"`: `"+v.name+"` has been added to memory");
  notifyAdmins("admin `"+k+"`: `"+v.name+"` has been added to memory");
}

function loadAdmin(id, json) {
    admins.set(id, {
        auth: id,
        name: json.name,
        super: typeof json.super != 'undefined' && json.super
    } );
}

function isSuperAdmin(player) {
    let a = auth.get(player.id)
    let p = admins.get(a)
    return p && p.super
}

function addAdmin(player) {
    let a = auth.get(player.id)
    adminsRef.child(a).set({name: player.name})
}

function removeAdmin(a) {    
    let p = admins.get(a)
    let curr_pid = getPlayerIdFromAuth(a)
    if (curr_pid) {
        window.WLROOM.setPlayerAdmin(curr_pid, false)
    }
    
    const name = p.name
    adminsRef.child(a).remove()
    admins.delete(a)
    return name
}