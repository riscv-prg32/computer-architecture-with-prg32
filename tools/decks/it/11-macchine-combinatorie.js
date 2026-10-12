// Italian version of decks/en/11-combinational-machines.js: same slides, same listings, text in Italian.
// Lecture 11 - Combinational machines.
// Sources: 09 and 10 - Macchine per il trattamento dei codici (codes, encoders, decoders, multiplexers,
// comparators, parity) and the taxonomy of 08 - Macchine sequenziali.  Figures redrawn; RISC-V is the reference processor.
const G7 = require("../../lib/gates");

function decoderSvg() {
  const ys = [40, 100, 160, 220], rail = { A: 60, An: 130, B: 170, Bn: 240 }, terms = [["An", "Bn"], ["A", "Bn"], ["An", "B"], ["A", "B"]];
  let w = G7.wire([[14, 40], [60, 40], [60, 231]]) + G7.wire([[60, 40], [70, 40]], true) + G7.wire([[116, 40], [130, 40], [130, 171]]) +
    G7.wire([[14, 290], [170, 290], [170, 193]]) + G7.wire([[170, 290], [180, 290]], true) + G7.wire([[226, 290], [240, 290], [240, 73]]) +
    G7.gate("not", 70, 18) + G7.gate("not", 180, 268);
  ys.forEach((y, i) => {
    const p = G7.pins("and", 300, y), [ta, tb] = terms[i];
    w += G7.wire([[rail[ta], p.a[1]], p.a], true) + G7.wire([[rail[tb], p.b[1]], p.b], true) + G7.wire([p.out, [392, p.out[1]]]) + G7.gate("and", 300, y) + G7.text(398, p.out[1] + 6, `U${i}`, { size: 17 });
  });
  return G7.doc(440, 315, w + G7.text(0, 34, "A", { size: 18 }) + G7.text(0, 284, "B", { size: 18 }) + G7.text(134, 30, "A'", { size: 12, bold: false, fill: "#5B6B78" }) + G7.text(244, 304, "B'", { size: 12, bold: false, fill: "#5B6B78" }));
}

function mux2Svg() {
  const a0 = G7.pins("and", 200, 40), a1 = G7.pins("and", 200, 140), o = G7.pins("or", 320, 85), n = G7.pins("not", 100, 7);
  return G7.doc(430, 215,
    G7.wire([[30, 73], a0.b]) + G7.wire([[30, 151], a1.a]) + G7.wire([[30, 173], a1.b]) +
    G7.wire([[70, 151], [70, 29], n.a], true) + G7.wire([n.out, [170, 29], [170, 51], a0.a]) +
    G7.wire([a0.out, [290, 62], [290, 96], o.a]) + G7.wire([a1.out, [290, 162], [290, 118], o.b]) + G7.wire([o.out, [400, 107]]) +
    G7.gate("not", 100, 7) + G7.gate("and", 200, 40) + G7.gate("and", 200, 140) + G7.gate("or", 320, 85) +
    G7.text(4, 79, "I0", { size: 17 }) + G7.text(8, 156, "S", { size: 17 }) + G7.text(4, 190, "I1", { size: 17 }) + G7.text(406, 113, "Y", { size: 17 }) +
    G7.text(150, 20, "S'", { size: 12, bold: false, fill: "#5B6B78" }));
}

function comparatorSvg() {
  const x0 = G7.pins("xnor", 120, 20), x1 = G7.pins("xnor", 120, 110), a = G7.pins("and", 260, 65);
  return G7.doc(400, 175,
    G7.wire([[40, 31], x0.a]) + G7.wire([[40, 53], x0.b]) + G7.wire([[40, 121], x1.a]) + G7.wire([[40, 143], x1.b]) +
    G7.wire([x0.out, [225, 42], [225, 76], a.a]) + G7.wire([x1.out, [225, 132], [225, 98], a.b]) + G7.wire([a.out, [350, 87]]) +
    G7.gate("xnor", 120, 20) + G7.gate("xnor", 120, 110) + G7.gate("and", 260, 65) +
    G7.text(8, 36, "A0", { size: 16 }) + G7.text(8, 58, "B0", { size: 16 }) + G7.text(8, 126, "A1", { size: 16 }) + G7.text(8, 148, "B1", { size: 16 }) + G7.text(356, 93, "EQ", { size: 16 }));
}

function sevenSegSvg(lit) {
  const on = "#B23A48", off = "#DDE3E7", seg = (id, x, y, w, h, lx, ly) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${lit.includes(id) ? on : off}"/>` + G7.text(lx, ly, id, { anchor: "middle", size: 15, fill: lit.includes(id) ? "#fff" : "#5B6B78" });
  return G7.doc(170, 270, `<rect width="170" height="270" rx="12" fill="#1B2530"/>` +
    seg("a", 40, 18, 90, 20, 85, 33) + seg("b", 132, 40, 20, 85, 142, 88) + seg("c", 132, 147, 20, 85, 142, 195) + seg("d", 40, 234, 90, 20, 85, 249) +
    seg("e", 18, 147, 20, 85, 28, 195) + seg("f", 18, 40, 20, 85, 28, 88) + seg("g", 40, 126, 90, 20, 85, 141));
}

