// Italian version of decks/en/15-memory.js: same slides, same listings, text in Italian.
// Lecture 15 - Memory.
// Source: 14-Architettura_dei_Calcolatori-Memoria.pptx (translated, figures redrawn; RISC-V replaces the MC68000 as reference).
const box10 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "15", file: "15-Architettura_dei_Calcolatori-Memoria",
  title: "La memoria", short: "Memoria",
  sub: "Dai nuclei magnetici alla RAM: parole, indirizzi, ordine dei byte e il dialogo tra processore e memoria",
  quote: ["...i computer e i programmi cominceranno a pensare e le persone smetteranno.", "Dr. Walter Gibbs, Tron, Steven Lisberger, 1982"],
  cover: "prg32qt_debugger.png",
  notes: "Spirale: lw e lbu sulla stessa parola mostrano indirizzi di byte e ordine dei byte su una vera macchina RISC-V; la lezione spiega poi che cos'è una memoria, come è organizzata e come il processore le parla. La presentazione originale usava come esempio l'MC68000 (big-endian, niente parole disallineate): RISC-V ne prende il posto.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Classificare le memorie: volatili o persistenti, in linea o fuori linea, e collocarle nella gerarchia di memoria",
      "Descrivere come SRAM e DRAM memorizzano un bit, e perché si usano per compiti diversi",
      "Spiegare che cosa sono parole, indirizzi e memoria indirizzabile al byte",
      "Distinguere l'ordine little-endian da quello big-endian, e dire quale usa RISC-V",
      "Descrivere passo per passo come il processore legge e scrive una parola",
      "Spiegare l'ingresso/uscita mappato in memoria e a che cosa serve il DMA",
    ]),

    H("Riscaldamento sulla macchina", "Una parola, quattro indirizzi."),
    K("Leggere la stessa memoria come parola e come byte", `    la   t0, value
    lw   t1, 0(t0)       # the whole word        t1 = 0x12345678
    lbu  t2, 0(t0)       # the byte at address A     t2 = 0x78
    lbu  t3, 1(t0)       # the byte at address A+1   t3 = 0x56
    lbu  t4, 3(t0)       # the byte at address A+3   t4 = 0x12

.section .data
value: .word 0x12345678`, [
      "Una parola di trentadue bit occupa quattro indirizzi consecutivi: la memoria si indirizza byte per byte",
      "Il byte all'indirizzo più basso è 0x78, il meno significativo: ordine little-endian",
      "lw preleva quattro byte con una sola operazione; lbu ne preleva uno",
      "Di che cosa è fatta una memoria, e che cosa accade tra processore e memoria quando si esegue lw?",
    ], "Eseguirlo in PRG32-QT e aprire la vista della memoria all'indirizzo contenuto in t0: i byte compaiono come 78 56 34 12. La slide sull'ordine dei byte della Lezione 04 diventa un esperimento."),

    H("Che cos'è una memoria?"),
    DEF("Memoria", "Definizione", "La memoria è l'elemento di un calcolatore, o di un suo sottosistema, dedicato alla persistenza dei dati e delle istruzioni dei programmi.", [
      "Le memorie sono i componenti di un calcolatore capaci di conservare informazione: dati, programmi e risultati",
      "Volatile: l'informazione si conserva solo finché il calcolatore è alimentato",
      "Persistente: l'informazione si conserva anche a calcolatore spento",
      "In linea: i dati sono sempre accessibili. Fuori linea: il supporto va montato prima di poter raggiungere i dati",
    ]),
    D("La gerarchia di memoria", (s, h) => {
      const lv = [["registri", "dentro il processore", P.red], ["cache", "SRAM, sul chip del processore", P.amber], ["memoria centrale", "DRAM", P.teal], ["dischi a stato solido e magnetici", "persistenti, in linea", P.steel], ["nastri e supporti rimovibili", "persistenti, fuori linea", P.violet]];
      const cx = 3.9, y0 = h.TOP + 0.05, bh = 0.86;
      lv.forEach(([n, d, c], i) => { const w = 2.2 + i * 1.05;
        s.addText([{ text: n, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x: cx - w / 2, y: y0 + i * (bh + 0.12), w, h: bh, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 2 }); });
      h.arrow(s, 7.3, y0 + 4.7, 7.3, y0 + 0.1, P.mute, 2.5); h.tx(s, "più veloce,\npiù costosa\nper bit", { x: 7.45, y: y0 + 0.05, w: 1.6, h: 0.9, fontSize: 12.5, italic: true, color: P.mute });
      h.tx(s, "più grande,\nmeno costosa\nper bit", { x: 7.45, y: y0 + 3.9, w: 1.6, h: 0.9, fontSize: 12.5, italic: true, color: P.mute });
      h.rows(s, [
        "A parità di dimensione, il costo decresce dall'alto verso il basso",
        "Le prestazioni crescono dal basso verso l'alto",
        "I livelli alti sono volatili; quelli bassi sono persistenti",
        "Nessuna tecnologia è insieme veloce, grande ed economica: un calcolatore ne combina diverse",
      ], 9.2, h.TOP, h.W - h.MX - 9.2, h.BOT - h.TOP);
    }, "Tipologie di memoria. Tempi di accesso tipici: registri e cache da meno di un nanosecondo a pochi nanosecondi; DRAM decine di nanosecondi; SSD decine di microsecondi; dischi magnetici millisecondi; nastro da secondi a minuti."),

    H("Un po' di storia", "Anelli di ferrite."),
    T("La memoria a nuclei magnetici", [
      "Piccoli anelli magnetici di ceramica conservano l'informazione digitale: un bit è il verso del campo magnetico di un anello",
      "Una memoria statica: conserva il contenuto senza alimentazione",
      "Usata nei primi calcolatori, prima che si diffondessero le memorie a semiconduttore",
      "Prime ricerche di An Wang e Way-Dong Woo a Harvard, 1949",
      "Jay Forrester al MIT, primi anni Cinquanta: il calcolatore Whirlwind, un simulatore di volo",
    ], "In inglese: magnetic-core memory. Il pulse transfer controlling device di Wang usava un campo magnetico per controllare un sistema elettromeccanico.", { img: "core_memory.jpg", cap: "Nuclei di ferrite attraversati dai fili X, Y e di lettura" }),
    V("Leggere e scrivere un nucleo",
      ["La lettura è distruttiva", ["Due linee di indirizzo, X e Y, selezionano un nucleo", "Il bit selezionato viene posto a 0", "Se conteneva 1, sulla linea di lettura compare un impulso; altrimenti nulla", "La soluzione di Wang: ogni lettura è seguita da una scrittura che memorizza di nuovo il dato"]],
      ["La scrittura", ["Tutti i bit partono da 0", "X e Y selezionano il nucleo, che viene posto a 1", "Se il bit deve valere 0, la linea di inibizione impedisce il cambiamento", "Il contributo di Forrester: meno collegamenti per gestire un gran numero di nuclei"]],
      "Lettura e inibizione condividono un filo (S|I). La lettura distruttiva seguita da riscrittura ritorna oggi nella DRAM."),

    H("La memoria oggi"),
    V("SRAM e DRAM",
      ["SRAM: RAM statica", ["Ogni bit è tenuto da un circuito bistabile, come in un flip-flop D", "Le celle sono disposte in una matrice e raggiunte per riga e colonna", "Conserva il contenuto finché è alimentata", "Veloce e costosa: usata per le memorie cache", "La memoria centrale di un microcontrollore come l'ESP32-C6 è SRAM"]],
      ["DRAM: RAM dinamica", ["Ogni bit è una carica in un minuscolo condensatore, dietro un transistor", "Il condensatore si scarica: il contenuto va rinfrescato periodicamente, da un circuito interno alla memoria", "Economica e densa: usata per la memoria centrale di portatili, telefoni e server", "SDRAM: DRAM sincrona, il cui accesso è governato da un clock"]],
      "DDR4 e DDR5 sono generazioni di SDRAM. L'ESP32-C6 ha 512 KB di SRAM e nessuna DRAM."),
    T("Altre memorie", [
      "FeRAM, RAM ferroelettrica: conserva lo stato senza alimentazione",
      "Flash: persistente, cancellata a blocchi; la memoria di chiavette USB, telefoni e dischi a stato solido",
      "Il programma di un microcontrollore vive nella flash e le sue variabili nella SRAM",
      ["I moduli di memoria negli anni", ["SIMM, SDRAM PC100 e PC133, Rambus, DDR: da decine a centinaia di megabyte ciascuno", "oggi: moduli DDR5 da 16 a 64 GB"]],
    ], "Le fotografie dei moduli della presentazione originale (SIMM EDO, SDRAM PC100 32 MB, PC133 64 MB, Rambus PC800 128 MB, DDR PC2100, ECC registered 256 MB) sono riassunte qui. Flash e dischi a stato solido si trattano nella prossima lezione.", { img: "ram_modules.jpg", cap: "Moduli di memoria di generazioni diverse" }),
    T("Come riconoscere la memoria", [
      "Sulla scheda madre di un desktop o di un server: file di lunghi zoccoli accanto al processore, che reggono i moduli",
      "Su un portatile o un telefono: chip saldati vicino al processore",
      "Sul kit PRG32: niente da vedere. La SRAM sta dentro l'ESP32-C6 stesso, e la flash è un piccolo chip lì accanto",
      ["Due parametri caratteristici", ["dimensione: il numero di celle, oggi gigabyte su un PC e kilobyte su un microcontrollore", "tempo di accesso: il ritardo dopo cui il dato è disponibile, decine di nanosecondi per la DRAM"]],
    ], "1 ns = 10^-9 s. A 160 MHz un periodo di clock dell'ESP32-C6 dura 6,25 ns.", { img: "ram_on_board.jpg", cap: "Moduli di memoria nei loro zoccoli" }),

    H("La memoria centrale", "Un vettore di parole con indirizzi."),
    T("Parole e indirizzi", [
      "La memoria centrale è un vettore di parole; una parola è una stringa di m bit",
      "Il processore accede agli m bit di una parola con una sola operazione di lettura o di scrittura",
      "Ogni parola è identificata da un indirizzo: un intero tra 0 e N - 1, rappresentato su n bit, con N = 2^n",
      "Memoria ad accesso casuale, RAM: il tempo di accesso non dipende dalla posizione del dato",
      "I processori a parola accedono alla memoria con un parallelismo pari alla lunghezza della parola: 16, 32 o 64 bit",
    ], "Trentadue bit di indirizzo danno 2^32 indirizzi: 4 GiB. Il decodificatore della Lezione 11 e la piccola memoria della Lezione 14, su scala maggiore.", { big: "N = 2^n", label: "n bit di indirizzo selezionano una di N locazioni: l'indirizzo è una parola codice, la memoria la decodifica" }),
    D("Memoria indirizzabile al byte", (s, h) => {
      const cw = 1.15, x = 3.4, y = h.TOP + 0.75;
      h.tx(s, "indirizzo", { x: h.MX, y: y - 0.3, w: x - h.MX - 0.2, h: 0.3, fontSize: 13, color: P.mute, align: "right" });
      h.mem(s, x, y, cw, ["78", "56", "34", "12", "48", "45", "4C", "..."].map((v, i) => ({ val: v, addr: i < 7 ? `A+${i}` : "", color: i < 4 ? P.teal : i < 7 ? P.amber : undefined })), { h: 0.8, fs: 22 });
      h.tx(s, "una parola: .word 0x12345678", { x, y: y + 0.9, w: 4 * cw, h: 0.35, fontSize: 14, bold: true, color: P.teal, align: "center" });
      h.tx(s, "tre byte: \"HEL...\"", { x: x + 4 * cw, y: y + 0.9, w: 3 * cw, h: 0.35, fontSize: 14, bold: true, color: P.amber, align: "center" });
      h.rows(s, [
        "In una memoria indirizzabile al byte il byte è la più piccola unità dotata di indirizzo",
        "Una parola di 32 bit occupa quattro indirizzi consecutivi; il suo indirizzo è quello del suo primo byte",
        "Parole consecutive distano 4 indirizzi: per questo il program counter avanza di 4, e l'indice di un vettore si moltiplica per 4 (Lezione 04)",
        "RISC-V ha istruzioni distinte per ogni dimensione: lb e sb per i byte, lh e sh per le halfword, lw e sw per le parole",
      ], h.MX, 4.0, h.CW, 2.75);
    }, "Ogni cella è un byte di otto bit, dal più significativo (bit 7) al meno significativo (bit 0)."),
    D("Big-endian e little-endian", (s, h) => {
      const cw = 1.4, x = 5.2, cols = [P.teal, P.amber, P.violet, P.green];
      h.tx(s, "la parola 0x10A3E6FF memorizzata all'indirizzo 1000", { x: h.MX, y: h.TOP - 0.1, w: h.CW, h: 0.45, fontSize: 20, bold: true, fontFace: h.MONO, color: P.steel, align: "center" });
      h.tx(s, "little-endian\nRISC-V, x86, ARM", { x: h.MX, y: h.TOP + 0.95, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 0.95, cw, ["FF", "E6", "A3", "10"].map((v, i) => ({ val: v, addr: 1000 + i, color: cols[3 - i] })), { h: 0.8, fs: 24 });
      h.tx(s, "big-endian\nMotorola 68000, ordine di rete", { x: h.MX, y: h.TOP + 2.4, w: x - h.MX - 0.3, h: 0.8, fontSize: 16, bold: true, align: "right", valign: "middle" });
      h.mem(s, x, h.TOP + 2.4, cw, ["10", "A3", "E6", "FF"].map((v, i) => ({ val: v, addr: 1000 + i, color: cols[i] })), { h: 0.8, fs: 24 });
      h.rows(s, ["I due nomi indicano come i byte di una parola sono disposti in memoria",
        "Little-endian: il byte meno significativo all'indirizzo più basso. Big-endian: prima il byte più significativo",
        "RISC-V è little-endian, come quasi tutti i processori oggi in uso; i dati che attraversano una rete viaggiano ancora big-endian"], h.MX, 4.95, h.CW, 1.8);
    }, "La presentazione originale contrapponeva l'MC68000 (big-endian) all'Intel x86 (little-endian); i valori dell'esempio sono gli stessi. Detti anche diretto (little) e inverso (big)."),
    T("Parole allineate e non allineate", [
      "Una parola che comincia a un indirizzo multiplo della propria dimensione è allineata al confine di parola: multipli di 4 per le parole di 32 bit",
      "Una parola allineata si preleva con un solo accesso alla memoria",
      "Una parola non allineata sta a cavallo di due parole di memoria: servono due accessi",
      ["RISC-V: l'assemblatore allinea per voi i dati .word, e le istruzioni devono essere sempre allineate", ["un load o uno store a un indirizzo disallineato è, secondo il processore, eseguito più lentamente oppure rifiutato con un'eccezione"]],
      "La direttiva .balign 4 forza l'allineamento dopo una stringa o un byte",
    ], "La presentazione originale: l'MC68000 non ammette parole non allineate, l'Intel x86 le ammette al costo di due accessi. La specifica RISC-V lascia la scelta all'implementazione: i programmi corretti tengono allineati i propri dati.", { code: ".section .data\nname:  .asciz \"PRG32\"   # 6 bytes\n       .balign 4          # skip 2\nscore: .word 0            # aligned", wide: true, h: 2.4 }),
    T("Parametri di una memoria", [
      ["Capacità: il numero N di registri e la lunghezza in bit di ciascuno", ["1 MB = 2^20 registri di 8 bit; 16 kW di 32 bit = 16 x 2^10 registri di 32 bit"]],
      ["Tempo di accesso: il tempo per svolgere una lettura o una scrittura", ["il tempo per selezionare la locazione, più il tempo della lettura o della scrittura vera e propria"]],
      "L'ESP32-C6: 512 KB di SRAM per i dati, 320 KB di ROM, e una flash esterna di alcuni megabyte per i programmi",
      "Il menu di PRG32 mostra ciò che resta a voi: circa 98 KB di RAM e 509 KB di flash per le cartucce",
    ], "Valori dal datasheet dell'ESP32-C6 e dalla schermata Setup di PRG32 (RAM 98K, CART FLASH 509K, CART RAM 32K). Un Commodore 64 aveva 64 KB in tutto.", { big: "512 KB", label: "la memoria centrale dell'ESP32-C6: otto Commodore 64, o un trentamillesimo di un portatile" }),

    H("Processore e memoria", "Il dialogo dietro lw e sw."),
    D("L'interfaccia tra processore e memoria", (s, h) => {
      const y = h.TOP + 0.3;
      h.card(s, h.MX, y - 0.2, 3.9, 4.3); h.tx(s, "Processore", { x: h.MX + 0.2, y: y - 0.1, w: 3, h: 0.35, fontSize: 15, bold: true, color: P.steel });
      box10(s, h, "MA\nregistro indirizzi di memoria", h.MX + 0.4, y + 0.5, 3.1, 0.9, P.teal, 14);
      box10(s, h, "MB\nregistro dati di memoria", h.MX + 0.4, y + 1.75, 3.1, 0.9, P.amber, 14);
      box10(s, h, "unità di controllo", h.MX + 0.4, y + 3.0, 3.1, 0.75, P.steel, 14);
      box10(s, h, "Memoria", 8.3, y + 0.3, 2.6, 3.6, P.violet, 20);
      h.arrow(s, h.MX + 3.53, y + 0.95, 8.27, y + 0.95, P.teal, 3); h.tx(s, "bus indirizzi", { x: 5.0, y: y + 0.55, w: 3, h: 0.3, fontSize: 14, bold: true, color: P.teal, align: "center" });
      h.arrow(s, h.MX + 3.53, y + 2.2, 8.27, y + 2.2, P.amber, 3); h.arrow(s, 8.27, y + 2.2, h.MX + 3.53, y + 2.2, P.amber, 3); h.tx(s, "bus dati", { x: 5.0, y: y + 1.8, w: 3, h: 0.3, fontSize: 14, bold: true, color: P.amber, align: "center" });
      h.arrow(s, h.MX + 3.53, y + 3.25, 8.27, y + 3.25, P.red, 2); h.arrow(s, h.MX + 3.53, y + 3.55, 8.27, y + 3.55, P.red, 2);
      h.tx(s, "abilitazione lettura (RE)\nabilitazione scrittura (WE)", { x: 5.0, y: y + 2.6, w: 3, h: 0.6, fontSize: 13, bold: true, color: P.red, align: "center" });
      h.tx(s, "L'indirizzo viaggia in un solo verso; i dati viaggiano nei due versi; le linee di controllo dicono quale operazione è richiesta.", { x: h.MX, y: 6.0, w: 10.4, h: 0.7, fontSize: 15, valign: "middle" });
    }, "MA e MB sono registri interni del modello di processore del libro (Lezione 18): non sono tra i trentadue registri che vede un programmatore RISC-V."),
    G("Prelevare una parola: lw t1, 0(t0)", ["Passo", "Che cosa accade", "Dove"], [
      ["1", "l'indirizzo, t0 + 0, è calcolato dalla ALU e posto in MA", "processore"],
      ["2", "MA pilota il bus indirizzi", "bus indirizzi"],
      ["3", "l'unità di controllo alza l'abilitazione alla lettura", "linee di controllo"],
      ["4", "la memoria decodifica l'indirizzo e mette sul bus dati i quattro byte della parola", "memoria, bus dati"],
      ["5", "il dato sul bus dati viene catturato in MB", "processore"],
      ["6", "MB viene copiato nel registro di destinazione t1", "processore"],
    ], "Uno store, sw t1, 0(t0), è simmetrico: indirizzo in MA, dato in MB, abilitazione alla scrittura alzata, e la memoria cattura il dato. Il tempo di accesso è il tempo tra il passo 2 e il passo 5.", { widths: [0.9, 8.2, 3.1], caption: "sw è simmetrica: il dato va in MB, si alza l'abilitazione alla scrittura, e la memoria memorizza ciò che trova sul bus dati." }),
    V("Sincronizzare processore e memoria",
      ["Tecnica asincrona", ["Il processore aspetta che la memoria segnali, con una linea di acknowledge, che l'operazione è completa", "Il processore si adatta alla velocità della memoria", "Più complessa, ma rende il progetto della memoria indipendente da quello del processore"]],
      ["Tecnica sincrona", ["Una delle linee di controllo porta gli impulsi di un clock a frequenza fissa", "Una lettura o una scrittura si completa entro un ciclo di clock", "Il ciclo di clock va dimensionato sulla velocità della memoria", "Più semplice, ed è la regola dentro un singolo chip come un microcontrollore"]],
      "L'operazione di lettura/scrittura si può codificare in modi diversi, per esempio una sola linea R/W qualificata da un'abilitazione."),

    H("Memoria e ingresso/uscita", "Dispositivi che sembrano memoria."),
    V("Collegare processore, memoria e I/O",
      ["Bus unico: I/O mappato in memoria", ["Memoria e dispositivi di I/O condividono lo stesso bus e lo stesso spazio di indirizzi", "Un registro di dispositivo si legge e si scrive come una locazione di memoria", "Non servono istruzioni speciali", "È la via di RISC-V: non esistono istruzioni di ingresso/uscita"]],
      ["Bus separati: I/O isolato", ["Due bus fisici, o due spazi di indirizzi: uno per la memoria, uno per l'I/O", "Istruzioni dedicate raggiungono i dispositivi", "La famiglia Intel x86 ha entrambi: istruzioni in e out oltre ai dispositivi mappati in memoria"]],
      "Il sottosistema di I/O permette al processore di interagire con dispositivi di ingresso (tastiera, mouse), di uscita (schermo, stampante) e di ingresso/uscita (memorie di massa, schede di rete, porte seriali)."),
    G("Dove stanno le cose sull'ESP32-C6 (semplificato)", ["Gli indirizzi cominciano con", "Che cosa c'è", "Raggiunto con"], [
      ["0x4000...", "ROM: il codice che avvia il chip", "prelievo delle istruzioni"],
      ["0x4080...", "SRAM: 512 KB per dati, stack e cartucce caricate in RAM", "lw, sw, prelievo delle istruzioni"],
      ["0x4200...", "flash esterna, vista attraverso una cache: firmware e costanti", "lw, prelievo delle istruzioni"],
      ["0x6000...", "registri delle periferiche: GPIO, SPI, I2S, timer, Wi-Fi", "lw, sw"],
    ], "Semplificato dal manuale tecnico dell'ESP32-C6; controllare il manuale prima di fare affidamento su un indirizzo. Il punto per gli studenti: le stesse trentadue linee di indirizzo raggiungono ROM, RAM, flash e ogni dispositivo, e le stesse lw e sw li fanno funzionare.", { widths: [3, 6.2, 3], mono: [0], caption: "Un solo spazio di indirizzi per tutto. Scrivere con sw una parola in un registro di periferica è il modo in cui un programma RISC-V accende un pixel o legge un pulsante." }),
    T("I tre bus componenti, e il DMA", [
      ["Il bus che collega processore, memoria e I/O è fatto di tre bus", ["bus dati: trasporta i dati", "bus indirizzi: trasporta l'indirizzo, di memoria o di I/O, da cui o verso cui è diretto il dato", "linee di controllo: abilitazione alla lettura e alla scrittura, acknowledge, ..."]],
      ["DMA, accesso diretto alla memoria", ["dove le interfacce di I/O sono collegate fisicamente alla memoria, blocchi di dati possono andare direttamente tra un dispositivo e la memoria", "il processore avvia il trasferimento e viene avvisato quando è finito"]],
      "Il display del kit riceve così ogni frame: il processore non copia i pixel uno per uno",
    ], "Se più unità condividono il bus e possono accedere direttamente alla memoria, arbitra un controllore DMA. Sull'ESP32-C6 le periferiche SPI e I2S usano il DMA per trasmettere il frame buffer e i campioni audio."),

    Q("Una memoria ha 16 linee di indirizzo ed è indirizzabile al byte. Quanto è grande?", ["16 byte", "32 KiB", "64 KiB", "16 MiB"], 2, "2^16 = 65.536 locazioni di un byte: 64 KiB, lo spazio di indirizzi di un Commodore 64."),
    Q("Su RISC-V, value: .word 0xCAFE0001 sta all'indirizzo A. Che cosa legge lbu t0, 0(t0) se t0 = A?", ["0xCA", "0xFE", "0x00", "0x01"], 3, "Little-endian: il byte meno significativo, 0x01, sta all'indirizzo più basso."),
    Q("Perché la DRAM va rinfrescata?", ["Perché i suoi condensatori perdono la carica", "Perché la lettura è lenta", "Perché non è ad accesso casuale", "Perché il clock è troppo veloce"], 0, "Ogni bit è una carica in un condensatore che si disperde; un circuito interno alla memoria riscrive periodicamente ogni cella."),
    Q("Come scrive un programma RISC-V su un dispositivo di uscita?", ["Con l'istruzione out", "Con sw all'indirizzo di un registro del dispositivo", "Con un registro speciale x32", "Non può: solo il firmware può farlo"], 1, "RISC-V non ha istruzioni di I/O: i dispositivi sono mappati in memoria e si raggiungono con normali load e store."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Una memoria di 4 KiB parole di 16 bit: quante linee di indirizzo, quante linee di dati, quanti bit in tutto?",
      "Scrivete i byte memorizzati, in ordine di indirizzo, da .word 0xDEADBEEF e da .asciz \"Ciao\" su una macchina little-endian",
      "Elencate i passi di sw t1, 8(t0) sull'interfaccia processore-memoria",
      "In PRG32-QT trovate la vostra variabile contatore nella vista della memoria e guardatene cambiare i quattro byte frame dopo frame",
      "Memorizzate una parola con sw e rileggetela con quattro istruzioni lbu; ricostruitela con scorrimenti e or e verificate che coincida",
    ], "Su carta: 12 linee di indirizzo, 16 linee di dati, 65.536 bit. Su PRG32: il byte più basso del contatore cambia a ogni frame, il successivo ogni 256 frame.",
      "0xDEADBEEF: EF BE AD DE. \"Ciao\": 43 69 61 6F 00. Esercizio 5: slli di 8, 16 e 24, poi or."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["main memory", "memoria centrale", "access time", "tempo di accesso"],
      ["volatile / persistent", "volatile / persistente", "aligned word", "parola allineata"],
      ["magnetic core", "nucleo magnetico (di ferrite)", "address / data bus", "bus indirizzi / bus dati"],
      ["refresh", "rinfresco (refresh)", "read / write enable", "abilitazione lettura / scrittura"],
      ["byte order", "ordinamento dei byte", "memory-mapped I/O", "I/O mappato in memoria"],
    ], null, { widths: [3, 3.3, 3.1, 3.4] }),
    T("Conclusioni e letture", [
      "La memoria è un componente fondamentale di un calcolatore: un dispositivo capace di conservare lo stato dei dati",
      "Tipi diversi di memoria servono a scopi diversi: nessuna tecnologia è insieme veloce, grande ed economica",
      "I dati si memorizzano come parole di bit, ciascuna con un indirizzo; RISC-V indirizza i byte e li ordina little-endian",
      "L'accesso avviene per selezione (bus indirizzi), lettura o scrittura (bus dati) e linee di controllo",
      "In RISC-V i dispositivi di ingresso/uscita si raggiungono esattamente come la memoria",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 2.3 e 5.1-5.2", "Stallings: Computer Organization and Architecture, il capitolo sulla memoria interna", "ESP32-C6 Technical Reference Manual: sistema e memoria"]],
    ], "Prossima lezione: la memoria permanente e la cache."),
  ],
});
