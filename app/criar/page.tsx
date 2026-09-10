'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import NextLink from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { getEligiblePlans, getRecommendedPlan, PLAN_LIMITS, PlanType } from '@/lib/plans'
import { uploadImageToR2 } from '@/lib/upload'

const OCCASION_PRESETS = {
  pedido: {
    label: 'Pedido de namoro ou compromisso',
    icon: '💍',
    finalMessagePlaceholder: 'Quer namorar comigo? ❤️',
    acceptButtonText: 'SIM! 💗',
  },
  surpresa: {
    label: 'Surpresa pra quem já é seu par',
    icon: '💌',
    finalMessagePlaceholder: 'Só queria te lembrar o quanto te amo 💛',
    acceptButtonText: 'Te amo também 💛',
  },
  data_especial: {
    label: 'Celebrar uma data especial',
    icon: '🎉',
    finalMessagePlaceholder: 'Feliz mais um aninho juntos! Te amo cada dia mais 💛',
    acceptButtonText: 'Muito obrigada(o) 💛',
  },
} as const

type Occasion = keyof typeof OCCASION_PRESETS

type Step = 1 | 2 | 3 | 4 | 5

type MessageType = 'hitMessages' | 'missMessages'

// uma foto no formulário pode ser: recém-escolhida no navegador (tem `file`,
// ainda não subiu pro R2) ou já existente de um rascunho salvo (file: null,
// previewUrl já é a URL real do bucket).
interface DraftPhoto {
  id: string
  previewUrl: string
  file: File | null
}

interface AmorzinForm {
  occasion?: Occasion
  loverName: string
  photos: DraftPhoto[]
  hitMessages: string[]
  missMessages: string[]
  finalMessage: string
  acceptButtonText: string
}

const MAX_PHOTOS = 10
const MAX_MESSAGES = 10

