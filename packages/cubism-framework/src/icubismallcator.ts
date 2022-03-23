/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * A class that abstracts memory allocation
 *
 * Implement memory allocation / release processing on the platform side
 * Interface for calling from the framework
 */
export abstract class ICubismAllocator {
  /**
   * Allocate heap memory without alignment constraints
   *
   * @param size Number of bytes to reserve
   * @return Address of memory allocated on success. Otherwise returns '0'
   */
  public abstract allocate(size: number): any;

  /**
   * Frees heap memory without alignment constraints.
   *
   * @param memory Address of memory to release
   */
  public abstract deallocate(memory: any): void;

  /**
   * Allocate heap memory with alignment constraints.
   * @param size Number of bytes to reserve
   * @param alignment Memory block alignment width
   * @return Address of memory allocated on success. Otherwise returns '0'
   */
  public abstract allocateAligned(size: number, alignment: number): any;

  /**
   * Frees heap memory with alignment constraints.
   * @param alignedMemory Address of memory to release
   */
  public abstract deallocateAligned(alignedMemory: any): void;
}

// Namespace definition for compatibility.
import * as $ from './icubismallcator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const ICubismAllocator = $.ICubismAllocator;
  export type ICubismAllocator = $.ICubismAllocator;
}