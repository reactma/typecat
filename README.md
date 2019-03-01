# TypeCat

## Introduction

TypeCat is a tiny, zero dependency TypeScript library that supplements that missing but very practical types (classes in TypeScript term) you can find in typical functional programming laugages:

- Option and subclasses Some and None
- Either and subclasses Left and Right

Classical functional operators fmap, applyMap ( applicative map as in Haskell ) and flatMap ( monad map as in Haskell and Scala ).

Iterator is also added so that you can use convenient `for` expression on the types.

The types and the operators meet the laws of Functor, Applicative and Monad.

### Usage

### Install

`yarn add typecat`

or 

`npm install typecat`

### Use

```
import { id, Option, Some, None, Either, Left, Right } from 'typecat'

const option = new Some(3).fmap( ( i: number ) => i * 2 )

```

