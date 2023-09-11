/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { PhysicsJson } from '../../physics/Physics';
import { CubismVector2 } from '../math/cubismvector2';
import { CubismModel } from '../model/cubismmodel';
import { CubismPhysicsRig } from './cubismphysicsinternal';
/**
 * Physics class
 */
export declare class CubismPhysics {
    /**
     * Create an instance
     * @param buffer The buffer in which physics3.json is loaded
     * @param size Buffer size
     * @return Created instance
     */
    static create(json: PhysicsJson): CubismPhysics;
    /**
     * Destroy the instance
     * @param physics Instance to discard
     */
    static delete(physics: CubismPhysics): void;
    /**
     * Evaluation of physics
     * @param model A model that applies the results of physics operations
     * @param deltaTimeSeconds Delta time [seconds]
     */
    evaluate(model: CubismModel, deltaTimeSeconds: number): void;
    /**
     * Option settings
     * @param options options
     */
    setOptions(options: Options): void;
    /**
     * Get options
     * @return option
     */
    getOption(): Options;
    /**
     * Constructor
     */
    constructor();
    /**
     * Destructor-equivalent processing
     */
    release(): void;
    /**
     * Parse physics3.json.
     * @param physicsJson physics3. The buffer in which json is loaded
     * @param size Buffer size
     */
    parse(json: PhysicsJson): void;
    /**
     * initialize
     */
    initialize(): void;
    _physicsRig: CubismPhysicsRig;
    _options: Options;
}
/**
 * Physics options
 */
export declare class Options {
    constructor();
    gravity: CubismVector2;
    wind: CubismVector2;
}
import * as $ from './cubismphysics';
export declare namespace Live2DCubismFramework {
    const CubismPhysics: typeof $.CubismPhysics;
    type CubismPhysics = $.CubismPhysics;
    const Options: typeof $.Options;
    type Options = $.Options;
}
//# sourceMappingURL=cubismphysics.d.ts.map