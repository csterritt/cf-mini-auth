/**
 * Database access utility functions for user and session models.
 * @module support/db-access
 */
import { Context } from 'hono'
import Maybe from 'true-myth/maybe'
import Result from 'true-myth/result'
import retry from 'async-retry'

import prismaClients from '../lib/prismaClient'
import { CountAndDecrement } from '../local-types'
import { STANDARD_RETRY_OPTIONS } from '../constants'
import { getCurrentTime } from './time-access'

/**
 * Find a user by email address.
 * @param db - D1Database instance
 * @param email - User email
 * @returns Result with Maybe.just(user) or Maybe.nothing if not found, or Result.err with error
 */
export const findUserByEmail = async (
  db: D1Database,
  email: string
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => findUserByEmailActual(db, email),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`findUserByEmail final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const findUserByEmailActual = async (
  db: D1Database,
  email: string
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email } })

    return Result.ok(user ? Maybe.just(user) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Find a user by ID.
 * @param db - D1Database instance
 * @param userId - User ID
 * @returns Result with Maybe.just(user) or Maybe.nothing if not found, or Result.err with error
 */
export const findUserById = async (
  db: D1Database,
  userId: string
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => findUserByIdActual(db, userId),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`findUserById final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const findUserByIdActual = async (
  db: D1Database,
  userId: string
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: userId } })

    return Result.ok(user ? Maybe.just(user) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Create a new session.
 * @param db - D1Database instance
 * @param sessionData - Session data object
 * @returns Result with Maybe.just(session) or Maybe.nothing if not created, or Result.err with error
 */
export const createSession = async (
  db: D1Database,
  sessionData: Record<string, unknown>
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => createSessionActual(db, sessionData),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`createSession final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const createSessionActual = async (
  db: D1Database,
  sessionData: Record<string, unknown>
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.create({ data: sessionData })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Find a session by ID.
 * @param db - D1Database instance
 * @param sessionId - Session ID
 * @returns Result with Maybe.just(session) or Maybe.nothing if not found, or Result.err with error
 */
export const findSessionById = async (
  db: D1Database,
  sessionId: string
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => findSessionByIdActual(db, sessionId),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`findSessionById final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const findSessionByIdActual = async (
  db: D1Database,
  sessionId: string
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Update a session by ID.
 * @param db - D1Database instance
 * @param sessionId - Session ID
 * @param updateData - Fields to update
 * @returns Result with Maybe.just(session) or Maybe.nothing if not updated, or Result.err with error
 */
export const updateSessionById = async (
  db: D1Database,
  sessionId: string,
  updateData: Record<string, unknown>
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => updateSessionByIdActual(db, sessionId, updateData),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`updateSessionById final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const updateSessionByIdActual = async (
  db: D1Database,
  sessionId: string,
  updateData: Record<string, unknown>
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Delete a session by ID.
 * @param db - D1Database instance
 * @param sessionId - Session ID
 * @returns Result.ok(true) if deleted, Result.err with error otherwise
 */
export const deleteSession = async (
  db: D1Database,
  sessionId: string
): Promise<Result<boolean, Error>> => {
  let res: Result<boolean, Error>
  try {
    res = await retry(
      () => deleteSessionActual(db, sessionId),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`deleteSession final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const deleteSessionActual = async (
  db: D1Database,
  sessionId: string
): Promise<Result<boolean, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    await prisma.session.delete({ where: { id: sessionId } })
    return Result.ok(true)
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Find the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @param failureCount - Optional number of failures to simulate (for testing)
 * @returns Result with Maybe.just(count) or Maybe.nothing if not found, or Result.err with error
 */
export const findCountById = async (
  db: D1Database,
  countId: string,
  failureCount?: CountAndDecrement
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(async (bail, attemptNumber) => {
      return await findCountByIdActual(db, countId, failureCount)
    }, STANDARD_RETRY_OPTIONS)
  } catch (err) {
    console.log(`findCountById final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const findCountByIdActual = async (
  db: D1Database,
  countId: string,
  failureCount?: CountAndDecrement
): Promise<Result<Maybe<any>, Error>> => {
  try {
    // PRODUCTION:REMOVE-NEXT-LINE
    if (failureCount != null && failureCount.count > 0) {
      failureCount.decrement() // PRODUCTION:REMOVE
      throw new Error('Simulated DB failure') // PRODUCTION:REMOVE
    } // PRODUCTION:REMOVE

    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const count = await prisma.count.findFirst({ where: { id: countId } })

    return Result.ok(count ? Maybe.just(count) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Increment the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @param failureCount - Optional number of failures to simulate (for testing)
 * @returns Result with Maybe.just(updated) or Maybe.nothing if not updated, or Result.err with error
 */
export const incrementCountById = async (
  db: D1Database,
  countId: string,
  failureCount?: CountAndDecrement
): Promise<Result<Maybe<any>, Error>> => {
  let res: Result<Maybe<any>, Error>
  try {
    res = await retry(
      () => incrementCountByIdActual(db, countId, failureCount),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`incrementCountById final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const incrementCountByIdActual = async (
  db: D1Database,
  countId: string,
  failureCount?: CountAndDecrement
): Promise<Result<Maybe<any>, Error>> => {
  try {
    // PRODUCTION:REMOVE-NEXT-LINE
    if (failureCount != null && failureCount.count > 0) {
      failureCount.decrement() // PRODUCTION:REMOVE
      throw new Error('Simulated DB failure') // PRODUCTION:REMOVE
    } // PRODUCTION:REMOVE

    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const updated = await prisma.count.update({
      where: { id: countId },
      data: { count: { increment: 1 } },
    })

    return Result.ok(updated ? Maybe.just(updated) : Maybe.nothing())
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Count non-signed-in sessions for a given email within the rate limit window.
 * @param c - Hono context
 * @param db - D1Database instance
 * @param email - User email
 * @param windowMs - Time window in milliseconds
 * @returns Result with the count of recent non-signed-in sessions, or Result.err with error
 */
export const countRecentNonSignedInSessionsByEmail = async (
  c: Context,
  db: D1Database,
  email: string,
  windowMs: number
): Promise<Result<number, Error>> => {
  let res: Result<number, Error>
  try {
    res = await retry(
      () => countRecentNonSignedInSessionsByEmailActual(c, db, email, windowMs),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`countRecentNonSignedInSessionsByEmail final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const countRecentNonSignedInSessionsByEmailActual = async (
  c: Context,
  db: D1Database,
  email: string,
  windowMs: number
): Promise<Result<number, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    const windowStart = getCurrentTime(
      c,
      getCurrentTime(c).getTime() - windowMs
    )

    // First find the user by email
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw Result.err(`User not found`) // User not found, return count of 0
    }

    // Count sessions for this user that are not signed in and created within the window
    // @ts-ignore
    const count = await prisma.session.count({
      where: {
        userId: user.id,
        signedIn: false,
        createdAt: {
          gte: windowStart,
        },
      },
    })

    return Result.ok(count)
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Delete all sessions for a specific user identified by email.
 * @param db - D1Database instance
 * @param email - User email
 * @returns Result.ok(number) with count of deleted sessions, or Result.err with error
 */
export const deleteAllUserSessions = async (
  db: D1Database,
  email: string
): Promise<Result<number, Error>> => {
  let res: Result<number, Error>
  try {
    res = await retry(
      () => deleteAllUserSessionsActual(db, email),
      STANDARD_RETRY_OPTIONS
    )
  } catch (err) {
    console.log(`deleteAllUserSessions final error:`, err)
    res = Result.err(err instanceof Error ? err : new Error(String(err)))
  }

  return res
}

const deleteAllUserSessionsActual = async (
  db: D1Database,
  email: string
): Promise<Result<number, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)

    // First find the user by email
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return Result.ok(0) // User not found, no sessions to delete
    }

    // Delete all sessions for the user
    // @ts-ignore
    const result = await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })

    return Result.ok(result.count)
  } catch (e) {
    throw Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}
