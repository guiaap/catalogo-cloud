import { supabase, BUCKET } from './supabase.js'

/**
 * SEMANA 2 — TODO 1: buscar os registros da tabela public.produtos.
 * Dica: supabase.from('produtos').select('id,nome,descricao,preco,imagem_path')
 * Ordene por criado_em em ordem decrescente.
 * Retorno esperado: array de objetos; propague erros para main.js.
 */
export async function listarProdutos() {
  
    const { data, error } = 
      await supabase.from('produtos')
      .select('id,nome,descricao,preco,imagem_path')
      .order('criado_em', { ascending: false });

    if (error) {
      throw new Error("Tente novamente")
    }
   
    return data ?? [];
}

/**
 * SEMANA 3 — TODO 2: enviar a imagem para o bucket imagens-produtos.
 * Gere um caminho único dentro da pasta produtos/: produtos/UUID.ext
 * Dica: supabase.storage.from(BUCKET).upload(caminho, arquivo)
 * Retorno esperado: caminho relativo salvo no Storage.
 */
export async function enviarImagem(arquivo) {

  const caminho = `produtos/${crypto.randomUUID()}.png`

  const { error } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, { upsert: false })

  if(error) {
    throw new Error("Erro ao cadastrar o produto")
  }
  
  return caminho
}

/**
 * SEMANA 3 — TODO 3: salvar nome, descricao, preco e imagem_path no banco.
 * Dica: supabase.from('produtos').insert([{...}])
 * Retorno esperado: sem erro ou lançar erro para a interface.
 */
export async function cadastrarProduto(produto) {

  const { error } = await supabase.from('produtos').insert({
    nome: produto.nome, descricao: produto.descricao,
    preco: produto.preco, imagem_path: produto.imagem_path
  })
  
  if(error) {
    throw new Error("Erro ao cadastrar o produto")
  }
  
}
