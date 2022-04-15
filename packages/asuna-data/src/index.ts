let fileList = require('../metadata/filelist.json')
let traitMetadata = require('../metadata/trait-metadata.json')

export * from './swapUtil'

export type TokenId = number
export type TraitValue = number
export type LayerId = string

export enum TraitType {
  Appendage,
  Background,
  ClipAccessory,
  Ears,
  EyeColor,
  Eyebrows,
  Eyes,
  FaceAccessory,
  HairBack,
  HairColor,
  HairFront,
  Hand,
  HeadAccessory,
  Mouth,
  Nose,
  Outfit,
  SkinMarking,
  SkinTone,
  Weapon
}

export enum LayerType {
  Background,
  Appendage,
  Weapon,
  HatAccessoryBack,
  HairBack,
  OutfitBack,
  Body,
  Ears,
  SkinMarking,
  OutfitFront,
  Mouth,
  Nose,
  Eyes,
  Eyebrows,
  FaceAccessory,
  EarsAccessory,
  HairFront,
  ClipsAccessory,
  HatsAccessory,
  Hand
}

export const TraitHighlights = {
  [TraitType.Appendage]: [LayerType.Appendage],
  [TraitType.Background]: [LayerType.Background],
  [TraitType.ClipAccessory]: [LayerType.ClipsAccessory],
  [TraitType.Ears]: [LayerType.Ears],
  [TraitType.EyeColor]: [LayerType.Eyes],
  [TraitType.Eyebrows]: [LayerType.Eyebrows],
  [TraitType.Eyes]: [LayerType.Eyes],
  [TraitType.FaceAccessory]: [LayerType.FaceAccessory],
  [TraitType.HairBack]: [LayerType.HairBack],
  [TraitType.HairFront]: [LayerType.HairFront],
  [TraitType.HairColor]: [LayerType.HairBack, LayerType.HairFront],
  [TraitType.Hand]: [LayerType.Hand],
  [TraitType.HeadAccessory]: [LayerType.HatAccessoryBack, LayerType.HatsAccessory, LayerType.EarsAccessory],
  [TraitType.Mouth]: [LayerType.Mouth],
  [TraitType.Nose]: [LayerType.Nose],
  [TraitType.Outfit]: [LayerType.OutfitBack, LayerType.OutfitFront],
  [TraitType.SkinMarking]: [LayerType.SkinMarking],
  [TraitType.SkinTone]: [LayerType.Body, LayerType.Hand],
  [TraitType.Weapon]: [LayerType.Weapon]
}

export type TokenData = {
  id: TokenId,
  traitData: TraitData
}

export type TraitData = {
  [T in TraitType]: TraitValue | undefined
}

export type LayerData = {
  [L in LayerType]: LayerId | undefined
}

export function getTraitMetadata(type: TraitType, trait: TraitValue) {
  return traitMetadata[type][trait] as {
    name: string,
    tags: string
  }
}

export function getFiles(layerId: LayerId | undefined) {
  if (layerId === undefined || !(layerId in fileList)) {
    return []
  }
  return fileList[layerId].map((file: string) => `${layerId}/${file}`) as string[]
}

export function mapToLayerData(attrs: TraitData): LayerData {
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
  }
}

function joinIds(...ids: (number | undefined)[]) {
  for (let id of ids) {
    if (id === undefined) {
      return undefined
    }
  }
  return 'layer/' + ids.map(id => pad(id!)).join('/')
}

function pad(n: number) {
  return String(n).padStart(6, '0')
}
