import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/footer"
import { prisma } from "@/lib/prisma"

export const revalidate = 10

export default async function TermsPage() {
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
            Termos de Uso
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o site da {companyName}, você concorda em cumprir e estar vinculado
                aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes
                termos, não deve usar nosso site ou serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição dos Serviços</h2>
              <p className="mb-4">
                A {companyName} oferece serviços de arquitetura e design, incluindo mas não limitado a:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Projetos arquitetônicos residenciais e comerciais</li>
                <li>Design de interiores</li>
                <li>Consultoria em arquitetura</li>
                <li>Gerenciamento de projetos</li>
                <li>Outros serviços relacionados conforme acordado</li>
              </ul>
              <p>
                Os detalhes específicos de cada serviço serão definidos em contratos individuais
                entre a empresa e o cliente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso do Site</h2>
              <p className="mb-4">
                Você concorda em usar nosso site apenas para fins legais e de maneira que não infrinja
                os direitos de terceiros ou restrinja ou iniba o uso do site por qualquer outra pessoa.
              </p>
              <p className="mb-4">
                É proibido:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Usar o site para qualquer finalidade ilegal ou fraudulenta</li>
                <li>Tentar obter acesso não autorizado ao site ou sistemas relacionados</li>
                <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                <li>Coletar ou armazenar dados pessoais de outros usuários</li>
                <li>Reproduzir, duplicar, copiar ou revender qualquer parte do site sem permissão</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todo o conteúdo presente neste site, incluindo textos, gráficos, logotipos, imagens,
                fotografias de projetos, e software, é propriedade da {companyName} ou de seus
                licenciadores e está protegido por leis de direitos autorais e propriedade intelectual.
              </p>
              <p>
                Você não pode reproduzir, distribuir, modificar, criar trabalhos derivados, exibir
                publicamente ou explorar comercialmente qualquer conteúdo do site sem nossa permissão
                expressa por escrito.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contratação de Serviços</h2>
              <p className="mb-4">
                A contratação de serviços de arquitetura está sujeita a:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Disponibilidade de agenda e capacidade da equipe</li>
                <li>Assinatura de contrato específico de prestação de serviços</li>
                <li>Pagamento conforme condições acordadas em contrato</li>
                <li>Fornecimento de informações e documentação necessária pelo cliente</li>
              </ul>
              <p>
                As informações fornecidas através do site não constituem uma oferta vinculativa
                de serviços. Todos os projetos estão sujeitos a avaliação e aprovação pela {companyName}.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Preços e Pagamentos</h2>
              <p className="mb-4">
                Os preços dos serviços são determinados caso a caso e serão especificados em
                contrato individual. Os preços podem variar dependendo de:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Escopo e complexidade do projeto</li>
                <li>Prazo de entrega</li>
                <li>Localização do projeto</li>
                <li>Serviços adicionais solicitados</li>
              </ul>
              <p>
                Todos os pagamentos devem ser efetuados conforme as condições especificadas no
                contrato de serviços.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prazos e Entregas</h2>
              <p>
                Os prazos de entrega são estimados e podem estar sujeitos a alterações devido a
                circunstâncias imprevistas, atrasos no fornecimento de informações pelo cliente,
                ou outros fatores fora do controle da {companyName}. Faremos todos os esforços
                razoáveis para cumprir os prazos acordados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancelamento e Reembolso</h2>
              <p className="mb-4">
                Políticas de cancelamento e reembolso serão especificadas em cada contrato individual.
                Geralmente:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Cancelamentos devem ser comunicados por escrito</li>
                <li>Trabalhos já realizados serão cobrados proporcionalmente</li>
                <li>Reembolsos, quando aplicáveis, serão processados conforme contrato</li>
                <li>Materiais e custos já incorridos não são reembolsáveis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Responsabilidades e Limitações</h2>
              <p className="mb-4">
                A {companyName} se esforça para fornecer serviços de alta qualidade, porém:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Não garantimos que o site estará disponível ininterruptamente</li>
                <li>Não somos responsáveis por decisões tomadas com base em informações do site</li>
                <li>Nossa responsabilidade está limitada aos termos do contrato de serviços</li>
                <li>Não nos responsabilizamos por atrasos causados por terceiros ou clientes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Confidencialidade</h2>
              <p>
                Todas as informações compartilhadas entre a {companyName} e seus clientes serão
                tratadas como confidenciais. Não divulgaremos informações sobre projetos ou clientes
                sem consentimento prévio, exceto quando exigido por lei.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Links para Sites de Terceiros</h2>
              <p>
                Nosso site pode conter links para sites de terceiros. Não temos controle sobre
                o conteúdo ou práticas desses sites e não assumimos responsabilidade por eles.
                Recomendamos que você leia os termos de uso e políticas de privacidade de qualquer
                site de terceiros que visitar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modificações dos Termos</h2>
              <p>
                Reservamos o direito de modificar estes termos de uso a qualquer momento.
                As alterações entrarão em vigor imediatamente após a publicação no site.
                Seu uso continuado do site após as alterações constituirá sua aceitação
                dos termos revisados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil.
                Qualquer disputa relacionada a estes termos será submetida à jurisdição
                exclusiva dos tribunais brasileiros.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contato</h2>
              <p className="mb-4">
                Para questões sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>E-mail:</strong> {contactEmail}</li>
                <li><strong>Empresa:</strong> {companyName}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Disposições Gerais</h2>
              <p className="mb-4">
                Se qualquer disposição destes termos for considerada inválida ou inexequível,
                as demais disposições permanecerão em pleno vigor e efeito. A falha em exercer
                qualquer direito ou disposição destes termos não constituirá uma renúncia a
                esse direito ou disposição.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer config={siteConfig} />
    </>
  )
}
