// Italian version of decks/en/13-sequential-machines.js: same slides, same listings, text in Italian.
// Lecture 13 - Sequential machines: time, state, finite-state machines, latches, flip-flops, registers.
// Sources: 08 - Macchine sequenziali, 11 - Latch & flip-flop SR, 12 - Flip-flop JK & D, and the registers of
// 13 - Macchine elementari.  Figures redrawn; RISC-V is the reference processor.
const G8 = require("../../lib/gates");
const D8 = require("../../lib/draw");

function clockSvg() {
  const x0 = 60, y1 = 60, y0 = 150, hi = 110, lo = 90, per = hi + lo;
  let d = `M${x0 - 30},${y0}`;
  for (let k = 0; k < 3; k++) { const x = x0 + k * per; d += ` L${x},${y0} L${x},${y1} L${x + hi},${y1} L${x + hi},${y0}`; }
  d += ` L${x0 + 3 * per + 20},${y0}`;
  const dim = (xa, xb, y, label) => `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" stroke="#1B2530" stroke-width="1.5" marker-start="url(#a)" marker-end="url(#a)"/>` + G8.text((xa + xb) / 2, y - 7, label, { anchor: "middle", size: 15 });
  return G8.doc(700, 235, `<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1B2530"/></marker></defs>` +
    `<path d="${d}" fill="none" stroke="#0E7C86" stroke-width="3.5" stroke-linejoin="round"/>` +
    G8.text(22, y1 + 6, "1", { size: 16, fill: "#5B6B78" }) + G8.text(22, y0 + 6, "0", { size: 16, fill: "#5B6B78" }) +
    dim(x0, x0 + per, 30, "periodo T") + dim(x0 + per, x0 + per + hi, 30, "tempo alto") + dim(x0 + per + hi, x0 + 2 * per, 30, "tempo basso") +
    `<line x1="${x0 + 2 * per}" y1="${y0 + 8}" x2="${x0 + 2 * per}" y2="${y0 + 42}" stroke="#B23A48" stroke-width="2"/>` + G8.text(x0 + 2 * per, y0 + 62, "fronte di salita", { anchor: "middle", size: 15, fill: "#B23A48" }) +
    `<line x1="${x0 + 2 * per + hi}" y1="${y0 + 8}" x2="${x0 + 2 * per + hi}" y2="${y0 + 42}" stroke="#6B4FA0" stroke-width="2"/>` + G8.text(x0 + 2 * per + hi + 6, y0 + 62, "fronte di discesa", { anchor: "middle", size: 15, fill: "#6B4FA0" }));
}

function latchSvg(gated) {
  const L = gated ? 220 : 120, g1 = G8.pins("nor", L, 20), g2 = G8.pins("nor", L, 120), X = L + 100, o = L + 160;
  let w = G8.wire([g1.out, [o, 42]]) + G8.wire([g2.out, [o, 142]]) +
    G8.wire([[X, 42], [X, 72], [L - 30, 102], [L - 30, 131], g2.a], true) + G8.wire([[X, 142], [X, 112], [L - 30, 82], [L - 30, 53], g1.b], true) +
    G8.gate("nor", L, 20) + G8.gate("nor", L, 120) + G8.text(o + 6, 48, "Q", { size: 18 }) + G8.text(o + 6, 148, "Q'", { size: 18 });
  if (gated) {
    const ar = G8.pins("and", 60, 9), as = G8.pins("and", 60, 131);
    w += G8.wire([[22, 20], ar.a]) + G8.wire([[22, 164], as.b]) + G8.wire([[14, 92], [35, 92], [35, 42], ar.b]) + G8.wire([[35, 92], [35, 142], as.a], true) +
      G8.wire([ar.out, g1.a]) + G8.wire([as.out, g2.b]) + G8.gate("and", 60, 9) + G8.gate("and", 60, 131) +
      G8.text(4, 25, "R", { size: 18 }) + G8.text(4, 170, "S", { size: 18 }) + G8.text(0, 82, "CK", { size: 15 });
  } else {
    w += G8.wire([[40, 31], g1.a]) + G8.wire([[40, 153], g2.b]) + G8.text(16, 37, "R", { size: 18 }) + G8.text(16, 159, "S", { size: 18 });
  }
  return G8.doc(o + 40, 190, w);
}

const MEALY = [["s0", "s1", "0/1"], ["s0", "s2", "1/1"], ["s1", "s3", "0/0"], ["s1", "s2", "1/1"], ["s2", "s1", "0/1"], ["s2", "s3", "1/0"], ["s3", "s3", "0/0"], ["s3", "s0", "1/0"]];
function machineSvg(moore) {
  const out = ["00", "01", "10", "11"], pos = { s0: [110, 95], s1: [410, 95], s2: [110, 300], s3: [410, 300] };
  const states = Object.entries(pos).map(([id, [x, y]], i) => ({ id, x, y, label: id, sub: moore ? out[i] : undefined }));
  const bend = { "s1>s2": 28, "s2>s1": 28, "s3>s0": -34 }, lt = { "s1>s2": 0.22, "s2>s1": 0.22, "s3>s0": 0.2 };
  const edges = MEALY.map(([f, t, l]) => ({ from: f, to: t, label: moore ? l[0] : l, bend: bend[`${f}>${t}`] || 0, lt: lt[`${f}>${t}`], loop: "right" }));
  return D8.fsm(states, edges, { w: 560, h: 390, r: 36 });
}

function gameSvg() {
  return D8.fsm([{ id: "T", x: 95, y: 150, label: "TITLE", color: "#2E4A62" }, { id: "P", x: 300, y: 150, label: "PLAY", color: "#0E7C86" }, { id: "O", x: 505, y: 150, label: "OVER", color: "#B23A48" }],
    [{ from: "T", to: "P", label: "A" }, { from: "P", to: "O", label: "vite = 0" }, { from: "O", to: "T", label: "A", bend: -95 },
      { from: "T", to: "T", label: "niente A", loop: "top" }, { from: "P", to: "P", label: "vite > 0", loop: "top" }, { from: "O", to: "O", label: "niente A", loop: "top" }],
    { w: 600, h: 300, r: 44, stateSize: 16 });
}

