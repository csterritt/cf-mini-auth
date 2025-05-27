import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

/**
 * Returns the current time as a Date object. Use this instead of calling new Date() directly.
 * Optionally, pass arguments to forward to Date constructor.
 * @module lib/time-access
 */

export const getCurrentTime = (c: any, ...args: any[]): Date => {
   if (args.length === 0) { 
     return new Date() 
   } 

   // @ts-ignore 
   return new Date(...args) 
   } 
