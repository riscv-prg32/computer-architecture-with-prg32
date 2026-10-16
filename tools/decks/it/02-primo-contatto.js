// Italian version of decks/en/02-first-contact.js: same slides, same listings, text in Italian.
// Lecture 02 - First contact with RISC-V assembly on PRG32 (new in 2026/27).
// The listings are the verified steps of the textbook lab "05-asm-first-contact".
const SKELETON = `# Assembly Lab 1: the smallest program that runs
.option norelax

.section .text
.global first_init
.global first_update
.global first_draw

first_init:
    ret

first_update:
    ret

first_draw:
    ret`;

const BUILD = `# 1. build a portable cartridge from one assembly file
python3 -m prg32 cartridge build step1_skeleton.S --portable \\
    --entry-prefix first --name step1 --out build/step1.prg32

# 2a. run it in QEMU on your laptop
python3 -m prg32 qemu upload build/step1.prg32
python3 -m prg32 qemu run

# 2b. or send it to a board, or to PRG32-QT, over the network
python3 -m prg32 esp32c6 upload-and-run build/step1.prg32 \\
    --url http://192.168.4.1 --slot cart0`;

const HELLO = `first_draw:
    addi sp, sp, -16      # prologue: a 16-byte frame
    sw   ra, 12(sp)       # save the return address

    li   a0, BLACK
    call prg32_gfx_clear

    li   a0, 32           # x
    li   a1, 40           # y
    la   a2, title        # address of the string
    li   a3, WHITE        # foreground
    li   a4, BLACK        # background
    call prg32_gfx_text8

    lw   ra, 12(sp)       # epilogue: restore ra
    addi sp, sp, 16       # release the frame
    ret

.section .rodata
title:
    .asciz "HELLO PRG32"`;

const COUNTER = `first_update:
    # A leaf function: it calls nothing,
    # so it needs no stack frame.
    la   t0, counter      # t0 = ADDRESS of counter
    lw   t1, 0(t0)        # t1 = VALUE stored there   (load)
    addi t1, t1, 1        # one tick per frame        (modify)
    sw   t1, 0(t0)        # write it back             (store)
    ret

.section .data
counter: .word 0`;

const BAR = `    la   t0, counter
    lw   t1, 0(t0)
    andi a2, t1, 255      # width = counter modulo 256
    li   a0, 32           # x
    li   a1, 60           # y
    li   a3, 8            # height
    li   a4, GREEN        # .equ GREEN, 0x07e0
    call prg32_gfx_rect`;

