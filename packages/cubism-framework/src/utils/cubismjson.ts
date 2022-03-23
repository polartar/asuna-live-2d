/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { strtod } from '../live2dcubismframework';
import { csmMap, iterator as csmMap_iterator } from '../type/csmmap';
import { csmString } from '../type/csmstring';
import { csmVector, iterator as csmVector_iterator } from '../type/csmvector';
import { CubismLogInfo } from './cubismdebug';

// Initialize with StaticInitializeNotForClientCall ()
const CSM_JSON_ERROR_TYPE_MISMATCH = 'Error: type mismatch';
const CSM_JSON_ERROR_INDEX_OF_BOUNDS = 'Error: index out of bounds';

/**
 * Base class of the element of the parsed JSON element.
 */
export abstract class Value {
  /**
   * Constructor
   */
  public constructor() { }

  /**
   * Returns an element as a string type (csmString type)
   */
  public abstract getString(defaultValue?: string, indent?: string): string;

  /**
   * Returns the element as a string (string)
   */
  public getRawString(defaultValue?: string, indent?: string): string {
    return this.getString(defaultValue, indent);
  }

  /**
   * Returns an element as a number (number)
   */
  public toInt(defaultValue = 0): number {
    return defaultValue;
  }

  /**
   * Returns an element as a number (number)
   */
  public toFloat(defaultValue = 0): number {
    return defaultValue;
  }

  /**
   * Returns an element as a boolean
   */
  public toBoolean(defaultValue = false): boolean {
    return defaultValue;
  }

  /**
   * Returns size
   */
  public getSize(): number {
    return 0;
  }

  /**
   * Returns the element as an array (Value [])
   */
  public getArray(defaultValue: Value[] = null): Value[] {
    return defaultValue;
  }

  /**
   * Returns an element in a container (array)
   */
  public getVector(defaultValue = new csmVector<Value>()): csmVector<Value> {
    return defaultValue;
  }

  /**
   * Returns the element as a map (csmMap <csmString, Value>)
   */
  public getMap(defaultValue?: csmMap<string, Value>): csmMap<string, Value> {
    return defaultValue;
  }

  /**
   * Subscript operator [index]
   */
  public getValueByIndex(index: number): Value {
    return Value.errorValue.setErrorNotForClientCall(
      CSM_JSON_ERROR_TYPE_MISMATCH
    );
  }

  /**
   * Subscript operator [string | csmString]
   */
  public getValueByString(s: string | csmString): Value {
    return Value.nullValue.setErrorNotForClientCall(
      CSM_JSON_ERROR_TYPE_MISMATCH
    );
  }

  /**
   * Return map key list in container
   *
   * @return List of map keys
   */
  public getKeys(): csmVector<string> {
    return Value.s_dummyKeys;
  }

  /**
   * True if the Value type is an error value
   */
  public isError(): boolean {
    return false;
  }

  /**
   * True if the Value type is null
   */
  public isNull(): boolean {
    return false;
  }

  /**
   * True if the Value type is boolean
   */
  public isBool(): boolean {
    return false;
  }

  /**
   * True if the Value type is numeric
   */
  public isFloat(): boolean {
    return false;
  }

  /**
   * True if the Value type is a string
   */
  public isString(): boolean {
    return false;
  }

  /**
   * True if the Value type is an array
   */
  public isArray(): boolean {
    return false;
  }

  /**
   * True if the Value type is map type
   */
  public isMap(): boolean {
    return false;
  }

  /**
   * True if equal to the argument value
   */
  public equals(value: csmString): boolean;
  public equals(value: string): boolean;
  public equals(value: number): boolean;
  public equals(value: boolean): boolean;
  public equals(value: any): boolean {
    return false;
  }

  /**
   * True if the Value value is static, do not release if static
   */
  public isStatic(): boolean {
    return false;
  }

