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

export abstract class  Either<T,S> implements Monad<S> {
  abstract _left?: T
  abstract _right?: S

  abstract fmap(f: (a: S) => any): Functor<any>
  abstract  applyMap(a: Applicative<any>): Applicative<any>
    abstract flatMap(f: (a: S | undefined | null) => Monad<any>): Monad<any>

    *[Symbol.iterator](): any {
      if (this instanceof Right) yield this._right
      else return
    }
}

export class Left<T,S> extends Either<T,S> {

  _left?: T
  _right?: S

  constructor( a: T ) {
    super()
    this._left = a
    this._right = undefined
  }

  fmap( f: (a: S) => any) : Either<T, any> {
    return new Left(this._left)
  }

  applyMap( a: Either<T,S>) : Either<T, any> {
    return new Left(this._left)
  }

  flatMap( f: (a: S) => Either<T,any>) : Either<T, any> {
    return new Left(this._left)
  }

}

export class Right<T,S> extends Either<T,S> {

  _left?: T
  _right?: S

  constructor( a: S ) {
    super()
    this._left = undefined
    this._right = a
  }

  fmap(f: (a:S) => any) : Either<T, any> {
    return new Right<T, any>( f( this._right! ) )
  }

  applyMap( a: Either<T,any>) : Either<T, any> {

    if( a instanceof Left)
      return a
    else{
      const f = (this as any)._right as (a:S) => any
      return new Right( f!( a._right! ))
    }
  }

  flatMap( f: (a: S) => Either<T,any>) : Either<T, any> {
    return f(this._right!)
  }

}
