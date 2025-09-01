import EditarProdutoClient from "./_components/editar-produto-client";

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  return <EditarProdutoClient id={params.id} />;
}