  /**
   * Set Value to the error value
   */
  public setErrorNotForClientCall(errorStr: string): Value {
    return JsonError.errorValue;
  }

  /**
   * Initialization method
   */
  public static staticInitializeNotForClientCall(): void {
    JsonBoolean.trueValue = new JsonBoolean(true);
    JsonBoolean.falseValue = new JsonBoolean(false);
    Value.errorValue = new JsonError('ERROR', true);
    Value.nullValue = new JsonNullvalue();
    Value.s_dummyKeys = new csmVector<string>();
  }

  /**
   * Release method
   */
  public static staticReleaseNotForClientCall(): void {
    JsonBoolean.trueValue = null;
    JsonBoolean.falseValue = null;
    Value.errorValue = null;
    Value.nullValue = null;
    Value.s_dummyKeys = null;
  }

  protected _stringBuffer: string; // string buffer

  private static s_dummyKeys: csmVector<string>; // ダミーキー

  public static errorValue: Value; // Error returned as a temporary return value. Do not delete until CubismFramework :: Dispose
  public static nullValue: Value; // NULL to return as a temporary return value. Do not delete until CubismFramework :: Dispose
}

/**
 * Minimal lightweight JSON parser that only supports Ascii characters.
 * The specification is a subset of JSON.
 * For loading configuration files (model3.json) etc.
 *
 * [Unsupported items]
 * ・ Non-ASCII characters such as Japanese
 * ・ Exponential notation by e
 */
export class CubismJson {
  /**
   * Constructor
   */
  public constructor(buffer?: ArrayBuffer, length?: number) {
    this._error = null;
    this._lineCount = 0;
    this._root = null;

    if (buffer != undefined) {
      this.parseBytes(buffer, length);
    }
  }

  /**
   * Load and parse directly from byte data
   *
   * @param buffer buffer
   * @param size Buffer size
   * @return An instance of the CubismJson class. NULL if failed
   */
  public static create(buffer: ArrayBuffer, size: number) {
    const json = new CubismJson();
    const succeeded: boolean = json.parseBytes(buffer, size);

    if (!succeeded) {
      CubismJson.delete(json);
      return null;
    } else {
      return json;
    }
  }

  /**
   * Release processing of parsed JSON object
   *
   * @param instance An instance of the CubismJson class
   */
  public static delete(instance: CubismJson) {
    instance = null;
  }

  /**
   * Returns the root element of the parsed JSON
   */
  public getRoot(): Value {
    return this._root;
  }

  /**
   * Convert Unicode binaries to String
   *
   * @param buffer Binary data to convert
   * @return Converted string
   */
  public arrayBufferToString(buffer: ArrayBuffer): string {
    const uint8Array: Uint8Array = new Uint8Array(buffer);
    let str = '';

    for (let i = 0, len: number = uint8Array.length; i < len; ++i) {
      str += '%' + this.pad(uint8Array[i].toString(16));
    }

    str = decodeURIComponent(str);
    return str;
  }

  /**
   * Encoding, padding
   */
  private pad(n: string): string {
    return n.length < 2 ? '0' + n : n;
  }

  /**
   * Perform JSON parsing
   * @param buffer Data bytes to be parsed
   * @param size Data byte size
   * return true : success
   * return false: failed
   */
  public parseBytes(buffer: ArrayBuffer, size: number): boolean {
    const endPos: number[] = new Array(1); // Array to pass by reference
    const decodeBuffer: string = this.arrayBufferToString(buffer);
    this._root = this.parseValue(decodeBuffer, size, 0, endPos);

    if (this._error) {
      let strbuf = '\0';
      strbuf = 'Json parse error : @line ' + (this._lineCount + 1) + '\n';
      this._root = new JsonString(strbuf);

      CubismLogInfo('{0}', this._root.getRawString());
      return false;
    } else if (this._root == null) {
      this._root = new JsonError(new csmString(this._error), false); // Since root is released, create an error object separately.
      return false;
    }
    return true;
  }

