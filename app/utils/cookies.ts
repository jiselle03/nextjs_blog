import { NextRequest } from 'next/server'
import { getCookies } from 'cookies-next'

export let currentUserId: number = 0

export const getCurrentUserId = (req: NextRequest): number => {
  if (!!currentUserId) {
    return currentUserId
  }

  const cookies = getCookies({ req })
  currentUserId = Number(cookies.userId)

  return currentUserId
}
