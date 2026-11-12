import { supabase, BUCKET } from './supabase.js'

/**
 * SEMANA 2 — TODO 1: buscar os registros da tabela public.produtos.
 * Dica: supabase.from('produtos').select('id,nome,descricao,preco,imagem_path')
 * Ordene por criado_em em ordem decrescente.
 * Retorno esperado: array de objetos; propague erros para main.js.
 */
export async function listarProdutos() {
  // TODO: IMPLEMENTAR A CONSULTA AO POSTGRES

    const { data, error } = 
      await supabase.from('produtos')
      .select('id,nome,descricao,preco,imagem_path')
      .order('criado_em', { ascending: false });

    if (error) {
      throw new Error("Tente novamente");
    }
   

    return data ?? [];
  // throw new Error('TODO 1: implemente listarProdutos() em src/catalogo.js')
}

/**
 * SEMANA 3 — TODO 2: enviar a imagem para o bucket imagens-produtos.
 * Gere um caminho único dentro da pasta produtos/: produtos/UUID.ext
 * Dica: supabase.storage.from(BUCKET).upload(caminho, arquivo)
 * Retorno esperado: caminho relativo salvo no Storage.
 */
export async function enviarImagem(arquivo) {
  // TODO: IMPLEMENTAR UPLOAD NO OBJECT STORAGE
  throw new Error('TODO 2: implemente enviarImagem() em src/catalogo.js')
}

/**
 * SEMANA 3 — TODO 3: salvar nome, descricao, preco e imagem_path no banco.
 * Dica: supabase.from('produtos').insert([{...}])
 * Retorno esperado: sem erro ou lançar erro para a interface.
 */
export async function cadastrarProduto(produto) {
  // TODO: IMPLEMENTAR INSERT NO POSTGRES
  throw new Error('TODO 3: implemente cadastrarProduto() em src/catalogo.js')
}
