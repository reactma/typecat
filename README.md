# TypeCat

## Introduction

TypeCat is a tiny, zero dependency TypeScript library that supplements the missing but very practical types (classes in TypeScript term) you can find in typical functional programming laugages such as Scala or Haskell:

- Option and subclasses Some and None
- Either and subclasses Left and Right

Classical functional operators fmap, applyMap ( applicative map as in Haskell ) and flatMap ( monad map as in Haskell and Scala ).

Iterator is also added so that you can use convenient `for` expression on the types.

The types and the operators meet the laws of Functor, Applicative and Monad.

### undefined and null

It is decided explicitly that Some / Right can't be initated with undefined and null. TypeError will throwed if tried.

The reason is to simplify and also streamline the functions used for fmap, applicativeMap and flatMap.

### Usage

### Install

`yarn add typecat`

or 

`npm install typecat`

### Use

```
import { id, Option, Some, None, Either, Left, Right } from 'typecat'

const option = new Some(3).fmap( ( i: number ) => i * 2 ) 

// option = Some( b )

for( const i of option ) 
    console.log( i )  // Console output 3
    
const failed = new Some( 0 ).
    flatMap( ( i: number ) => i === 0 ? new None() : new Some ( 1 / i ) ).
    fmap( (w: number) => `inverse is ${w}` )
    
    // failed = None

const either = new Right(25).fmap( ( i: number ) => i > 20 ? true : false )
    .flatMap( ( t: boolean ) => t ? Right( 'Ok' ) : Left( 'Fail' ) )
    
    // Either = Right('Ok')
    
const triplePlus = new Some( (a: number) => (b: number) => (c: number) => a + b + c )
const a = new Some(2)
const b = new Some(3)
const c = new Some(4)
const d = new None()

const plusedA = triplePlus.applyMap(a).applyMap(b).applyMap(c) // plusdA = Some( 2 + 3 + 4 )

const plusedB = triplePlus.applyMap(a).applyMap(b).applyMap(d) // plusedB = None()

```
