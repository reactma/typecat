export const id = (a: any) => a

export interface Functor<T> {
  fmap<S>(f: (a: T) => S): Functor<S>
}

export interface Applicative<T> extends Functor<T> {
  applyMap(a: Applicative<T>): Applicative<any>
}

export interface Monad<T> extends Applicative<T> {
  flatMap<S>(f: (a: T) => Monad<S>): Monad<S>
}

export abstract class Option<T> implements Monad<T> {
  abstract _value?: T
  abstract fmap<S>(f: (a: T) => S): Functor<S>
  abstract applyMap(a: Applicative<T>): Applicative<any>
  abstract flatMap<S>(f: (a: T) => Monad<S>): Monad<S>

  *[Symbol.iterator]() {
    if (this instanceof Some) yield this._value
    else return
  }

  get(): T {
    if (this instanceof Some) return this._value
    else throw TypeError('Value not exist in None')
  }

  getOrElse(defaultValue: T): T {
    if (this instanceof Some) return this._value
    else return defaultValue
  }
}

export class Some<T> extends Option<T> {
  _value?: T
  constructor(a: T) {
    if (a === undefined || a === null)
      throw TypeError("Some can't be initated with undefined or null")

    super()
    this._value = a
  }

  fmap<S>(f: (a: T) => S): Some<S> {
    return new Some<S>(f(this._value!))
  }

  applyMap(a: Option<any>): Option<any> {
    if (a instanceof None) return new None()

    if (this._value === undefined || this._value === null) return new None()

    const f = (this as any)._value as (a: any) => any

    return new Some(f!(a._value))
  }

  flatMap<S>(f: (a: T) => Option<S>): Option<S> {
    return f(this._value!)
  }
}

export class None<T = any> extends Option<T> {
  _value?: T
  constructor() {
    super()
  }

  fmap<S>(f: any): Some<S> {
    return new None()
  }

  applyMap(a: any): Option<any> {
    return new None()
  }

  flatMap(f: any): Option<any> {
    return new None()
  }
}

export abstract class Either<T, S> implements Monad<S> {
  abstract _left?: T
  abstract _right?: S

  abstract fmap<U>(f: (a: S) => U): Functor<U>
  abstract applyMap(a: Applicative<any>): Applicative<any>
  abstract flatMap<U>(f: (a: S) => Monad<U>): Monad<U>

  *[Symbol.iterator](): any {
    if (this instanceof Right) yield this._right
    else return
  }

  get(): S {
    if (this instanceof Right && this._right !== undefined) return this._right
    else throw TypeError('Value not exist in Left')
  }

  getOrElse(defaultValue: S): S {
    if (this instanceof Right && this._right !== undefined) return this._right
    else return defaultValue
  }

  getLeft(): T {
    if (this instanceof Left) return this._left
    else throw TypeError('Left value not exist in Right')
  }

  getLeftOrElse(defaultValue: T): T {
    if (this._left !== undefined) return this._left
    else return defaultValue
  }
}

export class Left<T> extends Either<T, any> {
  _left?: T
  _right?: any

  constructor(a: T) {
    if (a === undefined || a === null)
      throw TypeError("Left can't be initated with undefined or null")

    super()
    this._left = a
    this._right = undefined
  }

  fmap<U>(f: any): Either<T, any> {
    return new Left(this._left!)
  }

  applyMap(a: any): Either<T, any> {
    return new Left(this._left!)
  }

  flatMap<U>(f: any): Either<T, U> {
    return new Left(this._left!)
  }
}

export class Right<S> extends Either<any, S> {
  _left?: any
  _right?: S

  constructor(a: S) {
    if (a === undefined || a === null)
      throw TypeError("Right can't be initated with undefined or null")
    super()
    this._left = undefined
    this._right = a
  }

  fmap<U>(f: (a: S) => U): Either<any, U> {
    return new Right<U>(f(this._right!))
  }

  applyMap(a: Either<any, any>): Either<any, any> {
    if (a instanceof Left) return a
    else {
      const f = (this as any)._right as (a: S) => any
      return new Right(f!(a._right!))
    }
  }

  flatMap<U>(f: (a: S) => Either<any, U>): Either<any, U> {
    return f(this._right!)
  }
}
