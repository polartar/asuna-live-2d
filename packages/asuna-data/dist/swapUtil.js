"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSwap = exports.canSwapAll = void 0;
const traitTags = require('../metadata/trait-value-tags.json');
const clipTags = {
    'clip_face': true,
    'clip_hf_hat': true,
    'clip_hf_elf': true,
    'clip_hb_hat': true,
    'clip_hat_elf': true,
    'clip_hand': true,
    'clip_mask': true,
    'clip_hat': true
};
function canSwapAll(token1, token2, traitTypes) {
    let traits1 = { ...token1.traitData };
    let traits2 = { ...token2.traitData };
    for (let type of traitTypes) {
        const temp = traits1[type];
        traits1[type] = traits2[type];
        traits2[type] = temp;
    }
    const ret1 = checkValid(traits1);
    const ret2 = checkValid(traits2);
    return {
        valid: ret1.valid && ret2.valid,
        clips: [
            ret1.clips,
            ret2.clips
        ]
    };
}
exports.canSwapAll = canSwapAll;
function canSwap(token1, token2, type) {
    let swappable = true;
    let message = undefined;
    if (token1.traitData[type] === token2.traitData[type]) {
        swappable = false;
    }
    return {
        swappable,
        message
    };
}
exports.canSwap = canSwap;
function checkValid(traitData) {
    let tagCount = {};
    for (let traitType of Object.keys(traitData)) {
        const traitValue = traitData[traitType];
        if (traitValue === undefined) {
            continue;
        }
        let tags = [];
        if (traitType in traitTags && traitValue in traitTags[traitType]) {
            tags = traitTags[traitType][traitValue];
        }
        for (let tag of tags) {
            if (!(tag in tagCount)) {
                tagCount[tag] = {};
            }
            tagCount[tag][traitType] = true;
        }
    }
    let clips = [];
    for (let tag of Object.keys(tagCount)) {
        if ((tag in clipTags) && Object.keys(tagCount[tag]).length >= 2) {
            clips.push(...Object.keys(tagCount[tag]).map(str => Number.parseInt(str)));
        }
    }
    return {
        valid: clips.length === 0,
        clips
    };
}
