import Link from "next/link";

export default async function AgendarConsultaPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand">
          Consultoria técnica
        </p>
        <h1 className="mt-4 text-3xl font-bold uppercase tracking-tight text-black md:text-4xl">
          Agende sua call de diagnóstico
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5a5a5a]">
          Nossa equipe entrará em contato para uma avaliação técnica do seu
          ambiente corporativo, com foco em infraestrutura, SLA e migrações
          críticas.
        </p>
        {email ? (
          <p className="mt-6 text-sm text-[#8a8a8a]">
            E-mail informado:{" "}
            <span className="font-medium text-black">{email}</span>
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-brand px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Voltar para a home
        </Link>
      </div>
    </main>
  );
}
