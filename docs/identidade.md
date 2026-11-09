# Identidade visual: Cadência Treino

Estudo curto feito antes do código. Tudo aqui é fictício: a empresa, o profissional, os preços e os depoimentos.

## Nome e posicionamento

**Cadência Treino**, personal trainer com treino presencial em Cuiabá e consultoria online.

Frase de posicionamento: **"Treino que cabe na sua semana e dura o ano inteiro."**

A ideia central é constância, não intensidade. O personal fictício (Tiago Maciel) vende ritmo: poucos dias por semana, bem feitos, repetidos por meses. Por isso a marca se chama Cadência e a imagem forte é uma foto limpa de equipamento de treino; o ritmo da semana aparece em barras que sobem no resultado do plano.

## Paleta

| Nome | Hex | Papel |
| --- | --- | --- |
| Giz | `#F2F0EA` | Fundo claro das telas. Lembra o giz de magnésio e o branco fosco de quadra. |
| Giz escuro | `#E6E3DA` | Fundo de blocos de apoio (formulários, resultados), sem sombra. |
| Ferro | `#15181F` | Texto principal no claro e fundo da faixa escura (método, agenda). |
| Aço | `#525A6B` | Texto secundário e legendas. Contraste 6,1:1 sobre Giz. |
| Linha | `#CFCCC2` | Bordas de 1px e divisórias. Nunca usada como texto. |
| Cobalto | `#2140D9` | O único destaque. Botão principal, dia selecionado e a semana em barras do resultado do plano; a toalha das fotos ecoa a cor. Texto branco sobre ele tem 7,5:1. |
| Cobalto claro | `#8FA2FF` | Versão do destaque para texto pequeno sobre Ferro (7,4:1), porque o Cobalto puro some no fundo escuro. |
| Cartão Ferro | `#1B1F28` | Cartões e trilhos sobre Ferro (etapas do método, seletor de semana e de dia, confirmação), com borda `rgba(242,240,234,.08)`. Não é cor nova: é o Ferro um tom acima, sem sombra. |

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
- Alternância de fundos: Giz (hero, plano, calculadora, depoimentos), Ferro (método, agenda e rodapé).
- Faixa fina e fixa no topo avisando que é demonstração da Mil e Uma Linhas!.

## Imagem forte

O hero é uma **foto gerada por IA (Canva)**, ilustrativa: uma kettlebell preta de ferro sobre um piso de concreto cinza, uma corda de pular preta e uma toalha dobrada em azul-cobalto, diante de uma parede clara cortada por uma sombra diagonal. A luz dura e a sombra geométrica combinam com a Archivo condensada do título, e o azul da toalha é o único ponto de cor, o mesmo Cobalto da marca. Não há pessoas.

O contêiner tem proporção fixa de 4:3, cantos de 3 px (o mesmo raio dos botões) e sem sombra nem borda. Enquanto a foto carrega, ele mostra a cor média dela. O gráfico de sete barras que ficava no hero foi retirado; a miniatura da semana continua no resultado do montador de plano, respondendo à escolha do visitante.

Sem fotos de banco de imagem e sem ícones genéricos. Na leva final entraram fotos com pessoas, sempre vistas de costas e sem rosto reconhecível (o personal anotando a avaliação e uma aula de experiência), todas geradas por IA no Canva e ilustrativas.

### Foto do hero

- **Arquivo**: `img/hero.webp`, 1440 x 1080 px, proporção 4:3.
- **Origem**: gerada por IA no Canva. O README e este estudo avisam que é ilustrativa.
- **Prompt resumido**: "Natureza-morta de treino em estúdio: uma kettlebell preta fosca de ferro fundido, uma corda de pular preta com cabos escuros e uma toalha dobrada em azul-cobalto vivo, sobre piso de concreto cinza. Parede em tom de giz ao fundo, luz dura de janela com uma sombra diagonal nítida. Estilo editorial de site premium, sem texto, sem pessoas, proporção 4:3."
- **Texto alternativo**: descreve a kettlebell, a corda de pular, a toalha azul e a parede com a sombra.
- **Texto do hero**: fica ao lado da foto no computador e abaixo dela no celular, nunca por cima. O contraste do texto é o da página (Ferro sobre Giz) e não depende da foto.

## Movimento

Ao abrir a página, cada linha do título é revelada da esquerda para a direita por um bloco Cobalto que varre a linha e encolhe (150 ms entre linhas), e a foto do hero aparece com um fade de 900 ms. Os títulos de seção fazem a mesma revelação quando entram na tela, uma vez só. Depois disso, quase tudo é resposta a uma ação do visitante: as barras da semana sobem quando o plano muda, os números do preço e da calculadora contam do valor antigo ao novo em 400 ms, o plano recalculado e a confirmação da aula entram com um leve desfoque, os botões rolam o rótulo no hover. A faixa de locais e dias rola sozinha a 40 s por volta, pausa no hover e tem botão de pausa.

