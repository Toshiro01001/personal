/* Testes do site Cadência Treino com Playwright.
   Uso: node tests/site.cjs
   Sobe um servidor estático (python3 -m http.server) na porta 8306, se não houver um,
   e testa em três tamanhos: computador 1280x900, iPhone 13 e 320px.
   Verifica: erros de console, pedidos de rede para fora, rolagem horizontal,
   texto cortado e as três funções (plano, calculadora, agenda).
   Com CAPTURAS=1 também salva capturas PNG (em SHOTS_DIR, se definido, senão em docs/).
   As capturas do README são essas PNG convertidas para webp. */

const { chromium, devices } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const PORTA = Number(process.env.PORTA) || 8306;
const BASE = `http://127.0.0.1:${PORTA}/`;
const RAIZ = path.resolve(__dirname, "..");
const CAPTURAS = process.env.CAPTURAS === "1";
const SHOTS_DIR = process.env.SHOTS_DIR || "";

const CENARIOS = [
  { nome: "computador", opcoes: { viewport: { width: 1280, height: 900 } } },
  { nome: "iphone13", opcoes: { ...devices["iPhone 13"] } },
  { nome: "320px", opcoes: { viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } }
];

function servidorAtivo() {
  return new Promise((res) => {
    const req = http.get(BASE, (r) => { r.resume(); res(true); });
    req.on("error", () => res(false));
    req.setTimeout(1500, () => { req.destroy(); res(false); });
  });
}

async function subirServidor() {
  if (await servidorAtivo()) return null;
  const proc = spawn("python3", ["-m", "http.server", String(PORTA), "--bind", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 150));
    if (await servidorAtivo()) return proc;
  }
  throw new Error("Servidor não subiu na porta " + PORTA);
}

const falhas = [];
function checar(cond, msg) { if (!cond) falhas.push(msg); return cond; }

