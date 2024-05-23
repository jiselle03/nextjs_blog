import type { NextRequest } from 'next/server'
import { getCookies } from 'cookies-next'

export const getCurrentUserId = () => {
  const cookies = getCookies()

  return Number(cookies.userId)
}