  /**
   * Returns the error value when parsing
   */
  public getParseError(): string {
    return this._error;
  }

  /**
   * Returns true if the next element after the root element is the end of the file
   */
  public checkEndOfFile(): boolean {
    return this._root.getArray()[1].equals('EOF');
  }

  /**
   * Parse Value (float, String, Value *, Array, null, true, false) from JSON element
   * Call ParseString (), ParseObject (), ParseArray () internally depending on the format of the element
   *
   * @param buffer JSON element buffer
   * @param length The length to parse
   * @param begin Position to start parsing
   * @param outEndPos Position at the end of parsing
   * @return Value object obtained from perspective
   */
  protected parseValue(
    buffer: string,
    length: number,
    begin: number,
    outEndPos: number[]
  ) {
    if (this._error) return null;

    let o: Value = null;
    let i: number = begin;
    let f: number;

    for (; i < length; i++) {
      const c: string = buffer[i];
      switch (c) {
        case '-':
        case '.':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          const afterString: string[] = new Array(1); // To pass by reference
          f = strtod(buffer.slice(i), afterString);
          outEndPos[0] = buffer.indexOf(afterString[0]);
          return new JsonFloat(f);
        }
        case '"':
          return new JsonString(
            this.parseString(buffer, length, i + 1, outEndPos)
          ); // From the next character of \ "
        case '[':
          o = this.parseArray(buffer, length, i + 1, outEndPos);
          return o;
        case '{':
          o = this.parseObject(buffer, length, i + 1, outEndPos);
          return o;
        case 'n': // Nothing but null
          if (i + 3 < length) {
            o = new JsonNullvalue(); // Allow to be released
            outEndPos[0] = i + 4;
          } else {
            this._error = 'parse null';
          }
          return o;
        case 't': // Nothing but true
          if (i + 3 < length) {
            o = JsonBoolean.trueValue;
            outEndPos[0] = i + 4;
          } else {
            this._error = 'parse true';
          }
          return o;
        case 'f': // Nothing but false
          if (i + 4 < length) {
            o = JsonBoolean.falseValue;
            outEndPos[0] = i + 5;
          } else {
            this._error = "illegal ',' position";
          }
          return o;
        case ',': // Array separator
          this._error = "illegal ',' position";
          return null;
        case ']': // Illegal} but skip. There seems to be an unnecessary, at the end of the array
          outEndPos[0] = i; // Reprocess the same character
          return null;
        case '\n':
          this._lineCount++;
        case ' ':
        case '\t':
        case '\r':
        default:
          // Skip
          break;
      }
    }

