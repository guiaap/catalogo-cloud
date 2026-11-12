-- Visualizar todos os produtos no SQL Editor (como administrador do projeto)
select id, nome, descricao, preco, imagem_path, criado_em
from public.produtos
order by criado_em desc;

-- Contar produtos cadastrados
select count(*) as total_produtos from public.produtos;

-- Exemplo: depois de enviar manualmente uma imagem ao bucket, troque o caminho
-- abaixo pelo caminho real exibido no Storage antes de executar.
-- insert into public.produtos (nome, descricao, preco, imagem_path)
-- values ('Caderno', 'Caderno para estudos', 24.90, 'produtos/caderno.png');