const defaultHitMessages = ['Sabia que você conseguiria! ❤️']
const defaultMissMessages = ['Quase... tenta de novo 👀']

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function CreateAmorzinPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('editId')

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isFinishing, setIsFinishing] = useState(false)
  const [finishError, setFinishError] = useState<string | null>(null)

  const [gamePageId, setGamePageId] = useState<string | null>(null)
  const [isLoadingDraft, setIsLoadingDraft] = useState(!!editId)
  const [editBlocked, setEditBlocked] = useState(false)

  const [Amorzin, setAmorzin] = useState<AmorzinForm>({
    occasion: undefined,
    loverName: '',
    photos: [],
    hitMessages: defaultHitMessages,
    missMessages: defaultMissMessages,
    finalMessage: '',
    acceptButtonText: 'SIM! 💗',
  })

  useEffect(() => {
    if (!editId) return

    fetch(`/api/game-pages/edit/${editId}`)
      .then(async (res) => {
        if (res.status === 409) {
          setEditBlocked(true)
          setIsLoadingDraft(false)
          return
        }
        if (!res.ok) throw new Error('not found')

        const draft = await res.json()
        setAmorzin({
          occasion: draft.occasion,
          loverName: draft.loverName,
          // fotos que já vêm do rascunho já estão no R2 — file: null significa
          // "não precisa subir de novo" na hora de finalizar
          photos: (draft.photos as string[]).map((url) => ({
            id: crypto.randomUUID(),
            previewUrl: url,
            file: null,
          })),
          hitMessages: draft.hitMessages.length ? draft.hitMessages : defaultHitMessages,
          missMessages: draft.missMessages.length ? draft.missMessages : defaultMissMessages,
          finalMessage: draft.finalMessage,
          acceptButtonText: draft.acceptButtonText,
        })
        setGamePageId(editId)
        setIsLoadingDraft(false)
      })
      .catch(() => setIsLoadingDraft(false))
  }, [editId])

  // libera os object URLs locais ao sair da página, evitando vazamento de memória
  useEffect(() => {
    return () => {
      Amorzin.photos.forEach((p) => {
        if (p.file) URL.revokeObjectURL(p.previewUrl)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const eligiblePlans = useMemo(() => getEligiblePlans(Amorzin.photos.length), [Amorzin.photos.length])
  const recommended = useMemo(() => getRecommendedPlan(Amorzin.photos.length), [Amorzin.photos.length])
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(recommended)

  useEffect(() => {
    if (!eligiblePlans.includes(selectedPlan)) {
      setSelectedPlan(recommended)
    }
  }, [eligiblePlans, recommended, selectedPlan])

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100
  const stepTitle = useMemo(() => getStepTitle(currentStep), [currentStep])

  function updateField<K extends keyof AmorzinForm>(field: K, value: AmorzinForm[K]) {
    setAmorzin((prev) => ({ ...prev, [field]: value }))
  }

  function selectOccasion(occasion: Occasion) {
    const preset = OCCASION_PRESETS[occasion]
    setAmorzin((prev) => ({ ...prev, occasion, acceptButtonText: preset.acceptButtonText }))
  }

  function addMessage(type: MessageType) {
    setAmorzin((prev) => {
      if (prev[type].length >= MAX_MESSAGES) return prev
      return { ...prev, [type]: [...prev[type], ''] }
    })
  }

  function removeMessage(type: MessageType, index: number) {
    setAmorzin((prev) => {
      if (prev[type].length <= 1) return prev
      return { ...prev, [type]: prev[type].filter((_, i) => i !== index) }
    })
  }

  function updateMessage(type: MessageType, index: number, value: string) {
    setAmorzin((prev) => ({
      ...prev,
      [type]: prev[type].map((message, i) => (i === index ? value : message)),
    }))
  }

  // agora é só um preview local, instantâneo — nada de rede aqui.
  // o upload de verdade só acontece em handleFinish.
  function addPhoto(file: File) {
    if (Amorzin.photos.length >= MAX_PHOTOS) return

    const previewUrl = URL.createObjectURL(file)
    setAmorzin((prev) => ({
      ...prev,
      photos: [...prev.photos, { id: crypto.randomUUID(), previewUrl, file }],
    }))
  }

  function removePhoto(index: number) {
    setAmorzin((prev) => {
      const photo = prev.photos[index]
      if (photo.file) URL.revokeObjectURL(photo.previewUrl)
      return { ...prev, photos: prev.photos.filter((_, i) => i !== index) }
    })
  }

  function goToStep(step: Step) {
    setCurrentStep(step)
    setActiveTab('edit')
  }

  function nextStep() {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as Step)
      setActiveTab('edit')
    }
  }

  function previousStep() {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
      setActiveTab('edit')
    }
  }

  async function handleFinish() {
    if (isFinishing) return
    if (!Amorzin.occasion) { setCurrentStep(1); return }
    if (!Amorzin.loverName.trim()) { setCurrentStep(2); return }
    if (Amorzin.photos.length === 0) { setCurrentStep(3); return }
    if (!Amorzin.finalMessage.trim()) { setCurrentStep(5); return }

    setIsFinishing(true)
    setFinishError(null)

    try {
      // sobe só as fotos que ainda são um File local; as que já tinham URL
      // (vindas de um rascunho salvo), reaproveita direto.
      const resolvedPhotoUrls: string[] = []
      for (const photo of Amorzin.photos) {
        if (photo.file) {
          const url = await uploadImageToR2(photo.file)
          resolvedPhotoUrls.push(url)
        } else {
          resolvedPhotoUrls.push(photo.previewUrl)
        }
      }

      const payload = {
        occasion: Amorzin.occasion,
        loverName: Amorzin.loverName,
        photos: resolvedPhotoUrls,
        hitMessages: Amorzin.hitMessages,
        missMessages: Amorzin.missMessages,
        finalMessage: Amorzin.finalMessage,
        acceptButtonText: Amorzin.acceptButtonText,
      }

      const res = gamePageId
        ? await fetch(`/api/game-pages/edit/${gamePageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/game-pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!res.ok) throw new Error('Falha ao salvar')
      const { id } = await res.json()

      router.push(`/preview/${id}`)
    } catch (err) {
      console.error(err)
      setFinishError('Não foi possível enviar as fotos ou salvar. Tenta de novo.')
      setIsFinishing(false)
    }
  }

  if (editBlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA] px-4">
        <div className="max-w-sm text-center">
          <p className="text-sm text-[#35131F]">
            Esse Amorzin já foi publicado e não pode mais ser editado — ele já pode ter sido
            compartilhado com alguém. 💛
          </p>
          <NextLink href="/criar" className="mt-4 inline-block text-sm font-semibold text-[#E6395B] hover:underline">
            Criar um novo
          </NextLink>
        </div>
      </main>
    )
  }

  if (isLoadingDraft) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
        <p className="text-sm text-[#35131F]">Carregando seu rascunho...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFFCFA] px-3 py-3 font-sans text-[#35131F] sm:px-5 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-24px)] items-center justify-center sm:min-h-[calc(100dvh-48px)]">
        <div className="flex w-full max-w-[430px] flex-col overflow-hidden rounded-[24px] border border-[#35131F]/10 bg-[#FFFDFC] shadow-[0_15px_50px_rgba(53,19,31,0.06)] md:max-w-[1180px] md:min-h-[760px] md:flex-row md:rounded-[30px]">
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden w-[270px] flex-shrink-0 flex-col border-r border-[#35131F]/[0.07] bg-[#FFF8F9] p-8 md:flex">
            <div className="mb-12">
              <div className="font-serif text-xl font-bold text-[#35131F]">🏹 Amorzin</div>
              <p className="mt-2 text-xs leading-5 text-[#9A7D85]">
                Crie uma experiência
                <br />
                inesquecível para alguém.
              </p>
            </div>

            <div className="space-y-2">
              <StepItem number="1" title="Qual é o motivo?" completed={currentStep > 1} active={currentStep === 1} onClick={() => goToStep(1)} />
              <StepItem number="2" title="Quem você quer conquistar" completed={currentStep > 2} active={currentStep === 2} onClick={() => goToStep(2)} />
              <StepItem number="3" title="Fotos do casal" completed={currentStep > 3} active={currentStep === 3} onClick={() => goToStep(3)} />
              <StepItem number="4" title="Mensagens" completed={currentStep > 4} active={currentStep === 4} onClick={() => goToStep(4)} />
              <StepItem number="5" title="O pedido final" active={currentStep === 5} onClick={() => goToStep(5)} />
            </div>

            <div className="mt-auto">
              <div className="rounded-2xl border border-[#E6395B]/10 bg-white p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE8EE]">
                  <Sparkles size={17} className="text-[#E6395B]" />
                </div>
                <p className="text-xs font-bold text-[#35131F]">Você está quase lá! 💗</p>
                <p className="mt-1.5 text-[10px] leading-5 text-[#9A7D85]">
                  Mais algumas etapas para terminar seu Amorzin.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <section className="flex min-w-0 flex-1 flex-col">
            <header className="border-b border-[#35131F]/[0.07] px-5 pb-0 pt-5 sm:px-7 md:px-10 md:pt-8">
              <div className="flex items-start">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                  className="group -ml-1 flex items-center gap-2 rounded-lg p-1 text-[#8F747C] transition-colors hover:text-[#E6395B] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft size={17} strokeWidth={1.7} />
                  <span className="hidden text-xs font-medium md:inline">Voltar</span>
                </button>

                <div className="flex-1 px-3 sm:px-5 md:px-6">
                  <div className="text-[14px] font-bold text-[#35131F] md:text-lg">Novo Amorzin</div>
                  <div className="mt-0.5 text-[10px] text-[#A1888F] md:text-xs">
                    Passo {currentStep} de {totalSteps} — {stepTitle}
                  </div>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                  <span className="rounded-full bg-[#FFE8EE] px-2.5 py-1 text-[10px] font-semibold text-[#E6395B]">
                    {PLAN_LIMITS[selectedPlan].label}
                  </span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#E6395B]">{Math.round(progress)}%</div>
                    <div className="mt-0.5 text-[10px] text-[#A1888F]">concluído</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-[5px] overflow-hidden rounded-full bg-[#F0E7E9]">
                <div className="h-full rounded-full bg-[#E6395B] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-4 flex h-[48px] items-end gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`relative h-full min-w-[130px] rounded-t-xl text-[11px] font-semibold transition-colors md:min-w-[170px] md:text-xs ${
                    activeTab === 'edit' ? 'bg-[#FFE8EE] text-[#E6395B]' : 'text-[#9B838A] hover:text-[#E6395B]'
                  }`}
                >
                  Editar
                  {activeTab === 'edit' && <span className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-[#E6395B]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`relative h-full min-w-[130px] rounded-t-xl text-[11px] font-medium transition-colors md:min-w-[170px] md:text-xs ${
                    activeTab === 'preview' ? 'bg-[#FFE8EE] text-[#E6395B]' : 'text-[#9B838A] hover:text-[#E6395B]'
                  }`}
                >
                  Preview
                  {activeTab === 'preview' && <span className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full bg-[#E6395B]" />}
                </button>
              </div>
            </header>

            <div className="flex-1 px-5 py-5 sm:px-7 md:px-10 md:py-10">
              {activeTab === 'preview' ? (
                <Preview Amorzin={Amorzin} />
              ) : (
                <div className="mx-auto max-w-[720px]">
                  {currentStep === 1 && (
                    <StepZero occasion={Amorzin.occasion} onSelect={selectOccasion} />
                  )}

                  {currentStep === 2 && (
                    <StepOne loverName={Amorzin.loverName} onChange={(value) => updateField('loverName', value)} />
                  )}

                  {currentStep === 3 && (
                    <StepTwo
                      photos={Amorzin.photos}
                      onAdd={addPhoto}
                      onRemove={removePhoto}
                      recommended={recommended}
                    />
                  )}

                  {currentStep === 4 && (
                    <StepThree
                      hitMessages={Amorzin.hitMessages}
                      missMessages={Amorzin.missMessages}
                      onChange={updateMessage}
                      onAdd={addMessage}
                      onRemove={removeMessage}
                    />
                  )}

                  {currentStep === 5 && (
                    <StepFour
                      finalMessage={Amorzin.finalMessage}
                      acceptButtonText={Amorzin.acceptButtonText}
                      placeholder={OCCASION_PRESETS[Amorzin.occasion ?? 'pedido'].finalMessagePlaceholder}
                      onFinalMessageChange={(value) => updateField('finalMessage', value)}
                      onButtonTextChange={(value) => updateField('acceptButtonText', value)}
                    />
                  )}
                </div>
              )}
            </div>

            <footer className="border-t border-[#35131F]/[0.07] px-5 py-4 sm:px-7 md:px-10 md:py-6">
              {finishError && (
                <p className="mb-3 text-center text-[11px] font-medium text-[#E6395B]">{finishError}</p>
              )}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                  className="flex h-10 flex-1 items-center justify-center rounded-full border border-[#E8DADD] bg-white text-[11px] font-semibold text-[#8F747C] transition-all hover:border-[#D7BEC4] hover:bg-[#FFF8F9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:w-[120px] md:h-[46px] md:w-[150px] md:text-xs"
                >
                  Voltar
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group flex h-10 flex-[1.6] items-center justify-center gap-1.5 rounded-full bg-[#E6395B] text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(230,57,91,0.18)] transition-all hover:bg-[#D62F50] hover:shadow-[0_9px_22px_rgba(230,57,91,0.25)] active:scale-[0.98] sm:flex-none sm:w-[180px] md:h-[46px] md:w-[220px] md:text-xs"
                  >
                    Próximo
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={isFinishing}
                    className="group flex h-10 flex-[1.6] items-center justify-center gap-1.5 rounded-full bg-[#E6395B] text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(230,57,91,0.18)] transition-all hover:bg-[#D62F50] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:w-[180px] md:h-[46px] md:w-[220px] md:text-xs"
                  >
                    {isFinishing ? 'Enviando fotos...' : 'Criar meu Amorzin'}
                    {!isFinishing && <Heart size={14} fill="currentColor" />}
                  </button>
                )}
              </div>
            </footer>
          </section>
        </div>
      </div>
    </main>
  )
}

export default function CreateAmorzinPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCFA]">
          <p className="text-sm text-[#8F747C]">
            Carregando...
          </p>
        </main>
      }
    >
      <CreateAmorzinPageContent />
    </Suspense>
  )
}

/* ===============================================================
   STEP 0 — MOTIVO
================================================================ */

interface StepZeroProps {
  occasion?: Occasion
  onSelect: (occasion: Occasion) => void
}

function StepZero({ occasion, onSelect }: StepZeroProps) {
  return (
    <div>
      <StepHeader
        title="Qual é o motivo?"
        description="Isso ajusta as mensagens padrão pra combinar com o momento — você pode editar tudo depois."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(OCCASION_PRESETS) as Occasion[]).map((key) => {
          const preset = OCCASION_PRESETS[key]
          const isSelected = occasion === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`rounded-2xl border p-5 text-center transition ${
                isSelected ? 'border-[#E6395B] bg-[#FFF5F7]' : 'border-[#E8DADD] bg-white hover:border-[#D7BEC4]'
              }`}
            >
              <div className="text-2xl">{preset.icon}</div>
              <div className="mt-2 text-xs font-semibold text-[#35131F]">{preset.label}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ===============================================================
   STEP 1
================================================================ */

interface StepOneProps {
  loverName: string
  onChange: (value: string) => void
}

function StepOne({ loverName, onChange }: StepOneProps) {
  return (
    <div>
      <StepHeader title="Quem você quer conquistar?" description="Vamos começar pela pessoa que vai receber seu Amorzin." />

      <div className="rounded-[18px] border border-[#E6395B]/20 bg-white p-5 md:p-7">
        <label className="block text-xs font-semibold text-[#35131F]">Nome</label>
        <input
          type="text"
          value={loverName}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: Maria"
          maxLength={80}
          className="mt-2 h-11 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 text-xs outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
        />
        <p className="mt-2 text-[10px] text-[#A1888F]">Esse nome pode aparecer durante o jogo.</p>
      </div>
    </div>
  )
}

/* ===============================================================
   STEP 2
================================================================ */

interface StepTwoProps {
  photos: DraftPhoto[]
  onAdd: (file: File) => void
  onRemove: (index: number) => void
  recommended: PlanType
}

function StepTwo({ photos, onAdd, onRemove, recommended }: StepTwoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const basicLimit = PLAN_LIMITS.BASICO.maxPhotos

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onAdd(file)
    e.target.value = ''
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 md:mb-5">
        <div className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#5BB88A]">
          <Check size={10} strokeWidth={3} className="text-white" />
        </div>
        <span className="text-[10px] font-medium text-[#5DAD86] md:text-xs">
          Motivo e nome já definidos
        </span>
      </div>

      <div className="rounded-[15px] border border-[#E6395B]/20 bg-white p-4 sm:p-5 md:rounded-[20px] md:p-7">
        <div className="mb-5 flex items-start justify-between gap-3 md:mb-7">
          <div>
            <h2 className="text-[13px] font-bold text-[#35131F] md:text-lg">Fotos do casal</h2>
            <p className="mt-1 text-[10px] leading-4 text-[#8F747C] md:text-xs">
              Elas aparecem uma a uma a cada acerto — até {MAX_PHOTOS} fotos. Só sobem de
              verdade quando você finalizar.
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-[#FFE8EE] px-2.5 py-1 text-[9px] font-semibold text-[#E6395B]">
            {PLAN_LIMITS[recommended].label} · {formatPrice(PLAN_LIMITS[recommended].priceCents)}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap gap-2.5 md:gap-4">
          {photos.map((photo, index) => (
            <PhotoItem key={photo.id} src={photo.previewUrl} index={index} onRemove={() => onRemove(index)} />
          ))}

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex h-[53px] w-[53px] items-center justify-center rounded-[11px] border border-dashed border-[#E6395B]/40 bg-white transition-all hover:border-[#E6395B] hover:bg-[#FFF5F7] active:scale-95 md:h-[90px] md:w-[90px] md:rounded-[16px]"
            >
              <Plus size={18} strokeWidth={1.5} className="text-[#E6395B] transition-transform group-hover:scale-110 md:h-6 md:w-6" />
            </button>
          )}
        </div>

        <div className="mt-3 text-[9px] text-[#B28F98] md:mt-4 md:text-[10px]">
          {photos.length} de {MAX_PHOTOS} fotos adicionadas
        </div>

        {photos.length === basicLimit + 1 && (
          <p className="mt-2 text-[10px] leading-4 text-[#9A7D85]">
            A partir de {basicLimit + 1} fotos o plano Básico não cobre mais — seguimos com o Super.
          </p>
        )}
      </div>
    </div>
  )
}

/* ===============================================================
   STEP 3
================================================================ */

interface StepThreeProps {
  hitMessages: string[]
  missMessages: string[]
  onChange: (type: MessageType, index: number, value: string) => void
  onAdd: (type: MessageType) => void
  onRemove: (type: MessageType, index: number) => void
}

function StepThree({ hitMessages, missMessages, onChange, onAdd, onRemove }: StepThreeProps) {
  return (
    <div>
      <StepHeader title="Mensagens" description="Personalize o que aparece durante o jogo quando ela acerta ou erra o alvo." />

      <div className="space-y-5">
        <MessageGroup
          type="hit"
          title="Quando ela acertar"
          description="Uma dessas mensagens aparecerá a cada acerto."
          messages={hitMessages}
          onChange={(index, value) => onChange('hitMessages', index, value)}
          onAdd={() => onAdd('hitMessages')}
          onRemove={(index) => onRemove('hitMessages', index)}
          maxMessages={MAX_MESSAGES}
        />

        <MessageGroup
          type="miss"
          title="Quando ela errar"
          description="Uma dessas mensagens aparecerá quando ela errar o alvo."
          messages={missMessages}
          onChange={(index, value) => onChange('missMessages', index, value)}
          onAdd={() => onAdd('missMessages')}
          onRemove={(index) => onRemove('missMessages', index)}
          maxMessages={MAX_MESSAGES}
        />
      </div>
    </div>
  )
}

/* ===============================================================
   STEP 4
================================================================ */

interface StepFourProps {
  finalMessage: string
  acceptButtonText: string
  placeholder: string
  onFinalMessageChange: (value: string) => void
  onButtonTextChange: (value: string) => void
}

function StepFour({ finalMessage, acceptButtonText, placeholder, onFinalMessageChange, onButtonTextChange }: StepFourProps) {
  return (
    <div>
      <StepHeader title="O pedido final" description="Agora é a hora de preparar a mensagem que aparece no final." />

      <div className="rounded-[20px] border border-[#E6395B]/20 bg-white p-5 md:p-7">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE8EE]">
            <Heart size={28} fill="currentColor" className="text-[#E6395B]" />
          </div>
          <h3 className="text-sm font-bold text-[#35131F] md:text-base">A pergunta que vai ficar para sempre</h3>
          <p className="mt-1 max-w-md text-[10px] leading-5 text-[#8F747C] md:text-xs">
            Escreva a mensagem que ela verá depois de completar o desafio.
          </p>
        </div>

        <label className="block text-xs font-semibold text-[#35131F]">Mensagem final</label>
        <textarea
          rows={5}
          value={finalMessage}
          onChange={(event) => onFinalMessageChange(event.target.value)}
          maxLength={300}
          placeholder={placeholder}
          className="mt-2 w-full resize-none rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 py-3 text-xs leading-5 outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
        />
        <div className="mt-2 text-right text-[9px] text-[#B28F98]">{finalMessage.length} / 300 caracteres</div>

        <div className="mt-6">
          <label className="block text-xs font-semibold text-[#35131F]">Texto do botão</label>
          <input
            type="text"
            value={acceptButtonText}
            onChange={(event) => onButtonTextChange(event.target.value)}
            maxLength={40}
            placeholder="SIM! 💗"
            className="mt-2 h-11 w-full rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-4 text-xs outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#FFF5F7] px-4 py-3">
        <p className="text-[10px] leading-5 text-[#9A7D85]">
          💡 <strong className="text-[#6E4E58]">Dica:</strong> uma mensagem simples e sincera pode tornar o momento ainda mais especial.
        </p>
      </div>
    </div>
  )
}

/* ===============================================================
   STEP HEADER
================================================================ */

interface StepHeaderProps {
  title: string
  description: string
}

function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-5 md:mb-7">
      <h2 className="font-serif text-xl font-bold text-[#35131F] md:text-2xl">{title}</h2>
      <p className="mt-1.5 max-w-lg text-[10px] leading-5 text-[#8F747C] md:text-xs">{description}</p>
    </div>
  )
}

/* ===============================================================
   MESSAGE GROUP
================================================================ */

interface MessageGroupProps {
  type: 'hit' | 'miss'
  title: string
  description: string
  messages: string[]
  onChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  maxMessages: number
}

function MessageGroup({ type, title, description, messages, onChange, onAdd, onRemove, maxMessages }: MessageGroupProps) {
  const isHit = type === 'hit'

  return (
    <div className="rounded-[20px] border border-[#E8DADD] bg-white p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#FFE8EE] text-lg">
          {isHit ? '💗' : '👀'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold text-[#35131F] md:text-sm">{title}</h3>
          <p className="mt-0.5 text-[9px] text-[#9A7D85] md:text-[10px]">{description}</p>
        </div>
        <span className="rounded-full bg-[#FFF5F7] px-2.5 py-1 text-[9px] font-semibold text-[#E6395B]">
          {messages.length}/{maxMessages}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className="group flex items-start gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFF5F7] text-[10px] font-bold text-[#E6395B]">
              {index + 1}
            </div>
            <textarea
              rows={2}
              value={message}
              maxLength={120}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={isHit ? 'Ex.: Sabia que você conseguiria! ❤️' : 'Ex.: Quase... tenta de novo 👀'}
              className="min-h-[52px] flex-1 resize-none rounded-xl border border-[#E8DADD] bg-[#FFFDFC] px-3 py-2.5 text-xs leading-5 outline-none transition placeholder:text-[#C4B3B8] focus:border-[#E6395B] focus:ring-4 focus:ring-[#E6395B]/10"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={messages.length === 1}
              title="Remover mensagem"
              className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#B9A3A9] transition hover:bg-[#FFF5F7] hover:text-[#E6395B] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {messages.length < maxMessages && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E6395B]/30 bg-[#FFF8F9] py-3 text-[10px] font-semibold text-[#E6395B] transition hover:border-[#E6395B]/60 hover:bg-[#FFF5F7] active:scale-[0.99]"
        >
          <Plus size={14} />
          Adicionar outra mensagem
        </button>
      )}

      {messages.length >= maxMessages && (
        <p className="mt-4 text-center text-[9px] text-[#A1888F]">Você atingiu o limite de {maxMessages} mensagens.</p>
      )}
    </div>
  )
}

/* ===============================================================
   STEP ITEM
================================================================ */

interface StepItemProps {
  number: string
  title: string
  active?: boolean
  completed?: boolean
  onClick: () => void
}

function StepItem({ number, title, active, completed, onClick }: StepItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors ${
        active ? 'bg-[#FFE8EE]' : 'hover:bg-white'
      }`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          completed
            ? 'bg-[#5BB88A] text-white'
            : active
              ? 'bg-[#E6395B] text-white'
              : 'border border-[#DCCED1] bg-white text-[#A28A91]'
        }`}
      >
        {completed ? <Check size={12} strokeWidth={3} /> : number}
      </div>
      <div
        className={`text-[11px] leading-4 ${
          active ? 'font-semibold text-[#E6395B]' : completed ? 'text-[#6C9B81]' : 'text-[#A28A91]'
        }`}
      >
        {title}
      </div>
    </button>
  )
}

/* ===============================================================
   PHOTO
================================================================ */

interface PhotoItemProps {
  src: string
  index: number
  onRemove: () => void
}

function PhotoItem({ src, index, onRemove }: PhotoItemProps) {
  return (
    <div className="group relative h-[53px] w-[53px] overflow-hidden rounded-[11px] bg-[#FFE8EE] sm:h-[56px] sm:w-[56px] md:h-[90px] md:w-[90px] md:rounded-[16px]">
      <img
        src={src}
        alt={`Foto do casal ${index + 1}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[#35131F]/0 transition-colors group-hover:bg-[#35131F]/10" />
      <span className="absolute bottom-1 left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black/35 px-1 text-[7px] font-semibold text-white backdrop-blur-sm md:bottom-2 md:left-2 md:h-5 md:min-w-5 md:text-[8px]">
        {index + 1}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 md:right-2 md:top-2"
      >
        <Minus size={12} />
      </button>
    </div>
  )
}

/* ===============================================================
   PREVIEW
================================================================ */

interface PreviewProps {
  Amorzin: AmorzinForm
}

function Preview({ Amorzin }: PreviewProps) {
  return (
    <div className="flex min-h-[480px] items-center justify-center rounded-[24px] bg-[#FFF5F7] px-5 py-8">
      <div className="w-full max-w-[360px] text-center">
        <div className="relative mx-auto mb-6 h-[120px] w-[120px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6395B] to-[#9F1835] p-1">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
              {Amorzin.photos[0] ? (
                <img src={Amorzin.photos[0].previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#FFE8EE]">💗</div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E6395B]">Um Amorzin para</div>
        <h2 className="font-serif text-2xl font-bold text-[#35131F]">{Amorzin.loverName || 'Alguém especial'} 💗</h2>
        <p className="mt-3 text-xs leading-6 text-[#8F747C]">Uma pequena experiência foi preparada especialmente para você.</p>

        <div className="mt-6 rounded-2xl border border-[#E8DADD] bg-white p-4 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE8EE]">
              <Heart size={16} fill="currentColor" className="text-[#E6395B]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#35131F]">Uma experiência especial</p>
              <p className="mt-0.5 text-[9px] text-[#A1888F]">Fotos, desafios e uma surpresa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===============================================================
   HELPERS
================================================================ */

function getStepTitle(step: Step) {
  switch (step) {
    case 1: return 'Qual é o motivo?'
    case 2: return 'Quem você quer conquistar'
    case 3: return 'Fotos do casal'
    case 4: return 'Mensagens'
    case 5: return 'O pedido final'
  }
}