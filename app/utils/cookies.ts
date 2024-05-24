import { NextRequest } from 'next/server'

export let currentUserId: number = 0

export const getCurrentUserId = (req: NextRequest): number => {
  if (!!currentUserId) {
    return currentUserId
  }

  currentUserId = Number(req.cookies.get('userId')?.value)

  return currentUserId
}
