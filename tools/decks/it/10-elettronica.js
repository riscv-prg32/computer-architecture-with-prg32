// Italian version of decks/en/10-electronics.js: same slides, same listings, text in Italian.
// Lecture 10 - Introduction to electronics and digital electronics (new in 2026/27).
// No Italian source deck: written to bridge Boolean algebra (06, 07) and combinational machines (09).
// Electrical figures for the kit come from the ESP32-C6 datasheet v1.5 (table 5-4) and the PRG32 hardware docs.
const E8 = require("../../lib/circuit");

function ledCircuitSvg() {
  const W = E8.wire;
  return E8.doc(360, 300,
    W([[70, 40], [270, 40]]) + W([[70, 260], [270, 260]]) +
    E8.battery(70, 40, 220, "3.3 V") + E8.resistor(270, 40, 100, { label: "R" }) + E8.led(270, 140, 120) +
    `<path d="M150,28 h50" stroke="#C7791B" stroke-width="2.5" marker-end="url(#ar)"/><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#C7791B"/></marker></defs>` +
    E8.text(175, 18, "I", { anchor: "middle", size: 16, fill: "#C7791B" }) + E8.text(296, 215, "circa 2 V", { size: 13, bold: false, fill: "#5B6B78" }));
}

function dividerSvg() {
  const W = E8.wire;
  return E8.doc(300, 320,
    E8.vdd(120, 30, "Vdd") + W([[120, 30], [120, 50]]) + E8.resistor(120, 50, 90, { label: "R1" }) + E8.resistor(120, 170, 90, { label: "R2" }) +
    W([[120, 140], [120, 170]]) + E8.dot(120, 155) + W([[120, 155], [215, 155]]) + E8.text(222, 160, "Vout", { size: 16 }) +
    W([[120, 260], [120, 280]]) + E8.ground(120, 280));
}

function pullupSvg(pressed) {
  const W = E8.wire, x = 95;
  return E8.doc(250, 330,
    `<rect x="8" y="10" width="234" height="162" rx="10" fill="#fff" stroke="#C9D2D8" stroke-width="2" stroke-dasharray="6 5"/>` + E8.text(18, 30, "dentro il chip", { size: 13, bold: false, fill: "#5B6B78" }) +
    E8.vdd(x, 58) + W([[x, 58], [x, 66]]) + E8.resistor(x, 66, 84, { label: "45 kΩ" }) +
    W([[x, 150], [x, 196]]) + E8.dot(x, 160) + W([[x, 160], [150, 160]]) +
    `<polygon points="150,146 150,174 176,160" fill="#D8ECEE" stroke="#1B2530" stroke-width="2.2"/>` + W([[176, 160], [200, 160]]) +
    E8.text(208, 168, pressed ? "0" : "1", { size: 24, fill: pressed ? "#B23A48" : "#2F7D4F" }) +
    `<circle cx="${x}" cy="196" r="6" fill="#fff" stroke="#1B2530" stroke-width="2.2"/>` + E8.text(x + 14, 201, "piedino", { size: 14, bold: false, fill: "#5B6B78" }) +
    E8.button(x, 202, 86, pressed, pressed ? "premuto" : "rilasciato") + E8.ground(x, 288) +
    E8.text(x - 14, 201, pressed ? "0 V" : "3.3 V", { anchor: "end", size: 17, fill: pressed ? "#B23A48" : "#2F7D4F" }));
}

function inverterSvg() {
  const W = E8.wire;
  return E8.doc(300, 310,
    E8.vdd(156, 34) + W([[156, 34], [156, 74]]) + E8.mos("p", 120, 100, { label: "pMOS" }) + E8.mos("n", 120, 220, { label: "nMOS" }) +
    W([[156, 126], [156, 194]]) + E8.dot(156, 160) + W([[156, 160], [245, 160]]) + E8.text(252, 166, "Y", { size: 18 }) +
    W([[156, 246], [156, 276]]) + E8.ground(156, 276) +
    W([[50, 160], [90, 160]]) + E8.dot(90, 160) + W([[90, 160], [90, 100], [120, 100]]) + W([[90, 160], [90, 220], [120, 220]]) + E8.text(30, 166, "A", { size: 18 }));
}

function nandSvg() {
  const W = E8.wire, lab = (x, y, t) => E8.text(x - 8, y + 6, t, { anchor: "end", size: 17 });
  return E8.doc(390, 370,
    E8.vdd(206, 34) + W([[146, 34], [266, 34]]) + W([[146, 34], [146, 74]]) + W([[266, 34], [266, 74]]) +
    E8.mos("p", 110, 100) + E8.mos("p", 230, 100) + lab(110, 100, "A") + lab(230, 100, "B") +
    W([[146, 126], [146, 152], [266, 152], [266, 126]]) + E8.dot(206, 152) + W([[206, 152], [206, 174]]) +
    E8.mos("n", 170, 200) + E8.mos("n", 170, 270) + lab(170, 200, "A") + lab(170, 270, "B") + W([[206, 226], [206, 244]]) +
    W([[206, 296], [206, 330]]) + E8.ground(206, 330) +
    E8.dot(266, 152) + W([[266, 152], [330, 152]]) + E8.text(337, 158, "Y", { size: 18 }));
}

