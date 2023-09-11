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
export class csmPair {
    /**
     * Constructor
     * @param key Value to set as Key
     * @param value The value to set as Value
     */
    constructor(key, value) {
        this.first = key == undefined ? null : key;
        this.second = value == undefined ? null : value;
    }
}
/**
 * Map type
 */
export class csmMap {
    /**
     * Constructor with arguments
     * @param size The size to be secured at the time of initialization
     */
    constructor(size) {
        if (size != undefined) {
            if (size < 1) {
                this._keyValues = [];
                this._size = 0;
            }
            else {
                this._keyValues = new Array(size);
                this._size = size;
            }
        }
        else {
            this._keyValues = [];
            this._size = 0;
        }
        this._dummyValue = null;
    }
    /**
     * Destructor
     */
    release() {
        this.clear();
    }
    /**
     * Add key
     * @param key Newly added key
     */
    appendKey(key) {
        // Create a new Key / Value pair
        this.prepareCapacity(this._size + 1, false); // Make a gap for one or more
        // The index of the new key / value is _size
        this._keyValues[this._size] = new csmPair(key);
        this._size += 1;
    }
    /**
     * Overload (get) of subscript operator [key]
     * @param key Value value specified from the subscript
     */
    getValue(key) {
        let found = -1;
        for (let i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            return this._keyValues[found].second;
        }
        else {
            this.appendKey(key); // Add a new key
            return this._keyValues[this._size - 1].second;
        }
    }
    /**
     * Overload of subscript operator [key] (set)
     * @param key Value value specified from the subscript
     * @param value Value value to be assigned
     */
    setValue(key, value) {
        let found = -1;
        for (let i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            this._keyValues[found].second = value;
        }
        else {
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
    isExist(key) {
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
    clear() {
        this._keyValues = void 0;
        this._keyValues = null;
        this._keyValues = [];
        this._size = 0;
    }
    /**
     * Get the size of the container
     *
     * @return Container size
     */
    getSize() {
        return this._size;
    }
    /**
     * Secure container capacity
     * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
     * @param fitToSize If true, fit to the specified size. If false, reserve twice the size.
     */
    prepareCapacity(newSize, fitToSize) {
        if (newSize > this._keyValues.length) {
            if (this._keyValues.length == 0) {
                if (!fitToSize && newSize < csmMap.DefaultSize)
                    newSize = csmMap.DefaultSize;
                this._keyValues.length = newSize;
            }
            else {
                if (!fitToSize && newSize < this._keyValues.length * 2)
                    newSize = this._keyValues.length * 2;
                this._keyValues.length = newSize;
            }
        }
    }
    /**
     * Returns the first element of the container
     */
    begin() {
        const ite = new iterator(this, 0);
        return ite;
    }
    /**
     * Returns the end element of the container
     */
    end() {
        const ite = new iterator(this, this._size); // end
        return ite;
    }
    /**
     * Remove the element from the container
     *
     * @param ite element to delete
     */
    erase(ite) {
        const index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // Out of deletion range
        }
        // delete
        this._keyValues.splice(index, 1);
        --this._size;
        const ite2 = new iterator(this, index); // end
        return ite2;
    }
    /**
     * Dump the container value as a 32-bit signed integer type
     */
    dumpAsInt() {
        for (let i = 0; i < this._size; i++) {
            // CubismLogDebug('{0} ,', this._keyValues[i]);
            // CubismLogDebug('\n');
        }
    }
}
csmMap.DefaultSize = 10; // Default size for container initialization
/**
 * Iterator of csmMap <T>
 */
export class iterator {
    /**
     * Constructor
     */
    constructor(v, idx) {
        this._map = v != undefined ? v : new csmMap();
        this._index = idx != undefined ? idx : 0;
    }
    /**
     * = Operator overload
     */
    set(ite) {
        this._index = ite._index;
        this._map = ite._map;
        return this;
    }
    /**
     * Preface ++ Operator overloading
     */
    preIncrement() {
        ++this._index;
        return this;
    }
    /**
     * Preface--Operator overload
     */
    preDecrement() {
        --this._index;
        return this;
    }
    /**
     * Postscript ++ Operator overloading
     */
    increment() {
        const iteold = new iterator(this._map, this._index++); // Save the old value
        return iteold;
    }
    /**
     * Postscript--Operator overload
     */
    decrement() {
        const iteold = new iterator(this._map, this._index); // Save the old value
        this._map = iteold._map;
        this._index = iteold._index;
        return this;
    }
    /**
     * * Operator overloading
     */
    ptr() {
        return this._map._keyValues[this._index];
    }
    /**
     *! = Operation
     */
    notEqual(ite) {
        return this._index != ite._index || this._map != ite._map;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmmap';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmMap = $.csmMap;
    Live2DCubismFramework.csmPair = $.csmPair;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmmap.js.map