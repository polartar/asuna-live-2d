/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * Vector type (variable array type)
 */
export class csmVector<T> {
  /**
   * Constructor with arguments
   * @param iniitalCapacity Capacity after initialization. The data size is _capacity * sizeof (T)
   * @param zeroClear If true, fill the area reserved at initialization with 0
   */
  constructor(initialCapacity = 0) {
    if (initialCapacity < 1) {
      this._ptr = [];
      this._capacity = 0;
      this._size = 0;
    } else {
      this._ptr = new Array(initialCapacity);
      this._capacity = initialCapacity;
      this._size = 0;
    }
  }

  /**
   * Returns the element specified by the index
   */
  public at(index: number): T {
    return this._ptr[index];
  }

  /**
   * Set elements
   * An index that sets the @param index element
   * @param value Element to set
   */
  public set(index: number, value: T): void {
    this._ptr[index] = value;
  }

  /**
   * Get a container
   */
  public get(offset = 0): T[] {
    const ret: T[] = new Array<T>();
    for (let i = offset; i < this._size; i++) {
      ret.push(this._ptr[i]);
    }
    return ret;
  }

  /**
   * PushBack process, add new element to container
   * @param value Value added by PushBack processing
   */
  public pushBack(value: T): void {
    if (this._size >= this._capacity) {
      this.prepareCapacity(
        this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2
      );
    }

    this._ptr[this._size++] = value;
  }

  /**
   * Free all elements of the container
   */
  public clear(): void {
    this._ptr.length = 0;
    this._size = 0;
  }

  /**
   * Returns the number of elements in the container
   * @return Number of elements in the container
   */
  public getSize(): number {
    return this._size;
  }

  /**
   * Perform assignment processing for all elements of the container
   * @param newSize Size after assignment processing
   * @param value The value to assign to the element
   */
  public assign(newSize: number, value: T): void {
    const curSize = this._size;

    if (curSize < newSize) {
      this.prepareCapacity(newSize); // capacity更新
    }

    for (let i = 0; i < newSize; i++) {
      this._ptr[i] = value;
    }

    this._size = newSize;
  }

  /**
   * Resize
   */
  public resize(newSize: number, value: T = null): void {
    this.updateSize(newSize, value, true);
  }

  /**
   * Resize
   */
  public updateSize(
    newSize: number,
    value: any = null,
    callPlacementNew = true
  ): void {
    const curSize: number = this._size;

    if (curSize < newSize) {
      this.prepareCapacity(newSize); // capacity更新

      if (callPlacementNew) {
        for (let i: number = this._size; i < newSize; i++) {
          if (typeof value == 'function') {
            // new
            this._ptr[i] = JSON.parse(JSON.stringify(new value()));
          } // Pass by value because it is a primitive type
          else {
            this._ptr[i] = value;
          }
        }
      } else {
        for (let i: number = this._size; i < newSize; i++) {
          this._ptr[i] = value;
        }
      }
    } else {
      // newSize <= this._size
      //---
      const sub = this._size - newSize;
      this._ptr.splice(this._size - sub, sub); // Discard because it is unnecessary
    }
    this._size = newSize;
  }

  /**
   * Insert a container element into a container
   * @param position Insertion position
   * @param begin The starting position of the container to be inserted
   * @param end End position of the container to be inserted
   */
  public insert(
    position: iterator<T>,
    begin: iterator<T>,
    end: iterator<T>
  ): void {
    let dstSi: number = position._index;
    const srcSi: number = begin._index;
    const srcEi: number = end._index;

    const addCount: number = srcEi - srcSi;

    this.prepareCapacity(this._size + addCount);

    // Shift existing data for insertion to create a gap
    const addSize = this._size - dstSi;
    if (addSize > 0) {
      for (let i = 0; i < addSize; i++) {
        this._ptr.splice(dstSi + i, 0, null);
      }
    }

    for (let i: number = srcSi; i < srcEi; i++, dstSi++) {
      this._ptr[dstSi] = begin._vector._ptr[i];
    }

    this._size = this._size + addCount;
  }

