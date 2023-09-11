import { TokenData, TraitType } from './index';
export declare function canSwapAll(token1: TokenData, token2: TokenData, traitTypes: TraitType[]): {
    valid: boolean;
    clips: TraitType[][];
};
export declare function canSwap(token1: TokenData, token2: TokenData, type: TraitType): {
    swappable: boolean;
    message: undefined;
};
