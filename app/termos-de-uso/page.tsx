// app/termos/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — Amorzin",
  description: "Termos de uso do Amorzin.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#FFFCFA] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl text-[#35131F]">
        <Link href="/" className="text-xs font-medium text-[#8F747C] hover:text-[#E6395B]">
          ← Voltar
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-bold">Termos de Uso</h1>
        <p className="mt-2 text-xs text-[#A1888F]">Última atualização: 07 de setembro de 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#4A3A3F]">
          <Section title="1. Quem somos e o que é o Amorzin">
            <p>
              O Amorzin ("nós", "plataforma") é um serviço que permite criar páginas
              interativas personalizadas — com fotos e mensagens escolhidas pelo usuário —
              para pedidos de namoro ou compromisso, surpresas românticas para quem já é
              casal, ou celebrações de datas especiais ("Jogo" ou "Amorzin"). O serviço é
              operado por LUCAS SOUZA ROCHA CONSULTORIA EM TECNOLOGIA DA INFORMACAO LTDA, inscrito(a) sob 60.370.771/0001-00, com
              sede em SAO PAULO, doravante denominado apenas "Amorzin".
            </p>
          </Section>

          <Section title="2. Aceitação dos termos">
            <p>
              Ao criar uma conta, realizar um pagamento ou de qualquer forma utilizar o
              Amorzin, você declara que leu, entendeu e concorda integralmente com estes
              Termos de Uso e com a nossa{" "}
              <Link href="/privacidade" className="text-[#E6395B] underline">
                Política de Privacidade
              </Link>
              . Se você não concordar com qualquer parte destes termos, não deve utilizar o
              serviço.
            </p>
          </Section>

          <Section title="3. Elegibilidade">
            <p>
              O Amorzin é destinado a maiores de 18 anos. Ao usar o serviço, você declara ter
              idade legal para celebrar contratos vinculantes no Brasil. Reservamo-nos o
              direito de solicitar comprovação de idade e de encerrar contas que violem esta
              condição.
            </p>
          </Section>

          <Section title="4. Sua conta">
            <p>
              Criar um Jogo nos planos Básico e Super não exige cadastro. O plano Premium
              (conta paga uma única vez, com criação ilimitada de Jogos) exige cadastro com
              e-mail e senha, ou login via Google. Você é responsável por manter a
              confidencialidade das suas credenciais e por todas as atividades realizadas na
              sua conta. Notifique-nos imediatamente em caso de uso não autorizado.
            </p>
          </Section>

          <Section title="5. Conteúdo enviado por você — responsabilidade e licença">
            <p>
              Ao enviar fotos, mensagens e qualquer outro conteúdo ("Conteúdo do Usuário"),
              você declara e garante que:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                é o titular dos direitos sobre as fotos enviadas, ou possui autorização válida
                para utilizá-las e compartilhá-las através do Amorzin;
              </li>
              <li>
                possui o consentimento das demais pessoas que aparecem nas fotos (incluindo a
                pessoa destinatária do Jogo) para que a imagem delas seja processada,
                armazenada e exibida através da plataforma, para a finalidade específica de
                criar o Jogo;
              </li>
              <li>
                o conteúdo não viola direitos de terceiros, não é ilegal, ofensivo, discriminatório,
                ou contém imagens de menores de idade em contextos inadequados;
              </li>
              <li>não usará o serviço para assediar, constranger ou prejudicar outra pessoa.</li>
            </ul>
            <p>
              Você mantém todos os direitos autorais sobre seu conteúdo. Ao enviá-lo, você
              concede ao Amorzin uma licença limitada, não exclusiva, para armazenar,
              processar e exibir esse conteúdo exclusivamente para fins de operação do
              serviço (isto é, para que o Jogo funcione e possa ser acessado por quem você
              compartilhar o link). Essa licença termina quando o conteúdo é excluído da
              plataforma, conforme os prazos de retenção descritos na nossa Política de
              Privacidade.
            </p>
            <p>
              <strong>Você é o único responsável</strong> por obter o consentimento da pessoa
              retratada antes de enviar as fotos dela. O Amorzin não verifica esse
              consentimento no momento do envio, mas atende prontamente a pedidos de remoção
              feitos pela pessoa retratada, mesmo que ela não seja usuária cadastrada (veja a
              Seção 8 da Política de Privacidade).
            </p>
          </Section>

          <Section title="6. Planos, preços e pagamento">
            <p>
              Oferecemos dois modelos de contratação, com preços exibidos em Reais (BRL) e
              processados através do Stripe, nosso processador de pagamentos. O Amorzin não
              armazena dados completos de cartão de crédito — isso é feito integralmente pelo
              Stripe.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Básico e Super:</strong> pagamento único por Jogo criado, sem
                necessidade de cadastro. O e-mail informado no checkout é usado para envio do
                link e eventual reenvio, mesmo sem conta;
              </li>
              <li>
                <strong>Premium:</strong> pagamento único referente à conta, que permite criar
                e gerenciar Jogos ilimitados enquanto a conta existir, sem cobrança adicional
                por Jogo.
              </li>
            </ul>
            <p>
              <strong>Direito de arrependimento:</strong> nos termos do art. 49 do Código de
              Defesa do Consumidor, você tem até 7 (sete) dias corridos, a partir da
              contratação, para desistir da compra caso o serviço ainda não tenha sido
              utilizado (isto é, o link do Jogo ainda não tenha sido compartilhado/acessado
              por terceiros, ou nenhum Jogo tenha sido criado no caso do plano Premium). Como
              o Amorzin é entregue de forma instantânea e o valor da experiência está
              diretamente ligado ao compartilhamento do link, ao efetuar o pagamento você
              reconhece que a prestação do serviço se inicia imediatamente após a confirmação,
              o que pode limitar o direito de arrependimento uma vez que o link tenha sido
              acessado por terceiros. Para solicitar reembolso, entre em contato através de
              contato@amorzin.com.
            </p>
          </Section>

          <Section title="7. Cancelamento e encerramento">
            <p>
              Você pode encerrar sua conta a qualquer momento. Podemos suspender ou encerrar
              contas que violem estes Termos, sem aviso prévio, especialmente em casos de uso
              indevido de imagens de terceiros, assédio, ou atividade fraudulenta.
            </p>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              O Amorzin é fornecido "como está". Não garantimos que o serviço será
              ininterrupto ou livre de erros. Na máxima extensão permitida pela lei, não nos
              responsabilizamos por danos indiretos, incidentais ou consequenciais
              decorrentes do uso do serviço, incluindo, mas não se limitando a, reações de
              terceiros ao conteúdo compartilhado através do Jogo.
            </p>
          </Section>

          <Section title="9. Alterações nestes termos">
            <p>
              Podemos atualizar estes Termos periodicamente. Alterações significativas serão
              comunicadas por e-mail ou aviso na plataforma. O uso continuado do serviço após
              as alterações constitui aceitação dos novos termos.
            </p>
          </Section>

          <Section title="10. Lei aplicável e foro">
            <p>
              Estes Termos são regidos e interpretados estritamente de acordo com as leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer litígios, 
              dúvidas ou controvérsias oriundas destes Termos, com expressa renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>Dúvidas sobre estes Termos? Escreva para contato@amorzin.com.</p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-lg font-bold text-[#35131F]">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}