  /**
   * Remove the element specified by the index from the container
   * @param index Index value
   * @return true Delete execution
   * @return false Out of deletion range
   */
  public remove(index: number): boolean {
    if (index < 0 || this._size <= index) {
      return false; // Out of deletion range
    }

    this._ptr.splice(index, 1);
    --this._size;

    return true;
  }

  /**
   * Remove an element from the container and shift other elements
   * @param ite element to delete
   */
  public erase(ite: iterator<T>): iterator<T> {
    const index: number = ite._index;
    if (index < 0 || this._size <= index) {
      return ite; // Out of deletion range
    }

    // delete
    this._ptr.splice(index, 1);
    --this._size;

    const ite2: iterator<T> = new iterator<T>(this, index); // 終了
    return ite2;
  }

  /**
   * Secure container capacity
   * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
   */
  public prepareCapacity(newSize: number): void {
    if (newSize > this._capacity) {
      if (this._capacity == 0) {
        this._ptr = new Array(newSize);
        this._capacity = newSize;
      } else {
        this._ptr.length = newSize;
        this._capacity = newSize;
      }
    }
  }

  /**
   * Returns the first element of the container
   */
  public begin(): iterator<T> {
    const ite: iterator<T> =
      this._size == 0 ? this.end() : new iterator<T>(this, 0);
    return ite;
  }

  /**
   * Returns the end element of the container
   */
  public end(): iterator<T> {
    const ite: iterator<T> = new iterator<T>(this, this._size);
    return ite;
  }

  public getOffset(offset: number): csmVector<T> {
    const newVector = new csmVector<T>();
    newVector._ptr = this.get(offset);
    newVector._size = this.get(offset).length;
    newVector._capacity = this.get(offset).length;

    return newVector;
  }

  _ptr: T[]; // Container start address
  _size: number; // Number of elements in the container
  _capacity: number; // Container capacity

  static readonly s_defaultSize = 10; // Default size for container initialization
}

export class iterator<T> {
  /**
   * Constructor
   */
  public constructor(v?: csmVector<T>, index?: number) {
    this._vector = v != undefined ? v : null;
    this._index = index != undefined ? index : 0;
  }

  /**
   * Substitution
   */
  public set(ite: iterator<T>): iterator<T> {
    this._index = ite._index;
    this._vector = ite._vector;
    return this;
  }

  /**
   * Preface ++ Operation
   */
  public preIncrement(): iterator<T> {
    ++this._index;
    return this;
  }

  /**
   * Preface--Operation
   */
  public preDecrement(): iterator<T> {
    --this._index;
    return this;
  }

  /**
   * Postscript ++ operator
   */
  public increment(): iterator<T> {
    const iteold = new iterator<T>(this._vector, this._index++); // Save the old value
    return iteold;
  }

  /**
   * Postscript--operator
   */
  public decrement(): iterator<T> {
    const iteold = new iterator<T>(this._vector, this._index--); // Save the old value
    return iteold;
  }

  /**
   * ptr
   */
  public ptr(): T {
    return this._vector._ptr[this._index];
  }

  /**
   * = Operator overload
   */
  public substitution(ite: iterator<T>): iterator<T> {
    this._index = ite._index;
    this._vector = ite._vector;
    return this;
  }

  /**
   *! = Operator overload
   */
  public notEqual(ite: iterator<T>): boolean {
    return this._index != ite._index || this._vector != ite._vector;
  }

  _index: number; // Container index value
  _vector: csmVector<T>; // Container
}

// Namespace definition for compatibility.
import * as $ from './csmvector';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const csmVector = $.csmVector;
  export type csmVector<T> = $.csmVector<T>;
  export const iterator = $.iterator;
  export type iterator<T> = $.iterator<T>;
}