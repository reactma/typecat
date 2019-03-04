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
  abstract fmap<S>(f: (a: T) => S): Option<S>
  abstract applyMap(a: Option<T>): Option<any>
  abstract flatMap<S>(f: (a: T) => Monad<S>): Monad<S>
  abstract [Symbol.iterator](): IterableIterator<T>
  abstract get(): T
  abstract getOrElse(defaultValue: T): T
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

    const f = (this as any)._value as (a: any) => any

    return new Some(f!(a._value))
  }

  flatMap<S>(f: (a: T) => Option<S>): Option<S> {
    return f(this._value!)
  }

  get(): T {
    return this._value!
  }

  getOrElse(defaultValue: T): T {
    return this._value!
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield this._value!
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

  get(): T {
    throw TypeError('Value not exist in None')
  }

  getOrElse(defaultValue: T): T {
    return defaultValue
  }

  *[Symbol.iterator](): IterableIterator<T> {
    return
  }
}

export abstract class Either<T, S> implements Monad<S> {
  abstract _left?: T
  abstract _right?: S

  abstract fmap<U>(f: (a: S) => U): Either<T, U>
  abstract applyMap(a: Either<T, any>): Either<T, any>
  abstract flatMap<U>(f: (a: S) => Either<T, U>): Either<T, U>
  abstract [Symbol.iterator](): IterableIterator<S>

  abstract get(): S

  abstract getOrElse(defaultValue: S): S

  abstract getLeft(): T

  abstract getLeftOrElse(defaultValue: T): T
}

export class Left<T, S = any> extends Either<T, S> {
  _left?: T
  _right?: S

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

  applyMap(f: any): Either<T, any> {
    return new Left(this._left!)
  }

  flatMap<U>(f: any): Either<T, U> {
    return new Left(this._left!)
  }

  get(): S {
    throw TypeError('Value not exist in Left')
  }

  getOrElse(defaultValue: S): S {
    return defaultValue
  }

  getLeft(): T {
    return this._left!
  }

  getLeftOrElse(defaultValue: T): T {
    return this._left!
  }

  *[Symbol.iterator](): IterableIterator<any> {
    return
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

  get(): S {
    return this._right!
  }

  getOrElse(defaultValue: S): S {
    return this._right!
  }

  getLeft(): any {
    throw TypeError('Left value not exist in Right')
  }

  getLeftOrElse(defaultValue: any): any {
    return defaultValue
  }

  *[Symbol.iterator](): IterableIterator<S> {
    return this._right!
  }
}

const triplePlusF = (a: number) => (b: number) => (c: number) => a + b + c
const triplePlus = new Some(triplePlusF)
const a = new Some(2)
const b = new Some(3)
const c = new Some(4)
const d = new None()

const plusedA = triplePlus
  .applyMap(a)
  .applyMap(b)
  .applyMap(c) // plusdA = Some( 2 + 3 + 4 )

console.log(plusedA) // plusedA = Some(9)

console.log('plusedA is Option? ', plusedA instanceof Option)
const ra = plusedA.get() // r = 9
console.log(ra)
