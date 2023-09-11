"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCompoundLayerData = exports.mapToLayerData = exports.getFiles = exports.getTraitMetadata = exports.LayerTraits = exports.TraitHighlights = exports.LayerType = exports.TraitType = void 0;
let fileList = require('../metadata/filelist.json');
let traitMetadata = require('../metadata/trait-metadata.json');
__exportStar(require("./swapUtil"), exports);
var TraitType;
(function (TraitType) {
    TraitType[TraitType["Appendage"] = 0] = "Appendage";
    TraitType[TraitType["Background"] = 1] = "Background";
    TraitType[TraitType["ClipAccessory"] = 2] = "ClipAccessory";
    TraitType[TraitType["Ears"] = 3] = "Ears";
    TraitType[TraitType["EyeColor"] = 4] = "EyeColor";
    TraitType[TraitType["Eyebrows"] = 5] = "Eyebrows";
    TraitType[TraitType["Eyes"] = 6] = "Eyes";
    TraitType[TraitType["FaceAccessory"] = 7] = "FaceAccessory";
    TraitType[TraitType["HairBack"] = 8] = "HairBack";
    TraitType[TraitType["HairColor"] = 9] = "HairColor";
    TraitType[TraitType["HairFront"] = 10] = "HairFront";
    TraitType[TraitType["Hand"] = 11] = "Hand";
    TraitType[TraitType["HeadAccessory"] = 12] = "HeadAccessory";
    TraitType[TraitType["Mouth"] = 13] = "Mouth";
    TraitType[TraitType["Nose"] = 14] = "Nose";
    TraitType[TraitType["Outfit"] = 15] = "Outfit";
    TraitType[TraitType["SkinMarking"] = 16] = "SkinMarking";
    TraitType[TraitType["SkinTone"] = 17] = "SkinTone";
    TraitType[TraitType["Weapon"] = 18] = "Weapon";
})(TraitType || (exports.TraitType = TraitType = {}));
var LayerType;
(function (LayerType) {
    LayerType[LayerType["Background"] = 0] = "Background";
    LayerType[LayerType["Appendage"] = 1] = "Appendage";
    LayerType[LayerType["Weapon"] = 2] = "Weapon";
    LayerType[LayerType["HatAccessoryBack"] = 3] = "HatAccessoryBack";
    LayerType[LayerType["HairBack"] = 4] = "HairBack";
    LayerType[LayerType["OutfitBack"] = 5] = "OutfitBack";
    LayerType[LayerType["Body"] = 6] = "Body";
    LayerType[LayerType["Ears"] = 7] = "Ears";
    LayerType[LayerType["SkinMarking"] = 8] = "SkinMarking";
    LayerType[LayerType["OutfitFront"] = 9] = "OutfitFront";
    LayerType[LayerType["Mouth"] = 10] = "Mouth";
    LayerType[LayerType["Nose"] = 11] = "Nose";
    LayerType[LayerType["Eyes"] = 12] = "Eyes";
    LayerType[LayerType["Eyebrows"] = 13] = "Eyebrows";
    LayerType[LayerType["FaceAccessory"] = 14] = "FaceAccessory";
    LayerType[LayerType["EarsAccessory"] = 15] = "EarsAccessory";
    LayerType[LayerType["HairFront"] = 16] = "HairFront";
    LayerType[LayerType["ClipsAccessory"] = 17] = "ClipsAccessory";
    LayerType[LayerType["HatsAccessory"] = 18] = "HatsAccessory";
    LayerType[LayerType["Hand"] = 19] = "Hand";
})(LayerType || (exports.LayerType = LayerType = {}));
exports.TraitHighlights = {
    [TraitType.Appendage]: [LayerType.Appendage],
    [TraitType.Background]: [LayerType.Background],
    [TraitType.ClipAccessory]: [LayerType.ClipsAccessory],
    [TraitType.Ears]: [LayerType.Ears],
    [TraitType.EyeColor]: [LayerType.Eyes],
    [TraitType.Eyebrows]: [LayerType.Eyebrows],
    [TraitType.Eyes]: [LayerType.Eyes],
    [TraitType.FaceAccessory]: [LayerType.FaceAccessory],
    [TraitType.HairBack]: [LayerType.HairBack],
    [TraitType.HairColor]: [LayerType.HairBack, LayerType.HairFront],
    [TraitType.HairFront]: [LayerType.HairFront],
    [TraitType.Hand]: [LayerType.Hand],
    [TraitType.HeadAccessory]: [LayerType.HatAccessoryBack, LayerType.HatsAccessory, LayerType.EarsAccessory],
    [TraitType.Mouth]: [LayerType.Mouth],
    [TraitType.Nose]: [LayerType.Nose],
    [TraitType.Outfit]: [LayerType.OutfitBack, LayerType.OutfitFront],
    [TraitType.SkinMarking]: [LayerType.SkinMarking],
    [TraitType.SkinTone]: [LayerType.Body, LayerType.Hand],
    [TraitType.Weapon]: [LayerType.Weapon]
};
exports.LayerTraits = {
    [LayerType.Background]: [TraitType.Background],
    [LayerType.Appendage]: [TraitType.Appendage],
    [LayerType.Weapon]: [TraitType.Weapon],
    [LayerType.HatAccessoryBack]: [TraitType.HeadAccessory],
    [LayerType.HairBack]: [TraitType.HairColor, TraitType.HairBack],
    [LayerType.OutfitBack]: [TraitType.Outfit],
    [LayerType.Body]: [TraitType.SkinTone],
    [LayerType.Ears]: [TraitType.SkinTone, TraitType.Ears],
    [LayerType.SkinMarking]: [TraitType.SkinMarking],
    [LayerType.OutfitFront]: [TraitType.Outfit],
    [LayerType.Mouth]: [TraitType.Mouth],
    [LayerType.Nose]: [TraitType.Nose],
    [LayerType.Eyes]: [TraitType.EyeColor, TraitType.Eyes],
    [LayerType.Eyebrows]: [TraitType.Eyebrows],
    [LayerType.FaceAccessory]: [TraitType.FaceAccessory],
    [LayerType.EarsAccessory]: [TraitType.HeadAccessory],
    [LayerType.HairFront]: [TraitType.HairColor, TraitType.HairFront],
    [LayerType.ClipsAccessory]: [TraitType.ClipAccessory],
    [LayerType.HatsAccessory]: [TraitType.HeadAccessory],
    [LayerType.Hand]: [TraitType.SkinTone, TraitType.Hand]
};
function getTraitMetadata(type, trait) {
    return traitMetadata[type][trait];
}
exports.getTraitMetadata = getTraitMetadata;
function getFiles(layerId) {
    if (layerId === undefined || !(layerId in fileList)) {
        return [];
    }
    return fileList[layerId].map((file) => `${layerId}/${file}`);
}
exports.getFiles = getFiles;
function mapToLayerData(attrs) {
    return {
        [LayerType.Background]: joinIds(LayerType.Background, attrs[TraitType.Background]),
        [LayerType.Appendage]: joinIds(LayerType.Appendage, attrs[TraitType.Appendage]),
        [LayerType.Weapon]: joinIds(LayerType.Weapon, attrs[TraitType.Weapon]),
        [LayerType.HatAccessoryBack]: joinIds(LayerType.HatAccessoryBack, attrs[TraitType.HeadAccessory]),
        [LayerType.HairBack]: joinIds(LayerType.HairBack, attrs[TraitType.HairBack], attrs[TraitType.HairColor]),
        [LayerType.OutfitBack]: joinIds(LayerType.OutfitBack, attrs[TraitType.Outfit]),
        [LayerType.Body]: joinIds(LayerType.Body, attrs[TraitType.SkinTone]),
        [LayerType.Ears]: joinIds(LayerType.Ears, attrs[TraitType.SkinTone], attrs[TraitType.Ears]),
        [LayerType.SkinMarking]: joinIds(LayerType.SkinMarking, attrs[TraitType.SkinMarking]),
        [LayerType.OutfitFront]: joinIds(LayerType.OutfitFront, attrs[TraitType.Outfit]),
        [LayerType.Mouth]: joinIds(LayerType.Mouth, attrs[TraitType.Mouth]),
        [LayerType.Nose]: joinIds(LayerType.Nose, attrs[TraitType.Nose]),
        [LayerType.Eyes]: joinIds(LayerType.Eyes, attrs[TraitType.Eyes], attrs[TraitType.EyeColor]),
        [LayerType.Eyebrows]: joinIds(LayerType.Eyebrows, attrs[TraitType.Eyebrows]),
        [LayerType.FaceAccessory]: joinIds(LayerType.FaceAccessory, attrs[TraitType.FaceAccessory]),
        [LayerType.EarsAccessory]: joinIds(LayerType.EarsAccessory, attrs[TraitType.HeadAccessory]),
        [LayerType.HairFront]: joinIds(LayerType.HairFront, attrs[TraitType.HairFront], attrs[TraitType.HairColor]),
        [LayerType.ClipsAccessory]: joinIds(LayerType.ClipsAccessory, attrs[TraitType.ClipAccessory]),
        [LayerType.HatsAccessory]: joinIds(LayerType.HatsAccessory, attrs[TraitType.HeadAccessory]),
        [LayerType.Hand]: joinIds(LayerType.Hand, attrs[TraitType.SkinTone], attrs[TraitType.Hand])
    };
}
exports.mapToLayerData = mapToLayerData;
function mapToCompoundLayerData(attrs1, attrs2) {
    return {
        [LayerType.Background]: [],
        [LayerType.Appendage]: [],
        [LayerType.Weapon]: [],
        [LayerType.HatAccessoryBack]: [],
        [LayerType.HairBack]: [
            joinIds(LayerType.HairBack, attrs1[TraitType.HairBack], attrs2[TraitType.HairColor]),
            joinIds(LayerType.HairBack, attrs2[TraitType.HairBack], attrs1[TraitType.HairColor])
        ],
        [LayerType.OutfitBack]: [],
        [LayerType.Body]: [],
        [LayerType.Ears]: [
            joinIds(LayerType.Ears, attrs2[TraitType.SkinTone], attrs1[TraitType.Ears]),
            joinIds(LayerType.Ears, attrs1[TraitType.SkinTone], attrs2[TraitType.Ears])
        ],
        [LayerType.SkinMarking]: [],
        [LayerType.OutfitFront]: [],
        [LayerType.Mouth]: [],
        [LayerType.Nose]: [],
        [LayerType.Eyes]: [
            joinIds(LayerType.Eyes, attrs1[TraitType.Eyes], attrs2[TraitType.EyeColor]),
            joinIds(LayerType.Eyes, attrs2[TraitType.Eyes], attrs1[TraitType.EyeColor])
        ],
        [LayerType.Eyebrows]: [],
        [LayerType.FaceAccessory]: [],
        [LayerType.EarsAccessory]: [],
        [LayerType.HairFront]: [
            joinIds(LayerType.HairFront, attrs1[TraitType.HairFront], attrs2[TraitType.HairColor]),
            joinIds(LayerType.HairFront, attrs2[TraitType.HairFront], attrs1[TraitType.HairColor])
        ],
        [LayerType.ClipsAccessory]: [],
        [LayerType.HatsAccessory]: [],
        [LayerType.Hand]: [
            joinIds(LayerType.Hand, attrs2[TraitType.SkinTone], attrs1[TraitType.Hand]),
            joinIds(LayerType.Hand, attrs1[TraitType.SkinTone], attrs2[TraitType.Hand])
        ]
    };
}
exports.mapToCompoundLayerData = mapToCompoundLayerData;
function joinIds(...ids) {
    for (let id of ids) {
        if (id === undefined) {
            return undefined;
        }
    }
    return 'layer/' + ids.map(id => pad(id)).join('/');
}
function pad(n) {
    return String(n).padStart(6, '0');
}