async function textoCortado(page) {
  // Elementos de texto cujo conteúdo sai da própria caixa ou da tela.
  return page.evaluate(() => {
    const seletores = "h1,h2,h3,p,a,button,label,legend,li,dt,dd,th,td,span,cite,summary,code";
    const larguraTela = document.documentElement.clientWidth;
    const problemas = [];
    for (const el of document.querySelectorAll(seletores)) {
      if (!el.textContent.trim() || el.closest("[hidden]")) continue;
      // A faixa em loop passa da tela de propósito (é cortada pela própria janela dela).
      if (el.closest("[data-marquee]")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const estilo = getComputedStyle(el);
      if (estilo.overflow !== "visible" && el.scrollWidth > el.clientWidth + 1) problemas.push(el.tagName + "." + el.className + " corta horizontalmente");
      if (r.right > larguraTela + 1 && estilo.position !== "absolute") problemas.push(el.tagName + "." + el.className + " sai da tela: " + Math.round(r.right));
    }
    return problemas.slice(0, 10);
  });
}

async function rolagemHorizontal(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

async function testarFuncoes(page, nome) {
  // Montador de plano
  await page.check('input[name="dias"][value="4"]');
  await page.check('input[name="local"][value="casa"]');
  await page.check('input[name="formato"][value="online"]');
  const preco = await page.textContent("#preco-valor");
  checar(preco.trim() === "R$ 260", `[${nome}] preço online 4 dias deveria ser R$ 260, veio ${preco}`);
  const diasPlano = await page.locator("#dias-plano .dia-plano").count();
  checar(diasPlano === 4, `[${nome}] plano de 4 dias deveria listar 4 treinos, listou ${diasPlano}`);
  const treinoDias = await page.locator("#mini-semana .mini-dia.treino").count();
  checar(treinoDias === 4, `[${nome}] mini semana deveria marcar 4 dias, marcou ${treinoDias}`);
  const temCasa = await page.locator("#dias-plano", { hasText: "mochila" }).count();
  checar(temCasa === 1, `[${nome}] plano em casa deveria trocar os exercícios`);

  // Calculadora
  await page.fill("#peso", "80");
  await page.fill("#altura", "180");
  await page.fill("#idade", "30");
  await page.check('input[name="sexo"][value="m"]');
  await page.selectOption("#atividade", "1.55");
  const imc = await page.textContent("#imc-valor");
  checar(imc.trim() === "24,7", `[${nome}] IMC deveria ser 24,7, veio ${imc}`);
  const gasto = await page.textContent("#gasto-valor");
  // TMB = 800 + 1125 - 150 + 5 = 1780; x1,55 = 2759 -> 2.760
  checar(gasto.trim() === "2.760", `[${nome}] gasto deveria ser 2.760, veio ${gasto}`);
  await page.fill("#peso", "500");
  checar(await page.isVisible("#erro-calc"), `[${nome}] erro da calculadora deveria aparecer com peso 500`);
  await page.fill("#peso", "80");
  checar(!(await page.isVisible("#erro-calc")), `[${nome}] erro da calculadora deveria sumir`);

  // Agenda
  if (await page.isEnabled("#semana-proxima")) await page.click("#semana-proxima");
  const livre = page.locator("#agenda-corpo button.horario:not([disabled])").locator("visible=true").first();
  checar((await livre.count()) === 1, `[${nome}] a próxima semana deveria ter horário livre`);
  await livre.scrollIntoViewIfNeeded();
  await livre.click();
  const campo = await page.inputValue("#reserva-horario");
  checar(campo !== "Nenhum horário escolhido", `[${nome}] campo de horário deveria refletir a escolha`);
  await page.fill("#reserva-nome", "Teste");
  await page.click('#form-reserva button[type="submit"]');
  checar(await page.isVisible("#confirmacao"), `[${nome}] confirmação deveria aparecer`);
  const salvo = await page.evaluate(() => localStorage.getItem("cadencia-reserva"));
  checar(!!salvo && salvo.includes('"nome":"Teste"'), `[${nome}] reserva deveria estar no localStorage`);
  const reservados = await page.locator("#agenda-corpo button.horario.escolhido").count();
  checar(reservados === 1, `[${nome}] um horário deveria aparecer como reservado`);
  await page.click("#limpar-reserva");
  const apagado = await page.evaluate(() => localStorage.getItem("cadencia-reserva"));
  checar(apagado === null, `[${nome}] cancelar deveria apagar o localStorage`);
  checar(!(await page.isVisible("#confirmacao")), `[${nome}] confirmação deveria sumir ao cancelar`);
}

// Foto do hero: carregou, tem a proporção 4:3 e o texto do hero não encosta nela (legibilidade).
async function checarHero(page, contSel) {
  return page.evaluate((contSel) => {
    const img = document.querySelector("img.hero-foto");
    if (!img) return { existe: false };
    const r = img.getBoundingClientRect();
    const caixa = img.parentElement.getBoundingClientRect();
    const raiz = document.querySelector(contSel) || document;
    let sobreposto = 0;
    for (const t of raiz.querySelectorAll("h1, p, a, dl, dt, dd")) {
      const b = t.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      const w = Math.min(b.right, r.right) - Math.max(b.left, r.left);
      const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top);
      if (w > 1 && h > 1) sobreposto++;
    }
    return {
      existe: true,
      carregou: img.complete && img.naturalWidth === 1440 && img.naturalHeight === 1080,
      alt: (img.getAttribute("alt") || "").length > 20,
      proporcao: Math.round((caixa.width / caixa.height) * 100) / 100,
      cabe: r.left >= -1 && r.right <= document.documentElement.clientWidth + 1,
      sobreposto
    };
  }, contSel);
}

async function capturar(page, nome, cenario) {
  if (!CAPTURAS) return;
  const pasta = SHOTS_DIR || path.join(RAIZ, "docs");
  fs.mkdirSync(pasta, { recursive: true });
  const arq = path.join(pasta, `${nome}-${cenario}.png`);
  await page.screenshot({ path: arq, fullPage: false });
}

(async () => {
  const servidor = await subirServidor();
  const navegador = await chromium.launch();
  try {
    for (const cenario of CENARIOS) {
      const contexto = await navegador.newContext(cenario.opcoes);
      const page = await contexto.newPage();
      const errosConsole = [];
      const pedidosFora = [];
      page.on("console", (m) => { if (m.type() === "error") errosConsole.push(m.text()); });
      page.on("pageerror", (e) => errosConsole.push("pageerror: " + e.message));
      page.on("request", (r) => { if (!r.url().startsWith(BASE)) pedidosFora.push(r.url()); });

      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForTimeout(900);

      checar(errosConsole.length === 0, `[${cenario.nome}] erros de console: ${errosConsole.join(" | ")}`);
      checar(pedidosFora.length === 0, `[${cenario.nome}] pedidos para fora: ${pedidosFora.join(", ")}`);
      checar(!(await rolagemHorizontal(page)), `[${cenario.nome}] há rolagem horizontal`);
      const cortados = await textoCortado(page);
      checar(cortados.length === 0, `[${cenario.nome}] texto cortado: ${cortados.join("; ")}`);

      // Fonte local carregou?
      const fonteOk = await page.evaluate(() => document.fonts.check('800 1em "Archivo"'));
      checar(fonteOk, `[${cenario.nome}] fonte Archivo não carregou`);

      const hero = await checarHero(page, ".abertura-texto");
      checar(hero.existe && hero.carregou, `[${cenario.nome}] a foto do hero não carregou (1440x1080)`);
      checar(hero.existe && hero.alt, `[${cenario.nome}] a foto do hero está sem alt descritivo`);
      checar(hero.existe && Math.abs(hero.proporcao - 1.33) < 0.02, `[${cenario.nome}] contêiner do hero fora de 4:3 (${hero.proporcao})`);
      checar(hero.existe && hero.cabe && hero.sobreposto === 0, `[${cenario.nome}] a foto sai da tela ou há texto do hero sobre ela (${hero.sobreposto} sobreposições)`);

      await capturar(page, "capa", cenario.nome);
      await testarFuncoes(page, cenario.nome);

      if (CAPTURAS) {
        await page.evaluate(() => document.getElementById("plano").scrollIntoView({ behavior: "instant" }));
        await page.waitForTimeout(300);
        await capturar(page, "plano", cenario.nome);
        await page.evaluate(() => document.getElementById("calculadora").scrollIntoView({ behavior: "instant" }));
        await page.waitForTimeout(300);
        await capturar(page, "calculadora", cenario.nome);
        // Refaz uma escolha de horário só para a captura
        if (await page.isEnabled("#semana-proxima")) await page.click("#semana-proxima");
        const livre = page.locator("#agenda-corpo button.horario:not([disabled])").locator("visible=true").first();
        if (await livre.count()) await livre.click();
        await page.evaluate(() => document.getElementById("agenda").scrollIntoView({ behavior: "instant" }));
        await page.waitForTimeout(300);
        await capturar(page, "agenda", cenario.nome);
        await page.click("#limpar-reserva").catch(() => {});
      }

      // Depois de mexer em tudo, nada deve ter quebrado.
      checar(!(await rolagemHorizontal(page)), `[${cenario.nome}] rolagem horizontal depois de usar as funções`);
      const cortados2 = await textoCortado(page);
      checar(cortados2.length === 0, `[${cenario.nome}] texto cortado depois de usar: ${cortados2.join("; ")}`);
      checar(errosConsole.length === 0, `[${cenario.nome}] erros de console depois de usar: ${errosConsole.join(" | ")}`);

      // 404 carrega sem erro
      await page.goto(BASE + "404.html", { waitUntil: "networkidle" });
      checar(await page.isVisible("h1"), `[${cenario.nome}] 404 sem título`);

      await contexto.close();
      console.log(`${cenario.nome}: ok`);
    }

    if (CAPTURAS && SHOTS_DIR) {
      fs.mkdirSync(SHOTS_DIR, { recursive: true });
      const c1 = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
      const p1 = await c1.newPage();
      await p1.goto(BASE, { waitUntil: "networkidle" }); await p1.waitForTimeout(1000);
      await p1.screenshot({ path: path.join(SHOTS_DIR, "personal-desk.png") });
      await c1.close();
      const c2 = await navegador.newContext({ ...devices["iPhone 13"] });
      const p2 = await c2.newPage();
      await p2.goto(BASE, { waitUntil: "networkidle" }); await p2.waitForTimeout(1000);
      await p2.screenshot({ path: path.join(SHOTS_DIR, "personal-cel.png") });
      await c2.close();
    }
  } finally {
    await navegador.close();
    if (servidor) servidor.kill();
  }

  if (falhas.length) {
    console.error("\nFALHAS:\n" + falhas.map((f) => " - " + f).join("\n"));
    process.exit(1);
  }
  console.log("\nTodos os testes passaram.");
})().catch((e) => { console.error(e); process.exit(1); });