    this._error = 'illegal end of value';
    return null;
  }

  /**
   * Parse the string up to the next "" ".
   *
   * @param string-> String to be parsed
   * @param length-> length to parse
   * @param begin-> Position to start parsing
   * @param outEndPos-> Position at the end of parsing
   * @return parsed sentence F string element
   */
  protected parseString(
    string: string,
    length: number,
    begin: number,
    outEndPos: number[]
  ): string {
    if (this._error) return null;

    let i = begin;
    let c: string, c2: string;
    const ret: csmString = new csmString('');
    let bufStart: number = begin; // Start position of characters not registered in sbuf

    for (; i < length; i++) {
      c = string[i];

      switch (c) {
        case '"': {
          // Do not come here because the "end" and escape characters are processed separately
          outEndPos[0] = i + 1; // The next character of ”
          ret.append(string.slice(bufStart), i - bufStart); // Register up to the previous character
          return ret.s;
        }
        case '//': {
          // In case of escape
          i++; // Handle 2 characters as a set

          if (i - 1 > bufStart) {
            ret.append(string.slice(bufStart), i - bufStart); // Register up to the previous character
          }
          bufStart = i + 1; // From the character following the escape (2 characters)

          if (i < length) {
            c2 = string[i];

            switch (c2) {
              case '\\':
                ret.expansion(1, '\\');
                break;
              case '"':
                ret.expansion(1, '"');
                break;
              case '/':
                ret.expansion(1, '/');
                break;
              case 'b':
                ret.expansion(1, '\b');
                break;
              case 'f':
                ret.expansion(1, '\f');
                break;
              case 'n':
                ret.expansion(1, '\n');
                break;
              case 'r':
                ret.expansion(1, '\r');
                break;
              case 't':
                ret.expansion(1, '\t');
                break;
              case 'u':
                this._error = 'parse string/unicord escape not supported';
                break;
              default:
                break;
            }
          } else {
            this._error = 'parse string/escape error';
          }
        }
        default: {
          break;
        }
      }
    }

    this._error = 'parse string/illegal end';
    return null;
  }

  /**
   * Parse a JSON object element and return a Value object
   *
   * @param buffer JSON element buffer
   * @param length The length to parse
   * @param begin Position to start parsing
   * @param outEndPos Position at the end of parsing
   * @return Value object obtained from perspective
   */
  protected parseObject(
    buffer: string,
    length: number,
    begin: number,
    outEndPos: number[]
  ): Value {
    if (this._error) return null;
    const ret: JsonMap = new JsonMap();

    // Key: Value
    let key = '';
    let i: number = begin;
    let c = '';
    const localRetEndPos2: number[] = Array(1);
    let ok = false;

    // Loop as long as,
    for (; i < length; i++) {
      FOR_LOOP: for (; i < length; i++) {
        c = buffer[i];

        switch (c) {
          case '"':
            key = this.parseString(buffer, length, i + 1, localRetEndPos2);
            if (this._error) {
              return null;
            }

            i = localRetEndPos2[0];
            ok = true;
            break FOR_LOOP; //-get out of the loop
          case '}': // Closed parentheses
            outEndPos[0] = i + 1;
            return ret; // empty
          case ':':
            this._error = "illegal ':' position";
            break;
          case '\n':
            this._lineCount++;
          default:
            break; // Character to skip
        }
      }
      if (!ok) {
        this._error = 'key not found';
        return null;
      }

      ok = false;

      // : check
      FOR_LOOP2: for (; i < length; i++) {
        c = buffer[i];

        switch (c) {
          case ':':
            ok = true;
            i++;
            break FOR_LOOP2;
          case '}':
            this._error = "illegal '}' position";
            break;
          case '\n':
            this._lineCount++;
          // case ' ': case '\t' : case '\r':
          default:
            break; // Character to skip
        }
      }

      if (!ok) {
        this._error = "':' not found";
        return null;
      }

      // Check the value
      const value: Value = this.parseValue(buffer, length, i, localRetEndPos2);
      if (this._error) {
        return null;
      }

      i = localRetEndPos2[0];

      // ret.put(key, value);
      ret.put(key, value);

      FOR_LOOP3: for (; i < length; i++) {
        c = buffer[i];

        switch (c) {
          case ',':
            break FOR_LOOP3;
          case '}':
            outEndPos[0] = i + 1;
            return ret; // normal end
          case '\n':
            this._lineCount++;
          default:
            break; // skip
        }
      }
    }

    this._error = 'illegal end of perseObject';
    return null;
  }

  /**
   * Parse the string up to the next "" ".
   * @param buffer JSON element buffer
   * @param length The length to parse
   * @param begin Position to start parsing
   * @param outEndPos Position at the end of parsing
   * @return Value object obtained from perspective
   */
  protected parseArray(
    buffer: string,
    length: number,
    begin: number,
    outEndPos: number[]
  ): Value {
    if (this._error) return null;
    let ret: JsonArray = new JsonArray();

    // key : value
    let i: number = begin;
    let c: string;
    const localRetEndpos2: number[] = new Array(1);

    // Loop as long as,
    for (; i < length; i++) {
      // : check
      const value: Value = this.parseValue(buffer, length, i, localRetEndpos2);

      if (this._error) {
        return null;
      }
      i = localRetEndpos2[0];

      if (value) {
        ret.add(value);
      }

      // FOR_LOOP3:
      // boolean breakflag = false;
      FOR_LOOP: for (; i < length; i++) {
        c = buffer[i];

        switch (c) {
          case ',':
            // breakflag = true;
            // break; // To the next KEY, VAlUE
            break FOR_LOOP;
          case ']':
            outEndPos[0] = i + 1;
            return ret; // end
          case '\n':
            ++this._lineCount;
          //case ' ': case '\t': case '\r':
          default:
            break; // skip
        }
      }
    }

    ret = void 0;
    this._error = 'illegal end of parseObject';
    return null;
  }

  _error: string; // Error when parsing
  _lineCount: number; // Count the number of lines used for error reporting
  _root: Value; // parsed root element
}

