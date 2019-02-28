export const id = (a: any) => a

export interface Functor<T> {
  fmap(f: (a: T) => any): Functor<any>
}

export interface Applicative<T> extends Functor<T> {
  applyMap(a: Applicative<any>): Applicative<any>
}

export interface Monad<T> extends Applicative<T> {
  flatMap(f: (a: T | undefined | null) => Monad<any>): Monad<any>
}

export abstract class Option<T> implements Monad<T> {
  abstract _a: T | undefined | null

  abstract fmap(f: (a: T) => any): Functor<any>

  abstract applyMap(af: Option<T>): Option<any>

  abstract flatMap(f: (a: T | undefined | null) => Option<any>): Option<any>

  *[Symbol.iterator]() {
    if (this instanceof Some) yield this._a
    else return
  }
}

export class Some<T> extends Option<T> {
  _a: T | undefined | null

  constructor(a: T) {
    super()
    this._a = a
  }

  fmap(f: (a: T) => any): Option<any> {
    return new Some(f(this._a!))
  }

  applyMap(a: Option<any>): Option<any> {
    if (a instanceof None) return new None()

    const f = (this as any)._a as (a: T) => any

    if (f === undefined) return new None()
    else return new Some(f!(a._a))
  }

  flatMap(f: (a: T | undefined | null) => Option<any>): Option<any> {
    return f(this._a)
  }
}

export class None<T = any> extends Option<T> {
  _a: T | undefined | null
  constructor() {
    super()
    this._a = undefined
  }

  fmap(f: (a: T) => any): Option<any> {
    return new None()
  }

  applyMap(a: Option<any>): Option<any> {
    return new None()
  }

  flatMap(f: (a: T | undefined | null) => Option<any>): Option<any> {
    return new None()
  }
}
