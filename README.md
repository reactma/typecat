# TypeCat


## Introduction 

TypeCat is a tiny, zero dependency TypeScript library that supplements the missing but very practical types (classes in TypeScript term) you can find in typical functional programming laugages such as Scala or Haskell:

- Option and subclasses Some and None
- Either and subclasses Left and Right

Classical functional operators fmap, applyMap ( applicative map as in Haskell ) and flatMap ( monad map as in Haskell and Scala ).

Iterator is also added so that you can use convenient `for` expression on the types.

The types and the operators meet the laws of Functor, Applicative and Monad.

### [Documentation @ Gitbook](https://typecat.gitbook.io/project/)

### undefined and null

It is decided explicitly that Some / Right can't be initiated with undefined and null. TypeError will throwned if tried.

The reason is to simplify and also streamline the functions used for fmap, applicativeMap and flatMap.

### get getOrElse, getLeft, getLeftOrElse

TypeCat provides methods to take out value from Option/Either

- get / getOrElse : Option / Either. If None or Left, get will throw exception. Use getOrElse (defaultValue)
- getLeft / getLeftOrElse: Either. If Right, getLeft will throw exception. Use getLeftOrElse(defaultValue)

### Usage

### Install

`yarn add typecat`

or 

`npm install typecat`

### Use

```
import { id, Option, Some, None, Either, Left, Right } from 'typecat'

const option = new Some(3).fmap( ( i: number ) => i * 2 ) 

// option = Some( 6 )

console.log( option )

for( const i of option ) 
    console.log( i )  // Console output 6
    
const failed = new Some( 0 ).
    flatMap( ( i: number ) => i === 0 ? new None() : new Some ( 1 / i ) ).
    fmap( (w: number) => `inverse is ${w}` )
    
    // failed = None

console.log(failed)

const succeeded = new Some( 10 ).
    flatMap( ( i: number ) => i === 0 ? new None() : new Some ( 1 / i ) ).
    fmap( (w: number) => `inverse is ${w}` )
    
    // succeeded = Some(0.1)
    
console.log(succeeded)

const either = new Right(25).fmap( ( i: number ) => i > 20 ? true : false )
    .flatMap( ( t: boolean ) => t ? new Right( 'Ok' ) : new Left( 'Fail' ) )
    
    // Either = Right('Ok')
const triplePlusF = (a: number) => (b: number) => (c: number) => a + b + c
const triplePlus = new Some(triplePlusF)
    
const a = new Some(2)
const b = new Some(3)
const c = new Some(4)
const d = new None()

const plusedA = triplePlus.applyMap(a).applyMap(b).applyMap(c) // plusdA = Some( 2 + 3 + 4 )

console.log(plusedA) // plusedA = Some(9)

const ra = plusedA.get() // ra = 9


const plusedB = triplePlus.applyMap(a).applyMap(b).applyMap(d) // plusedB = None()
const rb = plusedB.get() // Exception thrown : Value not exist in None
const rc = plusedB.getOrElse(0) // rc = 0

console.log(ra)
console.log(rb)
console.log(rc)

```
