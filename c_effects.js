var effects = {
    stretch: function (map) /* stretches map horizontally */ {
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
    stretchy: function (map)  /* stretches map vertically */ {
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
    rotate: function (map) /* rotate maps clockwise */ {
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
    bigger: function(map) /* (1 pixel = 4 pixels) */ {
        let ret = [];
        let line = 0;
        const ln =  map.width*map.height;
        for (let i = 0; i < ln; i++) {
            if (i && i%map.width==0) {
                line+=2;
            }    
            if (typeof ret[line]=="undefined") {
                ret.push([])
                ret.push([])
            }
            let currpix =map.data[i];
            ret[line].push(currpix)
            ret[line].push(currpix)
            ret[line+1].push(currpix)
            ret[line+1].push(currpix)      
        }
        return { 
            name: map.name,
            width:map.width*2,
            height:map.height*2,
            data:ret.reduce((a, b) => a.concat(b),  [])
        }
    },
    reverse: function (map) /* reverse map vertically */ {
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
    mirror: function (map) /* mirrors map horizontally */ {
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
    expand: function (map) /* expands with a mirrored version */ {
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
    double: function (map) /* copies the map to the right */  {
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
    expandrev: function (map) /* expands with a reversed version */ {
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
    top: function (map, newHeight=0)  /* cuts only the top */ {
        newHeight = parseInt(newHeight)
        if (isNaN(newHeight) || newHeight < 1 || newHeight >= map.height) {
            newHeight = Math.round(map.height/2)
        }

        let ret = [];
        for (let j = 0; j < map.width*newHeight; j++ ) {
            ret.push(map.data[j]);      
        }  
        return { 
            name: map.name,
            width:map.width,
            height:newHeight,
            data:ret
        }
    },
    bottom: function (map, newHeight=0) /* cuts only the bottom */ {
        newHeight = parseInt(newHeight)
        if (isNaN(newHeight) || newHeight < 1 || newHeight >= map.height) {
            newHeight = Math.round(map.height/2)
        }

        let ret = [];
        let half = (newHeight*map.width);
        for (let j = 0; j < half; j++ ) {
            ret.push(map.data[half+j]);      
        }  
        return { 
            name: map.name,
            width:map.width,
            height:newHeight,
            data:ret
        }
    },
    left: function (map, newWidth=0)  /* cuts only the left */ {
        console.log(newWidth)
        newWidth = parseInt(newWidth)
        if (isNaN(newWidth) || newWidth < 1 || newWidth >= map.width) {
            newWidth = Math.round(map.width/2)
        }

        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<newWidth; i++) {
                ret.push(map.data[(j*map.width)+i]);
            }
        } 
        return { 
            name: map.name,
            width:newWidth,
            height:map.height,
            data:ret
        }
    },
    right: function (map, newWidth=0)  /* cuts only the right */  {
        newWidth = parseInt(newWidth)
        if (isNaN(newWidth) || newWidth < 1 || newWidth >= map.width) {
            newWidth = Math.round(map.width/2)
        }

        let ret = [];
        for (let j = 0; j < map.height; j++ ) {
            for (let i = 0; i<newWidth; i++) {
                ret.push(map.data[(j*map.width)+newWidth+i]);
            }
        } 
        return { 
            name: map.name,
            width:newWidth,
            height:map.height,
            data:ret
        }
    },
    border: function (map) /* 1pixel rock border all around*/ {
        const allowedMat = [MATERIAL.ROCK,MATERIAL.UNDEF,MATERIAL.WORM]
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
    borderbottom: function (map, colornum=null) /* 1pixel rock border only bottom*/ {
        let color = parseInt(colornum)
        color = isNaN(color) || colornum===null || color > 255 || color < 0? false : color

        const allowedMat = [MATERIAL.ROCK,MATERIAL.UNDEF,MATERIAL.WORM]
        const rockReplace = 24
        let ret = map.data.slice(0); //copy
        let j = map.height-1
        for (let i = 0; i<map.width; i++) { // bottom border
            if (!allowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                ret[(j*map.width)+i]= color===false? rockReplace: color
            }
        }       
        return { 
            name: map.name,
            width:map.width,
            height:map.height,
            data:ret
        }
    },
    dirt2rock: function (map, colornum=null /* uses this color instead of random rock can be any color number from 0 to 255 */) /* changes all dirt materials to rock*/ {
        let color = parseInt(colornum)
        color = isNaN(color) || colornum===null || color > 255 || color < 0? false : color

        const tobereplacedMat = [MATERIAL.BG_DIRT,MATERIAL.BG_DIRT_2,MATERIAL.DIRT, MATERIAL.DIRT_2]
        let ret = map.data.slice(0); //copy
        for (let j = 0; j < map.height; j++ ) { 
            for (let i = 0; i<map.width; i++) { 
                if (tobereplacedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])) {
                    ret[(j*map.width)+i]= color===false? randomGreyRock(): color
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
    replacecolor: function (map, colornum=null /* color to be replaced number from 0 to 255 */, color2num=null /* new color */) {
        let color = parseInt(colornum)
        color = isNaN(color) || colornum===null || color > 255 || color < 0? randomColor() : color
        let color2 = parseInt(color2num)
        color2 = isNaN(color2) || color2num===null || color2 > 255 || color2 < 0? randomColor() : color2
        
        let ret = map.data.slice(0); //copy
        for (let j = 0; j < map.height; j++ ) { 
            for (let i = 0; i<map.width; i++) { 
                if (color == map.data[(j*map.width)+i]) {
                    ret[(j*map.width)+i]= color2
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
    nodirt: function (map)  /* removes all dirt */ {
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
    fillbg: function (map)  /* fill everything with random background */   {       
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
    fillgaps: function (map, colornum=null, pixel=0 /* number of pixels added to the thresolds | x y thresolds are 3x7 by default */) /* tries filling gaps with random rock */ {   
        pixel = parseInt(pixel)
        pixel = isNaN(pixel) ? 0 : pixel
        pixel = pixel > 40 ? 40 : pixel
        let color = parseInt(colornum)
        color = isNaN(color) || colornum===null || color > 255 || color < 0? false : color

        let maxHorizontalPixels = 3+pixel 
        let maxVerticalPixels = 7+pixel
        let ret = map.data.slice(0); //copy
        const allowedMat = [MATERIAL.UNDEF,MATERIAL.WORM,MATERIAL.ROCK]       
                
        for (let j = 0; j < map.height; j++ ) {                          
            let lastAllowedH = -1
            let nextAllowedH = -1           
            for (let i = 0; i<map.width; i++) {    
                let currentIsAllowed = allowedMat.includes(defaultMaterials[ret[(j*map.width)+i]]) 
                if (currentIsAllowed) {
                    lastAllowedH = i  
                    nextAllowedH = -1                                   
                    continue
                } 

                if (nextAllowedH==-1 && (i+1)<map.width) {       
                    nextAllowedH = (() => {
                        for (let ii = 1+i; ii<map.width; ii++) { 
                            if (allowedMat.includes(defaultMaterials[ret[(j*map.width)+ii]])) {
                                return ii
                            }
                        } 
                        return map.width
                    })()                            
                                        
                }
                                    
                if (i < nextAllowedH && i > lastAllowedH && (nextAllowedH-lastAllowedH)<=maxHorizontalPixels) {                         
                    ret[(j*map.width)+i] = color===false?randomGreyRock():color
                }

            }
                
        } 

        for (let i = 0; i<map.width; i++) {                                   
            let lastAllowedV = -1
            let nextAllowedV = -1           
            for (let j = 0; j < map.height; j++ ) {   
                let currentIsAllowed = allowedMat.includes(defaultMaterials[ret[(j*map.width)+i]]) 
                if (currentIsAllowed) {
                    lastAllowedV = j  
                    nextAllowedV = -1                                     
                    continue
                } 

                if (nextAllowedV==-1 && (j+1)<map.height) {       
                    nextAllowedV = (() => {
                        for (let jj = 1+j; jj < map.height; jj++ ) {                         
                            if (allowedMat.includes(defaultMaterials[ret[(jj*map.width)+i]])) {
                                return jj
                            }
                        } 
                        return map.height
                    })()                            
                                        
                }
                                    
                if (j < nextAllowedV && j > lastAllowedV && (nextAllowedV-lastAllowedV)<=maxVerticalPixels) {                                                      
                    ret[(j*map.width)+i] = color===false?randomGreyRock():color
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
    clearbg: function (map) /* replace all background by a random background color */ {      
        const tobereplacedMat = [MATERIAL.BG_DIRT,MATERIAL.BG_DIRT_2,MATERIAL.BG, MATERIAL.BG_SEESHADOW] 
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
    reduce: function (map) /* reduce each pixel | 4 pixels = 1 pixel */ {       
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
    addbg: function (map, top=10, right=10, bottom=10, left=10, colornum=null /* color to be used default is random background */ )  /* adds random background around current map*/ {
        let color = parseInt(colornum)
        color = isNaN(color) || colornum===null || color > 255 || color < 0? false : color

        let validatePixelValue = (s, c) => {
            let r = parseInt(s)
            if (isNaN(r) || r < 0) {
                return 0
            }
            
            if ((r+Math.round(c/2))>2500) {
                return 2500-Math.round(c/2)
            }
            return r
        }
        top = validatePixelValue(top, map.height)
        right = validatePixelValue(right, map.width)
        bottom = validatePixelValue(bottom, map.height)
        left = validatePixelValue(left, map.width)
        

        let ret = [];
        var y = 0;
        
        const newHeight = map.height+top+bottom
        const newWidth = map.width+left+right
        
        for (let j = 0; j < newHeight; j++ ) {            
            var x = 0
            for (let i = 0; i<newWidth; i++) {
                if (j<top || j>=(map.height+top) || i<left || i>=(map.width+left)) {
                    ret.push(color===false?randomBG():color)
                } else {
                    ret.push(map.data[(y*map.width)+x]);
                    x++
                }                
                
            }
            if (j>=top && j<(map.height+top-1)) {
                y++
            }            
        } 
        return { 
            name: map.name,
            width:newWidth,
            height:newHeight,
            data:ret
        }      
    },
    autocrop: function (map)  /* automatically crops the map around any non BG or SEE SHADOW pixels | BG dirt is kept */ {
        const notAllowedMat = [MATERIAL.BG,MATERIAL.BG_SEESHADOW]
        let top = -1
        let right = -1
        let bottom = -1
        let left = -1
        let newWidth=map.width;
        let newHeight=map.height
        
        let ret = [];

        for (let j = 0; j < map.height; j++ ) {            
            for (let i = 0; i<map.width; i++) {
                    let isAllowed = !notAllowedMat.includes(defaultMaterials[map.data[(j*map.width)+i]])
                    if (isAllowed) {
                        if (top<0) {
                            top=j
                        }
                        if (right<i) {
                            right=i
                        }
                        if (bottom<j) {
                            bottom=j
                        }
                        if (left<0 || left>i) {
                            left=i                            
                        }
                    }
                
            }                        
        }
        newHeight = bottom-top+1
        newWidth = right-left+1
        
        for (let j = top; j < (bottom+1); j++ ) {            
            for (let i = left; i<(right+1); i++) {                    
                ret.push(map.data[(j*map.width)+i]);
                
            }                        
        } 

        return { 
            name: map.name,
            width:newWidth,
            height:newHeight,
            data:ret
        }      
    },
}

var effectList=Object.keys(effects);