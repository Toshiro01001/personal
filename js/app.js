/* Cadência Treino: comportamento da página.
   Tudo roda no navegador. Nenhum pedido sai para a internet.
   Três partes: montador de plano, calculadora e agenda simulada. */
(function () {
  "use strict";

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  function limpar(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function criar(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }
  function moeda(valor) {
    return "R$ " + valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  /* =========================================================
     0. MOVIMENTO (tudo desligado com "reduzir movimento")
     ========================================================= */

  var raiz = document.documentElement;
  raiz.classList.add("js");
  var semMovimento = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var temObservador = "IntersectionObserver" in window;
  if (!semMovimento && temObservador) raiz.classList.add("js-revela");

  // Reinicia uma animação de entrada (blur-up) no elemento.
  function entrar(el) {
    if (!el || semMovimento) return;
    el.classList.remove("entra-agora");
    void el.offsetWidth; // força o navegador a recomeçar a animação
    el.classList.add("entra-agora");
  }

  // Número que conta do valor anterior ao novo em 400 ms.
  // O texto real (lido por leitores de tela e pelos testes) muda na hora;
  // a contagem aparece numa cópia aria-hidden por cima dele.
  function contar(real, de, para, formatar) {
    real.textContent = formatar(para);
    var caixa = real.parentNode;
    var conta = caixa && caixa.querySelector(".pilula-conta");
    if (!conta || semMovimento || de === null || de === para || !window.requestAnimationFrame) return;
    if (caixa._quadro) window.cancelAnimationFrame(caixa._quadro);
    var inicio = null;
    caixa.classList.add("contando");
    function passo(t) {
      if (inicio === null) inicio = t;
      var p = Math.min(1, (t - inicio) / 400);
      var suave = 1 - Math.pow(1 - p, 3);
      conta.textContent = formatar(de + (para - de) * suave);
      if (p < 1) caixa._quadro = window.requestAnimationFrame(passo);
      else { caixa.classList.remove("contando"); caixa._quadro = null; }
    }
    caixa._quadro = window.requestAnimationFrame(passo);
  }

  /* =========================================================
     1. MONTADOR DE PLANO
     ========================================================= */

  // Exercícios por grupo e por local. Cada divisão escolhe grupos; o local troca o exercício.
  var EXERCICIOS = {
    pernas_quad: { academia: "Agachamento no rack", casa: "Agachamento com mochila", arlivre: "Agachamento búlgaro no banco da praça" },
    pernas_post: { academia: "Levantamento terra romeno", casa: "Ponte de glúteo unilateral", arlivre: "Afundo caminhando" },
    empurrar_h: { academia: "Supino com halteres", casa: "Flexão de braço", arlivre: "Flexão com pés elevados" },
    empurrar_v: { academia: "Desenvolvimento com halteres", casa: "Flexão pike", arlivre: "Flexão pike" },
    puxar_h: { academia: "Remada curvada", casa: "Remada com elástico", arlivre: "Remada australiana na barra baixa" },
    puxar_v: { academia: "Puxada na polia", casa: "Puxada com elástico na porta", arlivre: "Barra fixa assistida" },
    core: { academia: "Prancha com toque no ombro", casa: "Prancha com toque no ombro", arlivre: "Prancha com toque no ombro" },
    core2: { academia: "Rotação na polia", casa: "Dead bug", arlivre: "Prancha lateral" },
    cardio: { academia: "Esteira: 8 tiros de 1 min", casa: "Polichinelo e escalador: 8 blocos de 40 s", arlivre: "Corrida: 8 tiros de 200 m" },
    cardio_leve: { academia: "Bicicleta 20 min em ritmo de conversa", casa: "Subir e descer escada 15 min", arlivre: "Caminhada rápida 25 min" },
    mobilidade: { academia: "Mobilidade de quadril e tornozelo", casa: "Mobilidade de quadril e tornozelo", arlivre: "Mobilidade de quadril e tornozelo" }
  };

  // Como o objetivo muda séries e repetições.
  var OBJETIVOS = {
    emagrecer: { nome: "Emagrecimento", series: "3 séries de 12 a 15, descanso curto (45 s)", extra: "cardio", nota: "Treino de força com pouco descanso e um bloco de cardio no fim." },
    massa: { nome: "Ganho de massa", series: "4 séries de 6 a 10, descanso de 90 s", extra: null, nota: "Carga progressiva: a cada semana um pouco mais de peso ou uma repetição a mais." },
    condicionamento: { nome: "Condicionamento", series: "3 séries de 10 a 12, em circuito", extra: "cardio", nota: "Circuitos com pouco descanso e tiros de cardio para o fôlego." },
    saude: { nome: "Saúde e disposição", series: "2 a 3 séries de 10 a 12, descanso confortável", extra: "cardio_leve", nota: "Ritmo tranquilo, foco em técnica, mobilidade e constância." }
  };

  // Divisões por número de dias: quais grupos entram em cada dia e em que dia da semana (0 = segunda).
  var DIVISOES = {
    2: { nome: "Corpo inteiro A e B", dias: [1, 3], treinos: [
      { titulo: "Corpo inteiro A", grupos: ["pernas_quad", "empurrar_h", "puxar_h", "core"] },
      { titulo: "Corpo inteiro B", grupos: ["pernas_post", "empurrar_v", "puxar_v", "core2"] }
    ] },
    3: { nome: "Corpo inteiro A, B e C", dias: [0, 2, 4], treinos: [
      { titulo: "Corpo inteiro A", grupos: ["pernas_quad", "empurrar_h", "puxar_h", "core"] },
      { titulo: "Corpo inteiro B", grupos: ["pernas_post", "empurrar_v", "puxar_v", "core2"] },
      { titulo: "Corpo inteiro C", grupos: ["pernas_quad", "puxar_h", "empurrar_h", "mobilidade"] }
    ] },
    4: { nome: "Superior e inferior, duas vezes", dias: [0, 1, 3, 4], treinos: [
      { titulo: "Inferior 1", grupos: ["pernas_quad", "pernas_post", "core"] },
      { titulo: "Superior 1", grupos: ["empurrar_h", "puxar_h", "empurrar_v", "core2"] },
      { titulo: "Inferior 2", grupos: ["pernas_post", "pernas_quad", "mobilidade"] },
      { titulo: "Superior 2", grupos: ["puxar_v", "empurrar_h", "puxar_h", "core"] }
    ] },
    5: { nome: "Empurrar, puxar, pernas e mais dois", dias: [0, 1, 2, 3, 4], treinos: [
      { titulo: "Empurrar", grupos: ["empurrar_h", "empurrar_v", "core"] },
      { titulo: "Puxar", grupos: ["puxar_h", "puxar_v", "core2"] },
      { titulo: "Pernas", grupos: ["pernas_quad", "pernas_post", "mobilidade"] },
      { titulo: "Superior completo", grupos: ["empurrar_h", "puxar_h", "empurrar_v"] },
      { titulo: "Condicionamento e core", grupos: ["cardio", "core", "core2"] }
    ] }
  };

  var PRECOS = {
    presencial: { 2: 640, 3: 900, 4: 1120, 5: 1300 },
    online: { 2: 190, 3: 230, 4: 260, 5: 290 }
  };
  var LOCAIS = { academia: "na academia", casa: "em casa", arlivre: "ao ar livre" };
  var DIAS_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"];
  // Foto e legenda do local escolhido (arquivos em img/, gerados por IA no Canva).
  var FOTOS_LOCAL = {
    academia: { src: "img/local-academia.webp", legenda: ["Academia", "rack e barra livre"], alt: "Área de pesos livres de uma academia vazia: rack de agachamento preto, barra com anilhas e piso emborrachado cinza, em luz de janela." },
    casa: { src: "img/local-casa.webp", legenda: ["Em casa", "tapete, halteres e elástico"], alt: "Canto de sala de estar com tapete de treino cinza enrolado, um par de halteres pretos e uma faixa elástica, diante de uma parede clara com sombra de janela." },
    arlivre: { src: "img/local-arlivre.webp", legenda: ["Ao ar livre", "parque em Cuiabá"], alt: "Pista de caminhada de um parque em Cuiabá no início da manhã, com barras fixas de calistenia em aço preto, árvores do cerrado e uma corda de pular pendurada." }
  };
  var precoAnterior = null;
  var planoDesenhado = false;
  var DIAS_NOME = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  function lerForm(form) {
    var dados = {};
    $$("input:checked", form).forEach(function (i) { dados[i.name] = i.value; });
    return dados;
  }

  function montarPlano() {
    var form = $("#form-plano");
    if (!form) return;
    var d = lerForm(form);
    var dias = parseInt(d.dias, 10);
    var divisao = DIVISOES[dias];
    var objetivo = OBJETIVOS[d.objetivo];

    $("#plano-nome").textContent = objetivo.nome + ", " + dias + " dias " + LOCAIS[d.local];

    // Mini semana em barras: a altura acompanha o volume do treino do dia.
    // As barras são recriadas, então a animação de subir recomeça a cada troca.
    var mini = $("#mini-semana");
    limpar(mini);
    DIAS_SEMANA.forEach(function (letra, i) {
      var pos = divisao.dias.indexOf(i);
      var treina = pos !== -1;
      var el = criar("span", "mini-dia" + (treina ? " treino" : ""));
      el.setAttribute("title", DIAS_NOME[i] + (treina ? ": treino" : ": descanso"));
      var barra = criar("span", "mini-barra");
      var altura = 0.14;
      if (treina) {
        var n = divisao.treinos[pos].grupos.length + (objetivo.extra ? 1 : 0);
        altura = Math.min(1, 0.4 + n * 0.12);
      }
      barra.style.setProperty("--altura", String(altura));
      barra.style.setProperty("--i", String(i));
      el.appendChild(barra);
      el.appendChild(criar("span", "mini-letra", letra));
      mini.appendChild(el);
    });

    // Foto do local
    var foto = FOTOS_LOCAL[d.local];
    var img = $("#plano-foto-img");
    if (foto && img && img.getAttribute("src") !== foto.src) {
      img.setAttribute("src", foto.src);
      img.setAttribute("alt", foto.alt);
      var fig = $("#plano-foto");
      fig.className = "plano-foto plano-foto-" + d.local;
      var leg = $("#plano-foto-legenda");
      limpar(leg);
      leg.appendChild(criar("span", null, foto.legenda[0]));
      leg.appendChild(criar("span", null, foto.legenda[1]));
    }

    // Dias do plano
    var lista = $("#dias-plano");
    limpar(lista);
    divisao.treinos.forEach(function (t, i) {
      var li = criar("li", "dia-plano");
      li.appendChild(criar("h3", null, DIAS_NOME[divisao.dias[i]] + ": " + t.titulo));
      li.appendChild(criar("p", null, objetivo.series));
      var ul = criar("ul");
      var grupos = t.grupos.slice();
      if (objetivo.extra && grupos.indexOf(objetivo.extra) === -1 && t.grupos.indexOf("cardio") === -1) grupos.push(objetivo.extra);
      grupos.forEach(function (g) { ul.appendChild(criar("li", null, EXERCICIOS[g][d.local])); });
      li.appendChild(ul);
      lista.appendChild(li);
    });

    // Preço
    var valor = PRECOS[d.formato][dias];
    $("#preco-rotulo").textContent = d.formato === "presencial" ? "Valor mensal, presencial em Cuiabá" : "Valor mensal, consultoria online";
    contar($("#preco-valor"), precoAnterior, valor, function (v) { return moeda(Math.round(v / 10) * 10); });
    precoAnterior = valor;
    $("#preco-nota").textContent = "Preço fictício de demonstração. " + objetivo.nota + (d.formato === "presencial"
      ? " Inclui avaliação inicial e ajuste do plano a cada 4 semanas."
      : " Inclui plano por escrito, vídeos dos exercícios e ajuste a cada 4 semanas por mensagem.");

    if (planoDesenhado) entrar($("#resultado-plano"));
    planoDesenhado = true;
  }

  /* =========================================================
     2. CALCULADORA DE IMC E GASTO CALÓRICO
     ========================================================= */

  function faixaIMC(imc) {
    if (imc < 18.5) return "Abaixo do peso (menos de 18,5)";
    if (imc < 25) return "Peso adequado (18,5 a 24,9)";
    if (imc < 30) return "Sobrepeso (25 a 29,9)";
    if (imc < 35) return "Obesidade grau 1 (30 a 34,9)";
    if (imc < 40) return "Obesidade grau 2 (35 a 39,9)";
    return "Obesidade grau 3 (40 ou mais)";
  }

  var imcAnterior = null, gastoAnterior = null;

  function calcular() {
    var form = $("#form-calc");
    if (!form) return;
    var erro = $("#erro-calc");
    var idade = parseFloat($("#idade").value);
    var altura = parseFloat($("#altura").value);
    var peso = parseFloat(String($("#peso").value).replace(",", "."));
    var fator = parseFloat($("#atividade").value);
    var sexo = lerForm(form).sexo;

    var problemas = [];
    if (!(idade >= 14 && idade <= 100)) problemas.push("idade entre 14 e 100 anos");
    if (!(altura >= 120 && altura <= 230)) problemas.push("altura entre 120 e 230 cm");
    if (!(peso >= 30 && peso <= 300)) problemas.push("peso entre 30 e 300 kg");
    if (problemas.length) {
      erro.textContent = "Confira os dados: " + problemas.join("; ") + ".";
      erro.hidden = false;
      return;
    }
    erro.hidden = true;

    var m = altura / 100;
    var imc = peso / (m * m);
    var tmb = 10 * peso + 6.25 * altura - 5 * idade + (sexo === "m" ? 5 : -161);
    var gasto = tmb * fator;

    var imcArred = Math.round(imc * 10) / 10;
    var gastoArred = Math.round(gasto / 10) * 10;
    contar($("#imc-valor"), imcAnterior, imcArred, function (v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); });
    contar($("#gasto-valor"), gastoAnterior, gastoArred, function (v) { return (Math.round(v / 10) * 10).toLocaleString("pt-BR"); });
    imcAnterior = imcArred;
    gastoAnterior = gastoArred;
    $("#imc-faixa").textContent = faixaIMC(imc);
    $("#tmb-texto").textContent = "Metabolismo basal de cerca de " + (Math.round(tmb / 10) * 10).toLocaleString("pt-BR") + " kcal, vezes o fator do seu dia a dia.";
  }

  /* =========================================================
     3. AGENDA SIMULADA
     ========================================================= */

  var CHAVE_RESERVA = "cadencia-reserva";
  var HORAS = [6, 7, 8, 9, 10, 11, 16, 17, 18, 19, 20];
  var DIAS_AGENDA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var deslocamentoSemana = 0;
  var diaAtivo = 0; // coluna mostrada no celular (0 = segunda)
  var escolhido = null; // { data: "AAAA-MM-DD", hora: 7 }

  function hoje() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function inicioSemana(desloc) {
    var d = hoje();
    var diaSemana = (d.getDay() + 6) % 7; // 0 = segunda
    d.setDate(d.getDate() - diaSemana + desloc * 7);
    return d;
  }
  function chaveData(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function formatarData(d) { return d.getDate() + " de " + MESES[d.getMonth()]; }

  // Ocupação inventada, mas sempre igual para a mesma data e hora.
  function ocupado(chave, hora) {
    var s = chave + ":" + hora, h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 13; h = Math.imul(h, 1540483477) >>> 0; h ^= h >>> 15;
    return (h % 100) < 42;
  }

  function lerReserva() {
    try {
      var bruto = window.localStorage.getItem(CHAVE_RESERVA);
      if (!bruto) return null;
      var r = JSON.parse(bruto);
      if (!r || typeof r.data !== "string" || typeof r.hora !== "number") return null;
      return r;
    } catch (e) { return null; }
  }
  function salvarReserva(r) {
    try { window.localStorage.setItem(CHAVE_RESERVA, JSON.stringify(r)); } catch (e) { /* sem armazenamento: segue só na tela */ }
  }
  function apagarReserva() {
    try { window.localStorage.removeItem(CHAVE_RESERVA); } catch (e) { /* nada */ }
  }

  function textoHorario(data, hora) {
    var partes = data.split("-");
    var d = new Date(parseInt(partes[0], 10), parseInt(partes[1], 10) - 1, parseInt(partes[2], 10));
    var idx = (d.getDay() + 6) % 7;
    return (DIAS_NOME[idx] || "") + ", " + formatarData(d) + ", às " + hora + "h";
  }

  function desenharAgenda() {
    var cab = $("#agenda-cabecalho"), corpo = $("#agenda-corpo");
    if (!cab || !corpo) return;
    limpar(cab); limpar(corpo);
    var inicio = inicioSemana(deslocamentoSemana);
    var fim = new Date(inicio); fim.setDate(fim.getDate() + 5);
    var agora = new Date();
    var chaveHoje = chaveData(hoje());
    var reserva = lerReserva();

    $("#agenda-periodo").textContent = "Semana de " + formatarData(inicio) + " a " + formatarData(fim);
    $("#semana-anterior").disabled = deslocamentoSemana <= 0;
    $("#semana-proxima").disabled = deslocamentoSemana >= 3;

    var thHora = criar("th", null, "");
    thHora.setAttribute("scope", "col");
    cab.appendChild(thHora);
    var chips = $("#agenda-dias");
    limpar(chips);
    var datas = [];
    for (var i = 0; i < 6; i++) {
      var d = new Date(inicio); d.setDate(d.getDate() + i);
      datas.push(d);
      var th = criar("th");
      th.setAttribute("scope", "col");
      th.className = (chaveData(d) === chaveHoje ? "hoje " : "") + (i === diaAtivo ? "col-ativa" : "");
      th.appendChild(criar("span", "dia-num", String(d.getDate())));
      th.appendChild(document.createTextNode(DIAS_AGENDA[i]));
      cab.appendChild(th);

      var chip = criar("button", "chip-dia" + (i === diaAtivo ? " ativo" : ""));
      chip.type = "button";
      chip.dataset.indice = String(i);
      chip.setAttribute("aria-pressed", i === diaAtivo ? "true" : "false");
      chip.setAttribute("aria-label", DIAS_NOME[i] + ", " + formatarData(d));
      chip.appendChild(criar("span", "chip-num", String(d.getDate())));
      chip.appendChild(criar("span", "chip-nome", DIAS_AGENDA[i]));
      chips.appendChild(chip);
    }

    HORAS.forEach(function (hora) {
      var tr = criar("tr");
      var tdHora = criar("th", "hora", hora + "h");
      tdHora.setAttribute("scope", "row");
      tr.appendChild(tdHora);
      datas.forEach(function (d, i) {
        var chave = chaveData(d);
        var td = criar("td", i === diaAtivo ? "col-ativa" : "");
        var b = criar("button", "horario");
        b.type = "button";
        var passado = d < hoje() || (chave === chaveHoje && hora <= agora.getHours());
        var estaReservado = reserva && reserva.data === chave && reserva.hora === hora;
        var estaEscolhido = escolhido && escolhido.data === chave && escolhido.hora === hora;
        var rotulo = DIAS_NOME[i] + ", " + formatarData(d) + ", " + hora + "h";
        var estado = criar("span", "horario-estado");
        b.appendChild(estado);
        if (estaReservado || estaEscolhido) {
          b.className += " escolhido";
          estado.textContent = estaReservado ? "Reservado" : "Escolhido";
          b.setAttribute("aria-pressed", "true");
          b.setAttribute("aria-label", rotulo + ", " + (estaReservado ? "reservado por você" : "escolhido"));
        } else if (passado) {
          b.className += " passado";
          estado.textContent = "Passou";
          b.disabled = true;
          b.setAttribute("aria-label", rotulo + ", já passou");
        } else if (ocupado(chave, hora)) {
          b.className += " ocupado";
          estado.textContent = "Ocupado";
          b.disabled = true;
          b.setAttribute("aria-label", rotulo + ", ocupado");
        } else {
          estado.textContent = "Livre";
          b.setAttribute("aria-pressed", "false");
          b.setAttribute("aria-label", rotulo + ", livre");
          b.dataset.data = chave;
          b.dataset.hora = String(hora);
        }
        td.appendChild(b);
        tr.appendChild(td);
      });
      corpo.appendChild(tr);
    });
  }

  function atualizarCampoHorario() {
    var campo = $("#reserva-horario");
    campo.value = escolhido ? textoHorario(escolhido.data, escolhido.hora) : "Nenhum horário escolhido";
  }

  function mostrarConfirmacao(reserva) {
    var caixa = $("#confirmacao");
    var nome = reserva.nome ? reserva.nome + ", sua" : "Sua";
    $("#confirmacao-texto").textContent = nome + " aula de experiência ficou para " + textoHorario(reserva.data, reserva.hora) + ", presencial, com duração de 50 minutos. Em um site real, você receberia a confirmação por mensagem.";
    caixa.hidden = false;
    $("#limpar-reserva").hidden = false;
  }

  // Há algum horário livre (futuro e não ocupado) na semana indicada?
  function semanaTemLivre(desloc) {
    var inicio = inicioSemana(desloc), agora = new Date(), chaveHoje = chaveData(hoje());
    for (var i = 0; i < 6; i++) {
      var d = new Date(inicio); d.setDate(d.getDate() + i);
      var chave = chaveData(d);
      for (var j = 0; j < HORAS.length; j++) {
        var passado = d < hoje() || (chave === chaveHoje && HORAS[j] <= agora.getHours());
        if (!passado && !ocupado(chave, HORAS[j])) return true;
      }
    }
    return false;
  }

  function iniciarAgenda() {
    if (!$("#agenda-tabela")) return;
    // Começa na primeira semana que ainda tem horário livre e, no celular, no dia de hoje.
    while (deslocamentoSemana < 3 && !semanaTemLivre(deslocamentoSemana)) deslocamentoSemana++;
    var idxHoje = (hoje().getDay() + 6) % 7;
    diaAtivo = (deslocamentoSemana === 0 && idxHoje < 6) ? idxHoje : 0;
    var reserva = lerReserva();
    if (reserva) {
      escolhido = { data: reserva.data, hora: reserva.hora };
      mostrarConfirmacao(reserva);
      $("#reserva-nome").value = reserva.nome || "";
    }
    atualizarCampoHorario();
    desenharAgenda();

    $("#agenda-corpo").addEventListener("click", function (ev) {
      var b = ev.target.closest("button.horario");
      if (!b || b.disabled || !b.dataset.data) return;
      if (lerReserva()) {
        $("#erro-reserva").textContent = "Você já tem uma reserva. Cancele antes de escolher outro horário.";
        $("#erro-reserva").hidden = false;
        return;
      }
      $("#erro-reserva").hidden = true;
      escolhido = { data: b.dataset.data, hora: parseInt(b.dataset.hora, 10) };
      atualizarCampoHorario();
      desenharAgenda();
    });

    $("#agenda-dias").addEventListener("click", function (ev) {
      var chip = ev.target.closest("button.chip-dia");
      if (!chip) return;
      diaAtivo = parseInt(chip.dataset.indice, 10);
      desenharAgenda();
    });

    $("#semana-anterior").addEventListener("click", function () { if (deslocamentoSemana > 0) { deslocamentoSemana--; diaAtivo = 0; desenharAgenda(); } });
    $("#semana-proxima").addEventListener("click", function () { if (deslocamentoSemana < 3) { deslocamentoSemana++; diaAtivo = 0; desenharAgenda(); } });

    $("#form-reserva").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var erro = $("#erro-reserva");
      if (lerReserva()) { erro.textContent = "Esta reserva já está confirmada."; erro.hidden = false; return; }
      if (!escolhido) { erro.textContent = "Escolha um horário livre na tabela antes de confirmar."; erro.hidden = false; var livre = $("#agenda-tabela").querySelector("button.horario:not([disabled])"); if (livre) livre.focus(); return; }
      erro.hidden = true;
      var nome = $("#reserva-nome").value.trim().slice(0, 40);
      var r = { data: escolhido.data, hora: escolhido.hora, nome: nome };
      salvarReserva(r);
      mostrarConfirmacao(r);
      desenharAgenda();
      entrar($("#confirmacao"));
      $("#confirmacao").focus();
    });

    $("#limpar-reserva").addEventListener("click", function () {
      apagarReserva();
      escolhido = null;
      $("#confirmacao").hidden = true;
      $("#limpar-reserva").hidden = true;
      $("#erro-reserva").hidden = true;
      $("#reserva-nome").value = "";
      atualizarCampoHorario();
      desenharAgenda();
    });
  }

  /* =========================================================
     4. FAIXA EM LOOP (pausa no hover e no botão)
     ========================================================= */

  function iniciarFaixa() {
    var faixa = $("[data-marquee]"), botao = $("#faixa-pausa");
    if (!faixa || !botao || semMovimento) return;
    botao.hidden = false;
    botao.addEventListener("click", function () {
      var pausada = faixa.classList.toggle("pausada");
      botao.setAttribute("aria-pressed", pausada ? "true" : "false");
      botao.setAttribute("aria-label", pausada ? "Retomar a faixa em movimento" : "Pausar a faixa em movimento");
    });
  }

  /* =========================================================
     5. CARROSSEL DE DEPOIMENTOS (a partir de 720px; no celular, pilha)
     ========================================================= */

  var carrosselAtivo = false;

  function iniciarCarrossel() {
    var trilho = $("#depoimentos-trilho"), controles = $("#carrossel-controles");
    if (!trilho || !controles || !window.matchMedia) return;
    var cartoes = $$(".depoimento", trilho);
    var total = cartoes.length;
    if (total < 3) return;
    var atual = 0;
    var largo = window.matchMedia("(min-width: 720px)");

    function posicionar() {
      cartoes.forEach(function (c, i) {
        c.classList.remove("pos-centro", "pos-esq", "pos-dir");
        if (!carrosselAtivo) { c.removeAttribute("aria-hidden"); c.removeAttribute("aria-roledescription"); c.removeAttribute("aria-label"); return; }
        var rel = (i - atual + total) % total;
        c.classList.add(rel === 0 ? "pos-centro" : rel === 1 ? "pos-dir" : "pos-esq");
        c.setAttribute("aria-roledescription", "depoimento");
        c.setAttribute("aria-label", (i + 1) + " de " + total);
        if (rel === 0) c.removeAttribute("aria-hidden"); else c.setAttribute("aria-hidden", "true");
      });
      $("#carrossel-posicao").textContent = (atual + 1) + " de " + total;
    }
    function ir(passo) { atual = (atual + passo + total) % total; posicionar(); }
    function aplicarModo() {
      carrosselAtivo = largo.matches;
      trilho.classList.toggle("em-carrossel", carrosselAtivo);
      controles.hidden = !carrosselAtivo;
      posicionar();
    }

    $("#depo-anterior").addEventListener("click", function () { ir(-1); });
    $("#depo-proximo").addEventListener("click", function () { ir(1); });
    $("#carrossel").addEventListener("keydown", function (ev) {
      if (!carrosselAtivo) return;
      if (ev.key === "ArrowLeft") { ev.preventDefault(); ir(-1); }
      if (ev.key === "ArrowRight") { ev.preventDefault(); ir(1); }
    });

    // Arraste com o dedo ou o mouse: 50px para trocar.
    var inicioX = null;
    trilho.addEventListener("pointerdown", function (ev) {
      if (!carrosselAtivo) return;
      inicioX = ev.clientX;
      trilho.classList.add("arrastando");
    });
    function soltar(ev) {
      if (inicioX === null) return;
      var dx = ev.clientX - inicioX;
      inicioX = null;
      trilho.classList.remove("arrastando");
      if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
    }
    trilho.addEventListener("pointerup", soltar);
    trilho.addEventListener("pointercancel", function () { inicioX = null; trilho.classList.remove("arrastando"); });
    trilho.addEventListener("pointerleave", soltar);

    if (largo.addEventListener) largo.addEventListener("change", aplicarModo);
    else if (largo.addListener) largo.addListener(aplicarModo);
    aplicarModo();
  }

  /* =========================================================
     6. REVELAÇÃO AO ROLAR (títulos e blocos, uma vez só)
     ========================================================= */

  function iniciarRevelacao() {
    if (semMovimento || !temObservador) return;

    // Títulos de seção: linha revelada com bloco de cor quando o topo chega a 90% da tela.
    var obsTitulo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visto"); obsTitulo.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".titulo-secao").forEach(function (t) { if (t.querySelector(".linha-anim")) obsTitulo.observe(t); });

    // Blocos: entrada com desfoque ao atingir 20% da tela, 100 ms entre irmãos.
    var alvos = $$(".etapa, .medida");
    alvos = alvos.concat(carrosselAtivo ? [$("#carrossel")] : $$(".depoimento"));
    var obsBloco = new IntersectionObserver(function (entradas) {
      entradas.filter(function (e) { return e.isIntersecting; }).forEach(function (e, n) {
        var el = e.target;
        el.style.setProperty("--atraso", (n * 0.1) + "s"); // irmãos que entram juntos: 100 ms entre eles
        el.classList.remove("aguarda");
        el.classList.add("revela");
        obsBloco.unobserve(el);
      });
    }, { threshold: 0.2 });
    alvos.forEach(function (el) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // já visível ao abrir: fica como está
      el.classList.add("aguarda");
      obsBloco.observe(el);
    });
  }

  /* =========================================================
     Início
     ========================================================= */
  function iniciar() {
    var fp = $("#form-plano");
    if (fp) { fp.addEventListener("change", montarPlano); montarPlano(); }
    var fc = $("#form-calc");
    if (fc) {
      fc.addEventListener("input", calcular);
      fc.addEventListener("change", calcular);
      fc.addEventListener("submit", function (ev) { ev.preventDefault(); calcular(); });
      calcular();
    }
    iniciarAgenda();
    iniciarFaixa();
    iniciarCarrossel();
    iniciarRevelacao();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
