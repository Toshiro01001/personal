# Cadência Treino

Este é um site de demonstração que eu, Rodrigo Jr, da [Mil e Uma Linhas!](https://mileumalinhas.com.br), fiz para mostrar a personal trainers como poderia ser o site deles. Ele está publicado em https://toshiro01001.github.io/personal/.

![Página inicial no computador](docs/capa-desktop.webp)

## O que é, em uma frase

É o site de um personal trainer inventado, o Tiago Maciel, da "Cadência Treino": você escolhe seu objetivo e vê um plano de treino de exemplo com o preço, calcula seu IMC e seu gasto calórico e escolhe um horário para uma aula de experiência. Tudo funciona na hora, dentro da página.

## Aviso: tudo aqui é fictício

A empresa, o profissional, o endereço, o telefone, os preços, os horários ocupados e os depoimentos foram inventados por mim para a demonstração. Nada é vendido, cobrado, agendado ou enviado de verdade. Uma faixa fixa no topo do site diz isso o tempo todo.

## Como usar, passo a passo

1. Abra https://toshiro01001.github.io/personal/ no celular ou no computador.
2. Em **Monte seu plano**, toque no objetivo, no número de dias, no local e no formato. O plano de exemplo e o valor mensal mudam na hora, à direita (ou logo abaixo, no celular).
3. Em **Calculadora**, digite idade, altura e peso e escolha seu nível de atividade. O IMC e o gasto calórico aparecem enquanto você digita. Se digitar um número fora do razoável, o site avisa.
4. Em **Horários livres**, escolha a semana (botões "Semana anterior" e "Próxima semana"), toque em um horário marcado como "Livre" (no celular, toque no dia e depois em **Escolher** na linha do horário), escreva seu primeiro nome se quiser e toque em **Confirmar aula de experiência**. A confirmação aparece na tela e fica guardada só no seu navegador. **Cancelar reserva** apaga tudo.
5. Em **Quem treina comigo**, no computador, passe os depoimentos com as setas redondas ou arrastando o cartão; no celular eles aparecem um embaixo do outro.
6. No fim da página, **Como isto funciona** explica o site para quem não é da área e tem um bloco "Detalhes técnicos" para quem programa.

## Capturas

| Computador | Celular |
| --- | --- |
| ![Montador de plano no computador](docs/funcao-plano.webp) | ![Montador de plano no celular](docs/funcao-plano-celular.webp) |
| ![Calculadora no computador](docs/funcao-calculadora.webp) | ![Página inicial no celular](docs/capa-celular.webp) |
| ![Agenda no computador](docs/funcao-agenda.webp) | ![Agenda no celular](docs/funcao-agenda-celular.webp) |

## Identidade visual, em resumo

O estudo completo está em [`docs/identidade.md`](docs/identidade.md).

- **Nome e ideia**: Cadência Treino. A marca vende constância, não intensidade: "Treino que cabe na sua semana e dura o ano inteiro".
- **Paleta**: Giz `#F2F0EA` (fundo), Ferro `#15181F` (texto e faixas escuras), Aço `#525A6B` (texto secundário), Linha `#CFCCC2` (bordas) e um único destaque, Cobalto `#2140D9`, que aparece em um lugar por tela. Fugi de propósito do preto com laranja e do neon de academia; o resultado lembra uma prancheta de treino.
- **Fonte**: só uma, a Archivo variável (licença OFL), servida do próprio site em `fonts/`. Nos títulos ela fica condensada e pesada, como número de camisa; no texto fica normal. Nenhuma fonte vem de fora.
- **Imagem forte**: uma foto de uma kettlebell, uma corda de pular e uma toalha azul-cobalto sobre concreto (`img/hero.webp`). A semana em barras continua no resultado do plano, subindo a cada escolha de dias.
- **Fotos**: **todas as fotos do site foram geradas por IA no Canva e são só ilustrativas**: os lugares, os objetos e as pessoas não existem. Pessoas aparecem sempre de costas, sem rosto reconhecível. Sem fotos de banco de imagem.
- **Design systems da leva final**: as seções claras seguem o estilo de marca de atleta (Lando Norris DS) e as escuras seguem o painel de bordas finas (Ledger DS), sempre com a paleta acima e código próprio. A lista de cada componente e onde ele está fica em [`docs/identidade.md`](docs/identidade.md).
- **Movimento**: títulos revelados linha a linha, barras e números que respondem às escolhas, blocos que entram ao rolar, uma faixa em loop com botão de pausa e o carrossel de depoimentos. Com "reduzir movimento" ativado no aparelho, nada se move.

## Fotos

| Arquivo | Tamanho | Onde aparece |
| --- | --- | --- |
| `img/hero.webp` | 1440 x 1080 | abertura |
| `img/local-academia.webp` | 1456 x 816 | resultado do plano, local Academia |
| `img/local-casa.webp` | 1456 x 816 | resultado do plano, local Em casa |
| `img/local-arlivre.webp` | 1456 x 816 | resultado do plano, local Ao ar livre |
| `img/metodo-avaliacao.webp` | 1456 x 970 | cartão Avaliação, em Como eu trabalho |
| `img/metodo-plano.webp` | 1456 x 970 | cartão Plano, em Como eu trabalho |
| `img/metodo-ajuste.webp` | 1456 x 970 | cartão Ajuste, em Como eu trabalho |
| `img/tiago-retrato.webp` | 1152 x 1440 | ao lado da bio do personal |
| `img/agenda-aula-experiencia.webp` | 1456 x 1088 | ao lado da introdução de Horários livres |

Todas foram geradas por IA no Canva e são ilustrativas. A foto do plano troca sozinha quando você escolhe o local.

## Como funciona por dentro

O site é um arquivo HTML, um CSS e um JavaScript, lidos direto pelo navegador. Não existe servidor meu, banco de dados nem conta.

- **Montador de plano**: dentro do JavaScript há uma tabela de divisões de treino por número de dias (2 a 5), uma lista de exercícios para cada grupo muscular em três versões (academia, casa, ar livre) e uma tabela de preços por formato. Quando você muda uma opção, o código junta essas peças, troca a foto do local, redesenha as barras da semana (a altura de cada barra acompanha o tamanho do treino do dia) e faz o preço contar do valor antigo ao novo.
- **Carrossel e faixa**: a partir de 720 px de largura os depoimentos viram carrossel (setas, arraste ou as setas do teclado); abaixo disso ficam em pilha. A faixa de locais e dias pausa com o mouse em cima ou pelo botão de pausa.
- **Calculadora**: IMC é peso dividido pela altura ao quadrado. O gasto diário usa a fórmula de Mifflin-St Jeor para o metabolismo basal, multiplicada pelo fator de atividade que você escolheu. O resultado é arredondado de 10 em 10 kcal e vem com aviso de que é estimativa.
- **Agenda**: a grade da semana é montada a partir da data de hoje. Os horários "ocupados" vêm de uma função que transforma data e hora em um número sempre igual, então a agenda parece real e não muda a cada recarga. A reserva fica no `localStorage` do seu navegador, com aviso na tela e botão para apagar.

## Detalhes técnicos

- HTML, CSS e JavaScript puros. Sem framework, sem CDN, sem analytics, sem fonte externa.
- Content Security Policy por meta: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`. Nenhum script inline e nenhum atributo `style`.
- Acessibilidade: `lang="pt-BR"`, contraste AA ou melhor em todos os pares de cor, foco visível, formulários com `label`, `fieldset` e `legend`, resultados em regiões `aria-live`, agenda em tabela com cabeçalhos e botões reais, link "pular para o conteúdo".
- Celular primeiro: grade de uma coluna até 900px, calha de 16px abaixo de 600px, agenda com seletor de dia e lista de horários abaixo de 720px, depoimentos em pilha abaixo de 720px, alvos de toque de pelo menos 44px.
- Movimento só com CSS e JavaScript próprios (IntersectionObserver, `requestAnimationFrame`, transições), tudo desligado com `prefers-reduced-motion: reduce`. Valores dinâmicos (altura das barras, atraso das entradas) entram por `element.style.setProperty`, que a CSP permite.
- Arquivos: `index.html`, `404.html` (caminhos absolutos em `/personal/`), `robots.txt`, `sitemap.xml`, `favicon.svg`, `img/` (as nove fotos da tabela acima), `css/estilo.css`, `js/app.js`, `fonts/`, `docs/` (identidade, vistoria e capturas), `tests/site.cjs`.

## Como rodar no seu computador

```
cd personal
python3 -m http.server 8306
```

Depois abra http://localhost:8306/ no navegador. Qualquer servidor de arquivos estáticos serve.

## Testes

```
node tests/site.cjs
```

O script usa o Playwright, sobe o servidor sozinho se precisar e testa em três tamanhos: computador 1280x900, iPhone 13 e 320px de largura. Em cada um verifica: nenhum erro de console, nenhum pedido de rede para fora, nenhuma rolagem horizontal, nenhum texto cortado, fonte local carregada, e as três funções (preço e exercícios do plano, valores da calculadora e mensagem de erro, reserva e cancelamento na agenda com `localStorage`). Com `CAPTURAS=1 SHOTS_DIR=/pasta` também salva capturas PNG.

## Segurança

A vistoria está em [`docs/vistoria.md`](docs/vistoria.md). Em resumo: nada sai do navegador, a CSP bloqueia scripts e conexões externas, o único dado guardado é a reserva simulada no `localStorage` (com aviso e botão para apagar) e não há nenhuma dependência em tempo de execução. O repositório é público e não contém dados reais, senhas ou chaves.

## Quem fez

Rodrigo Jr, [Mil e Uma Linhas!](https://mileumalinhas.com.br), Cuiabá. Se você é personal trainer e quer um site assim com a sua cara, é lá que a gente conversa.
