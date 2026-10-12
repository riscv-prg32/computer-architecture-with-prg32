// Italian version of decks/en/05-number-representation-integers.js: same slides, same listings, text in Italian.
// Lecture 05 - Number representation, part 1: bases, naturals, signed integers, overflow.
// Source: 03-Architettura_dei_Calcolatori-Rappresentazione_Numeri.pptx (translated, figures redrawn, RISC-V section added).
const G3 = require("../../lib/gates");

function wheelSvg() {
  const S = 500, c = S / 2, r1 = 140, r2 = 198, r0 = 92;
  let out = `<circle cx="${c}" cy="${c}" r="${r1 + 28}" fill="#EEF2F4"/><circle cx="${c}" cy="${c}" r="${r1 - 30}" fill="#fff"/>`;
  for (let k = 0; k < 16; k++) {
    const a = (k * 22.5 - 90) * Math.PI / 180, neg = k >= 8, v = neg ? k - 16 : k;
    const bx = c + r1 * Math.cos(a), by = c + r1 * Math.sin(a), vx = c + r2 * Math.cos(a), vy = c + r2 * Math.sin(a), ux = c + r0 * Math.cos(a), uy = c + r0 * Math.sin(a);
    out += G3.text(bx, by + 5, k.toString(2).padStart(4, "0"), { anchor: "middle", size: 17, fill: "#1B2530" });
    out += `<circle cx="${vx}" cy="${vy}" r="22" fill="${neg ? "#C7791B" : "#0E7C86"}"/>` + G3.text(vx, vy + 6, (v > 0 ? "+" : "") + v, { anchor: "middle", size: 18, fill: "#fff" });
    out += G3.text(ux, uy + 4, String(k), { anchor: "middle", size: 12, fill: "#5B6B78", bold: false });
  }
  const sep = (deg, col) => { const a = (deg - 90) * Math.PI / 180; return `<line x1="${c + 60 * Math.cos(a)}" y1="${c + 60 * Math.sin(a)}" x2="${c + 232 * Math.cos(a)}" y2="${c + 232 * Math.sin(a)}" stroke="${col}" stroke-width="3" stroke-dasharray="7 5"/>`; };
  out += sep(168.75, "#B23A48") + sep(-11.25, "#6B4FA0");
  out += G3.text(c, c - 8, "+1", { anchor: "middle", size: 22, fill: "#2E4A62" }) + G3.text(c, c + 16, "senso orario", { anchor: "middle", size: 13, fill: "#5B6B78", bold: false });
  out += G3.text(c - 6, S - 8, "overflow con segno", { anchor: "end", size: 13, fill: "#B23A48" }) + G3.text(c - 12, 16, "riporto senza segno", { anchor: "end", size: 13, fill: "#6B4FA0" });
  return G3.doc(S, S, out);
}

// A worked calculation: decimal on the left, binary on the right.
function calc(s, h, x, y, w, title, dec, bin, note, col) {
  const hh = 2.25;
  h.card(s, x, y, w, hh);
  h.tx(s, title, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.35, fontSize: 14, bold: true, color: col || P.steel });
  h.tx(s, dec.join("\n"), { x: x + 0.2, y: y + 0.5, w: w * 0.34, h: 1.2, fontSize: 16, fontFace: h.MONO, align: "right", color: P.mute });
  h.tx(s, bin.join("\n"), { x: x + w * 0.4, y: y + 0.5, w: w * 0.6 - 0.25, h: 1.2, fontSize: 16, fontFace: h.MONO, bold: true, align: "right" });
  if (note) h.tx(s, note, { x: x + 0.2, y: y + hh - 0.52, w: w - 0.4, h: 0.45, fontSize: 12.5, italic: true, color: col || P.mute, valign: "middle" });
}

