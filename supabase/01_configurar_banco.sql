-- LABORATÓRIO FINAL DE CLOUD COMPUTING
-- Executar no SQL Editor de um projeto didático Supabase.
-- O bucket imagens-produtos deve ser criado separadamente no painel de Storage.

create table if not exists public.produtos (
  id bigint generated always as identity primary key,
  nome text not null check (length(trim(nome)) between 1 and 100),
  descricao text not null check (length(trim(descricao)) between 1 and 500),
  preco numeric(10,2) not null check (preco >= 0),
  imagem_path text not null check (length(trim(imagem_path)) > 0),
  criado_em timestamptz not null default now()
);

alter table public.produtos enable row level security;

-- Grants e políticas se complementam: só o necessário para cada papel.
revoke all on table public.produtos from anon, authenticated;
grant select on table public.produtos to anon, authenticated;
grant insert on table public.produtos to authenticated;

-- A listagem é pública, pois a loja é somente demonstrativa.
drop policy if exists "Leitura publica dos produtos" on public.produtos;
create policy "Leitura publica dos produtos"
  on public.produtos for select to anon, authenticated using (true);

-- Só quem fez login pode cadastrar; sem update/delete nesta primeira versão.
drop policy if exists "Cadastro por usuarios logados" on public.produtos;
create policy "Cadastro por usuarios logados"
  on public.produtos for insert to authenticated
  with check ((select auth.uid()) is not null);

-- O upload de imagens também exige login.
-- Criar um bucket PUBLICO com nome exatamente: imagens-produtos
-- Configurar MIME image/jpeg, image/png, image/webp e limite de 2 MB no painel.
drop policy if exists "Upload autenticado imagens produtos" on storage.objects;
create policy "Upload autenticado imagens produtos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'imagens-produtos'
    and (storage.foldername(name))[1] = 'produtos'
  );

-- Não são criadas políticas de exclusão ou alteração de arquivos.
