// Italian version of decks/en/09-boolean-algebra-2.js: same slides, same listings, text in Italian.
// Lecture 09 - Elements of Boolean algebra, part 2: functions, canonical forms, minimisation, adders.
// Source: 06-Architettura_dei_Calcolatori-Algebra_di_Boole.pptx (translated, figures redrawn, 4-variable map, don't-cares and RISC-V added).
const G6 = require("../../lib/gates");

function halfAdderSvg() {
  const x = G6.pins("xor", 200, 30), a = G6.pins("and", 200, 120);
  return G6.doc(340, 190,
    G6.wire([[40, 41], x.a]) + G6.wire([[40, 63], x.b]) +
    G6.wire([[130, 41], [130, 131], a.a], true) + G6.wire([[95, 63], [95, 153], a.b], true) +
    G6.wire([x.out, [300, 52]]) + G6.wire([a.out, [300, 142]]) +
    G6.gate("xor", 200, 30) + G6.gate("and", 200, 120) +
    G6.text(14, 46, "A", { size: 18 }) + G6.text(14, 68, "B", { size: 18 }) + G6.text(306, 58, "S", { size: 18 }) + G6.text(306, 148, "C", { size: 18 }));
}

function fullAdderSvg() {
  const x1 = G6.pins("xor", 150, 20), x2 = G6.pins("xor", 330, 31), a1 = G6.pins("and", 330, 130), a2 = G6.pins("and", 330, 220), o = G6.pins("or", 470, 175);
  return G6.doc(640, 290,
    G6.wire([[40, 31], x1.a]) + G6.wire([[40, 53], x1.b]) +
    G6.wire([[75, 31], [75, 231], a2.a], true) + G6.wire([[105, 53], [105, 253], a2.b], true) +
    G6.wire([x1.out, x2.a]) + G6.wire([[265, 42], [265, 141], a1.a], true) +
    G6.wire([[40, 100], [300, 100], [300, 64], x2.b]) + G6.wire([[300, 100], [300, 163], a1.b], true) +
    G6.wire([a1.out, [430, 152], [430, 186], o.a]) + G6.wire([a2.out, [430, 242], [430, 208], o.b]) +
    G6.wire([x2.out, [590, 53]]) + G6.wire([o.out, [590, 197]]) +
    G6.gate("xor", 150, 20) + G6.gate("xor", 330, 31) + G6.gate("and", 330, 130) + G6.gate("and", 330, 220) + G6.gate("or", 470, 175) +
    G6.text(14, 36, "A", { size: 18 }) + G6.text(14, 58, "B", { size: 18 }) + G6.text(4, 105, "Cin", { size: 17 }) +
    G6.text(596, 59, "S", { size: 18 }) + G6.text(592, 203, "Cout", { size: 17 }) +
    G6.text(222, 34, "A xor B", { size: 12, bold: false, fill: "#5B6B78" }));
}

