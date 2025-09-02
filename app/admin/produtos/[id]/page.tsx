import EditarProdutoClient from "./_components/editar-produto-client";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  // Aguardando os parâmetros conforme recomendado pelo Next.js
  const { id } = await params;
  return <EditarProdutoClient id={id} />;
}
