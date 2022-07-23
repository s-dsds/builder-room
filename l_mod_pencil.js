weaponTypes.push('pencil');
weaponTypes.push('p');


class BuilderPencil {
    #name = 'pencil'
    #data = null
    #omod = null
    constructor(pencil, data) {
        this.#omod = new WLK_Mod(pencil.zip)        
        this.#name = data.name??"PENCIL"
        if (typeof data.color != 'undefined') {
            this.#name += ` ${data.color}`
        }
        this.#data = data // {data:{width,height,data}} ||{color,width,height}
    }


    toWLK_Mod = () => {        
        const palette = this.#omod.sprites.list[2].palette
        this.#omod.weapons.list[0].name = this.#name
        
        if (this.#isSprite()) {
            let sp = this.#getSprite(palette)
            this.#omod.add('spr', sp)
            this.#omod.textures.list[2].sFrame = 22
            // let sp2 = this.#genSprite(palette, 0, this.#data.width, this.#data.height)   
            // this.#omod.add('spr', sp2)
            // this.#omod.sObjects.list[0].startFrame = 23 

            // // this.#omod.textures.list[0].sFrame = 23

            // this.#omod.textures.list[0].sFrame = 23
            // let sp3 = this.#genSprite(palette, 6, this.#data.width, this.#data.height)   
            // this.#omod.add('spr', sp3)
            // this.#omod.textures.list[2].mFrame = 23   
            // this.#omod.textures.list[0].mFrame = 24   

          //   this.#omod.textures.list[0].mFrame = 24   
        } else {
            let sp = this.#genSprite(palette, this.#data.color, this.#data.width, this.#data.height)
            this.#omod.add('spr', sp)
            this.#omod.textures.list[2].sFrame = 22
            let sp2 = this.#genSprite(palette, 0, this.#data.width, this.#data.height)   
            this.#omod.add('spr', sp2)
            this.#omod.sObjects.list[0].startFrame = 23 
            this.#omod.textures.list[0].sFrame = 23
          //  this.#omod.textures.list[1].sFrame = 23
            let sp3 = this.#genSprite(palette, 6, this.#data.width, this.#data.height)   
            this.#omod.add('spr', sp3)
            this.#omod.textures.list[2].mFrame = 24                                
            this.#omod.textures.list[0].mFrame = 24                                
            //this.#omod.textures.list[0].rFrame = 23
            //this.#omod.textures.list[1].mFrame = 24                                
        }

        this.#omod.config = {
            name: "",
            version: "",
            author: ""
        }

        return this.#omod
    }

    #isSprite = () => {
        return typeof this.#data.data !='undefined'
    }
    #genSprite = (palette, color, width, height) => {
        const anchor = this.#computeAnchor({width:width, height: height})
        let sp = new WLK_Sprite(width, height, anchor.x, anchor.y)
        
        if (color<0) {
            color+=256
        } else if (color>255) {
            color-=256
        }
        sp.data.fill(color)

        sp.palette = palette
        sp.updateHash()
        return sp
    }
    #getSprite = (palette) => {
        let cleaned = this.#cleanup()
        const anchor = this.#computeAnchor(cleaned)

        let sp = new WLK_Sprite(cleaned.width, cleaned.height, anchor.x, anchor.y)
        sp.palette = palette
        sp.setData(cleaned.data)
        return sp
    }
    #cleanup = () => {        
        const w = this.#data.width
        const h = this.#data.height
        const tobereplacedMat = [MATERIAL.BG, MATERIAL.BG_SEESHADOW, MATERIAL.BG_DIRT, MATERIAL.BG_DIRT_2]
        console.log("jjjjjjjjjjjjjjj", JSON.stringify(Object.keys(this.#data)))
        let ret = this.#data.data.slice(0); // copy
        console.log('cl ret typeof', typeof ret, ret.length, w*h)
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                if (tobereplacedMat.includes(defaultMaterials[this.#data.data[(j * w) + i]])) {
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
        return {x: -Math.round(w/2), y: -Math.round(h/2)}
    }
}

// "BD":  RangeError: Offset is outside the bounds of the DataView
//     at DataView.setUint16 (<anonymous>)
//     at WLK_Sprites.asArrayBuffer (__puppeteer_evaluation_script__:1218:5)
//     at WLK_Mod.write_wlsprt (__puppeteer_evaluation_script__:803:23)
//     at WLK_Mod.write_zip (__puppeteer_evaluation_script__:622:78)
//     at Function.fromWlk (__puppeteer_evaluation_script__:38:23)
//     at BuilderMod.add (__puppeteer_evaluation_script__:155:55)
//     at async __puppeteer_evaluation_script__:306:13
