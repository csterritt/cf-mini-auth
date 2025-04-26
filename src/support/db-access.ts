/**
 * Database access utility functions for user and session models.
 * @module support/db-access
 */
import prismaClients from '../lib/prismaClient'

/**
 * Find a user by email address.
 * @param db - D1Database instance
 * @param email - User email
 * @returns User object or null
 */
export const findUserByEmail = async (
  db: D1Database,
  email: string
): Promise<any | null> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.user.findUnique({ where: { email } })
}

/**
 * Find a user by ID.
 * @param db - D1Database instance
 * @param userId - User ID
 * @returns User object or null
 */
export const findUserById = async (
  db: D1Database,
  userId: string
): Promise<any | null> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.user.findUnique({ where: { id: userId } })
}

/**
 * Create a new session.
 * @param db - D1Database instance
 * @param sessionData - Session data object
 * @returns Session object
 */
export const createSession = async (
  db: D1Database,
  sessionData: Record<string, unknown>
): Promise<any> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.session.create({ data: sessionData })
}

/**
 * Find a session by ID.
 * @param db - D1Database instance
 * @param sessionId - Session ID
 * @returns Session object or null
 */
export const findSessionById = async (
  db: D1Database,
  sessionId: string
): Promise<any | null> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.session.findUnique({ where: { id: sessionId } })
}

/**
 * Update a session by ID.
 * @param db - D1Database instance
 * @param sessionId - Session ID
 * @param updateData - Fields to update
 * @returns Updated session object
 */
export const updateSessionById = async (
  db: D1Database,
  sessionId: string,
  updateData: Record<string, unknown>
): Promise<any> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.session.update({ where: { id: sessionId }, data: updateData })
}

/**
 * Find the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @returns Count object or null
 */
export const findCountById = async (
  db: D1Database,
  countId: string
): Promise<any | null> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.count.findFirst({ where: { id: countId } })
}

/**
 * Increment the count record by id.
 * @param db - D1Database instance
 * @param countId - Count record id
 * @returns Updated count object
 */
export const incrementCountById = async (
  db: D1Database,
  countId: string
): Promise<any> => {
  const prisma = await prismaClients.fetch(db)
  // @ts-ignore
  return prisma.count.update({
    where: { id: countId },
    data: { count: { increment: 1 } },
  })
}
