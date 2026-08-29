import { Plus } from "lucide-react"

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

export default function MessageGroup({
  type,
  title,
  description,
  messages,
  onChange,
  onAdd,
  onRemove,
  maxMessages,
}: MessageGroupProps) {
  const isHit = type === 'hit'

  return (
    <section
      className="
        rounded-[20px]
        border
        border-[#E8DADD]
        bg-white
        p-4
        sm:p-5
        md:p-6
      "
    >

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div
            className={`
              flex
              h-9
              w-9
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              text-lg

              ${
                isHit
                  ? 'bg-[#EAF8F0]'
                  : 'bg-[#FFF3F5]'
              }
            `}
          >
            {isHit ? '💗' : '💭'}
          </div>

          <div>

            <h3 className="text-xs font-bold text-[#35131F] md:text-sm">
              {title}
            </h3>

            <p className="mt-0.5 text-[9px] leading-4 text-[#9A7D85] md:text-[10px]">
              {description}
            </p>

          </div>

        </div>

        <span className="whitespace-nowrap text-[9px] text-[#B49CA3]">
          {messages.length}/{maxMessages}
        </span>

      </div>

      {/* MENSAGENS */}

      <div className="mt-5 space-y-3">

        {messages.map((message, index) => (

          <div
            key={index}
            className="
              group
              relative
              rounded-[14px]
              border
              border-[#E8DADD]
              bg-[#FFFDFC]
              p-3
              transition-colors
              focus-within:border-[#E6395B]/40
            "
          >

            <div className="mb-2 flex items-center justify-between">

              <span className="text-[9px] font-semibold uppercase tracking-wide text-[#B0969E]">
                Mensagem {index + 1}
              </span>

              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="
                    text-[9px]
                    font-medium
                    text-[#B0969E]
                    opacity-0
                    transition-opacity
                    hover:text-[#E6395B]
                    group-hover:opacity-100
                    focus:opacity-100
                  "
                >
                  Remover
                </button>
              )}

            </div>

            <textarea
              value={message}
              onChange={(event) =>
                onChange(index, event.target.value)
              }
              maxLength={120}
              rows={2}
              placeholder={
                isHit
                  ? 'Ex.: Sabia que você conseguiria! ❤️'
                  : 'Ex.: Quase... tenta de novo 👀'
              }
              className="
                w-full
                resize-none
                bg-transparent
                text-[11px]
                leading-5
                text-[#35131F]
                outline-none
                placeholder:text-[#C4B3B8]
                md:text-xs
              "
            />

            <div className="mt-1 text-right text-[8px] text-[#C1AEB4]">
              {message.length}/120
            </div>

          </div>

        ))}

      </div>

      {/* ADICIONAR */}

      <button
        type="button"
        onClick={onAdd}
        disabled={messages.length >= maxMessages}
        className="
          mt-4
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-dashed
          border-[#E6395B]/30
          bg-[#FFF8F9]
          py-3
          text-[10px]
          font-semibold
          text-[#E6395B]
          transition-all
          hover:border-[#E6395B]/60
          hover:bg-[#FFF1F4]
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >

        <Plus size={14} />

        {messages.length >= maxMessages
          ? 'Limite de mensagens atingido'
          : 'Adicionar mensagem'
        }

      </button>

      {/* INFO */}

      <p className="mt-3 text-[9px] leading-4 text-[#B09AA1]">

        {isHit
          ? 'As mensagens podem aparecer em ordem aleatória durante o jogo.'
          : 'As mensagens podem aparecer em ordem aleatória quando ela errar.'
        }

      </p>

    </section>
  )
}