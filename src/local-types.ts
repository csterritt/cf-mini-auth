import { Maybe } from 'true-myth'

export type Bindings = {
  DB: D1Database
  Session: Maybe<any>
}

export class CountAndDecrement {
  count: number = 0

  constructor(initialCount: number) {
    this.count = initialCount
  }

  decrement(): void {
    this.count -= 1
  }
}
