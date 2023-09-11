export * from './swapUtil';
export type TokenId = number;
export type TraitValue = number;
export type LayerId = string;
export declare enum TraitType {
    Appendage = 0,
    Background = 1,
    ClipAccessory = 2,
    Ears = 3,
    EyeColor = 4,
    Eyebrows = 5,
    Eyes = 6,
    FaceAccessory = 7,
    HairBack = 8,
    HairColor = 9,
    HairFront = 10,
    Hand = 11,
    HeadAccessory = 12,
    Mouth = 13,
    Nose = 14,
    Outfit = 15,
    SkinMarking = 16,
    SkinTone = 17,
    Weapon = 18
}
export declare enum LayerType {
    Background = 0,
    Appendage = 1,
    Weapon = 2,
    HatAccessoryBack = 3,
    HairBack = 4,
    OutfitBack = 5,
    Body = 6,
    Ears = 7,
    SkinMarking = 8,
    OutfitFront = 9,
    Mouth = 10,
    Nose = 11,
    Eyes = 12,
    Eyebrows = 13,
    FaceAccessory = 14,
    EarsAccessory = 15,
    HairFront = 16,
    ClipsAccessory = 17,
    HatsAccessory = 18,
    Hand = 19
}
export declare const TraitHighlights: {
    0: LayerType[];
    1: LayerType[];
    2: LayerType[];
    3: LayerType[];
    4: LayerType[];
    5: LayerType[];
    6: LayerType[];
    7: LayerType[];
    8: LayerType[];
    9: LayerType[];
    10: LayerType[];
    11: LayerType[];
    12: LayerType[];
    13: LayerType[];
    14: LayerType[];
    15: LayerType[];
    16: LayerType[];
    17: LayerType[];
    18: LayerType[];
};
export declare const LayerTraits: {
    0: TraitType[];
    1: TraitType[];
    2: TraitType[];
    3: TraitType[];
    4: TraitType[];
    5: TraitType[];
    6: TraitType[];
    7: TraitType[];
    8: TraitType[];
    9: TraitType[];
    10: TraitType[];
    11: TraitType[];
    12: TraitType[];
    13: TraitType[];
    14: TraitType[];
    15: TraitType[];
    16: TraitType[];
    17: TraitType[];
    18: TraitType[];
    19: TraitType[];
};
export type TokenData = {
    id: TokenId;
    traitData: TraitData;
};
export type TraitData = {
    [T in TraitType]: TraitValue | undefined;
};
export type LayerData = {
    [L in LayerType]: LayerId | undefined;
};
export declare function getTraitMetadata(type: TraitType, trait: TraitValue): {
    name: string;
    tags: string;
};
export declare function getFiles(layerId: LayerId | undefined): string[];
export declare function mapToLayerData(attrs: TraitData): LayerData;
export declare function mapToCompoundLayerData(attrs1: TraitData, attrs2: TraitData): {
    [L in LayerType]: (LayerId | undefined)[];
};