/**
 * Treat parsed JSON elements as float values
 */
export class JsonFloat extends Value {
  /**
   * Constructor
   */
  constructor(v: number) {
    super();

    this._value = v;
  }

  /**
   * True if the Value type is numeric
   */
  public isFloat(): boolean {
    return true;
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string): string {
    const strbuf = '\ 0';
    this._value = parseFloat(strbuf);
    this._stringBuffer = strbuf;

    return this._stringBuffer;
  }

  /**
   * Returns an element as a number (number)
   */
  public toInt(defaultValue = 0): number {
    return parseInt(this._value.toString());
  }

  /**
   * Returns an element as a number (number)
   */
  public toFloat(defaultValue = 0.0): number {
    return this._value;
  }

  /**
   * True if equal to the argument value
   */
  public equals(value: csmString): boolean;
  public equals(value: string): boolean;
  public equals(value: number): boolean;
  public equals(value: boolean): boolean;
  public equals(value: any): boolean {
    if ('number' === typeof value) {
      // int
      if (Math.round(value)) {
        return false;
      }
      // float
      else {
        return value == this._value;
      }
    }
    return false;
  }

  private _value: number; // JSON element value
}

/**
 * Treat parsed JSON elements as boolean values
 */
export class JsonBoolean extends Value {
  /**
   * True if the Value type is boolean
   */
  public isBool(): boolean {
    return true;
  }

  /**
   * Returns an element as a boolean
   */
  public toBoolean(defaultValue = false): boolean {
    return this._boolValue;
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string): string {
    this._stringBuffer = this._boolValue ? 'true' : 'false';

    return this._stringBuffer;
  }

  /**
   * True if equal to the argument value
   */
  public equals(value: csmString): boolean;
  public equals(value: string): boolean;
  public equals(value: number): boolean;
  public equals(value: boolean): boolean;
  public equals(value: any): boolean {
    if ('boolean' === typeof value) {
      return value == this._boolValue;
    }
    return false;
  }

  /**
   * True if the Value value is static, do not release if static
   */
  public isStatic(): boolean {
    return true;
  }

  /**
   * Constructor with arguments
   */
  public constructor(v: boolean) {
    super();

    this._boolValue = v;
  }

  static trueValue: JsonBoolean; // true
  static falseValue: JsonBoolean; // false

  private _boolValue: boolean; // JSON element value
}

/**
 * Treat parsed JSON elements as strings
 */
export class JsonString extends Value {
  /**
   * Constructor with arguments
   */
  public constructor(s: string);
  public constructor(s: csmString);
  public constructor(s: any) {
    super();

    if ('string' === typeof s) {
      this._stringBuffer = s;
    }

    if (s instanceof csmString) {
      this._stringBuffer = s.s;
    }
  }

  /**
   * True if the Value type is a string
   */
  public isString(): boolean {
    return true;
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string): string {
    return this._stringBuffer;
  }

