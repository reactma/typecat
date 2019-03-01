export const id = (a: any) => a

export interface Functor<T> {
  fmap<S>(f: ( a: T) => S): Functor<S>
}

export interface Applicative<T> extends Functor<T> {
  applyMap(a: Applicative<T>): Applicative<any>
}

export interface Monad<T> extends Applicative<T> {
  flatMap<S>(f: (a: T) => Monad<S>): Monad<S>
}

export abstract class Option<T> implements Monad<T> {
  abstract _value? : T
  abstract fmap<S>(f: ( a: T) => S): Functor<S>
  abstract applyMap(a: Applicative<T>): Applicative<any>
  abstract flatMap<S>(f: (a: T) => Monad<S>): Monad<S>

    *[Symbol.iterator]() {
      if (this instanceof Some) yield this._value
      else return
    }

}

export class Some<T> extends Option<T> {

  _value? : T
  constructor( a : T ) {

    if( a === undefined || a === null )
      throw TypeError('Some can\'t be initated with undefined or null')

    super()
    this._value = a
    
  }

  fmap<S> (f:(a: T) => S): Some<S> {
    return new Some<S>(f( this._value! ))
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

  _value? : T
  constructor() {
    super()
  }

  fmap<S> ( f:any ): Some<S> {
    return new None()
  }

  applyMap(a: any): Option<any> {
    return new None()
  }

  flatMap(f: any): Option<any> {
    return new None()
  }
}


export abstract class  Either<T,S> implements Monad<S> {
  abstract _left?: T
  abstract _right?: S

  abstract fmap<U>(f: (a: S) => U): Functor<U>
  abstract  applyMap(a: Applicative<any>): Applicative<any>
    abstract flatMap<U>(f: (a: S) => Monad<U>): Monad<U>

    *[Symbol.iterator](): any {
      if (this instanceof Right) yield this._right
      else return
    }
}

export class Left<T> extends Either<T,any> {

  _left?: T
  _right?: any

  constructor( a: T ) {
    super()
    this._left = a
    this._right = undefined
  }

  fmap<U>( f:any) : Either<T, any> {
    return new Left(this._left)
  }

  applyMap( a: any) : Either<T, any> {
    return new Left(this._left)
  }

  flatMap<U>( f: any) : Either<T, U> {
    return new Left(this._left)
  }

}

export class Right<S> extends Either<any,S> {

  _left?: any
  _right?: S

  constructor( a: S ) {
    super()
    this._left = undefined
    this._right = a
  }

  fmap<U>(f: (a:S) => U) : Either<any, U> {
    return new Right<U>( f( this._right! ) )
  }

  applyMap( a: Either<any,any>) : Either<any, any> {

    if( a instanceof Left)
      return a
    else{
      const f = (this as any)._right as (a:S) => any
      return new Right( f!( a._right! ))
    }
  }

  flatMap<U>( f: (a: S) => Either<any,U>) : Either<any, U> {
    return f(this._right!)
  }

}

/*
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
*/
