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

- **Nome e ideia**: Cadência Treino. A frase da abertura é "Forje sua força. Domine seus limites.", e o método continua sendo constância: poucos dias por semana, repetidos por meses.
- **Estilo**: Fio de Lâmina, na estética Metalheart (fim dos anos 1990 a meados dos 2000): aço escuro, títulos e números cromados, miras e marcações técnicas.
- **Paleta**: fundos de aço quase preto (`#0B0E13`, `#10141B`, `#050709`), texto claro `#E7EBF1`, Aço `#8F98A7` (texto secundário) e um único ponto de cor, Cobalto `#2140D9`, no botão principal, nos dias acesos e na gema do símbolo.
- **Fonte**: só uma, a Archivo variável (licença OFL), servida do próprio site em `fonts/`. Nos títulos ela fica condensada e pesada, como número de camisa; no texto fica normal. Nenhuma fonte vem de fora.
- **Imagem forte**: o Sigilo, um emblema de lâminas de aço com uma gema azul-cobalto, no centro de uma mira que marca os sete dias da semana com três acesos. Ele gira conforme o ponteiro: são 15 imagens já prontas (`img/sigilo-giro.webp`) trocadas num quadro, sem 3D em tempo real. A semana em barras continua no resultado do plano, subindo a cada escolha de dias.
- **Fotos**: **todas as fotos do site foram geradas por IA no ChatGPT e são só ilustrativas**: os lugares, os objetos e as pessoas não existem. Pessoas aparecem sempre de costas, sem rosto reconhecível. Sem fotos de banco de imagem.
- **Base**: a estrutura dos componentes vem da leva anterior (marca de atleta do Lando Norris DS e painel de bordas finas do Ledger DS), agora toda em aço escuro e com código próprio. A lista de cada componente e onde ele está fica em [`docs/identidade.md`](docs/identidade.md).
- **Movimento**: títulos revelados linha a linha, barras e números que respondem às escolhas, blocos que entram ao rolar, uma faixa em loop com botão de pausa e o carrossel de depoimentos. Com "reduzir movimento" ativado no aparelho, nada se move.

## Fotos

| Arquivo | Tamanho | Onde aparece |
| --- | --- | --- |
| `img/sigilo-frente.webp` | 640 x 860 | abertura, símbolo parado |
| `img/sigilo-giro.webp` | 9600 x 860 | abertura, 15 quadros do giro do símbolo |
| `img/sigilo-marca.webp` | 96 x 129 | símbolo ao lado do nome, no topo |
| `img/local-academia.webp` | 1456 x 816 | resultado do plano, local Academia |
| `img/local-casa.webp` | 1456 x 816 | resultado do plano, local Em casa |
| `img/local-arlivre.webp` | 1456 x 816 | resultado do plano, local Ao ar livre |
| `img/metodo-avaliacao.webp` | 1456 x 970 | cartão Avaliação, em Como eu trabalho |
| `img/metodo-plano.webp` | 1456 x 970 | cartão Plano, em Como eu trabalho |
| `img/metodo-ajuste.webp` | 1456 x 970 | cartão Ajuste, em Como eu trabalho |
| `img/tiago-retrato.webp` | 1152 x 1440 | ao lado da bio do personal |
| `img/agenda-aula-experiencia.webp` | 1456 x 1088 | ao lado da introdução de Horários livres |

As fotos foram geradas por IA no ChatGPT e são ilustrativas. As três imagens do Sigilo são renderizações minhas. A foto do plano troca sozinha quando você escolhe o local.

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
