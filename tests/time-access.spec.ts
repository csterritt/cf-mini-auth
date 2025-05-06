// ====================================
// Tests for time-access.ts
// To run this, cd to this directory and type 'bun test'
// ====================================

import { describe, it } from 'node:test'
import assert from 'node:assert'
import { setTimeout } from 'timers/promises'
import {
  getCurrentTime,
  setCurrentTime,
  clearCurrentTime,
} from '../src/lib/time-access'

const approximatelyEqual = (v1: number, v2: number, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon

describe('getCurrentTime function', () => {
  it('should return the current no-args time when no time has been set', () => {
    assert(
      approximatelyEqual(getCurrentTime().getTime(), new Date().getTime(), 5)
    )
  })

  it('should return the correct no-args time when a time has been set in the past', () => {
    setCurrentTime(new Date(new Date().getTime() - 50000))
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() - 50000,
        5
      )
    )
  })

  it('should return the correct no-args time when a time has been set in the future', () => {
    setCurrentTime(new Date(new Date().getTime() + 50000))
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() + 50000,
        5
      )
    )
  })

  it('should return the correct no-args time with a delay when a time has been set in the past', async () => {
    setCurrentTime(new Date(new Date().getTime() - 50000))
    await setTimeout(100)
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() - 50000,
        105
      )
    )
  })

  it('should return the correct no-args time with a delay when a time has been set in the future', async () => {
    setCurrentTime(new Date(new Date().getTime() + 50000))
    await setTimeout(100)
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() + 50000,
        105
      )
    )
  })

  it('should return the correct with-args time in the past', () => {
    setCurrentTime(new Date(new Date().getTime() - 50000))
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() - 50000,
        5
      )
    )
  })

  it('should return the correct with-args time in the future', () => {
    setCurrentTime(new Date(new Date().getTime() + 50000))
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() + 50000,
        5
      )
    )
  })

  it('should return the correct with-args time with a delay in the past', async () => {
    setCurrentTime(new Date(new Date().getTime() - 50000))
    await setTimeout(100)
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() - 50000,
        105
      )
    )
  })

  it('should return the correct with-args time with a delay in the future', async () => {
    setCurrentTime(new Date(new Date().getTime() + 50000))
    await setTimeout(100)
    assert(
      approximatelyEqual(
        getCurrentTime().getTime(),
        new Date().getTime() + 50000,
        105
      )
    )
  })

  it('should allow resetting the time properly', () => {
    setCurrentTime(new Date(new Date().getTime() - 50000))
    clearCurrentTime()
    assert(
      approximatelyEqual(getCurrentTime().getTime(), new Date().getTime(), 5)
    )
  })
})
