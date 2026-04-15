'use client'

import { useEffect } from 'react'

export default function LegacySearchRedirectPage() {
  useEffect(() => {
    const { search, hash } = window.location
    window.location.replace(`/en/search/${search}${hash}`)
  }, [])

  return null
}
