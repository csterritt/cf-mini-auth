/**
 * Database access utility functions for user and session models.
 * @module support/db-access
 */
import prismaClients from '../lib/prismaClient'
import Maybe from 'true-myth/maybe'
import Result from 'true-myth/result'

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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email } })

    return Result.ok(user ? Maybe.just(user) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { id: userId } })

    return Result.ok(user ? Maybe.just(user) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.create({ data: sessionData })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: updateData,
    })

    return Result.ok(session ? Maybe.just(session) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Find the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @returns Result with Maybe.just(count) or Maybe.nothing if not found, or Result.err with error
 */
export const findCountById = async (
  db: D1Database,
  countId: string
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const count = await prisma.count.findFirst({ where: { id: countId } })

    return Result.ok(count ? Maybe.just(count) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}

/**
 * Increment the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @returns Result with Maybe.just(updated) or Maybe.nothing if not updated, or Result.err with error
 */
export const incrementCountById = async (
  db: D1Database,
  countId: string
): Promise<Result<Maybe<any>, Error>> => {
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    const updated = await prisma.count.update({
      where: { id: countId },
      data: { count: { increment: 1 } },
    })

    return Result.ok(updated ? Maybe.just(updated) : Maybe.nothing())
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
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
  try {
    const prisma = await prismaClients.fetch(db)
    // @ts-ignore
    await prisma.session.delete({ where: { id: sessionId } })
    return Result.ok(true)
  } catch (e) {
    return Result.err(e instanceof Error ? e : new Error(String(e)))
  }
}
