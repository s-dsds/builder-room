WLK.syncHash = true;

class BuilderMod {
    cache = new Map()
    #maxCustom = 20
    #custom = []
    #baseUrl = 'https://sylvodsds.gitlab.io/builder-mod/'

    constructor() {}

    async load() {
        const mod = await this.getMod()
        window.WLROOM.loadMod(mod);
    }
    
    async getMod(name= 'default', force = false) {       
        if (!this.cache.has(name) || force) {
            await this.fetchMod(name, force)
        }
        return this.cache.get(name)
    }

    async buildBaseWithElements(force = false) {
        if (force || !this.cache.has('base_merged')) {
            let base = await this.getMod('base', force)
            let bmod = new WLK_Mod(base.zip)

            
            let elements = await this.fetchJson('elements.json', force)
            let elpromises = []
    
            for (const element of elements) {
                elpromises.push(this.getMod(element, force))            
            }

            let ellist = await Promise.all(elpromises)
            for (const el of ellist) {    
                bmod = this.mergeMods(bmod, new WLK_Mod(el.zip))
            }

            this.cache.set('base_merged', bmod)
        }
        return this.cache.get('base_merged')
    }
    
    async buildBuilderMod(name='default', force = false) {
        let bmod = await this.buildBaseWithElements(force)
        
        let wlist = await (async () => {
            try {
                return await this.fetchJson(`sprites/${name}.json`, force)
            } catch(error) {

            }
            return false;
        })()
        if (wlist) {
            let brickmod = await this.getMod('templates/brick', force)
            let pbmod = await this.getMod('templates/paint brush', force)
            let brickpromises = []
    
    
            for (const w of wlist) {
                const spl = w.split('/')
                if (spl.length!=3) continue
                switch (spl[1]) {
                    case 'bricks':
                        brickpromises.push(this.fetchPng('sprites/'+w, force));                    
                        break
                }
            }
    
            let bricklist = await Promise.all(brickpromises)
    
            for (const brick of bricklist) {                
                let bb = new BuilderBrick(brickmod, brick)
                bmod = this.mergeMods(bmod, bb.toWLK_Mod())
            }
            
            let pb = new BuilderPaintbrush(pbmod, { color: 24, width: 16, height: 16})
            bmod = this.mergeMods(bmod, pb.toWLK_Mod())

            let basem =ModCache_Entry.fromWlk(bmod)

            this.cache.set(name, basem)
            this.cache.set(name+'_basemerge', basem)
        }
        const notif = `- builder mod ${name} merged `+(force?"(clearcache forced) ":"")+`-`
        console.log(notif)
        if (typeof notifyAdmins =='function') notifyAdmins(notif, true)
    }

    mergeMods(base, toMerge) {
        let opt = {}
        opt.weapons=toMerge.weapons.list.map(w=>w.name)
        opt.wObjects=toMerge.wObjects.list.map(w=>w.id)
        console.log("full merge", toMerge, JSON.stringify(opt))
        base.merge(toMerge, opt)
        return base;
    }

    async fetchPng(name, force = false) {
        if (!this.cache.has(name) || force) {        
            this.cache.set(name, {name: name, png: await fetchPng(this.#baseUrl+name)})
        }
        return this.cache.get(name)
    }
    async fetchJson(name, force = false)  {
        if (!this.cache.has(name) || force) {        
            this.cache.set(name, await fetchJson(this.#baseUrl+name))
        }
        return this.cache.get(name)
    }

    async fetchMod(name, force = false) {
        return await this.fetchModZip(name, this.#baseUrl+name+(name.substr(-4,4)!='.zip'?".zip":''), force)        
    }
    /* also returns the complete cache key */
    async fetchModZip(key, url, force = false) {    
        if (typeof key == 'string') {
            if (!this.cache.has(key) || force) {
                console.log(`preloading zipped ${url}`)  
                let mz = await fetchZip(url);
                this.cache.set(key, ModCache_Entry.fromZip(mz))
            }
            return key
        }
    }

    async add(type, name, data) {
        let currentBuilder = 'default'
        let cb = new WLK_Mod(this.cache.get(currentBuilder+'_basemerge').zip)

        if (this.#custom.length>=this.#maxCustom) {
            this.#custom = this.#custom.splice(1, this.#maxCustom)
        }
        if (name) {
            data.name=name
        }
        this.#custom.push({name:name,type:type,data:data})

        let brickmod = await this.getMod('templates/brick')        
        let paintbrush = await this.getMod('templates/paint brush')        
        let pencil = await this.getMod('elements/pencil')        

        for (let cust of this.#custom) {         
            switch (cust.type) {
                case 'brick':
                case 'b':
                    let bb = new BuilderBrick(brickmod, {name:cust.name, png:{image:cust.data.data,width:cust.data.width,height:cust.data.height}})
                    cb = this.mergeMods(cb, bb.toWLK_Mod())
                    break;
                case 'paintbrush':
                case 'pb':
                    let pb = new BuilderPaintbrush(paintbrush, cust.data)
                    cb = this.mergeMods(cb, pb.toWLK_Mod())
                    break;
                case 'pencil':
                case 'p':
                    let pen = new BuilderPencil(pencil, cust.data)
                    cb = this.mergeMods(cb, pen.toWLK_Mod())
                    break;
            }       
            
        }
        this.cache.set(currentBuilder, ModCache_Entry.fromWlk(cb))
   
    }
}


var builderfactory = new BuilderMod();
(async () => {
    await builderfactory.buildBuilderMod('default', true);
    initstate.push('firebase ok');
    printInitDone();
})();
