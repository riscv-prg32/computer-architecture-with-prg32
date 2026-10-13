// Italian version of decks/en/16-permanent-memory.js: same slides, same listings, text in Italian.
// Lecture 16 - Permanent memory: non-volatile memories, the cache, magnetic, optical and solid-state storage.
// Source: 15-Architettura_dei_Calcolatori-Memoria-Permanente.pptx (translated, updated to solid-state storage, PRG32 links added).
const G11 = require("../../lib/gates");

function diskSvg() {
  const c = 190, R = [170, 140, 110, 80, 50];
  let o = `<circle cx="${c}" cy="${c}" r="178" fill="#2E4A62"/>`;
  R.forEach((r, i) => { o += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${i === 1 ? "#C7791B" : "#CFE3EA"}" stroke-width="${i === 1 ? 5 : 1.5}"/>`; });
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; o += `<line x1="${c + 50 * Math.cos(a)}" y1="${c + 50 * Math.sin(a)}" x2="${c + 170 * Math.cos(a)}" y2="${c + 170 * Math.sin(a)}" stroke="#CFE3EA" stroke-width="1.2"/>`; }
  const arc = (r1, r2, a1, a2, col) => { const p = (r, a) => `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`; return `<path d="M${p(r1, a1)} A${r1},${r1} 0 0 1 ${p(r1, a2)} L${p(r2, a2)} A${r2},${r2} 0 0 0 ${p(r2, a1)} Z" fill="${col}" opacity="0.85"/>`; };
  o += arc(170, 50, -Math.PI / 3, -Math.PI / 6, "#0E7C86") + arc(140, 110, Math.PI / 6, Math.PI / 3, "#B23A48");
  o += `<circle cx="${c}" cy="${c}" r="38" fill="#EEF2F4"/>`;
  o += G11.text(392, 60, "settore", { size: 17, fill: "#0E7C86" }) + G11.text(392, 150, "traccia", { size: 17, fill: "#C7791B" }) + G11.text(392, 290, "blocco", { size: 17, fill: "#B23A48" });
  o += `<line x1="388" y1="55" x2="300" y2="85" stroke="#0E7C86" stroke-width="1.5"/><line x1="388" y1="145" x2="328" y2="165" stroke="#C7791B" stroke-width="1.5"/><line x1="388" y1="285" x2="290" y2="262" stroke="#B23A48" stroke-width="1.5"/>`;
  return G11.doc(470, 380, o);
}

const box11 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "16", file: "16-Architettura_dei_Calcolatori-Memoria_Permanente",
  title: "La memoria permanente", short: "Memoria permanente",
  sub: "Memorie non volatili, la cache, e la memoria di massa: magnetica, ottica e a stato solido",
  quote: ["...un dato non esiste se non è stato salvato...", "Prof. Almerico Murli, anni Novanta"],
  cover: "game_platformer.png",
  notes: "Spirale: una cartuccia conserva la stringa del titolo dopo uno spegnimento ma perde il punteggio migliore; la lezione spiega dove vive ciascuno, poi tratta ROM e flash, la cache, e la memoria di massa.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Nominare le unità funzionali di un calcolatore e riconoscerle su una scheda madre e sul kit PRG32",
      "Distinguere ROM, PROM, EPROM, EEPROM e flash, e dire che cos'è il firmware",
      "Spiegare perché una cache rende più veloce un calcolatore, e che cos'è un cache miss",
      "Descrivere tracce, settori e blocchi di un disco magnetico e le componenti del suo tempo di accesso",
      "Spiegare come un disco ottico memorizza i bit, e come si legge un compact disc",
      "Collocare flash, dischi a stato solido, dischi rigidi e nastri in un sistema di memoria a più livelli",
    ]),

    H("Riscaldamento sulla macchina", "Che cosa sopravvive quando manca la corrente."),
    K("Spegnete e riaccendete il kit", `.section .rodata            # part of the cartridge file
title: .asciz "HIGH SCORE"  # stored in flash: it survives

.section .data              # copied into RAM at start
best:  .word 0              # lives in RAM: it is lost

game_update:
    ...
    la   t0, best
    lw   t1, 0(t0)
    ble  a0, t1, 1f         # new score not better: skip
    sw   a0, 0(t0)          # remember the best score ... in RAM
1:  ...`, [
      "Dopo uno spegnimento il titolo c'è ancora, ma il punteggio migliore è di nuovo 0",
      "La cartuccia è un file nella memoria flash: non volatile",
      "La variabile vive nella SRAM: volatile",
      "Per conservare un punteggio per sempre va scritto in una memoria permanente: quali esistono?",
    ], "Scritto per questa lezione. Su PRG32 i punteggi persistenti sono gestiti dal servizio del Cartridge Store; qui conta dove vive ciascuna sezione di un programma."),

    H("I componenti di un calcolatore", "Trovare le unità sulle schede vere."),
    C("Unità funzionali di un calcolatore", [
      ["Processore", "Esegue le istruzioni. Sul kit: il core RISC-V dell'ESP32-C6."],
      ["Memoria centrale", "Contiene i programmi in esecuzione e i loro dati. Sul kit: 512 KB di SRAM dentro il chip."],
      ["Memoria secondaria", "Conserva programmi e dati a macchina spenta. Sul kit: il chip flash che contiene firmware e cartucce."],
      ["Dispositivi di ingresso/uscita", "Scheda video e monitor, tastiera, mouse, stampante, memoria di massa. Sul kit: display, joystick, amplificatore."],
      ["Linee di comunicazione", "I bus: linee di dati e di indirizzo condivise da tutte le unità."],
      ["Un chip o molti", "Un PC distribuisce queste unità su una scheda madre; un microcontrollore le mette quasi tutte in un solo contenitore."],
    ]),
    T("La scheda madre", [
      "Zoccoli per uno o più processori e per i moduli di memoria, vicini tra loro",
      "Un chipset che collega processore, memoria e periferiche",
      "Bus di espansione: slot PCI Express per schede video e altre schede",
      "Connessioni per la memoria di massa (Serial ATA, M.2) e per il mondo esterno (USB, Ethernet, audio)",
      "Un chip flash con il firmware che avvia la macchina",
      "Dal punto di vista architetturale una scheda del 2002 e una di oggi hanno molto in comune",
    ], "Esempio nella presentazione originale: la scheda per workstation a doppio zoccolo ASUS WS C621E SAGE. Le fotografie annotate di una scheda del 2002 non sono riutilizzate.", { img: "workstation_board.jpg", cap: "Una scheda madre per server a due processori", wide: true }),
    T("Il firmware: il BIOS e i suoi eredi", [
      "Il BIOS è un programma in un chip non volatile specifico di una data scheda madre, usato dal processore all'accensione",
      ["Le sue istruzioni e i suoi dati si dividono in", ["POST, power-on self test: controlla che i dispositivi funzionino", "SETUP: configurazione dei dispositivi", "BOOT: avvia il sistema operativo", "DRIVERS: funzioni di base di basso livello per tastiera, dischi e altri dispositivi"]],
      "I PC di oggi usano il firmware UEFI, che svolge gli stessi compiti",
      "Sull'ESP32-C6: un programma di avvio in ROM lancia un bootloader in flash, che lancia il firmware PRG32, che carica la cartuccia scelta",
    ], "Ogni stadio trova, controlla e avvia il successivo: una catena che termina con la prima istruzione di first_init.", { big: "boot", label: "dalla prima istruzione dopo il reset al vostro programma, attraverso strati di memoria permanente" }),

    H("Memorie non volatili", "Dalla ROM alla flash."),
    G("Dalla ROM alla flash", ["Memoria", "Scritta da", "Cancellata", "Uso tipico"], [
      ["ROM", "il costruttore, una volta per tutte", "mai", "codice di avvio, vecchie cartucce di gioco"],
      ["PROM", "l'utente, una volta", "mai", "piccole serie di produzione"],
      ["EPROM", "l'utente, molte volte", "tutta insieme, con luce ultravioletta attraverso una finestrella di quarzo (circa 15 minuti)", "sviluppo, BIOS dei primi PC"],
      ["EEPROM", "l'utente, sul posto", "elettricamente, un byte alla volta", "dati di configurazione"],
      ["Flash", "l'utente, sul posto", "elettricamente, a blocchi", "firmware, chiavette USB, schede di memoria, dischi a stato solido"],
    ], "Read-only memory, memoria di sola lettura; programmable ROM; erasable PROM; electrically erasable PROM. Tempo di accesso dell'ordine dei nanosecondi in lettura. EEPROM e flash sono più lente e, per bit, erano un tempo più care della RAM; la flash è oggi la memoria a semiconduttore più economica.", { widths: [1.6, 3.1, 4.2, 3.3] }),
    T("La memoria flash", [
      "Il tipo più recente di EEPROM: si riprogramma sul posto, senza rimuoverla",
      "Si cancella a blocchi di byte, non un byte alla volta: cancellare porta a 1 tutti i bit di un blocco, scrivere può solo trasformare degli 1 in 0",
      "Ogni blocco sopporta un numero limitato di cicli di cancellazione: il controllore distribuisce le scritture in modo uniforme",
      "La lettura è veloce; la scrittura e soprattutto la cancellazione sono lente",
      "La flash del kit contiene il firmware e le vostre cartucce: caricare una cartuccia cancella e riscrive alcuni dei suoi blocchi",
    ], "Ecco perché il punteggio migliore del riscaldamento non viene semplicemente riscritto nella cartuccia a ogni frame: la flash non è un posto per le variabili.", { img: "eprom.jpg", cap: "Una EPROM: la finestrella di quarzo permette alla luce ultravioletta di cancellare il chip" }),

    H("La cache", "Una memoria piccola e veloce davanti a una grande e lenta."),
    T("Perché una cache?", [
      "Durante i cicli di clock necessari a leggere o scrivere la memoria il processore aspetta",
      "Più la memoria è lenta, più cicli si perdono",
      ["Perché non costruire memorie veloci quanto i registri del processore?", ["dovrebbero stare sullo stesso chip: un collegamento attraverso un bus è più lento", "non potrebbero essere molto grandi, e il chip crescerebbe in dimensioni e costo"]],
      "Il compromesso: una memoria piccola e veloce sul chip del processore, e una o più memorie più grandi e più lente raggiunte attraverso il bus",
    ], "La domanda della slide originale: perché non costruire memorie veloci quanto i registri della CPU?", { big: "attesa", label: "ciò che fa un processore, per la maggior parte del tempo, quando la sua memoria è più lenta di lui" }),
    D("Come funziona una cache", (s, h) => {
      h.rows(s, [
        "Cache, dal francese cacher, nascondere: una memoria di piccola capacità ma veloce, posta tra il processore e la RAM",
        "Il processore guarda prima nella cache",
        "Hit: il contenuto dell'indirizzo richiesto c'è, e arriva subito",
        ["Miss: non c'è, e va copiato dalla RAM nella cache", ["con esso si copia un numero fisso di locazioni vicine, perché i programmi tendono a usare subito dopo indirizzi vicini"]],
        "Più hit ci sono, più breve è il tempo medio di accesso",
      ], h.MX, h.TOP, 7.0, h.BOT - h.TOP);
      const x = 8.6, y = h.TOP + 0.3;
      box11(s, h, "processore", x, y, 3.2, 0.8, P.teal, 16); box11(s, h, "cache\npiccola, veloce", x, y + 1.6, 3.2, 1.0, P.amber, 16); box11(s, h, "memoria centrale\ngrande, lenta", x, y + 3.4, 3.2, 1.2, P.violet, 16);
      h.arrow(s, x + 1.6, y + 0.83, x + 1.6, y + 1.57, P.mute, 2.5); h.arrow(s, x + 1.6, y + 2.63, x + 1.6, y + 3.37, P.mute, 2.5);
      h.tx(s, "a ogni accesso", { x: x + 1.75, y: y + 1.0, w: 2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute }); h.tx(s, "solo su un miss", { x: x + 1.75, y: y + 2.8, w: 2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute });
    }, "Il principio di località: un programma che ha appena usato un indirizzo probabilmente lo userà di nuovo presto (località temporale) e probabilmente userà i suoi vicini (località spaziale). La ragione sono i cicli e i vettori."),
    G("Livelli di cache e macchine tipiche", ["", "PC del 2002", "PC del 2020", "ESP32-C6 (il kit)"], [
      ["Processore", "1 core", "4 core", "1 core RISC-V, 160 MHz"],
      ["Cache L1", "64 KB", "64 KB per core", "nessuna per la SRAM"],
      ["Cache L2", "512 KB", "512 KB per core", "none"],
      ["Cache L3", "none", "8 MB, condivisa dai core", "none"],
      ["Memoria centrale", "256 MB", "16 GB", "512 KB di SRAM"],
      ["Memoria di massa", "disco rigido da 40 GB", "1 TB + 1 TB, in mirror", "pochi MB di flash, letti attraverso una piccola cache"],
    ], "Primo livello (interno): mantiene un flusso continuo dentro il processore. Secondo livello: limita il rallentamento dovuto alla memoria centrale. Terzo livello (da 8 a 32 MB e oltre): condiviso dai core dello stesso processore. Le cache sono fatte di SRAM. Sull'ESP32-C6 la SRAM è già veloce quanto serve al core; solo la flash esterna sta dietro una cache.", { widths: [2.2, 3, 3.4, 3.6] }),

    H("La memoria secondaria", "La memoria di massa."),
    T("Caratteristiche delle memorie secondarie", [
      "Non volatili: i dati non si perdono quando il calcolatore viene spento",
      "Grande capacità: diversi ordini di grandezza più della memoria centrale",
      "Basso costo per bit: diversi ordini di grandezza meno della memoria centrale",
      "Accesso più lento: alcuni ordini di grandezza più lento della memoria centrale",
      "L'informazione è organizzata in blocchi, di solito di un kilobyte o più, non in byte singoli",
      "Alcuni supporti permettono l'accesso diretto a qualunque blocco; altri solo l'accesso sequenziale",
    ], "La memoria secondaria memorizza e conserva tutti i programmi e i dati del calcolatore; la memoria centrale contiene i programmi in esecuzione e i dati che servono loro.", { img: "hard_disk.jpg", cap: "Un disco rigido aperto: piatto, braccio e testina" }),
    D("Dischi magnetici: tracce, settori, blocchi", async (s, h) => {
      h.card(s, h.MX, h.TOP, 5.5, h.BOT - h.TOP);
      await h.svg(s, diskSvg(), h.MX + 0.15, h.TOP + 0.3, 5.2, h.BOT - h.TOP - 0.6);
      h.rows(s, [
        "Piatti rivestiti di materiale magnetizzabile, tenuti in rotazione a velocità costante; le testine leggono e scrivono l'informazione",
        "La superficie è divisa in tracce concentriche e in settori, spicchi del disco",
        "Un settore taglia ogni traccia in blocchi: il blocco è la più piccola unità indirizzabile, identificata da numero di traccia e numero di settore",
        "Formattazione: la divisione della superficie in tracce e settori",
        "Accesso diretto: la testina si può posizionare su qualunque blocco senza passare su tutti i precedenti",
      ], 6.6, h.TOP, h.W - h.MX - 6.6, h.BOT - h.TOP);
    }, "Più settori formano un cluster; le tracce allo stesso raggio su tutti i piatti formano un cilindro. La figura originale è stata ridisegnata."),
    T("Tempo di accesso di un disco magnetico", [
      "Per leggere o scrivere un blocco la testina va portata all'indirizzo giusto; durante il trasferimento la testina è ferma e il disco si muove",
      ["Tempo di posizionamento (seek)", ["il tempo per spostare la testina in senso radiale sul cilindro giusto, e quindi sulla traccia giusta"]],
      ["Latenza", ["il tempo di attesa perché il settore desiderato passi sotto la testina"]],
      ["Tempo di trasferimento", ["il tempo perché il blocco passi sotto la testina"]],
      "Dischi rigidi: sigillati contro la polvere, capacità di terabyte, tempi di accesso di millisecondi",
    ], "Un millisecondo è un milione di nanosecondi: durante un accesso al disco un processore a 160 MHz potrebbe eseguire più di centomila istruzioni.", { big: "ms", label: "millisecondi: il tempo di accesso di un disco rigido, un milione di volte più lento della RAM" }),
    V("Dischi rigidi e dischi a stato solido",
      ["Disco rigido (HDD)", ["Piatti magnetici e testine mobili", "Tempo di accesso di millisecondi, dominato dalla meccanica", "Il costo più basso per terabyte", "Ancora la scelta per grandi archivi e backup"]],
      ["Disco a stato solido (SSD)", ["Memoria flash e un controllore: nessuna parte mobile", "Tempo di accesso di decine di microsecondi", "Collegato con SATA o, più veloce, con NVMe su PCI Express", "La memoria di massa standard di portatili e telefoni; la stessa tecnologia del chip flash del kit"]],
      "Novità rispetto alla presentazione originale, che citava gli SSD solo tra i livelli di memoria di massa. Il bus ATA parallelo dei vecchi PC ha ceduto il posto al Serial ATA e poi a NVMe."),

    H("Dischi ottici", "Bit letti con la luce."),
    T("Dischi ottici", [
      "Un disco rigido su cui si proietta un raggio laser di pochi milliwatt; la riflessione cambia tra le cavità, i pit, e la superficie, il land",
      ["0 e 1 non sono pit e land", ["1 è un cambiamento, da pit a land o da land a pit", "0 è nessun cambiamento"]],
      "Di solito scritti una volta sola, perché le modifiche fisiche sono irreversibili: usati per distribuire programmi e come archivi da non modificare",
      "CD registrabile: la registrazione brucia dei punti in uno strato di colorante; i dischi riscrivibili usano un materiale che può tornare indietro",
    ], "Codificare un 1 come transizione è un'idea autosincronizzante, usata anche in molti collegamenti seriali.", { img: "pit_land.jpg", cap: "Pit e land di un CD-ROM stampato, al microscopio elettronico" }),
    T("Il compact disc", [
      "L'informazione è memorizzata su un'unica traccia a spirale, con densità di registrazione costante",
      "La distanza tra due spire successive, il passo della traccia, è di 1,6 micrometri",
      ["CLV, velocità lineare costante", ["il disco gira più in fretta leggendo vicino al centro: da 200 a 500 giri al minuto"]],
      ["CAV, velocità angolare costante", ["giri costanti; il numero di bit per settore è costante, quindi la parte esterna è sottoutilizzata"]],
      "La velocità fu fissata dal flusso di bit necessario a riprodurre la musica",
    ], "1x = 1,2 m/s. CD registrabile: due strati di policarbonato racchiudono un sottile foglio riflettente coperto da un colorante traslucido.", { img: "cdrom_drive.jpg", cap: "L'interno di un lettore CD-ROM" }),
    G("DVD e CD a confronto", ["", "DVD", "CD"], [
      ["Diametro del disco", "120 mm", "120 mm"],
      ["Spessore del disco", "1,2 mm (0,6 mm x 2)", "1,2 mm"],
      ["Superfici / strati", "1 o 2 / 1 o 2", "1 / 1"],
      ["Dimensione minima del pit", "0,4 micrometri", "0,83 micrometri"],
      ["Passo della traccia", "0,74 micrometri", "1,6 micrometri"],
      ["Velocità media di trasferimento", "4,7 MB/s", "0,15 MB/s"],
      ["Capacità, 1 strato, 1 lato", "circa 5 GB", "circa 0,68 GB"],
      ["Capacità, 2 strati, 2 lati", "17 GB", "-"],
    ], "DVD: digital versatile disk. Pit più piccoli e una spirale più fitta, fino a due strati e due lati. Il DVD-R si scrive una volta sola; i lettori possono lavorare in CAV o in CLV. La tabella originale dava 3,058 micrometri come «larghezza di traccia» del CD; qui si usa il passo standard di 1,6, coerente con la slide precedente.", { widths: [3.4, 4.4, 4.4] }),

    H("La memoria di massa a più livelli"),
    F("Una memoria permanente a più livelli", [
      "RAM disk|un pezzo di memoria centrale usato come disco: il più veloce, volatile",
      "Disco a stato solido|flash: veloce, la memoria di lavoro",
      "Disco rigido|magnetico: grande ed economico",
      "Libreria di dischi|molti dischi, alcuni accesi solo quando servono",
      "Libreria a nastri|robot che montano nastri: il costo più basso per byte, per gli archivi",
    ], "Un sistema di calcolo moderno ha più livelli di memoria permanente, spesso gestiti in automatico: i dati usati spesso migrano verso i livelli veloci, il resto scende verso quelli economici.",
      "La stessa idea della cache, applicata alla memoria di massa. Lo storage HPC del Dipartimento funziona così (visita alla fine del corso)."),
    I("La memoria di massa su grande scala", [["storage_racks.jpg", "Una libreria di nastri in un centro di calcolo"], ["ssd.jpg", "Un disco a stato solido: memoria flash in forma di disco"], ["dvd_drive.jpg", "L'interno di un lettore DVD"]],
      "Immagini dalla presentazione originale.", "Da un chip di pochi megabyte sul kit a stanze di petabyte: la stessa gerarchia, a ogni scala."),

    Q("Quale memoria si può cancellare elettricamente, a blocchi, senza rimuoverla dalla scheda?", ["ROM", "PROM", "EPROM", "Flash"], 3, "La flash è l'evoluzione a blocchi della EEPROM. Alla EPROM serve la luce ultravioletta; ROM e PROM non si possono cancellare."),
    Q("Che cosa accade su un cache miss?", ["Il programma si ferma con un errore", "Il dato viene prelevato dalla memoria centrale e copiato nella cache, con i suoi vicini", "La cache viene cancellata", "Il processore salta l'istruzione"], 1, "L'accesso è semplicemente più lento: il blocco che contiene l'indirizzo viene caricato nella cache, scommettendo che presto serviranno indirizzi vicini."),
    Q("Quale componente del tempo di accesso di un disco rigido dipende dalla velocità di rotazione?", ["Il tempo di posizionamento", "La latenza", "Il tempo di formattazione", "Il tempo di avvio"], 1, "La latenza è l'attesa che il settore arrivi sotto la testina; il tempo di posizionamento dipende dal movimento del braccio."),
    Q("Su un disco ottico, un 1 è codificato come:", ["un pit", "un land", "una transizione tra pit e land", "un doppio pit"], 2, "Un cambio di riflettività, in un verso o nell'altro, è un 1; nessun cambio è uno 0."),
    X("Esercizi", [
      "Un disco gira a 7200 giri al minuto: qual è la sua latenza media?",
      "Una cache risponde in 1 ns e la memoria in 50 ns: qual è il tempo medio di accesso con il 95% di hit?",
      "Dite dove vive sul kit PRG32 ciascuno di questi: il codice di avvio, il firmware, una cartuccia, la variabile counter, il registro t0",
      "Trovate le specifiche della memoria di massa del vostro portatile o telefono: tecnologia, capacità, interfaccia",
      "Su PRG32 cronometrate due cicli che sommano un grande vettore: uno in ordine, uno a salti di passo ampio. C'è differenza, e perché su questo chip potrebbe non esserci?",
    ], "Latenza: mezzo giro, circa 4,2 ms. Tempo medio di accesso: 0,95 x 1 + 0,05 x 51 = 3,5 ns.",
      "60 / 7200 = 8,33 ms per giro. Esercizio 3: ROM, flash, flash (o RAM una volta caricata), SRAM, un registro di flip-flop nel processore. Esercizio 5: la SRAM dell'ESP32-C6 non ha una cache davanti, quindi l'ordine degli accessi conta poco; su un portatile la differenza è grande."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["motherboard", "scheda madre", "track / sector / block", "traccia / settore / blocco"],
      ["firmware", "firmware", "seek time", "tempo di posizionamento"],
      ["non-volatile", "non volatile", "latency", "tempo di latenza"],
      ["cache hit / miss", "successo / fallimento di cache", "solid-state disk", "disco a stato solido"],
      ["mass storage", "memoria di massa", "tape library", "libreria a nastri"],
    ], null, { widths: [3, 3.4, 3.2, 3.2] }),
    T("Conclusioni e letture", [
      "Le memorie non volatili contengono di solito il software di base di una macchina: il firmware",
      "La cache migliora le prestazioni tenendo vicino al processore una copia di parte della memoria centrale",
      "La stessa idea, un livello piccolo e veloce davanti a uno grande e lento, si riusa nei sistemi di memoria di massa",
      "Le memorie permanenti possono essere a semiconduttore (flash), magnetiche o ottiche",
      "Un sistema moderno ha più livelli di memoria permanente, spesso gestiti in automatico",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, paragrafi 5.1-5.4", "Stallings: Computer Organization and Architecture, i capitoli su cache e memoria esterna", "Tanenbaum, Austin: Architettura dei calcolatori. Un approccio strutturale, capitolo 2"]],
    ], "A seguire: Verm1, parte 3: un corpo, regole e stati. Poi il processore."),
  ],
});
