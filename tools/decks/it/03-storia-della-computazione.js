// Italian version of decks/en/03-history-of-computing.js: same slides, same listings, text in Italian.
// Lecture 03 - History of computing.
// Source: 01-Architettura_dei_Calcolatori-Storia_della_Computazione.pptx (translated, dates checked, RISC-V thread added).
Deck({
  n: "03", file: "03-Architettura_dei_Calcolatori-Storia_della_Computazione",
  title: "Storia della computazione", short: "Storia della computazione",
  sub: "Dall'abaco a un processore aperto che potete programmare da soli",
  quote: ['printf("Hello, world!");', "Brian Kernighan e Dennis Ritchie, The C Programming Language, 1978"], quoteMono: true,
  cover: "game_spaceinvaders.png",
  notes: "Gli studenti hanno già eseguito un programma RISC-V (Lezione 02). Questa lezione dice loro da dove viene quella macchina: ogni tappa della storia aggiunge un'idea che è ancora dentro l'ESP32-C6.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Definire l'informatica e dire perché non è la scienza dei computer",
      "Collocare su una linea del tempo macchine e persone chiave, dall'abaco al calcolatore a programma memorizzato",
      "Nominare le quattro unità dell'architettura di von Neumann e ritrovarle nella macchina programmata la volta scorsa",
      "Spiegare che cosa significa RISC e perché RISC-V è un insieme di istruzioni aperto",
      "Descrivere dove si colloca l'informatica tra scienza, ingegneria ed economia",
    ]),

    H("Che cos'è l'informatica?"),
    DEF("Una definizione", "Informatica", "La scienza applicata che si occupa del trattamento dell'informazione mediante procedure automatizzate.", [
      "Informatica, dal francese informatique: information automatique",
      "In inglese: computer science, e sempre più spesso informatics",
      "Lo strumento: elaboratore in italiano, ordinateur in francese, computer in inglese",
    ], "«L'informatica non riguarda i computer più di quanto l'astronomia riguardi i telescopi.» La slide successiva riporta la citazione."),
    B("L'informatica non riguarda i computer più di quanto l'astronomia riguardi i telescopi.", "Attribuita a Edsger W. Dijkstra", "La macchina è lo strumento, non l'oggetto di studio. In questo corso studiamo lo strumento da vicino proprio perché smetta di essere un mistero."),
    V("Due anime, una disciplina",
      ["Informatica teorica", ["I fondamenti teorici dell'informazione", "La computazione a livello logico: che cosa si può calcolare, e a quale costo", "Algoritmi: un insieme finito di operazioni che descrivono la trasformazione da A a B"]],
      ["Informatica applicata", ["Tecnologie abilitanti e sistemi informativi", "Pervasiva: motore dello sviluppo economico e del settore ICT", "Una disciplina STEM al centro di una rivoluzione industriale", "Con un costo sociale da governare: il divario digitale"]],
      "La nuvola di parole della slide originale: progettazione, analisi, linguaggi, sviluppo, basi di dati, reti, calcolo, multimedia, web, cloud, app, IoT, IA, machine learning, mobile, algoritmi, embedded, videogiochi, grafica, programmazione."),

    H("Prima dell'elettricità", "Tremila anni di macchine che aiutano a calcolare."),
    I("Le origini: l'abaco e la macchina di Anticitera", [
      ["abacus_roman.jpg", "Abaco romano tascabile: una rappresentazione fisica di dati e operazioni"],
      ["abacus_chinese.jpg", "Suanpan cinese: babilonesi, cinesi, greci e romani usavano tutti tavole per contare"],
      ["antikythera.jpg", "Macchina di Anticitera, II-I secolo a.C.: il più antico calcolatore a ingranaggi conosciuto"],
      ["antikythera_plate.jpg", "I suoi quadranti calcolavano posizioni astronomiche ed eclissi"],
    ], "La datazione della macchina di Anticitera è discussa: la maggior parte delle stime cade tra il 205 e il 60 a.C. circa.", "Un numero diventa una posizione di palline o l'angolo di un ingranaggio: la rappresentazione viene prima del calcolo."),
    T("Il mondo islamico medievale (dal IX al XIII secolo)", [
      ["Strumenti astronomici", ["l'astrolabio meccanico; il torqueto"]],
      ["Un contributo alla crittografia", ["crittoanalisi e analisi delle frequenze (al-Kindi, IX secolo)"]],
      ["Macchine programmabili", ["il flautista automatico dei fratelli Banu Musa", "gli orologi a pesi e gli automi di al-Jazari (1206)"]],
      "La parola algoritmo viene dal nome di al-Khwarizmi, come algebra viene dal titolo del suo libro",
    ], "La slide originale datava il periodo all'XI-XII secolo; le persone qui nominate vanno dal IX all'inizio del XIII.", { img: "astrolabe.jpg", cap: "Un astrolabio in ottone" }),
    T("Dal 1600 al 1800: calcolatrici meccaniche e logica", [
      ["Le prime calcolatrici meccaniche", ["tavole dei logaritmi (Nepero, 1614)", "la Pascalina di Blaise Pascal (1642): addizione con riporto", "la calcolatrice a scatti di Leibniz (1673): le quattro operazioni"]],
      ["Logica e matematica formale", ["Leibniz descrive l'aritmetica binaria (1703)", "George Boole, The Laws of Thought (1854): la logica diventa algebra"]],
      ["Macchine programmabili", ["il telaio di Jacquard (1804): il disegno è memorizzato su schede perforate"]],
    ], "Correzioni alla slide originale: The Laws of Thought di Boole è del 1854 (non 1864); il saggio di Leibniz sull'aritmetica binaria fu pubblicato nel 1703.", { img: "pascaline.jpg", cap: "Una Pascalina: ogni ruota è una cifra decimale" }),
    I("L'Ottocento: Charles Babbage e Ada Lovelace", [
      ["difference_engine.jpg", "Macchina alle differenze: calcolo automatico di tavole matematiche"],
      ["analytical_engine.jpg", "Macchina analitica: un mulino (unità aritmetica), un'unità di controllo, un magazzino (memoria) e un dispositivo di uscita"],
      ["punched_cards.jpg", "Programmi e dati su schede perforate, prese in prestito dal telaio di Jacquard"],
    ], "Le note di Ada Lovelace sulla macchina analitica (1843) contengono quello che è considerato il primo programma pubblicato, per il calcolo dei numeri di Bernoulli.",
      "Ada Lovelace ideò un metodo per programmare la macchina analitica: è considerata la prima programmatrice della storia."),

    H("Il Novecento", "L'idea di una macchina universale, e le macchine che l'hanno resa reale."),
    T("Prima la teoria: Turing, Shannon e Nakajima", [
      ["Alan Turing", ["1936: una macchina universale astratta definisce che cosa si può calcolare", "a Bletchley Park lavora alla decifrazione del cifrario tedesco Enigma"]],
      ["Akira Nakajima e Claude Shannon", ["teoria dei circuiti a commutazione (anni Trenta): l'algebra di Boole descrive i circuiti di interruttori", "il principio su cui poggia tutta la progettazione digitale"]],
      ["Konrad Zuse", ["Z3 (1941): il primo calcolatore funzionante controllato da programma", "dimostrato Turing-completo nel 1998", "Z4: uno dei primi calcolatori venduti commercialmente"]],
    ], "L'algebra di Boole delle Lezioni 08 e 09 è esattamente il ponte di Nakajima e Shannon tra logica e circuiti.", { img: "enigma.jpg", cap: "Una macchina cifrante Enigma" }),
    D("John von Neumann: il programma memorizzato", (s, h) => {
      h.rows(s, [
        "Un'architettura hardware per calcolatori digitali programmabili (rapporto EDVAC, 1945)",
        "Programma e dati condividono la stessa memoria: un programma è un dato",
        ["Quattro unità essenziali", ["unità di controllo: governa la sequenza delle operazioni", "unità aritmetico-logica (ALU), con il suo registro accumulatore", "memoria", "ingresso e uscita"]],
        "L'ESP32-C6 che avete programmato è ancora una macchina di von Neumann",
      ], h.MX, h.TOP, 6.8, h.BOT - h.TOP);
      const x = 8.0, bw = 2.1, g = 0.35, w = 2 * bw + g, box = (t, bx, by, bw2, bh, col) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.08, x: bx, y: by, w: bw2, h: bh,
        fill: { color: col }, line: { color: col, width: 0 }, color: P.white, bold: true, fontFace: h.BODY, fontSize: 16, align: "center", valign: "middle", margin: 4 });
      h.card(s, x - 0.2, h.TOP, w + 0.4, h.BOT - h.TOP);
      box("Memoria\nprogramma e dati", x, h.TOP + 0.3, w, 1.0, P.steel);
      box("Unità di\ncontrollo", x, h.TOP + 2.0, bw, 1.5, P.teal);
      box("ALU\n(accumulatore)", x + bw + g, h.TOP + 2.0, bw, 1.5, P.amber);
      box("Ingresso", x, h.TOP + 4.1, bw, 0.8, P.green);
      box("Uscita", x + bw + g, h.TOP + 4.1, bw, 0.8, P.green);
      const c1 = x + bw / 2, c2 = x + bw + g + bw / 2;
      h.arrow(s, c1, h.TOP + 1.95, c1, h.TOP + 1.35, P.mute, 2); h.arrow(s, c2, h.TOP + 1.35, c2, h.TOP + 1.95, P.mute, 2);
      h.arrow(s, x + bw + 0.03, h.TOP + 2.75, x + bw + g - 0.03, h.TOP + 2.75, P.mute, 2);
      h.arrow(s, c1, h.TOP + 4.05, c1, h.TOP + 3.55, P.mute, 2); h.arrow(s, c2, h.TOP + 3.55, c2, h.TOP + 4.05, P.mute, 2);
    }, "Ritrovare le quattro unità nella Lezione 02: i registri e la ALU hanno eseguito addi; la memoria conteneva counter e le istruzioni stesse (0x00130313); il joystick e il display sono ingresso e uscita."),
    D("Otto decenni di calcolatori", (s, h) => {
      const dec = [["'40", "La guerra", "eniac.png", "ENIAC, Colossus"], ["'50", "Militari e governi", "edvac.jpg", "EDVAC, 1949"], ["'60", "L'era dei mainframe", "mainframe.jpg", "una macchina, molti utenti"],
        ["'70", "Minicomputer", "minicomputer.jpg", "un calcolatore per reparto"], ["'80", "Personal computer", "c64.jpg", "un calcolatore a persona"], ["'90", "Internet", "network.jpg", "i calcolatori si collegano"],
        ["'00", "Smartphone e tablet", "iphone.jpg", "un calcolatore in tasca"], ["'10", "Cloud computing", "datacenter.jpg", "il calcolo come servizio"], ["'20", "IoT e IA", "smart_speaker.jpg", "calcolatori ovunque"]];
      const n = dec.length, g = 0.12, w = (h.CW - g * (n - 1)) / n;
      h.line(s, h.MX, 4.02, h.W - h.MX, 4.02, P.rule, 3);
      dec.forEach(([d, name, im, cap], i) => {
        const x = h.MX + i * (w + g);
        h.card(s, x, h.TOP, w, 1.9);
        h.img(s, im, x + 0.08, h.TOP + 0.08, w - 0.16, 1.74);
        h.pill(s, d, x + w / 2 - 0.42, 3.72, 0.84, 0.6, h.TINTS[i % 6], 19);
        h.tx(s, name, { x, y: 4.5, w, h: 0.85, fontSize: 14.5, bold: true, color: P.steel, align: "center", valign: "middle" });
        h.tx(s, cap, { x, y: 5.4, w, h: 0.8, fontSize: 12.5, color: P.mute, align: "center" });
      });
      h.tx(s, "Ogni decennio ha reso il calcolatore più piccolo, più economico e più vicino alle persone; nessuno ha cambiato l'idea del programma memorizzato.", { x: h.MX, y: 6.25, w: h.CW, h: 0.5, fontSize: 16, italic: true, valign: "middle" });
    }, "1943-45: ENIAC (USA) e Colossus (Regno Unito). 1949: EDVAC (USA). La slide originale mostrava anche il Macintosh, l'Amiga, il PC IBM, l'iPad e un'auto a guida autonoma: le immagini sono in tools/assets, se si vogliono aggiungere."),

    H("Dagli home computer a RISC-V", "Perché il processore del vostro kit è fatto così."),
    G("Microprocessori: da CISC a RISC a uno standard aperto", ["Anno", "Tappa", "Perché conta"], [
      ["1971", "Intel 4004", "il primo microprocessore commerciale: 2300 transistor su un chip"],
      ["1975", "MOS 6502", "una CPU a 8 bit economica: Apple II, Commodore 64, l'era degli home computer"],
      ["1978", "Intel 8086", "l'inizio di x86, un insieme di istruzioni complesso (CISC) ancora nei PC di oggi"],
      ["1980-82", "RISC di Berkeley e MIPS di Stanford", "poche istruzioni, semplici e regolari, sono più veloci: l'idea RISC"],
      ["1985", "ARM1", "RISC a basso consumo: oggi in quasi tutti i telefoni"],
      ["2010", "RISC-V nasce a UC Berkeley", "il quinto progetto RISC di Berkeley diventa un insieme di istruzioni aperto"],
      ["2015-20", "RISC-V Foundation, poi RISC-V International", "una specifica condivisa, governata dalla Svizzera"],
      ["2023-25", "Chips Act europeo; progetto DARE", "RISC-V come strategia per la sovranità tecnologica europea"],
    ], "RISC = Reduced Instruction Set Computer; CISC = Complex Instruction Set Computer. Patterson e Hennessy hanno ricevuto il Premio Turing 2017 per l'approccio RISC. Questa slide è nuova rispetto alla presentazione degli anni precedenti.", { widths: [1.3, 4.2, 6.7] }),
    T("La legge di Moore in un numero", [
      "1971: l'Intel 4004 ha 2300 transistor",
      "Oggi il processore di un portatile ne ha decine di miliardi",
      "Per cinquant'anni il numero di transistor su un chip è raddoppiato circa ogni due anni",
      "I limiti fisici sono ormai vicini: il progresso viene da architetture migliori, acceleratori specializzati e progetti aperti",
      "Ecco perché l'architettura, l'argomento di questo corso, conta più che mai",
    ], "L'osservazione di Gordon Moore è del 1965 (rivista nel 1975). Non presentarla come una legge di natura.", { big: "x 10.000.000", label: "la crescita dei transistor per chip dall'Intel 4004 (1971) al processore di un portatile attuale" }),
    G("Lo spirito degli home computer, su una CPU aperta", ["", "Commodore 64 (1982), MOS 6510", "PRG32 su ESP32-C6, RISC-V"], [
      ["Parola", "8 bit", "32 bit"],
      ["Registri", "A, X, Y (più puntatore allo stack, stato, PC)", "32 registri di uso generale, da x0 a x31"],
      ["Clock", "circa 1 MHz", "160 MHz"],
      ["Spazio di indirizzamento", "64 KB", "4 GB"],
      ["Insieme di istruzioni", "56 istruzioni, proprietario", "circa 40 istruzioni di base più estensioni, standard aperto"],
      ["Schermo", "320 per 200 pixel, 16 colori", "area di 320 per 200, tavolozza RGB565 di 256 colori"],
      ["Si programma", "scrivendo sulla macchina stessa", "compilando una cartuccia e caricandola"],
    ], "La presentazione originale finiva con il simulatore easy6502 (skilldrick.github.io/easy6502), ancora una visita piacevole. PRG32 conserva la stessa immediatezza, 320 per 200 compresi, sull'architettura che gli studenti incontreranno nell'industria.", { widths: [2.4, 4.6, 5.2], caption: "Stesso schermo, stessa immediatezza: a quarant'anni di distanza. Il 6502 si esplora ancora su skilldrick.github.io/easy6502" }),
    I("I giochi rétro come esemplari", [["game_pong.png", "Pong"], ["game_breakout.png", "Breakout"], ["game_tetris.png", "Tetris"], ["game_asteroids.png", "Asteroids"]],
      "Tutti e quattro sono cartucce di esempio nel repository di PRG32 (examples/games).", "Un gioco rétro è abbastanza piccolo da stare in una testa e abbastanza ricco da esercitare stato, ingresso, aritmetica, decisioni e un ciclo: l'intero corso."),

    H("L'informatica come scienza applicata"),
    F("Dove si colloca l'informatica", [
      "Fenomeno naturale|una tempesta si forma sul mare",
      "Scienze di base|fisica e matematica la descrivono con equazioni",
      "Scienze applicate|l'informatica trasforma le equazioni in algoritmi e simulazioni",
      "Ingegneria|supercalcolatori, reti e sensori li eseguono in modo affidabile",
      "Economia|previsioni e servizi raggiungono le persone e creano valore",
    ], "Un esempio di questo Dipartimento: le previsioni meteo-marine di meteo.uniparthenope.it, calcolate ogni giorno sui nostri sistemi ad alte prestazioni.",
      "La slide originale mostrava ritratti e immagini per ogni stadio (equazioni, mappe di previsione, un uragano, l'app mobile)."),
    I("Il calcolo ad alte prestazioni alla Parthenope", [
      ["cluster_1.jpg", "Un cluster didattico: mini PC con GPU su una rete a 10 Gbit"],
      ["cluster_2.jpg", "Lo stesso cluster che esegue una simulazione parallela"],
      ["rcf_page.png", "Research Computing Facilities: rcf.uniparthenope.it"],
    ], "L'evento di chiusura del corso comprende una visita ai sistemi di supercalcolo del Dipartimento.", "Le stesse idee che esercitate su un microcontrollore a 160 MHz si ritrovano nei cluster: registri, memoria, istruzioni, soltanto in numero molto maggiore."),

    Q("Quale idea è il cuore dell'architettura di von Neumann?", ["Il processore ha esattamente quattro registri", "Programma e dati stanno nella stessa memoria", "Ogni istruzione dura un ciclo di clock", "Ingresso e uscita sono facoltativi"], 1, "Il concetto di programma memorizzato: le istruzioni sono dati in memoria, prelevati ed eseguiti uno dopo l'altro."),
    Q("Che cosa distingue RISC-V da x86 e ARM?", ["È l'insieme di istruzioni più veloce", "È stata la prima architettura RISC", "Il suo insieme di istruzioni è uno standard aperto, libero da realizzare", "Funziona solo sui microcontrollori"], 2, "RISC-V è un'architettura a standard aperto; chiunque può progettare e vendere un processore RISC-V senza licenza sull'architettura. Non è stata la prima RISC (RISC di Berkeley, MIPS e ARM sono precedenti)."),
    Q("Chi è considerato il primo programmatore della storia?", ["Charles Babbage", "Alan Turing", "Ada Lovelace", "Konrad Zuse"], 2, "Ada Lovelace, per le sue note del 1843 sulla macchina analitica."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Disegnate le quattro unità dell'architettura di von Neumann e scrivete, dentro ciascuna, una cosa del programma della Lezione 02 che vi risiede o vi accade",
      "Per ciascuno dite se è un modo nuovo di rappresentare l'informazione o di prescrivere operazioni: l'abaco, il telaio di Jacquard, la Pascalina, l'algebra di Boole, le schede perforate della macchina analitica, il programma memorizzato",
      "Scaricate dallo Store due dei quattro giochi rétro, o compilateli da examples/games; con i contatori del debugger trovate quante istruzioni esegue ciascuno per frame, e confrontate",
    ], "Registri e ALU: l'esecuzione di addi. Memoria: counter e le istruzioni stesse. Unità di controllo: il prelievo di ogni istruzione. Ingresso/uscita: la barra sullo schermo.",
      "Rappresentare: abaco, Pascalina (cifre come posizioni di ruote), algebra di Boole. Prescrivere: il telaio di Jacquard, le schede della macchina analitica, il programma memorizzato, che unifica le due cose: un programma è esso stesso informazione rappresentata. Il terzo esercizio non ha una risposta fissa: i contatori dipendono dal gioco e dal momento."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["computer science / informatics", "informatica", "stored program", "programma memorizzato"],
      ["computer", "calcolatore, elaboratore", "control unit", "unità di controllo"],
      ["punched card", "scheda perforata", "arithmetic logic unit", "unità aritmetico-logica"],
      ["loom", "telaio", "instruction set", "insieme (set) di istruzioni"],
      ["mainframe", "mainframe, grande elaboratore", "high-performance computing", "calcolo ad alte prestazioni"],
    ], null, { widths: [3.4, 3, 3.2, 3] }),
    T("Conclusioni e letture", [
      "Il calcolo è più antico dell'elettronica: rappresentazione e procedura sono venute prima",
      "Il calcolatore a programma memorizzato del 1945 è ancora la macchina che programmiamo oggi",
      "RISC ha reso i processori abbastanza semplici da capirli per intero; RISC-V li ha resi aperti",
      "L'informatica è pervasiva: l'informazione digitale appartiene a ogni campo, i dati ne sono la moneta, gli algoritmi trasformano i dati in decisioni",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, capitolo 1", "Playing with RISC-V, capitolo 1: Why a Game, Why RISC-V, Why Now", "Charles Petzold: Code. The Hidden Language of Computer Hardware and Software"]],
    ], "Prossima lezione: come l'informazione diventa bit."),
  ],
});
