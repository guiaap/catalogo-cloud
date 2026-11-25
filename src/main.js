import './style.css'
import { supabase, configurado, BUCKET } from './supabase.js'
import { listarProdutos, enviarImagem, cadastrarProduto } from './catalogo.js'

const $ = (id) => document.getElementById(id)
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
let usuario = null

function mostrarMensagem(id, texto, erro = false) {

  const elemento = $(id)
  elemento.textContent = texto
  elemento.style.color = erro ? '#ab3c36' : '#476959'

}

function atualizarAreaPrivada() {

  const autenticado = Boolean(usuario)

  $('login-form').classList.toggle('hidden', autenticado)
  $('logout-btn').classList.toggle('hidden', !autenticado)
  $('product-form').classList.toggle('hidden', !autenticado)
  $('form-locked').classList.toggle('hidden', autenticado)
  $('session-badge').textContent = autenticado ? 'Autenticado' : 'Visitante'
  $('session-info').textContent = autenticado
    ? `Conectado: ${usuario.email ?? 'usuário'}`
    : 'Faça login para liberar o cadastro.'

}

function renderizarProdutos(produtos) {

  const lista = $('product-list')

  lista.replaceChildren()

  if (!produtos.length) {
    mostrarMensagem('catalog-message', 'Ainda não há produtos. Cadastre o primeiro para começar.')
    return
  }

  mostrarMensagem('catalog-message', `${produtos.length} produto(s) encontrado(s).`)

  for (const produto of produtos) {

    const card = document.createElement('article')

    card.className = 'card'

    if (produto.imagem_path) {

      const img = document.createElement('img')

      img.className = 'card-image'
      img.alt = `Imagem de ${produto.nome}`
      img.loading = 'lazy'
      img.src = supabase.storage.from(BUCKET).getPublicUrl(produto.imagem_path).data.publicUrl

      card.append(img)

    } else {

      const fallback = document.createElement('div')

      fallback.className = 'card-placeholder'
      fallback.textContent = 'Sem imagem'

      card.append(fallback)
    }

    const body = document.createElement('div')
    body.className = 'card-body'

    const h = document.createElement('h3')
    h.textContent = produto.nome

    const p = document.createElement('p')
    p.className = 'card-desc'
    p.textContent = produto.descricao || 'Sem descrição.'

    const preco = document.createElement('p')
    preco.className = 'card-price'
    preco.textContent = money.format(Number(produto.preco))

    body.append(h, p, preco)
    card.append(body)
    lista.append(card)
  }
}

async function carregarProdutos() {

  if (!configurado) return

  mostrarMensagem('catalog-message', 'Consultando banco de dados...')

  try {

    const produtos = await listarProdutos()
    renderizarProdutos(produtos)

  } catch (error) {

    console.error(error)
    mostrarMensagem('catalog-message', `Não foi possível carregar produtos: ${error.message}`, true)

  }
}

async function autenticar(email, senha, criarConta = false) {

  if (!supabase) return

  mostrarMensagem('auth-message', 'Processando...')

  const { data, error } = criarConta
    ? await supabase.auth.signUp({ email, password: senha, options: { emailRedirectTo: window.location.origin } })
    : await supabase.auth.signInWithPassword({ email, password: senha })

  if (error) {

    mostrarMensagem('auth-message', error.message, true)
    return

  }

  if (criarConta && !data.session) {

    mostrarMensagem('auth-message', 'Conta criada. Verifique seu e-mail e confirme o cadastro antes de entrar.')

  } else {

    mostrarMensagem('auth-message', criarConta ? 'Conta criada e sessão iniciada.' : 'Login realizado.')
  }
}

$('login-form').addEventListener('submit', async (event) => {

  event.preventDefault()

  await autenticar($('auth-email').value.trim(), $('auth-password').value, false)
})

$('signup-btn').addEventListener('click', async () => {

  const email = $('auth-email').value.trim()
  const senha = $('auth-password').value

  if (!email || senha.length < 6) {
    mostrarMensagem('auth-message', 'Informe um e-mail e uma senha de pelo menos 6 caracteres.', true)
    return
  }

  await autenticar(email, senha, true)
})

$('logout-btn').addEventListener('click', async () => {

  const { error } = await supabase.auth.signOut()

  if (error) mostrarMensagem('auth-message', error.message, true)

  else mostrarMensagem('auth-message', 'Sessão encerrada.')
})

$('product-form').addEventListener('submit', async (event) => {

  event.preventDefault()

  if (!usuario) return

  const file = $('product-image').files[0]

  const dados = {
    nome: $('product-name').value.trim(),
    descricao: $('product-description').value.trim(),
    preco: Number($('product-price').value),
  }

  if (!file || !dados.nome || !dados.descricao || !Number.isFinite(dados.preco) || dados.preco < 0) {
    mostrarMensagem('form-message', 'Preencha todos os campos corretamente.', true)
    return
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    mostrarMensagem('form-message', 'Escolha JPG, PNG ou WebP com no máximo 2 MB.', true)
    return
  }

  $('save-btn').disabled = true

  mostrarMensagem('form-message', 'Enviando imagem e cadastrando produto...')

  try {

    const caminho = await enviarImagem(file)

    await cadastrarProduto({ ...dados, imagem_path: caminho })

    $('product-form').reset()

    mostrarMensagem('form-message', 'Produto salvo no Supabase.')

    await carregarProdutos()

  } catch (error) {

    console.error(error)
    mostrarMensagem('form-message', `Erro ao salvar: ${error.message}`, true)

  } finally {
    $('save-btn').disabled = false
  }
})

$('refresh-btn').addEventListener('click', carregarProdutos)

async function iniciar() {

  if (!configurado) {

    $('config-warning').classList.remove('hidden')

    mostrarMensagem('catalog-message', 'Preencha o .env para conectar à nuvem.', true)

    $('login-form').classList.add('hidden')

    return
  }

  const { data: { session } } = await supabase.auth.getSession()

  usuario = session?.user ?? null

  atualizarAreaPrivada()

  supabase.auth.onAuthStateChange((_event, sessionAtual) => {
    usuario = sessionAtual?.user ?? null
    atualizarAreaPrivada()
  })

  await carregarProdutos()
}

iniciar().catch(console.error)
