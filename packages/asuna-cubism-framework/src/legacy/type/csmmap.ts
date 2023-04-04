/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

// import { CubismLogDebug } from '../utils/cubismdebug';

/**
 * A class that defines a key-value pair
 * Used for internal data of csmMap class.
 */
export class csmPair<_KeyT, _ValT> {
  /**
   * Constructor
   * @param key Value to set as Key
   * @param value The value to set as Value
   */
  public constructor(key?: _KeyT, value?: _ValT) {
    this.first = key == undefined ? null as any : key;

    this.second = value == undefined ? null as any : value;
  }

  public first: _KeyT; // Variable used as key
  public second: _ValT; // Variable used as value
}

/**
 * Map type
 */
export class csmMap<_KeyT, _ValT> {
  /**
   * Constructor with arguments
   * @param size The size to be secured at the time of initialization
   */
  public constructor(size?: number) {
    if (size != undefined) {
      if (size < 1) {
        this._keyValues = [];
        this._size = 0;
      } else {
        this._keyValues = new Array(size);
        this._size = size;
      }
    } else {
      this._keyValues = [];
      this._size = 0;
    }
    this._dummyValue = null as any;
  }

  /**
   * Destructor
   */
  public release() {
    this.clear();
  }

  /**
   * Add key
   * @param key Newly added key
   */
  public appendKey(key: _KeyT): void {
    // Create a new Key / Value pair
    this.prepareCapacity(this._size + 1, false); // Make a gap for one or more
    // The index of the new key / value is _size

    this._keyValues[this._size] = new csmPair<_KeyT, _ValT>(key);
    this._size += 1;
  }

  /**
   * Overload (get) of subscript operator [key]
   * @param key Value value specified from the subscript
   */
  public getValue(key: _KeyT): _ValT {
    let found = -1;

    for (let i = 0; i < this._size; i++) {
      if (this._keyValues[i].first == key) {
        found = i;
        break;
      }
    }

    if (found >= 0) {
      return this._keyValues[found].second;
    } else {
      this.appendKey(key); // Add a new key
      return this._keyValues[this._size - 1].second;
    }
  }

  /**
   * Overload of subscript operator [key] (set)
   * @param key Value value specified from the subscript
   * @param value Value value to be assigned
   */
  public setValue(key: _KeyT, value: _ValT): void {
    let found = -1;

    for (let i = 0; i < this._size; i++) {
      if (this._keyValues[i].first == key) {
        found = i;
        break;
      }
    }

    if (found >= 0) {
      this._keyValues[found].second = value;
    } else {
      this.appendKey(key); // Add a new key
      this._keyValues[this._size - 1].second = value;
    }
  }

  /**
   * Does the element with the Key passed as an argument exist?
   * @param key key to confirm existence
   * @return true There is an element with the key passed as an argument
   * @return false The element with the key passed in the argument does not exist
   */
  public isExist(key: _KeyT): boolean {
    for (let i = 0; i < this._size; i++) {
      if (this._keyValues[i].first == key) {
        return true;
      }
    }
    return false;
  }

  /**
   * Release all keyValue pointers
   */
  public clear(): void {
    this._keyValues = void 0 as any;
    this._keyValues = null as any;
    this._keyValues = [];

    this._size = 0;
  }

  /**
   * Get the size of the container
   *
   * @return Container size
   */
  public getSize(): number {
    return this._size;
  }

  /**
   * Secure container capacity
   * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
   * @param fitToSize If true, fit to the specified size. If false, reserve twice the size.
   */
  public prepareCapacity(newSize: number, fitToSize: boolean): void {
    if (newSize > this._keyValues.length) {
      if (this._keyValues.length == 0) {
        if (!fitToSize && newSize < csmMap.DefaultSize)
          newSize = csmMap.DefaultSize;
        this._keyValues.length = newSize;
      } else {
        if (!fitToSize && newSize < this._keyValues.length * 2)
          newSize = this._keyValues.length * 2;
        this._keyValues.length = newSize;
      }
    }
  }