Deck({
  n: "05", file: "05-Architettura_dei_Calcolatori-Rappresentazione_dei_Numeri_Interi",
  title: "Rappresentazione dei numeri: gli interi", short: "Rappresentazione dei numeri (interi)",
  sub: "Basi, numeri naturali, complemento a due e overflow",
  quote: ["Conterò poco, è vero: - diceva l'Uno ar Zero - ma tu che vali? Gnente: propio gnente.", "Trilussa, Nummeri, 1944"],
  cover: "lab2_step2_move.png",
  notes: "Spirale: la lezione si apre con il segnalino del laboratorio 06 del libro di PRG32 che va a sinistra oltre lo zero, e si chiude spiegandolo.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Convertire interi e frazioni tra le basi 2, 8, 10 e 16",
      "Dire quali numeri naturali stanno in n bit e riconoscere un overflow",
      "Codificare e decodificare interi con segno in segno e modulo e in complemento a due",
      "Sommare, sottrarre e cambiare segno in complemento a due, e rilevare l'overflow",
      "Spiegare perché 0 - 1 compare come 0xFFFFFFFF in un registro RISC-V",
      "Scegliere l'istruzione RISC-V giusta per dati con segno e senza segno",
    ]),

    H("Riscaldamento sulla macchina", "Un segnalino che esce dal bordo sinistro della retta dei numeri."),
    K("Tenete premuto LEFT e guardate il numero", `steer_update:
    ...
    call prg32_input_read      # a0 = button mask
    mv   t0, a0

    la   t1, marker_x
    lw   t2, 0(t1)             # t2 = marker_x, starts at 2
    andi t3, t0, BTN_LEFT      # is LEFT pressed?
    beqz t3, 1f
    addi t2, t2, -1            # one step to the left
1:  sw   t2, 0(t1)
    ...
# draw prints marker_x with prg32_console_hex32`, [
      "Tenete premuto LEFT: il valore mostrato fa 00000002, 00000001, 00000000 ...",
      "... e poi FFFFFFFF. È un bug?",
      "0xFFFFFFFF è il numero 4.294.967.295 oppure il numero -1?",
      "Entrambi. Dipende da come si leggono i bit: questa lezione dà le regole",
    ], "Adattato dal laboratorio 06-asm-state-and-input del libro di PRG32 (step2_move.S) con SPEED 1 e una stampa sulla console. Dove guardare: sulla scheda e in QEMU la console è disegnata sullo schermo, come 0x00000002 ... 0xffffffff; PRG32-QT non disegna la console, la raccoglie nel suo log, come 00000002 ... FFFFFFFF. Eseguirlo dal vivo prima di ogni teoria, e scrivere alla lavagna le ipotesi degli studenti."),

    H("Basi e conversioni"),
    G("Sistemi posizionali: basi 2, 8, 10 e 16", ["Base b", "Cifre", "Nome", "Tredici si scrive"], [
      ["2", "0, 1", "binaria", "1101"],
      ["8", "0, 1, ..., 7", "ottale", "15"],
      ["10", "0, 1, ..., 9", "decimale", "13"],
      ["16", "0, ..., 9, A, ..., F", "esadecimale", "D"],
    ], "Un numero N è una stringa di cifre d(n-1) ... d(1) d(0), ciascuna minore della base b. Il valore è la somma di ogni cifra per la potenza della base corrispondente alla sua posizione.", { widths: [1.6, 3.6, 3, 3.4], mono: [1, 3], fs: 22, caption: "N = d(n-1) x b^(n-1) + ... + d(1) x b + d(0), con ogni cifra compresa tra 0 e b - 1." }),
    D("Le basi potenze di due condividono gli stessi bit", (s, h) => {
      const x = 4.7, y = h.TOP + 0.35;
      h.tx(s, "127 in base 10", { x: h.MX, y: y - 0.05, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y, 0.62, [..."01111111"].map((b) => ({ val: b })), { h: 0.7, fs: 22 });
      h.tx(s, "gruppi di 4: esadecimale", { x: h.MX, y: y + 1.3, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y + 1.3, 2.48, [{ val: "0111 = 7", color: P.teal }, { val: "1111 = F", color: P.amber }], { h: 0.7, fs: 20 });
      h.tx(s, "= 0x7F", { x: x + 5.1, y: y + 1.3, w: 2.2, h: 0.7, fontSize: 24, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "gruppi di 3: ottale", { x: h.MX, y: y + 2.6, w: x - h.MX - 0.3, h: 0.7, fontSize: 18, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, y + 2.6, 1.24, [{ val: "01 = 1", color: P.violet }], { h: 0.7, fs: 18 });
      h.mem(s, x + 1.24, y + 2.6, 1.86, [{ val: "111 = 7", color: P.green }, { val: "111 = 7", color: P.red }], { h: 0.7, fs: 20 });
      h.tx(s, "= 177 ottale", { x: x + 5.1, y: y + 2.6, w: 3, h: 0.7, fontSize: 24, bold: true, fontFace: h.MONO, valign: "middle" });
      h.card(s, h.MX, 5.6, h.CW, 1.15, P.tealSoft);
      h.tx(s, "Se ogni cifra è scritta in binario puro, i bit di un numero sono gli stessi in ogni base b = 2^k: si raggruppano da destra, k alla volta. Esempio: 13 = 1101 in binario = 15 in ottale = D in esadecimale.", { x: h.MX + 0.3, y: 5.65, w: h.CW - 0.6, h: 1.05, fontSize: 16.5, valign: "middle" });
    }, "Si raggruppa da destra (dal lato meno significativo) e si completa con zeri a sinistra."),
    D("Convertire un intero: divisioni successive", (s, h) => {
      h.tx(s, "Si divide N per la base r; il resto è la cifra successiva, a partire dalla meno significativa. Si ripete sul quoziente finché non diventa zero.", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.7, fontSize: 17, valign: "middle" });
      const y = h.TOP + 1.05, t = (x, title, head, rowsv, res, w) => {
        h.tx(s, title, { x, y: y - 0.38, w: w * 3, h: 0.34, fontSize: 15, bold: true, color: P.steel });
        h.table(s, x, y, [w, w, w], head, rowsv, { fs: 16, mono: [0, 1, 2], align: "center", bold0: false });
        h.tx(s, res, { x, y: y + 0.36 * (rowsv.length + 1) + 0.12, w: w * 3 + 0.6, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      };
      t(h.MX, "r = 8", ["N", "N / 8", "N mod 8"], [["127", "15", "7"], ["15", "1", "7"], ["1", "0", "1"]], "127 = 177 ottale", 1.1);
      t(h.MX + 4.2, "r = 16", ["N", "N / 16", "N mod 16"], [["127", "7", "15 = F"], ["7", "0", "7"]], "127 = 0x7F", 1.15);
      t(h.MX + 8.45, "r = 2", ["N", "N / 2", "N mod 2"], [["127", "63", "1"], ["63", "31", "1"], ["31", "15", "1"], ["15", "7", "1"], ["7", "3", "1"], ["3", "1", "1"], ["1", "0", "1"]], "127 = 1111111", 1.1);
      h.card(s, h.MX, 5.3, 7.9, 1.45, P.amberSoft);
      h.tx(s, "I resti si leggono dal basso verso l'alto: l'ultimo resto è la cifra più significativa. Il metodo discende da N = Q x r + R, applicata più volte al quoziente.", { x: h.MX + 0.25, y: 5.35, w: 7.4, h: 1.35, fontSize: 16, valign: "middle" });
    }, "N = Q(n) r^(n+1) + R(n) r^n + ... + R(1) r + R(0). In C le due operazioni sono / e %; in RISC-V (estensione M) sono divu e remu."),
    D("Convertire una frazione: moltiplicazioni successive", (s, h) => {
      h.tx(s, "Per 0 <= N < 1 si moltiplica per la base r: la parte intera del prodotto è la cifra successiva, a partire dalla più significativa. Si ripete sulla parte frazionaria.", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.7, fontSize: 17, valign: "middle" });
      const y = h.TOP + 1.1, w = [2.1, 1.7, 1.7];
      h.tx(s, "0,875 in base 2: esatto", { x: h.MX, y: y - 0.38, w: 5.5, h: 0.34, fontSize: 15, bold: true, color: P.steel });
      h.table(s, h.MX, y, w, ["Prodotto", "Frazione", "Cifra"], [["0,875 x 2", "0,75", "1"], ["0,75 x 2", "0,5", "1"], ["0,5 x 2", "0", "1"]], { fs: 16, mono: [0, 1, 2], align: "center", bold0: false });
      h.tx(s, "0,875 = 0,111 in binario", { x: h.MX, y: y + 1.65, w: 5.5, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      const x2 = h.MX + 6.6;
      h.tx(s, "0,8 in base 2: periodico", { x: x2, y: y - 0.38, w: 5.5, h: 0.34, fontSize: 15, bold: true, color: P.steel });
      h.table(s, x2, y, w, ["Prodotto", "Frazione", "Cifra"], [["0,8 x 2", "0,6", "1"], ["0,6 x 2", "0,2", "1"], ["0,2 x 2", "0,4", "0"], ["0,4 x 2", "0,8", "0"], ["0,8 x 2", "0,6", "1 ..."]], { fs: 16, mono: [0, 1, 2], align: "center", bold0: false, hi: { 4: P.amberSoft } });
      h.tx(s, "0,8 = 0,1100 1100 1100 ...", { x: x2, y: y + 2.38, w: 5.5, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      h.card(s, h.MX, 5.55, h.CW, 1.2, P.redSoft);
      h.tx(s, "Una frazione finita in base 10 può essere periodica in base 2. Con un numero finito di bit va troncata: da qui nascono gli errori di approssimazione dei numeri reali (Lezione 06).", { x: h.MX + 0.3, y: 5.6, w: h.CW - 0.6, h: 1.1, fontSize: 16.5, valign: "middle" });
    }, "N = R(1) r^-1 + R(2) r^-2 + ... Le slide originali rimandavano a due convertitori online (fermimn.edu.it e fauser.edu); qualunque calcolatrice moderna in modalità programmatore fa lo stesso."),

    H("Numeri naturali e overflow"),
    T("Strategie di codifica", [
      "Una rappresentazione è una legge X = R(x) che associa a un numero x una stringa di bit X",
      "Il numero di bit dipende da quanti numeri si vogliono rappresentare: di solito un multiplo di 8, tipicamente 16, 32 o 64",
      "R si sceglie in base al tipo di numeri: naturali, interi con segno, razionali",
      "Una buona R rende operazioni aritmetiche e confronti semplici da realizzare come circuiti",
    ], null, { big: "X = R(x)", label: "x è il numero che intendiamo; X è la configurazione di bit memorizzata nel registro" }),
    D("Numeri naturali su n bit", (s, h) => {
      h.rows(s, ["Con n bit ci sono 2^n configurazioni: i naturali da 0 a 2^n - 1",
        "A ogni numero è associata la stringa di bit che lo rappresenta nel sistema posizionale binario"], h.MX, h.TOP, h.CW, 1.35);
      const cw = h.CW / 16, y = 3.85;
      h.tx(s, "Esempio: n = 4, intervallo [0, 15]", { x: h.MX, y: y - 0.75, w: h.CW, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      h.mem(s, h.MX, y, cw, Array.from({ length: 16 }, (_, i) => ({ val: i.toString(2).padStart(4, "0"), label: String(i) })), { h: 0.7, fs: 13.5, labelFs: 16 });
      h.table(s, h.MX, 5.2, [3, 3, 3, 3.133], ["Bit", "Intervallo", "RISC-V", "Massimo"], [["8", "0 ... 2^8 - 1", "byte (lbu)", "255"], ["16", "0 ... 2^16 - 1", "halfword (lhu)", "65.535"], ["32", "0 ... 2^32 - 1", "word, registro", "4.294.967.295"]], { fs: 15, mono: [1] });
    }, "4.294.967.295 è la lettura senza segno di 0xFFFFFFFF: la prima metà della risposta al riscaldamento."),
    T("Proprietà delle stringhe binarie", [
      ["L'estensione a sinistra con zeri non cambia il valore", ["5 = 101 = 00101"]],
      ["Moltiplicare per 2^k è uno scorrimento a sinistra di k posizioni", ["00101 x 2 = 01010: cinque diventa dieci"]],
      ["La divisione intera per 2^k è uno scorrimento a destra di k posizioni", ["00101 / 2 = 00010: cinque diventa due, il resto si perde"]],
      "Gli scorrimenti costano molto meno delle moltiplicazioni: i compilatori li usano ogni volta che possono",
    ], "Nella Lezione 04 avete usato slli t1, t1, 2 per moltiplicare per quattro l'indice di un vettore. Gli scorrimenti sono anche la base dell'aritmetica in virgola fissa (Lezione 06).", { code: "# multiply by 4\nslli t0, t0, 2\n\n# divide by 2 (unsigned)\nsrli t0, t0, 1\n\n# x * 10 = x*8 + x*2\nslli t1, t0, 3\nslli t2, t0, 1\nadd  t0, t1, t2", wide: true, h: 3.9 }),
    DEF("Overflow", "Definizione", "Si ha overflow quando il risultato di un'operazione non è contenuto nel sottoinsieme finito di numeri che i bit disponibili possono rappresentare.", [
      "I registri hanno dimensione finita e sono in numero finito",
      "Gli insiemi numerici sono infiniti: se ne può rappresentare solo un sottoinsieme finito",
      "Gli operatori aritmetici sono chiusi sull'insieme intero, non sul sottoinsieme finito",
      "Con 7 bit si codifica [0, 127]: 100 e 38 sono rappresentabili, la loro somma 138 no",
    ]),
    D("Aritmetica su quattro bit", (s, h) => {
      const w = (h.CW - 0.9) / 4, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Somma", ["6 +", "8 =", "14"], ["0110 +", "1000 =", "1110"], "sta in quattro bit");
      calc(s, h, h.MX + (w + 0.3), y, w, "Somma con overflow", ["14 +", "3 =", "17"], ["1110 +", "0011 =", "1 0001"], "serve un quinto bit", P.red);
      calc(s, h, h.MX + 2 * (w + 0.3), y, w, "Differenza", ["11 -", "5 =", "6"], ["1011 -", "0101 =", "0110"], "prestito come in decimale");
      calc(s, h, h.MX + 3 * (w + 0.3), y, w, "Prodotto", ["5 x", "3 =", "15"], ["0101 x", "0011 =", "000 1111"], "n x n bit danno fino a 2n bit");
      h.rows(s, ["L'aritmetica binaria segue le stesse regole colonna per colonna di quella decimale: 1 + 1 = 0 con riporto di 1",
        "Un processore segnala un riporto perduto in modi diversi: molti hanno un flag di carry, RISC-V lo fa calcolare con un confronto",
        "Un prodotto richiede il doppio dei bit: su RV32 mul dà i 32 bit bassi e mulhu i 32 alti"], h.MX, 4.15, h.CW, 2.6);
    }, "La slide originale diceva che l'overflow «si può rilevare mediante il bit di overflow»: vero per i processori con registro dei flag, non per RISC-V. Si veda l'ultima sezione."),

    H("Interi con segno", "Tre modi di scrivere un segno meno con i bit."),
    T("Segno e modulo", [
      "Il bit più significativo è il segno (1 = negativo); gli altri n - 1 bit sono il modulo",
      "Intervallo: da -(2^(n-1) - 1) a +(2^(n-1) - 1)",
      "Lo zero ha due rappresentazioni, +0 e -0: si rappresentano solo 2^n - 1 numeri",
      ["L'aritmetica deve lavorare separatamente su segno e modulo", ["per sommare due numeri di segno opposto si trova il modulo maggiore e gli si sottrae il minore", "il risultato prende il segno dell'operando di modulo maggiore"]],
    ], "Semplice per le persone, scomodo per i circuiti. Sopravvive nella mantissa dei numeri in virgola mobile IEEE 754 (Lezione 06).", { big: "X = |x| + 2^(n-1) s", label: "la legge di codifica, con s = 1 se x è negativo e 0 altrimenti. Su quattro bit: X = |x| + 8 s" }),
    T("Complemento a due", [
      "I numeri non negativi, 0 <= x < 2^(n-1), sono rappresentati da se stessi: X = x",
      "I numeri negativi, -2^(n-1) <= x < 0, sono rappresentati da X = 2^n - |x|",
      "Intervallo: da -2^(n-1) a +2^(n-1) - 1; lo zero ha una sola rappresentazione",
      "Il bit più significativo vale 1 se e solo se il numero è negativo",
      "È la rappresentazione usata da ogni processore moderno, RISC-V compreso",
    ], "Detto anche complemento alla base. L'asimmetria dell'intervallo (un negativo in più) ha una conseguenza: cambiare segno al numero più negativo dà overflow.", { big: "-2^31 ... 2^31 - 1", label: "l'intervallo di un registro RISC-V a 32 bit letto come intero con segno: da circa meno due miliardi a più due miliardi" }),
    D("Quattro bit, tre letture", (s, h) => {
      const rd = (k) => { const b = k.toString(2).padStart(4, "0"), sm = (k >= 8 ? "-" : "+") + (k & 7), tc = k >= 8 ? String(k - 16) : k ? "+" + k : "0"; return [b, String(k), sm, tc]; };
      const w = [1.15, 1.25, 1.7, 1.7], tw = 5.8, head = ["Bit", "Senza segno", "Segno e modulo", "Compl. a due"];
      h.table(s, h.MX, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i)), { fs: 16, mono: [0], align: "center", rowH: 0.42 });
      h.table(s, h.W - h.MX - tw, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i + 8)), { fs: 16, mono: [0], align: "center", rowH: 0.42, hi: { 0: P.amberSoft, 7: P.tealSoft } });
      h.tx(s, "non negativi: le tre letture coincidono", { x: h.MX, y: 5.5, w: tw, h: 0.35, fontSize: 14, italic: true, color: P.teal, align: "center" });
      h.tx(s, "bit più significativo a 1: le letture differiscono", { x: h.W - h.MX - tw, y: 5.5, w: tw, h: 0.35, fontSize: 14, italic: true, color: P.amber, align: "center" });
      h.card(s, h.MX, 6.0, h.CW, 0.75, P.tealSoft);
      h.tx(s, "I bit non dicono quale colonna è quella giusta. Lo dice il programma, scegliendo le istruzioni.", { x: h.MX + 0.3, y: 6.0, w: h.CW - 0.6, h: 0.75, fontSize: 17, valign: "middle" });
    }, "Evidenziati: 1000 è meno zero in segno e modulo ma -8 in complemento a due; 1111 è -7 oppure -1. Complemento a uno ed eccesso 8 si aggiungono a questa tabella nella Lezione 06."),
    D("La ruota dei numeri", async (s, h) => {
      await h.svg(s, wheelSvg(), h.MX - 0.15, h.TOP - 0.2, 5.75, h.BOT - h.TOP + 0.35);
      h.rows(s, [
        "Con n bit l'aritmetica è modulo 2^n: la retta dei numeri si chiude in un cerchio",
        "Sommare 1 sposta di un passo in senso orario, qualunque sia la lettura",
        ["Lettura senza segno: la ruota si spezza tra 1111 e 0000", ["attraversare quel punto è un riporto: 15 + 1 = 0"]],
        ["Lettura in complemento a due: la ruota si spezza tra 0111 e 1000", ["attraversare quel punto è un overflow con segno: 7 + 1 = -8"]],
        "Un passo indietro da 0000 porta a 1111: ecco perché 0 - 1 dà tutti uni",
      ], 6.5, h.TOP, h.W - h.MX - 6.5, h.BOT - h.TOP);
    }, "Anello interno: valore senza segno. In mezzo: i bit. Dischi esterni: valore in complemento a due. Lo stesso addizionatore serve entrambe le letture: cambia solo il punto in cui la ruota «si spezza»."),
    D("Aritmetica in complemento a due", (s, h) => {
      const w = (h.CW - 0.6) / 3, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Segni opposti", ["2 +", "-6 =", "-4"], ["0010 +", "1010 =", "1100"], "basta sommare le configurazioni");
      calc(s, h, h.MX + (w + 0.3), y, w, "Due negativi", ["-2 +", "-3 =", "-5"], ["1110 +", "1101 =", "1 1011"], "il riporto uscente si ignora (somma modulo 16)");
      calc(s, h, h.MX + 2 * (w + 0.3), y, w, "Prodotto", ["2 x", "-3 =", "-6"], ["0010 x", "1101 =", "001 1010"], "si tengono i quattro bit bassi: 1010 = -6");
      h.rows(s, ["La somma non ha bisogno di conoscere i segni: l'addizionatore dei numeri naturali dà già la risposta giusta",
        "Il riporto uscente dal bit più significativo viene semplicemente scartato",
        "Anche gli n bit bassi di un prodotto sono corretti, quali che siano i segni"], h.MX, 4.15, h.CW, 2.6);
    }, "Verifica del prodotto: 2 x 13 = 26 = 1 1010; i quattro bit bassi sono 1010, che si legge -6. Per questo RISC-V ha una sola mul per operandi con e senza segno."),
    T("Cambiare segno a un numero", [
      "Per definizione -x è rappresentato da 2^n - x",
      ["Metodo 1: si complementa ogni bit, poi si somma 1", ["6 = 0110, complemento 1001, più uno: 1010 = -6"]],
      ["Metodo 2: da destra, si copiano i bit fino al primo 1 compreso e si complementano tutti gli altri", ["5 = 0101 dà 1011 = -5; 1 = 0001 dà 1111 = -1"]],
      "Cambiando segno due volte si torna al numero di partenza, con un'eccezione: il numero più negativo non ha un compagno positivo",
    ], "Perché il metodo 1 funziona: il complemento di x è (2^n - 1) - x, quindi sommando 1 si ottiene 2^n - x. La slide originale descriveva il metodo 2 «da sinistra»; la regola scorre da destra.", { code: "# neg t0, t1 is a pseudo-instruction:\nsub  t0, zero, t1\n\n# the same thing by hand:\nnot  t0, t1        # complement\naddi t0, t0, 1     # plus one", wide: true, h: 2.7 }),
    B("La sottrazione è un'addizione.", "y - x = y + (2^n - x), modulo 2^n. Un addizionatore e un complementatore sono gli unici componenti necessari per realizzare addizione, sottrazione, moltiplicazione e divisione.",
      "È la ragione ingegneristica del complemento a due: un solo circuito, l'addizionatore della Lezione 09, fa tutto il lavoro. Nel datapath di RISC-V, sub è add con il secondo operando complementato e un riporto entrante pari a 1."),
    D("Rilevare l'overflow", (s, h) => {
      const w = (h.CW - 0.4) / 2, y = h.TOP + 0.05;
      calc(s, h, h.MX, y, w, "Senza segno, 8 bit", ["128 +", "130 =", "258"], ["1000 0000 +", "1000 0010 =", "1 0000 0010"], "riporto uscente: il registro contiene 2, la somma modulo 256", P.violet);
      calc(s, h, h.MX + w + 0.4, y, w, "Con segno, 8 bit", ["127 +", "127 =", "254"], ["0111 1111 +", "0111 1111 =", "1111 1110"], "nessun riporto uscente, ma il risultato si legge -2", P.red);
      h.rows(s, [
        "Overflow senza segno: c'è un riporto uscente dal bit più significativo",
        ["Overflow con segno in complemento a due", ["due operandi positivi danno una somma negativa", "due operandi negativi danno una somma positiva"]],
        "La somma di due numeri di segno opposto non può mai dare overflow",
        "Le due condizioni sono indipendenti: la stessa somma può farne scattare una, entrambe o nessuna",
      ], h.MX, 4.15, h.CW, 2.6);
    }, "Regola circuitale equivalente per l'overflow con segno: il riporto entrante nel bit più significativo è diverso da quello uscente."),

    H("Ritorno alla macchina", "Le stesse regole, come le realizza RISC-V."),
    T("Il riscaldamento, spiegato", [
      "marker_x valeva 0; addi t2, t2, -1 ha fatto un passo indietro su una ruota con 2^32 posizioni",
      "Il registro contiene ora trentadue uni: 0xFFFFFFFF",
      ["Letto senza segno vale 4.294.967.295; letto in complemento a due vale -1", ["l'addizionatore ha fatto la stessa cosa nei due casi"]],
      "prg32_console_hex32 stampa la configurazione, non un'interpretazione: non è né giusta né sbagliata",
      "Il segnalino scompare perché a prg32_gfx_rect si chiede di disegnare a una x enorme, oppure a -1: in ogni caso fuori schermo",
    ], "Non è un bug del processore: è una decisione che manca nel programma. La correzione è nelle prossime slide.", { img: "lab2_step2_move.png", cap: "Laboratorio 06, passo 2: sette lampade per i bit dei pulsanti e un segnalino" }),
    G("Con segno o senza? Si sceglie con l'istruzione", ["Operazione", "Con segno", "Senza segno", "Perché differiscono"], [
      ["somma, sottrazione", "add, addi, sub", "le stesse", "complemento a due: un addizionatore per entrambe"],
      ["prodotto (parola bassa)", "mul", "la stessa", "i 32 bit bassi non dipendono dal segno"],
      ["confronto", "slt, slti", "sltu, sltiu", "0xFFFFFFFF è minore di 0? sì, se con segno"],
      ["salto condizionato", "blt, bge", "bltu, bgeu", "la stessa domanda, come salto"],
      ["scorrimento a destra", "sra, srai", "srl, srli", "copia il bit di segno, oppure inserisce zeri"],
      ["caricamento di un byte", "lb", "lbu", "estensione del segno o estensione con zeri"],
      ["divisione, resto", "div, rem", "divu, remu", "i moduli si leggono in modo diverso"],
    ], "I registri RISC-V non hanno tipo. Gli stessi 32 bit sono con segno o senza segno solo agli occhi dell'istruzione che li legge.", { widths: [2.6, 2.4, 2.4, 4.8], mono: [1, 2] }),
    K("Tenere il segnalino sullo schermo", `    andi t3, t0, BTN_LEFT
    beqz t3, 1f
    addi t2, t2, -SPEED
1:  andi t3, t0, BTN_RIGHT
    beqz t3, 2f
    addi t2, t2, SPEED
2:
    bgez t2, 3f            # x < 0 ?  clamp to 0
    li   t2, 0
3:  li   t3, MAX_X         # .equ MAX_X, 304
    ble  t2, t3, 4f        # x > 304 ?  clamp to 304
    mv   t2, t3
4:
    sw   t2, 0(t1)         # one store, after all adjustments`, [
      "bgez legge t2 come numero con segno: ne esamina il bit di segno",
      "Anche ble è un confronto con segno: -1 è minore di 304. Con bleu, 0xFFFFFFFF sarebbe molto maggiore",
      "Un gioco non rileva l'overflow a cose fatte: tiene i valori in un intervallo in cui l'overflow non può avvenire",
      "-SPEED è un immediato: dodici bit in complemento a due, da -2048 a +2047",
    ], "Sorgente: laboratorio 06-asm-state-and-input del libro di PRG32, step3_clamp.S. Chiedere che cosa accade con bgeu o bltu al loro posto: un bug istruttivo da provare."),
    K("Rilevare l'overflow senza flag", `# unsigned: did the sum wrap around?
    add  t2, t0, t1        # t2 = t0 + t1   (modulo 2^32)
    sltu t3, t2, t0        # t3 = 1 if the sum is smaller than
                           #        an operand: a carry was lost

# signed: did the sign come out wrong?
    add  t2, t0, t1
    slti t3, t1, 0         # t3 = 1 if t1 is negative
    slt  t4, t2, t0        # t4 = 1 if the sum is less than t0
    bne  t3, t4, overflow  # they must agree`, [
      "RISC-V non ha flag di carry né di overflow: meno stati nascosti, un processore più semplice",
      "Senza segno: una somma che ha fatto il giro è sempre minore di ciascun operando",
      "Con segno: sommare un negativo deve rendere la somma minore; sommare un non negativo no",
    ], "Entrambi gli idiomi sono quelli suggeriti nella specifica RISC-V. Confrontare con la ruota: sltu rileva l'attraversamento in alto, il test con segno quello in basso."),
    D("Estensione del segno: lo stesso numero su più bit", (s, h) => {
      const x = 4.6, row = (y, label, cells, res) => {
        h.tx(s, label, { x: h.MX, y, w: x - h.MX - 0.3, h: 0.62, fontSize: 16, bold: true, align: "right", valign: "middle" });
        h.mem(s, x, y, 0.95, cells, { h: 0.62, fs: 17 });
        h.tx(s, res, { x: x + cells.length * 0.95 + 0.25, y, w: 3, h: 0.62, fontSize: 18, bold: true, fontFace: h.MONO, valign: "middle" });
      };
      row(h.TOP + 0.15, "-1 su 4 bit", [{ val: "1111", color: P.amber }], "= -1");
      row(h.TOP + 1.0, "-1 su 8 bit", [{ val: "1111", color: P.red }, { val: "1111", color: P.amber }], "= -1");
      row(h.TOP + 1.85, "+5 su 4 bit", [{ val: "0101", color: P.teal }], "= +5");
      row(h.TOP + 2.7, "+5 su 8 bit", [{ val: "0000", color: P.steel }, { val: "0101", color: P.teal }], "= +5");
      h.rows(s, ["Per allargare un numero in complemento a due si copia il suo bit di segno in tutte le nuove posizioni a sinistra",
        "addi t2, t2, -1 memorizza -1 in dodici bit; il processore ne estende il segno a trentadue prima di sommare",
        "lb estende il segno del byte che carica; lbu riempie di zeri: si sceglie in base a ciò che il byte significa"], h.MX, 5.05, h.CW, 1.7);
    }, "Estendere con zeri trasformerebbe 1111 (-1) in 0000 1111 (+15). L'estensione del segno è la controparte con segno della proprietà di «estensione a sinistra» vista per i naturali."),

    Q("Quale numero rappresenta in complemento a due la configurazione di 8 bit 1111 1100?", ["252", "-4", "-3", "-124"], 1, "Si complementa e si somma uno: 0000 0011 + 1 = 0000 0100 = 4, quindi la configurazione vale -4. (252 è la sua lettura senza segno.)"),
    Q("Su 8 bit, quale somma produce un overflow con segno?", ["100 + 27", "100 + 28", "-100 + 28", "-1 + 1"], 1, "L'intervallo è [-128, 127]. 100 + 27 = 127 ci sta; 100 + 28 = 128 no: due positivi danno una configurazione negativa (1000 0000 = -128)."),
    Q("t0 contiene 0xFFFFFFFF e t1 contiene 1. Dopo slt t2, t0, t1 e sltu t3, t0, t1:", ["t2 = 1, t3 = 1", "t2 = 0, t3 = 0", "t2 = 1, t3 = 0", "t2 = 0, t3 = 1"], 2, "Con segno: -1 < 1 è vero, quindi t2 = 1. Senza segno: 4.294.967.295 < 1 è falso, quindi t3 = 0."),
    Q("Come si scrive 0,625 in binario?", ["0,101", "0,110", "0,625", "0,011"], 0, "0,625 x 2 = 1,25 (1); 0,25 x 2 = 0,5 (0); 0,5 x 2 = 1,0 (1): 0,101 = 1/2 + 1/8."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Convertite 2026 in binario, ottale ed esadecimale; convertite 0,1 in binario fino a otto bit frazionari",
      "Scrivete -100 su 8 bit in segno e modulo e in complemento a due",
      "Calcolate su 8 bit in complemento a due: 90 + 60, -90 - 60, 90 - 60. Quali danno overflow?",
      "Nel codice del clamp sostituite bgez e ble con le versioni senza segno, prevedete il comportamento, poi eseguite",
      "Scrivete una update che somma 0x10000000 a un contatore a ogni frame e accende un rettangolo rosso quando la somma con segno dà overflow",
    ], "Su carta: 2026 = 0x7EA = 111 1110 1010. Su PRG32: il rettangolo rosso lampeggia una volta ogni sedici frame, quando il contatore passa da 0x7... a 0x8...",
      "2026 = 3752 ottale. -100: segno e modulo 1110 0100, complemento a due 1001 1100. 90 + 60 = 150 dà overflow; -90 - 60 = -150 dà overflow; 90 - 60 = 30 no. 0,1 = 0,00011001(1001...)."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["base (radix)", "base", "two's complement", "complemento a due (alla base)"],
      ["natural number", "numero naturale", "sign and magnitude", "segno e modulo"],
      ["signed integer", "numero relativo (intero con segno)", "overflow", "overflow (traboccamento)"],
      ["most significant bit", "bit più significativo", "carry / borrow", "riporto / prestito"],
      ["remainder", "resto", "sign extension", "estensione del segno"],
      ["shift", "scorrimento (shift)", "to clamp", "limitare a un intervallo"],
    ], null, { widths: [3.2, 3.4, 2.8, 3.4] }),
    T("Conclusioni e letture", [
      "Ogni base ha i suoi vantaggi: la base 2 per i circuiti, la base 16 per le persone che leggono i bit",
      "n bit rappresentano 2^n numeri: quali, dipende dalla legge di codifica",
      "Il complemento a due trasforma la sottrazione in addizione: un addizionatore fa tutto",
      "L'overflow è il prezzo dei registri finiti: lo si rileva, oppure lo si esclude per progetto",
      "In RISC-V i bit non hanno tipo: è l'istruzione a scegliere tra con segno e senza segno",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 2.4 e 3.1-3.2", "Playing with RISC-V, capitolo 6: State and Input", "Stallings: Computer Organization and Architecture, i capitoli sui sistemi di numerazione e sull'aritmetica del calcolatore"]],
    ], "Prossima lezione: complemento a uno, eccesso k, virgola fissa e virgola mobile IEEE 754."),
  ],
});
