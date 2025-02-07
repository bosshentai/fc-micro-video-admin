type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
type Value<Ok, Error> = Ok | Error;

export class Either<Ok = unknown, ErrorType = Error>
  implements Iterable<Value<Ok, ErrorType>>
{
  private _ok: Ok;
  private _error: ErrorType;

  private constructor(ok: Ok, error: ErrorType) {
    this._ok = ok;
    this._error = error;
  }

  get ok() {
    return this._ok;
  }

  get error() {
    return this._error;
  }

  isOk() {
    return this.ok !== null;
  }

  isFail() {
    return this.error !== null;
  }

  static safe<Ok = unknown, ErrorType = Error>(
    fn: () => Ok,
  ): Either<Ok, ErrorType> {
    try {
      return Either.ok(fn());
    } catch (error) {
      return Either.fail(error);
    }
  }

  static of<Ok, ErrorType = Error>(value: Ok): Either<Ok, ErrorType> {
    return Either.ok(value);
  }

  static ok<T, ErrorType = Error>(value: T): Either<T, ErrorType> {
    return new Either(value, null);
  }

  static fail<ErrorType = Error, Ok = unknown>(
    error: ErrorType,
  ): Either<Ok, ErrorType> {
    return new Either(null, error);
  }

  /**
   * Apply a transformation to the value of the Either when it is a Ok
   *
   * @param fn The function to apply to the value
   * @returns A new Either with the result of the transformation
   */
  map<NewOk>(fn: (value: Ok) => NewOk): Either<NewOk, ErrorType> {
    if (this.isOk()) {
      return Either.ok(fn(this.ok));
    } else {
      return Either.fail(this.error);
    }
  }

  /**
   * Apply a transformation to the value of the Either when it is a Ok
   *
   * @param fn The function to apply to the value
   * @returns A new Either with the result of the transformation
   *
   * If the value is a Ok, apply the transformation to the value.
   * If the result of the transformation is a Ok, return a new Ok with the result.
   * If the result of the transformation is a Fail, return a new Fail with the error.
   * If the value is a Fail, return the same Fail.
   */
  chain<NewOk, NewError = Error>(
    fn: (value: Ok) => Either<NewOk, NewError>,
  ): Either<NewOk, ErrorType | NewError> {
    if (this.isOk()) {
      return fn(this.ok);
    }
    return Either.fail(this.error);
  }

  /**
   * Apply a transformation to the value of the Either when it is a Ok and value is array
   *
   * @param fn The function to apply to the value
   * @returns A new Either with the result of the transformation
   *
   * If the value is not an array, throw an error.
   * If the result of the transformation have an error, return a fail with the first error.
   * If all the result of the transformation are ok, return a ok with the flatten result.
   */
  chainEach<NewOk, NewError>(
    fn: (value: Flatten<Ok>) => Either<Flatten<NewOk>, Flatten<NewError>>,
  ): Either<NewOk, ErrorType | NewError> {
    if (this.isOk()) {
      if (!Array.isArray(this.ok)) {
        throw new Error('Method chainEach only work with array');
      }

      const result = this.ok.map((o) => {
        return fn(o);
      });

      const errors = result.filter((r) => r.isFail());

      if (errors.length > 0) {
        return Either.fail(errors.map((e) => e.error) as unknown as ErrorType);
      }
      return Either.ok(result.map((r) => r.ok).flat() as unknown as NewOk);
    }

    return Either.fail(this.error);
  }

  asArray(): [Ok, ErrorType] {
    return [this.ok, this.error];
  }

  [Symbol.iterator](): Iterator<Value<Ok, ErrorType>, unknown, undefined> {
    return new EitherIterator({ ok: this.ok, error: this.error });
  }
}

class EitherIterator<Ok, Error>
  implements Iterator<Value<Ok, Error>, Value<Ok, Error>, undefined>
{
  private _value: { ok: Ok; error: Error };

  private index = 0;

  constructor(value: { ok: Ok; error: Error }) {
    this._value = value;
  }
  next(): IteratorResult<Value<Ok, Error>> {
    if (this.index === 0) {
      this.index++;
      return {
        value: this._value.ok,
        done: false,
      };
    }

    if (this.index === 1) {
      this.index++;
      return {
        value: this._value.error,
        done: false,
      };
    }

    return {
      value: null,
      done: true,
    };
  }
}
