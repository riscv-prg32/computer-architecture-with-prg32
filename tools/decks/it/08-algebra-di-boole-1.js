// Italian version of decks/en/08-boolean-algebra-1.js: same slides, same listings, text in Italian.
// Lecture 08 - Elements of Boolean algebra, part 1: the computer model, operators, properties.
// Source: 05-Architettura_dei_Calcolatori-Algebra_di_Boole.pptx (translated, figures redrawn, bitwise RISC-V section added).
const G5 = require("../../lib/gates");

function gateFig(type, a, b, out) {
  const one = type === "not", p = G5.pins(type, 70, 13);
  let w = "";
  if (one) w += G5.wire([[20, p.a[1]], p.a]) + G5.text(4, p.a[1] + 5, a, { size: 16 });
  else w += G5.wire([[20, p.a[1]], p.a]) + G5.wire([[20, p.b[1]], p.b]) + G5.text(4, p.a[1] + 5, a, { size: 16 }) + G5.text(4, p.b[1] + 5, b, { size: 16 });
  w += G5.wire([p.out, [165, p.out[1]]]) + G5.text(170, p.out[1] + 5, out, { size: 16 });
  return G5.doc(250, 70, w + G5.gate(type, 70, 13));
}

// One operator panel: name, gate symbol, notation, truth table.
async function opPanel(s, h, x, w, name, type, notation, rowsv, col, two) {
  h.card(s, x, h.TOP, w, h.BOT - h.TOP);
  h.pill(s, name, x + 0.25, h.TOP + 0.2, w - 0.5, 0.5, col, 18);
  await h.svg(s, gateFig(type, "x", "y", "z"), x + 0.3, h.TOP + 0.85, w - 0.6, 1.0);
  h.tx(s, notation, { x: x + 0.2, y: h.TOP + 1.95, w: w - 0.4, h: 0.55, fontSize: 15, align: "center", valign: "middle", fontFace: h.MONO, bold: true });
  const cw = two ? 0.8 : 1.0, tw = two ? cw * 3 : cw * 2;
  h.table(s, x + (w - tw) / 2, h.TOP + 2.65, two ? [cw, cw, cw] : [cw, cw], two ? ["x", "y", "z"] : ["x", "z"], rowsv, { fs: 15, mono: [0, 1, 2], align: "center", bold0: false, rowH: 0.4, headColor: col });
}