Deck({
  n: "02", file: "02-Architettura_dei_Calcolatori-Primo_Contatto_con_Assembly_RISC-V",
  title: "Primo contatto: l'assembly RISC-V su PRG32", short: "Primo contatto con l'assembly RISC-V",
  sub: "Registri, memoria e chiamata: un programma che gira prima di ogni teoria",
  quote: ["Le chiacchiere stanno a zero. Fammi vedere il codice.", "Linus Torvalds, mailing list del kernel Linux, 2000"],
  cover: "lab1_step4_bar.png",
  notes: "Lezione nuova del 2026/27. È il turno «gioca» della spirale per tutta la prima metà del corso: ogni lezione successiva rimanda a qualcosa scritto qui. I quattro passi sono quelli verificati del laboratorio 05-asm-first-contact del libro di PRG32; eseguirli dal vivo (labs/run.sh 05-asm-first-contact/stepN_....S first).",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Compilare una cartuccia da un file assembly ed eseguirla su PRG32",
      "Dire che cos'è un registro, e nominare quelli che userete ogni giorno",
      "Chiamare una funzione del framework, passando gli argomenti nei registri",
      "Conservare un valore in memoria da un frame al successivo: load, modify, store",
      "Leggere un'istruzione come il numero a 32 bit che è davvero",
      "Elencare le domande che questo programma solleva: il resto del corso risponde",
    ], "Dire esplicitamente agli studenti che oggi non ci si aspetta che capiscano tutto. Oggi si guarda; le prossime lezioni servono a spiegare."),

    H("La macchina", "Trentadue registri e un piccolo repertorio di istruzioni."),
    C("La macchina che state programmando", [
      ["32 registri", "Ogni registro contiene un valore a 32 bit. Il processore sa calcolare solo su valori che stanno nei registri."],
      ["Calcolare", "Un'operazione aritmetica o logica tra registri: add, sub, and, or, xor, e le forme con immediato come addi."],
      ["Spostare", "Un trasferimento tra un registro e la memoria: lw carica una parola, sw la memorizza. Nient'altro tocca la memoria."],
      ["Saltare", "Un cambio dell'istruzione che verrà eseguita dopo: salti condizionati come beqz, chiamate e ritorni."],
    ], "Questa è quasi tutta la macchina. La ricchezza del calcolo non viene da un insieme di istruzioni ampio, ma dal combinarne uno piccolo in lunghe sequenze."),
    G("I registri che userete davvero", ["Registro", "Nome", "Ruolo", "Conservato da una chiamata?"], [
      ["a0 - a7", "argomenti", "valori passati a una chiamata; a0 porta anche il valore di ritorno", "no"],
      ["t0 - t6", "temporanei", "valori di appoggio", "no"],
      ["s0 - s11", "salvati", "valori che una chiamata promette di conservare", "sì"],
      ["ra", "indirizzo di ritorno", "dove salta ret al ritorno", "no: salvatelo voi"],
      ["sp", "puntatore allo stack", "cima dello stack, sempre allineata a 16 byte", "sì"],
      ["zero", "zero", "si legge sempre 0; le scritture sono ignorate", "-"],
    ], "I ruoli non sono fissati dall'hardware ma da un accordo: la convenzione di chiamata, o ABI. Rispettarla è ciò che permette al vostro assembly e al codice C del framework di chiamarsi a vicenda.", { widths: [1.6, 2.2, 5.6, 3], mono: [0], caption: "I ruoli vengono da un accordo, la convenzione di chiamata (ABI), non dall'hardware." }),
    F("Il contratto: tre funzioni che scrivete voi", [
      "init|chiamata una volta, all'avvio della cartuccia: prepara lo stato",
      "update|chiamata una volta per frame: legge l'ingresso, cambia lo stato",
      "draw|chiamata una volta per frame: trasforma lo stato in un'immagine",
    ], "Il firmware trova le tre funzioni per nome: un prefisso scelto da voi, seguito da _init, _update e _draw. È l'intero contratto tra il vostro gioco e la macchina."),

    H("La prima cartuccia", "Quattro piccoli passi, ognuno un programma completo che gira."),
    K("Passo 1: il più piccolo programma che gira", SKELETON, [
      ".option norelax rende prevedibile la disposizione della cartuccia: ogni esempio PRG32 comincia così",
      ".section .text dice che ciò che segue è codice eseguibile",
      ".global rende un'etichetta visibile al firmware, che trova le funzioni per nome",
      "ret ritorna al chiamante: tre funzioni che non fanno nulla, correttamente",
    ], "Sorgente: labs/05-asm-first-contact/step1_skeleton.S. Risultato atteso: uno schermo nero. Il risultato è che il framework ha trovato le tre funzioni, le ha chiamate, ed è sopravvissuto."),
    K("Compilare, eseguire", BUILD, null, "Sorgente: labs/run.sh. Con PRG32_HOME impostata, l'intera sequenza è: labs/run.sh 05-asm-first-contact/step1_skeleton.S first . Il file della cartuccia è identico byte per byte per QEMU, per la scheda e per PRG32-QT.", "sh"),
    WK("Passo 2: dire ciao", HELLO, "lab1_step2_hello.png",
      "Il primo argomento va in a0, il secondo in a1, e così via. li carica un numero; la carica l'indirizzo di un'etichetta.",
      "Sorgente: labs/05-asm-first-contact/step2_hello.S. Le righe .equ (BLACK 0x0000, WHITE 0xffff) sono omesse sulla slide."),
    D("Perché salvare ra? Il frame di stack", (s, h) => {
      const x = 8.3, w = 3.2, ch = 0.62, y0 = h.TOP + 0.75;
      h.rows(s, [
        "call memorizza in ra l'indirizzo a cui tornare",
        "La funzione chiamata userà ra per le proprie chiamate, sovrascrivendo il vostro",
        ["Perciò una funzione che ne chiama un'altra salva prima ra", ["abbassa sp di 16 per fare spazio", "memorizza ra in 12(sp)"]],
        ["Dopo la chiamata, si disfa tutto in ordine inverso", ["ricarica ra, alza sp di 16, poi ret"]],
        "Dimenticare la coppia è il classico primo bug: la funzione ritorna nel posto sbagliato",
      ], h.MX, h.TOP, 7.1, h.BOT - h.TOP);
      h.tx(s, "Lo stack dopo il prologo", { x, y: h.TOP, w: w + 1.4, h: 0.4, fontSize: 15, bold: true, color: P.steel });
      const cells = [["dati del chiamante", "16(sp)", P.rule, P.ink], ["ra", "12(sp)", P.amber, P.white], ["libero", " 8(sp)", P.panel, P.mute], ["libero", " 4(sp)", P.panel, P.mute], ["libero", " 0(sp)", P.panel, P.mute]];
      cells.forEach(([t, off, fill, col], i) => {
        s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.rect, x, y: y0 + i * ch, w, h: ch, fill: { color: fill }, line: { color: P.steel, width: 1 }, color: col, bold: true, fontFace: h.MONO, fontSize: 16, align: "center", valign: "middle", margin: 0 });
        h.tx(s, off, { x: x + w + 0.15, y: y0 + i * ch, w: 1.2, h: ch, fontSize: 14, fontFace: h.MONO, color: P.mute, valign: "middle" });
      });
      h.arrow(s, x - 0.9, y0 + 4.5 * ch, x - 0.05, y0 + 4.5 * ch, P.red, 2.25);
      h.tx(s, "sp", { x: x - 1.5, y: y0 + 4 * ch, w: 0.55, h: ch, fontSize: 18, bold: true, fontFace: h.MONO, color: P.red, valign: "middle", align: "right" });
      h.tx(s, "indirizzi più alti", { x, y: y0 - 0.32, w, h: 0.28, fontSize: 11.5, color: P.mute, italic: true, align: "center" });
      h.tx(s, "Lo stack cresce verso il basso: si sottrae da sp per allocare, si somma per rilasciare.", { x: x - 0.6, y: y0 + 5 * ch + 0.2, w: w + 2, h: 0.7, fontSize: 14, color: P.ink });
    }, "La convenzione richiede che sp resti allineato a 16 byte tra una chiamata e l'altra: per questo il frame è di 16 byte anche se ne servono solo 4. Lo stack, con push e pop, è trattato formalmente nella Lezione 18."),
    K("Passo 3: un valore che sopravvive tra i frame", COUNTER, [
      "counter è un'etichetta: dà un nome a una locazione di memoria, nella sezione .data, che contiene una parola di 32 bit",
      "la mette in t0 l'INDIRIZZO di quella locazione",
      "lw legge in t1 il VALORE a quell'indirizzo; sw lo riscrive",
      "Il processore calcola solo nei registri: load, modify, store",
    ], "Sorgente: labs/05-asm-first-contact/step3_counter.S. Non cambia ancora nulla di visibile: il contatore avanza ma nessuno lo disegna. Chiedere all'aula come si potrebbe dimostrare che avanza (risposta: il debugger di PRG32-QT, oppure il passo successivo)."),
    D("Indirizzo o valore? Il nodo della memoria", (s, h) => {
      const y = h.TOP + 0.5;
      // registers
      h.tx(s, "Registri (dentro il processore)", { x: h.MX, y: h.TOP, w: 5, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      [["t0", "indirizzo di counter", P.teal], ["t1", "41  poi  42", P.amber]].forEach(([r, v, c], i) => {
        const yy = y + i * 1.25;
        h.tx(s, r, { x: h.MX, y: yy, w: 0.7, h: 0.75, fontSize: 22, bold: true, fontFace: h.MONO, valign: "middle" });
        s.addText(v, { isTextBox: true, shape: h.pres.ShapeType.rect, x: h.MX + 0.8, y: yy, w: 3.6, h: 0.75, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, bold: true, fontFace: h.MONO, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      });
      // memory
      h.tx(s, "Memoria (sezione .data)", { x: 8.2, y: h.TOP, w: 4.5, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      ["...", "counter:  41", "..."].forEach((t, i) => {
        s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.rect, x: 8.2, y: y + i * 0.75, w: 3.9, h: 0.75, fill: { color: i === 1 ? P.amberSoft : P.panel }, line: { color: P.steel, width: 1 }, color: P.ink, bold: i === 1, fontFace: h.MONO, fontSize: 17, align: "center", valign: "middle", margin: 0 });
      });
      h.arrow(s, h.MX + 4.45, y + 0.375, 8.15, y + 1.05, P.teal, 2.25);
      h.tx(s, "t0 punta qui", { x: 5.3, y: y + 0.15, w: 2.6, h: 0.3, fontSize: 13, italic: true, color: P.teal, align: "center" });
      h.arrow(s, 8.15, y + 1.25, h.MX + 4.45, y + 1.5, P.amber, 2.25);
      h.tx(s, "lw copia il contenuto", { x: 5.2, y: y + 1.55, w: 2.9, h: 0.3, fontSize: 13, italic: true, color: P.amber, align: "center" });
      h.codeBox(s, "la   t0, counter    # t0 = WHERE the value lives\nlw   t1, 0(t0)      # t1 = WHAT is stored there\naddi t1, t1, 1      # change the copy in the register\nsw   t1, 0(t0)      # memory still says 41 until this line", h.MX, 4.35, 8.0, 2.4, "asm", 15);
      h.card(s, 9.0, 4.35, h.W - h.MX - 9.0, 2.4, P.redSoft);
      h.tx(s, "Usare un indirizzo dove serve un valore, o il contrario, è uno degli errori più comuni dei principianti. Commentate ogni registro: INDIRIZZO o VALORE.", { x: 9.2, y: 4.45, w: h.W - h.MX - 9.4, h: 2.2, fontSize: 15.5, valign: "middle" });
    }, "Un'etichetta dà un nome a una locazione. la dà la locazione, lw dà il contenuto. È così che funziona, in ultima analisi, ogni variabile di ogni programma; ci si torna formalmente con i modi di indirizzamento."),
    WK("Passo 4: rendere visibile il contatore", BAR, "lab1_step4_bar.png",
      "La barra cresce da 0 a 255 pixel, poi ricomincia. andi con 255 conserva solo gli otto bit bassi del contatore.",
      "Sorgente: labs/05-asm-first-contact/step4_bar.S (le righe aggiunte a first_draw). In queste otto righe si nascondono tre lezioni future: 255 = 0xFF (notazione posizionale), andi come maschera di bit (algebra di Boole), 0x07e0 come colore (codifica dell'informazione)."),

    H("Leggere ciò che avete scritto", "Lo stesso programma, visto come lo vede il processore."),
    G("Le istruzioni che avete appena usato", ["Famiglia", "Istruzione", "Che cosa fa", "Esempio"], [
      ["Aritmetica", "add, sub", "combina due registri", "add t0, t1, t2"],
      ["Logica", "and, or, xor", "operazione bit a bit su due registri", "and t0, t1, t2"],
      ["Immediato", "addi, andi, ori, xori", "un registro e una piccola costante", "addi t1, t1, 1"],
      ["Memoria", "lw, sw", "carica o memorizza una parola di 32 bit", "lw t1, 0(t0)"],
      ["Controllo", "call, ret", "va a una funzione e ritorna", "call prg32_gfx_rect"],
    ], "Il risultato va nel primo registro. L'insieme di base delle istruzioni intere di RISC-V (RV32I) ha circa quaranta istruzioni; ne avete già incontrato un quarto.", { widths: [1.9, 3.2, 4.2, 3.3], mono: [1, 3] }),
    G("Pseudo-istruzioni: scorciatoie che l'assemblatore espande", ["Scrivete", "L'assemblatore emette", "Significato"], [
      ["li t0, 42", "addi t0, zero, 42", "carica una costante"],
      ["mv t0, t1", "addi t0, t1, 0", "copia un registro"],
      ["not t0, t1", "xori t0, t1, -1", "complemento bit a bit"],
      ["la t0, counter", "auipc t0, ... + addi t0, t0, ...", "carica l'indirizzo di un'etichetta"],
      ["ret", "jalr zero, 0(ra)", "salta all'indirizzo in ra"],
      ["beqz t0, skip", "beq t0, zero, skip", "salta se t0 vale zero"],
    ], "Una pseudo-istruzione non è un'operazione hardware a sé. È il registro zero a renderne possibili molte: un insieme di istruzioni piccolo, riusato con cura.", { widths: [3, 5, 4], mono: [0, 1] }),
    D("Un'istruzione è un numero a 32 bit", (s, h) => {
      h.tx(s, "addi t1, t1, 1", { x: h.MX, y: h.TOP, w: h.CW, h: 0.6, fontSize: 28, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.bits(s, h.MX + 0.4, h.TOP + 1.25, h.CW - 0.8, [
        { n: 12, label: "immediato\nla costante 1", value: "000000000001", color: P.amber },
        { n: 5, label: "rs1\nt1 è x6", value: "00110", color: P.teal },
        { n: 3, label: "funct3\nadd", value: "000", color: P.violet },
        { n: 5, label: "rd\nt1 è x6", value: "00110", color: P.green },
        { n: 7, label: "opcode\nregistro-immediato", value: "0010011", color: P.steel },
      ], { h: 0.8, minW: 1.3, fs: 17 });
      h.tx(s, "0x00130313", { x: h.MX, y: h.TOP + 3.05, w: h.CW, h: 0.7, fontSize: 34, bold: true, fontFace: h.MONO, color: P.ink, align: "center", valign: "middle" });
      h.card(s, h.MX, 5.55, h.CW, 1.2, P.tealSoft);
      h.tx(s, "L'assembly è una scrittura leggibile del codice macchina. L'assemblatore traduce ogni riga in una parola di 32 bit; il processore legge i campi con circuiti logici che più avanti nel corso progetteremo noi stessi.", { x: h.MX + 0.3, y: 5.6, w: h.CW - 0.6, h: 1.1, fontSize: 17, valign: "middle" });
    }, "Verifica: 0000 0000 0001 | 00110 | 000 | 00110 | 0010011 = 0000 0000 0001 0011 0000 0011 0001 0011 = 0x00130313. Non spiegare ora i formati; il punto è solo che un'istruzione è un dato. La Lezione 04 (informazione digitale) e le lezioni sul processore tornano su questa slide."),
    T("PRG32-QT: un microscopio per i registri", [
      "Esegue la stessa cartuccia sul vostro computer, un'istruzione alla volta",
      "Si ferma tra due istruzioni qualsiasi e mostra tutti i registri",
      "Eseguite first_update passo-passo e guardate cambiare t0 e t1",
      "Usate la scheda quando volete la verità sul tempo, PRG32-QT quando volete la verità su un registro",
    ], "Dimostrare dal vivo: caricare il passo 3, fermarsi su first_update, eseguire quattro passi. Chiedere agli studenti di prevedere ogni registro prima di premere il tasto.", { img: "prg32qt_debugger.png", cap: "Il debugger di PRG32-QT: codice, registri, memoria", wide: true }),
    G("Tracciare a mano: tre frame di first_update", ["Frame", "lw: t1 diventa", "addi: t1 diventa", "sw: counter diventa", "Larghezza barra (andi 255)"], [
      ["1", "0", "1", "1", "1"],
      ["2", "1", "2", "2", "2"],
      ["256", "255", "256", "256", "0"],
      ["257", "256", "257", "257", "1"],
    ], "La traccia a mano è l'abilità di debug più preziosa del corso. 256 = 1 0000 0000 in binario: gli otto bit bassi sono tutti zero, quindi la barra ricomincia.", { widths: [1.4, 2.6, 2.8, 3, 3], hi: { 2: P.amberSoft }, caption: "Al frame 256 il contatore continua a crescere, ma i suoi otto bit bassi tornano a zero: la barra ricomincia." }),

    H("Che cosa viene dopo", "Ogni domanda sollevata qui ha una lezione che le risponde."),
    G("Domande che il vostro programma ha già sollevato", ["Avete visto", "La domanda", "Risposta in"], [
      ["0x07e0, 0xffff, 255", "Perché i programmatori scrivono i numeri in esadecimale?", "Lezioni 04 e 05"],
      ["una posizione sotto zero mostrata come 0xFFFFFFFF", "Come fa un registro a contenere un numero negativo?", "Lezione 05"],
      ["una palla che si muove meno di un pixel per frame", "Come si rappresentano le frazioni senza FPU?", "Lezione 06"],
      ["andi a2, t1, 255", "Che cosa fa AND a trentadue bit in un colpo solo?", "Lezioni 08 e 09"],
      ["addi t1, t1, 1", "Quale circuito somma davvero due numeri?", "Lezione 09: gli addizionatori"],
      ["un pulsante premuto è un 1", "Di che cosa è fatto, fisicamente, un bit?", "Lezione 10"],
      ["counter sopravvive tra i frame", "Come fa un circuito a ricordare un bit?", "Lezioni 13 e 15"],
      ["0x00130313", "Come fa il processore a decodificarla ed eseguirla?", "Lezioni 18 e 19"],
      ["tre funzioni e un rettangolo", "Posso farci un gioco intero?", "Verm1: 07, 12, 17, 22"],
    ], "È la mappa in avanti del corso. Conservarne una copia: ogni presentazione successiva si apre indicando una di queste righe. L'ultima riga è il progetto: Verm1 parte nella Lezione 07 esattamente dallo scheletro di oggi.", { widths: [4.2, 5.2, 3], mono: [0] }),
    Q("Dopo la t0, counter e lw t1, 0(t0), che cosa contiene t0?", ["Il valore del contatore", "L'indirizzo del contatore", "Zero, perché la azzera il registro", "L'indirizzo di ritorno"], 1, "la carica l'indirizzo dell'etichetta; lw legge poi in t1 il valore memorizzato a quell'indirizzo."),
    Q("Una funzione che chiama prg32_gfx_clear deve salvare un registro prima della chiamata. Quale?", ["a0, perché porta l'argomento", "sp, perché lo stack si sposta", "ra, perché call lo sovrascrive", "t0, perché è temporaneo"], 2, "call scrive in ra l'indirizzo di ritorno. Le chiamate della funzione chiamata lo sovrascriverebbero: una funzione non foglia salva ra sullo stack e lo ripristina prima di ret."),
    Q("t1 contiene 300. Che cosa lascia in a2 l'istruzione andi a2, t1, 255?", ["300", "255", "45", "44"], 3, "300 = 256 + 44 = 1 0010 1100 in binario. AND con 1111 1111 conserva gli otto bit bassi: 0010 1100 = 44."),
    X("Esercizi su PRG32", [
      "Cambiate la stringa del titolo e il suo colore in giallo (0xffe0); eseguite di nuovo",
      "Fate crescere la barra a velocità doppia, poi quadrupla, cambiando una sola istruzione",
      "Fate accorciare la barra invece di farla crescere. Che cosa accade quando il contatore supera lo zero?",
      "In PRG32-QT eseguite first_update passo-passo e annotate t0 e t1 dopo ogni istruzione",
      "Disegnate una seconda barra, rossa, larga quanto il contatore modulo 64",
    ], "Nell'esercizio 3 il contatore va a 0, poi a 0xFFFFFFFF: con andi 255 la barra salta a 255 e si accorcia. Conservate l'osservazione: la spiega la Lezione 05.",
      "Suggerimenti: addi t1, t1, 2 oppure slli prima di andi per l'esercizio 2; addi t1, t1, -1 per l'esercizio 3; andi a2, t1, 63 per l'esercizio 5. Ogni esercizio è il seme di una lezione successiva."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["register", "registro", "stack", "pila (stack)"],
      ["load / store", "caricare / memorizzare", "stack pointer", "puntatore alla pila"],
      ["address", "indirizzo", "return address", "indirizzo di ritorno"],
      ["immediate", "immediato (costante)", "calling convention", "convenzione di chiamata"],
      ["branch", "salto condizionato", "machine code", "codice macchina"],
      ["label", "etichetta", "cartridge", "cartuccia"],
    ], "Il corso si tiene in italiano; slide, note e libro esistono in inglese e in italiano, e la documentazione tecnica di PRG32 è in inglese. Questa tabella si ripete, argomento per argomento, in ogni presentazione.", { widths: [3, 3.2, 3, 3.2] }),
    T("Riepilogo e letture", [
      "Un processore RISC-V è fatto di trentadue registri e di un piccolo insieme di istruzioni che calcolano, spostano e saltano",
      "Un gioco PRG32 sono tre funzioni; gli argomenti viaggiano in a0-a7; una funzione che ne chiama un'altra salva ra",
      "Le variabili vivono in memoria: la per l'indirizzo, lw e sw per il valore",
      "Un'istruzione è un numero a 32 bit; l'assembly è la sua scrittura leggibile",
      ["Letture", ["Playing with RISC-V, capitolo 5: First Contact", "Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, capitolo 2", "Repository di PRG32: docs/learn/tutorial_ascii_game.md"]],
    ], "Prossima lezione: la storia che ha portato a questa macchina."),
  ],
});
