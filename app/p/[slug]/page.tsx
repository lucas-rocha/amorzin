// app/p/[slug]/page.tsx

import MomozinSlugClient from './MomozinSlugClient'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  return <MomozinSlugClient slug={slug} />
}