weaponTypes.push('brick');
weaponTypes.push('b');


class BuilderBrick {
    #name = 'brick'
    #data = null
    #omod = null
    constructor(brickmod, data) {
        this.#omod = new WLK_Mod(brickmod.zip)
        this.#name = data.name.substring(data.name.lastIndexOf("/")+1).replace(".png","").replace("_"," ");
        this.#data = data.png // {width,height,image}
    }


    toWLK_Mod = () => {
        const isOrig = this.#name=='BLUE BRICK'
        this.#omod.weapons.list[0].name = this.#name
                
        let sp = this.#getSprite(this.#omod.sprites.list[2].palette)

        
        this.#omod.add('spr', sp)

        this.#omod.config = {
            name: "",
            version: "",
            author: ""
        }

        return this.#omod
    }

    #getSprite = (palette) => {
        let cleaned = this.#cleanup()
        const anchor = this.#computeAnchor(cleaned)

        let sp = new WLK_Sprite(cleaned.width, cleaned.height, anchor.x, anchor.y)
        sp.data = cleaned.data
        sp.palette = palette
        sp.updateHash()
        return sp
    }
    #cleanup = () => {
        const w = this.#data.width
        const h = this.#data.height
        const tobereplacedMat = [MATERIAL.BG, MATERIAL.BG_SEESHADOW, MATERIAL.BG_DIRT, MATERIAL.BG_DIRT_2]
        
        let ret = this.#data.image.slice(0); // copy
        console.log('cl ret typeof', typeof ret, ret.length, this.#data.width*this.#data.height)
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                if (tobereplacedMat.includes(defaultMaterials[this.#data.image[(j * w) + i]])) {
                    ret[(j * w) + i] = 0
                }
            }
        }
        return {
            width: w,
            height: h,
            data: Uint8Array.from(ret),
        }
    }

    #computeAnchor = (mdata) => {
        const w = mdata.width
        const h = mdata.height
        const anchorable = [MATERIAL.ROCK, MATERIAL.UNDEF, MATERIAL.WORM]
        for (let j = h-1; j > 0; j--) {
            const startx = Math.round(w/2)-(w%2)            
            let ii = startx-1
            let iii = startx
            while (iii < w || ii >=0) {
                let p = defaultMaterials[mdata.data[(j * w) + ii]]
                if (typeof p != 'undefined') {
                    if (p && anchorable.includes(p)) {
                        return {x: -ii, y: -j}
                    }
                }
                ii--
                let pp = defaultMaterials[mdata.data[(j * w) + iii]]
                if (typeof pp != 'undefined') {
                    if (pp && anchorable.includes(pp)) {
                        return {x: -iii, y: -j}
                    }
                }
                iii++
            }
        }
        return {x: 0, y: 0}
    }
}