  /**
   * Returns the first element of the container
   */
  public begin(): iterator<_KeyT, _ValT> {
    const ite: iterator<_KeyT, _ValT> = new iterator<_KeyT, _ValT>(this, 0);
    return ite;
  }

  /**
   * Returns the end element of the container
   */
  public end(): iterator<_KeyT, _ValT> {
    const ite: iterator<_KeyT, _ValT> = new iterator<_KeyT, _ValT>(
      this,
      this._size
    ); // end
    return ite;
  }

  /**
   * Remove the element from the container
   *
   * @param ite element to delete
   */
  public erase(ite: iterator<_KeyT, _ValT>): iterator<_KeyT, _ValT> {
    const index: number = ite._index;
    if (index < 0 || this._size <= index) {
      return ite; // Out of deletion range
    }

    // delete
    this._keyValues.splice(index, 1);
    --this._size;

    const ite2: iterator<_KeyT, _ValT> = new iterator<_KeyT, _ValT>(
      this,
      index
    ); // end
    return ite2;
  }

  /**
   * Dump the container value as a 32-bit signed integer type
   */
  public dumpAsInt() {
    for (let i = 0; i < this._size; i++) {
      // CubismLogDebug('{0} ,', this._keyValues[i]);
      // CubismLogDebug('\n');
    }
  }

  public static readonly DefaultSize = 10; // Default size for container initialization
  public _keyValues: csmPair<_KeyT, _ValT>[]; // Array of key-value pairs
  public _dummyValue: _ValT; // Dummy to return an empty value
  public _size: number; // Number of elements in the container
}

/**
 * Iterator of csmMap <T>
 */
export class iterator<_KeyT, _ValT> {
  /**
   * Constructor
   */
  constructor(v?: csmMap<_KeyT, _ValT>, idx?: number) {
    this._map = v != undefined ? v : new csmMap<_KeyT, _ValT>();

    this._index = idx != undefined ? idx : 0;
  }

  /**
   * = Operator overload
   */
  public set(ite: iterator<_KeyT, _ValT>): iterator<_KeyT, _ValT> {
    this._index = ite._index;
    this._map = ite._map;
    return this;
  }

  /**
   * Preface ++ Operator overloading
   */
  public preIncrement(): iterator<_KeyT, _ValT> {
    ++this._index;
    return this;
  }

  /**
   * Preface--Operator overload
   */
  public preDecrement(): iterator<_KeyT, _ValT> {
    --this._index;
    return this;
  }

  /**
   * Postscript ++ Operator overloading
   */
  public increment(): iterator<_KeyT, _ValT> {
    const iteold = new iterator<_KeyT, _ValT>(this._map, this._index++); // Save the old value
    return iteold;
  }

  /**
   * Postscript--Operator overload
   */
  public decrement(): iterator<_KeyT, _ValT> {
    const iteold = new iterator<_KeyT, _ValT>(this._map, this._index); // Save the old value
    this._map = iteold._map;
    this._index = iteold._index;
    return this;
  }

  /**
   * * Operator overloading
   */
  public ptr(): csmPair<_KeyT, _ValT> {
    return this._map._keyValues[this._index];
  }

  /**
   *! = Operation
   */
  public notEqual(ite: iterator<_KeyT, _ValT>): boolean {
    return this._index != ite._index || this._map != ite._map;
  }

  _index: number; // Container index value
  _map: csmMap<_KeyT, _ValT>; // Container
}

// Namespace definition for compatibility.
import * as $ from './csmmap';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const csmMap = $.csmMap;
  export type csmMap<K, V> = $.csmMap<K, V>;
  export const csmPair = $.csmPair;
  export type csmPair<K, V> = $.csmPair<K, V>;
  export const iterator = $.iterator;
  export type iterator<K, V> = $.iterator<K, V>;
}