function latchQ(ck, d) { let q = 0; return [...ck].map((c, i) => { if (c === "1") q = Number(d[i]); return q; }).join(""); }
function ffQ(ck, d) { let q = 0; return [...ck].map((c, i) => { if (i > 0 && c === "1" && ck[i - 1] === "0") q = Number(d[i]); return q; }).join(""); }

const box8 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "13", file: "13-Architettura_dei_Calcolatori-Macchine_Sequenziali",
  title: "Macchine sequenziali", short: "Macchine sequenziali",
  sub: "Tempo, stato e macchine a stati finiti; latch, flip-flop e i registri di un processore RISC-V",
  quote: ["Steve, ogni automobile ha un volante, ma nessuno pretende che il volante sia una sua invenzione.", "Bill Gates, nel film I pirati di Silicon Valley, 1999"],
  cover: "game_pacman.png",
  notes: "Spirale: un gioco con una schermata del titolo è una macchina a stati finiti scritta in assembly; la lezione costruisce poi la teoria (tempo, stato, Mealy e Moore), gli elementi di memoria (latch e flip-flop), e torna ai registri e al program counter di RISC-V.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Spiegare perché un circuito sequenziale ha bisogno dei concetti di tempo e di stato",
      "Definire una macchina a stati finiti e distinguere le macchine di Mealy da quelle di Moore",
      "Descrivere una macchina con una tabella degli stati e con un diagramma degli stati, e passare dall'una all'altro",
      "Spiegare come un latch SR ricorda un bit, e perché S = R = 1 non è ammesso",
      "Distinguere latch e flip-flop, sensibilità al livello e sensibilità al fronte",
      "Riconoscere registri, contatori e il program counter di RISC-V come macchine sequenziali",
    ]),

    H("Riscaldamento sulla macchina", "Lo stesso pulsante, tre effetti diversi."),
    K("Un gioco è una macchina a stati", `.equ TITLE, 0
.equ PLAY,  1
.equ OVER,  2

game_update:
    ...
    call prg32_input_read      # a0 = buttons: the INPUT
    la   t0, state
    lw   t1, 0(t0)             # t1 = the present STATE
    andi t2, a0, 0x10          # button A
    li   t3, TITLE
    bne  t1, t3, 1f
    beqz t2, done              # TITLE: stay until A is pressed
    li   t1, PLAY              # TITLE --A--> PLAY
    j    store
1:  li   t3, OVER
    bne  t1, t3, done          # PLAY is handled elsewhere
    beqz t2, done              # OVER: stay until A is pressed
    li   t1, TITLE             # OVER --A--> TITLE
store:
    sw   t1, 0(t0)             # the next state becomes the present state
done:
    ...`, [
      "Premere A avvia il gioco dalla schermata del titolo e vi ritorna dalla schermata di fine partita: l'effetto dipende dallo stato",
      "Lo stato è una parola in memoria che sopravvive da un frame all'altro",
      "update calcola lo stato prossimo dallo stato presente e dall'ingresso",
      "draw mostra una schermata diversa per ogni stato: l'uscita",
    ], "Scritto per questa lezione; il gioco finale del libro di PRG32 ha la stessa struttura. Bug da discutere: tenendo premuto A nella schermata OVER si va a TITLE e, un frame dopo, a PLAY. Per correggerlo bisogna ricordare il valore precedente del pulsante: un bit di stato in più."),

    H("Tempo e stato", "Ciò che una macchina combinatoria non ha."),
    T("Circuiti sequenziali", [
      "Combinatori: le uscite in un dato istante dipendono solo dagli ingressi in quello stesso istante",
      "Sequenziali: le uscite dipendono dagli ingressi in quell'istante e dalla storia passata degli ingressi",
      ["La definizione di circuito sequenziale implica due concetti", ["tempo: quando guardiamo i segnali, e quando cambiano le cose?", "stato: che cosa ricorda il circuito del passato?"]],
      "Analisi e sintesi valgono ancora: dalla struttura al comportamento, e da una specifica funzionale a una struttura",
    ], "Tassonomia dei circuiti digitali: reti combinatorie e reti sequenziali. La Lezione 11 ha trattato le prime.", { big: "memoria", label: "un circuito sequenziale è un circuito combinatorio più qualcosa che ricorda" }),
    T("Il tempo: dal continuo al discreto", [
      "In qualunque intervallo un segnale fisico passa per infiniti istanti, e una tensione per infiniti valori",
      ["Un segnale binario è letto, o campionato, in un numero finito di istanti scelti", ["0 se la tensione è sotto la metà di quella di alimentazione, 1 se è sopra"]],
      "Tra due campioni il segnale può fare qualunque cosa: contano solo i campioni",
      "In un sistema digitale il tempo è una sequenza di istanti discreti: t0, t1, t2, ...",
      "Chi decide quando cadono gli istanti? Un segnale periodico dedicato: il clock",
    ], "Lo stesso campionamento e la stessa quantizzazione della Lezione 04, applicati ai fili del circuito. La soglia Vdd/2 è un'idealizzazione: le porte reali hanno attorno a essa una fascia proibita.", { big: "t0, t1, t2 ...", label: "tempo discreto: il circuito si osserva solo in istanti scelti" }),
    D("Il clock", async (s, h) => {
      h.card(s, h.MX, h.TOP, 7.3, 3.3);
      await h.svg(s, clockSvg(), h.MX + 0.15, h.TOP + 0.1, 7.0, 3.1);
      h.rows(s, [
        "Un segnale binario periodico che scandisce gli istanti discreti",
        "In un periodo vale 1 per il tempo alto e 0 per il tempo basso",
        "Duty cycle: il rapporto tra il tempo alto e il periodo",
        "Frequenza: il numero di periodi al secondo, f = 1 / T",
      ], 8.2, h.TOP, h.W - h.MX - 8.2, 3.3);
      h.rows(s, ["Fronte di salita: il passaggio da 0 a 1. Fronte di discesa: il passaggio da 1 a 0. I circuiti sincroni cambiano stato su uno dei due",
        "L'ESP32-C6 lavora a 160 MHz: un periodo dura 6,25 nanosecondi, e ogni rete combinatoria al suo interno deve assestarsi entro quel tempo"], h.MX, 5.1, h.CW, 1.65);
    }, "Fronte di salita, fronte di discesa, periodo TCK, TH e TL nella slide originale. Il legame con la Lezione 11: il periodo deve superare il percorso critico. In un gioco PRG32 il frame fa da clock, molto più lento."),
    T("Il concetto di stato", [
      "Le uscite di un circuito sequenziale dipendono dagli ingressi e dallo stato: una sintesi di tutta la storia precedente degli ingressi",
      "Lo stato è conservato da un insieme di variabili di stato",
      "Una funzione di transizione calcola lo stato prossimo dallo stato presente e dagli ingressi presenti",
      ["Lo stato si aggiorna a ogni istante del tempo discreto, cioè a ogni ciclo di clock", ["lo stato all'istante k dipende dagli ingressi all'istante k e dallo stato all'istante k - 1"]],
      "Per memorizzare lo stato si usano elementi di memoria detti bistabili: latch e flip-flop",
    ], "Nel riscaldamento: una variabile di stato (la parola state), la funzione di transizione è game_update, il clock è il frame.", { big: "S(k) = f(S(k-1), I(k))", label: "lo stato prossimo è funzione dello stato presente e dell'ingresso" }),

    H("Macchine a stati finiti", "Il modello di ogni circuito sequenziale."),
    DEF("L'automa a stati finiti", "Definizione", "Il numero di stati di una rete sequenziale fisicamente realizzabile è necessariamente finito. Il modello che ne descrive il comportamento è l'automa a stati finiti; una macchina sequenziale ne realizza uno.", [
      "Una macchina sequenziale è una quintupla (I, U, S, Ω, w)",
      "I, l'alfabeto di ingresso, e U, l'alfabeto di uscita: insiemi finiti di simboli",
      "S: l'insieme finito e non vuoto degli stati",
      "Ω: la funzione stato prossimo, da S x I a S. A ogni coppia stato-ingresso corrisponde, se specificato, uno e un solo stato prossimo",
      "w: la funzione di uscita, che genera il simbolo di uscita",
    ], "In inglese: finite-state automaton; sequential machine. Con k variabili di stato gli stati sono al più 2^k. La slide originale scriveva le funzioni con segni di appartenenza: qui si usano le frecce corrette."),
    V("Macchine di Mealy e macchine di Moore",
      ["Macchina di Mealy", ["L'uscita dipende dallo stato e dall'ingresso", "w: S x I -> U", "L'uscita si scrive sulle transizioni", "Può reagire a un ingresso nello stesso ciclo", "Spesso richiede meno stati"]],
      ["Macchina di Moore", ["L'uscita è associata al solo stato", "w: S -> U", "L'uscita si scrive dentro gli stati", "Cambia solo quando cambia lo stato: nessun disturbo dagli ingressi", "Il gioco del riscaldamento lo è: ogni stato ha la sua schermata"]],
      "Ogni macchina di Mealy ha una macchina di Moore equivalente e viceversa, eventualmente con un numero diverso di stati."),
    D("Architettura generale di una macchina sequenziale", (s, h) => {
      const x = h.MX + 1.5, y = h.TOP + 0.1;
      box8(s, h, "rete combinatoria\nfunzione stato prossimo Ω\nfunzione di uscita w", x, y, 3.6, 2.0, P.teal, 16);
      box8(s, h, "registro di stato\nk flip-flop", x, y + 3.25, 3.6, 1.0, P.amber, 16);
      h.arrow(s, h.MX + 0.1, y + 0.6, x - 0.03, y + 0.6, P.mute, 2.25); h.tx(s, "ingressi\nx1 ... xn", { x: h.MX - 0.1, y: y + 0.7, w: 1.5, h: 0.6, fontSize: 13, color: P.ink });
      h.arrow(s, x + 3.63, y + 0.6, x + 5.0, y + 0.6, P.mute, 2.25); h.tx(s, "uscite\nz1 ... zm", { x: x + 3.8, y: y + 0.7, w: 1.5, h: 0.6, fontSize: 13, color: P.ink });
      h.line(s, x + 3.0, y + 2.03, x + 3.0, y + 2.6, P.red, 2.25); h.arrow(s, x + 3.0, y + 2.6, x + 3.0, y + 3.22, P.red, 2.25);
      h.tx(s, "stato prossimo\nY1 ... Yk", { x: x + 3.15, y: y + 2.3, w: 1.6, h: 0.6, fontSize: 13, bold: true, color: P.red });
      h.arrow(s, x + 0.6, y + 3.22, x + 0.6, y + 2.03, P.violet, 2.25);
      h.tx(s, "stato presente\ny1 ... yk", { x: x - 1.15, y: y + 2.3, w: 1.65, h: 0.6, fontSize: 13, bold: true, color: P.violet, align: "right" });
      h.arrow(s, h.MX + 0.4, y + 3.75, x - 0.03, y + 3.75, P.steel, 2.25); h.tx(s, "clock", { x: h.MX + 0.1, y: y + 3.85, w: 1.2, h: 0.3, fontSize: 13, bold: true, color: P.steel });
      h.rows(s, [
        "Una rete combinatoria calcola lo stato prossimo e le uscite",
        "Un registro di flip-flop conserva lo stato presente",
        "A ogni fronte del clock lo stato prossimo diventa lo stato presente",
        "L'anello è spezzato dal registro: i valori fanno un giro per ciclo, mai più in fretta",
        "L'intera Lezione 11 vive nel riquadro superiore",
      ], 7.6, h.TOP, h.W - h.MX - 7.6, h.BOT - h.TOP);
    }, "Rete combinatoria e registri di stato. Il riscaldamento ha esattamente questa forma: game_update è il riquadro superiore, la parola state è il registro, il frame è il clock."),
    O("Sintesi di una rete sequenziale", [
      "Si definiscono gli insiemi I, U e S: ingressi, uscite e stati",
      "Si definiscono la funzione stato prossimo Ω e la funzione di uscita w, con una tabella o un diagramma degli stati",
      "Si assegna a ogni stato un codice binario: k variabili di stato per un massimo di 2^k stati",
      "Si sintetizzano le due reti combinatorie che realizzano Ω e w, con i metodi delle Lezioni 09 e 11",
      "Si scelgono gli elementi di memoria: la rete dello stato prossimo dipende dal tipo di bistabile, quella di uscita no",
    ], "Con i flip-flop D la rete dello stato prossimo calcola semplicemente il codice dello stato prossimo: per questo oggi sono la scelta abituale."),
    D("Tabella e diagramma degli stati: una macchina di Mealy", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, machineSvg(false), h.MX + 0.1, h.TOP + 0.1, 5.7, h.BOT - h.TOP - 0.2);
      h.table(s, 7.0, h.TOP, [1.5, 2.1, 2.1], ["Stato presente", "Ingresso 0", "Ingresso 1"], [["s0", "s1 / 1", "s2 / 1"], ["s1", "s3 / 0", "s2 / 1"], ["s2", "s1 / 1", "s3 / 0"], ["s3", "s3 / 0", "s0 / 0"]], { fs: 16, mono: [0, 1, 2], align: "center", rowH: 0.48 });
      h.rows(s, [
        "Tabella degli stati: una riga per stato presente, una colonna per simbolo di ingresso; ogni cella contiene stato prossimo / uscita",
        "Diagramma degli stati: un grafo orientato; un nodo per stato, un arco per transizione, etichettato ingresso / uscita",
        "Le due descrizioni sono equivalenti",
      ], 7.0, h.TOP + 2.65, h.W - h.MX - 7.0, h.BOT - h.TOP - 2.65);
    }, "Tabella degli stati e diagramma degli stati: G(V, E, L) con V i nodi (stati), E gli archi (transizioni) e L le etichette. L'esempio è quello della presentazione originale."),
    D("Tabella e diagramma degli stati: una macchina di Moore", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, machineSvg(true), h.MX + 0.1, h.TOP + 0.1, 5.7, h.BOT - h.TOP - 0.2);
      h.table(s, 7.0, h.TOP, [1.5, 1.4, 1.4, 1.4], ["Stato presente", "Ingresso 0", "Ingresso 1", "Uscita"], [["s0", "s1", "s2", "00"], ["s1", "s3", "s2", "01"], ["s2", "s1", "s3", "10"], ["s3", "s3", "s0", "11"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", rowH: 0.48 });
      h.rows(s, [
        "L'uscita è una proprietà dello stato: ha una colonna propria nella tabella e si scrive dentro ogni nodo del diagramma",
        "Gli archi portano solo il simbolo di ingresso",
        "Qui l'uscita è semplicemente il codice binario dello stato",
      ], 7.0, h.TOP + 2.65, h.W - h.MX - 7.0, h.BOT - h.TOP - 2.65);
    }, "Stesse transizioni dell'esempio di Mealy, con un'uscita di due bit associata a ogni stato."),
    D("Il riscaldamento come diagramma degli stati", async (s, h) => {
      h.card(s, h.MX, h.TOP, h.CW, 3.3);
      await h.svg(s, gameSvg(), h.MX + 2.2, h.TOP + 0.05, h.CW - 4.4, 3.2);
      h.table(s, h.MX, 5.05, [2.2, 3.3, 3.3, 3.333], ["Stato presente", "Ingresso che lo cambia", "Stato prossimo", "Uscita (draw)"], [["TITLE", "A premuto", "PLAY", "la schermata del titolo"], ["PLAY", "vite = 0", "OVER", "il campo di gioco"], ["OVER", "A premuto", "TITLE", "il punteggio finale"]], { fs: 14.5, mono: [0, 2] });
    }, "Una macchina di Moore con tre stati: basterebbero due bit di stato, il programma usa una parola intera. Disegnare il diagramma prima di scrivere il codice è l'abitudine di progetto più utile per un gioco."),

    H("Latch", "Come un circuito ricorda un bit."),
    T("Elementi di memoria", [
      "I circuiti elettronici capaci di memorizzare un singolo bit sono essenzialmente di due tipi: latch e flip-flop",
      ["Entrambi sono bistabili", ["due stati stabili, 0 e 1, mantenuti finché nulla li cambia"]],
      "Entrambi hanno due uscite, Q e Q', sempre l'una il complemento dell'altra",
      ["Un po' di storia", ["1918: Eccles e Jordan costruiscono il primo flip-flop elettronico, con due valvole", "1943: lo stesso circuito è al cuore di Colossus", "poi relè, transistor, e oggi porte logiche su un chip"]],
    ], "Latch: «un circuito che mantiene lo stato di uscita prodotto da un segnale di ingresso momentaneo finché un altro segnale non lo riporta a zero». Flip-flop: un multivibratore bistabile. Il nome viene dal suono delle versioni elettromeccaniche.", { big: "1 bit", label: "la memoria più piccola: un circuito con due stati stabili" }),
    D("Il latch SR", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.4, 3.35);
      await h.svg(s, latchSvg(false), h.MX + 0.3, h.TOP + 0.15, 4.8, 3.05);
      h.table(s, h.MX + 0.65, 5.1, [0.8, 0.8, 2.5], ["S", "R", "Q prossimo"], [["0", "0", "Q: mantiene"], ["0", "1", "0: reset"], ["1", "0", "1: set"], ["1", "1", "non ammesso"]], { fs: 14, mono: [0, 1], align: "center", bold0: false, rowH: 0.33, hi: { 3: P.redSoft } });
      h.rows(s, [
        "Due porte NOR, ciascuna con l'uscita collegata a un ingresso dell'altra: retroazione",
        "S (set) porta Q allo stato stabile 1; R (reset) porta Q allo stato stabile 0",
        "Con S = R = 0 il latch conserva l'ultimo valore: ricorda quale dei due ingressi è stato a 1 più di recente",
        ["Per via della retroazione Q dipende da se stesso", ["Q = R' . (S + Q), dove la Q a destra è il valore di un ritardo di propagazione prima"]],
        "In una rete con anelli ogni variabile è una forma d'onda nel tempo, non un singolo valore",
      ], 6.5, h.TOP, h.W - h.MX - 6.5, h.BOT - h.TOP);
    }, "Q = (R + Q')' e Q' = (S + Q)'. Tagliando il filo di retroazione il latch diventa una semplice rete combinatoria di due NOR: così lo analizzava, caso per caso, la presentazione originale. Lo stesso latch si può costruire con due porte NAND e ingressi attivi bassi."),
    D("Il latch SR nel tempo", async (s, h) => {
      h.card(s, h.MX, h.TOP, h.CW, 3.2);
      await h.svg(s, D8.wave([{ name: "S", v: "00011000000000" }, { name: "R", v: "00000000110000" }, { name: "Q", v: "00011111000000", delay: 16 }],
        { slot: 54, marks: [{ t: 3, label: "set" }, { t: 5, label: "S torna a 0" }, { t: 8, label: "reset" }, { t: 10, label: "R torna a 0" }] }), h.MX + 0.3, h.TOP + 0.1, h.CW - 0.6, 3.0);
      h.rows(s, [
        "Set: S va a 1; dopo il ritardo di due porte Q diventa 1",
        "S torna a 0 e non cambia nulla: la retroazione tiene Q a 1. Il latch ricorda",
        "Reset: R va a 1 e, dopo il ritardo, Q diventa 0; quando R torna a 0 resta lì",
      ], h.MX, 4.95, h.CW, 1.8);
    }, "Diagramma temporale. La presentazione originale tracciava ciascuno di questi quattro passi porta per porta su una dozzina di slide; ripercorrerli alla lavagna con il circuito della slide precedente. Il latch è un automa di Moore: la sua uscita è il suo stato."),
    T("Perché S = R = 1 non è ammesso", [
      "Con entrambi gli ingressi a 1 entrambe le porte NOR danno 0: Q e Q' non sono più complementari",
      "Se poi S e R tornano a 0 insieme, le due porte fanno a gara: lo stato finale dipende da quale è più veloce",
      "L'uscita è imprevedibile, e il latch può perfino oscillare",
      "S e R si chiamano ingressi di eccitazione; il progettista deve garantire che non siano mai a 1 insieme",
      "Gli elementi JK e D esistono per eliminare questo problema",
    ], "Le conclusioni della presentazione originale scambiavano set e reset in una slide: set dà Q = 1, reset dà Q = 0.", { big: "S . R = 0", label: "la condizione che deve rispettare ogni circuito che pilota un latch SR" }),
    D("Latch sincroni: si aggiunge un clock", async (s, h) => {
      h.card(s, 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
      await h.svg(s, latchSvg(true), 7.25, h.TOP + 0.3, h.W - h.MX - 7.4, h.BOT - h.TOP - 1.3);
      h.tx(s, "Un latch SR sincrono: gli ingressi di eccitazione passano per due porte AND controllate da CK", { x: 7.25, y: h.BOT - 0.9, w: h.W - h.MX - 7.4, h: 0.7, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
      h.rows(s, [
        "Sistemi asincroni: le uscite possono cambiare ogni volta che cambia un ingresso",
        "Sistemi sincroni: l'istante in cui le uscite possono cambiare è deciso dal clock",
        ["In un latch SR sincrono, S e R sono messi in AND con il clock", ["CK = 0: entrambe le porte AND danno 0 e il latch non può cambiare stato", "CK = 1: il latch è sensibile a S e R, esattamente come quello asincrono"]],
        "Il clock decide quando gli ingressi vengono ascoltati",
      ], h.MX, h.TOP, 6.2, h.BOT - h.TOP);
    }, "Latch sincroni e asincroni. La presentazione originale suggerisce un simulatore: de-iitr.vlabs.ac.in/exp/truth-tables-flip-flops."),
    G("I latch JK e D", ["Ingressi", "Latch JK", "Ingressi", "Latch D"], [
      ["J = 0, K = 0", "mantiene: Q invariato", "D = 0", "Q diventa 0"],
      ["J = 0, K = 1", "reset: Q diventa 0", "D = 1", "Q diventa 1"],
      ["J = 1, K = 0", "set: Q diventa 1", "", ""],
      ["J = 1, K = 1", "commuta: Q si inverte", "", ""],
    ], "JK: le uscite sono riportate alle porte di ingresso, S = J . Q' e R = K . Q; poiché Q e Q' sono complementari, S e R non possono mai valere entrambi 1. D: un solo ingresso va a S e, attraverso un invertitore, a R, quindi sono possibili solo i casi S = 0, R = 1 e S = 1, R = 0.", { widths: [2.4, 4, 1.8, 4], mono: [0, 2], fs: 19, caption: "JK: S = J . Q' e R = K . Q non valgono mai 1 insieme. D (delay): S = D e R = D', quindi l'uscita ripete l'ingresso finché il clock è attivo." }),
    T("La sensibilità al livello e il suo problema", [
      "Un latch è sensibile al livello: resta sensibile per tutto il tempo in cui il clock è al livello attivo",
      "Finché il clock è alto un latch è trasparente: ogni variazione degli ingressi arriva alle uscite",
      "In un ciclo di clock sono quindi possibili più cambi di stato",
      ["In una macchina con retroazione questo è fatale", ["il nuovo stato fa il giro dell'anello e cambia di nuovo lo stato, nello stesso ciclo", "un latch JK con J = K = 1 continua a commutare finché il clock resta alto"]],
      "Serve un elemento che cambi al più una volta per ciclo",
    ], "Si riguardi l'architettura generale: il registro di stato non deve lasciar passare lo stato prossimo mentre è ancora in corso di calcolo.", { big: "una volta per ciclo", label: "ciò che un registro di stato deve garantire, e che un latch trasparente non può" }),

    H("Flip-flop", "Un solo cambio per ciclo di clock."),
    D("Il flip-flop master-slave", (s, h) => {
      const y = h.TOP + 0.5, bw = 2.2, bh = 1.6, x1 = h.MX + 0.9, x2 = x1 + bw + 1.1;
      box8(s, h, "MASTER\nlatch D\nattivo con CK = 0", x1, y, bw, bh, P.teal, 15);
      box8(s, h, "SLAVE\nlatch D\nattivo con CK = 1", x2, y, bw, bh, P.amber, 15);
      h.arrow(s, h.MX + 0.1, y + 0.5, x1 - 0.03, y + 0.5, P.mute, 2.25); h.tx(s, "D", { x: h.MX + 0.1, y: y + 0.1, w: 0.5, h: 0.3, fontSize: 17, bold: true, fontFace: h.MONO });
      h.arrow(s, x1 + bw + 0.03, y + 0.5, x2 - 0.03, y + 0.5, P.mute, 2.25); h.tx(s, "Qm", { x: x1 + bw + 0.2, y: y + 0.1, w: 0.7, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, x2 + bw + 0.03, y + 0.5, x2 + bw + 0.75, y + 0.5, P.mute, 2.25); h.tx(s, "Q", { x: x2 + bw + 0.25, y: y + 0.1, w: 0.5, h: 0.3, fontSize: 17, bold: true, fontFace: h.MONO });
      h.line(s, h.MX + 0.3, y + 2.4, x2 + bw / 2, y + 2.4, P.red, 2.25); h.tx(s, "CK", { x: h.MX + 0.3, y: y + 2.45, w: 0.7, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, color: P.red });
      h.arrow(s, x1 + bw / 2, y + 2.4, x1 + bw / 2, y + bh + 0.03, P.red, 2.25); h.arrow(s, x2 + bw / 2, y + 2.4, x2 + bw / 2, y + bh + 0.03, P.red, 2.25);
      h.tx(s, "invertito", { x: x1 + bw / 2 + 0.1, y: y + bh + 0.2, w: 1.2, h: 0.3, fontSize: 12.5, italic: true, color: P.red });
      h.rows(s, [
        "Due latch in serie, controllati da livelli opposti del clock",
        "Il master riceve gli ingressi; lo slave produce le uscite",
        "Non sono mai trasparenti insieme: l'ingresso non può mai correre dritto fino all'uscita",
        "L'uscita cambia solo quando il clock passa da 0 a 1: sul fronte",
        "Un flip-flop è sensibile al fronte: un'operazione per ciclo di clock, e nessuna fluttuazione dell'uscita",
      ], 8.3, h.TOP, h.W - h.MX - 8.3, h.BOT - h.TOP);
      h.card(s, h.MX, 5.75, 7.3, 1.0, P.tealSoft);
      h.tx(s, "(livello 0) seguito da (livello 1) = (fronte di salita)", { x: h.MX + 0.2, y: 5.75, w: 6.9, h: 1.0, fontSize: 18, bold: true, valign: "middle", align: "center", color: P.steel });
    }, "Flip-flop master-slave. La presentazione originale mostrava la versione JK, fatta di due latch JK sincroni; la versione D è quella usata nei registri di un processore."),
    D("Latch o flip-flop? Guardate l'uscita", async (s, h) => {
      const ck = "001100110011001100110011", d = "000110011000011111100000";
      h.card(s, h.MX, h.TOP, h.CW, 3.55);
      await h.svg(s, D8.wave([{ name: "CK", v: ck, color: "#2E4A62" }, { name: "D", v: d, color: "#C7791B" }, { name: "latch Q", v: latchQ(ck, d), color: "#6B4FA0" }, { name: "flip-flop Q", v: ffQ(ck, d), color: "#0E7C86" }],
        { slot: 30, left: 130, slope: 3 }), h.MX + 0.2, h.TOP + 0.05, h.CW - 0.4, 3.45);
      h.rows(s, [
        "Il latch D segue D per tutto il tempo in cui il clock è alto, e conserva l'ultimo valore quando il clock scende",
        "Il flip-flop D guarda D solo sul fronte di salita: gli impulsi brevi tra due fronti sono ignorati",
        "L'uscita del flip-flop è ferma per un intero periodo: è ciò che serve a un registro di stato",
      ], h.MX, 5.25, h.CW, 1.5);
    }, "Sensibile al livello contro sensibile al fronte. Le forme d'onda sono calcolate, non disegnate a mano: l'uscita del latch cambia a metà di una fase alta, quella del flip-flop solo sui fronti di salita."),
    G("Elementi di memoria: un riepilogo", ["Elemento", "Ingressi", "Stato prossimo", "Cambia quando"], [
      ["latch SR (S R = 0)", "S, R", "Q+ = S + R' Q", "ogni volta che cambia un ingresso"],
      ["latch SR sincrono", "S, R, CK", "come sopra", "finché il clock è al livello attivo"],
      ["latch D", "D, CK", "Q+ = D", "finché il clock è al livello attivo"],
      ["flip-flop JK", "J, K, CK", "Q+ = J Q' + K' Q", "sul fronte del clock"],
      ["flip-flop D", "D, CK", "Q+ = D", "sul fronte del clock"],
      ["flip-flop T", "T, CK", "Q+ = T xor Q", "sul fronte del clock"],
    ], "Q+ è lo stato prossimo (tabella caratteristica). Un flip-flop T è un JK con J = K = T. Il flip-flop D è l'elemento di memoria standard dei processori di oggi.", { widths: [3.2, 1.9, 3.2, 4.2], mono: [1, 2] }),

    H("Ritorno alla macchina", "Da un flip-flop ai registri di RISC-V."),
    D("Un registro è una fila di flip-flop", (s, h) => {
      const n = 4, bw = 1.25, g = 0.45, x0 = h.MX + 0.9, y = h.TOP + 1.0;
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (bw + g), b = n - 1 - i;
        box8(s, h, "flip-flop D", x, y, bw, 1.0, P.teal, 13.5);
        h.arrow(s, x + bw / 2, y - 0.6, x + bw / 2, y - 0.03, P.mute, 2); h.tx(s, `D${b}`, { x, y: y - 0.95, w: bw, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, align: "center" });
        h.arrow(s, x + bw / 2, y + 1.03, x + bw / 2, y + 1.6, P.mute, 2); h.tx(s, `Q${b}`, { x, y: y + 1.62, w: bw, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, align: "center" });
        h.arrow(s, x + 0.2, y + 2.3, x + 0.2, y + 1.03, P.red, 1.75);
      }
      h.line(s, h.MX + 0.1, y + 2.3, x0 + (n - 1) * (bw + g) + 0.2, y + 2.3, P.red, 2.25); h.tx(s, "CK", { x: h.MX, y: y + 2.35, w: 0.8, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO, color: P.red });
      h.tx(s, "un registro di quattro bit", { x: x0, y: y + 2.75, w: n * (bw + g), h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        "Un registro è un dispositivo capace di memorizzare un gruppo di bit: un flip-flop per bit e un clock comune",
        "Con un segnale di abilitazione al caricamento il registro prende il nuovo valore solo quando gli è chiesto; altrimenti conserva il vecchio",
        ["RISC-V ha trentadue registri di trentadue bit", ["1024 flip-flop, meno quelli di x0, che è cablato a zero"]],
        "Il decodificatore della Lezione 11 pilota le abilitazioni: al fronte del clock cambia solo il registro indicato da rd",
        "I multiplexer della Lezione 11 selezionano i registri da leggere",
      ], 8.1, h.TOP, h.W - h.MX - 8.1, h.BOT - h.TOP);
    }, "La presentazione originale usava come esempio il 74273 (otto flip-flop D, un clock e un clear). Registri, registri a scorrimento, bus e buffer a tre stati sono l'argomento della prossima lezione."),
    D("Il program counter: un registro in un anello", (s, h) => {
      const y = h.TOP + 0.4;
      box8(s, h, "PC\nregistro, 32 bit", h.MX + 0.4, y + 1.0, 2.2, 1.2, P.amber, 15);
      box8(s, h, "sommatore\n+ 4", 4.5, y, 1.6, 1.0, P.violet, 15);
      box8(s, h, "MUX", 7.0, y + 0.7, 1.1, 1.9, P.teal, 16);
      box8(s, h, "destinazione del\nsalto, dalla ALU", 4.3, y + 2.1, 2.0, 0.9, P.steel, 13.5);
      h.arrow(s, h.MX + 2.63, y + 1.3, 4.47, y + 0.5, P.mute, 2); h.arrow(s, 6.13, y + 0.5, 6.97, y + 1.1, P.mute, 2); h.arrow(s, 6.33, y + 2.55, 6.97, y + 2.2, P.mute, 2);
      h.line(s, 8.13, y + 1.65, 8.6, y + 1.65, P.red, 2.25); h.line(s, 8.6, y + 1.65, 8.6, y + 3.6, P.red, 2.25); h.line(s, 8.6, y + 3.6, h.MX + 1.5, y + 3.6, P.red, 2.25); h.arrow(s, h.MX + 1.5, y + 3.6, h.MX + 1.5, y + 2.23, P.red, 2.25);
      h.tx(s, "PC prossimo", { x: 4.0, y: y + 3.65, w: 2.5, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.arrow(s, h.MX + 1.5, y + 0.3, h.MX + 1.5, y + 0.97, P.steel, 2); h.tx(s, "clock", { x: h.MX + 0.9, y: y - 0.05, w: 1.2, h: 0.3, fontSize: 13.5, bold: true, color: P.steel, align: "center" });
      h.arrow(s, 7.55, y + 3.2, 7.55, y + 2.63, P.mute, 2); h.tx(s, "salto eseguito?", { x: 6.6, y: y + 3.22, w: 1.9, h: 0.3, fontSize: 12.5, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        "Il PC contiene l'indirizzo dell'istruzione in esecuzione: è lo stato che dice dove si trova il programma",
        "Stato prossimo: PC + 4 per un'istruzione normale, oppure la destinazione quando un salto viene eseguito",
        "Stato presente, rete combinatoria, stato prossimo, clock: esattamente l'architettura generale",
        "Con il solo percorso + 4 è un contatore: la più semplice macchina a stati finiti",
        "first_update della Lezione 02 era la stessa macchina in software",
      ], 9.0, h.TOP, h.W - h.MX - 9.0, h.BOT - h.TOP);
    }, "Il comparatore della Lezione 11 produce «salto eseguito?» per beq e bne. Le istruzioni distano 4 byte; con l'estensione compressa il sommatore aggiunge 2 per le istruzioni a 16 bit."),
    D("Esempio di sintesi: un contatore a due bit", (s, h) => {
      h.table(s, h.MX, h.TOP, [1.5, 1.5, 1.4, 1.4], ["Q1 Q0 presente", "Q1 Q0 prossimo", "D1", "D0"], [["0 0", "0 1", "0", "1"], ["0 1", "1 0", "1", "0"], ["1 0", "1 1", "1", "1"], ["1 1", "0 0", "0", "0"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.48 });
      h.card(s, h.MX, h.TOP + 2.7, 5.8, 2.5, P.tealSoft);
      h.tx(s, "D0 = Q0'\nD1 = Q1 xor Q0", { x: h.MX + 0.3, y: h.TOP + 2.8, w: 5.2, h: 1.1, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "Due flip-flop D, un invertitore e una porta XOR: una macchina che conta 0, 1, 2, 3, 0, ... un passo per fronte di clock.", { x: h.MX + 0.3, y: h.TOP + 3.95, w: 5.2, h: 1.15, fontSize: 15, valign: "middle" });
      h.rows(s, [
        "Stati: quattro, uno per valore del conteggio; nessun ingresso; l'uscita è lo stato stesso (Moore)",
        "Codice degli stati: due variabili di stato Q1 Q0, il conteggio in binario",
        "Tabella degli stati: accanto a ogni stato presente si scrive lo stato prossimo",
        "Con i flip-flop D l'eccitazione è lo stato prossimo: D1 D0 = Q1 Q0 prossimo",
        "Si minimizza ogni D come funzione di Q1 e Q0, con una mappa di due variabili",
        "Gli stessi cinque passi, con più stati e più variabili, danno ogni contatore e ogni unità di controllo",
      ], 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP, "num");
    }, "Svolto alla lavagna: D0 vale 1 nelle righe 00 e 10, quindi D0 = Q0'; D1 vale 1 nelle righe 01 e 10, quindi D1 = Q1'Q0 + Q1Q0' = Q1 xor Q0. Si confronti con il sommatore completo: un contatore è un sommatore che aggiunge 1 al proprio registro."),
    F("Il processore è una macchina sequenziale", [
      "Stato|il program counter, i trentadue registri, la memoria",
      "Ingresso|l'istruzione all'indirizzo contenuto nel PC, e i dati che legge",
      "Rete dello stato prossimo|decodificatori, multiplexer e ALU calcolano i nuovi valori",
      "Fronte di clock|i registri indicati dall'istruzione prendono i nuovi valori",
    ], "Eseguire un programma non è che una lunga passeggiata tra gli stati di una macchina a stati finiti molto grande, un fronte di clock alla volta. L'esecuzione passo-passo in PRG32-QT mostra quella passeggiata uno stato dopo l'altro.",
      "È il ponte verso le lezioni sul processore: datapath (la parte combinatoria e i registri) e controllo (a sua volta una macchina a stati finiti nei progetti multiciclo e microprogrammati)."),

    Q("In una macchina di Moore l'uscita dipende:", ["dal solo ingresso presente", "dal solo stato presente", "dallo stato presente e dall'ingresso presente", "dallo stato prossimo e dall'ingresso"], 1, "Moore: w va da S a U. In una macchina di Mealy l'uscita dipende dallo stato e dall'ingresso."),
    Q("Un latch SR fatto di porte NOR ha Q = 1. S e R valgono entrambi 0. Che cosa accade?", ["Q diventa 0", "Q oscilla", "Q resta a 1", "lo stato è indefinito"], 2, "S = R = 0 è la condizione di mantenimento: la retroazione conserva il valore memorizzato."),
    Q("Che cosa distingue un flip-flop D da un latch D?", ["Il flip-flop ha due ingressi", "Il flip-flop memorizza due bit", "Il flip-flop cambia solo su un fronte del clock", "Al flip-flop non serve un clock"], 2, "Il latch è trasparente per tutto il livello attivo del clock; il flip-flop campiona D solo sul fronte."),
    Q("Quanti flip-flop servono per una macchina a stati finiti con 10 stati?", ["3", "4", "5", "10"], 1, "ceil(log2 10) = 4 variabili di stato, con il codice binario di lunghezza minima della Lezione 11. Ne servirebbero dieci con un codice one-hot."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Disegnate il diagramma degli stati di una macchina che dà 1 quando gli ultimi due ingressi erano entrambi 1; scrivetela come macchina di Moore e come macchina di Mealy",
      "Completate il diagramma temporale di un latch SR per una sequenza data di S e R, segnando dove mantiene",
      "Sintetizzate un contatore modulo 3 (0, 1, 2, 0, ...) con due flip-flop D; che cosa accade nello stato non usato?",
      "Aggiungete al gioco del riscaldamento uno stato PAUSE, in cui si entra e da cui si esce con il pulsante SELECT, disegnando prima il nuovo diagramma",
      "Correggete il riscaldamento perché A debba essere rilasciato e premuto di nuovo: memorizzate lo stato precedente del pulsante e reagite solo a un passaggio da 0 a 1",
    ], "Su PRG32: quattro schermate, e un pulsante tenuto premuto che causa esattamente una transizione. L'ultimo esercizio è il rilevamento del fronte in software: il programma si comporta da flip-flop invece che da latch.",
      "Esercizio 1: a Moore servono tre stati (nessun 1 visto, un 1 visto, due o più), a Mealy due. Esercizio 3: D1 = Q0, D0 = Q1'Q0' con lo stato 11 come indifferenza, oppure progettato per tornare a 00. Esercizio 5: si tiene prev in memoria; pressed_now = buttons AND NOT prev; poi si memorizza buttons in prev."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["sequential network", "rete sequenziale", "latch / flip-flop", "latch / flip-flop (bistabile)"],
      ["finite-state machine", "automa a stati finiti", "feedback", "retroazione"],
      ["state table / diagram", "tabella / diagramma degli stati", "rising / falling edge", "fronte di salita / di discesa"],
      ["next-state function", "funzione stato prossimo", "level- / edge-triggered", "sensibile al livello / al fronte"],
      ["present / next state", "stato presente / prossimo", "register", "registro"],
      ["clock period", "periodo di clock", "program counter", "contatore di programma"],
    ], null, { widths: [3, 3.3, 3.1, 3.3] }),
    T("Conclusioni e letture", [
      "I circuiti digitali sono combinatori o sequenziali; per i sequenziali contano il tempo e lo stato",
      "Una macchina sequenziale realizza un automa a stati finiti, descritto come macchina di Mealy o di Moore",
      "Latch e flip-flop sono le memorie elementari: la retroazione fa sì che un circuito ricordi",
      "Il clock decide quando: i latch ascoltano durante un livello, i flip-flop solo su un fronte",
      "Registri, contatori, program counter e il processore stesso sono macchine sequenziali costruite attorno a reti combinatorie",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, appendice A (clock, elementi di memoria, macchine a stati finiti)", "Bucci: Architettura dei calcolatori elettronici, i capitoli sulle reti sequenziali", "Playing with RISC-V, capitolo 8: il gioco finale in assembly"]],
    ], "Prossima lezione: le macchine elementari per l'architettura: registri, registri a scorrimento, bus e buffer a tre stati."),
  ],
});
