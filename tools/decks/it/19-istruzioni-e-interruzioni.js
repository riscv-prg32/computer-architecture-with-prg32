// Italian version of decks/en/19-instructions-and-interrupts.js: same slides, same listings, text in Italian.
// Lecture 19 - Instructions and interrupts.
// Source: 19-Architettura_dei_Calcolatori-Istruzioni_e_Interruzioni.pptx (translated and reorganised; the RISC-V formats,
// processor cycle and trap mechanism replace the MC68000 examples).
const box15 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "19", file: "19-Architettura_dei_Calcolatori-Istruzioni_e_Interruzioni",
  title: "Istruzioni e interruzioni", short: "Istruzioni e interruzioni",
  sub: "I formati delle istruzioni, il ciclo del processore, e come RISC-V gestisce gli eventi eccezionali",
  quote: ["Perché la CPU non riesce mai a combinare niente? Perché viene interrotta di continuo.", "Battuta anonima sull'architettura dei calcolatori"],
  cover: "game_asteroids.png",
  notes: "La presentazione originale usava una macchina a parole di 16 bit per la fase di fetch e il Motorola MC68000 per interruzioni vettorizzate e priorità. Entrambi sono sostituiti da RISC-V: i sei formati di istruzione, i cinque stadi classici, e il meccanismo delle trap in modo macchina (mtvec, mepc, mcause, mstatus, mret). Una slide di confronto conserva il 68000 come controparte storica.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Descrivere un'istruzione come codice operativo e operandi, e nominare i tipi di operando",
      "Decodificare a mano un'istruzione RISC-V, riconoscendone formato e campi",
      "Seguire un'istruzione nel ciclo del processore: prelievo, decodifica, esecuzione, memoria, scrittura",
      "Spiegare che cos'è una pipeline e perché rende più veloce un processore",
      "Definire interruzioni, eccezioni e trap, ed elencarne le cause",
      "Descrivere che cosa fa RISC-V quando avviene una trap e come riprende il programma interrotto",
    ]),

    H("Riscaldamento sulla macchina", "Che cosa legge davvero il processore."),
    K("Quattro parole in memoria", `indirizzo   codice macchina  che cosa avete scritto

0x000       0x0002A303       lw   t1, 0(t0)
0x004       0x00130313       addi t1, t1, 1
0x008       0x0062A023       sw   t1, 0(t0)
0x00C       0x00008067       ret`, [
      "È first_update della Lezione 02 così come sta in memoria: quattro numeri, a quattro indirizzi di distanza",
      "Come fa il processore a sapere che il primo è un caricamento e il secondo una somma?",
      "Quali passi compie per ciascuno?",
      "E mentre li esegue, come si accorge che è stato premuto un pulsante o che è scaduto un timer?",
    ], "La la che precede queste istruzioni è omessa, e le codifiche sono quelle non compresse a 32 bit: con l'estensione C l'assemblatore può scegliere per alcune le forme a 16 bit. Gli indirizzi sono relativi all'inizio della funzione.", "txt"),

    H("Istruzioni", "Un codice operativo e i suoi operandi."),
    T("Di che cosa è fatta un'istruzione", [
      ["Istruzioni tipiche di un processore", ["trasferimenti di dati tra memoria e registri", "operazioni aritmetiche e logiche", "istruzioni per il controllo del flusso", "trasferimenti di dati da e verso l'ingresso/uscita"]],
      "Un'istruzione è composta da un codice operativo, l'opcode, e da zero o più operandi",
      ["Tipi di operando", ["una costante: un immediato, esplicito o implicito", "una locazione di memoria", "un registro, esplicito o implicito (l'accumulatore)"]],
      "Le istruzioni possono avere zero, uno, due o tre operandi",
    ], "In RISC-V la quarta famiglia non esiste come tale: i dispositivi sono memoria (Lezione 15). add ha tre operandi, tutti registri; ret non ne ha di visibili."),
    D("I formati delle istruzioni RISC-V", (s, h) => {
      const fm = [
        ["R: da registro a registro (add, sub, and, sll, ...)", [[7, "funct7"], [5, "rs2"], [5, "rs1"], [3, "funct3"], [5, "rd"], [7, "opcode"]]],
        ["I: immediati e load (addi, andi, lw, jalr, ...)", [[12, "immediato [11:0]"], [5, "rs1"], [3, "funct3"], [5, "rd"], [7, "opcode"]]],
        ["S: store (sw, sh, sb); B: salti condizionati, con la stessa forma", [[7, "imm [11:5]"], [5, "rs2"], [5, "rs1"], [3, "funct3"], [5, "imm [4:0]"], [7, "opcode"]]],
        ["U: immediati alti (lui, auipc); J: salti (jal), con la stessa forma", [[20, "immediato [31:12]"], [5, "rd"], [7, "opcode"]]],
      ], col = { opcode: P.steel, rd: P.green, rs1: P.teal, rs2: P.teal, funct3: P.violet, funct7: P.violet };
      fm.forEach(([name, fields], i) => {
        const y = h.TOP + 0.05 + i * 1.13;
        h.tx(s, name, { x: h.MX, y: y + (i ? 0.08 : -0.12), w: h.CW, h: 0.3, fontSize: 14, bold: true, color: P.steel });
        h.bits(s, h.MX, y + (i ? 0.45 : 0.5), h.CW, fields.map(([n, v]) => ({ n, value: v, color: col[v] || P.amber })), { h: 0.42, fs: 14, minW: 1.2, index: i === 0 });
      });
      h.tx(s, "Sei formati, tutti di 32 bit. L'opcode sta sempre negli stessi sette bit, e i numeri di registro rd, rs1 e rs2 stanno sempre negli stessi posti: il processore può leggerli prima ancora di sapere di quale istruzione si tratta.", { x: h.MX, y: 6.1, w: h.CW, h: 0.65, fontSize: 14, valign: "middle" });
    }, "Bit da 31 a 0, da sinistra a destra (indici mostrati sulla prima riga). B e J differiscono da S e U solo per come sono disposti i bit dell'immediato. Questa regolarità è il cuore dell'idea RISC; i formati generici a 0, 1, 2 e 3 operandi della presentazione originale ne sono gli antenati."),
    D("Decodifica a mano", (s, h) => {
      h.tx(s, "0x006283B3", { x: h.MX, y: h.TOP - 0.1, w: 3.2, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "add t2, t0, t1", { x: 9.0, y: h.TOP - 0.1, w: h.W - h.MX - 9.0, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.green, align: "right", valign: "middle" });
      h.bits(s, h.MX, h.TOP + 0.85, h.CW, [{ n: 7, value: "0000000", label: "funct7\nadd, non sub", color: P.violet }, { n: 5, value: "00110", label: "rs2\nx6 = t1", color: P.teal }, { n: 5, value: "00101", label: "rs1\nx5 = t0", color: P.teal },
        { n: 3, value: "000", label: "funct3\nadd", color: P.violet }, { n: 5, value: "00111", label: "rd\nx7 = t2", color: P.green }, { n: 7, value: "0110011", label: "opcode\nregistro-registro", color: P.steel }], { h: 0.6, fs: 16, minW: 1.3, labelFs: 13 });
      h.tx(s, "0x0002A303", { x: h.MX, y: h.TOP + 2.6, w: 3.2, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.steel, valign: "middle" });
      h.tx(s, "lw t1, 0(t0)", { x: 9.0, y: h.TOP + 2.6, w: h.W - h.MX - 9.0, h: 0.5, fontSize: 22, bold: true, fontFace: h.MONO, color: P.green, align: "right", valign: "middle" });
      h.bits(s, h.MX, h.TOP + 3.55, h.CW, [{ n: 12, value: "000000000000", label: "immediato\nscostamento 0", color: P.amber }, { n: 5, value: "00101", label: "rs1\nx5 = t0", color: P.teal },
        { n: 3, value: "010", label: "funct3\nuna parola", color: P.violet }, { n: 5, value: "00110", label: "rd\nx6 = t1", color: P.green }, { n: 7, value: "0000011", label: "opcode\nload", color: P.steel }], { h: 0.6, fs: 16, minW: 1.3, labelFs: 13 });
    }, "Metodo: scrivere in binario le otto cifre esadecimali, staccare gli ultimi sette bit (l'opcode), cercare il formato, poi tagliare i campi. I decodificatori della Lezione 11 fanno la stessa cosa in una frazione di nanosecondo."),
    V("Istruzioni di lunghezza fissa o variabile",
      ["Lunghezza fissa: macchine a parola", ["Tutte le istruzioni hanno la stessa lunghezza in bit", "L'istruzione successiva è sempre a PC più una costante", "Prelievo e decodifica semplici", "Processori RISC: RISC-V usa 32 bit", "Con l'estensione compressa, 16 o 32, distinti dai due bit più bassi"]],
      ["Lunghezza variabile: macchine a byte", ["Le istruzioni possono avere lunghezze diverse", "La lunghezza si conosce solo dopo aver decodificato la prima parte", "Programmi compatti, decodifica complessa", "Processori CISC: l'MC68000 usa da una a cinque parole di 16 bit, Intel x86 da uno a quindici byte"]],
      "Lunghezza fissa (calcolatore a voci) e variabile (calcolatore a byte). La lunghezza dell'istruzione decide di quanto avanza il PC."),
    G("Modi di indirizzamento: dove si trova un operando", ["Modo", "L'operando è", "Esempio RISC-V"], [
      ["immediato", "una costante dentro l'istruzione", "addi t1, t1, 1"],
      ["registro", "il contenuto di un registro", "add t2, t0, t1"],
      ["base più scostamento", "la parola di memoria a registro + costante", "lw t1, 8(sp)"],
      ["relativo al PC", "un indirizzo a una certa distanza dall'istruzione stessa", "beq t0, t1, loop"],
      ["indiretto in memoria", "la parola di memoria il cui indirizzo è in memoria", "non disponibile: due load"],
    ], "RISC-V ha solo i primi quattro. Un processore CISC come l'MC68000 ne ha una dozzina, compresi i modi indiretti in memoria e con autoincremento. L'esempio della presentazione originale, R3 := M[M[A]], in RISC-V diventa: lw t0, 0(t1) seguita da lw t0, 0(t0). La fase di «operand assembly» di un processore CISC è il prezzo dei modi di indirizzamento ricchi.", { widths: [2.8, 5.4, 4], mono: [2] }),

    H("Il ciclo del processore", "L'algoritmo fondamentale del processore."),
    F("Le fasi del ciclo", [
      "Prelievo|l'istruzione all'indirizzo contenuto nel PC viene letta dalla memoria; il PC avanza",
      "Decodifica|l'opcode viene riconosciuto; i registri nominati dall'istruzione vengono letti",
      "Esecuzione|la ALU calcola: un risultato, un indirizzo o un confronto",
      "Memoria|i load leggono la memoria, gli store la scrivono; le altre saltano questa fase",
      "Scrittura|il risultato viene scritto nel registro di destinazione",
    ], "Dopo una fase di avvio, il bootstrap, il processore ripete questo ciclo all'infinito. Nei processori con modi di indirizzamento ricchi, una fase di operand assembly raccoglie gli operandi prima dell'esecuzione.",
      "Algoritmo fondamentale del processore: inizializzazione, instruction fetch and decoding, operand assembly, execute. La versione a cinque fasi è la formulazione RISC classica. In inglese: fetch, decode, execute, memory, write back."),
    G("La fase di prelievo, trasferimento per trasferimento", ["Passo", "Trasferimento tra registri", "Significato"], [
      ["1", "MA := PC", "l'indirizzo dell'istruzione va nel registro degli indirizzi di memoria"],
      ["2", "abilita lettura; MB := M[MA]", "la memoria mette l'istruzione sul bus dati; viene catturata nel buffer"],
      ["3", "D := MB", "l'istruzione viene copiata nel registro di decodifica"],
      ["4", "PC := PC + 4", "il PC ora punta all'istruzione successiva"],
    ], "Fase fetch. PC, D, MA e MB sono i registri del modello di riferimento della Lezione 18; i trasferimenti viaggiano sul bus interno. Nella presentazione originale la macchina aveva parole di 16 bit e il PC avanzava di 2; in RV32 una parola è di quattro byte, quindi il PC avanza di 4 (di 2 dopo un'istruzione compressa).", { widths: [0.9, 3.6, 7.7], mono: [1], fs: 19 }),
    G("Il resto del ciclo per due istruzioni", ["Fase", "add t2, t0, t1", "lw t1, 0(t0)"], [
      ["decodifica", "O1 := R[t0];  O2 := R[t1]", "O1 := R[t0];  O2 := 0  (l'immediato)"],
      ["esecuzione", "U := O1 + O2", "U := O1 + O2  (un indirizzo)"],
      ["memoria", "-", "MA := U;  abilita lettura;  MB := M[MA]"],
      ["scrittura", "R[t2] := U", "R[t1] := MB"],
    ], "O1, O2 e U sono i registri della ALU. Lo stesso sommatore calcola una somma per add e un indirizzo per lw: cambiano solo i segnali di controllo. Uno store finisce alla fase di memoria; un salto condizionato finisce all'esecuzione, scegliendo il prossimo PC.", { widths: [1.8, 4.8, 5.6], mono: [1, 2], fs: 18, caption: "La stessa ALU somma due registri per add e forma un indirizzo per lw. L'unità di controllo, decodificando l'opcode, decide quali trasferimenti avvengono." }),
    D("La pipeline", (s, h) => {
      const st = ["IF", "ID", "EX", "MEM", "WB"], cc = [P.tealSoft, P.amberSoft, P.violetSoft, P.greenSoft, P.redSoft], hi = {}, body = [];
      for (let i = 0; i < 4; i++) { const r = [`istruzione ${i + 1}`]; for (let c = 0; c < 8; c++) { const k = c - i; r.push(k >= 0 && k < 5 ? st[k] : ""); if (k >= 0 && k < 5) hi[`${i},${c + 1}`] = cc[k]; } body.push(r); }
      h.table(s, h.MX, h.TOP, [2.3, ...Array(8).fill((h.CW - 2.3) / 8)], ["ciclo di clock", "1", "2", "3", "4", "5", "6", "7", "8"], body, { fs: 15, mono: [1, 2, 3, 4, 5, 6, 7, 8], align: "center", rowH: 0.42, cellHi: hi });
      h.rows(s, [
        "Cinque fasi, cinque pezzi di hardware: mentre un'istruzione viene eseguita, la successiva viene decodificata e una terza prelevata",
        "Ogni istruzione impiega ancora cinque cicli, ma a ogni ciclo di clock ne termina una: cinque volte la produttività",
        "I processori superscalari affiancano due o più pipeline: più di un'istruzione per ciclo",
        "Il core principale dell'ESP32-C6 ha una pipeline a quattro stadi",
      ], h.MX, 3.9, h.CW, 2.85);
    }, "Slide di origine: «Esempio di pipeline lineare a 5 stadi; superscalarità». IF instruction fetch (prelievo), ID decode (decodifica), EX execute (esecuzione), MEM memory (memoria), WB write back (scrittura). I salti e le dipendenze tra istruzioni vicine complicano il quadro (hazard): è l'argomento di un corso avanzato."),

    H("Interruzioni", "Quando il ciclo va spezzato."),
    T("Il problema del ciclo semplice", [
      "Se il processore facesse sempre e solo prelievo, decodifica, esecuzione, nascerebbero alcuni problemi",
      "L'interazione con il mondo esterno attraverso le unità di I/O sarebbe inefficiente: il programma dovrebbe chiedere di continuo",
      "Non ci sarebbe modo di rimuovere d'autorità un'applicazione entrata per errore in un ciclo infinito",
      "Il sistema operativo avrebbe un controllo limitato sul sistema",
    ], "Slide di origine: «Ciclo del processore semplificato»: bootstrap, fetch, operand assembly, execute.", { big: "j loop", label: "un programma bloccato in un ciclo senza fine: chi gli toglie il processore?" }),
    DEF("Interruzioni", "Definizione", "Eventi eccezionali, di solito asincroni rispetto all'esecuzione del programma in corso, che richiedono l'attenzione del processore.", [
      "Vocabolario RISC-V: un'interruzione (interrupt) viene dall'esterno del programma, in un momento qualunque: un timer, un dispositivo",
      "Un'eccezione è causata dall'istruzione in esecuzione: un opcode illegale, un indirizzo vietato",
      "Una trap è il trasferimento del controllo a un gestore che segue l'una o l'altra",
    ], "Interrupt o interruzioni. I processori più vecchi e la presentazione originale chiamano «trap» gli eventi sincroni e usano «interrupt» per tutto; la specifica RISC-V usa le tre parole con precisione."),
    D("Il ciclo reale del processore", (s, h) => {
      const y = h.TOP + 0.5, bw = 2.0, xs = [h.MX + 0.2, 3.4, 6.0];
      box15(s, h, "bootstrap", xs[0], y, bw, 0.8, P.steel, 15); box15(s, h, "prelievo", xs[1], y, bw, 0.8, P.teal, 15); box15(s, h, "decodifica ed\nesecuzione", xs[2], y, bw, 0.8, P.amber, 15);
      h.arrow(s, xs[0] + bw + 0.03, y + 0.4, xs[1] - 0.03, y + 0.4, P.mute, 2.5); h.arrow(s, xs[1] + bw + 0.03, y + 0.4, xs[2] - 0.03, y + 0.4, P.mute, 2.5);
      box15(s, h, "interruzione\nin attesa?", xs[2], y + 1.8, bw, 0.9, P.red, 15); h.arrow(s, xs[2] + bw / 2, y + 0.83, xs[2] + bw / 2, y + 1.77, P.mute, 2.5);
      h.line(s, xs[2] - 0.03, y + 2.25, xs[1] + bw / 2, y + 2.25, P.mute, 2.5); h.arrow(s, xs[1] + bw / 2, y + 2.25, xs[1] + bw / 2, y + 0.83, P.mute, 2.5); h.tx(s, "no", { x: xs[1] + bw / 2 + 0.5, y: y + 1.9, w: 0.6, h: 0.3, fontSize: 14, bold: true, color: P.mute });
      box15(s, h, "trap: vai\nal gestore", xs[2], y + 3.6, bw, 0.9, P.violet, 15); h.arrow(s, xs[2] + bw / 2, y + 2.73, xs[2] + bw / 2, y + 3.57, P.red, 2.5); h.tx(s, "sì", { x: xs[2] + bw / 2 + 0.1, y: y + 2.95, w: 0.7, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.line(s, xs[2] - 0.03, y + 4.05, xs[0] + bw / 2 + 1.2, y + 4.05, P.mute, 2.5); h.line(s, xs[0] + bw / 2 + 1.2, y + 4.05, xs[0] + bw / 2 + 1.2, y + 1.3, P.mute, 2.5); h.line(s, xs[0] + bw / 2 + 1.2, y + 1.3, xs[1] + 0.5, y + 1.3, P.mute, 2.5); h.arrow(s, xs[1] + 0.5, y + 1.3, xs[1] + 0.5, y + 0.83, P.mute, 2.5);
      h.rows(s, [
        "Alla fine di ogni istruzione il processore controlla se è arrivato qualche segnale di interruzione",
        "Se non ce ne sono, l'elaborazione torna alla fase di prelievo",
        "Se ce n'è uno, il processore passa allo stato supervisore e comincia a eseguire una routine del sistema",
        "Quando la routine termina, il programma sospeso può riprendere come se nulla fosse accaduto",
      ], 8.6, h.TOP, h.W - h.MX - 8.6, h.BOT - h.TOP);
    }, "Ciclo del processore reale. In RISC-V lo «stato supervisore» è il modo macchina, e la prima istruzione prelevata dopo la trap è quella all'indirizzo contenuto in mtvec."),
    C("Possibili cause di interruzione", [
      ["Interruzione periodica", "Un timer, per esempio ogni 10 ms: per ripartire il processore tra i programmi e misurare il tempo usato da ciascuno."],
      ["Interruzione di I/O", "Una periferica segnala il proprio stato, per esempio che è pronta a ricevere dati, per sincronizzarsi con il processore."],
      ["Errori nel programma", "Un'istruzione inesistente o privilegiata, un indirizzo vietato: eventi sincroni, detti eccezioni."],
      ["Guasti", "Malfunzionamenti del sistema rilevati da sonde apposite: alimentazione, temperatura, errori di memoria."],
      ["Reset", "Riporta l'intero sistema a uno stato noto."],
      ["Interruzione software", "Generata da un programma che ha bisogno di una risorsa condivisa e chiede al sistema operativo di fare da tramite: in RISC-V, l'istruzione ecall."],
    ], "La presentazione originale elenca l'overflow aritmetico tra gli errori di programma: in RISC-V l'overflow intero non solleva eccezioni (Lezione 05). ecall, environment call, è sincrona rispetto al programma che la esegue."),
    O("Gestire un'interruzione", [
      "Salvare il contesto, parte hardware: almeno l'indirizzo da cui riprendere",
      "Identificare la causa dell'interruzione",
      "Saltare al punto d'ingresso della routine di servizio dell'interruzione (ISR)",
      "Salvare il contesto, parte software: i registri che la routine sta per usare",
      "Servire l'interruzione",
      "Se l'interruzione lo consente: ripristinare il contesto, e riprendere il programma sospeso dall'istruzione che segue l'ultima eseguita",
    ], "Gestione delle interruzioni. Lo stato da salvare e ripristinare: PC, stato, e i registri. Il salvataggio si può fare in parte o del tutto in hardware o in software; RISC-V fa il minimo in hardware. Con più dispositivi il processore deve identificare chi ha interrotto e, per richieste simultanee, applicare una priorità."),
    V("Chi ha interrotto? Due soluzioni",
      ["Registri di stato e interrogazione ciclica", ["Ogni dispositivo ha un registro di stato", "Un dispositivo che chiede un'interruzione vi imposta un bit e alza la linea di richiesta comune", "La routine di servizio interroga i dispositivi in ordine di priorità e serve il primo che trova con il bit alto", "Semplice da costruire, ma richiede tempo: interroga anche dispositivi che non hanno chiesto nulla"]],
      ["Interruzioni vettorizzate", ["Al momento della richiesta l'identità della sorgente viene fornita al processore", "Il processore salta direttamente alla routine che corrisponde a quell'identità", "Un meccanismo molto efficiente", "Il numero di bit usati per il vettore limita il numero di sorgenti diverse riconoscibili"]],
      "Interrogazione ciclica (polling) e interrupt vettorizzati. Latenza di interruzione: il ritardo tra l'istante in cui la linea di richiesta va alta e l'istante in cui la routine di servizio comincia a fare lavoro utile; comprende la fine dell'istruzione in corso, il controllo, la commutazione."),

    H("La soluzione di RISC-V", "Quattro registri e un'istruzione."),
    G("I registri del meccanismo delle trap", ["CSR", "Scritto da", "Contenuto"], [
      ["mtvec", "il firmware, una volta, all'avvio", "l'indirizzo del gestore delle trap, e se si usa il modo vettorizzato"],
      ["mstatus", "hardware e firmware", "MIE, l'abilitazione globale delle interruzioni, e MPIE, il suo valore precedente"],
      ["mie", "il firmware", "un bit di abilitazione per ogni sorgente: software, timer, esterna"],
      ["mip", "l'hardware", "un bit di richiesta in attesa per ogni sorgente"],
      ["mepc", "l'hardware, a ogni trap", "l'indirizzo dell'istruzione interrotta"],
      ["mcause", "l'hardware, a ogni trap", "un bit che dice interruzione o eccezione, e un codice per la causa"],
    ], "Registri di controllo e stato del modo macchina (Lezione 18). Un'interruzione viene accolta solo se il suo bit è a 1 sia in mip sia in mie e MIE vale 1.", { widths: [1.6, 4, 6.6], mono: [0] }),
    O("Che cosa fa l'hardware a una trap", [
      "mepc := l'indirizzo dell'istruzione interrotta",
      "mcause := la causa: bit più alto 1 per un'interruzione, 0 per un'eccezione, più un codice",
      "mstatus: MPIE := MIE, poi MIE := 0, così le altre interruzioni sono disabilitate",
      "il processore passa al modo macchina",
      "PC := l'indirizzo in mtvec, oppure, in modo vettorizzato e per le interruzioni, quell'indirizzo più 4 volte la causa",
      "mret, alla fine del gestore, annulla tutto: MIE := MPIE e PC := mepc",
    ], "L'hardware non mette nulla su uno stack: il salvataggio dei registri generici è lasciato al gestore. È il «salvataggio hardware del contesto» dello schema generale, ridotto a due registri e un bit."),
    G("La causa di una trap: mcause", ["Tipo", "Codice", "Causa"], [
      ["interruzione", "3", "interruzione software di macchina"],
      ["interruzione", "7", "interruzione del timer di macchina"],
      ["interruzione", "11", "interruzione esterna di macchina: un dispositivo, tramite il controllore delle interruzioni"],
      ["eccezione", "2", "istruzione illegale"],
      ["eccezione", "3", "breakpoint (ebreak): così un debugger ferma un programma"],
      ["eccezione", "5, 7", "errore di accesso in load o store: un indirizzo vietato"],
      ["eccezione", "8, 11", "environment call (ecall) dal modo utente, dal modo macchina"],
    ], "I codici standard della specifica privilegiata; i chip ne aggiungono di propri. Lo stesso codice 3 significa cose diverse per interruzioni ed eccezioni: le distingue il bit più alto di mcause. Con mtvec in modo vettorizzato, un'interruzione del timer entra a base + 4 x 7.", { widths: [2, 1.6, 8.6], hi: { 0: P.tealSoft, 1: P.tealSoft, 2: P.tealSoft } }),
    K("Un gestore di trap, per sommi capi", `trap_entry:
    addi sp, sp, -16
    sw   t0, 0(sp)            # software context: save what we use
    sw   t1, 4(sp)

    csrr t0, mcause           # why are we here?
    bgez t0, exception        # top bit 0: an exception
    ...                       # top bit 1: find the device, serve it

    lw   t0, 0(sp)            # restore the context
    lw   t1, 4(sp)
    addi sp, sp, 16
    mret                      # MIE := MPIE, PC := mepc`, [
      "Il programma interrotto non deve accorgersene: ogni registro toccato dal gestore viene salvato e ripristinato",
      "mcause letto come numero con segno è negativo per le interruzioni: bgez separa le due famiglie",
      "mret è l'unica via del ritorno: riabilita le interruzioni e ricarica il PC in un solo passo",
      "Il firmware del kit contiene proprio una routine così; la vostra cartuccia viene interrotta molte volte per frame",
    ], "Uno schema, non il sorgente di PRG32: un gestore vero salva tutti i registri caller-saved, di solito su uno stack separato raggiunto tramite mscratch. csrr t0, mcause è la pseudo-istruzione per csrrs t0, mcause, zero."),
    G("Priorità e annidamento", ["", "Motorola MC68000", "RISC-V"], [
      ["priorità di una richiesta", "tre linee codificano un livello di priorità, da 1 a 7", "il controllore delle interruzioni dà una priorità a ogni sorgente"],
      ["priorità del processore", "tre bit nel registro di stato: la maschera", "un registro di soglia nel controllore delle interruzioni"],
      ["una richiesta è accolta se", "il suo livello è più alto della maschera", "la sua priorità supera la soglia, ed è abilitata"],
      ["mentre la si serve", "la maschera viene alzata a quel livello", "le interruzioni sono disabilitate (MIE = 0) se il gestore non le riabilita"],
      ["non mascherabile", "il livello 7", "un'interruzione non mascherabile, definita da ogni chip"],
      ["identità della sorgente", "un numero di vettore a 8 bit dal dispositivo: 256 vettori", "mcause, poi il controllore dice quale dispositivo"],
      ["ritorno", "RTE, che estrae PC e stato dallo stack", "mret, che usa mepc e mstatus"],
    ], "Per gestire interruzioni annidate si stabilisce un livello di priorità: mentre gira una routine di servizio si accettano solo richieste da dispositivi di priorità più alta; una richiesta da un dispositivo ad alta priorità, come il clock, va accettata anche mentre se ne serve una di priorità più bassa. Questa slide sostituisce le tre slide «Gestione delle priorità nel 68000». La colonna RISC-V descrive il controllore delle interruzioni a livello di piattaforma; sui chip Espressif le priorità vanno da 1 a 15.", { widths: [2.4, 4.6, 5.2], fs: 15 }),
    T("Le interruzioni sul kit PRG32", [
      "Un timer interrompe il processore cento volte al secondo: il firmware lo usa per tenere il tempo e cadenzare i frame",
      "Le periferiche di display e audio interrompono quando un blocco di dati è stato inviato e serve il successivo",
      "La radio Wi-Fi interrompe quando arriva un pacchetto: si può caricare una cartuccia mentre un gioco è in esecuzione",
      "Le vostre init, update e draw sono normali funzioni chiamate dal firmware tra un'interruzione e la successiva",
      "Una cartuccia bloccata in un ciclo non ferma le interruzioni: PRG32-QT chiude il frame con un errore; sulla scheda un watchdog segnala lo stallo, e premete reset",
    ], "I tre problemi del ciclo semplice (I/O inefficiente, programmi fuori controllo, controllo limitato) e la loro soluzione, tutti visibili sul kit. Verificato sui sorgenti e sulla configurazione del firmware (non su una scheda fisica): la cartuccia gira in modo nativo dentro il task principale, nello stesso modo di privilegio del firmware; FreeRTOS ha un tick a 100 Hz; il task watchdog (5 s, sorveglia il task idle) stampa soltanto un avviso sulla porta seriale, perché l'opzione panic è spenta, quindi una cartuccia bloccata trattiene il lock della cartuccia e il kit va resettato. Una cartuccia che disabilitasse le interruzioni farebbe invece scattare l'interrupt watchdog (300 ms), che va in panic e riavvia il chip. Eseguito su PRG32-QT: un ciclo senza fine dà «instruction budget exhausted», una scrittura in mstatus dà «unsupported CSR». In PRG32-QT un breakpoint è l'eccezione con codice 3.", { img: "menu_main.png", cap: "Il menu del firmware PRG32" }),

    Q("In quali bit di un'istruzione RISC-V sta l'opcode?", ["i sette più significativi", "i sette meno significativi", "i bit da 14 a 12", "dipende dal formato"], 1, "I bit da 6 a 0, in ogni formato: il processore sa sempre dove guardare per prima cosa."),
    Q("Durante il prelievo di un'istruzione RV32 non compressa, il PC viene incrementato di:", ["1", "2", "4", "32"], 2, "Gli indirizzi contano i byte e un'istruzione è lunga quattro byte."),
    Q("Quale registro contiene l'indirizzo da cui riprenderà un programma RISC-V interrotto?", ["ra", "mtvec", "mepc", "mcause"], 2, "mepc, scritto dall'hardware alla trap e usato da mret. mtvec contiene l'indirizzo del gestore."),
    Q("Quale di questi è un'eccezione e non un'interruzione, nei termini di RISC-V?", ["scade un timer", "viene premuto un tasto", "viene prelevata un'istruzione illegale", "arriva un pacchetto dalla rete"], 2, "È causata dall'istruzione in esecuzione, in modo sincrono; le altre vengono dall'esterno, in un momento qualunque."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Decodificate a mano 0x00A28293 e 0x40628333: formato, campi, assembly",
      "Codificate sub t0, t1, t2 e sw a0, 8(sp)",
      "Scrivete i trasferimenti tra registri dell'intero ciclo per sw t1, 0(t0) e per beq t0, t1, target",
      "Disegnate il diagramma della pipeline per sei istruzioni su una pipeline a quattro stadi: quando termina la sesta?",
      "In PRG32-QT mettete un breakpoint in first_update, avanzate di un passo, e confrontate il codice macchina mostrato con la vostra decodifica del riscaldamento",
    ], "Su carta: addi t0, t0, 10 e sub t1, t0, t1. Su PRG32-QT: le quattro parole del riscaldamento, o i loro equivalenti compressi.",
      "0x00A28293: imm 10, rs1 x5, funct3 000, rd x5, opcode 0010011. 0x40628333: funct7 0100000, rs2 x6, rs1 x5, funct3 000, rd x6, opcode 0110011. sub t0, t1, t2 = 0x407302B3. sw a0, 8(sp) = 0x00A12423. Sei istruzioni su quattro stadi terminano al ciclo 9."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["operation code (opcode)", "codice operativo", "interrupt", "interruzione"],
      ["operand", "operando", "exception / trap", "eccezione / trap"],
      ["addressing mode", "modo di indirizzamento", "interrupt service routine", "routine di servizio dell'interruzione"],
      ["fetch / decode / execute", "prelievo / decodifica / esecuzione", "interrupt latency", "latenza di interruzione"],
      ["pipeline stage", "stadio della pipeline", "to mask an interrupt", "mascherare un'interruzione"],
      ["context", "contesto", "nesting", "annidamento"],
    ], null, { widths: [3, 3.3, 3, 3.5] }),
    T("Conclusioni e letture", [
      "Un'istruzione è un codice operativo e zero, uno o più operandi; in RISC-V è sempre di 32 bit, in sei formati regolari",
      "La lunghezza delle istruzioni, fissa o variabile, determina il comportamento del PC",
      "Il processore ha un ciclo: preleva un'istruzione, la decodifica, la esegue, e scrive il risultato",
      "Gli eventi eccezionali spezzano il ciclo: il processore salva dov'era, serve l'evento e riprende",
      "Le interruzioni si possono abilitare, mascherare e ordinare per priorità; RISC-V lo fa con una manciata di registri e l'istruzione mret",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 2.5, 4.1-4.6 e 4.10", "The RISC-V Instruction Set Manual, volume II: Privileged Architecture", "Playing with RISC-V, capitolo 4: PRG32-QT e il suo debugger"]],
    ], "Le conclusioni originali affermavano che «l'interrupt è un segnale non mascherabile»: la maggior parte delle interruzioni si può mascherare; solo poche no. Prossima lezione: i bus e la scheda video."),
  ],
});
