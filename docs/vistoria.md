# Vistoria de segurança: Cadência Treino

Data: 2026-11-08. Site estático de demonstração, publicado no GitHub Pages.

## Resumo

Nenhum dado sai do navegador do visitante. Não há servidor próprio, formulário que envie, analytics, cookie, CDN ou fonte externa. O único link para fora é https://mileumalinhas.com.br, no aviso de demonstração e no rodapé.

## Content Security Policy

Declarada por `<meta http-equiv="Content-Security-Policy">` em `index.html` e `404.html`:

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'
```

- Nenhum script inline e nenhum atributo `style`. Toda mudança visual dinâmica usa classes CSS.
- `connect-src 'none'` bloqueia `fetch`, `XMLHttpRequest` e WebSocket, mesmo que um script fosse injetado.
- `form-action 'none'` impede qualquer envio de formulário; os formulários têm `novalidate` e `preventDefault` no `submit`.
- No `404.html`, `script-src 'none'`, porque a página não usa JavaScript.
- `frame-ancestors` não é aceito via meta, então o site pode ser colocado em iframe. Sem efeito prático: não há sessão nem ação sensível para sequestrar. Se for publicado em servidor próprio, adicionar `X-Frame-Options` ou `frame-ancestors` no cabeçalho HTTP.

Confirmado com Playwright: nenhum pedido de rede para fora da origem local durante o carregamento e o uso das três funções.

## Dados do visitante

| Dado | Onde fica | Quanto tempo | Como apagar |
| --- | --- | --- | --- |
| Escolhas do montador de plano | Só na tela | Até recarregar | Recarregar a página |
| Idade, altura, peso, sexo, atividade | Só na tela | Até recarregar | Recarregar a página |
| Reserva da aula (data, hora, primeiro nome) | `localStorage`, chave `cadencia-reserva` | Até o visitante cancelar | Botão "Cancelar reserva" ou limpar dados do site |

O aviso de que a reserva fica no navegador está escrito na tela de confirmação. O nome é cortado em 40 caracteres e inserido na página com `textContent`, nunca com `innerHTML`. A leitura do `localStorage` valida o formato antes de usar e ignora qualquer conteúdo estranho.

## Dependências

Nenhuma em tempo de execução. Para os testes, Playwright (já instalado na máquina de desenvolvimento, não versionado).

## Conteúdo e dados reais

- Empresa, profissional, endereço, telefone, preços, horários ocupados e depoimentos são inventados.
- Não há e-mail, telefone, CPF, CREF ou chave de API real em nenhum arquivo.
- Fonte Archivo sob licença OFL, com a licença em `fonts/LICENSE-Archivo-OFL.txt`.

## Leva final de design (08/11/2026)

O que mudou nesta leva e o que foi conferido:

- **CSP continua restritiva e igual**: a mesma política de antes em `index.html` e `404.html`. Nenhum domínio novo liberado.
- **Sem script ou estilo inline**: o HTML continua sem `<script>` inline e sem atributo `style`. Os valores dinâmicos novos (altura das barras da semana, índice para o escalonamento, atraso das entradas ao rolar) são definidos com `element.style.setProperty`, que a CSP permite. A seta dos botões e das setas do carrossel é um SVG em `data:` usado como máscara no CSS, coberto por `img-src 'self' data:`.
- **Sem recurso externo**: as novas fotos estão em `img/`, servidas do próprio site. Nenhuma biblioteca, fonte, script ou serviço de terceiros entrou; os efeitos dos design systems de referência (GSAP, Rive, WebGL, Unicorn Studio) foram refeitos em CSS e JavaScript próprios.
- **Sem `innerHTML` novo**: todo texto novo inserido pelo JavaScript (legenda da foto do local, estado de cada horário, contagem dos números, posição do carrossel) usa `textContent`, `setAttribute` ou `createElement`.
- **Sem dados pessoais**: as fotos foram geradas por IA no Canva e são ilustrativas; as pessoas que aparecem não existem e estão de costas, sem rosto reconhecível. Nenhum nome, telefone ou documento real entrou.
- **`localStorage`**: continua usado só na agenda, na chave `cadencia-reserva` (data, hora e primeiro nome da reserva simulada), com aviso na tela e botão para apagar. As novidades desta leva (carrossel, faixa pausada, plano, calculadora) não gravam nada.
- **Teste**: `node tests/site.cjs` passou em 1280x900, iPhone 13 e 320px, sem erro de console e sem nenhum pedido de rede para fora da origem local.

## Riscos residuais

- A agenda é simulada: se alguém achar que reservou um horário de verdade, não há ninguém do outro lado. Por isso o texto repete "demonstração" e "simulada" na faixa, na introdução da seção e na confirmação.
- A calculadora dá uma estimativa de saúde. O aviso ao lado do resultado diz que não substitui avaliação médica ou nutricional.
- GitHub Pages define os cabeçalhos HTTP; o site não controla HSTS nem `frame-ancestors`. Risco baixo por não haver dados sensíveis.
