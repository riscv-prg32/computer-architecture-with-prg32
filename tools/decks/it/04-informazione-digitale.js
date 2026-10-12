// Italian version of decks/en/04-digital-information.js: same slides, same listings, text in Italian.
// Lecture 04 - Introduction to the representation of digital information.
// Source: 02-...-Introduzione_alla_rappresentazione_dell_informazione_digitale.pptx (translated, figures redrawn, RISC-V examples added).
const G2 = require("../../lib/gates");

function signalSvg() {
  const W = 640, H = 300, x0 = 40, y0 = 150, A = 100, n = 16, span = W - 80;
  let wave = "", steps = "", dots = "";
  for (let i = 0; i <= 200; i++) { const t = i / 200; wave += `${i ? "L" : "M"}${(x0 + t * span).toFixed(1)},${(y0 - A * Math.sin(t * 2 * Math.PI)).toFixed(1)} `; }
  for (let k = 0; k < n; k++) {
    const t = (k + 0.5) / n, v = Math.round(Math.sin(t * 2 * Math.PI) * 7) / 7, y = y0 - A * v, xa = x0 + (k / n) * span, xb = x0 + ((k + 1) / n) * span;
    steps += `${k ? "L" : "M"}${xa.toFixed(1)},${y.toFixed(1)} L${xb.toFixed(1)},${y.toFixed(1)} `;
    dots += `<circle cx="${((xa + xb) / 2).toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#C7791B"/>`;
  }
  let grid = "";
  for (let l = -7; l <= 7; l++) grid += `<line x1="${x0}" y1="${y0 - A * l / 7}" x2="${x0 + span}" y2="${y0 - A * l / 7}" stroke="#C9D2D8" stroke-width="${l === 0 ? 1.6 : 0.6}"/>`;
  return G2.doc(W, H, `<rect width="${W}" height="${H}" fill="#EEF2F4" rx="10"/>${grid}
    <path d="${wave}" fill="none" stroke="#0E7C86" stroke-width="3.2"/>
    <path d="${steps}" fill="none" stroke="#C7791B" stroke-width="2.6"/>${dots}
    ${G2.text(x0 + 8, 28, "analogico: continuo", { fill: "#0E7C86", size: 16 })}${G2.text(x0 + 8, H - 14, "digitale: campionato nel tempo, quantizzato nel valore", { fill: "#C7791B", size: 16 })}`);
}

