// app/privacidade/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Amorzin",
  description: "Como o Amorzin coleta, usa e protege seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#FFFCFA] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl text-[#35131F]">
        <Link href="/" className="text-xs font-medium text-[#8F747C] hover:text-[#E6395B]">
          ← Voltar
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-bold">Política de Privacidade</h1>
        <p className="mt-2 text-xs text-[#A1888F]">Última atualização: 07 de setembro de 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-[#4A3A3F]">
          <Section title="1. Introdução">
            <p>
              Esta Política de Privacidade descreve como o Amorzin coleta, usa, armazena e
              protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados
              (Lei nº 13.709/2018 — LGPD). O controlador dos dados é LUCAS SOUZA ROCHA CONSULTORIA EM TECNOLOGIA DA INFORMACAO LTDA, 60.370.771/0001-00, 
              contato: contato@amorzin.com.
            </p>
          </Section>

          <Section title="2. Quais dados coletamos">
            <p><strong>Dados que você nos fornece diretamente:</strong></p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Nome e e-mail (cadastro, login via Google, ou dados fornecidos no checkout do Stripe);</li>
              <li>Senha, armazenada apenas em formato de hash irreversível (nunca em texto puro), quando o cadastro é feito por e-mail e senha;</li>
              <li>Fotos enviadas para criação do Jogo — incluindo fotos de terceiros que você escolhe incluir (veja a Seção 8, sobre pessoas não usuárias);</li>
              <li>Mensagens de texto personalizadas que você escreve para o Jogo;</li>
              <li>Dados de pagamento processados pelo Stripe — não armazenamos número de cartão, CVV ou dados sensíveis de pagamento em nossos servidores;</li>
              <li>Se você optar por login com Google, recebemos nome, e-mail e foto de perfil associados à sua conta Google, conforme autorizado por você naquele momento.</li>
            </ul>
            <p><strong>Dados coletados automaticamente:</strong></p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Cookie de sessão (necessário para manter você autenticado), armazenado como httpOnly — não acessível via JavaScript no navegador;</li>
              <li>Data e hora de criação, publicação e acesso aos Jogos;</li>
              <li>Endereço IP e informações técnicas básicas de acesso, para segurança e prevenção de fraude.</li>
            </ul>
          </Section>

          <Section title="3. Para que usamos seus dados">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Criar, publicar e disponibilizar o Jogo através de um link único;</li>
              <li>Processar pagamentos e emitir confirmações;</li>
              <li>Autenticar sua conta e permitir login (e-mail/senha ou Google);</li>
              <li>Enviar e-mails transacionais (link do Jogo, confirmação de conta Premium);</li>
              <li>Cumprir obrigações legais e prevenir fraudes;</li>
              <li>Melhorar o serviço com base em métricas agregadas e anônimas de uso.</li>
            </ul>
            <p>
              Não utilizamos seus dados para fins de publicidade direcionada, nem vendemos
              dados pessoais a terceiros.
            </p>
          </Section>

          <Section title="4. Bases legais (LGPD)">
            <p>
              Tratamos seus dados com base em: (i) execução de contrato, para viabilizar o
              serviço contratado; (ii) consentimento, para envio de comunicações opcionais e
              para o login via Google; (iii) legítimo interesse, para segurança e prevenção de
              fraudes; e (iv) cumprimento de obrigação legal, quando aplicável (ex: obrigações
              fiscais sobre pagamentos).
            </p>
          </Section>

          <Section title="5. Com quem compartilhamos seus dados (operadores)">
            <p>Utilizamos os seguintes prestadores de serviço, que processam dados em nosso nome:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong>Stripe</strong> — processamento de pagamentos;</li>
              <li><strong>Resend</strong> — envio de e-mails transacionais;</li>
              <li><strong>Cloudflare (R2)</strong> — armazenamento das fotos enviadas;</li>
              <li><strong>[Supabase / provedor de banco de dados]</strong> — armazenamento do banco de dados;</li>
              <li><strong>Google</strong> — autenticação via login social (Google Sign-In), caso você opte por esse método;</li>
              <li><strong>[Vercel / provedor de hospedagem]</strong> — hospedagem da aplicação.</li>
            </ul>
            <p>
              Cada um desses prestadores possui suas próprias políticas de privacidade e
              medidas de segurança. Não compartilhamos seus dados com terceiros para fins de
              marketing.
            </p>
          </Section>

          <Section title="6. Por quanto tempo guardamos seus dados">
            <p>
              O tempo de retenção do Jogo (fotos e mensagens) varia conforme o plano
              contratado no momento da criação:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong>Básico:</strong> link e conteúdo disponíveis por 24 horas após a publicação;</li>
              <li><strong>Super:</strong> link e conteúdo disponíveis por 1 ano após a publicação;</li>
              <li><strong>Premium:</strong> sem prazo de expiração automática, enquanto a conta estiver ativa.</li>
            </ul>
            <p>
              Após o prazo de expiração, o conteúdo (incluindo as fotos armazenadas) é
              removido definitivamente do nosso armazenamento em rotina automática periódica.
              Dados de conta (e-mail, nome) são mantidos enquanto a conta existir, e dados de
              pagamento são retidos pelo prazo exigido pela legislação fiscal aplicável.
            </p>
          </Section>

          <Section title="7. Seus direitos como titular de dados">
            <p>Nos termos da LGPD, você pode solicitar a qualquer momento:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Confirmação da existência de tratamento de dados;</li>
              <li>Acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
              <li>Eliminação dos dados tratados com base em consentimento;</li>
              <li>Revogação do consentimento, a qualquer momento;</li>
              <li>Informação sobre com quem compartilhamos seus dados.</li>
            </ul>
            <p>
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail [E-MAIL
              DE CONTATO]. Você também pode apresentar reclamação junto à Autoridade Nacional
              de Proteção de Dados (ANPD).
            </p>
          </Section>

          <Section title="8. Pessoas retratadas que não são usuárias da plataforma">
            <p>
              O Amorzin permite que um usuário envie fotos de outra pessoa — seja quem está
              recebendo um pedido de namoro, seja o parceiro ou parceira que está sendo
              surpreendido — sem que essa pessoa necessariamente tenha criado conta ou dado
              consentimento diretamente à plataforma. Reconhecemos que essa pessoa também é
              titular de dados pessoais, nos termos da LGPD, mesmo sem ser usuária cadastrada.
            </p>
            <p>
              É responsabilidade do usuário que envia a foto obter o consentimento dessa
              pessoa previamente (conforme Seção 5 dos Termos de Uso). Caso a pessoa
              retratada identifique sua imagem na plataforma e não tenha consentido com o
              uso, ela pode solicitar a remoção imediata do conteúdo, sem necessidade de
              possuir conta cadastrada, entrando em contato pelo e-mail contato@amorzin.com.
              Atenderemos a esses pedidos com prioridade e removeremos o conteúdo assim que a
              solicitação for verificada.
            </p>
          </Section>

          <Section title="9. Segurança">
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo
              senhas armazenadas com hash (bcrypt), conexões criptografadas (HTTPS/TLS), URLs
              de upload assinadas e temporárias para envio de fotos, e controle de acesso a
              informações sensíveis. Apesar dos esforços, nenhum sistema é 100% imune a
              incidentes de segurança; em caso de incidente relevante, notificaremos os
              titulares afetados e a ANPD conforme exigido por lei.
            </p>
          </Section>

          <Section title="10. Menores de idade">
            <p>
              O Amorzin não é destinado a menores de 18 anos e não coleta intencionalmente
              dados de menores. Caso identifiquemos dados de menores coletados sem
              consentimento apropriado dos responsáveis legais, esses dados serão excluídos.
            </p>
          </Section>

          <Section title="11. Alterações nesta política">
            <p>
              Podemos atualizar esta Política periodicamente. A data da última atualização
              está indicada no topo desta página. Alterações relevantes serão comunicadas por
              e-mail ou aviso na plataforma.
            </p>
          </Section>

          <Section title="12. Contato e Encarregado de Dados (DPO)">
            <p>
              Para dúvidas sobre esta Política ou para exercer seus direitos, entre em
              contato com nosso Encarregado de Proteção de Dados: Lucas, contato@amorzin.com.
            </p>
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