  /**
   * True if equal to the argument value
   */
  public equals(value: csmString): boolean;
  public equals(value: string): boolean;
  public equals(value: number): boolean;
  public equals(value: boolean): boolean;
  public equals(value: any): boolean {
    if ('string' === typeof value) {
      return this._stringBuffer == value;
    }

    if (value instanceof csmString) {
      return this._stringBuffer == value.s;
    }

    return false;
  }
}

/**
 * Error result when parsing JSON. Behave like a string
 */
export class JsonError extends JsonString {
  /**
   * True if the Value value is static, do not release if static
   */
  public isStatic(): boolean {
    return this._isStatic;
  }

  /**
   * Set error information
   */
  public setErrorNotForClientCall(s: string): Value {
    this._stringBuffer = s;
    return this;
  }

  /**
   * Constructor with arguments
   */
  public constructor(s: csmString | string, isStatic: boolean) {
    if ('string' === typeof s) {
      super(s);
    } else {
      super(s);
    }
    this._isStatic = isStatic;
  }

  /**
   * True if the Value type is an error value
   */
  public isError(): boolean {
    return true;
  }

  protected _isStatic: boolean; // Whether it is a static Value
}

/**
 * Have a parsed JSON element as a null value
 */
export class JsonNullvalue extends Value {
  /**
   * True if the Value type is null
   */
  public isNull(): boolean {
    return true;
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string): string {
    return this._stringBuffer;
  }

  /**
   * True if the Value value is static, do not release if static
   */
  public isStatic(): boolean {
    return true;
  }

  /**
   * Set Value to the error value
   */
  public setErrorNotForClientCall(s: string): Value {
    this._stringBuffer = s;
    return JsonError.nullValue;
  }

  /**
   * Constructor
   */
  public constructor() {
    super();

    this._stringBuffer = 'NullValue';
  }
}

/**
 * Have parsed JSON elements as an array
 */
export class JsonArray extends Value {
  /**
   * Constructor
   */
  public constructor() {
    super();
    this._array = new csmVector<Value>();
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    for (
      let ite: csmVector_iterator<Value> = this._array.begin();
      ite.notEqual(this._array.end());
      ite.preIncrement()
    ) {
      let v: Value = ite.ptr();

      if (v && !v.isStatic()) {
        v = void 0;
        v = null;
      }
    }
  }

  /**
   * True if the Value type is an array
   */
  public isArray(): boolean {
    return true;
  }

  /**
   * Subscript operator [index]
   */
  public getValueByIndex(index: number): Value {
    if (index < 0 || this._array.getSize() <= index) {
      return Value.errorValue.setErrorNotForClientCall(
        CSM_JSON_ERROR_INDEX_OF_BOUNDS
      );
    }

    const v: Value = this._array.at(index);

    if (v == null) {
      return Value.nullValue;
    }

    return v;
  }

  /**
   * Subscript operator [string | csmString]
   */
  public getValueByString(s: string | csmString): Value {
    return Value.errorValue.setErrorNotForClientCall(
      CSM_JSON_ERROR_TYPE_MISMATCH
    );
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string): string {
    const stringBuffer: string = indent + '[\n';

    for (
      let ite: csmVector_iterator<Value> = this._array.begin();
      ite.notEqual(this._array.end());
      ite.increment()
    ) {
      const v: Value = ite.ptr();
      this._stringBuffer += indent + '' + v.getString(indent + ' ') + '\n';
    }

    this._stringBuffer = stringBuffer + indent + ']\n';

    return this._stringBuffer;
  }

  /**
   * Add an array element
   * @param v Elements to add
   */
  public add(v: Value): void {
    this._array.pushBack(v);
  }

  /**
   * Returns the element in a container (csmVector <Value>)
   */
  public getVector(defaultValue: csmVector<Value> = null): csmVector<Value> {
    return this._array;
  }

  /**
   * Returns the number of elements
   */
  public getSize(): number {
    return this._array.getSize();
  }

  private _array: csmVector<Value>; // JSON element value
}

