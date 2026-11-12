# Catálogo Cloud — Supabase + Vite

Projeto didático da disciplina Cloud Computing. O catálogo permite **listar produtos publicamente** e **cadastrar com login**. Cada produto possui imagem, nome, descrição e preço.

## Pré-requisitos

- Node.js **20.19+ ou 22.12+** (ou mais novo compatível)
- Conta no [Supabase](https://supabase.com)
- Um projeto Supabase gratuito

## Configurar a nuvem (uma vez por grupo)

1. No Supabase, crie um projeto e abra **SQL Editor**.
2. Execute `supabase/01_configurar_banco.sql`.
3. Em **Storage**, crie um bucket **público** com ID exato `imagens-produtos`.
4. Se disponível, limite o bucket a arquivos JPG, PNG e WebP com até 2 MB.
5. Em **Authentication**, confirme que Email é um método habilitado.
6. Configure, se necessário, `http://localhost:5173` como **Site URL** e URL de redirecionamento para confirmação de e-mail.
7. Use **Criar acesso** na aplicação uma única vez e confirme o e-mail (pode haver limitações de envio no plano gratuito). Depois, desative **Allow new users to sign up** no Dashboard. Assim, novos visitantes não conseguem criar logins para enviar conteúdo.
8. Para inserir manualmente os primeiros produtos, envie uma imagem para `imagens-produtos/produtos/` e use o **Table Editor** para inserir o registro com o caminho exato, por exemplo `produtos/foto.png`.

> **Segurança:** jamais utilize a Secret Key ou `service_role` no Vite/browser. A Publishable Key não é secreta; os controles são RLS e permissões. Não use dados pessoais e não compartilhe senhas.

## Executar o projeto

```bash
npm install
cp .env.example .env     # Linux/macOS
# No Windows, copie o arquivo manualmente, ou use: copy .env.example .env
```

No `.env`, preencha:

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Em seguida:

```bash
npm run dev
```

Abra http://localhost:5173. Após modificar `.env`, reinicie o servidor. `npm run build` gera a versão para publicação em `dist/`.

## Caminho dos dados

1. `src/main.js` apresenta e controla a interface.
2. `src/supabase.js` configura a conexão e o bucket.
3. `src/catalogo.js` contém consultas ao banco, upload de imagem e cadastro.
4. `supabase/01_configurar_banco.sql` cria a tabela e as políticas de acesso.

## Regras do laboratório

- Produto: nome, descrição, preço >= 0 e imagem JPG/PNG/WebP até 2 MB.
- Todos podem visualizar os produtos e suas imagens; só usuários logados podem cadastrar.
- **Não implementar** compras, carrinho, pagamento, frete, estoque ou painel de gestão completo.
- Cada grupo deve usar seu próprio projeto gratuito. Um bucket público significa que as **imagens são públicas**.
- Não versionar `.env`; ele está no `.gitignore`.

## Solução de problemas

- **Tela informa .env inválido:** revise nomes das variáveis e reinicie o Vite.
- **Erro 42501 / permission denied / RLS:** verifique se rodou o SQL completo; o INSERT e upload exigem login.
- **Imagem não aparece:** verifique se bucket é público e se `imagem_path` corresponde ao caminho relativo ao bucket.
- **Falha ao criar login:** revise confirmação por e-mail, URL de redirecionamento e limite de emails do plano.
- **Failed to fetch:** confira URL do projeto e conexão com a Internet.
- **Produto não aparece:** confira SELECT, permissões e possíveis erros no Console do navegador.
- **Upload funcionou e INSERT falhou:** pode sobrar arquivo sem registro. Remova-o manualmente no Dashboard para não acumular lixo (a aplicação não possui DELETE).

## Documentação oficial

- https://vite.dev/guide/
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/auth/passwords

## ATIVIDADE DO ALUNO

Implemente os três TODOs em `src/catalogo.js`. A interface, login e validações já estão prontos para que o foco seja em Database e Storage.
