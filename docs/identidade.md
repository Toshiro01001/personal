# Identidade visual: Cadência Treino

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, o profissional, os preços e os depoimentos.

## Nome e posicionamento

**Cadência Treino**, personal trainer com treino presencial em Cuiabá e consultoria online.

Frase de posicionamento: **"Treino que cabe na sua semana e dura o ano inteiro."**

A ideia central é constância, não intensidade. O personal fictício (Tiago Maciel) vende ritmo: poucos dias por semana, bem feitos, repetidos por meses. Por isso a marca se chama Cadência e a imagem forte é a semana vista como um ritmo de barras.

## Paleta

| Nome | Hex | Papel |
| --- | --- | --- |
| Giz | `#F2F0EA` | Fundo claro das telas. Lembra o giz de magnésio e o branco fosco de quadra. |
| Giz escuro | `#E6E3DA` | Fundo de blocos de apoio (formulários, resultados), sem sombra. |
| Ferro | `#15181F` | Texto principal no claro e fundo da faixa escura (método, agenda). |
| Aço | `#525A6B` | Texto secundário e legendas. Contraste 6,1:1 sobre Giz. |
| Linha | `#CFCCC2` | Bordas de 1px e divisórias. Nunca usada como texto. |
| Cobalto | `#2140D9` | O único destaque. Barras do hero, botão principal, dia selecionado. Texto branco sobre ele tem 7,5:1. |
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

No hero, à direita do título, um gráfico em SVG desenhado à mão: sete barras verticais em Cobalto, uma por dia da semana, com alturas que formam o ritmo de uma semana de treino (dias de treino altos, dias de descanso baixos). Abaixo de cada barra, a inicial do dia. É o símbolo da marca e reaparece em miniatura no resultado do montador de plano, agora respondendo à escolha do visitante.

Sem fotos de banco de imagem, sem fotos de pessoas, sem ícones genéricos.

## Movimento

Um só momento orquestrado: ao abrir a página, as barras do hero sobem em sequência (700ms, atraso de 60ms entre elas) e o título entra de baixo para cima. Depois disso, só respostas a ações do visitante: o plano aparece, o horário selecionado muda de cor, o resultado da calculadora é atualizado.

Com `prefers-reduced-motion: reduce`, nada se move: as barras já nascem na altura final e as transições são desligadas.
