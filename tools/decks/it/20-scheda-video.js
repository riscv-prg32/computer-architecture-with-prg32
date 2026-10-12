// Italian version of decks/en/20-video-card.js: same slides, same listings, text in Italian.
// Lecture 20 - Buses and the video card.
// Source: 16-Architettura_dei_Calcolatori-Scheda-Video.pptx (translated, updated, with the PRG32 display path as the worked example).
const box12 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "20", file: "20-Architettura_dei_Calcolatori-Scheda_Video",
  title: "I bus e la scheda video", short: "La scheda video",
  sub: "Da un byte in memoria a un pixel sullo schermo; i processori grafici e il calcolo generico su di essi",
  quote: ["...nulla è più serio del gioco...", "attribuita a Jean Cocteau (1889-1963)"],
  cover: "game_raycaster.png",
  notes: "Spirale: su PRG32 una chiamata disegna un pixel; la lezione segue quel pixel dal frame buffer al display, poi generalizza a bus, schede video, GPU e GPGPU. Il kit non ha una scheda video: fa tutto il suo processore, e questo rende visibile ogni passaggio.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Spiegare che cos'è il controller di una periferica e perché i dispositivi vanno sincronizzati con il processore",
      "Caratterizzare un bus per larghezza, velocità e velocità di trasferimento, ed elencarne vantaggi e limiti",
      "Descrivere il compito di una scheda video: frame buffer, risoluzione, profondità di colore, interfaccia di uscita",
      "Calcolare la memoria che serve a un frame e il tempo necessario a inviarlo su un bus",
      "Spiegare che cosa fa una GPU e che cos'è il calcolo generico su GPU",
    ]),

    H("Riscaldamento sulla macchina", "Il viaggio di un pixel."),
    K("Un pixel, per favore", `    li   a0, 100             # x
    li   a1, 50              # y
    li   a2, 0xf800          # red, in RGB565
    call prg32_gfx_pixel     # ... where does it go?

# what the runtime does, in principle:
    li   t0, 320
    mul  t1, a1, t0          # y * 320
    add  t1, t1, a0          # + x  =  position in the frame
    la   t2, framebuffer
    add  t2, t2, t1          # ADDRESS of that pixel
    sb   t3, 0(t2)           # store its palette index (one byte)`, [
      "Lo schermo è un array in memoria, un elemento per pixel: il frame buffer",
      "Disegnare un pixel è un'istruzione di store all'indirizzo base + y x 320 + x",
      "Non compare nulla finché il frame non viene inviato al display: prg32_gfx_present",
      "Su un PC questi due compiti, conservare il frame e inviarlo al monitor, spettano alla scheda video",
    ], "La seconda metà è uno schema di principio, non il sorgente del runtime: t3 sta per l'indice di palette che il runtime ricava dal colore RGB565 in a2. Sull'ESP32-C6 il frame buffer di PRG32 è di 320 x 200 byte, un indice di palette per pixel (docs/hardware/ili9341.md)."),

    H("Periferiche e controller"),
    T("Dispositivi di ingresso/uscita", [
      "Le periferiche servono all'interazione tra l'utente e il sistema",
      "Hanno un'autonomia limitata: sono controllate e coordinate dal processore",
      ["Lavorano in modo asincrono rispetto al processore, quindi servono meccanismi di sincronizzazione", ["per sapere quando sarà disponibile un dato in ingresso", "per sapere quando un dispositivo di uscita ha finito di produrre i suoi dati"]],
      "Il terminale, lo strumento di interazione più comune, è fatto di due dispositivi indipendenti: la tastiera e il video",
    ], "Tastiera e video non sono collegati direttamente: è il processore a riprodurre sul video ciò che arriva dalla tastiera (Lezione 21)."),
    D("I controller", (s, h) => {
      const y = h.TOP + 0.3;
      box12(s, h, "processore", h.MX + 0.2, y, 2.2, 0.9, P.teal, 16); box12(s, h, "memoria", h.MX + 3.0, y, 2.2, 0.9, P.violet, 16);
      h.line(s, h.MX, y + 1.7, 7.3, y + 1.7, P.amber, 6); h.tx(s, "bus dati, bus indirizzi, controllo", { x: h.MX, y: y + 1.8, w: 4, h: 0.3, fontSize: 13, bold: true, color: P.amber });
      h.line(s, h.MX + 1.3, y + 0.93, h.MX + 1.3, y + 1.65, P.mute, 2.5); h.line(s, h.MX + 4.1, y + 0.93, h.MX + 4.1, y + 1.65, P.mute, 2.5);
      ["controller\nvideo", "controller\nUSB", "controller\ndei dischi"].forEach((t, i) => { const x = h.MX + 0.2 + i * 2.3;
        box12(s, h, t, x, y + 2.6, 1.9, 0.9, P.steel, 14); h.line(s, x + 0.95, y + 1.75, x + 0.95, y + 2.57, P.mute, 2.5);
        box12(s, h, ["monitor", "tastiera,\nmouse", "dischi"][i], x, y + 4.0, 1.9, 0.8, P.green, 14); h.line(s, x + 0.95, y + 3.53, x + 0.95, y + 3.97, P.mute, 2.5); });
      h.rows(s, [
        "Le periferiche sono interfacciate al processore tramite controller dedicati",
        "Il controller gestisce la comunicazione tra il dispositivo e tutti gli altri componenti, processore compreso",
        "Presenta sul bus pochi registri: il processore li legge e li scrive come memoria",
        "In genere un controller segnala la fine dell'operazione in corso alzando un segnale: un'interruzione (Lezione 19)",
        "La scheda video è il controller del monitor",
      ], 7.8, h.TOP, h.W - h.MX - 7.8, h.BOT - h.TOP);
    }, "Sull'ESP32-C6 i controller (SPI, I2S, GPIO, USB) stanno sullo stesso chip del processore, e i loro registri sono mappati in memoria (Lezione 15)."),

    H("I bus", "Strade condivise, e i loro limiti di traffico."),
    T("Che cosa caratterizza un bus", [
      "Un bus è un canale di comunicazione condiviso da più unità; le sue caratteristiche influenzano in modo decisivo le prestazioni dell'intero sistema",
      ["Larghezza", ["il numero di bit del bus dati"]],
      ["Velocità", ["la frequenza di lavoro del bus; il numero di byte per ciclo di clock"]],
      ["Velocità di trasferimento", ["megabyte trasmessi al secondo: un bus a 32 bit a 66 MHz porta 264 MB/s"]],
      "Un bus è uno standard: segnali, connettori e un protocollo su cui tutte le unità concordano",
    ], "L'esempio è il bus PCI: 4 byte x 66 milioni di cicli al secondo = 264 MB/s. Interfaccia: il modulo hardware che codifica i dati in forma elettrica o ottica. Protocollo: la descrizione di livello più alto di come si svolge il dialogo.", { big: "264 MB/s", label: "32 bit a 66 MHz: larghezza per frequenza dà la velocità di trasferimento" }),
    V("I bus: vantaggi e svantaggi",
      ["Vantaggi", ["Si aggiungono facilmente nuovi dispositivi", "Le periferiche si possono spostare da un calcolatore a un altro che usa lo stesso bus", "Un solo insieme di fili collega più periferiche", "Basso costo per byte trasmesso"]],
      ["Svantaggi", ["La banda del bus limita la velocità di trasferimento", "La velocità massima dipende dalla lunghezza del bus", "e dal numero di dispositivi collegati", "Una risorsa condivisa: un solo trasferimento alla volta"]]),
    G("I bus negli anni", ["Bus", "Tipo", "Usato per", "Oggi"], [
      ["ISA, EISA, VESA", "parallelo, da 16 a 32 bit", "schede di espansione dei primi PC", "in disuso"],
      ["PCI", "parallelo, 32 o 64 bit", "schede di espansione", "sostituito da PCI Express"],
      ["AGP", "parallelo, porta dedicata", "la sola scheda video", "sostituito da PCI Express"],
      ["PCI Express", "seriale, da 1 a 16 linee", "schede video, memorie veloci", "attuale: ogni generazione raddoppia la velocità"],
      ["IDE (ATA), SCSI", "parallelo", "dischi", "sostituiti da Serial ATA e NVMe"],
      ["USB", "seriale", "quasi ogni dispositivo esterno", "attuale: da 12 Mbit/s a decine di Gbit/s"],
      ["SPI, I2C, I2S", "seriale, pochi fili", "chip sulla stessa scheda", "attuali: i bus del kit PRG32"],
    ], "USB: universal serial bus. PCI: peripheral component interconnect. AGP: accelerated graphics port. IDE: integrated device electronics. ISA: industry standard architecture. SCSI: small computer system interface. Nell'elenco originale c'erano anche PCMCIA e FireWire. Il passaggio dal parallelo al seriale è la lezione della Lezione 14.", { widths: [2.4, 2.8, 3.2, 3.8] }),

    H("La scheda video", "Da una rappresentazione in memoria alla luce."),
    T("Che cosa fa una scheda video", [
      "La sua funzione: inviare al monitor le informazioni da visualizzare",
      "Traduce la rappresentazione dell'immagine prodotta dal processore in un formato che il monitor può mostrare",
      "Contiene una memoria propria, la memoria video, che conserva il frame: il frame buffer",
      "Ogni volta che lo schermo va ridisegnato, legge la rappresentazione digitale dell'immagine e invia al monitor il segnale per il colore di ogni pixel",
      "Ha una capacità di elaborazione propria",
    ], "DAC: convertitore digitale-analogico, necessario per i monitor analogici. Su PRG32 la «scheda video» è una regione di RAM più la periferica SPI: nessun hardware separato."),
    V("Monitor analogici e digitali",
      ["Monitor CRT, ingresso analogico", ["La scheda converte l'immagine digitale in segnali analogici", "La conversione è svolta da un componente detto RAMDAC", "Uscita VGA (1987): progettata per i tubi a raggi catodici", "Problemi: rumore elettrico, distorsione, errori nel posizionamento dei pixel"]],
      ["Monitor LCD, ingresso digitale", ["La scheda adatta colori e risoluzione dell'immagine", "Fornisce memoria locale da usare come buffer", "Supporta l'accelerazione grafica, per esempio 3D", "DVI: ogni pixel dell'uscita corrisponde a un pixel dello schermo, alla sua risoluzione nativa"]],
      "RAMDAC: random access memory digital-analog converter. Il DVI poteva portare anche i segnali analogici VGA, per compatibilità."),
    G("Uscite video", ["Interfaccia", "Anno", "Segnale", "Note"], [
      ["VGA", "1987", "analogico", "per i monitor CRT; mantenuta per anni per compatibilità"],
      ["DVI", "1999", "digitale (e analogico)", "introdotta con i monitor LCD"],
      ["HDMI", "2003", "digitale", "sostituisce gli standard precedenti; porta anche l'audio"],
      ["DisplayPort", "2006", "digitale", "video, audio e altri dati; anche su connettori USB-C"],
      ["SPI verso un controller di display", "-", "digitale, seriale", "il kit PRG32: un pannello ILI9341 di 320 per 240 pixel"],
    ], "High-Definition Multimedia Interface; Digital Visual Interface; Video Graphics Array. L'ILI9341 è il chip sul modulo del display: ha una memoria propria per il frame e pilota i cristalli liquidi (Lezione 21).", { widths: [3.4, 1.2, 2.8, 4.8] }),
    G("Risoluzione: la dimensione della griglia di pixel", ["Risoluzione", "Pixel", "Rapporto d'aspetto", "Dove"], [
      ["320 x 200", "64.000", "8:5", "Commodore 64, giochi VGA, il viewport di PRG32"],
      ["640 x 480", "307.200", "4:3", "VGA"],
      ["1024 x 768", "786.432", "4:3", "monitor degli anni Novanta"],
      ["1920 x 1080", "2.073.600", "16:9", "Full HD"],
      ["3840 x 2160", "8.294.400", "16:9", "4K"],
    ], "La tabella della presentazione originale elencava anche 800 x 600, 1280 x 1024 (5:4) e 1600 x 1200. Il tradizionale rapporto 4:3 ha lasciato il posto al panoramico 16:9. La riga 4K è nuova.", { widths: [2.4, 2.2, 2, 5.6], caption: "La risoluzione determina la definizione dell'immagine, e quanti pixel vanno memorizzati e inviati per ogni frame." }),
    G("Profondità di colore: bit per pixel", ["Profondità", "Colori", "Byte per pixel", "Nome"], [
      ["4 bit", "16", "0,5", "VGA standard"],
      ["8 bit", "256", "1", "modo a 256 colori: ogni valore è un indice in una palette"],
      ["16 bit", "65.536", "2", "High Color: RGB565"],
      ["24 bit", "16.777.216", "3", "True Color: 256 sfumature per ciascuno tra rosso, verde e blu"],
    ], "In True Color ogni colore si ottiene da 256 sfumature di ciascuno dei tre primari additivi. PRG32 usa entrambe le righe centrali: un frame buffer a 8 bit di indici di palette, e una palette di 256 colori RGB565 (Lezione 04).", { widths: [1.8, 2.4, 2.4, 5.6] }),
    D("Seguire il pixel su PRG32", (s, h) => {
      const y = h.TOP + 0.4, st = [["il vostro codice", "prg32_gfx_pixel", P.teal], ["frame buffer", "320 x 200 byte\nin RAM", P.violet], ["palette", "256 voci\nRGB565", P.amber], ["bus SPI", "27 MHz,\nseriale, con DMA", P.red], ["display", "ILI9341,\n320 x 240", P.green]];
      const bw = 2.0, g = (h.CW - 5 * bw) / 4;
      st.forEach(([t, d, c], i) => { const x = h.MX + i * (bw + g);
        s.addText([{ text: t, options: { bold: true, fontSize: 16, breakLine: true } }, { text: d, options: { fontSize: 12.5 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w: bw, h: 1.4, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 4) h.arrow(s, x + bw + 0.04, y + 0.7, x + bw + g - 0.04, y + 0.7, P.mute, 2.5); });
      h.table(s, h.MX, y + 1.9, [5.4, 6.733], ["Grandezza", "Valore"], [
        ["memoria per un frame, un byte per pixel", "320 x 200 x 1 = 64.000 byte"],
        ["lo stesso frame a due byte per pixel", "128.000 byte: un quarto di tutta la RAM del chip"],
        ["bit inviati al display per un frame intero", "64.000 pixel x 16 bit = 1.024.000 bit"],
        ["tempo sul bus a 27 MHz", "circa 38 ms: al massimo 26 frame interi al secondo"],
      ], { fs: 14.5 });
      h.tx(s, "Due risposte ingegneristiche: un frame buffer indicizzato dimezza la memoria, e si inviano solo le righe cambiate.", { x: h.MX, y: 6.25, w: h.CW, h: 0.5, fontSize: 15, italic: true, valign: "middle" });
    }, "Dati dal repository PRG32 (docs/hardware/ili9341.md): frame buffer indicizzato a 8 bit di 64.000 byte, palette di 512 byte, clock SPI predefinito di 27 MHz, trasferimenti in DMA e tracciamento dei rettangoli modificati. 1.024.000 / 27.000.000 = 37,9 ms. Il contatore di FPS delle cartucce dimostrative mostra il risultato."),
    T("Memoria e banda: la pressione sull'hardware video", [
      "La memoria e il tempo di processore richiesti da una grafica sempre più esigente, i videogiochi 3D soprattutto, hanno imposto alle schede video una rapida evoluzione",
      "Al crescere della definizione delle immagini cresce la memoria necessaria a rappresentare un frame",
      "Il flusso di dati dalla memoria alla scheda video rischia di saturare la capacità del bus",
      ["Due linee d'attacco", ["sempre più memoria sulla scheda stessa: la memoria video", "un bus più largo o dedicato: ieri AGP, oggi PCI Express"]],
      "Si potevano perfino collegare più schede per dividere il lavoro",
    ], "Con AGP il processore grafico usava parte della memoria centrale con accesso diretto. PCI Express (2004) l'ha sostituito con più banda e più potenza. SLI (NVIDIA) e CrossFire (AMD) collegavano fino a quattro schede; oggi la regola è una sola scheda, oppure molte schede in un server.", { big: "4K, 60 Hz", label: "8,3 milioni di pixel x 3 byte x 60 frame: circa 1,5 GB di pixel al secondo" }),

    H("GPU e GPGPU", "Un processore per i pixel, poi per tutto."),
    T("L'unità di elaborazione grafica", [
      "La quota di tempo di processore spesa a calcolare immagini è cresciuta con l'uso delle interfacce grafiche",
      "Per alleggerire la CPU, le schede video hanno ricevuto processori dedicati: le GPU",
      ["Accelerano", ["grafica raster: copia di blocchi di pixel (blitting), operazioni sulle texture", "grafica 3D: trasformazioni, texture mapping, illuminazione"]],
      "I programmi le usano tramite librerie: OpenGL, Direct3D, e oggi Vulkan e Metal",
      "Un driver di periferica adatta il software che gira sulla CPU alle primitive offerte dalla GPU; ciò che non è supportato viene emulato dalla CPU, lentamente",
    ], "Su PRG32 non c'è una GPU: prg32_gfx_rect è un ciclo di istruzioni di store eseguite dal core RISC-V. Per questo la frequenza dei frame di una cartuccia impegnativa cala, e gli studenti possono vedere il costo di ogni pixel.", { img: "game_tetris.png", cap: "Nessuna GPU sul kit: ogni pixel è un'istruzione di store" }),
    T("Calcolo generico su GPU", [
      "Le GPU moderne eseguono la stessa operazione in parallelo su intere matrici di pixel",
      "GPGPU: usare le GPU per applicazioni di tipo generale, non necessariamente grafiche",
      "Un numero molto grande di core semplici per GPU: centinaia, migliaia",
      "Modelli di programmazione: CUDA (NVIDIA) e OpenCL, uno standard aperto",
      "Simulazione scientifica, analisi dei dati e, oggi soprattutto, addestramento e uso delle reti neurali girano su GPU",
    ], "Compute Unified Device Architecture. La somma parallela della Lezione 04 è il più semplice esempio di GPGPU. I modelli meteorologici e marini del Dipartimento girano su cluster di GPU.", { img: "gpgpu_sum.png", cap: "La stessa operazione su molti dati insieme", wide: true }),

    Q("Quanta memoria serve a un frame di 640 x 480 pixel in True Color (24 bit)?", ["307.200 byte", "614.400 byte", "921.600 byte", "7.372.800 byte"], 2, "307.200 pixel x 3 byte = 921.600 byte."),
    Q("Un bus a 16 bit lavora a 50 MHz, un trasferimento per ciclo. Qual è la sua velocità di trasferimento?", ["50 MB/s", "100 MB/s", "400 MB/s", "800 MB/s"], 1, "2 byte x 50 milioni di trasferimenti al secondo = 100 MB/s."),
    Q("In un frame buffer indicizzato a 8 bit, il byte di un pixel contiene:", ["la sua componente rossa", "la sua luminosità", "la posizione del suo colore in una palette", "la sua coordinata x"], 2, "Il byte è un indice; il colore vero si cerca in una tabella di 256 voci, la palette."),
    Q("Che cos'è il GPGPU?", ["Un'uscita video più veloce", "L'uso dei processori grafici per calcoli non grafici", "Un bus per schede video", "Un tipo di memoria video"], 1, "General-purpose computing on graphics processing units: calcolo generico su unità di elaborazione grafica."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Calcolate la memoria per un frame 4K in True Color, e i byte al secondo a 60 frame al secondo",
      "Il bus del display di PRG32 lavora a 27 MHz: quanto tempo serve per inviare 20 righe di 320 pixel a 16 bit per pixel?",
      "Disegnate una linea diagonale pixel per pixel con prg32_gfx_pixel in un ciclo",
      "Riempite lo schermo una volta con prg32_gfx_clear e una volta con 64.000 chiamate a prg32_gfx_pixel: confrontate le frequenze dei frame",
      "Cambiate a ogni frame una voce della palette con prg32_palette_set e guardate cambiare insieme tutti i pixel che la usano",
    ], "Su carta: 24.883.200 byte per frame, circa 1,5 GB al secondo; 102.400 bit, circa 3,8 ms. Su PRG32: il ciclo della palette anima lo schermo senza ridisegnare un solo pixel.",
      "L'ultimo esercizio mostra perché il colore indicizzato piaceva tanto ai programmatori di giochi: uno store cambia migliaia di pixel. Chiamate dell'API dall'appendice del libro (prg32_palette_set, prg32_gfx_clear, prg32_gfx_pixel)."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["peripheral", "periferica", "resolution", "risoluzione"],
      ["controller", "controller (unità di controllo della periferica)", "colour depth", "profondità di colore"],
      ["bus width", "larghezza del bus", "palette", "tavolozza (palette)"],
      ["transfer rate", "velocità di trasferimento", "video memory", "memoria video"],
      ["video card", "scheda video", "device driver", "driver di periferica"],
    ], null, { widths: [2.6, 4.2, 2.8, 3.2] }),
    T("Conclusioni e letture", [
      "I dispositivi di ingresso/uscita sono una componente fondamentale dei calcolatori",
      "I dispositivi sono gestiti da un controller che li interfaccia al bus",
      "Un bus è caratterizzato da larghezza, velocità e velocità di trasferimento; la sua banda è un limite di cui il progetto deve tenere conto",
      "Le schede video permettono di visualizzare grafica e testo: un frame buffer, una risoluzione, una profondità di colore, un'uscita",
      "I loro processori, le GPU, si usano anche per il calcolo ad alte prestazioni",
      ["Letture", ["Tanenbaum, Austin: Architettura dei calcolatori. Un approccio strutturale, capitoli 2 e 3 (bus, display)", "Playing with RISC-V, capitolo 7: il gioco grafico", "Repository PRG32: docs/hardware/ili9341.md"]],
    ], "Prossima lezione: i dispositivi di ingresso e di uscita."),
  ],
});