Deck({
  n: "09", file: "09-Architettura_dei_Calcolatori-Algebra_di_Boole_2",
  title: "Elementi di algebra di Boole", short: "Algebra di Boole (2)",
  sub: "Parte 2: funzioni booleane, forme canoniche, minimizzazione e l'addizionatore",
  quote: ["Povero me! Povero me! Arriverò troppo tardi!", "Lewis Carroll, Le avventure di Alice nel Paese delle Meraviglie, 1865"],
  cover: "game_tetris.png",
  notes: "Spirale: la lezione si apre con due istruzioni che sommano due bit, mostra che sono un semisommatore, sviluppa poi il metodo (tabella di verità, forma canonica, minimizzazione) che produce circuiti del genere, e si chiude sull'addizionatore a 32 bit che sta dietro l'istruzione add.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Definire letterale, clausola, fattore, mintermine e maxtermine",
      "Dire quante funzioni booleane di n variabili esistono, e nominare quelle di due variabili",
      "Scrivere una funzione in forma canonica somma di prodotti e prodotto di somme dalla tabella di verità",
      "Minimizzare una funzione fino a quattro variabili con una mappa di Karnaugh",
      "Ricavare semisommatore e sommatore completo, e spiegare come trentadue di essi eseguono add",
    ]),

    H("Riscaldamento sulla macchina", "Sommare due bit con le istruzioni che già conoscete."),
    K("Somma a un bit senza add", `# a0 and a1 hold one bit each: 0 or 1
# goal: compute a0 + a1, which needs two bits (0, 1 or 2)

    xor  t0, a0, a1      # low bit of the sum:  1 when the bits differ
    and  t1, a0, a1      # high bit, the carry: 1 when both are 1

#   a0 a1 | t1 t0
#    0  0 |  0  0        0 + 0 = 0
#    0  1 |  0  1        0 + 1 = 1
#    1  0 |  0  1        1 + 0 = 1
#    1  1 |  1  0        1 + 1 = 2  (binary 10)`, [
      "Due istruzioni logiche sommano due bit: nessuna aritmetica",
      "Il commento è una tabella di verità con due uscite",
      "Questa coppia di porte si chiama semisommatore",
      "Come si trovano le porte quando è data la tabella? È il metodo di oggi",
    ], "Eseguirlo in PRG32-QT con le quattro coppie di ingressi. La Lezione 05 diceva che a un processore per l'aritmetica basta un addizionatore; questo è il suo primo bit."),

    H("Funzioni booleane", "Dalle espressioni alle tabelle, e ritorno."),
    T("Espressioni booleane: il vocabolario", [
      ["Letterale: una variabile booleana, o il suo complemento, così come compare in un'espressione", ["a, b', x"]],
      ["Clausola, o termine prodotto: il prodotto logico di due o più letterali", ["a . b' . x"]],
      ["Fattore, o termine somma: la somma logica di due o più letterali", ["(a + x'), (b + c)"]],
      "Clausole e fattori con più di un letterale sono funzioni di livello 1: uno strato di porte",
    ], "In inglese: literal; clause o product term; factor o sum term. Ogni occorrenza di una variabile conta come un letterale: il numero di letterali misura il costo di un'espressione."),
    T("Quante funzioni di n variabili?", [
      "Una funzione booleana associa a ogni combinazione di n ingressi binari un'uscita binaria",
      "Le combinazioni di ingresso sono 2^n, e a ciascuna si può associare 0 oppure 1",
      ["Quindi le funzioni distinte di n variabili sono 2^(2^n): un numero finito", ["1 variabile: 4 funzioni; 2 variabili: 16; 3 variabili: 256; 4 variabili: 65.536"]],
      "Le funzioni booleane sono isomorfe ai circuiti digitali: ogni circuito si può scrivere come espressione, e ogni espressione si può realizzare come circuito",
    ], "f: B^n -> B con B = {0, 1}. Per n = 5 le funzioni sono già più di quattro miliardi: 2^32.", { big: "2^(2^n)", label: "il numero di funzioni booleane distinte di n variabili" }),
    D("Le sedici funzioni di due variabili", (s, h) => {
      const names = ["costante 0", "AND: x . y", "x . y'", "x (identità)", "x' . y", "y (identità)", "XOR", "OR: x + y", "NOR", "XNOR (equivalenza)", "NOT y", "x + y'", "NOT x", "x' + y", "NAND", "costante 1"];
      const hot = { 1: P.tealSoft, 6: P.tealSoft, 7: P.tealSoft, 8: P.amberSoft, 14: P.amberSoft, 9: P.tealSoft };
      const row = (k) => [`f${k}`, ...k.toString(2).padStart(4, "0").split(""), names[k]];
      const w = [0.75, 0.5, 0.5, 0.5, 0.5, 3.1], tw = 5.85, head = ["f", "00", "01", "10", "11", "nome"];
      const hiOf = (base) => { const o = {}; for (let i = 0; i < 8; i++) if (hot[base + i]) o[i] = hot[base + i]; return o; };
      h.table(s, h.MX, h.TOP + 0.35, w, head, Array.from({ length: 8 }, (_, i) => row(i)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", rowH: 0.42, hi: hiOf(0), bold0: false });
      h.table(s, h.W - h.MX - tw, h.TOP + 0.35, w, head, Array.from({ length: 8 }, (_, i) => row(i + 8)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", rowH: 0.42, hi: hiOf(8), bold0: false });
      h.tx(s, "Le colonne 00, 01, 10, 11 danno l'uscita per ogni coppia di ingressi x y", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.35, fontSize: 14, italic: true, color: P.mute });
      h.tx(s, "L'indice di ogni funzione è la sua colonna di uscita letta come numero binario. Evidenziate: le porte della Lezione 08. Con una variabile le quattro funzioni sono: costante 0, x, NOT x, costante 1.", { x: h.MX, y: 5.95, w: h.CW, h: 0.8, fontSize: 15.5, valign: "middle" });
    }, "f0 e f15: costanti. f3, f5: identità (buffer). f12, f10: NOT. f1 AND, f7 OR, f6 XOR, f9 equivalenza, f14 NAND, f8 NOR. f13 è l'implicazione x -> y, f11 è y -> x; f2 e f4 sono le inibizioni."),
    T("Insiemi funzionalmente completi", [
      "Qualunque funzione booleana si può realizzare usando solo AND, OR e NOT",
      ["Esempio: x XOR y = (x' AND y) OR (x AND y')"],
      "L'insieme {AND, OR, NOT} si dice funzionalmente completo",
      "Per De Morgan, AND si costruisce con OR e NOT, e OR con AND e NOT: anche {AND, NOT} e {OR, NOT} sono completi",
      "NAND da solo è completo, e così NOR da solo: sono le porte universali",
    ].map((x) => (Array.isArray(x) ? x[0] : x)), "NOT x = x NAND x; x AND y = (x NAND y) NAND (x NAND y); x OR y = (x NAND x) NAND (y NAND y). I chip reali sono fatti in gran parte di NAND e NOR perché richiedono meno transistor.", { big: "NAND", label: "un solo tipo di porta basta a costruire qualunque circuito digitale, compreso un intero processore" }),
    D("Tabelle di verità", (s, h) => {
      h.rows(s, [
        "Una funzione booleana si può definire con una tabella: la sua tabella di verità",
        "La tabella dà il valore della variabile dipendente per ogni possibile combinazione delle variabili indipendenti",
        "Una funzione di n variabili è definita su 2^n punti, quindi la tabella di verità ha 2^n righe",
        "Le righe si elencano nell'ordine del conteggio: 000, 001, 010, ...",
        "Seguiremo questa funzione F per tutta la lezione",
      ], h.MX, h.TOP, 7.3, h.BOT - h.TOP);
      const F = [0, 0, 0, 1, 1, 1, 1, 1];
      h.table(s, 8.9, h.TOP, [0.85, 0.85, 0.85, 1.05], ["A", "B", "C", "F"], F.map((f, i) => [...i.toString(2).padStart(3, "0").split(""), String(f)]),
        { fs: 17, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.5, hi: Object.fromEntries(F.map((f, i) => [i, f ? P.tealSoft : null]).filter(([, v]) => v)) });
    }, "F vale 1 nelle righe 3, 4, 5, 6, 7. È l'esempio della presentazione originale, mantenuto attraverso forme canoniche, minimizzazione algebrica e mappa di Karnaugh."),
    D("Il semisommatore", async (s, h) => {
      h.rows(s, ["Somma due bit A e B e produce un bit di somma S e un riporto C",
        "In binario 1 + 1 dà somma 0 e riporto 1",
        "Dalla tabella: S vale 1 quando gli ingressi sono diversi, C vale 1 quando entrambi valgono 1"], h.MX, h.TOP, 6.0, 2.3);
      h.tx(s, "S = A xor B        C = A . B", { x: h.MX, y: 4.05, w: 6.0, h: 0.5, fontSize: 21, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.table(s, h.MX + 0.9, 4.75, [0.9, 0.9, 1.1, 1.1], ["A", "B", "S", "C"], [["0", "0", "0", "0"], ["0", "1", "1", "0"], ["1", "0", "1", "0"], ["1", "1", "0", "1"]], { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.4 });
      h.card(s, 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
      await h.svg(s, halfAdderSvg(), 7.3, h.TOP + 0.2, h.W - h.MX - 7.5, h.BOT - h.TOP - 0.4);
    }, "Il circuito è esattamente la coppia di istruzioni del riscaldamento. «Semi» perché non ha un riporto in ingresso: può sommare solo i bit meno significativi."),
    D("Il sommatore completo", async (s, h) => {
      const F = [[0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 0, 1, 0], [0, 1, 1, 0, 1], [1, 0, 0, 1, 0], [1, 0, 1, 0, 1], [1, 1, 0, 0, 1], [1, 1, 1, 1, 1]];
      h.table(s, h.MX, h.TOP, [0.7, 0.7, 0.8, 0.8, 0.95], ["A", "B", "Cin", "S", "Cout"], F.map((r) => r.map(String)), { fs: 15, mono: [0, 1, 2, 3, 4], align: "center", bold0: false, rowH: 0.41 });
      h.tx(s, "S = A xor B xor Cin", { x: h.MX, y: 5.45, w: 4.4, h: 0.4, fontSize: 17, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Cout = A . B + Cin . (A xor B)", { x: h.MX, y: 5.9, w: 4.6, h: 0.4, fontSize: 17, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Somma due bit e un riporto entrante; produce un bit di somma e un riporto uscente.", { x: h.MX, y: 6.35, w: 4.6, h: 0.4, fontSize: 13.5, italic: true, color: P.mute });
      h.card(s, 5.4, h.TOP, h.W - h.MX - 5.4, h.BOT - h.TOP);
      await h.svg(s, fullAdderSvg(), 5.55, h.TOP + 0.15, h.W - h.MX - 5.7, h.BOT - h.TOP - 0.3);
    }, "Due semisommatori e un OR. S vale 1 quando è a 1 un numero dispari di ingressi; Cout vale 1 quando almeno due ingressi sono a 1. I fili che si incrociano senza un punto non sono collegati."),

    H("Forme canoniche", "Una via sistematica dalla tabella a un'espressione."),
    V("Forme elementari: funzioni di livello 2",
      ["Tipo P: somma di prodotti (SOP)", ["Una somma logica di clausole", "y = a b' + a' d + b d' x", "y = a + b c' + a' c x", "Si realizza con uno strato di porte AND che alimentano una porta OR"]],
      ["Tipo S: prodotto di somme (POS)", ["Un prodotto logico di fattori", "y = (a + b') (a' + d) (b + d' + x)", "y = a (b + c') (a' + c + x)", "Si realizza con uno strato di porte OR che alimentano una porta AND"]],
      "Correzione alla slide originale, dove gli esempi dei due tipi erano scambiati: il tipo P (primo tipo) è la somma di prodotti, il tipo S (secondo tipo) il prodotto di somme."),
    T("Mintermini e maxtermini", [
      ["Mintermine: una clausola di ordine n, cioè un prodotto che contiene un letterale di ogni variabile", ["n = 2: a b;  n = 3: a' b' c;  n = 6: a b c' d e' f"]],
      "Un mintermine vale 1 per una e una sola riga della tabella di verità",
      ["Maxtermine: una somma di n letterali, uno per ogni variabile", ["n = 2: (a' + b');  n = 3: (a + b + c');  n = 6: (a' + b' + c + d' + e' + f')"]],
      "Un maxtermine vale 0 per una e una sola riga della tabella di verità",
    ], "In inglese: minterm (termine prodotto P); maxterm (fattore somma S). Il mintermine i corrisponde alla riga i: una variabile compare complementata dove la riga ha uno 0."),
    D("Dalla tabella di verità alle forme canoniche", (s, h) => {
      const F = [0, 0, 0, 1, 1, 1, 1, 1], lit = (i, max) => ["A", "B", "C"].map((v, k) => { const bit = (i >> (2 - k)) & 1; return max ? v + (bit ? "'" : "") : v + (bit ? "" : "'"); });
      const body = F.map((f, i) => [...i.toString(2).padStart(3, "0").split(""), String(f), f ? `m${i} = ${lit(i).join(" ")}` : "", f ? "" : `M${i} = ${lit(i, true).join(" + ")}`]);
      h.table(s, h.MX, h.TOP, [0.6, 0.6, 0.6, 0.7, 2.6, 2.9], ["A", "B", "C", "F", "mintermine (F = 1)", "maxtermine (F = 0)"], body,
        { fs: 15, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.42, hi: Object.fromEntries(F.map((f, i) => [i, f ? P.tealSoft : P.amberSoft])) });
      const x = 9.0, w = h.W - h.MX - x;
      h.card(s, x, h.TOP, w, 2.45, P.tealSoft);
      h.tx(s, "Forma canonica P: somma dei mintermini delle righe in cui F = 1", { x: x + 0.2, y: h.TOP + 0.1, w: w - 0.4, h: 0.75, fontSize: 14.5, bold: true, color: P.teal });
      h.tx(s, "F = A'BC + AB'C' + AB'C + ABC' + ABC", { x: x + 0.2, y: h.TOP + 0.9, w: w - 0.4, h: 0.9, fontSize: 15, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "F = somma di m(3, 4, 5, 6, 7)", { x: x + 0.2, y: h.TOP + 1.85, w: w - 0.4, h: 0.45, fontSize: 14, fontFace: h.MONO, color: P.mute });
      h.card(s, x, h.TOP + 2.65, w, 2.55, P.amberSoft);
      h.tx(s, "Forma canonica S: prodotto dei maxtermini delle righe in cui F = 0", { x: x + 0.2, y: h.TOP + 2.75, w: w - 0.4, h: 0.75, fontSize: 14.5, bold: true, color: P.amber });
      h.tx(s, "F = (A+B+C) (A+B+C') (A+B'+C)", { x: x + 0.2, y: h.TOP + 3.55, w: w - 0.4, h: 0.9, fontSize: 15, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "F = prodotto di M(0, 1, 2)", { x: x + 0.2, y: h.TOP + 4.55, w: w - 0.4, h: 0.45, fontSize: 14, fontFace: h.MONO, color: P.mute });
    }, "Ogni funzione ha una e una sola forma canonica per tipo (a meno dell'ordine dei termini). È sintesi a ricetta: sempre possibile, raramente economica."),
    G("Minimizzazione algebrica di F", ["Espressione", "Legge applicata"], [
      ["A'BC + AB'C' + AB'C + ABC' + ABC", "forma canonica P: 5 clausole, 15 letterali"],
      ["= A'BC + A (B'C' + B'C + BC' + BC)", "distributiva: si raccoglie A"],
      ["= A'BC + A (B' (C' + C) + B (C' + C))", "distributiva, due volte"],
      ["= A'BC + A (B' + B)", "complemento: C' + C = 1"],
      ["= A'BC + A", "complemento: B' + B = 1"],
      ["= A + BC", "semplificazione: x + x' y = x + y"],
    ], "Da cinque porte AND a tre ingressi e una OR a cinque ingressi, a una AND e una OR. La presentazione originale la chiamava minimizzazione «empirica»: funziona, ma quale legge applicare al passo successivo è lasciato all'intuito. Le mappe di Karnaugh la rendono meccanica.", { widths: [6.6, 5.6], mono: [0], fs: 19, caption: "Quindici letterali diventano tre. Funziona, ma ogni passo richiede un'idea: vogliamo un metodo." }),
    T("Lo scopo della minimizzazione", [
      "Trovare, tra tutte le possibili forme a due livelli di tipo P, una forma elementare minima",
      "Porte in numero minore e più piccole significano costo più basso, meno consumo e un circuito più veloce",
      ["Mappe di Karnaugh: grafico, per sottocubi di area massima", ["pratico fino a quattro o cinque variabili"]],
      ["Metodo di Quine: algebrico", ["confronto sistematico dei termini"]],
      ["Metodo di McCluskey: tabellare", ["adatto a un programma; alla base degli strumenti odierni di sintesi logica"]],
    ], "Quine-McCluskey è esatto ma esponenziale; gli strumenti industriali usano euristiche (Espresso e discendenti). La parte di laboratorio del corso esercita le mappe di Karnaugh.", { big: "A + BC", label: "la forma minima della nostra F: due porte invece di sei" }),

    H("Mappe di Karnaugh", "La minimizzazione che si vede."),
    D("Mappe di Karnaugh: l'idea", (s, h) => {
      h.rows(s, [
        "Uno strumento grafico per semplificare le funzioni booleane",
        "Una funzione di n variabili si disegna su una griglia di 2^n celle: una cella per riga della tabella di verità",
        ["Le celle sono ordinate in modo che le vicine differiscano in una sola variabile", ["da qui l'ordine delle colonne 00, 01, 11, 10"]],
        "L'adiacenza grafica è adiacenza logica: due 1 adiacenti si fondono in una clausola con un letterale in meno",
        "Si raggruppano gli 1 in rettangoli di 1, 2, 4 o 8 celle, i più grandi possibile, finché ogni 1 è coperto",
      ], h.MX, h.TOP, 6.9, h.BOT - h.TOP);
      h.card(s, 7.9, h.TOP, h.W - h.MX - 7.9, h.BOT - h.TOP);
      h.kmap(s, 8.35, h.TOP + 0.9, 0.9, { rowVar: "A", colVar: "B C", rowLabels: ["0", "1"], colLabels: ["00", "01", "11", "10"], vals: [["m0", "m1", "m3", "m2"], ["m4", "m5", "m7", "m6"]] });
      h.tx(s, "La cella di ogni mintermine per tre variabili. Si noti che m3 viene prima di m2. Anche i bordi sinistro e destro sono adiacenti: la mappa si richiude.", { x: 8.2, y: h.TOP + 3.7, w: h.W - h.MX - 8.5, h: 1.3, fontSize: 14, italic: true, color: P.mute });
    }, "L'ordine 00, 01, 11, 10 è un codice Gray. Maurice Karnaugh, 1953. La presentazione originale suggeriva uno strumento online (edutecnica.it/apps/k/k.htm)."),
    D("Una mappa di due variabili", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.2, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.9, h.TOP + 0.7, 1.3, { rowVar: "A", colVar: "B", rowLabels: ["0", "1"], colLabels: ["0", "1"], vals: [[0, 1], [1, 1]], loops: [{ r: 1, c: 0, rs: 1, cs: 2, color: P.red }, { r: 0, c: 1, rs: 2, cs: 1, color: P.violet, inset: 0.05 }] });
      h.tx(s, "F = A + B", { x: h.MX, y: h.TOP + 4.25, w: 5.2, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Tabella di verità: F = 1 per AB = 01, 10 e 11",
        "Forma canonica: F = A'B + AB' + AB, sei letterali",
        ["Gruppo rosso: la riga A = 1", ["B cambia dentro il gruppo, quindi B sparisce: la clausola è A"]],
        ["Gruppo viola: la colonna B = 1", ["A cambia dentro il gruppo, quindi A sparisce: la clausola è B"]],
        "Una cella può appartenere a più gruppi: qui AB è usata due volte",
      ], 6.3, h.TOP, h.W - h.MX - 6.3, h.BOT - h.TOP);
    }, "Usare due volte un 1 è la legge di idempotenza: x + x = x. La funzione è semplicemente OR."),
    D("Una mappa di tre variabili: la nostra F", (s, h) => {
      h.card(s, h.MX, h.TOP, 6.0, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.55, h.TOP + 0.7, 1.1, { rowVar: "A", colVar: "B C", rowLabels: ["0", "1"], colLabels: ["00", "01", "11", "10"], vals: [[0, 0, 1, 0], [1, 1, 1, 1]], loops: [{ r: 1, c: 0, rs: 1, cs: 4, color: P.red }, { r: 0, c: 2, rs: 2, cs: 1, color: P.violet, inset: 0.05 }] });
      h.tx(s, "F = A + BC", { x: h.MX, y: h.TOP + 4.25, w: 6.0, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Si scrive un 1 nelle celle dei mintermini 3, 4, 5, 6 e 7",
        ["Gruppo rosso di quattro: l'intera riga A = 1", ["B e C cambiano entrambe: la clausola è A"]],
        ["Gruppo viola di due: la colonna BC = 11", ["A cambia: la clausola è BC"]],
        "Ogni 1 è coperto e nessun gruppo si può allargare",
        "Lo stesso risultato dell'algebra, trovato a occhio in pochi secondi",
      ], 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP);
    }, "Un gruppo di 2^k celle elimina k variabili. Si prendono sempre prima i gruppi più grandi, poi si copre ciò che resta."),
    D("Una mappa di quattro variabili", (s, h) => {
      const vals = [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];
      const cn = [{ r: 0, c: 0 }, { r: 0, c: 3 }, { r: 3, c: 0 }, { r: 3, c: 3 }].map((p) => ({ ...p, rs: 1, cs: 1, color: P.violet }));
      h.card(s, h.MX, h.TOP, 5.6, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.55, h.TOP + 0.15, 0.92, { rowVar: "A B", colVar: "C D", rowLabels: ["00", "01", "11", "10"], colLabels: ["00", "01", "11", "10"], vals, loops: [{ r: 1, c: 1, rs: 2, cs: 2, color: P.red }, ...cn] });
      h.tx(s, "F = BD + B'D'", { x: h.MX, y: h.TOP + 4.63, w: 5.6, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "F = somma di m(0, 2, 5, 7, 8, 10, 13, 15): otto mintermini, trentadue letterali",
        ["Gruppo rosso di quattro al centro", ["B = 1 e D = 1 in tutto il gruppo: la clausola è BD"]],
        ["Viola: i quattro angoli sono un solo gruppo", ["la mappa si richiude in orizzontale e in verticale: B = 0 e D = 0, la clausola è B'D'"]],
        "Risultato: quattro letterali, e forse la riconoscete: F è lo XNOR di B e D",
      ], 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
    }, "Slide nuova. Si pensi alla mappa come disegnata su un toro: il bordo superiore tocca quello inferiore e il sinistro tocca il destro."),
    T("Condizioni di indifferenza", [
      "A volte una combinazione di ingressi non può mai presentarsi, oppure quando si presenta l'uscita non importa",
      ["Esempio: una cifra in decimale codificato in binario usa le configurazioni da 0000 a 1001", ["le sei configurazioni da 1010 a 1111 non compaiono mai"]],
      "Quelle celle si segnano nella mappa con una x: indifferenza (don't care)",
      "Una x si può trattare come 1 quando allarga un gruppo, e come 0 altrimenti",
      "Più libertà significa gruppi più grandi e un circuito più economico",
    ], "Slide nuova. Tipico esercizio d'esame: il decodificatore per display a sette segmenti, dove ogni segmento è una funzione di quattro variabili con sei indifferenze.", { big: "x", label: "una cella il cui valore siamo liberi di scegliere, 0 o 1, a seconda di ciò che semplifica il circuito" }),

    H("Ritorno alla macchina", "Da un sommatore completo all'istruzione add."),
    D("Trentadue sommatori completi fanno una add", (s, h) => {
      const bw = 1.45, bh = 1.25, y = h.TOP + 1.0, xs = [10.6, 8.6, 6.6, 2.6], labs = ["0", "1", "2", "31"];
      xs.forEach((x, i) => {
        s.addText([{ text: "sommatore completo", options: { fontSize: 14, bold: true, breakLine: true } }, { text: "bit " + labs[i], options: { fontSize: 13 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x, y, w: bw, h: bh, fill: { color: i === 3 ? P.steel : P.teal }, line: { color: P.white, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 2 });
        h.arrow(s, x + 0.45, y - 0.65, x + 0.45, y - 0.03, P.mute, 1.75); h.arrow(s, x + 1.0, y - 0.65, x + 1.0, y - 0.03, P.mute, 1.75);
        h.tx(s, `A${labs[i]}`, { x: x + 0.1, y: y - 0.98, w: 0.7, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
        h.tx(s, `B${labs[i]}`, { x: x + 0.65, y: y - 0.98, w: 0.7, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
        h.arrow(s, x + bw / 2, y + bh + 0.03, x + bw / 2, y + bh + 0.6, P.mute, 1.75);
        h.tx(s, `S${labs[i]}`, { x: x + bw / 2 - 0.4, y: y + bh + 0.62, w: 0.8, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, align: "center" });
      });
      const cy = y + bh / 2;
      h.arrow(s, 12.65, cy, 12.08, cy, P.amber, 2.25); h.tx(s, "0", { x: 12.5, y: cy - 0.45, w: 0.35, h: 0.3, fontSize: 14, fontFace: h.MONO, bold: true, color: P.amber });
      h.arrow(s, 10.57, cy, 10.08, cy, P.amber, 2.25); h.arrow(s, 8.57, cy, 8.08, cy, P.amber, 2.25);
      h.arrow(s, 6.57, cy, 5.75, cy, P.amber, 2.25); h.tx(s, ". . .", { x: 4.75, y: cy - 0.25, w: 0.95, h: 0.5, fontSize: 22, bold: true, color: P.amber, align: "center", valign: "middle" });
      h.arrow(s, 4.7, cy, 4.08, cy, P.amber, 2.25); h.arrow(s, 2.57, cy, 1.75, cy, P.amber, 2.25);
      h.tx(s, "riporto\nuscente", { x: 0.75, y: cy - 0.35, w: 0.95, h: 0.7, fontSize: 13, bold: true, color: P.amber, align: "center", valign: "middle" });
      h.tx(s, "il riporto si propaga verso sinistra", { x: 4.15, y: cy + 0.3, w: 2.3, h: 0.3, fontSize: 12.5, italic: true, color: P.amber, align: "center" });
      h.rows(s, ["add t2, t0, t1 porta i due registri a trentadue sommatori completi, uno per posizione di bit",
        "Il riporto uscente di ogni posizione è il riporto entrante della successiva: un sommatore a propagazione del riporto",
        "sub usa lo stesso addizionatore: il secondo operando è complementato e il primo riporto entrante è 1 (Lezione 05)"], h.MX, 5.0, h.CW, 1.75);
    }, "Il riporto uscente dal bit 31 è l'overflow senza segno della Lezione 05, che RISC-V semplicemente scarta. I processori reali usano schemi di riporto più veloci (carry look-ahead), ma la funzione calcolata è la stessa."),
    K("Un sommatore completo, una porta per istruzione", `# a0 = A, a1 = B, a2 = Cin   (each 0 or 1)
# result: a3 = S, a4 = Cout

    xor  t0, a0, a1      # t0   = A xor B
    xor  a3, t0, a2      # S    = A xor B xor Cin
    and  t1, a0, a1      # t1   = A . B
    and  t2, t0, a2      # t2   = (A xor B) . Cin
    or   a4, t1, t2      # Cout = A . B + (A xor B) . Cin`, [
      "Cinque istruzioni, cinque porte: il programma è lo schema, letto da sinistra a destra",
      "Analisi: eseguitelo passo-passo in PRG32-QT e compilate la tabella di verità",
      "Sintesi: avete ricavato queste porte dalla tabella con il metodo di questa lezione",
      "Con registri interi in ingresso, le stesse righe lavorano su tutte e trentadue le posizioni di bit insieme",
    ], "Attività di laboratorio suggerita: un ciclo sulle otto combinazioni di ingresso che disegna i due bit di uscita come lampade, come nel laboratorio 06."),

    Q("Quante funzioni booleane distinte di tre variabili esistono?", ["8", "9", "64", "256"], 3, "2^(2^3) = 2^8 = 256."),
    Q("Quale mintermine di tre variabili A, B, C corrisponde alla riga 5 della tabella di verità?", ["A'BC'", "AB'C", "A + B' + C", "ABC'"], 1, "La riga 5 è 101: A = 1, B = 0, C = 1, quindi il mintermine è A B' C."),
    Q("In una mappa di Karnaugh, un gruppo rettangolare di quattro 1 adiacenti elimina:", ["una variabile", "due variabili", "tre variabili", "quattro variabili"], 1, "Un gruppo di 2^k celle elimina k variabili: quattro celle, due variabili."),
    Q("In un sommatore completo, il riporto uscente vale 1 quando:", ["esattamente un ingresso vale 1", "un numero dispari di ingressi vale 1", "almeno due ingressi valgono 1", "solo quando tutti e tre gli ingressi valgono 1"], 2, "Cout è la funzione di maggioranza: AB + Cin(A xor B) = AB + ACin + BCin. Un numero dispari di 1 descrive invece il bit di somma S."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Scrivete le forme canoniche P e S delle uscite S e Cout del sommatore completo",
      "Minimizzate Cout con una mappa di Karnaugh di tre variabili. Quante porte risparmiate?",
      "Minimizzate F = somma di m(0, 1, 2, 5, 8, 9, 10) con una mappa di quattro variabili",
      "Costruite NOT, AND e OR usando solo NAND, e verificate ciascuno con una tabella di verità",
      "Programmate il sommatore completo su PRG32 e mostrate S e Cout come lampade per le otto combinazioni di ingresso",
    ], "Su carta: Cout = AB + ACin + BCin. Su PRG32: otto coppie di lampade che riproducono la tabella di verità del sommatore completo.",
      "Esercizio 3: F = B'D' + B'C' + A'C'D (gli angoli; le coppie in alto a sinistra e in basso a sinistra con le loro vicine; m1 con m5). Esercizio 2: la forma canonica di Cout ha quattro mintermini (3, 5, 6, 7); la mappa dà tre clausole di due letterali."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["literal", "letterale", "canonical form", "forma canonica"],
      ["clause, product term", "clausola, termine prodotto", "sum of products (SOP)", "somma di prodotti (tipo P)"],
      ["factor, sum term", "fattore, termine somma", "product of sums (POS)", "prodotto di somme (tipo S)"],
      ["minterm / maxterm", "mintermine / maxtermine", "Karnaugh map", "mappa di Karnaugh"],
      ["half adder / full adder", "semisommatore / sommatore completo", "don't care", "condizione di indifferenza"],
      ["carry in / carry out", "riporto entrante / uscente", "ripple-carry adder", "sommatore a propagazione del riporto"],
    ], null, { widths: [3, 3.4, 2.9, 3.6] }),
    T("Conclusioni e letture", [
      "Una funzione booleana è una tabella di verità; una tabella di verità dà sempre un'espressione canonica",
      "La minimizzazione è il processo che ottimizza una rete logica per semplificarne la realizzazione",
      "Le mappe di Karnaugh trasformano l'algebra in una figura: si raggruppano gli 1, si leggono le clausole",
      "Il semisommatore e il sommatore completo sono i primi veri circuiti del corso",
      "Trentadue sommatori completi in fila sono ciò che esegue la add battuta nella prima lezione",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, appendice A", "Bucci: Architettura dei calcolatori elettronici, i capitoli sulle reti combinatorie", "Charles Petzold: Code, i capitoli sulle porte logiche e sulle macchine addizionatrici binarie"]],
    ], "Prossima lezione: l'elettronica, per vedere di che cosa sono fatte queste porte; poi le macchine combinatorie e sequenziali."),
  ],
});