Com `prefers-reduced-motion: reduce`, nada se move: títulos, fotos e blocos já aparecem prontos, a faixa fica parada (e o botão de pausa some), os números trocam na hora e o carrossel troca sem transição.

## Design systems aplicados (leva final)

**Dupla**: Lando Norris Design System (claro, marca pessoal de atleta) e Ledger Design System (`developer-monetizati`, escuro, painel de bordas finas). O código é próprio: nenhuma biblioteca, nenhuma fonte e nenhum script de fora; os efeitos que nos originais usam GSAP, Rive, WebGL ou Unicorn Studio viraram CSS e JavaScript puros.

**Como foram misturados**: as seções em Giz (abertura, plano, calculadora, depoimentos, como funciona) seguem o Lando, com títulos de impacto, revelação de linha com bloco de cor, botões com rolagem do rótulo, foto com legenda em olho, pílula de resultado e faixa em loop. As seções em Ferro (método, agenda) e o rodapé seguem o Ledger, com cartões `#1B1F28` de borda branca a 8%, chips de delta, trilho segmentado e lista de atividade. O lima do Lando e o esmeralda do Ledger viraram Cobalto (Cobalto claro sobre Ferro). Nenhum gradiente, nenhum brilho, nenhuma sombra em cartão, raio de 3 px em tudo (menos as setas redondas do carrossel). A paleta não mudou.

**Componentes e onde estão**:

| Componente | Origem | Onde |
| --- | --- | --- |
| Line highlight reveal (clip-path + bloco de cor, 150 ms entre linhas) | Lando | `h1#titulo-abertura .linha-anim` e todo `h2.titulo-secao` |
| Impact statement (Archivo 800 largura 70 com destaque em 400 largura 100, sem itálico) | Lando | `p.declaracao` em `#metodo` e em `#depoimentos` |
| Botão com rolagem do rótulo e seta de 12 px | Lando | `.botao-principal` e `.botao-secundario`, também nos links do rodapé |
| Captioned photo (olho no canto, na cor da superfície, separado por linha de 1 px) | Lando | hero, foto do local no plano, retrato no método, foto da agenda |
| Result pill (número + legenda divididos por hairline, contagem em 400 ms) | Lando | `div.preco-bloco` em `#plano` e as duas `div.medida` em `#calculadora` |
| Logo row em marquee (40 s, para a direita, pausa no hover e por botão) | Lando | nova `div.faixa-cadencia` entre a abertura e `#plano` |
| Footer link groups (olho + links em caixa alta + ação) | Lando | `footer.rodape` (Treino, Agenda, Sobre) e a marca CADÊNCIA gigante |
| KPI cards com chip de delta | Ledger | `dl.etapas div.etapa` em `#metodo` (Semana 1, Por escrito, A cada 4 semanas) |
| Bar cycle (sobe da base, 100 ms entre barras, sem loop infinito) | Ledger | `#mini-semana` no resultado do plano |
| Segmented range (trilho escuro, pílula selecionada a 10%) | Ledger | `.agenda-controles` e `#agenda-dias` |
| Activity list (linhas com hairline e hover a 3%) | Ledger | `table#agenda-tabela` abaixo de 720 px (horário, estado, botão Escolher) |
| Delta chips (livre, ocupado, escolhido) | Ledger | células de `#agenda-corpo` e a legenda da agenda |
| Blur-up entrance (30 px, desfoque de 8 px, .8 s) | Ledger | `#confirmacao`, `#resultado-plano` ao mudar, e `.etapa`, `.medida`, depoimentos ao rolar |
| Testimonial carousel (rotação 3D, troca em 700 ms, setas de 48 px e arraste) | Ledger | `div.depoimentos` a partir de 720 px; no celular continua a pilha |

**Fotos da leva final** (todas geradas por IA no Canva, ilustrativas, em `img/`):

| Arquivo | Tamanho | Onde |
| --- | --- | --- |
| `tiago-retrato.webp` | 1152 x 1440 (4:5) | ao lado da bio, em `#metodo` |
| `metodo-avaliacao.webp` | 1456 x 970 (3:2) | cartão Avaliação |
| `metodo-plano.webp` | 1456 x 970 (3:2) | cartão Plano |
| `metodo-ajuste.webp` | 1456 x 970 (3:2) | cartão Ajuste |
| `local-academia.webp` | 1456 x 816 (16:9) | resultado do plano, local Academia |
| `local-casa.webp` | 1456 x 816 (16:9) | resultado do plano, local Em casa |
| `local-arlivre.webp` | 1456 x 816 (16:9) | resultado do plano, local Ao ar livre |
| `agenda-aula-experiencia.webp` | 1456 x 1088 (4:3) | ao lado da introdução de `#agenda` |

Cada contêiner tem a proporção fixa da foto, `object-fit: cover` e a cor média dela como fundo enquanto carrega. O plano previa um fade de Ferro na borda esquerda da foto da agenda; ficou de fora porque seria um gradiente, e a foto já é escura o bastante para se fundir ao Ferro.
