import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"

export const revalidate = 10

export default async function PrivacyPage() {
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: 'main' },
  })

  const companyName = "Gato Arquitetura"
  const contactEmail = siteConfig?.contactEmail || "contato@gatoarquitetura.com"
  const gradientFrom = siteConfig?.gradientFrom || "#6366f1"
  const gradientTo = siteConfig?.gradientTo || "#8b5cf6"

  return (
    <>
      <Navbar config={siteConfig} />
      <main className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1
            className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
            }}
          >
            Política de Privacidade
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <p className="mb-4">
                A {companyName} coleta informações que você nos fornece diretamente quando:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Preenche formulários de contato em nosso site</li>
                <li>Envia mensagens através de nossos canais de comunicação</li>
                <li>Se inscreve em nossa newsletter ou serviços</li>
                <li>Interage com nosso conteúdo online</li>
              </ul>
              <p>
                As informações coletadas podem incluir: nome, e-mail, telefone, endereço e outras informações
                relevantes para a prestação de nossos serviços de arquitetura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
              <p className="mb-4">
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Responder às suas solicitações e fornecer nossos serviços</li>
                <li>Enviar comunicações relacionadas aos nossos serviços</li>
                <li>Melhorar nosso site e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
              <p className="mb-4">
                A {companyName} não vende, aluga ou compartilha suas informações pessoais com terceiros,
                exceto nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Com prestadores de serviços que nos auxiliam na operação do site</li>
                <li>Para proteger os direitos e segurança da empresa e de terceiros</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies e Tecnologias Semelhantes</h2>
              <p className="mb-4">
                Nosso site utiliza cookies e tecnologias semelhantes para melhorar sua experiência de navegação.
                Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Lembrar suas preferências</li>
                <li>Entender como você usa nosso site</li>
                <li>Melhorar a funcionalidade do site</li>
                <li>Fornecer conteúdo personalizado</li>
              </ul>
              <p>
                Você pode configurar seu navegador para recusar cookies, mas isso pode afetar
                a funcionalidade do site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
                No entanto, nenhum método de transmissão pela internet é 100% seguro, e não podemos
                garantir segurança absoluta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos</h2>
              <p className="mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Revogar o consentimento</li>
              </ul>
              <p>
                Para exercer seus direitos, entre em contato conosco através do e-mail: {contactEmail}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades
                descritas nesta política, salvo se um período de retenção maior for exigido ou permitido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Crianças e Adolescentes</h2>
              <p>
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente
                informações pessoais de crianças. Se você acredita que coletamos inadvertidamente informações
                de uma criança, entre em contato conosco imediatamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização
                será sempre indicada no topo da página. Recomendamos que você revise esta política regularmente
                para se manter informado sobre como protegemos suas informações.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contato</h2>
              <p className="mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre nossas práticas de privacidade,
                entre em contato conosco:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>E-mail:</strong> {contactEmail}</li>
                <li><strong>Empresa:</strong> {companyName}</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer config={siteConfig} />
    </>
  )
}