function norSvg() {
  const W = E8.wire, lab = (x, y, t) => E8.text(x - 8, y + 6, t, { anchor: "end", size: 17 });
  return E8.doc(390, 370,
    E8.vdd(206, 30) + W([[206, 30], [206, 54]]) + E8.mos("p", 170, 80) + E8.mos("p", 170, 150) + lab(170, 80, "A") + lab(170, 150, "B") + W([[206, 106], [206, 124]]) +
    W([[206, 176], [206, 214]]) + E8.dot(206, 214) + W([[146, 240], [146, 214], [266, 214], [266, 240]]) +
    E8.mos("n", 110, 266) + E8.mos("n", 230, 266) + lab(110, 266, "A") + lab(230, 266, "B") +
    W([[146, 292], [146, 316], [266, 316], [266, 292]]) + E8.dot(206, 316) + W([[206, 316], [206, 336]]) + E8.ground(206, 336) +
    E8.dot(266, 214) + W([[266, 214], [330, 214]]) + E8.text(337, 220, "Y", { size: 18 }));
}

function levelsSvg() {
  const top = 30, H = 260, y = (v) => top + H - (v / 3.3) * H, band = (x, v1, v2, col, label) =>
    `<rect x="${x}" y="${y(v2)}" width="130" height="${y(v1) - y(v2)}" fill="${col}"/>` + E8.text(x + 65, (y(v1) + y(v2)) / 2 + 5, label, { anchor: "middle", size: 14, fill: "#fff" });
  const tick = (x, v, anchor) => `<line x1="${x - 6}" y1="${y(v)}" x2="${x + 6}" y2="${y(v)}" stroke="#1B2530" stroke-width="1.5"/>` + E8.text(anchor === "end" ? x - 10 : x + 10, y(v) + 5, String(v) + " V", { anchor, size: 13, bold: false });
  let o = E8.text(145, 18, "uscita", { anchor: "middle", size: 15 }) + E8.text(375, 18, "ingresso", { anchor: "middle", size: 15 });
  o += `<rect x="80" y="${top}" width="130" height="${H}" fill="#EEF2F4"/><rect x="310" y="${top}" width="130" height="${H}" fill="#EEF2F4"/>`;
  o += band(80, 2.64, 3.3, "#2F7D4F", "1") + band(80, 0, 0.33, "#2E4A62", "0");
  o += band(310, 2.475, 3.3, "#2F7D4F", "letto come 1") + band(310, 0, 0.825, "#2E4A62", "letto come 0") + band(310, 0.825, 2.475, "#C7791B", "indefinito");
  o += tick(80, 3.3, "end") + tick(80, 2.64, "end") + tick(80, 0.33, "end") + tick(80, 0, "end") + tick(440, 2.475, "start") + tick(440, 0.825, "start");
  o += `<line x1="210" y1="${y(2.64)}" x2="310" y2="${y(2.475)}" stroke="#5B6B78" stroke-dasharray="4 4"/><line x1="210" y1="${y(0.33)}" x2="310" y2="${y(0.825)}" stroke="#5B6B78" stroke-dasharray="4 4"/>`;
  o += E8.text(260, y(2.56) - 8, "margine", { anchor: "middle", size: 12, bold: false, fill: "#5B6B78" }) + E8.text(260, y(0.58) + 16, "margine", { anchor: "middle", size: 12, bold: false, fill: "#5B6B78" });
  return E8.doc(520, 310, o);
}

