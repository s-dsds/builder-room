const MATERIAL = {
    UNDEF: 0,
    DIRT: 1,
    DIRT_2: 2,    
    ROCK: 4,
    BG: 8,
    BG_DIRT: 9,
    BG_DIRT_2: 10,
    BG_SEESHADOW: 24,
    WORM: 32,
}

const MAT_GROUP = {
    bg: [MATERIAL.BG,MATERIAL.BG_DIRT,MATERIAL.BG_DIRT_2, MATERIAL.BG_SEESHADOW],
    rock: [MATERIAL.ROCK],
    undef: [MATERIAL.UNDEF, MATERIAL.WORM],
    dirt: [MATERIAL.DIRT_2, MATERIAL.DIRT],
}

const defaultMaterials = [0, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 0, 0, 1, 1, 1, 4, 4, 4, 1, 1, 1, 4, 4, 4, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var randomBG = () => [160,161,162,163][Math.round(Math.random()*3)]
const GreyRock = [...Array.from(Array(11).keys()).map((x)=>x+19)];
var randomGreyRock = () => GreyRock[Math.round(Math.random()*10)]
var randomColor = () => Math.round(Math.random()*255)
const BrownDirt = [...Array.from(Array(7).keys()).map((x)=>x+12)];
var randomBrownDirt = () => BrownDirt[Math.round(Math.random()*6)]
var MatString = {
    rock: [MATERIAL.ROCK],
    undef: [MATERIAL.UNDEF, MATERIAL.WORM],
    dirt: [MATERIAL.DIRT, MATERIAL.DIRT_2],
    bg: [MATERIAL.BG, MATERIAL.BG_DIRT, MATERIAL.BG_DIRT, MATERIAL.BG_SEESHADOW],
}

var isColorIdxMatString = (idx, str) => {
    try {
        return MatString[str].includes(defaultMaterials[idx])
    } catch(e) { }
    return false
}