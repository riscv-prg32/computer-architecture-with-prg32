// Italian version of decks/en/18-processor.js: same slides, same listings, text in Italian.
// Lecture 18 - The processor.
// Source: 18-Architettura_dei_Calcolatori-Processore.pptx (translated and reorganised; RISC-V replaces the MC68000 as reference processor).
const box14 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "18", file: "18-Architettura_dei_Calcolatori-Processore",
  title: "Il processore", short: "Il processore",
  sub: "Unità di controllo, registri, stack e ALU: il modello generale, e RISC-V come processore di riferimento",
  quote: ["Un Anello per domarli...", "J. R. R. Tolkien, Il Signore degli Anelli, 1954-1955"],
  cover: "prg32qt_debugger.png",
  notes: "La presentazione originale esponeva un modello generale di processore e finiva con l'architettura del Motorola MC68000. Qui il modello generale resta e il riferimento è RISC-V (RV32IMAC, come sull'ESP32-C6 del kit PRG32): gli studenti lo programmano dai primi giorni, quindi ogni elemento astratto ha un nome che conoscono già.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Nominare i componenti di un processore: unità di controllo, ALU, registri, collegamenti con memoria e ingresso/uscita",
      "Distinguere i registri interni dai registri di macchina, e i registri generici da quelli speciali",
      "Spiegare come funziona uno stack e come RISC-V realizza push e pop",
      "Confrontare sullo stesso calcolo i modelli ad accumulatore, a stack e a registri generici",
      "Descrivere RISC-V come processore load-store a registri generici, e leggere il nome RV32IMAC",
      "Riportare ogni elemento del modello generale sul processore del kit PRG32",
    ]),

    H("Riscaldamento sulla macchina", "Una riga di un linguaggio di alto livello."),
    K("z = x + y", `    la   t0, x
    lw   t1, 0(t0)       # bring x into a register
    la   t0, y
    lw   t2, 0(t0)       # bring y into a register
    add  t3, t1, t2      # compute, between registers
    la   t0, z
    sw   t3, 0(t0)       # take the result back to memory

.section .data
x: .word 5
y: .word 7
z: .word 0`, [
      "Sette righe per una somma: la memoria è toccata solo da lw e sw",
      "L'aritmetica avviene solo tra registri",
      "Altri processori fanno lo stesso lavoro con tre istruzioni, o con una",
      "Perché RISC-V è fatto così? Per rispondere serve un modello del processore",
    ], "Il ciclo load-modify-store della Lezione 02, visto ora come scelta di progetto. Tenere a mente i tre indirizzi: lo stesso calcolo ritorna nel confronto tra i modelli di processore."),

    H("Il processore", "Di che cosa è fatto."),
    T("Il calcolatore e il suo processore", [
      "Un calcolatore elettronico è un sistema numerico, automatico, a programma memorizzato, costruito con circuiti elettronici",
      "Tre sottosistemi: processore (CPU), memoria centrale, ingresso/uscita, collegati da bus",
      "Il processore può eseguire soltanto un insieme di istruzioni, da qualche decina a poche centinaia, più o meno complesse",
      "Linguaggio macchina: le stringhe di bit che codificano le istruzioni eseguibili dai circuiti di un processore",
      ["Le istruzioni richiedono", ["trasferimenti di informazione, dentro il calcolatore e da o verso i dispositivi di I/O", "operazioni aritmetiche e logiche"]],
      "Dati e istruzioni di un programma sono memorizzati nella memoria centrale",
    ], "RV32I, la base di RISC-V, ha circa quaranta istruzioni; con le estensioni M, A e C del kit, circa cento codifiche. Il Motorola 68000 aveva cinquantasei tipi di istruzione con molte varianti ciascuno.", { big: "CPU", label: "unità centrale di elaborazione: l'unico anello che governa memoria e ingresso/uscita" }),
    D("Il processore: un modello di riferimento", (s, h) => {
      const y = h.TOP + 0.05;
      h.card(s, h.MX, y, 7.3, 4.65); h.tx(s, "CPU", { x: h.MX + 0.15, y: y + 0.05, w: 1, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      box14(s, h, "rete di\ncontrollo", h.MX + 0.3, y + 0.5, 1.7, 1.5, P.steel, 15);
      box14(s, h, "PC", h.MX + 0.3, y + 2.25, 0.8, 0.6, P.red, 15); box14(s, h, "D", h.MX + 1.2, y + 2.25, 0.8, 0.6, P.red, 15);
      ["R0", "R1", ". . .", "Rn-1"].forEach((r, i) => box14(s, h, r, h.MX + 2.5, y + 0.5 + i * 0.6, 1.6, 0.5, P.teal, 14));
      box14(s, h, "O1", h.MX + 4.7, y + 0.5, 1.0, 0.5, P.violet, 14); box14(s, h, "O2", h.MX + 5.9, y + 0.5, 1.0, 0.5, P.violet, 14);
      box14(s, h, "ALU", h.MX + 4.7, y + 1.15, 2.2, 0.9, P.violet, 18); box14(s, h, "U", h.MX + 5.3, y + 2.2, 1.0, 0.5, P.violet, 14);
      h.line(s, h.MX + 0.3, y + 3.15, h.MX + 7.0, y + 3.15, P.amber, 5); h.tx(s, "bus interno", { x: h.MX + 5.3, y: y + 2.8, w: 1.8, h: 0.3, fontSize: 12, bold: true, color: P.amber });
      box14(s, h, "MA", h.MX + 0.5, y + 3.6, 1.0, 0.6, P.green, 15); box14(s, h, "MB", h.MX + 1.7, y + 3.6, 1.0, 0.6, P.green, 15);
      box14(s, h, "RI", h.MX + 4.3, y + 3.6, 1.0, 0.6, P.green, 15); box14(s, h, "RU", h.MX + 5.5, y + 3.6, 1.0, 0.6, P.green, 15);
      h.tx(s, "collegamento con la memoria", { x: h.MX + 0.4, y: y + 4.25, w: 2.4, h: 0.3, fontSize: 12, italic: true, color: P.mute, align: "center" });
      h.tx(s, "collegamento con l'I/O", { x: h.MX + 4.1, y: y + 4.25, w: 2.6, h: 0.3, fontSize: 12, italic: true, color: P.mute, align: "center" });
      h.rows(s, [
        ["Unità di controllo", ["program counter (PC): la prossima istruzione", "registro di decodifica (D): l'istruzione in esecuzione", "la rete di controllo che emette i comandi"]],
        ["Registri di macchina R0 ... Rn-1"],
        ["Unità aritmetico-logica", ["due registri operando O1 e O2, un registro risultato U"]],
        ["Collegamento con la memoria", ["indirizzo di memoria (MA) e dato di memoria (MB)"]],
        ["Collegamento con l'ingresso/uscita", ["registri di transito RI e RU"]],
      ].map((x) => (x.length === 1 ? x[0] : x)), 8.4, h.TOP, h.W - h.MX - 8.4, h.BOT - h.TOP);
    }, "Modello di riferimento. Pur basati sullo stesso schema logico, e quindi fatti di componenti abbastanza simili, i processori in commercio possono essere molto diversi tra loro."),
    G("Il modello e RISC-V, fianco a fianco", ["Elemento del modello", "In RISC-V", "Visto dal programmatore?"], [
      ["PC, program counter", "pc, 32 bit", "indirettamente: lo usano salti e auipc"],
      ["D, registro di decodifica", "il registro istruzione", "no"],
      ["R0 ... Rn-1, registri di macchina", "x0 ... x31, trentadue registri di 32 bit", "sì: zero, ra, sp, t0, a0, s0, ..."],
      ["O1, O2, U, registri della ALU", "gli ingressi e l'uscita della ALU", "no"],
      ["MA, MB, collegamento con la memoria", "indirizzo e dato di un load o di uno store", "no"],
      ["RI, RU, collegamento con l'I/O", "assenti: i dispositivi sono mappati in memoria", "-"],
      ["registro di stato con i flag", "assente: nessun codice di condizione", "-"],
      ["registri speciali", "i registri di controllo e stato (CSR)", "solo dal software privilegiato"],
    ], "Le due righe «assente» sono semplificazioni volute di RISC-V, spiegate più avanti in questa lezione e nella Lezione 15. L'MC68000 della presentazione originale aveva tutti gli elementi del modello: otto registri dati e otto registri indirizzi, un registro di stato con i codici di condizione, e una circuiteria separata per le interruzioni.", { widths: [3.6, 4.6, 4] }),
    T("Registri interni e registri di macchina", [
      ["Registri interni", ["non direttamente visibili al programmatore, e necessari al funzionamento del processore: PC, MA, MB, D, O1, O2, U, ..."]],
      ["Registri di macchina", ["definiscono il modello di programmazione; si dividono in registri generici e registri speciali"]],
      ["Il processore tratta tre tipi di informazione: istruzioni, indirizzi di memoria e dati", ["la dimensione di MA e PC dipende da quella degli indirizzi", "la dimensione dei registri della ALU dipende da quella dei dati"]],
      "In RV32 tutti e tre sono larghi 32 bit: una sola dimensione per registri, indirizzi e istruzioni",
    ], "Tipi di dato del processore. Il «32» di RV32 è la larghezza dei registri; RV64 ha registri e indirizzi a 64 bit e le stesse istruzioni a 32 bit.", { big: "RV32", label: "registri di 32 bit, indirizzi di 32 bit, istruzioni di 32 bit" }),
    V("In che cosa i processori reali differiscono dal modello",
      ["In generale", ["Possono avere un insieme di registri generici diverso, di solito più ricco", "I registri di macchina possono essere particolari locazioni di memoria", "La sezione di I/O può mancare del tutto, ed essere realizzata da chip dedicati", "Unità aritmetiche molto semplici si possono estendere con chip dedicati che migliorano la ALU"]],
      ["RISC-V sul kit PRG32", ["Trentadue registri generici, in un banco dentro il processore", "Nessuna sezione di I/O: controllori di periferica sullo stesso chip, raggiunti come memoria", "Estensioni facoltative al posto di chip aggiuntivi: M aggiunge moltiplicazione e divisione", "Nessuna estensione F sull'ESP32-C6: la virgola mobile si farebbe in software (Lezione 06)"]],
      "Il modello di processore. Esempio storico di chip aritmetico dedicato: il coprocessore in virgola mobile 68881 per la famiglia 68000, l'8087 per l'8086."),
    V("Parole o byte: la lunghezza delle parole di macchina",
      ["Processori a parola", ["Tutte le parole di macchina hanno la stessa lunghezza", "Dimensionata sull'informazione più lunga", "Scomodi con dati di natura intrinsecamente variabile", "RISC-V: ogni istruzione è di 32 bit (16 nella forma compressa)"]],
      ["Processori a carattere (byte)", ["La lunghezza delle parole di macchina è variabile, multipla di un byte", "Adatti al trattamento delle stringhe", "Intel x86: istruzioni da 1 a 15 byte", "MC68000: istruzioni da una a cinque parole di 16 bit"]],
      "Processore a voce o a caratteri. Un parametro caratteristico di un processore è il numero di bit dei suoi registri: il parallelismo dei trasferimenti interni, 8, 16, 32 o 64 bit."),
    G("Stato utente e stato supervisore", ["Stato", "Chi vi gira", "Che cosa può fare", "Nome in RISC-V"], [
      ["supervisore", "il sistema operativo", "ogni istruzione dell'insieme", "modo macchina (M); modo supervisore (S) dove c'è un sistema operativo completo"],
      ["utente", "un programma utente", "tutto tranne le istruzioni privilegiate", "modo utente (U)"],
    ], "Stato utente o stato supervisore. RISC-V definisce tre modi di privilegio: M, il più privilegiato e l'unico obbligatorio, esegue il firmware; S esegue il kernel di un sistema operativo come Linux; U esegue le applicazioni. L'ESP32-C6 realizza M e U. Il cambio di modo avviene attraverso le trap (Lezione 19).", { widths: [1.8, 2.6, 3.6, 4.2], fs: 17, caption: "Il processore è in stato supervisore quando esegue il sistema operativo, in stato utente quando esegue un programma utente." }),

    H("I registri", "A che cosa servono."),
    T("Tipi di registri", [
      ["Un registro può essere specializzato, oppure svolgere più compiti", ["i registri specializzati richiedono codici operativi specializzati per la stessa operazione su banchi diversi", "concentrare più funzioni dà più complessità interna e più flessibilità d'uso"]],
      ["I registri di macchina, diversi per numero e spesso raggruppati in banchi, si possono organizzare", ["come una memoria indirizzabile: un banco R, il registro Ri", "come registri autonomi, ciascuno con il proprio nome"]],
      "RISC-V: un banco di trentadue registri, indirizzati da 5 bit dentro l'istruzione; i nomi t0, a0, sp sono soltanto convenzioni",
    ], "Tipologia dei registri. I registri speciali sono usati esclusivamente dal sistema operativo: ausili all'indirizzamento, registri delle interruzioni, limiti di memoria. In alcuni processori i registri generici indirizzabili erano le prime locazioni di memoria: la «pagina zero» del 6502."),
    T("Le funzioni dei registri", [
      ["Transito dei dati", ["da memoria a registro, da registro a registro, da registro a memoria: load, move, store"]],
      ["Accumulo dei risultati", ["necessario per aritmetica e logica: R := (op) R, oppure R := R (op) X"]],
      ["Indirizzamento", ["trovare l'indirizzo di un operando: registri indice, registri base"]],
      ["Puntatori allo stack", ["gestione di uno stack realizzato in memoria"]],
      ["Indicatori, o flag", ["informazione binaria su eventi: zero, segno, overflow, riporto, indirizzi o codici illeciti", "prodotti durante l'esecuzione di un'istruzione, possono condizionare le successive"]],
    ], "Funzione dei registri. In RISC-V le prime quattro funzioni sono svolte tutte dai registri generici; la quinta non esiste come registro."),
    G("I trentadue registri di RISC-V", ["Registro", "Nome", "Funzione, per convenzione", "Registro", "Nome", "Funzione, per convenzione"], [
      ["x0", "zero", "sempre 0", "x8 - x9", "s0 - s1", "salvati"],
      ["x1", "ra", "indirizzo di ritorno", "x10 - x11", "a0 - a1", "argomenti, risultati"],
      ["x2", "sp", "puntatore allo stack", "x12 - x17", "a2 - a7", "argomenti"],
      ["x3", "gp", "puntatore globale", "x18 - x27", "s2 - s11", "salvati"],
      ["x4", "tp", "puntatore al thread", "x28 - x31", "t3 - t6", "temporanei"],
      ["x5 - x7", "t0 - t2", "temporanei", "pc", "-", "program counter (fuori dal banco)"],
    ], "L'hardware tratta allo stesso modo i registri da x1 a x31; solo x0 è speciale. I ruoli vengono dalla convenzione di chiamata (Lezione 02). L'MC68000 separava invece i registri dati D0-D7 dai registri indirizzi A0-A7, con A7 come puntatore allo stack.", { widths: [1.3, 1.3, 3.2, 1.5, 1.4, 3.5], mono: [0, 1, 3, 4], fs: 17 }),
    V("I flag: il registro di stato, e la sua assenza",
      ["Processori con registro di stato", ["Bit di flag accessibili dal programma", "Z zero, N negativo, V overflow, C riporto, a volte la parità", "Un'istruzione li imposta; un salto condizionato successivo li esamina", "MC68000: il registro dei codici di condizione; x86: il registro dei flag"]],
      ["RISC-V: nessun flag", ["Un salto confronta due registri e salta, in una sola istruzione: beq, bne, blt, bge, bltu, bgeu", "slt e sltu scrivono il risultato di un confronto in un registro generico", "Riporto e overflow si calcolano quando servono (Lezione 05)", "Meno stato nascosto: pipeline più semplici, interruzioni più semplici"]],
      "Registro di stato. La presentazione originale elencava Z, N, P (positivo), V, C e un bit di parità."),
    G("Registri speciali di RISC-V: i CSR", ["Registro", "Nome", "Che cosa contiene"], [
      ["mstatus", "stato della macchina", "l'abilitazione globale delle interruzioni e il modo di privilegio precedente"],
      ["mtvec", "vettore delle trap", "l'indirizzo della routine che gestisce interruzioni ed eccezioni"],
      ["mepc", "program counter dell'eccezione", "l'indirizzo dell'istruzione che è stata interrotta"],
      ["mcause", "causa della trap", "un codice che dice perché è avvenuta la trap"],
      ["mie, mip", "interruzioni abilitate, interruzioni pendenti", "un bit per sorgente di interruzione"],
    ], "Registri di controllo e stato: un banco separato di al più 4096 registri, letti e scritti solo con le istruzioni csrrw, csrrs e csrrc, e solo da codice privilegiato. Sono i «registri delle interruzioni» del modello generale, e l'argomento della Lezione 19.", { widths: [1.8, 3.6, 6.8], mono: [0] }),

    H("Lo stack", "L'ultimo a entrare è il primo a uscire."),
    T("Lo stack", [
      "Una struttura dati astratta con due operazioni: push memorizza un elemento come ultimo della pila, pop toglie l'ultimo elemento",
      "Lavora sempre e solo sulla cima: non occorre dire dove memorizzare o prelevare",
      "Serve a mettere da parte il contenuto dei registri da liberare per svolgere un compito, e a ripristinarlo dopo: sottoprogrammi, interruzioni",
      "Realizzato con un puntatore, in memoria o in un registro dedicato, che indica in ogni istante la posizione dell'ultimo elemento",
      "Le operazioni sullo stack dovrebbero controllare l'overflow su un push e lo stack vuoto su un pop",
    ], "LIFO, last in, first out. Lo usate dalla Lezione 02 per salvare ra.", { big: "LIFO", label: "l'ultimo valore inserito è il primo a essere estratto" }),
    D("Push e pop in RISC-V", (s, h) => {
      const x = h.MX + 1.5, w = 2.4, ch = 0.58, y0 = h.TOP + 0.45, vals = ["(libero)", "(libero)", "-28", "-17", "739", "43"];
      h.tx(s, "memoria", { x, y: h.TOP - 0.02, w, h: 0.3, fontSize: 13, bold: true, color: P.steel, align: "center" });
      h.tx(s, "indirizzi bassi", { x: x + w + 0.15, y: y0, w: 1.6, h: ch, fontSize: 11.5, italic: true, color: P.mute, valign: "middle" });
      vals.forEach((v, i) => s.addText(v, { isTextBox: true, shape: h.pres.ShapeType.rect, x, y: y0 + i * ch, w, h: ch, fill: { color: i === 2 ? P.amber : i < 2 ? P.panel : P.tealSoft }, line: { color: P.steel, width: 1 }, color: i === 2 ? P.white : i < 2 ? P.mute : P.ink, bold: true, fontFace: h.MONO, fontSize: 15, align: "center", valign: "middle", margin: 0 }));
      h.tx(s, "fondo dello stack", { x: x + w + 0.15, y: y0 + 5 * ch, w: 2, h: ch, fontSize: 11.5, italic: true, color: P.mute, valign: "middle" });
      h.arrow(s, x - 0.9, y0 + 2.5 * ch, x - 0.05, y0 + 2.5 * ch, P.red, 2.25); h.tx(s, "sp", { x: x - 1.5, y: y0 + 2 * ch, w: 0.55, h: ch, fontSize: 18, bold: true, fontFace: h.MONO, color: P.red, valign: "middle", align: "right" });
      h.tx(s, "sp punta all'ultima locazione occupata; lo stack cresce verso gli indirizzi bassi.", { x: h.MX, y: y0 + 6 * ch + 0.15, w: 5.6, h: 0.7, fontSize: 14 });
      h.codeBox(s, "# push t0\naddi sp, sp, -4      # make room\nsw   t0, 0(sp)       # store on top\n\n# pop t0\nlw   t0, 0(sp)       # fetch the top\naddi sp, sp, 4       # release it", 6.6, h.TOP, h.W - h.MX - 6.6, 3.0, "asm", 16);
      h.table(s, 6.6, h.TOP + 3.25, [2.2, 3.93], ["Processore", "Push"], [["RISC-V", "addi sp, sp, -4 e sw: due istruzioni"], ["MC68000", "MOVE D0, -(SP): un modo di indirizzamento con predecremento"], ["Intel x86", "PUSH: un'istruzione dedicata"]], { fs: 13.5, mono: [] });
    }, "I valori sono quelli disegnati nella presentazione originale. RISC-V non ha push e pop: un frame di stack si alloca una volta per funzione, sedici byte alla volta, e si riempie con normali store (Lezione 02). La forma del 68000 MOVE (SP)+, D0 estrae con un postincremento."),

    H("Modelli di processore", "Dove vivono gli operandi."),
    C("Quattro architetture del processore", [
      ["Registri generici", "Il processore ha un insieme di registri REG0, REG1, ..., REGN-1 utilizzabili in modo intercambiabile."],
      ["Accumulatore", "Tutte le istruzioni aritmetiche, logiche e di confronto hanno un operando implicito: un registro speciale, l'accumulatore."],
      ["Stack", "Non ci sono né accumulatori né registri generici, solo il puntatore allo stack; le istruzioni lavorano sui dati in cima allo stack."],
      ["Ortogonale", "Un unico banco di registri generici, alcuni dei quali fanno, quando serve, da puntatore allo stack o da altri registri speciali."],
    ], "Modello a registri generici, ad accumulatore, a stack; architetture ortogonali. La definizione originale di ortogonale cita anche un registro di stato; RISC-V è ortogonale e non ha nemmeno quello."),
    G("z = x + y in quattro processori", ["Modello", "Esempio", "Programma", "Accessi alla memoria"], [
      ["accumulatore", "Motorola 6809, MOS 6502", "LDA x ;  ADD y ;  STA z", "3"],
      ["stack", "macchina virtuale Java, WebAssembly", "PUSH x ;  PUSH y ;  ADD ;  POP z", "3, più lo stack stesso"],
      ["registri generici, operandi in memoria", "MC68000, Intel x86", "MOVE x, D0 ;  ADD y, D0 ;  MOVE D0, z", "3"],
      ["registri generici, load-store", "RISC-V", "lw t1, x ;  lw t2, y ;  add t3, t1, t2 ;  sw t3, z", "3"],
    ], "Gli stessi tre accessi alla memoria ovunque: cambia quante sono le istruzioni e quanto è complessa ciascuna. Nel modello registro-memoria un'istruzione come ADD y, D0 legge la memoria e calcola; nel modello load-store ogni istruzione fa una cosa sola. Le macchine a stack con lo stack in memoria sono in genere più lente di quelle a registri generici. lw t1, x è una forma abbreviata che l'assemblatore accetta per la coppia la e lw del riscaldamento.", { widths: [2.6, 2.6, 5.9, 1.3], mono: [2], fs: 15 }),
    T("RISC-V: un processore load-store a registri generici", [
      "Le istruzioni che lavorano sui registri sono più veloci di quelle che lavorano su locazioni di memoria: i dati più usati si tengono nei registri",
      "Solo load e store toccano la memoria; ogni altra istruzione lavora da registro a registro",
      "Tre operandi: due sorgenti e una destinazione, così nessun valore viene distrutto se non lo si vuole",
      "Ogni istruzione fa una cosa semplice e ha dimensione fissa: facile da decodificare, facile da eseguire in pipeline",
      "È questo il significato di RISC: reduced instruction set computer",
    ], "Da registro a registro: [REGX] + [REGY] dà [REGZ]. Le forme da memoria a registro e da registro a memoria della presentazione originale esistono nei processori CISC e sono esattamente ciò a cui RISC rinuncia.", { big: "load, calcolo, store", label: "il ritmo di ogni programma RISC-V, dal primo contatore all'ultimo gioco" }),

    H("La ALU e il quadro d'insieme"),
    T("L'unità aritmetico-logica", [
      "Sovrintende alle operazioni aritmetiche e logiche tra operandi",
      "Fisicamente inclusa nel processore nelle architetture elementari; un apparato indipendente in quelle più complesse",
      "Una soluzione diffusa: un'unità aritmetica ridotta dentro il processore, e apparati indipendenti per le operazioni più sofisticate",
      "Schema: due registri di ingresso O1 e O2 per gli operandi, un registro di uscita U per il risultato",
      ["Le operazioni dipendono dai tipi di dato e dalla loro rappresentazione", ["tipo logico, stringhe di caratteri, puntatori, numeri nelle varie codifiche delle Lezioni 05 e 06"]],
    ], "La ALU della Lezione 11, vista dal processore. In RISC-V gli «apparati indipendenti» sono le estensioni: M per moltiplicazione e divisione, F e D per la virgola mobile."),
    D("L'architettura di un processore RV32", (s, h) => {
      const y = h.TOP + 0.9, st = [["PC", "indirizzo\ndell'istruzione", P.red, 1.3], ["memoria\nistruzioni", "prelievo", P.violet, 1.7], ["decodificatore e\nunità di controllo", "campi e\ncomandi", P.steel, 1.9], ["banco dei registri", "x0 - x31\n32 x 32 bit", P.teal, 1.8], ["ALU", "calcola, o forma\nun indirizzo", P.amber, 1.5], ["memoria\ndati", "load, store", P.violet, 1.5]];
      let x = h.MX; const g = (h.CW - st.reduce((a, b) => a + b[3], 0)) / 5;
      st.forEach(([t, d, c, w], i) => {
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 11.5 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: 1.6, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 5) h.arrow(s, x + w + 0.04, y + 0.8, x + w + g - 0.04, y + 0.8, P.mute, 2.5);
        st[i].x = x; x += w + g; });
      const rx = st[3].x + 0.9, ex = st[5].x + 0.75;
      h.line(s, ex, y + 1.63, ex, y + 2.3, P.green, 2.5); h.line(s, ex, y + 2.3, rx, y + 2.3, P.green, 2.5); h.arrow(s, rx, y + 2.3, rx, y + 1.63, P.green, 2.5);
      h.tx(s, "write back: il risultato torna nel registro indicato da rd", { x: rx, y: y + 2.35, w: ex - rx, h: 0.3, fontSize: 12.5, bold: true, color: P.green, align: "center" });
      const px = st[0].x + 0.65;
      h.arrow(s, px, y - 0.6, px, y - 0.03, P.red, 2.5); h.line(s, px, y - 0.6, st[4].x + 0.75, y - 0.6, P.red, 2.5); h.line(s, st[4].x + 0.75, y - 0.6, st[4].x + 0.75, y - 0.03, P.red, 2.5);
      h.tx(s, "PC prossimo: PC + 4, oppure la destinazione del salto", { x: px + 0.2, y: y - 0.95, w: 6, h: 0.3, fontSize: 12.5, bold: true, color: P.red });
      h.tx(s, "Accanto, fuori dal percorso principale: il banco dei registri di controllo e stato, e la logica delle trap della Lezione 19. Rispetto all'MC68000 della presentazione originale non ci sono registri dati e indirizzi separati, né registro dei codici di condizione, né registro dell'indirizzo effettivo.", { x: h.MX, y: 5.6, w: h.CW, h: 1.15, fontSize: 14.5, valign: "middle" });
    }, "Il classico datapath RISC-V a ciclo singolo di Patterson e Hennessy, ridotto ai suoi blocchi; memoria istruzioni e memoria dati sono lo stesso spazio di indirizzi, disegnato due volte per chiarezza. Sostituisce la slide «Architettura del processore MC68000»."),
    G("Il processore del kit PRG32", ["Caratteristica", "ESP32-C6"], [
      ["Insieme di istruzioni", "RV32IMAC: insieme intero di base, moltiplicazione e divisione, atomiche, istruzioni compresse"],
      ["Core principale", "un core RISC-V a 32 bit, fino a 160 MHz, pipeline a quattro stadi"],
      ["Secondo core", "un core RISC-V a basso consumo, fino a 20 MHz, per i compiti che girano mentre il core principale dorme"],
      ["Modi di privilegio", "macchina e utente"],
      ["Virgola mobile", "nessuna: né estensione F né D"],
      ["Memoria", "512 KB di SRAM, 320 KB di ROM, flash esterna"],
      ["Sullo stesso chip", "radio Wi-Fi 6, Bluetooth, Thread e Zigbee; periferiche SPI, I2S, GPIO e timer"],
    ], "Dal datasheet Espressif dell'ESP32-C6. Un calcolatore completo su un chip di pochi millimetri quadrati che costa circa due euro: processore, memoria e ingresso/uscita ci sono tutti, come nel modello delle prime slide.", { widths: [2.8, 9.4] }),

    Q("Quale registro del modello generale non ha corrispettivo in RISC-V?", ["il program counter", "il registro di stato con i flag", "il puntatore allo stack", "il registro istruzione"], 1, "RISC-V non ha codici di condizione: i salti confrontano direttamente i registri."),
    Q("In RISC-V, quali istruzioni possono leggere o scrivere la memoria centrale?", ["tutte", "add e sub", "solo load e store", "solo i salti"], 2, "È un'architettura load-store: lw, lh, lb, sw, sh, sb e le forme senza segno."),
    Q("Dopo addi sp, sp, -4 e sw t0, 0(sp), che cosa è successo?", ["t0 è stato estratto dallo stack", "t0 è stato inserito sullo stack", "lo stack è stato svuotato", "sp è stato salvato in t0"], 1, "Il puntatore scende di una parola e il valore è memorizzato sulla nuova cima: un push."),
    Q("In una macchina ad accumulatore, l'istruzione ADD y significa:", ["y := y + accumulatore", "accumulatore := accumulatore + [y]", "push di y, poi somma", "y := accumulatore"], 1, "L'accumulatore è l'operando implicito e la destinazione."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Scrivete z = (a + b) - (c + d) per una macchina ad accumulatore, una a stack e RISC-V; contate istruzioni e accessi alla memoria",
      "Scrivete push e pop di due registri, t0 e t1, tenendo sp multiplo di 16 come richiede la convenzione di chiamata",
      "Per ogni registro usato nel vostro ultimo programma PRG32, dite quale funzione svolge: transito, accumulo, indirizzamento, stack",
      "In PRG32-QT eseguite passo-passo una chiamata e il suo ritorno: osservate pc, ra e sp, e la parola salvata sullo stack",
      "Trovate nel datasheet del processore del vostro telefono o portatile: insieme di istruzioni, numero di core, clock, livelli di privilegio",
    ], "Su PRG32-QT: sp scende di 16 al prologo e ritorna all'epilogo; ra contiene l'indirizzo successivo alla chiamata.",
      "Accumulatore: LDA a; ADD b; STA tmp; LDA c; ADD d; STA tmp2; LDA tmp; SUB tmp2; STA z. Stack: PUSH a; PUSH b; ADD; PUSH c; PUSH d; ADD; SUB; POP z. RISC-V: quattro load, due add, una sub, uno store."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["control unit", "unità di controllo", "accumulator", "accumulatore"],
      ["program counter", "contatore di programma", "stack pointer", "puntatore allo stack"],
      ["machine register", "registro di macchina", "status register, flags", "registro di stato, indicatori"],
      ["general / special register", "registro generico / speciale", "supervisor / user state", "stato supervisore / utente"],
      ["instruction set", "insieme (set) di istruzioni", "privileged instruction", "istruzione privilegiata"],
    ], null, { widths: [3, 3.2, 3.2, 3.4] }),
    T("Conclusioni e letture", [
      "Il processore comanda e controlla, appoggiandosi alla memoria e ai sistemi di ingresso/uscita",
      "I registri sono locazioni di memoria che possono stare fisicamente dentro o fuori dal processore",
      "I tipi di registri e il modo in cui si usano determinano il modello di processore: accumulatore, stack, registri generici",
      "La ALU svolge le operazioni tra operandi",
      "RISC-V è un processore load-store a registri generici, senza flag e senza istruzioni di I/O: pochi elementi, ciascuno semplice",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, capitoli 2 e 4", "The RISC-V Instruction Set Manual, volume I: Unprivileged Architecture", "Stallings: Computer Organization and Architecture, i capitoli su struttura e funzione del processore"]],
    ], "Prossima lezione: istruzioni e interruzioni."),
  ],
});