const box7 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "11", file: "11-Architettura_dei_Calcolatori-Macchine_Combinatorie",
  title: "Macchine combinatorie", short: "Macchine combinatorie",
  sub: "Codici, decodificatori, multiplexer, comparatori, parità: i circuiti con cui è assemblato un processore RISC-V",
  quote: ["...non è colpa mia, le carote hanno toccato i piselli...", "Alan Turing da ragazzo, nel film The Imitation Game, 2014"],
  cover: "game_breakout.png",
  notes: "Spirale: una ricerca in tabella in assembly è un multiplexer; la lezione costruisce poi i blocchi combinatori standard e mostra dove sta ciascuno dentro un processore RISC-V (il corso degli anni precedenti usava come riferimento il Motorola 68000).",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Distinguere una macchina combinatoria da una sequenziale",
      "Calcolare quanti bit richiede un codice a lunghezza fissa, e riconoscere codici incompleti e ridondanti",
      "Progettare un decodificatore e un codificatore, e comporre decodificatori piccoli in decodificatori più grandi",
      "Spiegare che cosa fanno un multiplexer e un demultiplexer, e costruirli con le porte",
      "Costruire un comparatore e una rete di parità, e dire che cosa un controllo di parità può e non può rilevare",
      "Indicare ciascuna di queste macchine dentro un processore RISC-V",
    ]),

    H("Riscaldamento sulla macchina", "Una selezione senza memoria."),
    K("Scegliere uno di quattro colori", `# a0 = selector, 0 to 3      result: a4 = the selected colour

    la   t0, palette         # four words: the data inputs
    slli t1, a0, 2           # selector * 4 bytes
    add  t0, t0, t1          # address of the selected word
    lw   a4, 0(t0)           # the selected input reaches the output

.section .rodata
# red, green, blue, yellow
palette: .word 0xf800, 0x07e0, 0x001f, 0xffe0`, [
      "Lo stesso selettore dà sempre lo stesso colore: il risultato dipende solo dagli ingressi presenti",
      "Nulla viene ricordato da un uso al successivo",
      "In hardware è un multiplexer: quattro ingressi dati, due bit di selezione, un'uscita",
      "Un processore ne contiene decine. Come sono fatti?",
    ], "L'accesso al vettore della Lezione 04, letto come circuito. Nel processore la selezione è fatta da porte in molto meno di un nanosecondo; qui richiede quattro istruzioni."),

    H("Macchine combinatorie", "Uscite che dipendono solo dagli ingressi presenti."),
    V("Una tassonomia dei circuiti digitali",
      ["Circuiti combinatori", ["Il valore delle uscite in un dato istante dipende solo dal valore degli ingressi in quello stesso istante", "Nessuna memoria, nessun anello di retroazione", "Completamente descritti da una tabella di verità", "Esempi: sommatori, decodificatori, multiplexer, la ALU"]],
      ["Circuiti sequenziali", ["Le uscite dipendono dagli ingressi presenti e dalla storia passata degli ingressi", "Richiedono i concetti di tempo e di stato", "Descritti da una tabella degli stati o da un diagramma degli stati", "Esempi: latch, flip-flop, registri, contatori, il processore nel suo insieme (Lezione 13)"]],
      "In inglese: combinational e sequential circuits. La definizione di circuito sequenziale implica tempo e stato: entrambi sono l'argomento della prossima lezione."),
    F("Progettare una macchina combinatoria", [
      "Specifica|che cosa deve fare la macchina, a parole",
      "Tabella di verità|una riga per combinazione di ingressi, indifferenze comprese",
      "Minimizzazione|mappe di Karnaugh o algebra, un'uscita alla volta",
      "Rete|porte, oppure blocchi standard come decodificatori e multiplexer",
    ], "L'analisi procede nel verso opposto: dallo schema alla tabella di verità. Entrambe sono state introdotte nella Lezione 08; il metodo è quello della Lezione 09.",
      "Oltre i quattro o cinque ingressi nessuno disegna mappe: i progettisti compongono blocchi standard, ed è per questo che la lezione ne è un catalogo."),
    T("Le porte reali richiedono tempo", [
      "Una porta non risponde all'istante: la sua uscita si assesta dopo un ritardo di propagazione",
      "Il ritardo di una rete è quello del suo percorso più lento da un ingresso a un'uscita: il percorso critico",
      "Mentre i segnali viaggiano, le uscite possono essere temporaneamente sbagliate",
      "Una macchina combinatoria è corretta solo dopo essersi assestata: qualcosa deve dirci quando guardare",
      "Quel qualcosa è il clock, ed è lì che cominciano le macchine sequenziali",
    ], "In un sommatore a propagazione del riporto (Lezione 09) il percorso critico attraversa tutti e trentadue i sommatori completi. Il periodo di clock di un processore deve essere più lungo del suo percorso critico più lungo.", { big: "ritardo", label: "ogni porta aggiunge un po' di tempo; il percorso più lento attraverso la rete fissa la velocità dell'intera macchina" }),

    H("Codici", "Prima di costruire macchine che trattano codici: che cos'è un codice?"),
    C("Il concetto di informazione", [
      ["Attributo", "Il significato associato all'informazione. Esempio: il voto dell'esame di Architettura dei Calcolatori."],
      ["Tipo", "L'insieme degli elementi tra cui si sceglie il valore. Esempio: i voti da 18 a 30, e il 30 e lode."],
      ["Valore", "L'elemento effettivamente assunto. Esempio: 30. Dare un'informazione significa scegliere un elemento in un insieme definito."],
      ["Cardinalità", "Il numero N di elementi del tipo. Qui N = 14. Un tipo con più elementi porta più informazione."],
      ["Valore e codifica", "Lo stesso valore si può scrivere in molti modi: 3, III, tre. A, B, C, D possono stare per 30 e lode, 30, 29, 28."],
      ["Semplice e strutturato", "I tipi semplici sono atomici: interi, caratteri. I tipi strutturati combinano tipi semplici: una posizione è latitudine e longitudine."],
    ], "Informazione completa: l'attributo assume un valore di un certo tipo. «30 e lode» non è un numero: è un quattordicesimo elemento del tipo, e come scriverlo è un problema di codifica."),
    T("Alfabeti e stringhe", [
      ["Un alfabeto è un insieme finito e non vuoto di simboli", ["binario {0, 1}; decimale {0, ..., 9}; le lettere {a, ..., z}"]],
      "Una stringa, o parola, su un alfabeto è una sequenza finita di suoi simboli",
      ["La lunghezza di una stringa x è il numero dei suoi simboli, indicata con |x|", ["01000010 è una stringa binaria di lunghezza 8"]],
      "La stringa di lunghezza 0 è la stringa vuota",
      "L'insieme di tutte le stringhe su un alfabeto S, compresa quella vuota, si indica con S*",
    ], "Una sequenza infinita 010101... non è una stringa e non appartiene a {0,1}*. «wingardium leviosa» è una stringa di lunghezza 18 sulle lettere e lo spazio.", { big: "S*", label: "tutte le stringhe finite che si possono scrivere con i simboli dell'alfabeto S" }),
    DEF("Codici a lunghezza fissa", "Codice", "Un codice associa a ogni elemento di un tipo sorgente T, di cardinalità N, una stringa di simboli di un alfabeto di codice E con k simboli: la parola codice.", [
      "Lunghezza fissa: ogni parola codice ha la stessa lunghezza m; le parole possibili sono k^m",
      "Per codificare N elementi serve k^m >= N, quindi la lunghezza minima è m = ceil(log_k N)",
      "In binario: m = ceil(log2 N). I quattordici voti d'esame richiedono 4 bit; i 32 registri RISC-V ne richiedono esattamente 5",
      "Codice incompleto: N non è una potenza di k, e restano non assegnate k^m - N parole",
    ], "In inglese: fixed-length code. I cinque bit di un numero di registro sono i campi rd, rs1 e rs2 di un'istruzione RISC-V (Lezione 02). Quattordici voti lasciano 16 - 14 = 2 parole non assegnate."),
    G("Un codice incompleto: il decimale codificato in binario", ["Cifra", "BCD 8421", "Eccesso 3", "Cifra", "BCD 8421", "Eccesso 3"], [
      ["0", "0000", "0011", "5", "0101", "1000"],
      ["1", "0001", "0100", "6", "0110", "1001"],
      ["2", "0010", "0101", "7", "0111", "1010"],
      ["3", "0011", "0110", "8", "1000", "1011"],
      ["4", "0100", "0111", "9", "1001", "1100"],
    ], "Dieci cifre richiedono ceil(log2 10) = 4 bit; sei delle sedici parole non si usano mai: nel BCD 8421 sono da 1010 a 1111. Le parole non usate diventano condizioni di indifferenza quando si progetta un circuito (Lezione 09).", { widths: [1.2, 2, 2, 1.2, 2, 2], mono: [1, 2, 4, 5], fs: 20, align: "center", caption: "Quattro bit per dieci cifre: sei parole codice non sono assegnate. Saranno le indifferenze dei nostri circuiti." }),
    D("Codici ridondanti", (s, h) => {
      h.rows(s, [
        "Un codice ridondante usa più simboli dello stretto necessario: la sua lunghezza è maggiore del minimo m",
        "Solo alcune delle parole possibili sono lecite; le altre non possono essere prodotte dal codificatore",
        "Se arriva una parola non lecita, qualcosa l'ha alterata lungo il percorso: l'errore è rilevato",
        "La ridondanza è il prezzo pagato per rilevare, e a volte correggere, gli errori",
      ], h.MX, h.TOP, 6.5, h.BOT - h.TOP);
      h.table(s, 7.6, h.TOP, [1.3, 1.8, 2.0], ["Elemento", "Codice 1", "Codice 2"], [["A", "00", "000"], ["B", "01", "011"], ["C", "10", "101"], ["D", "11", "110"]], { fs: 17, mono: [1, 2], align: "center", rowH: 0.48 });
      h.card(s, 7.6, h.TOP + 2.75, 5.1, 2.45, P.redSoft);
      h.tx(s, "Il Codice 1 non è ridondante: ogni parola di 2 bit è lecita, quindi un bit alterato trasforma un elemento in un altro senza che nessuno se ne accorga.\nIl Codice 2 aggiunge un terzo bit che rende pari il numero di 1. Le parole 001, 010, 100 e 111 non sono lecite: un singolo bit alterato viene sempre rilevato.", { x: 7.8, y: h.TOP + 2.85, w: 4.7, h: 2.25, fontSize: 14, valign: "middle" });
    }, "La slide originale mostrava la stessa idea con una figura e una diversa scelta delle parole non lecite. Il Codice 2 è il Codice 1 più un bit di parità pari: le macchine di parità vengono più avanti in questa lezione."),
    T("Codici a lunghezza variabile", [
      "La lunghezza della parola codice dipende dall'elemento: agli elementi frequenti vanno parole corte",
      "Proprietà del prefisso: nessuna parola codice è l'inizio di una più lunga, quindi chi legge sa sempre dove finisce una parola",
      "Conviene quando gli elementi non hanno tutti la stessa probabilità: meno spazio in memoria, meno tempo in trasmissione",
      ["Ne avete già incontrati due", ["UTF-8: da uno a quattro byte per carattere (Lezione 04)", "le istruzioni RISC-V sul kit: 16 o 32 bit ciascuna, e i due bit più bassi dicono quale"]],
    ], "RV32IMAC: l'estensione C codifica in 16 bit le istruzioni più comuni. Un'istruzione i cui due bit meno significativi sono 11 è lunga 32 bit; ogni altra configurazione indica un'istruzione a 16 bit. Il codice Morse e la codifica di Huffman sono gli esempi classici.", { big: "11", label: "i due bit più bassi di ogni istruzione RISC-V a 32 bit: la lunghezza è scritta nella parola codice stessa" }),

    H("Decodificatori e codificatori", "Da una parola codice a una linea, e ritorno."),
    T("La rappresentazione decodificata", [
      "Un codice in cui la lunghezza della parola è uguale alla cardinalità N dell'insieme: m = N",
      "Ogni parola codice ha esattamente un bit a 1: una linea per elemento",
      "Semplice da usare, perché la linea attiva seleziona direttamente qualcosa, ma costosa in fili",
      "Codice compatto dentro una parola, rappresentazione decodificata dove una scelta va attuata",
    ], "Detta anche one-hot. Le sette lampade del laboratorio 06 sono una rappresentazione decodificata del numero di bit; le 32 linee di abilitazione alla scrittura dei registri RISC-V ne sono un'altra.", { big: "0 0 1 0", label: "uno su quattro: è attiva la terza linea, quindi è scelto il terzo elemento" }),
    D("Il decodificatore", async (s, h) => {
      h.rows(s, [
        "Riceve una parola codice di m bit e attiva l'unica linea di uscita, su N = 2^m, che le corrisponde",
        "Ogni uscita è un mintermine degli ingressi: un decodificatore li genera tutti",
        "Con un ingresso di abilitazione EN: quando EN = 0 nessuna uscita è attiva",
      ], h.MX, h.TOP, 5.6, 2.4);
      h.table(s, h.MX, 4.15, [0.55, 0.55, 0.7, 0.7, 0.7, 0.7], ["B", "A", "U0", "U1", "U2", "U3"], [["0", "0", "1", "0", "0", "0"], ["0", "1", "0", "1", "0", "0"], ["1", "0", "0", "0", "1", "0"], ["1", "1", "0", "0", "0", "1"]],
        { fs: 15, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.4, cellHi: { "0,2": P.tealSoft, "1,3": P.tealSoft, "2,4": P.tealSoft, "3,5": P.tealSoft } });
      h.tx(s, "U0 = B'A'\nU1 = B'A\nU2 = B A'\nU3 = B A", { x: h.MX + 4.2, y: 4.15, w: 1.6, h: 2.0, fontSize: 15, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.card(s, 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
      await h.svg(s, decoderSvg(), 6.8, h.TOP + 0.15, h.W - h.MX - 7.0, h.BOT - h.TOP - 0.3);
    }, "Sintesi del decodificatore 2-a-4 (1 su 4). A è il bit meno significativo. Il simbolo a blocchi è un riquadro con la scritta 1/N."),
    D("Comporre decodificatori: da 2-a-4 a 4-a-16", (s, h) => {
      const x1 = h.MX + 1.2, y0 = h.TOP + 0.05, x2 = 5.0, st = 1.07;
      box7(s, h, "decodificatore 2-a-4\nbit alti D C", x1, y0 + 1.45, 2.2, 1.1, P.amber, 14);
      h.arrow(s, h.MX + 0.55, y0 + 2.0, x1 - 0.03, y0 + 2.0, P.mute, 2); h.tx(s, "D C", { x: h.MX, y: y0 + 1.82, w: 0.6, h: 0.3, fontSize: 15, fontFace: h.MONO, bold: true });
      for (let i = 0; i < 4; i++) {
        const y = y0 + i * st;
        box7(s, h, "decodificatore 2-a-4\nEN", x2, y, 2.2, 0.85, P.teal, 14);
        h.arrow(s, x1 + 2.23, y0 + 1.6 + i * 0.27, x2 - 0.03, y + 0.42, P.amber, 1.75);
        h.arrow(s, x2 + 2.23, y + 0.42, x2 + 3.1, y + 0.42, P.mute, 2);
        h.tx(s, `U${i * 4} ... U${i * 4 + 3}`, { x: x2 + 3.2, y: y + 0.22, w: 1.9, h: 0.4, fontSize: 15, fontFace: h.MONO, bold: true, valign: "middle" });
      }
      h.tx(s, "i bit bassi B A vanno a tutti e quattro", { x: x2 - 0.8, y: y0 + 3 * st + 0.9, w: 3.8, h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.card(s, 10.2, h.TOP, h.W - h.MX - 10.2, 4.45, P.tealSoft);
      h.tx(s, "Il primo decodificatore abilita uno degli altri quattro; quello abilitato attiva una delle sue quattro linee. Cinque piccoli decodificatori selezionano una linea su sedici.", { x: 10.35, y: h.TOP + 0.1, w: h.W - h.MX - 10.5, h: 4.25, fontSize: 15, valign: "middle" });
      h.tx(s, "Per questo esistevano componenti standard: l'SN74139 contiene in un contenitore due decodificatori 2-a-4 con abilitazione. Oggi la stessa struttura si descrive in un linguaggio hardware e viene collocata sul chip in automatico.", { x: h.MX, y: 6.15, w: h.CW, h: 0.6, fontSize: 14.5, valign: "middle" });
    }, "Composizione modulare di decodificatori 4:16. Nell'SN74139 reale l'abilitazione e le uscite sono attive basse: un dettaglio che la slide originale semplificava, come fa questa."),
    D("Nel processore: quale registro viene scritto?", (s, h) => {
      h.tx(s, "addi t1, t1, 1     =     0x00130313", { x: h.MX, y: h.TOP - 0.1, w: h.CW, h: 0.45, fontSize: 21, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.4, h.TOP + 0.85, h.CW - 0.8, [
        { n: 12, value: "000000000001", color: P.mute }, { n: 5, value: "00110", color: P.mute }, { n: 3, value: "000", color: P.mute },
        { n: 5, label: "rd = 6", value: "00110", color: P.green }, { n: 7, value: "0010011", color: P.mute },
      ], { h: 0.6, minW: 1.3, fs: 16 });
      box7(s, h, "decodificatore 5-a-32", 7.0, h.TOP + 2.1, 3.2, 0.55, P.green, 16);
      h.arrow(s, 8.6, h.TOP + 1.82, 8.6, h.TOP + 2.08, P.green, 2.25); h.arrow(s, 8.6, h.TOP + 2.67, 8.6, h.TOP + 3.18, P.green, 2.25);
      const cw = h.CW / 32;
      h.mem(s, h.MX, h.TOP + 3.2, cw, Array.from({ length: 32 }, (_, i) => ({ val: i === 6 ? "1" : "0", label: `x${i}`, color: i === 6 ? P.green : undefined })), { h: 0.5, fs: 12, labelFs: 9 });
      h.rows(s, ["I cinque bit di rd sono una parola codice: 32 registri, ceil(log2 32) = 5",
        "Un decodificatore 5-a-32 ne ricava 32 linee di abilitazione alla scrittura: solo x6, cioè t1, riceve il risultato",
        "Altre due selezioni, su rs1 e rs2, scelgono i registri da leggere"], h.MX, 5.72, h.CW, 1.03);
    }, "L'istruzione della Lezione 02. I campi grigi non sono coinvolti. L'abilitazione alla scrittura di x0 semplicemente non è collegata: x0 si legge sempre zero. La lettura usa multiplexer, mostrati tra qualche slide."),
    T("Il codificatore", [
      "La macchina inversa: riceve una rappresentazione decodificata, N linee di cui una attiva, e dà in uscita la parola codice corrispondente, di m = ceil(log2 N) bit",
      "Ogni bit di uscita è l'OR delle linee di ingresso il cui numero ha un 1 in quella posizione",
      ["Se più linee possono essere attive insieme serve un codificatore con priorità", ["dà in uscita il numero della linea attiva di priorità più alta"]],
      "Esempio: un tastierino con un filo per tasto diventa un numero di tasto compatto",
    ], "Per N = 4: C0 = U1 + U3, C1 = U2 + U3. I codificatori con priorità ricompaiono con le interruzioni: più dispositivi chiedono attenzione, un solo numero arriva al processore.", { big: "da N a m", label: "da una linea tra N a una parola codice di m bit: m = ceil(log2 N)" }),
    D("Transcodificatori: il display a sette segmenti", async (s, h) => {
      await h.svg(s, sevenSegSvg(["a", "b", "g", "e", "d"]), h.MX, h.TOP, 2.6, h.BOT - h.TOP);
      const pat = ["1111110", "0110000", "1101101", "1111001", "0110011", "1011011", "1011111", "1110000", "1111111", "1111011"];
      h.table(s, 3.5, h.TOP, [0.75, 1.1, ...Array(7).fill(0.5)], ["Cifra", "BCD", "a", "b", "c", "d", "e", "f", "g"], pat.map((p, i) => [String(i), i.toString(2).padStart(4, "0"), ...p.split("")]),
        { fs: 13.5, mono: [1, 2, 3, 4, 5, 6, 7, 8], align: "center", rowH: 0.385, hi: { 2: P.redSoft } });
      h.card(s, 9.75, h.TOP, h.W - h.MX - 9.75, h.BOT - h.TOP, P.tealSoft);
      h.tx(s, "Un transcodificatore trasforma ogni parola di un codice C1 nella parola corrispondente di un codice C2 definito sullo stesso insieme.\n\nQui: dal BCD alle sette linee che accendono i segmenti da a a g. La cifra 2 accende a, b, g, e e d.\n\nSette uscite: sette funzioni di quattro variabili da sintetizzare.", { x: 9.9, y: h.TOP + 0.15, w: h.W - h.MX - 10.05, h: h.BOT - h.TOP - 0.3, fontSize: 14.5, valign: "middle" });
    }, "Transcodificatore BCD - display a 7 segmenti. Ogni segmento è un LED comandato da un segnale digitale. Le sei parole BCD non usate sono indifferenze per tutte e sette le funzioni."),
    D("Sintesi del segmento a", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.7, h.BOT - h.TOP);
      h.kmap(s, h.MX + 0.6, h.TOP + 0.15, 0.92, { rowVar: "A B", colVar: "C D", rowLabels: ["00", "01", "11", "10"], colLabels: ["00", "01", "11", "10"],
        vals: [[1, 0, 1, 1], [0, 1, 1, 1], ["x", "x", "x", "x"], [1, 1, "x", "x"]],
        loops: [{ r: 2, c: 0, rs: 2, cs: 4, color: P.red }, { r: 0, c: 2, rs: 4, cs: 2, color: P.violet, inset: 0.05 }, { r: 1, c: 1, rs: 2, cs: 2, color: P.green, inset: 0.1 },
          ...[[0, 0], [0, 3], [3, 0], [3, 3]].map(([r, c]) => ({ r, c, rs: 1, cs: 1, color: P.amber, inset: 0.14 }))] });
      h.tx(s, "a = A + C + BD + B'D'", { x: h.MX, y: h.TOP + 4.63, w: 5.7, h: 0.5, fontSize: 21, bold: true, fontFace: h.MONO, align: "center", color: P.steel });
      h.rows(s, [
        "Ingressi A B C D: la cifra BCD, A è il più significativo. Il segmento a è spento solo per le cifre 1 e 4",
        "Le parole da 1010 a 1111 non si presentano mai: sei indifferenze, segnate con x",
        ["Usando le celle x come 1 i gruppi diventano grandi", ["rosso: A; viola: C; verde: BD; ambra, i quattro angoli: B'D'"]],
        "Senza le indifferenze i gruppi sarebbero più piccoli e l'espressione più lunga",
        "Altre sei mappe danno i segmenti da b a g: un transcodificatore completo",
      ], 6.7, h.TOP, h.W - h.MX - 6.7, h.BOT - h.TOP);
    }, "Esempio svolto che unisce la Lezione 09 (mappe, indifferenze) a questa. Buon esercizio di laboratorio: i segmenti da b a g. Verifica: la cifra 0 (0000) è coperta dagli angoli, la cifra 9 (1001) da A."),

    H("Multiplexer e demultiplexer", "Selezionare una sorgente, selezionare una destinazione."),
    D("Il multiplexer", async (s, h) => {
      h.rows(s, [
        "Un circuito combinatorio con 2^n ingressi dati, n linee di selezione e un'uscita",
        "Seleziona uno dei 2^n segnali di ingresso e lo trasferisce sull'unica linea di uscita",
        "Indirizzabile: un decodificatore sulle linee di selezione abilita una porta AND; un OR raccoglie il risultato. Il dato è scelto da un indirizzo, non da una linea decodificata",
      ], h.MX, h.TOP, 6.0, 3.0);
      h.tx(s, "2 ingressi:  Y = S' I0 + S I1", { x: h.MX, y: 4.75, w: 6.0, h: 0.4, fontSize: 16, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "4 ingressi:  Y = S1'S0' I0 + S1'S0 I1\n             + S1 S0' I2 + S1 S0 I3", { x: h.MX, y: 5.25, w: 6.0, h: 0.8, fontSize: 16, bold: true, fontFace: h.MONO, color: P.steel });
      h.tx(s, "Ogni ingresso dati è moltiplicato per un mintermine delle linee di selezione.", { x: h.MX, y: 6.2, w: 6.0, h: 0.5, fontSize: 13.5, italic: true, color: P.mute });
      h.card(s, 7.0, h.TOP, h.W - h.MX - 7.0, h.BOT - h.TOP);
      await h.svg(s, mux2Svg(), 7.2, h.TOP + 0.3, h.W - h.MX - 7.4, h.BOT - h.TOP - 1.1);
      h.tx(s, "Un multiplexer a due ingressi: quando S = 0 l'uscita è I0, quando S = 1 è I1", { x: 7.2, y: h.BOT - 0.75, w: h.W - h.MX - 7.4, h: 0.6, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
    }, "Multiplexer indirizzabile: un MUXL (una linea di abilitazione per ingresso) più un decodificatore. Un multiplexer realizza anche qualunque funzione delle sue variabili di selezione: si mette la tabella di verità sugli ingressi dati."),
    D("Il demultiplexer", (s, h) => {
      h.rows(s, [
        "La macchina inversa: un ingresso dati D, n linee di selezione, 2^n uscite",
        "Instrada l'ingresso sull'uscita scelta dalle linee di selezione; le altre uscite restano a 0",
        "Demultiplexer indirizzabile: i segnali di abilitazione vengono da un decodificatore sulle linee di selezione",
        "Con D fisso a 1 un demultiplexer è esattamente un decodificatore: D fa da abilitazione",
      ], h.MX, h.TOP, 6.6, h.BOT - h.TOP);
      h.table(s, 7.9, h.TOP, [0.7, 0.7, 0.85, 0.85, 0.85, 0.85], ["S1", "S0", "F0", "F1", "F2", "F3"], [["0", "0", "D", "0", "0", "0"], ["0", "1", "0", "D", "0", "0"], ["1", "0", "0", "0", "D", "0"], ["1", "1", "0", "0", "0", "D"]],
        { fs: 16, mono: [0, 1, 2, 3, 4, 5], align: "center", bold0: false, rowH: 0.48, cellHi: { "0,2": P.amberSoft, "1,3": P.amberSoft, "2,4": P.amberSoft, "3,5": P.amberSoft } });
      h.card(s, 7.9, h.TOP + 2.75, 4.8, 2.45, P.amberSoft);
      h.tx(s, "F0 = D S1'S0'      F1 = D S1'S0\nF2 = D S1 S0'      F3 = D S1 S0", { x: 8.0, y: h.TOP + 2.85, w: 4.6, h: 1.0, fontSize: 14.5, bold: true, fontFace: h.MONO, valign: "middle" });
      h.tx(s, "Un multiplexer seguito da un demultiplexer porta molti segnali su un solo filo, uno alla volta: l'idea che sta dietro ogni linea condivisa.", { x: 8.0, y: h.TOP + 3.95, w: 4.6, h: 1.15, fontSize: 14, valign: "middle" });
    }, "Demultiplexer indirizzabile: Fi = D . Ui, dove Ui sono le uscite del decodificatore."),
    D("Nel processore: registro o costante?", (s, h) => {
      const y = h.TOP + 0.2;
      box7(s, h, "banco dei registri\nvalore di rs1", h.MX, y, 2.6, 0.9, P.steel, 15);
      box7(s, h, "banco dei registri\nvalore di rs2", h.MX, y + 1.5, 2.6, 0.9, P.steel, 15);
      box7(s, h, "immediato dell'istruzione,\ncon segno esteso", h.MX, y + 2.75, 2.6, 0.9, P.amber, 13.5);
      box7(s, h, "MUX", 4.6, y + 1.55, 1.1, 2.05, P.teal, 17);
      box7(s, h, "ALU", 7.0, y + 0.1, 1.9, 3.0, P.violet, 22);
      h.arrow(s, h.MX + 2.63, y + 0.45, 6.97, y + 0.45, P.mute, 2.25); h.tx(s, "A", { x: 6.4, y: y + 0.08, w: 0.5, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, h.MX + 2.63, y + 1.95, 4.57, y + 1.95, P.mute, 2.25); h.tx(s, "0", { x: 4.15, y: y + 1.58, w: 0.4, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO, color: P.teal });
      h.arrow(s, h.MX + 2.63, y + 3.2, 4.57, y + 3.2, P.mute, 2.25); h.tx(s, "1", { x: 4.15, y: y + 2.83, w: 0.4, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO, color: P.teal });
      h.arrow(s, 5.73, y + 2.55, 6.97, y + 2.55, P.mute, 2.25); h.tx(s, "B", { x: 6.4, y: y + 2.18, w: 0.5, h: 0.3, fontSize: 15, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.15, y + 4.3, 5.15, y + 3.63, P.red, 2.25); h.tx(s, "selezione: 0 per add, 1 per addi", { x: 3.3, y: y + 4.32, w: 3.8, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.arrow(s, 8.93, y + 1.6, 9.7, y + 1.6, P.mute, 2.25); h.tx(s, "risultato", { x: 9.0, y: y + 1.2, w: 0.8, h: 0.3, fontSize: 13, italic: true, color: P.mute });
      h.rows(s, [
        "add t2, t0, t1 e addi t2, t0, 5 usano lo stesso addizionatore",
        "Un multiplexer davanti alla ALU sceglie il secondo operando: un registro o la costante",
        "È un multiplexer su parole: trentadue multiplexer a un bit con una linea di selezione comune",
        "Anche leggere un registro è un multiplexer: 32 parole in ingresso, 5 bit di selezione (rs1), una parola in uscita",
      ], 9.9, h.TOP, h.W - h.MX - 9.9, h.BOT - h.TOP);
    }, "Nel datapath del libro di Patterson e Hennessy il segnale di selezione si chiama ALUSrc. Una porta applicata a ogni bit di una parola con un controllo comune è una porta di parola."),

    H("Confrontare e controllare", "Uguali o diversi? Arrivato integro o alterato?"),
    D("Il comparatore", async (s, h) => {
      h.rows(s, [
        "Due dati A e B in ingresso, un'uscita booleana EQ che vale 1 quando A = B",
        "Due bit sono uguali quando il loro XNOR vale 1",
        "Due parole sono uguali quando lo sono tutte le loro coppie di bit: un AND di XNOR",
        ["Nel processore: beq e bne", ["i due registri sono confrontati bit a bit, e il salto avviene o no secondo EQ"]],
      ], h.MX, h.TOP, 6.6, h.BOT - h.TOP - 0.7);
      h.tx(s, "EQ = (A0 xnor B0) . (A1 xnor B1) . ...", { x: h.MX, y: h.BOT - 0.6, w: 6.6, h: 0.5, fontSize: 16.5, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.card(s, 7.6, h.TOP, h.W - h.MX - 7.6, h.BOT - h.TOP);
      await h.svg(s, comparatorSvg(), 7.8, h.TOP + 0.3, h.W - h.MX - 8.0, h.BOT - h.TOP - 1.1);
      h.tx(s, "Un comparatore per parole di due bit", { x: 7.8, y: h.BOT - 0.7, w: h.W - h.MX - 8.0, h: 0.5, fontSize: 13.5, italic: true, color: P.mute, align: "center", valign: "middle" });
    }, "Molti datapath riusano invece la ALU: sottraggono e verificano se il risultato è zero. I confronti d'ordine (blt, slt) richiedono la sottrazione e le regole di segno della Lezione 05."),
    T("Parità", [
      "Quando i dati viaggiano da una sorgente a una destinazione, i codici ridondanti permettono di controllare gli errori",
      "Il controllo più semplice è un singolo bit di parità: le parole lecite hanno, per esempio, un numero pari di bit a 1",
      ["Una rete di parità calcola la parità degli n bit al suo ingresso: una catena di XOR", ["p = x0 xor x1 xor ... xor x(n-1) vale 1 quando il numero di 1 è dispari"]],
      ["Serve due volte", ["per calcolare il bit da aggiungere a un codice non ridondante", "per verificare all'arrivo la parità complessiva del codice ridondante"]],
    ], "In inglese: parity network. XOR è la somma modulo 2, ed è per questo che una catena di XOR conta gli 1 modulo 2.", { big: "xor", label: "la parità di una parola è lo XOR di tutti i suoi bit" }),
    F("Trasmissione con controllo di parità", [
      "Sorgente|il codice non ridondante C",
      "CALC|una rete di parità calcola il bit di parità, che viene accodato a C",
      "Canale|il codice ridondante viaggia, e può essere alterato",
      "VER|una rete di parità verifica la parità e alza un segnale di errore",
      "Destinazione|il codice C', probabilmente uguale a C se non è stato segnalato alcun errore",
    ], "Un solo bit di parità rileva un numero dispari qualsiasi di bit alterati. Non sa dire quale bit è sbagliato, quindi non può correggere, e gli sfugge un numero pari di errori: codici più forti aggiungono altri bit di controllo.",
      "Schema di trasmissione con controllo di parità. «Probabilmente»: due errori si compensano. I codici di Hamming, con più bit di parità su gruppi sovrapposti, localizzano e correggono un errore singolo."),
    K("Una rete di parità in sette istruzioni", `# a0 = one byte        result: a0 = 1 if the number of 1 bits is odd

    srli t0, a0, 4
    xor  a0, a0, t0      # fold eight bits onto four
    srli t0, a0, 2
    xor  a0, a0, t0      # fold four bits onto two
    srli t0, a0, 1
    xor  a0, a0, t0      # fold two bits onto one
    andi a0, a0, 1       # keep the parity bit`, [
      "Ogni xor combina la metà alta dei bit con la metà bassa",
      "Tre livelli per otto bit: la versione software di un albero di porte XOR",
      "Lo stesso valore accodato al byte ne rende pari la parità totale",
    ], "Scritto per questa lezione. Tracciarlo con 0x53 = 0101 0011 (quattro 1, risultato 0) e con 0x13 = 0001 0011 (tre 1, risultato 1). In hardware i tre livelli sono un albero di sette porte XOR."),

    H("L'unità aritmetico-logica", "Tutti i blocchi di questa lezione, al lavoro insieme."),
    D("La ALU è un insieme di macchine e un multiplexer", (s, h) => {
      const y0 = h.TOP + 0.05, units = ["addizionatore / sottrattore", "AND, una porta per bit", "OR, una porta per bit", "XOR, una porta per bit", "shifter"], ux = 3.3, uw = 3.2, uh = 0.6, st = 0.76;
      h.line(s, 2.0, y0 + 0.1, 2.0, y0 + 4 * st + 0.2, P.teal, 3); h.line(s, 2.6, y0 + 0.1, 2.6, y0 + 4 * st + 0.4, P.amber, 3);
      h.tx(s, "A", { x: 1.2, y: y0, w: 0.7, h: 0.4, fontSize: 18, bold: true, fontFace: h.MONO, color: P.teal, align: "right" }); h.tx(s, "B", { x: 2.7, y: y0 - 0.32, w: 0.4, h: 0.3, fontSize: 18, bold: true, fontFace: h.MONO, color: P.amber });
      h.tx(s, "32 bit\nciascuno", { x: h.MX, y: y0 + 0.5, w: 1.2, h: 0.6, fontSize: 12.5, italic: true, color: P.mute });
      units.forEach((u, i) => {
        const y = y0 + i * st;
        box7(s, h, u, ux, y, uw, uh, i === 0 ? P.violet : P.steel, 14.5);
        h.arrow(s, 2.0, y + 0.2, ux - 0.03, y + 0.2, P.teal, 1.75); h.arrow(s, 2.6, y + 0.42, ux - 0.03, y + 0.42, P.amber, 1.75);
        h.arrow(s, ux + uw + 0.03, y + uh / 2, 7.67, y + uh / 2, P.mute, 1.75);
      });
      box7(s, h, "MUX", 7.7, y0, 1.1, 4 * st + uh, P.teal, 17);
      h.arrow(s, 8.83, y0 + 2 * st + 0.3, 9.9, y0 + 2 * st + 0.3, P.ink, 2.5); h.tx(s, "risultato", { x: 8.85, y: y0 + 2 * st - 0.08, w: 1.0, h: 0.3, fontSize: 13, italic: true, color: P.mute, align: "center" });
      h.arrow(s, 8.25, y0 + 4 * st + uh + 0.62, 8.25, y0 + 4 * st + uh + 0.03, P.red, 2.25);
      h.tx(s, "operazione, decodificata dall'istruzione", { x: 6.2, y: y0 + 4 * st + uh + 0.64, w: 4.2, h: 0.3, fontSize: 13.5, bold: true, color: P.red, align: "center" });
      h.card(s, 10.2, h.TOP, h.W - h.MX - 10.2, 3.7, P.tealSoft);
      h.tx(s, "Tutte le unità calcolano insieme, sugli stessi due operandi. Il multiplexer lascia passare un solo risultato.\n\nUn decodificatore sui bit dell'istruzione pilota la selezione.", { x: 10.3, y: h.TOP + 0.1, w: h.W - h.MX - 10.4, h: 3.5, fontSize: 14, valign: "middle" });
      h.tx(s, "Nessuna memoria, da nessuna parte: la ALU è un'unica grande macchina combinatoria. Il suo percorso più lento, la catena dei riporti dell'addizionatore, limita il clock del processore.", { x: h.MX, y: 6.3, w: h.CW, h: 0.45, fontSize: 14, valign: "middle" });
    }, "In inglese: arithmetic logic unit. L'addizionatore è il sommatore a propagazione del riporto della Lezione 09, con il trucco del complemento e del riporto della Lezione 05 per la sottrazione. I confronti (slt) riusano il sottrattore."),
    G("Le istruzioni RISC-V e la ALU", ["Istruzione", "funct3", "Operazione della ALU", "Unità che produce il risultato"], [
      ["add, sub", "000", "somma o differenza", "addizionatore / sottrattore (sceglie un altro bit, in funct7)"],
      ["sll", "001", "scorrimento a sinistra", "shifter"],
      ["slt, sltu", "010, 011", "pone a 1 se minore", "sottrattore, poi le regole di segno"],
      ["xor", "100", "XOR bit a bit", "porte XOR"],
      ["srl, sra", "101", "scorrimento a destra", "shifter (funct7 sceglie logico o aritmetico)"],
      ["or", "110", "OR bit a bit", "porte OR"],
      ["and", "111", "AND bit a bit", "porte AND"],
    ], "funct3 è il campo di 3 bit dell'istruzione visto nella Lezione 02 (bit da 14 a 12). Tre bit, otto parole codice: un codice compatto che un piccolo decodificatore trasforma nelle linee di selezione del multiplexer della ALU.", { widths: [2, 1.6, 3, 5.6], mono: [0, 1], caption: "funct3 è un codice di 3 bit dentro l'istruzione: decodificandolo si pilota il multiplexer della ALU." }),

    Q("Quanti bit richiede un codice binario a lunghezza fissa per le 26 lettere dell'alfabeto?", ["4", "5", "6", "26"], 1, "ceil(log2 26) = 5, perché 2^4 = 16 < 26 <= 32 = 2^5. Restano sei parole non assegnate: il codice è incompleto."),
    Q("Un decodificatore ha 3 linee di ingresso e nessuna abilitazione. Quante uscite ha, e quante valgono 1 in ogni istante?", ["3 uscite, una a 1", "6 uscite, due a 1", "8 uscite, una a 1", "8 uscite, tre a 1"], 2, "2^3 = 8 uscite, e ne è attiva esattamente una: la rappresentazione decodificata (one-hot) della parola in ingresso."),
    Q("Di quante linee di selezione ha bisogno un multiplexer con 8 ingressi dati?", ["2", "3", "4", "8"], 1, "n linee di selezione scelgono tra 2^n ingressi: 3 linee per 8 ingressi."),
    Q("Una parola con un bit di parità pari viene ricevuta con due bit alterati. Il controllo di parità:", ["rileva l'errore e lo corregge", "rileva l'errore ma non può correggerlo", "non rileva l'errore", "segnala un errore solo se entrambi i bit valevano 1"], 2, "Due alterazioni lasciano invariata la parità. Un solo bit di parità rileva soltanto un numero dispari di errori."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Sintetizzate con una mappa di Karnaugh il segmento g del transcodificatore a sette segmenti, usando le indifferenze",
      "Costruite un decodificatore 3-a-8 con due decodificatori 2-a-4 con abilitazione e un invertitore",
      "Realizzate F = somma di m(1, 2, 4, 7) con un multiplexer a 8 ingressi. Che funzione è?",
      "Scrivete un comparatore in assembly: a0 = 1 se a0 e a1 sono uguali, usando solo xor e sltiu",
      "Disegnate su PRG32 una cifra a sette segmenti: una tabella di dieci byte, uno per cifra, e sette rettangoli accesi esaminandone i bit",
    ], "Su PRG32: una grande cifra che conta da 0 a 9, un passo al secondo, disegnata con sette rettangoli.",
      "Esercizio 3: si mettono 0, 1, 1, 0, 1, 0, 0, 1 sugli ingressi dati: è lo XOR a tre ingressi, il bit di somma del sommatore completo. Esercizio 4: xor a0, a0, a1 e poi sltiu a0, a0, 1 (la pseudo-istruzione seqz). L'esercizio 5 è un transcodificatore software seguito da sette test di bit: la tabella è la tabella di verità di questa lezione, una riga per byte."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["combinational network", "rete combinatoria", "decoder / encoder", "decodificatore / codificatore"],
      ["propagation delay", "ritardo di propagazione", "transcoder", "transcodificatore"],
      ["cardinality", "cardinalità", "multiplexer / demultiplexer", "multiplexer / demultiplexer"],
      ["code word", "parola codice", "enable", "abilitazione"],
      ["fixed / variable length", "lunghezza fissa / variabile", "comparator", "comparatore"],
      ["redundant code", "codice ridondante", "parity bit", "bit di parità"],
    ], null, { widths: [3, 3.2, 3.2, 3.4] }),
    T("Conclusioni e letture", [
      "L'informazione è un attributo, un tipo e un valore; un codice scrive il valore come stringa su un alfabeto",
      "I codici a lunghezza fissa richiedono ceil(log2 N) bit; i codici ridondanti ne spendono di più per rilevare gli errori",
      "Codifica, decodifica e transcodifica sono svolte da macchine combinatorie",
      "I multiplexer selezionano una sorgente, i demultiplexer una destinazione; comparatori e reti di parità controllano",
      "Un processore RISC-V li usa tutti: decodificatori sui campi dell'istruzione, multiplexer sugli operandi, e una ALU che è a sua volta costruita con questi blocchi",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, appendice A e paragrafo 4.1", "Bucci: Architettura dei calcolatori elettronici, i capitoli sulle reti combinatorie", "Stallings: Computer Organization and Architecture, il capitolo sulla logica digitale"]],
    ], "A seguire: Verm1, parte 2: la guida e il cibo. Poi le macchine sequenziali: ciò che qui manca è la memoria."),
  ],
});
