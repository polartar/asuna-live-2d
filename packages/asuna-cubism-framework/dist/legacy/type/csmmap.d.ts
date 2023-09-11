/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * A class that defines a key-value pair
 * Used for internal data of csmMap class.
 */
export declare class csmPair<_KeyT, _ValT> {
    /**
     * Constructor
     * @param key Value to set as Key
     * @param value The value to set as Value
     */
    constructor(key?: _KeyT, value?: _ValT);
    first: _KeyT;
    second: _ValT;
}
/**
 * Map type
 */
export declare class csmMap<_KeyT, _ValT> {
    /**
     * Constructor with arguments
     * @param size The size to be secured at the time of initialization
     */
    constructor(size?: number);
    /**
     * Destructor
     */
    release(): void;
    /**
     * Add key
     * @param key Newly added key
     */
    appendKey(key: _KeyT): void;
    /**
     * Overload (get) of subscript operator [key]
     * @param key Value value specified from the subscript
     */
    getValue(key: _KeyT): _ValT;
    /**
     * Overload of subscript operator [key] (set)
     * @param key Value value specified from the subscript
     * @param value Value value to be assigned
     */
    setValue(key: _KeyT, value: _ValT): void;
    /**
     * Does the element with the Key passed as an argument exist?
     * @param key key to confirm existence
     * @return true There is an element with the key passed as an argument
     * @return false The element with the key passed in the argument does not exist
     */
    isExist(key: _KeyT): boolean;
    /**
     * Release all keyValue pointers
     */
    clear(): void;
    /**
     * Get the size of the container
     *
     * @return Container size
     */
    getSize(): number;
    /**
     * Secure container capacity
     * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
     * @param fitToSize If true, fit to the specified size. If false, reserve twice the size.
     */
    prepareCapacity(newSize: number, fitToSize: boolean): void;
    /**
     * Returns the first element of the container
     */
    begin(): iterator<_KeyT, _ValT>;
    /**
     * Returns the end element of the container
     */
    end(): iterator<_KeyT, _ValT>;
    /**
     * Remove the element from the container
     *
     * @param ite element to delete
     */
    erase(ite: iterator<_KeyT, _ValT>): iterator<_KeyT, _ValT>;
    /**
     * Dump the container value as a 32-bit signed integer type
     */
    dumpAsInt(): void;
    static readonly DefaultSize = 10;
    _keyValues: csmPair<_KeyT, _ValT>[];
    _dummyValue: _ValT;
    _size: number;
}
/**
 * Iterator of csmMap <T>
 */
export declare class iterator<_KeyT, _ValT> {
    /**
     * Constructor
     */
    constructor(v?: csmMap<_KeyT, _ValT>, idx?: number);
    /**
     * = Operator overload
     */
    set(ite: iterator<_KeyT, _ValT>): iterator<_KeyT, _ValT>;
    /**
     * Preface ++ Operator overloading
     */
    preIncrement(): iterator<_KeyT, _ValT>;
    /**
     * Preface--Operator overload
     */
    preDecrement(): iterator<_KeyT, _ValT>;
    /**
     * Postscript ++ Operator overloading
     */
    increment(): iterator<_KeyT, _ValT>;
    /**
     * Postscript--Operator overload
     */
    decrement(): iterator<_KeyT, _ValT>;
    /**
     * * Operator overloading
     */
    ptr(): csmPair<_KeyT, _ValT>;
    /**
     *! = Operation
     */
    notEqual(ite: iterator<_KeyT, _ValT>): boolean;
    _index: number;
    _map: csmMap<_KeyT, _ValT>;
}
import * as $ from './csmmap';
export declare namespace Live2DCubismFramework {
    const csmMap: typeof $.csmMap;
    type csmMap<K, V> = $.csmMap<K, V>;
    const csmPair: typeof $.csmPair;
    type csmPair<K, V> = $.csmPair<K, V>;
    const iterator: typeof $.iterator;
    type iterator<K, V> = $.iterator<K, V>;
}
//# sourceMappingURL=csmmap.d.ts.map