# Metalheart Performance

Até 15/11/2026 este site se chamava Cadência Treino; a chave `cadencia-reserva` do `localStorage`, a pasta `cadencia-premium` da fonte e alguns nomes de classe guardam o nome antigo de propósito.

Site de demonstração de um personal trainer fictício (treino presencial e consultoria online), em HTML, CSS e JavaScript próprios, com componentes premium em WebGL servidos do próprio site, feito pela Mil e Uma Linhas! para mostrar a clientes dessa profissão como poderia ser o site deles. Tudo é fictício: empresa, profissional, preços, horários e depoimentos. O `README.md` explica a organização dos arquivos e `docs/identidade.md` explica as escolhas visuais.

## Regras de trabalho

- Responda em português do Brasil, sem travessões, e chame o dono de Rodrigo Jr.
- Altere só o que foi pedido. Publicar ou fazer merge no `main` depende de pedido dele.
- Toda função criada ou alterada precisa funcionar também no celular. Teste a versão mobile, não só a de computador (`node tests/site.cjs` roda em 1280x900, iPhone 13 e 320px).
- Ao criar ou alterar o site, explique como ele funciona.
- Ao terminar uma alteração, entregue a mensagem de commit em dois blocos rotulados: "Título" (até 50 caracteres) e "Descrição" (estendida, com exatamente o que foi feito).
- Entregue arquivos soltos, nunca em `.zip`.
- O repositório é público: não coloque senhas, chaves secretas nem dados pessoais em arquivos versionados.
- Mantenha a CSP restritiva: sem script inline, sem atributo `style`, sem `<style>` criada por script, sem CDN, sem fonte externa. Alturas e cores dinâmicas só via classes ou `element.style.setProperty`. O `blob:` em `img-src` existe só para a máscara do metal líquido.
- Bibliotecas só locais, em `js/premium/` (three.js e Paper Shaders, licenças em `js/licencas/`). Esses arquivos são compilados: não edite à mão. A fonte fica no repositório privado `mil-e-uma-linhas-conteudo`, em `vitrines-fonte/cadencia-premium/`, e é gerada com `node build.mjs`.
- Ao mudar `css/estilo.css`, `js/app.js` ou `js/premium/`, troque o `?v=` desses arquivos no `index.html` e no `404.html`. Sem isso, o navegador de quem já visitou junta o HTML novo com o CSS antigo e a página quebra.
- O rodapé leva a assinatura padrão dos sites da Mil e Uma Linhas!: M1L! cromada, uma barra e o RTJ vivo (`js/assinatura.js`, imagens em `img/marca/`), com link para mileumalinhas.com.br. Não redesenhe as duas marcas e não deixe o RTJ maior que a M1L!.
- Desempenho: nenhum efeito pesado roda durante o carregamento; eles entram um por vez, e o fiscal de fluidez de `js/premium/` congela ou tira o efeito se a página ficar lenta (a escolha fica 7 dias na chave `metalheart-modo` do `localStorage`). Se o texto do título mudar, a máscara `img/cromo-titulo.png` precisa ser gerada de novo com `src/gera-mascara.js`, na fonte.
- Todo efeito de `js/premium/` precisa ter versão simples: a página funciona inteira sem WebGL, no celular e com "reduzir movimento".
- Respeite a identidade Fio de Lâmina (ver `docs/identidade.md`): aço escuro, títulos e números cromados, Cobalto como único ponto de cor (botão principal, dias acesos e a gema do símbolo), uma só família tipográfica (Archivo variável, local). O símbolo é o Sigilo; não redesenhe.
