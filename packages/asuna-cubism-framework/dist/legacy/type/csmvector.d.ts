/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * Vector type (variable array type)
 */
export declare class csmVector<T> {
    /**
     * Constructor with arguments
     * @param iniitalCapacity Capacity after initialization. The data size is _capacity * sizeof (T)
     * @param zeroClear If true, fill the area reserved at initialization with 0
     */
    constructor(initialCapacity?: number);
    /**
     * Returns the element specified by the index
     */
    at(index: number): T;
    /**
     * Set elements
     * An index that sets the @param index element
     * @param value Element to set
     */
    set(index: number, value: T): void;
    /**
     * Get a container
     */
    get(offset?: number): T[];
    /**
     * PushBack process, add new element to container
     * @param value Value added by PushBack processing
     */
    pushBack(value: T): void;
    /**
     * Free all elements of the container
     */
    clear(): void;
    /**
     * Returns the number of elements in the container
     * @return Number of elements in the container
     */
    getSize(): number;
    /**
     * Perform assignment processing for all elements of the container
     * @param newSize Size after assignment processing
     * @param value The value to assign to the element
     */
    assign(newSize: number, value: T): void;
    /**
     * Resize
     */
    resize(newSize: number, value: T): void;
    /**
     * Resize
     */
    updateSize(newSize: number, value?: any, callPlacementNew?: boolean): void;
    /**
     * Insert a container element into a container
     * @param position Insertion position
     * @param begin The starting position of the container to be inserted
     * @param end End position of the container to be inserted
     */
    insert(position: iterator<T>, begin: iterator<T>, end: iterator<T>): void;
    /**
     * Remove the element specified by the index from the container
     * @param index Index value
     * @return true Delete execution
     * @return false Out of deletion range
     */
    remove(index: number): boolean;
    /**
     * Remove an element from the container and shift other elements
     * @param ite element to delete
     */
    erase(ite: iterator<T>): iterator<T>;
    /**
     * Secure container capacity
     * @param newSize New capacity. If the value of the argument is less than the current size, do nothing.
     */
    prepareCapacity(newSize: number): void;
    /**
     * Returns the first element of the container
     */
    begin(): iterator<T>;
    /**
     * Returns the end element of the container
     */
    end(): iterator<T>;
    getOffset(offset: number): csmVector<T>;
    _ptr: T[];
    _size: number;
    _capacity: number;
    static readonly s_defaultSize = 10;
}
export declare class iterator<T> {
    /**
     * Constructor
     */
    constructor(v?: csmVector<T>, index?: number);
    /**
     * Substitution
     */
    set(ite: iterator<T>): iterator<T>;
    /**
     * Preface ++ Operation
     */
    preIncrement(): iterator<T>;
    /**
     * Preface--Operation
     */
    preDecrement(): iterator<T>;
    /**
     * Postscript ++ operator
     */
    increment(): iterator<T>;
    /**
     * Postscript--operator
     */
    decrement(): iterator<T>;
    /**
     * ptr
     */
    ptr(): T;
    /**
     * = Operator overload
     */
    substitution(ite: iterator<T>): iterator<T>;
    /**
     *! = Operator overload
     */
    notEqual(ite: iterator<T>): boolean;
    _index: number;
    _vector: csmVector<T>;
}
import * as $ from './csmvector';
export declare namespace Live2DCubismFramework {
    const csmVector: typeof $.csmVector;
    type csmVector<T> = $.csmVector<T>;
    const iterator: typeof $.iterator;
    type iterator<T> = $.iterator<T>;
}
//# sourceMappingURL=csmvector.d.ts.map