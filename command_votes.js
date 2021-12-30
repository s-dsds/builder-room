var votes = (() => {
    let voteRepo = {
        clear: [],
        fight: [],
        build: [],
        undo:  [],
    }
    let resetCallbacks = {
        undo: () => {
            console.log("reset undo")
            if (undoTimeout!=null) {
                clearTimeout(undoTimeout);
                undoTimeout=null;  
                undoAsked = null;
            }
        }
    }
    function reset (name = "") { 
        if (name=="") {
            for (const k in voteRepo) {
                reset(k);
            }
            return;
        }
        console.log("votes", JSON.stringify(voteRepo));
        voteRepo[name] = [];
        if (typeof resetCallbacks[name] == 'function') {
            resetCallbacks[name]();
        }
    }
    function add (name, player) {
         let a = auth.get(player.id);
        if (-1 != voteRepo[name].indexOf(a)) { return; }
        voteRepo[name].push(a);
    }

    let accepted =  (name) => getActivePlayers().length==1 || voteRepo[name].length>=requiredVoteCount()
    
    let count = (name) => voteRepo[name].length
    let isFirstVote = (name) => voteRepo[name].length==1

    return {
        add: add,
        reset: reset,
        count: count,
        accepted: accepted,
        isFirstVote: isFirstVote,
    }
})();