Deck({
  n: "10", file: "10-Architettura_dei_Calcolatori-Elettronica",
  title: "Introduzione all'elettronica e all'elettronica digitale", short: "Elettronica ed elettronica digitale",
  sub: "Da volt e transistor alle porte logiche: di che cosa sono fatti uno 0 e un 1",
  quote: ["Ogni tecnologia sufficientemente avanzata è indistinguibile dalla magia.", "Arthur C. Clarke, Profiles of the Future, 1973"],
  cover: "kit_breadboard.png",
  notes: "Lezione nuova del 2026/27, collocata tra l'algebra di Boole e le macchine combinatorie. Dà un corpo fisico alle porte delle Lezioni 08 e 09 prima che la Lezione 11 le componga in macchine. Spirale: il pulsante del kit, letto fin dai primi laboratori, viene seguito dal dito al bit. Non si presuppongono conoscenze di fisica; i numeri del kit vengono dal datasheet dell'ESP32-C6 (tabella 5-4) e dalla documentazione hardware di PRG32.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Usare tensione, corrente, resistenza e potenza, e applicare la legge di Ohm a un circuito semplice",
      "Dimensionare la resistenza di un LED e calcolare un partitore di tensione",
      "Spiegare che cos'è un transistor e come un transistor MOS funziona da interruttore",
      "Dire come le tensioni diventano valori logici, e che cos'è un margine di rumore",
      "Disegnare in CMOS invertitore, NAND e NOR, e contarne i transistor",
      "Spiegare le resistenze di pull-up, gli ingressi flottanti e perché una porta richiede tempo ed energia per commutare",
    ]),

    H("Riscaldamento sulla macchina", "Dal dito al bit."),
    K("Un pulsante, un bit", `    call prg32_input_read    # a0 = one bit per button
    andi t3, a0, 0x01        # bit 0: LEFT
    beqz t3, 1f              # 0: not pressed
    ...                      # 1: pressed
1:

# on the kit:
#   LEFT is a switch between pin GPIO18 and ground
#   pressed  -> the pin is at 0 volts
#   released -> the pin is at 3.3 volts`, [
      "Fin dai primi laboratori un pulsante premuto è un 1 in un registro",
      "Sulla scheda il pulsante è un pezzo di metallo che collega a massa un piedino del chip",
      "Premuto significa 0 volt sul piedino, eppure il programma legge 1",
      "Che cos'è un volt, perché il piedino rilasciato sta a 3,3 V, e chi decide che 0 V è un bit?",
    ], "Collegamenti dalla documentazione hardware di PRG32: ogni pulsante è un interruttore verso GND, e il firmware attiva il pull-up interno di ogni ingresso. Il runtime inverte il livello quando costruisce la maschera (prg32_controller.c): piedino basso quando premuto, bit alto. L'ultima sezione della lezione risponde alle quattro note."),

    H("L'elettricità in quattro grandezze", "Tensione, corrente, resistenza, potenza."),
    G("Quattro grandezze", ["Grandezza", "Simbolo, unità", "Analogia idraulica", "Sul kit"], [
      ["tensione", "V, volt (V)", "la pressione che spinge l'acqua", "3,3 V tra la linea di alimentazione e la massa"],
      ["corrente", "I, ampere (A)", "la portata: litri al secondo", "circa 10 mA in un LED acceso"],
      ["resistenza", "R, ohm (Ω)", "un tubo stretto che ostacola il flusso", "45 kΩ: il pull-up dentro ogni piedino di ingresso"],
      ["potenza", "P, watt (W)", "il lavoro che il flusso può compiere ogni secondo", "al più 2,5 W da una porta USB 2.0 (5 V, 0,5 A)"],
    ], "La carica elettrica è trasportata dagli elettroni; la corrente è carica al secondo. Una tensione è sempre tra due punti: dicendo «il piedino sta a 3,3 V» si intende rispetto a massa, il riferimento comune dell'intero circuito. Prefissi: milli (m) 10^-3, micro (µ) 10^-6, kilo (k) 10^3, mega (M) 10^6.", { widths: [1.8, 2.2, 4, 4.2], caption: "Una tensione si misura sempre tra due punti. La massa (GND) è il riferimento comune: 0 V per definizione." }),
    D("La legge di Ohm, e la resistenza di un LED", async (s, h) => {
      h.card(s, h.MX, h.TOP, 4.6, h.BOT - h.TOP);
      await h.svg(s, ledCircuitSvg(), h.MX + 0.2, h.TOP + 0.2, 4.2, h.BOT - h.TOP - 0.4);
      h.tx(s, "V = R x I", { x: 5.6, y: h.TOP, w: h.W - h.MX - 5.6, h: 0.7, fontSize: 32, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.rows(s, [
        "La corrente in un resistore è proporzionale alla tensione ai suoi capi",
        "Un circuito è un anello chiuso: la corrente esce dalla sorgente, attraversa i componenti e ritorna",
        "Un LED si accende quando lo attraversa corrente, e fa cadere circa 2 V; senza resistenza la corrente sarebbe di gran lunga troppa",
        ["Alla resistenza va ciò che resta: 3,3 - 2 = 1,3 V", ["per 10 mA: R = 1,3 / 0,010 = 130 Ω; il valore commerciale più vicino è 150 Ω"]],
      ], 5.6, h.TOP + 0.9, h.W - h.MX - 5.6, h.BOT - h.TOP - 0.9);
    }, "Georg Ohm, 1827. La tensione diretta di un LED dipende dal colore: circa 1,8-2,2 V per il rosso, circa 3 V per blu e bianco. Con 150 Ω la corrente è 1,3 / 150 = 8,7 mA."),
    D("Serie, parallelo e partitore di tensione", async (s, h) => {
      h.rows(s, [
        ["Serie: la stessa corrente attraversa entrambi i resistori", ["le resistenze si sommano: R = R1 + R2"]],
        ["Parallelo: la stessa tensione è ai capi di entrambi", ["la corrente si divide; la resistenza totale è minore di ciascuna"]],
        ["Due resistori in serie dividono la tensione", ["Vout = Vdd x R2 / (R1 + R2)"]],
        "Resistori uguali danno metà dell'alimentazione; una R2 molto più piccola porta Vout vicino a massa",
        "Leggi di Kirchhoff: le correnti entranti in un nodo sommano a quelle uscenti; le tensioni lungo una maglia sommano a zero",
      ], h.MX, h.TOP, 7.4, h.BOT - h.TOP);
      h.card(s, 8.5, h.TOP, h.W - h.MX - 8.5, h.BOT - h.TOP);
      await h.svg(s, dividerSvg(), 8.7, h.TOP + 0.2, h.W - h.MX - 8.9, h.BOT - h.TOP - 0.4);
    }, "Il partitore è la chiave del circuito di pull-up alla fine della lezione: un pulsante è un resistore che è o infinito (aperto) o quasi zero (chiuso). Parallelo: 1/R = 1/R1 + 1/R2."),
    T("Potenza ed energia", [
      "La potenza è tensione per corrente: P = V x I, in watt",
      "In un resistore diventa calore: P = R x I^2",
      "L'energia è potenza per tempo, in joule; una batteria immagazzina energia",
      "Il LED della slide precedente: 3,3 V x 8,7 mA = 29 mW, di cui 11 mW scaldano la resistenza",
      "Ogni transistor che commuta dentro un processore dissipa un po' di energia: con miliardi di transistor, il calore è il limite dei chip moderni",
    ], "La batteria di un telefono, 15 Wh, contiene 54.000 J. Il processore di un portatile dissipa decine di watt in pochi centimetri quadrati.", { big: "P = V x I", label: "ciò che un circuito consuma, e ciò di cui deve liberarsi come calore" }),
    T("Il condensatore: perché i segnali richiedono tempo", [
      "Un condensatore immagazzina carica elettrica, come un serbatoio l'acqua; la capacità si misura in farad (F)",
      "La sua tensione non può saltare: va riempito, o svuotato, attraverso una resistenza",
      ["Il tempo necessario è dell'ordine di R x C", ["45 kΩ x 2 pF = 90 ns: il tempo che serve a un piedino di ingresso del kit per salire attraverso il suo pull-up"]],
      "Ogni filo e ogni ingresso di transistor è un piccolo condensatore: da qui nasce il ritardo di propagazione di una porta",
      "Un condensatore carico o scarico è anche un modo di memorizzare un bit: la cella DRAM della Lezione 15",
    ], "RC è la costante di tempo: dopo RC la tensione ha percorso circa il 63% della strada. Capacità di un piedino dell'ESP32-C6: 2 pF tipici (datasheet). Fili e pulsante ne aggiungono altra, quindi il valore reale è maggiore.", { big: "R x C", label: "resistenza per capacità è un tempo: la ragione per cui in un circuito nulla è istantaneo" }),

    H("Semiconduttori", "Il materiale che a comando è conduttore o isolante."),
    T("Conduttori, isolanti, semiconduttori", [
      "I conduttori, come il rame, lasciano scorrere liberamente la carica; gli isolanti, come il vetro, no",
      "I semiconduttori, primo fra tutti il silicio, stanno in mezzo, e la loro conduzione si può controllare",
      ["Drogaggio: aggiungere pochi atomi di un altro elemento", ["il silicio di tipo n ha elettroni in più, portatori negativi", "il silicio di tipo p ha elettroni mancanti, le lacune, che si comportano da portatori positivi"]],
      "Dove una regione p incontra una regione n c'è una giunzione: il mattone di ogni dispositivo",
      "Un chip è una fetta di silicio con miliardi di regioni drogate, collegate da strati di metallo",
    ], "Il silicio è il secondo elemento più abbondante della crosta terrestre: sabbia. L'intera industria si regge sul purificarlo e drogarlo con estrema precisione.", { big: "Si", label: "silicio: elemento 14, un semiconduttore, la materia prima di quasi tutti i chip" }),
    T("Il diodo e il LED", [
      "Una sola giunzione fa un diodo: una valvola a senso unico per la corrente",
      "In diretta, da p a n, conduce quando la tensione supera una soglia: circa 0,7 V per il silicio",
      "In inversa, blocca",
      "Un diodo a emissione di luce emette luce quando conduce; il colore dipende dal materiale, e così la soglia",
      "In un calcolatore i LED sono ovunque: spie, la retroilluminazione del display della Lezione 21, collegamenti ottici",
    ], "I diodi trasformano la corrente alternata in continua in ogni alimentatore. Anche il laser dei dischi ottici della Lezione 16 è un diodo.", { big: "senso unico", label: "un diodo lascia passare la corrente in una sola direzione" }),
    G("Il transistor: un interruttore senza parti mobili", ["Anno", "Chi", "Che cosa"], [
      ["1947", "Bardeen, Brattain e Shockley, Bell Labs", "il primo transistor: sostituisce la valvola termoionica"],
      ["1958-59", "Jack Kilby; Robert Noyce", "il circuito integrato: più transistor su un solo pezzo di semiconduttore"],
      ["1959-60", "Atalla e Kahng, Bell Labs", "il transistor MOS: piccolo, semplice da costruire, quasi nessuna corrente di controllo"],
      ["1963", "Wanlass e Sah, Fairchild", "CMOS: coppie di transistor MOS complementari che assorbono potenza solo quando commutano"],
      ["1971", "Intel 4004", "2300 transistor MOS: un processore su un chip"],
      ["oggi", "l'intera industria", "decine di miliardi di transistor CMOS su un chip"],
    ], "Un transistor è un dispositivo a tre terminali in cui un piccolo segnale su uno controlla la corrente tra gli altri due. Usato come amplificatore ha reso portatile la radio; usato come interruttore ha reso possibile il calcolatore. Valvole e relè facevano lo stesso lavoro nei primi calcolatori della Lezione 03, un milione di volte più grandi e più lenti.", { widths: [1.4, 4.6, 6.2] }),
    D("Il transistor MOS come interruttore", async (s, h) => {
      const W = E8.wire, sym = (type) => E8.doc(150, 120, E8.mos(type, 30, 60) + W([[66, 34], [66, 12]]) + W([[66, 86], [66, 108]]) + E8.text(20, 66, "G", { anchor: "end", size: 15 }));
      h.card(s, h.MX, h.TOP, 3.3, 2.5); h.card(s, h.MX, h.TOP + 2.7, 3.3, 2.5);
      await h.svg(s, sym("n"), h.MX + 0.2, h.TOP + 0.45, 2.9, 1.9); await h.svg(s, sym("p"), h.MX + 0.2, h.TOP + 3.15, 2.9, 1.9);
      h.tx(s, "nMOS", { x: h.MX + 0.2, y: h.TOP + 0.08, w: 2, h: 0.35, fontSize: 16, bold: true, color: P.teal }); h.tx(s, "pMOS", { x: h.MX + 0.2, y: h.TOP + 2.78, w: 2, h: 0.35, fontSize: 16, bold: true, color: P.amber });
      h.table(s, 4.4, h.TOP, [2.2, 3.1, 3.03], ["Tensione di gate", "nMOS", "pMOS"], [["alta (1)", "conduce: interruttore chiuso", "blocca: interruttore aperto"], ["bassa (0)", "blocca: interruttore aperto", "conduce: interruttore chiuso"]], { fs: 16, rowH: 0.55, cellHi: { "0,1": P.greenSoft, "1,2": P.greenSoft } });
      h.rows(s, [
        "Tre terminali: il gate controlla se la corrente può passare tra gli altri due, source e drain",
        "Il gate è isolato: non assorbe praticamente corrente, solo la minuscola carica della sua capacità",
        "I due tipi sono complementari: ciò che chiude l'uno apre l'altro",
        "L'nMOS passa bene lo 0 (collega a massa); il pMOS passa bene l'1 (collega all'alimentazione)",
      ], 4.4, h.TOP + 1.9, h.W - h.MX - 4.4, h.BOT - h.TOP - 1.9);
    }, "MOS: metallo, ossido, semiconduttore, i tre strati del gate. Il cerchietto sul gate del pMOS significa, come nei simboli logici, «attivo quando è basso». Corrente di ingresso di un piedino dell'ESP32-C6: al più 50 nA (datasheet)."),

    H("Dai volt ai bit", "L'elettronica digitale."),
    D("Livelli logici: quando una tensione è un 1?", async (s, h) => {
      h.card(s, h.MX, h.TOP, 6.3, h.BOT - h.TOP);
      await h.svg(s, levelsSvg(), h.MX + 0.15, h.TOP + 0.3, 6.0, h.BOT - h.TOP - 0.6);
      h.rows(s, [
        "Un circuito digitale usa due intervalli di tensione: basso è 0, alto è 1",
        ["Un'uscita garantisce livelli puliti", ["sul kit: sopra 2,64 V per un 1, sotto 0,33 V per uno 0"]],
        ["Un ingresso accetta intervalli più ampi", ["sopra 2,475 V legge 1, sotto 0,825 V legge 0"]],
        "La differenza è il margine di rumore: un disturbo più piccolo non può cambiare il bit",
        "In mezzo il valore è indefinito: i segnali devono attraversare quella fascia in fretta e non restarci mai",
      ], 7.4, h.TOP, h.W - h.MX - 7.4, h.BOT - h.TOP);
    }, "Datasheet dell'ESP32-C6, tabella 5-4, con VDD = 3,3 V: VOH min 0,8 VDD, VOL max 0,1 VDD, VIH min 0,75 VDD, VIL max 0,25 VDD. Margini di rumore: 2,64 - 2,475 = 0,165 V in alto, 0,825 - 0,33 = 0,495 V in basso. È la soglia «metà della tensione di alimentazione» della Lezione 13, resa precisa."),
    V("Perché digitale?",
      ["Circuiti analogici", ["L'informazione è il valore esatto della tensione", "Ogni stadio aggiunge un po' di rumore e distorsione, e si accumulano", "Le copie peggiorano a ogni generazione", "Ancora indispensabili ai bordi: sensori, radio, suono"]],
      ["Circuiti digitali", ["Conta solo l'intervallo: alto o basso", "Ogni porta ripristina i livelli: il rumore non si accumula", "Le copie sono perfette, e gli errori si possono rilevare e correggere (Lezione 11)", "Due livelli si distinguono facilmente con transistor veloci, minuscoli ed economici"]],
      "La storia analogico-digitale della Lezione 04, vista dal filo. L'amplificatore audio e la radio del kit sono i bordi analogici di un sistema per il resto digitale."),
    D("L'invertitore CMOS: una porta NOT con due transistor", async (s, h) => {
      h.card(s, h.MX, h.TOP, 4.9, h.BOT - h.TOP);
      await h.svg(s, inverterSvg(), h.MX + 0.2, h.TOP + 0.15, 4.5, h.BOT - h.TOP - 0.3);
      h.table(s, 6.0, h.TOP, [0.8, 1.5, 1.5, 2.93], ["A", "pMOS", "nMOS", "Y"], [["0", "acceso", "spento", "1: collegata a 3,3 V"], ["1", "spento", "acceso", "0: collegata a massa"]], { fs: 15, mono: [0], align: "center", rowH: 0.5, cellHi: { "0,1": P.greenSoft, "1,2": P.greenSoft } });
      h.rows(s, [
        "Un pMOS verso l'alimentazione, un nMOS verso massa, pilotati dallo stesso ingresso",
        "Conduce esattamente uno dei due: l'uscita è sempre collegata a una linea, mai a entrambe",
        "A ingresso fermo non scorre corrente dall'alimentazione a massa: a riposo il CMOS non consuma quasi nulla",
        "L'uscita è un livello fresco e pulito, qualunque sia la qualità dell'ingresso: la porta rigenera il segnale",
      ], 6.0, h.TOP + 1.8, h.W - h.MX - 6.0, h.BOT - h.TOP - 1.8);
    }, "CMOS: MOS complementare. Y = A'. La rete di pull-up (pMOS) e la rete di pull-down (nMOS) sono l'una la duale dell'altra, come nel principio di dualità della Lezione 08."),
    D("NAND e NOR in CMOS", async (s, h) => {
      const w = (h.CW - 0.4) / 2;
      h.card(s, h.MX, h.TOP, w, 4.25); h.card(s, h.MX + w + 0.4, h.TOP, w, 4.25);
      h.tx(s, "NAND:  Y = (A . B)'", { x: h.MX + 0.25, y: h.TOP + 0.1, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.teal });
      h.tx(s, "NOR:  Y = (A + B)'", { x: h.MX + w + 0.65, y: h.TOP + 0.1, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.amber });
      await h.svg(s, nandSvg(), h.MX + 0.2, h.TOP + 0.5, w - 0.4, 3.7); await h.svg(s, norSvg(), h.MX + w + 0.6, h.TOP + 0.5, w - 0.4, 3.7);
      h.rows(s, ["NAND: due nMOS in serie, a massa solo se A AND B valgono 1; due pMOS in parallelo, a 3,3 V se uno vale 0",
        "NOR: il duale. Parallelo e serie si scambiano, come De Morgan scambia AND e OR"], h.MX, 5.95, h.CW, 0.8);
    }, "Serie è AND, parallelo è OR: l'idea dei circuiti a commutazione di Nakajima e Shannon (Lezione 03). Quattro transistor ciascuna. Chiedere all'aula di verificare sul disegno le quattro combinazioni di ingresso."),
    G("Quanto costano le porte, in transistor", ["Circuito", "Transistor", "Osservazione"], [
      ["NOT", "2", "l'invertitore CMOS"],
      ["NAND, NOR (2 ingressi)", "4", "le porte naturali del CMOS"],
      ["AND, OR (2 ingressi)", "6", "un NAND o un NOR seguito da un invertitore"],
      ["XOR (2 ingressi)", "da 8 a 12 circa", "secondo il progetto"],
      ["sommatore completo", "circa 28", "il classico sommatore CMOS statico"],
      ["cella SRAM, un bit", "6", "due invertitori ad anello e due transistor di accesso"],
      ["flip-flop D", "circa 20", "due latch, master e slave"],
    ], "Ecco perché NAND è la porta universale della Lezione 09 in pratica oltre che in teoria: un AND costa più di un NAND. I conteggi valgono per il CMOS statico convenzionale e variano con lo stile di progetto. Trentadue sommatori completi: circa 900 transistor per l'addizionatore che sta dietro l'istruzione add.", { widths: [3.4, 2.4, 6.4], caption: "AND costa più di NAND: in CMOS vengono prima le porte invertenti. Minimizzare una funzione significa risparmiare transistor, area, energia e tempo." }),
    T("Commutare costa tempo ed energia", [
      "L'uscita di una porta pilota gli ingressi delle porte successive, che sono piccoli condensatori",
      "Per cambiare livello l'uscita deve caricarli o scaricarli attraverso la resistenza dei suoi transistor: è il ritardo di propagazione",
      ["Ogni cambio di livello costa energia", ["la potenza spesa nel commutare è circa C x V^2 x f"]],
      "Abbassare la tensione di alimentazione è ciò che fa risparmiare di più: per questo i chip sono passati da 5 V a 3,3 V a circa 1 V all'interno",
      "Alzare la frequenza di clock alza il consumo in proporzione: la velocità si paga in calore",
    ], "C la capacità commutata, V l'alimentazione, f la frequenza di commutazione. Il ritardo di propagazione ritorna nella Lezione 11 come percorso critico, e nella Lezione 13 come ragione del clock. L'ESP32-C6 ha un'alimentazione a 3,3 V per i piedini e una tensione interna più bassa per la logica.", { big: "C x V^2 x f", label: "potenza dinamica: capacità, quadrato della tensione, e quanto spesso si commuta" }),
    G("Scale di integrazione", ["Scala", "Transistor per chip", "Esempi"], [
      ["SSI, piccola", "fino a circa 100", "poche porte: la serie 74, come quattro NAND in un contenitore"],
      ["MSI, media", "centinaia", "decodificatori, multiplexer, contatori, registri: le macchine delle Lezioni da 11 a 14"],
      ["LSI, grande", "migliaia", "i primi microprocessori e le prime memorie: Intel 4004"],
      ["VLSI, molto grande", "da centinaia di migliaia in su", "i processori degli anni Ottanta e Novanta"],
      ["oggi", "decine di miliardi", "sistemi su chip: processore, memoria, radio e periferiche insieme"],
    ], "L'ESP32-C6 del kit è un sistema su chip in un contenitore di pochi millimetri. I chip della serie 74 (7400 NAND, 74139 decodificatore, 74273 registro) ricompaiono nelle prossime lezioni come forma storica di ciascun blocco.", { widths: [2.2, 3.6, 6.4] }),

    H("Ritorno alla macchina", "Il pulsante, spiegato."),
    D("Pull-up: un ingresso mai lasciato flottante", async (s, h) => {
      const w = 3.0;
      h.card(s, h.MX, h.TOP, w, h.BOT - h.TOP); h.card(s, h.MX + w + 0.25, h.TOP, w, h.BOT - h.TOP);
      await h.svg(s, pullupSvg(false), h.MX + 0.1, h.TOP + 0.15, w - 0.2, h.BOT - h.TOP - 0.3); await h.svg(s, pullupSvg(true), h.MX + w + 0.35, h.TOP + 0.15, w - 0.2, h.BOT - h.TOP - 0.3);
      h.rows(s, [
        "Un ingresso collegato a nulla è flottante: raccoglie rumore e legge 0 o 1 a caso",
        "Una resistenza di pull-up lega il piedino a 3,3 V: rilasciato, non scorre corrente, e il piedino legge un 1 pulito",
        ["Premuto, l'interruttore collega il piedino a massa: 0 V, uno 0 pulito", ["scorre una corrente di 3,3 V / 45 kΩ = 73 µA, troppo piccola per contare"]],
        "È un partitore di tensione il cui resistore inferiore è o infinito o zero",
        "Il firmware inverte il bit, così nel vostro programma premuto vale 1",
      ], h.MX + 2 * w + 0.6, h.TOP, h.W - 2 * h.MX - 2 * w - 0.6, h.BOT - h.TOP);
    }, "Pull-up debole interno dell'ESP32-C6: 45 kΩ tipici (datasheet). Il firmware lo attiva su ogni piedino dei pulsanti (prg32_input.c) e legge i piedini invertiti (prg32_controller.c). Il triangolo è il buffer di ingresso del piedino. Si chiama logica attiva bassa."),
    G("Dal dito al bit", ["Passo", "Che cosa accade", "Dove è spiegato"], [
      ["1", "il dito chiude l'interruttore tra GPIO18 e massa", "questa lezione: il circuito"],
      ["2", "il piedino scende da 3,3 V a 0 V, in molto meno di un microsecondo", "questa lezione: R x C"],
      ["3", "il buffer di ingresso vede una tensione sotto 0,825 V: uno 0 logico", "questa lezione: livelli logici"],
      ["4", "il livello è campionato in un flip-flop del registro di ingresso", "Lezione 13: macchine sequenziali"],
      ["5", "il firmware legge quel registro con un'istruzione di load", "Lezione 15: ingresso/uscita mappato in memoria"],
      ["6", "inverte il bit e lo impacchetta con gli altri in a0", "Lezione 08: maschere; Lezione 21: dispositivi di ingresso"],
      ["7", "il vostro programma lo esamina: andi t3, a0, 0x01", "Lezione 02: primo contatto"],
    ], "I contatti di un interruttore reale rimbalzano per qualche millisecondo quando si chiudono: leggere i pulsanti una volta per frame, ogni poche decine di millisecondi, nasconde il rimbalzo (Lezione 21).", { widths: [0.9, 7.1, 4.2] }),
    T("Il kit come circuito", [
      "Una breadboard: fori collegati a file sul retro, così i componenti si connettono senza saldature",
      "Due lunghe linee portano l'alimentazione: 3,3 V e massa; una linea separata porta i 5 V per gli amplificatori audio",
      "Ogni parte condivide la stessa massa: senza un riferimento comune, le tensioni di due parti non significano nulla l'una per l'altra",
      "I pulsanti vanno da un piedino a massa; display e amplificatori ricevono segnali digitali da altri piedini",
      "Un piedino di uscita può accendere un LED attraverso una resistenza; un piedino di ingresso ascolta soltanto",
    ], "Schema dal repository di PRG32 (docs/hardware/images). Un piedino dell'ESP32-C6 può erogare qualche decina di milliampere: a un LED serve la sua resistenza in serie, come calcolato prima. Mai collegare direttamente a massa un piedino pilotato alto.", { img: "kit_breadboard.png", cap: "Il kit PRG32 su breadboard (documentazione hardware di PRG32)", wide: true }),

    Q("Un LED fa cadere 2 V e deve portare 5 mA da un piedino a 3,3 V. Quale resistenza serve?", ["26 Ω", "260 Ω", "400 Ω", "660 Ω"], 1, "R = (3,3 - 2) / 0,005 = 260 Ω."),
    Q("In un invertitore CMOS con l'ingresso a 0:", ["entrambi i transistor conducono", "il pMOS conduce e l'uscita vale 1", "l'nMOS conduce e l'uscita vale 0", "nessuno conduce e l'uscita è flottante"], 1, "Un gate basso chiude il pMOS, che collega l'uscita all'alimentazione; l'nMOS è aperto."),
    Q("Quanti transistor richiede un AND a due ingressi in CMOS statico?", ["2", "4", "6", "8"], 2, "Un NAND (4) seguito da un invertitore (2)."),
    Q("Perché l'ingresso del pulsante del kit ha bisogno di una resistenza di pull-up?", ["Per limitare la corrente del LED", "Perché il piedino legga un 1 definito quando il pulsante è rilasciato", "Per rendere il pulsante più veloce", "Per proteggere il chip dai 5 V"], 1, "Senza, il piedino rilasciato sarebbe flottante; il pull-up lo lega a 3,3 V, e l'interruttore premuto prevale portandolo a massa."),
    X("Esercizi: prima su carta, poi sul kit", [
      "Un LED blu fa cadere 3,0 V: quale resistenza dà 2 mA da 3,3 V? Quale potenza dissipa la resistenza?",
      "Un partitore con R1 = 10 kΩ e R2 = 20 kΩ su 3,3 V: calcolate Vout. Un ingresso del kit lo legge come 0, come 1, o è indefinito?",
      "Disegnate in CMOS un NAND a tre ingressi e contatene i transistor",
      "Verificate il disegno del NOR per le quattro combinazioni di ingresso, segnando quali transistor conducono",
      "Su PRG32 eseguite la cartuccia delle lampade e collegate a massa con un filo il piedino di un pulsante: spiegate ciò che vedete, e che cosa accadrebbe con il pull-up disattivato",
    ], "Su carta: 150 Ω e 0,6 mW; Vout = 2,2 V, nella fascia indefinita. Sul kit: la lampada si accende esattamente come se il pulsante fosse premuto.",
      "Esercizio 1: (3,3 - 3,0) / 0,002 = 150 Ω; P = 0,3 x 0,002 = 0,6 mW. Esercizio 2: 3,3 x 20 / 30 = 2,2 V, tra 0,825 e 2,475. Esercizio 3: tre pMOS in parallelo, tre nMOS in serie: sei transistor. La cartuccia delle lampade è il passo 1 del laboratorio 06 del libro di PRG32."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["voltage", "tensione", "logic level", "livello logico"],
      ["current", "corrente", "noise margin", "margine di rumore"],
      ["resistor / resistance", "resistore / resistenza", "pull-up resistor", "resistenza di pull-up"],
      ["capacitor", "condensatore", "floating input", "ingresso flottante"],
      ["ground", "massa", "propagation delay", "ritardo di propagazione"],
      ["semiconductor, doping", "semiconduttore, drogaggio", "integrated circuit", "circuito integrato"],
      ["gate, source, drain", "gate, source, drain", "breadboard", "basetta sperimentale (breadboard)"],
    ], null, { widths: [3, 3.2, 3, 3.6] }),
    T("Conclusioni e letture", [
      "La tensione spinge, la corrente scorre, la resistenza ostacola: V = R x I descrive quasi tutto ciò che serve a un progettista digitale",
      "Un transistor MOS è un interruttore comandato da una tensione; nMOS e pMOS sono complementari",
      "Un bit è un intervallo di tensioni; margini di rumore e rigenerazione rendono affidabili i circuiti digitali",
      "Le porte CMOS sono coppie di reti di interruttori; le porte invertenti NAND e NOR sono le più economiche",
      "Commutare costa tempo (R x C) ed energia (C x V^2 x f): i limiti fisici dietro ogni clock",
      ["Letture", ["Charles Petzold: Code, i capitoli dalla torcia elettrica alle porte logiche", "Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 1.5, 1.7 e appendice A", "Repository di PRG32: docs/hardware/hardware.md"]],
    ], "Prossima lezione: le macchine combinatorie, costruite con queste porte."),
  ],
});
