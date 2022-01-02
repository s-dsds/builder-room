var effects = {
    stretch: function (map) {
        let ret = [];
        const ln =  map.width*map.height;
        for (let i = 0; i < ln; i++) {
            ret.push(map.data[i]);
            ret.push(map.data[i]);
        }
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height,
            data:ret
        }
    },
    stretchy: function (map) {
        let ret = [];
        let line = 0;
        const ln =  map.width*map.height;
        for (let i = 0; i < ln; i++) {
            if (typeof ret[line]=="undefined") {
                ret.push([])
                ret.push([])
            }
            let currpix =map.data[i];
            ret[line].push(currpix)
            ret[line+1].push(currpix)
            if (i%map.width==0) {
                line+=2;
            }          
        }
        return { 
            name: map.name,
            width:map.width,
            height:map.height*2,
            data:ret.reduce((a, b) => a.concat(b),  [])
        }
    },
    rotate: function (map) {
        let ret = [];

        for (let j =0; j<map.width; j++) {
            for (let i=map.height-1; i>=0; i--) {        
                ret.push(map.data[ (map.width*i)+  j]);
            }
        }
         
        return {
            name: map.name, 
            width:map.height,
            height:map.width,
            data:ret
        }
    },
    bigger: function(map) {
        let ret = [];
        let line = 0;
        const ln =  map.width*map.height;
        for (let i = 0; i < ln; i++) {
            if (typeof ret[line]=="undefined") {
                ret.push([])
                ret.push([])
            }
            let currpix =map.data[i];
            ret[line].push(currpix)
            ret[line].push(currpix)
            ret[line+1].push(currpix)
            ret[line+1].push(currpix)
            if (i%map.width==0) {
                line+=2;
            }          
        }
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height*2,
            data:ret.reduce((a, b) => a.concat(b),  [])
        }
    },
    reverse: function (map) {
        let ret = [];
        const ln =  (map.width*map.height)-1;
        for (let i = ln; i >= 0; i--) {
            ret.push(map.data[i]);
        }
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    mirror: function (map) {
        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = map.width-1; i >= 0; i--) {
                
                    ret.push(map.data[(j*map.width)+i]);
                        
            }
        }  
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },        
    expand: function (map) {
        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<map.width; i++) {
                
                ret.push(map.data[(j*map.width)+i]);
                    
            }
            for (let i = map.width-1; i >= 0; i--) {
                
                    ret.push(map.data[(j*map.width)+i]);
                        
            }
        }  
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height,
            data:ret
        }
    },
    double: function (map) {
        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let k = 0; k <2; k++) {
                for (let i = 0; i<map.width; i++) {
                    
                    ret.push(map.data[(j*map.width)+i]);
                        
                }
            }
        }  
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height,
            data:ret
        }
    },
    expandrev: function (map) {
        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<map.width; i++) {
                ret.push(map.data[(j*map.width)+i]);
            }
            for (let i = 0; i<map.width; i++) {
                    ret.push(map.data[(map.height-j-1)*map.width+i]);                        
            }
        } 
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height,
            data:ret
        }
    },
    top: function (map) {
        let ret = [];
        for (let j = 0; j < map.width*Math.round(map.height/2); j++ ) {
            ret.push(map.data[j]);      
        }  
        return { 
            name: map.name,
            width:map.width,
            height:Math.round(map.height/2),
            data:ret
        }
    },
    bottom: function (map) {
        let ret = [];
        let halfy =Math.round(map.height/2);
        let half = (halfy*map.width);
        for (let j = 0; j < half; j++ ) {
            ret.push(map.data[half+j]);      
        }  
        return { 
            name: map.name,
            width:map.width,
            height:halfy,
            data:ret
        }
    },
    left: function (map) {
        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<Math.round(map.width/2); i++) {
                ret.push(map.data[(j*map.width)+i]);
            }
        } 
        return { 
            name: map.name,
            width:Math.round(map.width/2),
            height:map.height,
            data:ret
        }
    },
    right: function (map) {
        let ret = [];
        let halfx =Math.round(map.width/2);
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<halfx; i++) {
                ret.push(map.data[(j*map.width)+halfx+i]);
            }
        } 
        return { 
            name: map.name,
            width:halfx,
            height:map.height,
            data:ret
        }
    },
    border: function (map) {
        const allowedMat = [MATERIAL.ROCK,MATERIAL.UNDEF,MATERIAL.ROCK]
        const rockReplace = 24
        let ret = map.data.slice(0); //copy
        let j = 0;
        for (let i = 0; i<map.width; i++) { // top border
            if (!allowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                ret[(j*map.width)+i]= rockReplace
            }
        }
        j = map.height-1
        for (let i = 0; i<map.width; i++) { // bottom border
            if (!allowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                ret[(j*map.width)+i]= rockReplace
            }
        }
        let i = 0;
        for (let j = 0; j < map.height; j++ ) { //left border
            if (!allowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                ret[(j*map.width)+i]= rockReplace
            }
        } 
        i = map.width-1;
        for (let j = 0; j < map.height; j++ ) { //right border
            if (!allowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                ret[(j*map.width)+i]= rockReplace
            }
        } 
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    dirt2rock: function (map) {
        const tobereplacedMat = [MATERIAL.BG_DIRT,MATERIAL.BG_DIRT_2,MATERIAL.DIRT, MATERIAL.DIRT_2]
        let ret = map.data.slice(0); //copy
        for (let j = 0; j < map.height; j++ ) { 
            for (let i = 0; i<map.width; i++) { 
                if (tobereplacedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                    ret[(j*map.width)+i]= randomGreyRock()
                }
            }
        }    
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    nodirt: function (map) {
        const tobereplacedMat = [MATERIAL.BG_DIRT,MATERIAL.BG_DIRT_2,MATERIAL.DIRT, MATERIAL.DIRT_2]
        let ret = map.data.slice(0); //copy
        for (let j = 0; j < map.height; j++ ) { 
            for (let i = 0; i<map.width; i++) { 
                if (tobereplacedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                    ret[(j*map.width)+i]= randomBG()
                }
            }
        }    
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    fillbg: function (map)  {       
        let ret = map.data.slice(0); //copy
        for (let j = 0; j < map.height; j++ ) { 
            for (let i = 0; i<map.width; i++) { 
                    ret[(j*map.width)+i]= randomBG()                
            }
        }    
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    reduce: function (map)  {       
        let ret = { 
            name: map.name,
            width:Math.round(map.width/2),
            height:Math.round(map.height/2),
            data:[]
        }
        for (let j = 0; j <ret.height; j++ ) { 
            for (let i = 0; i<ret.width; i++) { 
                    ret.data.push(map.data[(j*2*map.width)+i*2]??randomGreyRock())
            }
        }    

        return ret
    },
}

var effectList=Object.keys(effects);