import { Maybe } from 'true-myth'

export type SignInSession = {
  id: string
  token: string
  userId: string
  signedIn: boolean
  attemptCount: number
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export type Bindings = {
  DB: D1Database
  Session: Maybe<SignInSession>
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