Deck({
  n: "04", file: "04-Architettura_dei_Calcolatori-Informazione_Digitale",
  title: "Rappresentare l'informazione digitale", short: "Informazione digitale",
  sub: "Bit, numeri, testo, strutture: nella macchina tutto è una configurazione di bit",
  quote: ['printf("Hello, world!");', "Brian Kernighan e Dennis Ritchie, The C Programming Language, 1978"], quoteMono: true,
  cover: "lab1_step2_hello.png",
  notes: "Spirale: gli studenti hanno già visto 0x07e0, 255, .asciz e .word nella Lezione 02. Questa lezione dà un nome a quelle cose. Le due lezioni successive (05, 06) trattano i numeri in modo formale.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Spiegare la differenza tra informazione analogica e digitale",
      "Leggere una configurazione di bit come numero naturale, in binario e in esadecimale",
      "Scomporre un colore PRG32 come 0x07E0 nei campi rosso, verde e blu",
      "Dire come caratteri e stringhe sono memorizzati, in ASCII e in UTF-8",
      "Descrivere come un vettore sta in memoria e come l'assembly ne raggiunge un elemento",
      "Distinguere un algoritmo deterministico da uno probabilistico, e collocare tra essi il machine learning",
    ]),

    H("Informazione", "Dal mondo a una configurazione di bit."),
    F("Concetti fondamentali: il flusso dei dati", [
      "Ingresso|i dati entrano dal mondo: un tasto, un sensore, un file",
      "Elaborazione|un programma, incarnazione di un algoritmo, li trasforma",
      "Uscita|i risultati escono: un'immagine, un suono, un numero",
      "Conoscenza|informazione su cui qualcuno può agire",
    ], "L'intelligenza artificiale è un'intelligenza di tipo proprio: potente riconoscimento di schemi, senza autocoscienza e senza esperienza soggettiva.",
      "Su PRG32 i quattro riquadri sono prg32_input_read, la vostra funzione update, la vostra funzione draw, e il giocatore che reagisce allo schermo."),
    D("Informazione analogica e digitale", async (s, h) => {
      h.rows(s, [
        ["Analogica", ["una grandezza che varia con continuità: una tensione, una pressione sonora, le lancette di un orologio"]],
        ["Digitale", ["una sequenza di simboli presi da un alfabeto finito: le cifre di un display"]],
        "Digitalizzare significa campionare nel tempo e quantizzare nel valore",
        "Un numero finito di livelli si può contare, copiare esattamente e controllare contro gli errori",
        "Con due livelli il simbolo è il bit: 0 oppure 1",
      ], h.MX, h.TOP, 5.9, h.BOT - h.TOP);
      await h.svg(s, signalSvg(), 6.9, h.TOP, h.W - h.MX - 6.9, h.BOT - h.TOP);
    }, "Due livelli si realizzano in modo affidabile con i transistor (spento o acceso): per questo i calcolatori sono binari. L'algebra di Boole (Lezione 08) è la matematica dei due livelli."),
    G("Bit, byte, parola", ["Unità", "Dimensione", "Configurazioni", "Dove l'avete incontrata"], [
      ["bit", "1 cifra binaria", "2", "un pulsante del joystick"],
      ["nibble", "4 bit", "16", "una cifra esadecimale"],
      ["byte", "8 bit", "256", "un carattere ASCII; la larghezza della barra (andi 255)"],
      ["halfword (mezza parola)", "16 bit", "65.536", "un colore RGB565"],
      ["word (parola)", "32 bit", "4.294.967.296", "un registro RISC-V; un'istruzione; .word"],
      ["KiB, MiB, GiB", "2^10, 2^20, 2^30 byte", "-", "dimensioni di memoria: 1 KiB = 1024 byte"],
    ], "n bit danno 2^n configurazioni distinte. Che cosa significa una configurazione non è scritto nei bit: è una convenzione tra chi li scrive e chi li legge. Su RV32 una parola è di 32 bit per definizione dell'architettura.", { widths: [2, 3, 2.4, 5.4], caption: "n bit danno 2^n configurazioni. Il significato di una configurazione è una convenzione, non una proprietà dei bit." }),
    G("Contare in base 2 e in base 16", ["Dec", "Binario", "Esa", "Dec", "Binario", "Esa"], [
      ["0", "0000", "0", "8", "1000", "8"], ["1", "0001", "1", "9", "1001", "9"], ["2", "0010", "2", "10", "1010", "A"], ["3", "0011", "3", "11", "1011", "B"],
      ["4", "0100", "4", "12", "1100", "C"], ["5", "0101", "5", "13", "1101", "D"], ["6", "0110", "6", "14", "1110", "E"], ["7", "0111", "7", "15", "1111", "F"],
    ], "Le colonne del numero binario pesano 8, 4, 2, 1. Questa tabella va imparata a memoria: è la tavola pitagorica di questo corso.", { widths: [1, 1.6, 1, 1, 1.6, 1], mono: [1, 2, 4, 5], fs: 19 }),
    D("Notazione posizionale: che cosa significa 11011001", (s, h) => {
      const bitsv = [1, 1, 0, 1, 1, 0, 0, 1], cw = 1.2, x = (h.W - 8 * cw) / 2, y = h.TOP + 0.85;
      h.tx(s, "peso", { x: h.MX, y: y - 0.62, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.mem(s, x, y, cw, bitsv.map((b, i) => ({ val: b, addr: `2^${7 - i} = ${2 ** (7 - i)}`, label: b ? String(2 ** (7 - i)) : "0", color: b ? P.teal : undefined })), { h: 0.9, fs: 30, labelFs: 17 });
      h.tx(s, "contributo", { x: h.MX, y: y + 0.95, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.tx(s, "128 + 64 + 16 + 8 + 1 = 217", { x: h.MX, y: y + 1.75, w: h.CW, h: 0.7, fontSize: 32, bold: true, fontFace: h.MONO, color: P.ink, align: "center", valign: "middle" });
      h.card(s, h.MX, 5.25, h.CW, 1.5, P.tealSoft);
      h.tx(s, "In un sistema posizionale il valore di una cifra dipende dalla sua posizione: ogni posizione pesa una potenza della base. La base 10 usa le potenze di dieci, la base 2 le potenze di due, la base 16 le potenze di sedici. La regola è la stessa; cambia solo la base.", { x: h.MX + 0.3, y: 5.3, w: h.CW - 0.6, h: 1.4, fontSize: 17, valign: "middle" });
    }, "La Lezione 05 dà la formula generale e gli algoritmi di conversione. Qui lo scopo è soltanto leggere un byte."),
    D("Perché i programmatori scrivono in esadecimale", (s, h) => {
      const groups = ["0000", "0111", "1110", "0000"], hex = ["0", "7", "E", "0"], cw = 2.2, x = (h.W - 4 * cw) / 2, y = h.TOP + 0.2;
      h.tx(s, "binario", { x: h.MX, y, w: x - h.MX - 0.2, h: 0.8, fontSize: 14, color: P.mute, align: "right", valign: "middle" });
      h.mem(s, x, y, cw, groups.map((g, i) => ({ val: g, color: h.TINTS[i] })), { h: 0.8, fs: 26 });
      for (let i = 0; i < 4; i++) h.arrow(s, x + i * cw + cw / 2, y + 0.85, x + i * cw + cw / 2, y + 1.35, P.mute, 2);
      h.tx(s, "esadecimale", { x: h.MX, y: y + 1.4, w: x - h.MX - 0.2, h: 0.8, fontSize: 14, color: P.mute, align: "right", valign: "middle" });
      h.mem(s, x, y + 1.4, cw, hex.map((g) => ({ val: g })), { h: 0.8, fs: 30 });
      h.tx(s, "0x07E0  =  2016 in decimale", { x: h.MX, y: y + 2.4, w: h.CW, h: 0.6, fontSize: 24, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, ["Una cifra esadecimale vale esattamente quattro bit, perché 16 = 2^4: la conversione è una ricerca in tabella, cifra per cifra",
        "Un registro a 32 bit sono otto cifre esadecimali: 0x00130313 si legge, trentadue zeri e uni no",
        "Il prefisso 0x indica l'esadecimale in assembly e in C; il debugger di PRG32-QT mostra così i registri"], h.MX, 4.95, h.CW, 1.8);
    }, "0x07E0 = 7 x 256 + 14 x 16 = 1792 + 224 = 2016. Il valore decimale qui è inutile: conta la configurazione di bit, come mostra la slide successiva."),
    D("Un colore è un numero: RGB565", (s, h) => {
      h.tx(s, ".equ GREEN, 0x07e0", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 1.2, h.TOP + 1.0, h.CW - 2.4, [
        { n: 5, label: "rosso: 5 bit\n0 su 31", value: "00000", color: P.red },
        { n: 6, label: "verde: 6 bit\n63 su 63", value: "111111", color: P.green },
        { n: 5, label: "blu: 5 bit\n0 su 31", value: "00000", color: "2B5DAA" },
      ], { h: 0.85, fs: 26, labelFs: 15 });
      const cols = [["BLACK", "0x0000", "000000"], ["RED", "0xF800", "F80000"], ["GREEN", "0x07E0", "00FC00"], ["BLUE", "0x001F", "0000F8"], ["YELLOW", "0xFFE0", "F8FC00"], ["CYAN", "0x07FF", "00FCF8"], ["MAGENTA", "0xF81F", "F800F8"], ["WHITE", "0xFFFF", "FFFFFF"]];
      const cw = h.CW / 8, y = 4.35;
      cols.forEach(([n, v, rgb], i) => {
        const x = h.MX + i * cw;
        h.rect(s, x + 0.12, y, cw - 0.24, 0.8, rgb, P.steel);
        h.tx(s, n, { x, y: y + 0.88, w: cw, h: 0.3, fontSize: 13, bold: true, align: "center" });
        h.tx(s, v, { x, y: y + 1.18, w: cw, h: 0.3, fontSize: 14, fontFace: h.MONO, color: P.mute, align: "center" });
      });
      h.tx(s, "Sedici bit, tre campi. Gli stessi sedici bit potrebbero essere un numero, due caratteri o mezza istruzione: il significato sta in come il programma li usa.", { x: h.MX, y: 6.05, w: h.CW, h: 0.7, fontSize: 16, italic: true, valign: "middle" });
    }, "L'occhio è più sensibile al verde: per questo al verde spetta il bit in più. Esercizio: che colore è 0xF81F? (rosso e blu al massimo: magenta). Le costanti dei colori sono quelle di prg32.h."),
    D("Numeri: naturali, interi, reali", (s, h) => {
      h.rows(s, [
        ["Numeri naturali: la configurazione posizionale stessa", ["n bit coprono da 0 a 2^n - 1"]],
        ["Interi con segno: complemento a due", ["un registro a 32 bit copre circa da -2 miliardi a +2 miliardi"]],
        ["Numeri reali: virgola fissa o virgola mobile IEEE 754", ["valore = (-1)^segno x 1,frazione x 2^(esponente - bias)"]],
      ], h.MX, h.TOP, h.CW, 2.55);
      h.tx(s, "singola precisione, 32 bit: circa 7 cifre decimali, fino a circa 3,4 x 10^38", { x: h.MX, y: 4.2, w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      h.bits(s, h.MX, 4.82, h.CW, [{ n: 1, value: "s", color: P.red }, { n: 8, value: "esponente (8)", color: P.amber }, { n: 23, value: "frazione (23)", color: P.teal }], { h: 0.5, fs: 14, minW: 0.5 });
      h.tx(s, "doppia precisione, 64 bit: circa 16 cifre decimali, fino a circa 1,8 x 10^308", { x: h.MX, y: 5.5, w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      h.bits(s, h.MX, 6.12, h.CW, [{ n: 1, value: "s", color: P.red }, { n: 11, value: "esponente (11)", color: P.amber }, { n: 52, value: "frazione (52)", color: P.teal }], { h: 0.5, fs: 14, minW: 0.5 });
    }, "Solo un'anteprima. La Lezione 05 tratta naturali e interi con segno; la Lezione 06 virgola fissa e IEEE 754. La slide originale riportava la formula del valore in forma confusa: quella corretta è sulla slide."),

    H("Testo", "Anche i caratteri sono numeri."),
    G("ASCII: un carattere, un byte", ["Carattere", "Decimale", "Esa", "Binario", "Nota"], [
      ["A", "65", "0x41", "0100 0001", "le maiuscole cominciano da 65"],
      ["a", "97", "0x61", "0110 0001", "come A con un bit in più: 97 - 65 = 32"],
      ["0", "48", "0x30", "0011 0000", "il carattere zero non è il numero zero"],
      ["spazio", "32", "0x20", "0010 0000", "un carattere come gli altri"],
      ["a capo", "10", "0x0A", "0000 1010", "un carattere di controllo"],
      ["NUL", "0", "0x00", "0000 0000", "segna la fine di una stringa C"],
    ], "L'ASCII (1963) usa 7 bit: 128 caratteri, solo per l'inglese. Maiuscole e minuscole differiscono solo nel bit 5: xori con 0x20 scambia maiuscolo e minuscolo, un primo assaggio di algebra di Boole sul testo.", { widths: [1.8, 1.5, 1.4, 2.4, 5.1], mono: [0, 2, 3] }),
    D("Stringhe: una sequenza di caratteri in memoria", (s, h) => {
      const cw = 0.78, x = 3.2;
      const row = (y, label, cells, note) => {
        h.tx(s, label, { x: h.MX, y, w: x - h.MX - 0.2, h: 0.62, fontSize: 15, bold: true, color: P.steel, valign: "middle" });
        h.mem(s, x, y, cw, cells, { h: 0.62, fs: 17, labelFs: 12, labelMono: true });
        if (note) h.tx(s, note, { x: x + cells.length * cw + 0.25, y, w: h.W - h.MX - (x + cells.length * cw + 0.25), h: 0.62, fontSize: 13.5, color: P.mute, valign: "middle" });
      };
      row(h.TOP + 0.1, "Stringa C", [..."CIAO"].map((c) => ({ val: c, label: c.charCodeAt(0).toString(16).toUpperCase() })).concat([{ val: "\\0", label: "00", color: P.red }]), "la fine è segnata da un byte a zero");
      row(h.TOP + 1.35, "Stringa Pascal", [{ val: "4", label: "04", color: P.amber }].concat([..."CIAO"].map((c) => ({ val: c, label: c.charCodeAt(0).toString(16).toUpperCase() }))), "la lunghezza viene prima");
      const hello = [..."HELLO PRG32"].map((c) => ({ val: c === " " ? "␣" : c, label: c.charCodeAt(0).toString(16).toUpperCase() })).concat([{ val: "\\0", label: "00", color: P.red }]);
      row(h.TOP + 2.75, '.asciz "HELLO PRG32"', hello);
      h.card(s, h.MX, 5.3, h.CW, 1.45, P.tealSoft);
      h.tx(s, "La z di .asciz significa terminata da zero: l'assemblatore memorizza dodici byte per undici caratteri. prg32_gfx_text8 riceve in a2 solo l'indirizzo del primo byte, e legge finché non trova lo zero.", { x: h.MX + 0.3, y: 5.35, w: h.CW - 0.6, h: 1.35, fontSize: 17, valign: "middle" });
    }, "I numeri sotto le celle sono i codici ASCII in esadecimale. È la stringa della Lezione 02, passo 2. Che cosa accade se lo zero manca? La funzione continua a leggere ciò che segue in memoria."),
    G("Unicode e UTF-8: ogni sistema di scrittura", ["Carattere", "Code point", "Byte UTF-8", "Lunghezza"], [
      ["A", "U+0041", "41", "1 byte: identico all'ASCII"],
      ["è", "U+00E8", "C3 A8", "2 byte"],
      ["€", "U+20AC", "E2 82 AC", "3 byte"],
      ["日", "U+65E5", "E6 97 A5", "3 byte"],
      ["😀", "U+1F600", "F0 9F 98 80", "4 byte"],
    ], "Unicode assegna un numero (code point) a ogni carattere di ogni scrittura; UTF-8 codifica quel numero in uno-quattro byte ed è compatibile con l'ASCII. È la codifica del web e dei vostri file sorgente. Conseguenza: la lunghezza in byte di una stringa non è la sua lunghezza in caratteri.", { widths: [2, 2.6, 3.4, 4.2], mono: [1, 2], caption: "Unicode dà un numero a ogni carattere; UTF-8 lo memorizza in uno-quattro byte, e il testo ASCII puro è già UTF-8 valido." }),
    D("Ordine dei byte: little-endian", (s, h) => {
      h.tx(s, "value: .word 0x12345678", { x: h.MX, y: h.TOP - 0.05, w: h.CW, h: 0.5, fontSize: 24, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      const cw = 1.5, x = 4.6, cols = [P.teal, P.amber, P.violet, P.green];
      h.tx(s, "little-endian\n(RISC-V, x86, ARM)", { x: h.MX, y: h.TOP + 1.0, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, color: P.ink, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 1.0, cw, ["78", "56", "34", "12"].map((v, i) => ({ val: v, addr: `indirizzo A+${i}`, color: cols[3 - i] })), { h: 0.8, fs: 24 });
      h.tx(s, "big-endian\n(protocolli di rete)", { x: h.MX, y: h.TOP + 2.5, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, color: P.ink, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 2.5, cw, ["12", "34", "56", "78"].map((v, i) => ({ val: v, addr: `indirizzo A+${i}`, color: cols[i] })), { h: 0.8, fs: 24 });
      h.rows(s, ["Una parola sono quattro byte, e la memoria si indirizza byte per byte: in che ordine vanno?",
        "Little-endian: il byte meno significativo all'indirizzo più basso. È ciò che fanno lw e sw su RISC-V",
        "Ve ne accorgete guardando la memoria in un debugger, o scambiando dati con un'altra macchina"], h.MX, 5.0, h.CW, 1.75);
    }, "I nomi vengono dai Viaggi di Gulliver: da quale estremità rompere l'uovo. In PRG32-QT aprite la vista della memoria su una .word e leggete i byte."),

    H("Strutture dati", "Dai valori singoli alle collezioni organizzate."),
    C("Cinque modi di organizzare i dati", [
      ["Vettore", "Elementi dello stesso tipo, uno dopo l'altro, raggiunti per indice: 32, 11, 34, 22."],
      ["Lista", "Elementi collegati l'uno al successivo: economico inserire e togliere, lento raggiungere una posizione."],
      ["Pila", "L'ultimo a entrare è il primo a uscire: push aggiunge in cima, pop toglie dalla cima."],
      ["Dizionario", "Coppie chiave-valore: NA dà NAPOLI, PA dà PALERMO, MI dà MILANO."],
      ["Albero", "Una gerarchia: un animale cammina o nuota, ha polmoni o branchie, due zampe o quattro."],
      ["Nella macchina", "Sono tutti byte in memoria più una regola per trovare l'elemento successivo."],
    ], "Una pila l'avete già usata: il frame che salvava ra nella Lezione 02. Gli esempi sono quelli disegnati sulla slide originale."),
    K("Un vettore in memoria, un elemento in un registro", `.section .data
scores: .word 32, 11, 34, 22     # four 32-bit words, 16 bytes

.section .text
    la   t0, scores      # t0 = ADDRESS of element 0
    li   t1, 2           # index i = 2
    slli t1, t1, 2       # offset = i * 4 bytes (shift left by 2)
    add  t0, t0, t1      # ADDRESS of element i
    lw   a0, 0(t0)       # a0 = VALUE of scores[2] = 34`, [
      "Un vettore è un indirizzo base più elementi di uguale dimensione",
      "L'elemento i di un vettore di parole sta a base + 4 x i, perché una parola sono quattro byte",
      "slli di 2 moltiplica per quattro: uno scorrimento è una moltiplicazione per una potenza di due",
      "L'espressione di alto livello scores[i] è esattamente queste quattro istruzioni",
    ], "La proprietà dello scorrimento come moltiplicazione si dimostra nella Lezione 05 (proprietà delle stringhe binarie). Chiedere: che cosa legge lw se i = 4? Ciò che segue il vettore in memoria: la macchina non controlla i limiti."),

    H("Dati e algoritmi", "Dai big data al machine learning."),
    DEF("Dati, big data e data science", "Big data", "Dati che superano i limiti degli strumenti tradizionali delle basi di dati.", [
      "Strutturati e non strutturati: economia, geolocalizzazione, serie temporali, reti sociali",
      "Petabyte e zettabyte: miliardi di terabyte",
      "Tecnologie che estraggono conoscenza e valore dai dati: calcolo parallelo e GPU",
      "Data science: l'analisi di grandi quantità di informazione",
    ]),
    C("Da dove vengono i dati", [
      ["Dati da sensori", "L'ambiente, le posizioni GPS, l'Internet delle cose: ogni dispositivo misura qualcosa."],
      ["Transazioni", "Acquisti al supermercato, carte di credito, ordini online."],
      ["Dati pubblici", "Atti amministrativi, territorio, consumi: dati aperti delle istituzioni."],
      ["Social media", "Preferenze, politica, opinioni: ciò che le persone scrivono e condividono."],
    ], "Flusso sulla slide originale: generazione e acquisizione, estrazione e pulizia, memorizzazione e integrazione (big data management); modellazione, analisi e interpretazione (big data analytics)."),
    T("GPGPU: calcolo di uso generale su processori grafici", [
      "Una GPU ha migliaia di core semplici costruiti per fare la stessa operazione su molti dati insieme",
      "Sommare N elementi richiede solo log2 N passi paralleli invece di N passi sequenziali",
      "Lo stesso hardware che disegna i videogiochi oggi addestra le reti neurali",
      "Sotto ogni core ci sono pur sempre registri, istruzioni e bit",
    ], "Figura dalla presentazione originale: una somma parallela (riduzione) sui core di una GPU.", { img: "gpgpu_sum.png", cap: "Una somma parallela sui core di una GPU: log2 N passi", wide: true }),
    DEF("Data mining", "Data mining", "L'insieme delle tecniche e delle metodologie per estrarre informazione o conoscenza da grandi quantità di dati.", [
      "Alberi di decisione e classificazione",
      "Apprendimento di regole e metodi bayesiani",
      "Reti neurali e riconoscimento di schemi",
    ]),
    T("Algoritmi e calcolabilità", [
      "Un problema è calcolabile se si può risolvere con un algoritmo",
      ["La macchina di Turing", ["un calcolatore ideale dotato di programma, espresso matematicamente con insiemi, relazioni e funzioni"]],
      ["La macchina di von Neumann", ["l'architettura di calcolo capace di eseguire un programma che realizza un algoritmo per la macchina di Turing"]],
      "Un problema che nessun algoritmo su una macchina di Turing può risolvere non può essere risolto da alcun calcolatore",
    ], "L'ultima riga è la tesi di Church-Turing, enunciata in modo informale. Il problema della fermata è l'esempio classico di problema non calcolabile.", { big: "?", label: "Non ogni problema ha un algoritmo: ad alcune domande nessun calcolatore risponderà mai" }),
    C("Cinque proprietà di un algoritmo", [
      ["Atomico", "I passi sono elementari: non si possono scomporre ulteriormente."],
      ["Non ambiguo", "Ogni passo è interpretato in un solo modo, diretto, dall'esecutore, umano o macchina."],
      ["Finito", "Un numero finito di passi e una quantità finita di dati in ingresso."],
      ["Terminante", "L'esecuzione finisce dopo un tempo finito."],
      ["Efficace", "L'esecuzione porta a un risultato unico e ben definito."],
    ], "Un'istruzione RISC-V è il modello di un passo atomico e non ambiguo: il suo significato è fissato dalla specifica, bit per bit."),
    V("Algoritmi deterministici e non deterministici",
      ["Deterministici", ["Per ogni istruzione esiste, a parità di ingresso, un solo passo successivo", "Il percorso dell'algoritmo esiste ed è unico: y = f(x)", "Esempio: la conversione di un'unità di misura", "Esempio: first_update, che somma sempre uno"]],
      ["Non deterministici", ["A parità di ingresso possono comportarsi in modo diverso a ogni esecuzione", "Gli algoritmi probabilistici usano un generatore di numeri casuali", "Gli algoritmi concorrenti possono dipendere dai tempi (race condition)", "Esempio: un gioco che piazza il nemico con prg32_random_number"]]),
    K("Un algoritmo probabilistico: n è primo?", `is_probably_prime(n):
    repeat 30 times:
        a = random(2, n - 2)
        if a^(n-1) mod n != 1:
            return COMPOSITE          # certain
    return PROBABLY PRIME             # almost certain

random_walk():
    while t < t_final:
        r = random(-1, 1)
        x = x + r * u                 # a different path every run
        y = y + r * v
        t = t + 1`, [
      "La prima risposta è sempre giusta; la seconda è giusta con probabilità schiacciante",
      "Barattare una minima probabilità d'errore con un enorme guadagno di velocità: così la crittografia reale verifica i primi",
      "Un cammino casuale dà un risultato diverso a ogni esecuzione: le simulazioni ne mediano molti",
    ], "Il test di Fermat mostrato qui è il più semplice; le librerie reali usano Miller-Rabin, che ne chiude le falle. Entrambi gli esempi vengono dalla slide originale.", "txt"),
    T("Machine learning", [
      "Un metodo di analisi dei dati che automatizza la costruzione di un modello analitico",
      "Il calcolatore trova schemi nascosti senza essere programmato esplicitamente su dove cercare",
      ["I modelli generativi di oggi sono la stessa idea su scala enorme", ["un grande modello linguistico prevede il prossimo frammento di testo a partire da miliardi di numeri appresi"]],
      "Quei numeri sono bit in memoria, moltiplicati e sommati da processori: l'argomento di questo corso",
      "Un modello può sbagliare con grande sicurezza: per controllarlo servono i fondamenti",
    ], "L'ultimo punto si collega alla regola #nogpt del corso: l'esame verifica che i fondamenti stiano nella testa dello studente.", { big: "y = f(x)", label: "Un programma classico è scritto da una persona. Nel machine learning, f si impara dagli esempi." }),

    Q("Quanti valori diversi può rappresentare un byte?", ["8", "16", "255", "256"], 3, "Un byte sono 8 bit: 2^8 = 256 configurazioni, per esempio i naturali da 0 a 255."),
    Q("Il colore PRG32 0xF81F è:", ["rosso", "magenta", "ciano", "giallo"], 1, "0xF81F = 11111 000000 11111: rosso e blu al massimo, verde a zero: magenta."),
    Q("Quanti byte occupa in memoria .asciz \"CIAO\"?", ["3", "4", "5", "8"], 2, "Quattro caratteri più il byte di terminazione a zero."),
    Q("Su RISC-V, .word 0x0000ABCD è memorizzata all'indirizzo A. Quale byte si trova all'indirizzo A?", ["0x00", "0xAB", "0xCD", "0xDC"], 2, "RISC-V è little-endian: il byte meno significativo, 0xCD, va all'indirizzo più basso."),
    X("Esercizi su PRG32", [
      "Colorate di magenta la barra della Lezione 02, poi di un grigio scuro a scelta: calcolate prima a mano il valore RGB565",
      "Stampate il vostro nome con prg32_gfx_text8. Quanti byte occupa la stringa?",
      "Dichiarate con .word un vettore di quattro colori e disegnate quattro barre, una per colore, leggendo ogni colore con lw",
      "In PRG32-QT aprite la vista della memoria sulla stringa e sul vettore: trovate lo zero finale e verificate l'ordine dei byte",
    ], "Quattro barre in quattro colori; nella vista della memoria la stringa finisce con 00 e ogni .word mostra per primo il byte meno significativo.",
      "Esempio di grigio scuro: rosso 8 su 31, verde 16 su 63, blu 8 su 31 = 01000 010000 01000 = 0x4208, il GREY del laboratorio del libro di PRG32."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["bit / byte / word", "bit / byte / parola", "string", "stringa"],
      ["positional notation", "notazione posizionale", "array", "vettore (array)"],
      ["hexadecimal", "esadecimale", "linked list", "lista concatenata"],
      ["sampling", "campionamento", "stack", "pila"],
      ["quantisation", "quantizzazione", "tree", "albero"],
      ["byte order (endianness)", "ordinamento dei byte", "machine learning", "apprendimento automatico"],
    ], null, { widths: [3.4, 3, 3, 3.2] }),
    T("Conclusioni e letture", [
      "L'informazione digitale è una configurazione di bit più una convenzione per leggerla",
      "Gli stessi sedici bit possono essere un numero, un colore o due caratteri: decide il programma",
      "L'esadecimale è una scrittura compatta del binario, quattro bit per cifra",
      "Il testo è fatto di numeri (ASCII, UTF-8); le strutture sono byte più una regola per trovare l'elemento successivo",
      "I dati sono la moneta di questo regno; gli algoritmi trasformano i dati in informazione utile alle decisioni",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 2.4 e 2.9", "Charles Petzold: Code, i capitoli su bit, byte e testo", "Sebastian Raschka: Machine Learning with Python (suggerito nel corso originale)"]],
    ], "Prossima lezione: la rappresentazione dei numeri, in modo formale."),
  ],
});
