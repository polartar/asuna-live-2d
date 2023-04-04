"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.iterator = exports.csmVector = void 0;
/**
 * Vector type (variable array type)
 */
var csmVector = /** @class */ (function () {
    /**
     * Constructor with arguments
     * @param iniitalCapacity Capacity after initialization. The data size is _capacity * sizeof (T)
     * @param zeroClear If true, fill the area reserved at initialization with 0
     */
    function csmVector(initialCapacity) {
        if (initialCapacity === void 0) { initialCapacity = 0; }
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
    csmVector.prototype.at = function (index) {
        return this._ptr[index];
    };
    /**
     * Set elements
     * An index that sets the @param index element
     * @param value Element to set
     */
    csmVector.prototype.set = function (index, value) {
        this._ptr[index] = value;
    };
    /**
     * Get a container
     */
    csmVector.prototype.get = function (offset) {
        if (offset === void 0) { offset = 0; }
        var ret = new Array();
        for (var i = offset; i < this._size; i++) {
            ret.push(this._ptr[i]);
        }
        return ret;
    };
    /**
     * PushBack process, add new element to container
     * @param value Value added by PushBack processing
     */
    csmVector.prototype.pushBack = function (value) {
        if (this._size >= this._capacity) {
            this.prepareCapacity(this._capacity == 0 ? csmVector.s_defaultSize : this._capacity * 2);
        }
        this._ptr[this._size++] = value;
    };
    /**
     * Free all elements of the container
     */
    csmVector.prototype.clear = function () {
        this._ptr.length = 0;
        this._size = 0;
    };
    /**
     * Returns the number of elements in the container
     * @return Number of elements in the container
     */
    csmVector.prototype.getSize = function () {
        return this._size;
    };
    /**
     * Perform assignment processing for all elements of the container
     * @param newSize Size after assignment processing
     * @param value The value to assign to the element
     */
    csmVector.prototype.assign = function (newSize, value) {
        var curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
        }
        for (var i = 0; i < newSize; i++) {
            this._ptr[i] = value;
        }
        this._size = newSize;
    };
    /**
     * Resize
     */
    csmVector.prototype.resize = function (newSize, value) {
        this.updateSize(newSize, value, true);
    };
    /**
     * Resize
     */
    csmVector.prototype.updateSize = function (newSize, value, callPlacementNew) {
        if (value === void 0) { value = null; }
        if (callPlacementNew === void 0) { callPlacementNew = true; }
        var curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
            if (callPlacementNew) {
                for (var i = this._size; i < newSize; i++) {
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
                for (var i = this._size; i < newSize; i++) {
                    this._ptr[i] = value;
                }
            }
        }
        else {
            // newSize <= this._size
            //---
            var sub = this._size - newSize;
            this._ptr.splice(this._size - sub, sub); // Discard because it is unnecessary
        }
        this._size = newSize;
    };
    /**
     * Insert a container element into a container
     * @param position Insertion position
     * @param begin The starting position of the container to be inserted
     * @param end End position of the container to be inserted
     */
    csmVector.prototype.insert = function (position, begin, end) {
        var dstSi = position._index;
        var srcSi = begin._index;
        var srcEi = end._index;
        var addCount = srcEi - srcSi;
        this.prepareCapacity(this._size + addCount);
        // Shift existing data for insertion to create a gap
        var addSize = this._size - dstSi;
        if (addSize > 0) {
            for (var i = 0; i < addSize; i++) {
                this._ptr.splice(dstSi + i, 0, null);
            }
        }
        for (var i = srcSi; i < srcEi; i++, dstSi++) {
            this._ptr[dstSi] = begin._vector._ptr[i];
        }
        this._size = this._size + addCount;
    };
    /**
     * Remove the element specified by the index from the container
     * @param index Index value
     * @return true Delete execution
     * @return false Out of deletion range
     */
    csmVector.prototype.remove = function (index) {
        if (index < 0 || this._size <= index) {
            return false; // Out of deletion range
        }
        this._ptr.splice(index, 1);
        --this._size;
        return true;
    };
    /**
     * Remove an element from the container and shift other elements
     * @param ite element to delete
     */
    csmVector.prototype.erase = function (ite) {
        var index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // Out of deletion range
        }
        // delete
        this._ptr.splice(index, 1);
        --this._size;
        var ite2 = new iterator(this, index); // 終了
        return ite2;
    };
    /**
     * Secure container capacity
     * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
     */
    csmVector.prototype.prepareCapacity = function (newSize) {
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
    };
    /**
     * Returns the first element of the container
     */
    csmVector.prototype.begin = function () {
        var ite = this._size == 0 ? this.end() : new iterator(this, 0);
        return ite;
    };
    /**
     * Returns the end element of the container
     */
    csmVector.prototype.end = function () {
        var ite = new iterator(this, this._size);
        return ite;
    };
    csmVector.prototype.getOffset = function (offset) {
        var newVector = new csmVector();
        newVector._ptr = this.get(offset);
        newVector._size = this.get(offset).length;
        newVector._capacity = this.get(offset).length;
        return newVector;
    };
    csmVector.s_defaultSize = 10; // Default size for container initialization
    return csmVector;
}());
exports.csmVector = csmVector;
var iterator = /** @class */ (function () {
    /**
     * Constructor
     */
    function iterator(v, index) {
        this._vector = v != undefined ? v : null;
        this._index = index != undefined ? index : 0;
    }
    /**
     * Substitution
     */
    iterator.prototype.set = function (ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    };
    /**
     * Preface ++ Operation
     */
    iterator.prototype.preIncrement = function () {
        ++this._index;
        return this;
    };
    /**
     * Preface--Operation
     */
    iterator.prototype.preDecrement = function () {
        --this._index;
        return this;
    };
    /**
     * Postscript ++ operator
     */
    iterator.prototype.increment = function () {
        var iteold = new iterator(this._vector, this._index++); // Save the old value
        return iteold;
    };
    /**
     * Postscript--operator
     */
    iterator.prototype.decrement = function () {
        var iteold = new iterator(this._vector, this._index--); // Save the old value
        return iteold;
    };
    /**
     * ptr
     */
    iterator.prototype.ptr = function () {
        return this._vector._ptr[this._index];
    };
    /**
     * = Operator overload
     */
    iterator.prototype.substitution = function (ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    };
    /**
     *! = Operator overload
     */
    iterator.prototype.notEqual = function (ite) {
        return this._index != ite._index || this._vector != ite._vector;
    };
    return iterator;
}());
exports.iterator = iterator;
// Namespace definition for compatibility.
var $ = require("./csmvector");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmVector = $.csmVector;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
