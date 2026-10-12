// Italian version of decks/en/06-number-representation-reals.js: same slides, same listings, text in Italian.
// Lecture 06 - Number representation, part 2: one's complement, excess-k, fixed point, IEEE 754.
// Source: 04-Architettura_dei_Calcolatori-Rappresentazione_Numeri.pptx (translated, figures redrawn, fixed point and RISC-V added).
const G4 = require("../../lib/gates");

function lineSvg() {
  const W = 1000, H = 230, y = 110, seg = (x1, x2, col) => `<rect x="${x1}" y="${y - 16}" width="${x2 - x1}" height="32" fill="${col}"/>`;
  const tick = (x, top, bot) => `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y + 26}" stroke="#1B2530" stroke-width="2"/>` +
    G4.text(x, y - 36, top, { anchor: "middle", size: 15 }) + (bot ? G4.text(x, y + 48, bot, { anchor: "middle", size: 13, bold: false, fill: "#5B6B78" }) : "");
  return G4.doc(W, H, seg(20, 150, "#B23A48") + seg(150, 380, "#0E7C86") + seg(380, 620, "#C7791B") + seg(620, 850, "#0E7C86") + seg(850, 980, "#B23A48") +
    tick(150, "-9,999 x 10^99") + tick(380, "-1,000 x 10^-99") + tick(500, "0") + tick(620, "+1,000 x 10^-99") + tick(850, "+9,999 x 10^99") +
    G4.text(85, y + 6, "overflow", { anchor: "middle", size: 15, fill: "#fff" }) + G4.text(915, y + 6, "overflow", { anchor: "middle", size: 15, fill: "#fff" }) +
    G4.text(265, y + 6, "rappresentabile", { anchor: "middle", size: 15, fill: "#fff" }) + G4.text(735, y + 6, "rappresentabile", { anchor: "middle", size: 15, fill: "#fff" }) +
    G4.text(500, y + 70, "underflow: troppo vicino a zero", { anchor: "middle", size: 15, fill: "#C7791B" }) +
    `<polygon points="10,${y} 22,${y - 8} 22,${y + 8}" fill="#B23A48"/><polygon points="990,${y} 978,${y - 8} 978,${y + 8}" fill="#B23A48"/>`);
}

function calc4(s, h, x, y, w, title, dec, bin, note, col) {
  const hh = 2.45;
  h.card(s, x, y, w, hh);
  h.tx(s, title, { x: x + 0.2, y: y + 0.1, w: w - 0.4, h: 0.35, fontSize: 14, bold: true, color: col || P.steel });
  h.tx(s, dec.join("\n"), { x: x + 0.2, y: y + 0.5, w: w * 0.3, h: 1.4, fontSize: 15, fontFace: h.MONO, align: "right", color: P.mute });
  h.tx(s, bin.join("\n"), { x: x + w * 0.36, y: y + 0.5, w: w * 0.64 - 0.25, h: 1.4, fontSize: 15, fontFace: h.MONO, bold: true, align: "right" });
  if (note) h.tx(s, note, { x: x + 0.2, y: y + hh - 0.5, w: w - 0.4, h: 0.45, fontSize: 12.5, italic: true, color: col || P.mute, valign: "middle" });
}