/**
 * Have a parsed JSON element as a map
 */
export class JsonMap extends Value {
  /**
   * Constructor
   */
  public constructor() {
    super();
    this._map = new csmMap<string, Value>();
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    const ite: csmMap_iterator<string, Value> = this._map.begin();

    while (ite.notEqual(this._map.end())) {
      let v: Value = ite.ptr().second;

      if (v && !v.isStatic()) {
        v = void 0;
        v = null;
      }

      ite.preIncrement();
    }
  }

  /**
   * True if the Value value is Map type
   */
  public isMap(): boolean {
    return true;
  }

  /**
   * Subscript operator [string | csmString]
   */
  public getValueByString(s: string | csmString): Value {
    if (s instanceof csmString) {
      const ret: Value = this._map.getValue(s.s);
      if (ret == null) {
        return Value.nullValue;
      }
      return ret;
    }

    for (
      let iter: csmMap_iterator<string, Value> = this._map.begin();
      iter.notEqual(this._map.end());
      iter.preIncrement()
    ) {
      if (iter.ptr().first == s) {
        if (iter.ptr().second == null) {
          return Value.nullValue;
        }
        return iter.ptr().second;
      }
    }

    return Value.nullValue;
  }

  /**
   * Subscript operator [index]
   */
  public getValueByIndex(index: number): Value {
    return Value.errorValue.setErrorNotForClientCall(
      CSM_JSON_ERROR_TYPE_MISMATCH
    );
  }

  /**
   * Returns an element as a string (csmString type)
   */
  public getString(defaultValue: string, indent: string) {
    this._stringBuffer = indent + '{\n';

    const ite: csmMap_iterator<string, Value> = this._map.begin();
    while (ite.notEqual(this._map.end())) {
      const key = ite.ptr().first;
      const v: Value = ite.ptr().second;

      this._stringBuffer +=
        indent + ' ' + key + ' : ' + v.getString(indent + '   ') + ' \n';
      ite.preIncrement();
    }

    this._stringBuffer += indent + '}\n';

    return this._stringBuffer;
  }

  /**
   * Returns an element as a Map type
   */
  public getMap(defaultValue?: csmMap<string, Value>): csmMap<string, Value> {
    return this._map;
  }

  /**
   * Add an element to the Map
   */
  public put(key: string, v: Value): void {
    this._map.setValue(key, v);
  }

  /**
   * Get a list of keys from Map
   */
  public getKeys(): csmVector<string> {
    if (!this._keys) {
      this._keys = new csmVector<string>();

      const ite: csmMap_iterator<string, Value> = this._map.begin();

      while (ite.notEqual(this._map.end())) {
        const key: string = ite.ptr().first;
        this._keys.pushBack(key);
        ite.preIncrement();
      }
    }
    return this._keys;
  }

  /**
   * Get the number of elements in Map
   */
  public getSize(): number {
    return this._keys.getSize();
  }

  private _map: csmMap<string, Value>; // JSON element value
  private _keys: csmVector<string>; // JSON element value
}

// Namespace definition for compatibility.
import * as $ from './cubismjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismJson = $.CubismJson;
  export type CubismJson = $.CubismJson;
  export const JsonArray = $.JsonArray;
  export type JsonArray = $.JsonArray;
  export const JsonBoolean = $.JsonBoolean;
  export type JsonBoolean = $.JsonBoolean;
  export const JsonError = $.JsonError;
  export type JsonError = $.JsonError;
  export const JsonFloat = $.JsonFloat;
  export type JsonFloat = $.JsonFloat;
  export const JsonMap = $.JsonMap;
  export type JsonMap = $.JsonMap;
  export const JsonNullvalue = $.JsonNullvalue;
  export type JsonNullvalue = $.JsonNullvalue;
  export const JsonString = $.JsonString;
  export type JsonString = $.JsonString;
  export const Value = $.Value;
  export type Value = $.Value;
}