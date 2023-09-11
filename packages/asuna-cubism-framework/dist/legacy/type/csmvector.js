/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * Vector type (variable array type)
 */
export class csmVector {
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
        }
        else {
            this._ptr = new Array(initialCapacity);
            this._capacity = initialCapacity;
            this._size = 0;
        }
    }
    /**
     * Returns the element specified by the index
     */
    at(index) {
        return this._ptr[index];
    }
    /**
     * Set elements
     * An index that sets the @param index element
     * @param value Element to set
     */
    set(index, value) {
        this._ptr[index] = value;
    }
    /**
     * Get a container
     */
    get(offset = 0) {
        const ret = new Array();
        for (let i = offset; i < this._size; i++) {
            ret.push(this._ptr[i]);
        }
        return ret;
    }
    /**
     * PushBack process, add new element to container
     * @param value Value added by PushBack processing
     */
    pushBack(value) {
        if (this._size >= this._capacity) {
            this.prepareCapacity(this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2);
        }
        this._ptr[this._size++] = value;
    }
    /**
     * Free all elements of the container
     */
    clear() {
        this._ptr.length = 0;
        this._size = 0;
    }
    /**
     * Returns the number of elements in the container
     * @return Number of elements in the container
     */
    getSize() {
        return this._size;
    }
    /**
     * Perform assignment processing for all elements of the container
     * @param newSize Size after assignment processing
     * @param value The value to assign to the element
     */
    assign(newSize, value) {
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
    resize(newSize, value) {
        this.updateSize(newSize, value, true);
    }
    /**
     * Resize
     */
    updateSize(newSize, value = null, callPlacementNew = true) {
        const curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
            if (callPlacementNew) {
                for (let i = this._size; i < newSize; i++) {
                    if (typeof value == 'function') {
                        // new
                        this._ptr[i] = JSON.parse(JSON.stringify(new value()));
                    } // Pass by value because it is a primitive type
                    else {
                        this._ptr[i] = value;
                    }
                }
            }
            else {
                for (let i = this._size; i < newSize; i++) {
                    this._ptr[i] = value;
                }
            }
        }
        else {
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
    insert(position, begin, end) {
        let dstSi = position._index;
        const srcSi = begin._index;
        const srcEi = end._index;
        const addCount = srcEi - srcSi;
        this.prepareCapacity(this._size + addCount);
        // Shift existing data for insertion to create a gap
        const addSize = this._size - dstSi;
        if (addSize > 0) {
            for (let i = 0; i < addSize; i++) {
                this._ptr.splice(dstSi + i, 0, null);
            }
        }
        for (let i = srcSi; i < srcEi; i++, dstSi++) {
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
    remove(index) {
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
    erase(ite) {
        const index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // Out of deletion range
        }
        // delete
        this._ptr.splice(index, 1);
        --this._size;
        const ite2 = new iterator(this, index); // 終了
        return ite2;
    }
    /**
     * Secure container capacity
     * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
     */
    prepareCapacity(newSize) {
        if (newSize > this._capacity) {
            if (this._capacity == 0) {
                this._ptr = new Array(newSize);
                this._capacity = newSize;
            }
            else {
                this._ptr.length = newSize;
                this._capacity = newSize;
            }
        }
    }
    /**
     * Returns the first element of the container
     */
    begin() {
        const ite = this._size == 0 ? this.end() : new iterator(this, 0);
        return ite;
    }
    /**
     * Returns the end element of the container
     */
    end() {
        const ite = new iterator(this, this._size);
        return ite;
    }
    getOffset(offset) {
        const newVector = new csmVector();
        newVector._ptr = this.get(offset);
        newVector._size = this.get(offset).length;
        newVector._capacity = this.get(offset).length;
        return newVector;
    }
}
csmVector.s_defaultSize = 10; // Default size for container initialization
export class iterator {
    /**
     * Constructor
     */
    constructor(v, index) {
        this._vector = v != undefined ? v : null;
        this._index = index != undefined ? index : 0;
    }
    /**
     * Substitution
     */
    set(ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    }
    /**
     * Preface ++ Operation
     */
    preIncrement() {
        ++this._index;
        return this;
    }
    /**
     * Preface--Operation
     */
    preDecrement() {
        --this._index;
        return this;
    }
    /**
     * Postscript ++ operator
     */
    increment() {
        const iteold = new iterator(this._vector, this._index++); // Save the old value
        return iteold;
    }
    /**
     * Postscript--operator
     */
    decrement() {
        const iteold = new iterator(this._vector, this._index--); // Save the old value
        return iteold;
    }
    /**
     * ptr
     */
    ptr() {
        return this._vector._ptr[this._index];
    }
    /**
     * = Operator overload
     */
    substitution(ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    }
    /**
     *! = Operator overload
     */
    notEqual(ite) {
        return this._index != ite._index || this._vector != ite._vector;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmvector';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmVector = $.csmVector;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmvector.js.map