Deck({
  n: "06", file: "06-Architettura_dei_Calcolatori-Rappresentazione_dei_Numeri_Reali",
  title: "Rappresentazione dei numeri: i reali", short: "Rappresentazione dei numeri (reali)",
  sub: "Complemento a uno, eccesso k, virgola fissa e virgola mobile IEEE 754",
  quote: ["Conterò poco, è vero: - diceva l'Uno ar Zero - ma tu che vali? Gnente: propio gnente.", "Trilussa, Nummeri, 1944"],
  cover: "game_raycaster.png",
  notes: "Spirale: la lezione si apre con una palla che deve muoversi di meno di un pixel per frame su un processore senza unità in virgola mobile. La virgola fissa risolve il problema; la virgola mobile viene poi presentata come risposta generale, con IEEE 754.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Codificare interi con segno in complemento a uno e in eccesso k, e dire a che cosa serve ciascuno",
      "Rappresentare una grandezza frazionaria in virgola fissa e calcolarci con istruzioni intere",
      "Spiegare mantissa, esponente e normalizzazione nella virgola mobile",
      "Codificare e decodificare un numero in IEEE 754 a singola precisione",
      "Riconoscere zero, numeri denormalizzati, infinito e NaN",
      "Dire perché l'ESP32-C6 non ha istruzioni in virgola mobile e che cosa fanno invece i giochi PRG32",
    ]),

    H("Riscaldamento sulla macchina", "Una palla che si muove di meno di un pixel per frame."),
    K("Tre ottavi di pixel, con soli interi", `.equ SPEED_Q8, 96            # 96 / 256 = 0.375 pixel per frame

ball_update:
    la   t0, ball_x_q8
    lw   t1, 0(t0)           # position, in 1/256 of a pixel
    addi t1, t1, SPEED_Q8    # add a fraction of a pixel
    sw   t1, 0(t0)
    ret

ball_draw:
    ...
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    srai a0, t1, 8           # x in whole pixels: drop 8 bits
    ...
    call prg32_gfx_rect`, [
      "Un pixel per frame è troppo veloce, zero è troppo lento: alla palla serve 0,375",
      "Il processore del kit è RV32IMAC: solo istruzioni intere, niente virgola mobile",
      "Trucco: si memorizza la posizione moltiplicata per 256, e si divide per 256 solo per disegnare",
      "Questa è la virgola fissa. Da dove viene il trucco, e quando non basta?",
    ], "Scritto per questa lezione nello stile degli esempi del libro di PRG32; la stessa idea sta dietro prg32_playfield_parallax(layer, x_q8, y_q8) nell'API di PRG32. Eseguirlo con SPEED_Q8 = 96, poi 16, poi 1."),

    H("Altre codifiche per gli interi con segno", "Due parenti del complemento a due che servono alla virgola mobile."),
    T("Complemento a uno", [
      "I numeri non negativi, 0 <= x < 2^(n-1), sono rappresentati da se stessi: X = x",
      "I numeri negativi sono rappresentati da X = 2^n - 1 - |x|",
      "Intervallo: da -(2^(n-1) - 1) a +(2^(n-1) - 1)",
      "Lo zero ha due rappresentazioni, 0000 e 1111: si rappresentano 2^n - 1 numeri, come in segno e modulo",
      ["Perché usarlo? Cambiare segno è banale: si complementa ogni bit", ["6 = 0110 e -6 = 1001; 5 = 0101 e -5 = 1010; 1 = 0001 e -1 = 1110"]],
    ], "Detto anche complemento alla base diminuita. La not bit a bit di RISC-V calcola esattamente questo.", { big: "-x = not x", label: "il complemento a uno di un numero si ottiene invertendo tutti i suoi bit" }),
    D("Aritmetica in complemento a uno", (s, h) => {
      const w = (h.CW - 0.6) / 3, y = h.TOP + 0.05;
      calc4(s, h, h.MX, y, w, "Nessuna correzione", ["3 +", "-4 =", "-1"], ["0011 +", "1011 =", "1110"], "nessun riporto uscente: il risultato è giusto");
      calc4(s, h, h.MX + w + 0.3, y, w, "Due negativi", ["-2 +", "-3 =", "", "-5"], ["1101 +", "1100 =", "1 1001 + 1 =", "1010"], "riporto uscente: va risommato", P.red);
      calc4(s, h, h.MX + 2 * (w + 0.3), y, w, "Risultato positivo", ["5 +", "-2 =", "", "3"], ["0101 +", "1101 =", "1 0010 + 1 =", "0011"], "riporto uscente: va risommato", P.red);
      h.rows(s, ["L'addizionatore lavora modulo 2^n - 1: ogni volta che c'è un riporto uscente dal bit più significativo, al risultato va sommato 1 (riporto circolare)",
        "La correzione serve quando entrambi gli operandi sono negativi, o quando hanno segno opposto e la somma è positiva",
        "Bastano ancora un addizionatore e un complementatore, ma il passo in più e il doppio zero hanno fatto vincere il complemento a due"], h.MX, 4.3, h.CW, 2.45);
    }, "Le slide originali chiamano il riporto «overflow nell'aritmetica degli interi positivi»: è il riporto uscente dell'addizionatore dei naturali, reinterpretato come necessità di una correzione."),
    T("Rappresentazione in eccesso k (polarizzata)", [
      "Ogni numero è traslato verso l'alto di una costante k: X = x + k, tipicamente k = 2^(n-1)",
      "L'ordine si conserva: se x1 > x2 allora X1 > X2, quindi i numeri con segno si confrontano come naturali",
      "Una somma va corretta sottraendo k; moltiplicazione e divisione sono molto più scomode che con i complementi",
      "Preferita dove servono solo somme e confronti",
      "È la codifica dell'esponente nei numeri in virgola mobile",
    ], "Eccesso 8 su quattro bit: 0000 = -8, 1000 = 0, 1111 = +7. Si confronti con il complemento a due: stesso intervallo, con il bit più significativo invertito.", { big: "X = x + k", label: "su quattro bit con k = 8: la configurazione 0000 significa -8, 1000 significa 0, 1111 significa +7" }),
    D("Quattro bit, cinque letture", (s, h) => {
      const rd = (k) => [k.toString(2).padStart(4, "0"), String(k), (k >= 8 ? "-" : "+") + (k & 7), k >= 8 ? "-" + (15 - k) : "+" + k, k >= 8 ? String(k - 16) : k ? "+" + k : "0", (k - 8 > 0 ? "+" : "") + (k - 8)];
      const w = [0.9, 0.95, 1.05, 0.95, 0.95, 1.05], tw = 5.85, head = ["Bit", "S. segno", "Segno-m.", "C. a 1", "C. a 2", "Ecc. 8"];
      h.table(s, h.MX, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i)), { fs: 15, mono: [0], align: "center", rowH: 0.42, cellHi: { "0,3": P.amberSoft, "0,2": P.amberSoft } });
      h.table(s, h.W - h.MX - tw, h.TOP, w, head, Array.from({ length: 8 }, (_, i) => rd(i + 8)), { fs: 15, mono: [0], align: "center", rowH: 0.42, cellHi: { "0,2": P.amberSoft, "7,3": P.amberSoft, "0,5": P.tealSoft } });
      h.rows(s, ["Segno e modulo e complemento a uno hanno due zeri (evidenziati): 0000 e 1000, oppure 0000 e 1111",
        "Complemento a due ed eccesso 8 coprono lo stesso intervallo, da -8 a +7, con un solo zero",
        "Solo l'eccesso k mantiene le configurazioni nello stesso ordine dei numeri"], h.MX, 5.5, h.CW, 1.25);
    }, "Questa tabella sostituisce la figura di confronto della presentazione originale («Numeri relativi: complementi»)."),

    H("Virgola fissa", "Le frazioni con hardware intero."),
    T("Numeri in virgola fissa", [
      "Parte intera e parte frazionaria sono memorizzate fianco a fianco in un'unica parola",
      "La posizione della virgola è fissa e implicita: non è memorizzata, la conosce il programma",
      "Con f bit frazionari l'intero memorizzato è X = x per 2^f, e la risoluzione è 2^-f",
      "Ogni parte usa una delle rappresentazioni già viste: di solito l'intera parola è in complemento a due",
      "Notazione Qm.f: m bit interi e f bit frazionari, per esempio Q24.8",
    ], "La virgola fissa è il modo in cui giochi, audio e software di controllo trattano le frazioni sui processori senza unità in virgola mobile. È anche il modo in cui si dovrebbe memorizzare il denaro: centesimi interi.", { big: "X = x 2^f", label: "si memorizza il numero moltiplicato per una potenza di due; scorrendo a destra di f bit si riottiene la parte intera" }),
    D("La palla, bit per bit: Q24.8", (s, h) => {
      h.tx(s, "ball_x_q8 = 0x00002A60 = 10848", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.6, h.TOP + 1.0, h.CW - 1.2, [
        { n: 24, label: "parte intera: 24 bit\n0x00002A = 42 pixel", value: "0000 0000 0000 0000 0010 1010", color: P.teal },
        { n: 8, label: "frazione: 8 bit\n0x60 = 96/256 = 0,375", value: "0110 0000", color: P.amber },
      ], { h: 0.8, fs: 18, labelFs: 15, minW: 3 });
      h.tx(s, "10848 / 256 = 42,375", { x: h.MX, y: h.TOP + 2.75, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, align: "center" });
      h.table(s, h.MX, 5.05, [3.2, 4.4, 4.533], ["Operazione", "In virgola fissa", "RISC-V"], [
        ["somma, sottrazione", "come interi: le virgole sono allineate", "add, sub, addi"],
        ["pixel interi", "scorrimento a destra di f, conservando il segno", "srai a0, t1, 8"],
        ["prodotto", "si moltiplica, poi si scorre a destra di f", "mul, poi srai"],
      ], { fs: 15, mono: [2] });
    }, "42 x 256 = 10752; 10752 + 96 = 10848 = 0x2A60. Dopo un altro frame il valore è 0x2AC0 (42,75), poi 0x2B20 (43,125): la palla attraversa il confine di un pixel ogni due o tre frame."),
    T("Numeri razionali: l'errore di approssimazione", [
      "I reali sono densi: anche in un intervallo limitato non tutti i numeri sono rappresentabili",
      ["Approssimazione: a ogni numero si associa il più vicino tra quelli rappresentabili", ["in Q24.8, 0,1 diventa 26/256 = 0,1015625: un errore dell'1,6% circa"]],
      "L'errore di approssimazione è al più metà della risoluzione: 1/512 con otto bit frazionari",
      "Underflow: un numero vicino a zero, ma non zero, è rappresentato da zero",
      "In virgola fissa l'errore assoluto è lo stesso lungo tutta la retta dei numeri",
    ], "0,1 x 256 = 25,6, arrotondato a 26. Con SPEED_Q8 = 1 la palla si muove di 1/256 di pixel per frame; una velocità di 0,001 pixel per frame va in underflow a zero e la palla non si muove mai.", { big: "1/256", label: "la risoluzione di otto bit frazionari: nulla di più piccolo si distingue da zero" }),

    H("Virgola mobile", "Barattare l'intervallo con la precisione."),
    T("Numeri reali in virgola mobile", [
      "Un numero reale x è rappresentato da una coppia (m, e) tale che x = m per b^e",
      ["m è la mantissa, e l'esponente, b la base", ["la virgola è mobile: l'esponente dice dove si trova"]],
      ["Infinite coppie rappresentano lo stesso numero", ["346,09801 = (346,09801; 0) = (346098,01; -3) = (0,034609801; 4)"]],
      ["La normalizzazione sceglie un unico rappresentante", ["la virgola va subito dopo la prima cifra significativa: (3,4609801; 2)"]],
    ], "In altre parole, la notazione scientifica. La virgola fissa spende i bit su un intervallo fisso; la virgola mobile ne spende alcuni per dire dove si trova l'intervallo.", { big: "x = m b^e", label: "mantissa, base ed esponente: la notazione scientifica del laboratorio, in binario" }),
    D("Esempio: l'intervallo di un piccolo formato decimale", async (s, h) => {
      h.tx(s, "Base 10, quattro cifre per la mantissa, due per l'esponente", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.45, fontSize: 18, bold: true, color: P.steel });
      await h.svg(s, lineSvg(), h.MX, h.TOP + 0.5, h.CW, 2.75);
      h.rows(s, ["Rappresentabili: da -9,999 x 10^99 a -1,000 x 10^-99, lo zero, e da +1,000 x 10^-99 a +9,999 x 10^99",
        "Overflow: il modulo è troppo grande per l'esponente",
        "Underflow: il modulo è troppo piccolo, e il numero collassa a zero"], h.MX, 4.95, h.CW, 1.8);
    }, "La presentazione originale mostrava questa retta due volte (intervallo di rappresentazione; overflow e underflow): qui sono unite."),
    T("Approssimazione: errore assoluto e relativo", [
      "L'errore assoluto non è costante: la precisione è finissima vicino a zero e diminuisce al crescere dei numeri",
      ["Vicino a zero l'errore massimo è 0,001 x 10^-99", ["1,001 x 10^-99 meno 1,000 x 10^-99"]],
      ["Vicino al limite superiore l'errore massimo è 0,001 x 10^99", ["9,999 x 10^99 meno 9,998 x 10^99"]],
      "Errore assoluto: piccolo sui numeri piccoli, grande sui numeri grandi",
      "Errore relativo: costante lungo tutto l'asse",
    ], "È l'opposto della virgola fissa, dove l'errore assoluto è costante e quello relativo esplode vicino a zero.", { big: "4 cifre", label: "lo stesso numero di cifre significative ovunque: errore relativo costante, qualunque sia la grandezza del numero" }),
    D("IEEE 754 a singola precisione: 32 bit", (s, h) => {
      h.bits(s, h.MX, h.TOP + 0.35, h.CW, [
        { n: 1, label: "segno\n1 = negativo", value: "S", color: P.red },
        { n: 8, label: "esponente: 8 bit\neccesso 127", value: "E", color: P.amber },
        { n: 23, label: "frazione: 23 bit\nmodulo, dopo l'1 nascosto", value: "F", color: P.teal },
      ], { h: 0.75, fs: 22, labelFs: 15, minW: 1.2 });
      h.tx(s, "valore = (-1)^S  x  1,F  x  2^(E - 127)", { x: h.MX, y: h.TOP + 2.0, w: h.CW, h: 0.6, fontSize: 26, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, [
        "La mantissa è in segno e modulo: un bit di segno e 23 bit di modulo",
        "Una mantissa binaria normalizzata comincia sempre con 1: quel bit è nascosto, non memorizzato, e si guadagna un bit di precisione",
        "L'esponente è in eccesso 127, non 128: gli esponenti veri vanno da -126 a +127",
        "Le configurazioni E = 0 ed E = 255 sono riservate: zero e numeri denormalizzati, infinito e NaN",
      ], h.MX, 4.45, h.CW, 2.3);
    }, "IEEE 754 è del 1985 (rivisto nel 2008 e nel 2019). Prima ogni costruttore aveva il proprio formato e i programmi davano risultati diversi su macchine diverse."),
    D("Esempio svolto: -5,125 in IEEE 754", (s, h) => {
      h.rows(s, [
        "Si convertono le due parti: 5 = 101 e 0,125 = 1/8 = 0,001, quindi 5,125 = 101,001",
        "Si normalizza: 101,001 = 1,01001 x 2^2",
        "Segno S = 1; esponente E = 2 + 127 = 129 = 1000 0001",
        "Frazione F = 01001 seguita da zeri: l'1 iniziale è nascosto",
      ], h.MX, h.TOP, h.CW, 3.0, "num");
      h.bits(s, h.MX, 4.95, h.CW, [
        { n: 1, value: "1", color: P.red },
        { n: 8, value: "1000 0001", color: P.amber },
        { n: 23, value: "0100 1000 0000 0000 0000 000", color: P.teal },
      ], { h: 0.65, fs: 17, minW: 0.7 });
      h.tx(s, "1100 0000 1010 0100 0000 0000 0000 0000  =  0xC0A40000", { x: h.MX, y: 5.95, w: h.CW, h: 0.6, fontSize: 21, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
    }, "Verificare il raggruppamento in nibble: 1100 = C, 0000 = 0, 1010 = A, 0100 = 4, poi zeri. Qui sono unite tre slide della presentazione originale."),
    G("IEEE 754 in sintesi", ["", "Singola precisione", "Doppia precisione"], [
      ["Bit totali", "32", "64"],
      ["Bit di segno", "1", "1"],
      ["Bit di esponente", "8", "11"],
      ["Bit di frazione", "23", "52"],
      ["Codifica dell'esponente", "eccesso 127", "eccesso 1023"],
      ["Intervallo dell'esponente", "-126 ... +127", "-1022 ... +1023"],
      ["Minimo normalizzato", "2^-126, circa 1,2 x 10^-38", "2^-1022, circa 2,2 x 10^-308"],
      ["Massimo", "circa 2^128, 3,4 x 10^38", "circa 2^1024, 1,8 x 10^308"],
      ["Minimo denormalizzato", "circa 1,4 x 10^-45", "circa 4,9 x 10^-324"],
      ["Cifre decimali", "circa 7", "circa 16"],
    ], "Correzioni alla tabella originale: l'esponente in doppia precisione è in eccesso 1023 (non 1024), e gli intervalli decimali sono circa 10^38 e 10^308.", { widths: [3.2, 4.5, 4.5] }),
    G("IEEE 754: che cosa significano le configurazioni", ["Tipo", "Segno", "Esponente E", "Frazione F", "Valore"], [
      ["Normalizzato", "0 o 1", "0 < E < max", "qualsiasi", "(-1)^S x 1,F x 2^(E-bias)"],
      ["Denormalizzato", "0 o 1", "tutti zeri", "non zero", "(-1)^S x 0,F x 2^(1-bias)"],
      ["Zero", "0 o 1", "tutti zeri", "tutti zeri", "+0 o -0"],
      ["Infinito", "0 o 1", "tutti uni", "tutti zeri", "+infinito o -infinito"],
      ["Not a Number", "0 o 1", "tutti uni", "non zero", "NaN: un risultato non valido"],
    ], "I numeri denormalizzati (subnormali) riempiono il vuoto dell'underflow attorno allo zero con precisione via via decrescente. 1/0 dà infinito; 0/0 e la radice quadrata di -1 danno NaN. NaN non è uguale a nulla, nemmeno a se stesso.", { widths: [2.2, 1.2, 1.9, 1.9, 5.0], mono: [4], fs: 18 }),
    T("La virgola mobile non è l'insieme dei reali", [
      "0,1 non ha uno sviluppo binario finito: è memorizzato in modo approssimato, come 0,8 nella Lezione 05",
      "Mai confrontare per uguaglianza due risultati in virgola mobile: si confronta la loro differenza con una tolleranza",
      "La somma non è associativa: (a + b) + c può differire da a + (b + c)",
      "Sommare un numero molto piccolo a uno molto grande può lasciare invariato quello grande",
      "Per il denaro e per le posizioni in un gioco, gli interi scalati sono spesso lo strumento giusto",
    ], "La somma in doppia precisione 0,1 + 0,2 vale 0,30000000000000004. Provatela in qualunque linguaggio.", { code: "double a = 0.1 + 0.2;\n\n// a == 0.3 ?   false\n// a = 0.30000000000000004\n\n// better:\n// fabs(a - 0.3) < 1e-9", lang: "c", wide: true, h: 3.4 }),
    C("Oltre singola e doppia", [
      ["Mezza precisione", "Sedici bit: 1 di segno, 5 di esponente, 10 di frazione. Circa tre cifre decimali, metà della memoria della singola precisione."],
      ["Perché conta", "Le reti neurali contengono miliardi di numeri: dimezzare ciascuno dimezza memoria, banda ed energia."],
      ["Quantizzazione", "Molti modelli sono memorizzati come interi a 8 bit con un fattore di scala: di nuovo virgola fissa, su scala industriale."],
      ["Lo stesso compromesso", "I bit sono un bilancio. Intervallo, precisione e costo tirano in direzioni diverse, su una GPU come sulla vostra palla in Q24.8."],
    ], "Slide nuova. La mezza precisione è il binary16 di IEEE 754-2008. Il punto per gli studenti del primo anno: le scelte di rappresentazione sono una decisione ingegneristica che si prende ancora oggi."),

    H("Ritorno alla macchina", "La virgola mobile e RISC-V."),
    V("La virgola mobile su RISC-V, e sul vostro kit",
      ["RISC-V con le estensioni F e D", ["Altri trentadue registri, da f0 a f31, per i valori in virgola mobile", "Istruzioni come fadd.s, fmul.s, flw e fsw lavorano su numeri IEEE 754", "fcvt.w.s converte in intero, fcvt.s.w da intero", "Si trovano sui processori RISC-V per portatili, server e supercalcolatori"]],
      ["L'ESP32-C6: RV32IMAC", ["Né F né D: non esiste alcuna istruzione in virgola mobile", "Un programma C può comunque usare float: il compilatore chiama routine software come __addsf3", "Ogni chiamata costa da decine a centinaia di istruzioni intere", "I giochi PRG32 usano interi e virgola fissa: veloci, abbastanza esatti, e visibili nel debugger"]],
      "Le routine software realizzano esattamente l'algoritmo di questa lezione con scorrimenti, maschere e somme intere: un buon esercizio di lettura per la fine del corso."),
    G("Leggere il nome RV32IMAC", ["Lettera", "Estensione", "Che cosa aggiunge", "Sull'ESP32-C6"], [
      ["RV32I", "insieme intero di base", "registri a 32 bit, somma, logica, load e store, salti", "sì"],
      ["M", "moltiplicazione e divisione", "mul, mulh, div, rem e le forme senza segno", "sì"],
      ["A", "atomiche", "istruzioni per la condivisione sicura tra task", "sì"],
      ["C", "compresse", "codifiche a 16 bit delle istruzioni più comuni", "sì"],
      ["F", "singola precisione", "da f0 a f31 e istruzioni IEEE 754 a singola precisione", "no"],
      ["D", "doppia precisione", "istruzioni IEEE 754 a doppia precisione", "no"],
    ], "RISC-V è modulare: una piccola base obbligatoria più estensioni facoltative. Un microcontrollore prende ciò che gli serve; è una delle ragioni per cui la stessa architettura va da un chip da due euro a un supercalcolatore.", { widths: [1.4, 2.6, 6, 2.2], mono: [0] }),

    Q("Quale codifica con segno mantiene le configurazioni di bit nello stesso ordine dei numeri?", ["Segno e modulo", "Complemento a uno", "Complemento a due", "Eccesso k"], 3, "In eccesso k, X = x + k: a un numero maggiore corrisponde sempre una configurazione maggiore. Per questo codifica gli esponenti della virgola mobile, che vanno confrontati in fretta."),
    Q("In virgola fissa Q24.8, quale numero reale rappresenta la parola 0x00000180?", ["384", "1,5", "1,8", "0,375"], 1, "0x180 = 384; 384 / 256 = 1,5. Parte intera 0x01, frazione 0x80 = 128/256 = 0,5."),
    Q("Quale numero reale è la configurazione IEEE 754 a singola precisione 0x40400000?", ["2,0", "3,0", "4,0", "0,75"], 1, "0100 0000 0100 0000 ...: S = 0, E = 1000 0000 = 128, F = 100...: 1,1 (binario) x 2^(128-127) = 1,5 x 2 = 3,0."),
    Q("In IEEE 754, un campo esponente di tutti uni con frazione di tutti zeri significa:", ["zero", "un numero denormalizzato", "infinito", "NaN"], 2, "Tutti uni nell'esponente: infinito se la frazione è zero, NaN altrimenti."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Scrivete -6 su quattro bit in segno e modulo, complemento a uno, complemento a due ed eccesso 8",
      "Codificate 10,5 e 0,15625 in IEEE 754 a singola precisione; date il risultato in esadecimale",
      "Decodificate 0xBF800000",
      "Eseguite la palla con SPEED_Q8 = 96, 16 e 1. Dopo quanti frame si sposta di un pixel in ciascun caso?",
      "Date alla palla anche una velocità verticale, e fatela rimbalzare: cambiate segno alla velocità con neg quando raggiunge un bordo",
    ], "Su carta: 0x41280000, 0x3E200000 e -1,0. Su PRG32: la palla avanza di un pixel ogni 2,67, 16 e 256 frame; con il rimbalzo si muove in diagonale e resta sullo schermo.",
      "-6: 1110, 1001, 1010, 0010. 10,5 = 1010,1 = 1,0101 x 2^3: E = 130. 0,15625 = 0,00101 = 1,01 x 2^-3: E = 124. 0xBF800000: S = 1, E = 127, F = 0."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["one's complement", "complemento a uno (alla base diminuita)", "mantissa / fraction", "mantissa"],
      ["excess-k (biased)", "eccesso-k", "exponent", "esponente"],
      ["fixed point", "virgola fissa", "normalisation", "normalizzazione"],
      ["floating point", "virgola mobile", "hidden bit", "bit nascosto"],
      ["single / double precision", "singola / doppia precisione", "denormalised", "denormalizzato"],
      ["rounding", "arrotondamento", "Not a Number (NaN)", "non un numero (NaN)"],
    ], null, { widths: [3.2, 3.6, 2.8, 2.6] }),
    T("Conclusioni e letture", [
      "Gli interi hanno diverse rappresentazioni: 8, 16, 32 o 64 bit, con o senza segno, complementi o eccesso",
      "La virgola fissa memorizza una frazione come intero scalato: errore assoluto costante, velocità degli interi",
      "La virgola mobile memorizza mantissa ed esponente: intervallo enorme, errore relativo costante",
      "IEEE 754 è lo standard universale della virgola mobile, con configurazioni speciali per zero, infinito e NaN",
      "Su un processore senza l'estensione F, la virgola fissa è la scelta naturale",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafo 3.5", "David Goldberg: What Every Computer Scientist Should Know About Floating-Point Arithmetic", "Playing with RISC-V, appendice: The PRG32 Runtime Interface (playfield e parallasse)"]],
    ], "A seguire: Verm1, parte 1, dove le prime quattro lezioni vanno a lavorare in un programma vero. Poi l'algebra di Boole."),
  ],
});