Deck({
  n: "08", file: "08-Architettura_dei_Calcolatori-Algebra_di_Boole_1",
  title: "Elementi di algebra di Boole", short: "Algebra di Boole (1)",
  sub: "Parte 1: il calcolatore come macchina logica; operatori e loro proprietà",
  quote: ["Povero me! Povero me! Arriverò troppo tardi!", "Lewis Carroll, Le avventure di Alice nel Paese delle Meraviglie, 1865"],
  cover: "lab2_step1_lamps.png",
  notes: "Spirale: gli studenti usano andi per esaminare un pulsante fin dai primi giorni. La lezione dà un nome a ciò che hanno fatto (una maschera è un AND), poi costruisce l'algebra, poi torna alle istruzioni bit a bit.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Descrivere un calcolatore come processore, memoria e ingresso/uscita, collegati da un bus",
      "Spiegare la differenza tra analisi e sintesi di un circuito logico",
      "Scrivere le tabelle di verità di AND, OR, NOT, XOR, NAND e NOR e riconoscerne i simboli",
      "Applicare le proprietà dell'algebra di Boole, leggi di De Morgan comprese, per semplificare un'espressione",
      "Usare and, or, xor e not su RISC-V per esaminare, porre a 1, azzerare e invertire singoli bit",
    ]),

    H("Riscaldamento sulla macchina", "Fate algebra di Boole fin dai primi giorni."),
    K("LEFT è premuto?", `    call prg32_input_read    # a0 = all the buttons, one bit each
    mv   t0, a0              # keep our own copy

    andi t3, t0, 0x01        # keep only bit 0: LEFT
    beqz t3, 1f              # zero: LEFT is not pressed
    addi t2, t2, -2          # move left
1:
    andi t3, t0, 0x02        # keep only bit 1: RIGHT
    beqz t3, 2f
    addi t2, t2, 2           # move right
2:`, [
      "prg32_input_read restituisce tutti i pulsanti insieme: un bit per pulsante",
      "andi con 0x01 conserva il bit 0 e forza a zero tutti gli altri",
      "Il risultato è diverso da zero esattamente quando LEFT è premuto",
      "andi sono trentadue porte AND che lavorano fianco a fianco: che cos'è, esattamente, un AND?",
    ], "Dal capitolo 6 (State and Input) e dal laboratorio 06-asm-state-and-input del libro di PRG32. La costante usata con andi si chiama maschera."),
    T("Un bit per pulsante", [
      "LEFT 0x01, RIGHT 0x02, UP 0x04, DOWN 0x08: bit da 0 a 3",
      "A 0x10, B 0x20, START / SELECT 0x40: bit da 4 a 6",
      "Tenendo premuti insieme RIGHT e A si ottiene 0x12 = 0001 0010",
      "Ogni lampada del laboratorio è un bit della maschera: accesa quando il bit vale 1",
      "Ogni domanda sul joystick è un'espressione booleana su queste variabili",
    ], "Costanti dei pulsanti da prg32.h (PRG32_BTN_*). Il secondo giocatore usa la stessa disposizione nei bit più alti.", { img: "lab2_step1_lamps.png", cap: "Laboratorio 06, passo 1: sette lampade, una per ogni bit dei pulsanti" }),

    H("Il calcolatore come macchina logica", "Un livello sotto le istruzioni."),
    D("Il calcolatore elettronico: tre sottosistemi e un bus", (s, h) => {
      const y = h.TOP + 0.1, g = 0.8, bw = (h.CW - 2 * g) / 3, bh = 2.3, x0 = h.MX;
      const box = (i, title, sub, col) => { const x = x0 + i * (bw + g);
        s.addText([{ text: title, options: { bold: true, fontSize: 20, breakLine: true } }, { text: sub, options: { fontSize: 14 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x, y, w: bw, h: bh,
          fill: { color: col }, line: { color: col, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 8 });
        h.line(s, x + bw / 2 - 0.25, y + bh, x + bw / 2 - 0.25, y + bh + 0.55, P.steel, 3); h.line(s, x + bw / 2 + 0.25, y + bh, x + bw / 2 + 0.25, y + bh + 0.55, P.steel, 3); };
      box(0, "Processore (CPU)", "unità di controllo, ALU, registri\nesegue le istruzioni", P.teal);
      box(1, "Memoria centrale", "contiene le istruzioni\ne i dati", P.steel);
      box(2, "Ingresso / uscita", "joystick, display, suono,\nrete, memoria di massa", P.green);
      s.addText("Bus: linee degli indirizzi, linee dei dati, linee di controllo", { isTextBox: true, shape: h.pres.ShapeType.rect, x: x0, y: y + bh + 0.55, w: 3 * bw + 2 * g, h: 0.6, fill: { color: P.amber }, line: { color: P.amber, width: 0 }, color: P.white, bold: true, fontFace: h.BODY, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      h.rows(s, ["Il modello di von Neumann in termini odierni: le unità del 1945, collegate da fili condivisi",
        "Tutto ciò che viaggia sul bus è una configurazione di bit"], h.MX, 5.45, h.CW, 1.3);
    }, "Sostituisce le due figure della presentazione originale (modello di von Neumann; architettura a bus). Sull'ESP32-C6 i tre sottosistemi e il bus stanno tutti dentro un solo chip."),
    T("Il processore", [
      "La capacità di elaborazione del calcolatore risiede nel processore",
      "Può eseguire un insieme di azioni elementari, più o meno complesse: le istruzioni",
      ["Le istruzioni sono comandi espliciti che", ["governano il trasferimento dell'informazione dentro il calcolatore e tra il calcolatore e i dispositivi di I/O", "specificano le operazioni aritmetiche e logiche da eseguire"]],
      "La memoria centrale contiene i dati di ingresso e di uscita del calcolo, e la sequenza delle istruzioni",
      "Una sequenza di istruzioni memorizzata nella memoria centrale è un programma",
    ], "RV32I: circa quaranta istruzioni. Avete usato addi, lw, sw, andi, beqz, call e ret: trasferimento, aritmetica, logica e controllo ci sono tutti.", { big: "preleva, esegui, ripeti", label: "il processore prende le istruzioni dalla memoria e le esegue, una per una" }),
    C("Che tipo di sistema è un calcolatore elettronico?", [
      ["Numerico", "È un sistema digitale: tutta l'informazione che tratta è espressa come stringhe di bit."],
      ["Automatico", "Una volta avviato procede da solo, istruzione dopo istruzione, senza intervento umano."],
      ["A programma memorizzato", "Il programma è registrato in memoria e si può sostituire: la stessa macchina fa lavori diversi."],
      ["Elettronico", "È costruito con circuiti elettronici che memorizzano i bit e li elaborano."],
    ]),
    T("Circuiti logici", [
      "Tutta l'informazione trattata da un dispositivo numerico è espressa da stringhe di bit",
      "I circuiti elettronici che memorizzano i bit e li elaborano si chiamano circuiti di commutazione, o circuiti logici",
      "Un circuito logico forma una rete di commutazione; progettarlo si chiama progetto logico",
      "Per descrivere il comportamento dei circuiti logici si usa un'algebra: una notazione matematica che semplifica l'analisi e la sintesi delle reti logiche",
    ], "Circuiti di commutazione: switching circuits. L'algebra è quella di Boole (1854), applicata agli interruttori da Nakajima e Shannon negli anni Trenta (Lezione 03).", { big: "0 e 1", label: "due livelli di tensione su un filo, due stati di un interruttore, due valori di una variabile booleana" }),
    V("Due problemi, una sola algebra",
      ["Analisi", ["Data: la descrizione della STRUTTURA di un circuito (come è fatto)", "Trovare: il suo COMPORTAMENTO (che cosa fa)", "Esempio: leggere uno schema e ricavarne la tabella di verità", "Esempio: leggere andi t3, t0, 1 e dire che cosa finisce in t3"]],
      ["Sintesi", ["Data: la descrizione del COMPORTAMENTO (che cosa deve fare)", "Trovare: una STRUTTURA che lo realizza (come costruirlo)", "Esempio: dalla tabella di verità di una somma a un circuito addizionatore", "Esempio: da «muoviti se è premuto LEFT o RIGHT» a una maschera e un salto"]],
      "La sintesi ha di solito molte soluzioni; scegliere la più economica è il problema di minimizzazione della Lezione 09."),

    H("Algebra di Boole", "Variabili a due valori, tre operazioni di base."),
    DEF("Algebra di Boole", "Definizione", "L'algebra usata per analizzare e sintetizzare i circuiti logici: variabili che possono assumere solo due valori, 0 e 1, e tre operazioni di base.", [
      "Le variabili sono binarie e si scrivono di solito con lettere: A, B, ... oppure x, y, ...",
      "AND, il prodotto logico: si scrive x AND y, oppure x . y, o semplicemente xy",
      "OR, la somma logica: si scrive x OR y, oppure x + y",
      "NOT, il complemento: si scrive NOT x, oppure x', oppure x con una barra sopra",
    ], "Congiunzione, disgiunzione, negazione: conjunction, disjunction, negation. In queste slide il complemento si scrive con un apice (x') per poterlo battere a tastiera."),
    D("Le tre operazioni fondamentali", async (s, h) => {
      const w = (h.CW - 0.6) / 3;
      await opPanel(s, h, h.MX, w, "AND (congiunzione)", "and", "z = x . y", [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]], P.teal, true);
      await opPanel(s, h, h.MX + w + 0.3, w, "OR (disgiunzione)", "or", "z = x + y", [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]], P.amber, true);
      await opPanel(s, h, h.MX + 2 * (w + 0.3), w, "NOT (negazione)", "not", "z = x'", [["0", "1"], ["1", "0"]], P.violet, false);
    }, "AND vale 1 solo quando entrambi gli ingressi valgono 1; OR vale 0 solo quando entrambi valgono 0; NOT inverte. Una tabella di verità elenca l'uscita per ogni combinazione degli ingressi."),
    D("Altre tre porte che incontrerete ovunque", async (s, h) => {
      const w = (h.CW - 0.6) / 3;
      await opPanel(s, h, h.MX, w, "XOR (or esclusivo)", "xor", "z = x'y + xy'", [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]], P.green, true);
      await opPanel(s, h, h.MX + w + 0.3, w, "NAND (not and)", "nand", "z = (x . y)'", [["0", "0", "1"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]], P.red, true);
      await opPanel(s, h, h.MX + 2 * (w + 0.3), w, "NOR (not or)", "nor", "z = (x + y)'", [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "0"]], P.steel, true);
    }, "Slide nuova. XOR vale 1 quando gli ingressi sono diversi: è il bit di somma di un'addizione, e RISC-V lo ha come istruzione. Il cerchietto su un simbolo significa negazione."),
    G("Proprietà dell'algebra di Boole (1)", ["Proprietà", "Forma AND", "Forma OR"], [
      ["Commutativa", "x . y = y . x", "x + y = y + x"],
      ["Associativa", "(x . y) . z = x . (y . z)", "(x + y) + z = x + (y + z)"],
      ["Idempotenza", "x . x = x", "x + x = x"],
      ["Assorbimento", "x . (x + y) = x", "x + (x . y) = x"],
    ], "Grazie alla proprietà associativa AND e OR si possono definire su più di due operandi: x . y . z. Ogni proprietà viene in coppia: si scambia AND con OR.", { widths: [2.6, 4.8, 4.8], mono: [1, 2], fs: 21, caption: "Per l'associatività AND e OR si estendono a un numero qualsiasi di operandi: x . y . z, x + y + z." }),
    G("Proprietà dell'algebra di Boole (2)", ["Proprietà", "Forma AND", "Forma OR"], [
      ["Distributiva", "x . (y + z) = x . y + x . z", "x + y . z = (x + y) . (x + z)"],
      ["Elemento neutro", "x . 1 = x", "x + 0 = x"],
      ["Elemento nullo", "x . 0 = 0", "x + 1 = 1"],
      ["Complemento", "x . x' = 0", "x + x' = 1"],
      ["Involuzione", "(x')' = x", ""],
    ], "La seconda legge distributiva non ha un corrispettivo nell'algebra ordinaria. La slide originale chiamava l'involuzione «convoluzione» e raggruppava elemento neutro ed elemento nullo come «minimo e massimo»; le leggi del complemento sono aggiunte qui.", { widths: [2.3, 4.7, 5.2], mono: [1, 2], fs: 19, caption: "Attenzione: anche OR si distribuisce rispetto ad AND. Per somma e prodotto ordinari è falso." }),
    D("Le leggi di De Morgan", (s, h) => {
      h.card(s, h.MX, h.TOP, 5.6, 1.15, P.tealSoft); h.card(s, h.MX, h.TOP + 1.35, 5.6, 1.15, P.amberSoft);
      h.tx(s, "(x . y)' = x' + y'", { x: h.MX, y: h.TOP, w: 5.6, h: 1.15, fontSize: 28, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.tx(s, "(x + y)' = x' . y'", { x: h.MX, y: h.TOP + 1.35, w: 5.6, h: 1.15, fontSize: 28, bold: true, fontFace: h.MONO, align: "center", valign: "middle" });
      h.rows(s, ["Il complemento di un prodotto è la somma dei complementi, e viceversa",
        "Dimostrazione per induzione perfetta: si verifica ogni riga della tabella di verità",
        "Un NAND è un OR degli ingressi negati; un NOR è un AND degli ingressi negati"], h.MX, h.TOP + 2.75, 5.6, h.BOT - h.TOP - 2.75);
      const cw = 1.03;
      h.table(s, 6.55, h.TOP, [0.7, 0.7, cw, cw, 0.75, 0.75, 1.2], ["x", "y", "x . y", "(x . y)'", "x'", "y'", "x' + y'"],
        [["0", "0", "0", "1", "1", "1", "1"], ["0", "1", "0", "1", "1", "0", "1"], ["1", "0", "0", "1", "0", "1", "1"], ["1", "1", "1", "0", "0", "0", "0"]],
        { fs: 16, mono: [0, 1, 2, 3, 4, 5, 6], align: "center", bold0: false, rowH: 0.5, cellHi: { "0,3": P.tealSoft, "1,3": P.tealSoft, "2,3": P.tealSoft, "3,3": P.tealSoft, "0,6": P.tealSoft, "1,6": P.tealSoft, "2,6": P.tealSoft, "3,6": P.tealSoft } });
      h.tx(s, "Le due colonne evidenziate sono identiche: la prima legge vale. La seconda si dimostra allo stesso modo.", { x: 6.6, y: h.TOP + 2.75, w: 6.13, h: 0.9, fontSize: 15, italic: true, color: P.mute });
    }, "Augustus De Morgan, 1847. Le leggi si generalizzano a un numero qualsiasi di variabili. La presentazione originale mostrava la dimostrazione come immagine."),
    T("Dualità e precedenza", [
      ["Principio di dualità: ogni identità resta vera scambiando AND con OR e 0 con 1", ["x . 1 = x diventa x + 0 = x; le due leggi di De Morgan sono l'una la duale dell'altra"]],
      ["Precedenza: prima NOT, poi AND, poi OR, come per potenze, prodotti e somme", ["x + y . z' significa x + (y . (z'))"]],
      "Le parentesi cambiano l'ordine, esattamente come nell'algebra ordinaria",
      "Due espressioni sono equivalenti se hanno la stessa tabella di verità",
    ], "La dualità dimezza il lavoro: dimostrata una legge di ogni coppia, l'altra segue."),
    G("Semplificare con l'algebra", ["Espressione", "Legge applicata"], [
      ["x . y + x . y'", "l'espressione da semplificare: tre porte e un invertitore"],
      ["= x . (y + y')", "legge distributiva, letta da destra a sinistra"],
      ["= x . 1", "legge del complemento: y + y' = 1"],
      ["= x", "elemento neutro: resta solo un filo"],
    ], "Due letterali e tre porte diventano un filo. L'identità nella didascalia (detta a volte teorema di semplificazione) usa la distributività di OR rispetto ad AND; la si riusa nella Lezione 09.", { widths: [4.4, 7.8], mono: [0], fs: 22, caption: "Allo stesso modo: x + x' . y = (x + x') . (x + y) = 1 . (x + y) = x + y" }),

    H("Ritorno alla macchina", "Trentadue porte per istruzione."),
    G("Istruzioni bit a bit: l'algebra su un registro intero", ["Istruzione", "Operazione", "a = 1100 1010, b = 0000 1111", "In C"], [
      ["and  t0, a, b", "AND bit a bit", "0000 1010", "a & b"],
      ["or   t0, a, b", "OR bit a bit", "1100 1111", "a | b"],
      ["xor  t0, a, b", "XOR bit a bit", "1100 0101", "a ^ b"],
      ["not  t0, a", "complementa ogni bit", "0011 0101", "~a"],
    ], "Ogni istruzione applica la stessa porta a tutte e trentadue le coppie di bit insieme (ne sono mostrate otto). Le forme con immediato andi, ori e xori prendono una costante di 12 bit; not è la pseudo-istruzione xori t0, a, -1, perché -1 è fatto di tutti uni.", { widths: [3, 3, 4.2, 2], mono: [0, 2, 3], caption: "Ogni istruzione applica una porta a tutte le posizioni di bit insieme. not è una pseudo-istruzione: xori con -1, cioè con tutti uni." }),
    G("Quattro cose da fare con una maschera", ["Scopo", "Legge usata", "Istruzione (bit 4 = pulsante A)", "Effetto sugli altri bit"], [
      ["Esaminare un bit", "x . 1 = x,  x . 0 = 0", "andi t1, t0, 0x10", "forzati a 0 nel risultato"],
      ["Porre un bit a 1", "x + 1 = 1,  x + 0 = x", "ori  t0, t0, 0x10", "invariati"],
      ["Azzerare un bit", "x . 0 = 0,  x . 1 = x", "andi t0, t0, ~0x10", "invariati"],
      ["Invertire un bit", "x xor 1 = x',  x xor 0 = x", "xori t0, t0, 0x10", "invariati"],
    ], "Le leggi dell'elemento neutro e dell'elemento nullo sono esattamente ciò che fa funzionare una maschera: un 1 nella maschera lascia passare il bit (AND) oppure lo forza (OR); uno 0 fa il contrario. ~0x10 è 0xFFFFFFEF, che l'assemblatore codifica come immediato -17.", { widths: [2.4, 3.6, 3.8, 3], mono: [1, 2] }),
    K("De Morgan al joystick", `# "idle" when NEITHER LEFT NOR RIGHT is pressed
    andi t3, t0, 0x03        # 0x03 = LEFT | RIGHT: keep both bits
    beqz t3, idle            # all zero: (LEFT + RIGHT)' is true

# the long way: test each button, the result is the same
    andi t3, t0, 0x01
    bnez t3, moving          # LEFT pressed: not idle
    andi t3, t0, 0x02
    bnez t3, moving          # RIGHT pressed: not idle
    j    idle                # LEFT' . RIGHT'`, [
      "Una maschera con due bit esamina due pulsanti con una sola istruzione",
      "Il risultato è zero solo se entrambi i bit sono zero: NOT (LEFT OR RIGHT)",
      "Per De Morgan equivale a (NOT LEFT) AND (NOT RIGHT): la via lunga, qui sotto",
      "L'algebra dice che i due programmi sono equivalenti, e qual è il più economico",
    ], "(x + y)' = x' . y'. Due istruzioni invece di cinque: la minimizzazione non riguarda solo l'hardware."),
    WK("Una lampada per bit: scorrere e mascherare", `    # s0 = bit number, 0 to 6
    la   t0, buttons
    lw   t1, 0(t0)           # t1 = the button mask
    srl  t1, t1, s0          # bring bit number s0 down to bit 0
    andi t1, t1, 1           # keep it, clear all the others
    li   a4, GREY            # lamp off
    beqz t1, 1f
    li   a4, YELLOW          # lamp on
1:  call prg32_gfx_rect`, "lab2_step1_lamps.png",
      "Scorrere, poi mascherare con 1: il modo standard di leggere il bit numero n di una parola.",
      "Sorgente: laboratorio 06-asm-state-and-input del libro di PRG32, step1_lamps.S (dentro lamp_loop). srl è uno scorrimento logico a destra (Lezione 05)."),

    Q("Per quali ingressi x NAND y vale 0?", ["x = 0, y = 0", "x = 0, y = 1", "x = 1, y = 1", "mai"], 2, "NAND è il complemento di AND: vale 0 solo quando entrambi gli ingressi valgono 1."),
    Q("Per De Morgan, (a . b')' è uguale a:", ["a' . b", "a' + b", "a + b'", "a' + b'"], 1, "(a . b')' = a' + (b')' = a' + b, usando l'involuzione sul secondo termine."),
    Q("t0 = 0x0000005A. Che cosa c'è in t1 dopo andi t1, t0, 0x0F?", ["0x0000005A", "0x00000050", "0x0000000A", "0x0000000F"], 2, "0x5A = 0101 1010; AND con 0000 1111 conserva il nibble basso: 1010 = 0xA."),
    Q("Quale istruzione porta a 1 il bit 5 di t0 e lascia invariati tutti gli altri bit?", ["andi t0, t0, 0x20", "ori t0, t0, 0x20", "xori t0, t0, 0x20", "addi t0, t0, 0x20"], 1, "OR con una maschera: x + 1 = 1 sul bit 5, x + 0 = x altrove. xori lo invertirebbe; addi propagherebbe un riporto nel bit 6 se il bit fosse già a 1."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Dimostrate con una tabella di verità la seconda legge di De Morgan, (x + y)' = x' . y'",
      "Semplificate con l'algebra: x . y + x . y' . z + x' . y, nominando la legge usata a ogni passo",
      "Scrivete la maschera e l'istruzione che verificano se A e B sono premuti insieme",
      "Modificate il programma delle lampade perché mostrino il complemento dei pulsanti (accese quando rilasciati)",
      "Convertite una lettera da maiuscola a minuscola e viceversa con una sola istruzione bit a bit (suggerimento: ASCII, Lezione 04)",
    ], "Su PRG32: tutte e sette le lampade accese a riposo, ognuna si spegne mentre il suo pulsante è premuto. Per la lettera: xori con 0x20 inverte il bit 5.",
      "Esercizio 2: x y + x y' z + x' y = y (x + x') + x y' z = y + x y' z = y + x z. Esercizio 3: andi t1, t0, 0x30 e poi confronto con 0x30 (li t2, 0x30; beq t1, t2, both): verificare che sia diverso da zero significherebbe A OR B."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["logic circuit", "circuito logico", "truth table", "tabella di verità"],
      ["switching network", "rete di commutazione", "logic gate", "porta logica"],
      ["analysis / synthesis", "analisi / sintesi", "complement", "complemento (negazione)"],
      ["logical product (AND)", "prodotto logico (congiunzione)", "duality", "dualità"],
      ["logical sum (OR)", "somma logica (disgiunzione)", "mask", "maschera"],
      ["involution", "involuzione", "to set / clear / toggle", "porre a 1 / azzerare / invertire"],
    ], null, { widths: [3.2, 3.4, 2.8, 3.2] }),
    T("Conclusioni e letture", [
      "L'architettura di von Neumann rappresenta in forma semplificata una macchina reale: processore, memoria, ingresso/uscita",
      "L'algebra di Boole rappresenta funzioni logiche realizzabili con circuiti elettronici",
      "Tre operazioni, una manciata di proprietà e le leggi di De Morgan bastano a trasformare qualunque espressione",
      "Un'istruzione bit a bit è l'algebra applicata a trentadue bit insieme; una maschera è la legge dell'elemento neutro al lavoro",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, appendice A (fondamenti di progetto logico)", "Playing with RISC-V, capitolo 6: State and Input: Branches, Bitmasks, and Boundaries", "Bucci: Architettura dei calcolatori elettronici, i capitoli sull'algebra di Boole"]],
    ], "Prossima lezione: funzioni booleane, forme canoniche e minimizzazione."),
  ],
});
