import { id, Option, Some, None, Either, Left, Right } from './index'

describe('id', () => {
  test('for any value, id returns exactly the same value', () => {
    class Person {
      private _name: string
      private _age: number

      constructor(name: string, age: number) {
        this._name = name
        this._age = age
      }

      public get name(): string {
        return this._name
      }

      public get age(): number {
        return this._age
      }
    }

    const jack = new Person('Jace London', 35)

    const plus = (a: number) => a + 1

    expect(id(0)).toBe(0)

    expect(id(undefined)).toBeUndefined()

    expect(id(null)).toBeNull()

    expect(id(plus)).toBe(plus)

    expect(id(jack)).toBe(jack)
  })
})

describe('Option functor', () => {
  test('Law: Some.fmap(id) === id(Some)', () => {
    const a = new Some(33)

    expect(a.fmap(id)).toEqual(id(a))
  })

  test('Law None.fmap(id) = id(None)', () => {
    const a = new None()

    expect(a.fmap(id)).toEqual(id(a))
  })

  test(' Some(a).fmap(f) === Some(f(a))', () => {
    const i = 5
    const a = new Some<number>(i)

    const f = (a: number | undefined | null) => a! + 2

    expect(a.fmap(f)).toEqual(new Some(f(i)))
  })

  test(' None.fmap(f) = None', () => {
    const a = new None()

    const f = (a: number) => a + 2

    expect(a.fmap(f)).toEqual(new None())
  })
})

describe('Option applicative', () => {
  test('Law Some(id).applyMap( Some(a)) = Some(id(a))', () => {
    const i = 33
    const a = new Some(i)

    expect(new Some(id).applyMap(a)).toEqual(new Some(id(i)))
  })

  test('Some(f).applyMap( Some(a)) = (Some(f(a))', () => {
    const i = 33
    const a = new Some(i)
    const f = (a: number) => a + 2

    expect(new Some(f).applyMap(a)).toEqual(new Some(f(i)))
  })

  test('Some(f(a,b)).applyMap( Some(a)).applyMap(Some(b)) = (Some(f(a,b))', () => {
    const i = 3
    const j = 4
    const a = new Some(i)
    const b = new Some(j)
    const f = (a: number) => (b: number) => a * 2 + b

    expect(new Some(f).applyMap(a).applyMap(b)).toEqual(new Some(f(i)(j)))
  })
})

describe('Option iterator', () => {
  test('for iterator of Some(a) equals a ', () => {
    const i = 33
    const a = new Some(i)

    for (const b of a) expect(b).toEqual(i)
  })

  test('for iterator of None, iterator return done immediately ', () => {
    const a = new None()

    let w = 0
    for (const b of a) {
      w = 1
    }
    expect(w).not.toBe(1)
  })
})

describe('Option monad', () => {
  test('Some(a).flatMap(f: (a)=>Some(b)) === Some(b) ', () => {
    const i = 33
    const a = new Some(i)

    const f = (a: number | undefined | null) => new Some(typeof a)

    expect(a.flatMap(f)).toEqual(f(i))
  })

  test('Some(a).flatMap(f: (a)=> None) === None ', () => {
    const a = new None()

    const f = (a: number | undefined | null) => new Some(typeof a)

    expect(a.flatMap(f)).toEqual(new None())
  })

  test('None.flatMap(f: (a)=>b) === None ', () => {
    const a = new None()

    const f = (a: number | undefined | null) => new Some(typeof a)

    expect(a.flatMap(f)).toEqual(new None())
  })
})

describe('Either functor', () => {
  test('Law: Right.fmap(id) === id(Right)', () => {
    const a = new Right(33)

    expect(a.fmap(id)).toEqual(id(a))
  })

  test('Law Left.fmap(id) = id(Left)', () => {
    const a = new Left(44)

    expect(a.fmap(id)).toEqual(id(a))
  })

  test(' Right(a).fmap(f) === Right(f(a))', () => {
    const i = 5
    const a = new Right<number>(i)

    const f = (a: number) => a + 2

    expect(a.fmap(f)).toEqual(new Right(f(i)))
  })

  test(' Left(a).fmap(f) === Left(a)', () => {
    const i = 5
    const a = new Left<number>(i)

    const f = (a: number) => a + 2

    expect(a.fmap(f)).toEqual(new Left(i))
  })
})

describe('Either applicative', () => {
  test('Law: Right.applyMap(Right(id)) === id(Right)', () => {
    const a = new Right(33)
    const rid = new Right(id)

    expect(rid.applyMap(a)).toEqual(id(a))
  })

  test('Law: Left.applyMap(Right(id)) === id(Left)', () => {
    const a = new Right(33)
    const lid = new Left(id)

    expect(lid.applyMap(a)).toEqual(id(new Left(id)))
  })

  test('Law: Right.applyMap(Left) === Left', () => {
    const a = new Right((a: number, b: number) => a + b)
    const b = new Left(45)

    expect(a.applyMap(b)).toEqual(b)
  })

  test('Law: Lefta.applyMap(Leftb) === Leftb', () => {
    const a = new Left((a: number, b: number) => a + b)
    const b = new Left(45)

    expect(a.applyMap(b)).toEqual(b)
  })
})

describe('Either monad', () => {
  test('Law: Right.flatMap( f:(a) => Right(b)  === Right(b)', () => {
    const i = 33
    const a = new Right(33)
    const f = (a: number) => new Right((a as any).toString())

    expect(a.flatMap(f)).toEqual(new Right(i.toString()))
  })

  test('Law: Left.flatMap( f:(a) => Right(b)  === Left', () => {
    const i = 33
    const a = new Left(i)
    const f = (a: number) => new Right((a as any).toString())

    expect(a.flatMap(f)).toEqual(new Left(i))
  })

  test('Law: Right.flatMap( f:(a) => Left(b)  === Left(b)', () => {
    const i = 33
    const a = new Right(33)
    const f = (a: number) => new Left(a * 2)

    expect(a.flatMap(f)).toEqual(new Left(i * 2))
  })

  test('Law: Left.flatMap( f:(a) => Left(b)  === Left', () => {
    const i = 33
    const a = new Left(i)
    const f = (a: number) => new Left((a as any).toString())

    expect(a.flatMap(f)).toEqual(new Left(i.toString()))
  })
})

describe('Extra None test cases ', () => {
  const option = new Some(3).fmap((i: number) => i * 2)

  console.log(option)

  for (const i of option) console.log(i)

  const failed = new Some(0)
    .flatMap((i: number) => (i === 0 ? new None() : new Some(1 / i)))
    .fmap((w: number) => `inverse is ${w}`)

  console.log(failed)
  // failed is None

  const succeeded = new Some(10)
    .flatMap((i: number) => (i === 0 ? new None() : new Some(1 / i)))
    .fmap((w: number) => `inverse is ${w}`)
  // succeeded = Some { _value: 'inverse is 0.1'}

  console.log(succeeded)

  const either = new Right(25)
    .fmap((i: number) => (i > 20 ? true : false))
    .flatMap((t: boolean) => (t ? new Right('Ok') : new Left('Fail')))

  console.log(either) // either = Right('Ok')

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

  const ra = (plusedA as Option<number>).get() // r = 9

  const plusedB = triplePlus
    .applyMap(a)
    .applyMap(b)
    .applyMap(d) // plusedB = None()
  const rb = (plusedB as Option<number>).get() // Exception thrown : Value not exist in None
  const rc = (plusedB as Option<number>).getOrElse(0) // rc = 0

  console.log(ra)
  console.log(rb)
  console.log(rc)
})
