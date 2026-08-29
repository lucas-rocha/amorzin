// app/p/[slug]/MomozinSlugClient.tsx

'use client'

import { useEffect, useState } from 'react'
import CupidGame from '@/components/CupidGame'
import PaymentScreen from '@/components/PaymentScreen'

export interface Momozin {
  slug: string
  loverName: string
  targetPhotoUrl?: string | null
  couplePhotoUrls: string[]
  hitMessages: string[]
  missMessages: string[]
  finalQuestion: string
  finalSub: string
  acceptedTitle: string
  acceptedSub: string
}

interface Props {
  slug: string
}

export default function MomozinSlugClient({ slug }: Props) {
  const [momozin, setMomozin] = useState<Momozin | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`momozin:${slug}`)

    if (!stored) {
      return
    }

    try {
      setMomozin(JSON.parse(stored))
    } catch {
      console.error('Momozin inválido no localStorage')
    }
  }, [slug])

  if (!momozin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <div className="text-center">
          <p className="text-sm text-[#35131F]">
            Carregando seu Momozin...
          </p>
        </div>
      </main>
    )
  }

  if (showPayment) {
    return (
      <PaymentScreen
        momozin={momozin}
        onBack={() => setShowPayment(false)}
      />
    )
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA]">
      <div className="flex min-h-screen items-center justify-center">
        <CupidGame
          requiredHits={momozin.couplePhotoUrls.length}
          targetPhotoUrl={momozin.targetPhotoUrl}
          couplePhotoUrls={momozin.couplePhotoUrls}
          hitMessages={momozin.hitMessages}
          missMessages={momozin.missMessages}
          finalQuestion={momozin.finalQuestion}
          finalSub={momozin.finalSub}
          acceptedTitle={momozin.acceptedTitle}
          acceptedSub={momozin.acceptedSub}
          showWatermark
          onShare={() => setShowPayment(true)}
        />
      </div>
    </main>
  )
}