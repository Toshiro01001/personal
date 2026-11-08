# Identidade visual: Cadência Treino

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, o profissional, os preços e os depoimentos.

## Nome e posicionamento

**Cadência Treino**, personal trainer com treino presencial em Cuiabá e consultoria online.

Frase de posicionamento: **"Treino que cabe na sua semana e dura o ano inteiro."**

A ideia central é constância, não intensidade. O personal fictício (Tiago Maciel) vende ritmo: poucos dias por semana, bem feitos, repetidos por meses. Por isso a marca se chama Cadência e a imagem forte é uma foto limpa de equipamento de treino; o ritmo da semana aparece em barras no resultado do plano.

## Paleta

| Nome | Hex | Papel |
| --- | --- | --- |
| Giz | `#F2F0EA` | Fundo claro das telas. Lembra o giz de magnésio e o branco fosco de quadra. |
| Giz escuro | `#E6E3DA` | Fundo de blocos de apoio (formulários, resultados), sem sombra. |
| Ferro | `#15181F` | Texto principal no claro e fundo da faixa escura (método, agenda). |
| Aço | `#525A6B` | Texto secundário e legendas. Contraste 6,1:1 sobre Giz. |
| Linha | `#CFCCC2` | Bordas de 1px e divisórias. Nunca usada como texto. |
| Cobalto | `#2140D9` | O único destaque. Botão principal, dia selecionado e a semana em barras do resultado do plano; a toalha da foto do hero ecoa a cor. Texto branco sobre ele tem 7,5:1. |
| Cobalto claro | `#8FA2FF` | Versão do destaque para texto pequeno sobre Ferro (7,4:1), porque o Cobalto puro some no fundo escuro. |

Regra de uso: o Cobalto aparece em um lugar por tela, no máximo dois quando um deles é o botão principal. Nada de gradiente. Nenhum cartão com sombra: separação por linhas de 1px e por alternância Giz / Ferro.

Fugimos de propósito do preto com laranja e do neon de academia. O Ferro é um azul quase preto e o Giz é quente, então a página parece uma prancheta de treino, não um outdoor de suplemento.

## Tipografia

Uma só família: **Archivo** (variável, eixos de peso 100 a 900 e de largura 62 a 125), licença OFL, arquivo local em `fonts/archivo-latin-variable.woff2` (90 KB) com a licença em `fonts/LICENSE-Archivo-OFL.txt`.

Dois papéis com a mesma fonte, usando o eixo de largura:

- **Voz de título**: largura 70, peso 800, caixa alta nos títulos de seção, entrelinha 0,95, espaçamento de letras levemente negativo. Condensada e pesada, como número de camisa.
- **Voz de texto**: largura 100, peso 400, entrelinha 1,55. Rótulos de formulário em largura 90, peso 600.

Escala (desktop, com `clamp` no celular):

| Papel | Tamanho | Peso / largura |
| --- | --- | --- |
| Título principal (h1) | 96px desktop, 48px celular | 800 / 70 |
| Título de seção (h2) | 56px desktop, 36px celular | 800 / 70 |
| Subtítulo (h3) | 22px | 700 / 85 |
| Corpo | 17px | 400 / 100 |
| Legenda e avisos | 14px | 500 / 95 |
| Números grandes (resultado, preço) | 64px | 800 / 70, algarismos tabulares |

Regra de peso: só 400, 600, 700 e 800. Nada de itálico.

## Layout

- Grade de 12 colunas, largura máxima 1180px, calha de 24px (16px no celular).
- Espaçamento em múltiplos de 8: 8, 16, 24, 40, 64, 112.
- Alinhamento à esquerda em tudo. Centralização só no 404.
- Cada seção começa com uma linha de 1px e um título condensado. Sem rótulos em caixa alta acima dos títulos e sem numeração decorativa.
- Alternância de fundos: Giz (hero, plano, calculadora, depoimentos), Ferro (método e agenda).
- Faixa fina e fixa no topo avisando que é demonstração da Mil e Uma Linhas!.

## Imagem forte

O hero é uma **foto gerada por IA (Canva)**, ilustrativa: uma kettlebell preta de ferro sobre um piso de concreto cinza, uma corda de pular preta e uma toalha dobrada em azul-cobalto, diante de uma parede clara cortada por uma sombra diagonal. A luz dura e a sombra geométrica combinam com a Archivo condensada do título, e o azul da toalha é o único ponto de cor, o mesmo Cobalto da marca. Não há pessoas.

O contêiner tem proporção fixa de 4:3, cantos de 3 px (o mesmo raio dos botões) e sem sombra nem borda. Enquanto a foto carrega, ele mostra a cor média dela. O gráfico de sete barras que ficava no hero foi retirado; a miniatura da semana continua no resultado do montador de plano, respondendo à escolha do visitante.

Sem fotos de banco de imagem, sem fotos de pessoas, sem ícones genéricos.

### Foto do hero

- **Arquivo**: `img/hero.webp`, 1440 x 1080 px, proporção 4:3.
- **Origem**: gerada por IA no Canva. O README e este estudo avisam que é ilustrativa.
- **Prompt resumido**: "Natureza-morta de treino em estúdio: uma kettlebell preta fosca de ferro fundido, uma corda de pular preta com cabos escuros e uma toalha dobrada em azul-cobalto vivo, sobre piso de concreto cinza. Parede em tom de giz ao fundo, luz dura de janela com uma sombra diagonal nítida. Estilo editorial de site premium, sem texto, sem pessoas, proporção 4:3."
- **Texto alternativo**: descreve a kettlebell, a corda de pular, a toalha azul e a parede com a sombra.
- **Texto do hero**: fica ao lado da foto no computador e abaixo dela no celular, nunca por cima. O contraste do texto é o da página (Ferro sobre Giz) e não depende da foto.

## Movimento

Um só momento orquestrado: ao abrir a página, o título entra de baixo para cima, linha por linha (700ms), e a foto do hero aparece com um fade de 900ms. Depois disso, só respostas a ações do visitante: o plano aparece, o horário selecionado muda de cor, o resultado da calculadora é atualizado.

Com `prefers-reduced-motion: reduce`, nada se move: o título e a foto já aparecem prontos e as transições são desligadas.
