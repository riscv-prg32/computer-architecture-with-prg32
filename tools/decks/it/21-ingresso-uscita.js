// Italian version of decks/en/21-input-output.js: same slides, same listings, text in Italian.
// Lecture 21 - Input and output devices: displays, keyboard, mouse, printers, and the joystick of the kit.
// Source: 17-Architettura_dei_Calcolatori-Input-Output-Video-Tastiera-Mouse-Stampante.pptx (translated, updated, PRG32 links added).
const box13 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

Deck({
  n: "21", file: "21-Architettura_dei_Calcolatori-Ingresso_Uscita",
  title: "Ingresso e uscita", short: "Ingresso e uscita",
  sub: "Display, tastiere, mouse e stampanti: come la macchina incontra il mondo, e come un programma legge un pulsante",
  quote: ["Need input!", "Numero 5, nel film Corto circuito (Short Circuit), John Badham, 1986"],
  cover: "lab2_step1_lamps.png",
  notes: "Spirale: gli studenti leggono il joystick fin dai primi laboratori; la lezione si apre chiedendo che cosa c'è dietro prg32_input_read, poi tratta i dispositivi classici e i tre modi in cui un processore può gestirli.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Descrivere come si forma un'immagine su un CRT e su un LCD, e che cosa aggiunge una matrice attiva TFT",
      "Spiegare il percorso della pressione di un tasto: matrice, codificatore, registro a scorrimento, interfaccia seriale",
      "Dire che cosa invia un mouse al calcolatore e con quale frequenza",
      "Descrivere le fasi della stampa laser",
      "Spiegare come il kit PRG32 legge il joystick, e confrontare polling, interruzioni e DMA",
    ]),

    H("Riscaldamento sulla macchina", "Che cosa c'è dietro un pulsante?"),
    K("Leggere il mondo, una volta per frame", `steer_update:
    addi sp, sp, -16
    sw   ra, 12(sp)

    sw   s0, 8(sp)

    call prg32_input_read      # a0 = one bit per button
    mv   s0, a0                # keep it in a saved register

    andi t0, s0, 0x10          # button A
    beqz t0, 1f
    li   a0, 0                 # channel
    li   a1, 0                 # instrument
    li   a2, 69                # note: A4, 440 Hz
    li   a3, 255               # volume
    li   a4, 120               # milliseconds
    call prg32_audio_note
1:  andi t0, s0, 0x01          # LEFT: s0 survived the call
    beqz t0, 2f
    ...                        # move left
2:  ...`, [
      "Ogni pulsante è un interruttore su un piedino di ingresso del chip: premuto o rilasciato, un bit",
      "Il runtime legge i piedini e li impacchetta in una parola: una rappresentazione decodificata (Lezione 11)",
      "Il vostro gioco chiede una volta per frame: questo è il polling",
      "Una tastiera ha cento tasti, un mouse si muove in due dimensioni, un display ha migliaia di pixel: come parlano con un processore?",
    ], "Dal capitolo 6 del libro, dal laboratorio 06 e dall'esempio sonoro del capitolo finale (examples/asm_capstone/audio_note_event.S). Compilato come cartuccia ed eseguito sul runner headless di PRG32-QT (tools/tests): il marcatore si muove con LEFT anche mentre A suona la nota, perché la maschera è conservata in s0, un registro salvato; in t0 andrebbe persa alla chiamata. I piedini sono registri GPIO mappati in memoria (Lezione 15), configurati come ingressi, cioè con i buffer di uscita in alta impedenza (Lezione 14)."),

    H("I display", "Dal tubo a raggi catodici ai cristalli liquidi."),
    T("Il video: un'introduzione", [
      "All'inizio soprattutto display a caratteri in bianco e nero; oggi grafici e a colori",
      "Un display grafico è una matrice di punti, i pixel, ciascuno acceso con un'intensità diversa",
      "Un'immagine si compone accendendo e spegnendo i pixel",
      "Una diversa densità di pixel dà una diversa risoluzione; i colori vanno da 256 (8 bit) a 16 milioni (24 bit) e oltre",
      "La dimensione si misura in pollici lungo la diagonale: un display da 14 pollici ha una diagonale di 14 pollici",
    ], "Il display del kit PRG32: 2,8 pollici, 320 per 240 pixel, 65.536 colori.", { img: "mac_classic.jpg", cap: "Un Macintosh compatto: un CRT in bianco e nero da 9 pollici" }),
    G("Il tubo a raggi catodici: una breve storia", ["Anno", "Chi", "Che cosa"], [
      ["primi anni 1870", "William Crookes", "il tubo di Crookes: il primo tubo a raggi catodici, uno strumento di laboratorio"],
      ["1897", "Karl Ferdinand Braun", "il tubo di Braun e il primo oscilloscopio a raggi catodici: la prima applicazione pratica"],
      ["1907", "Boris Rosing", "un CRT mostra semplici forme geometriche da un segnale video ricevuto: la radice della televisione"],
      ["1934", "Telefunken", "il primo televisore con CRT sul mercato, in Germania"],
      ["anni 1970-1990", "l'industria informatica", "il monitor CRT: il display di ogni terminale e personal computer"],
    ], "L'ultima riga riassume l'epoca che la presentazione originale illustrava con le immagini di un oscilloscopio e del cabinato di Asteroids (un display vettoriale pilotato da un 6502).", { widths: [1.8, 3, 7.4] }),
    T("Come funziona un CRT", [
      "Il catodo è un piccolo elemento metallico riscaldato fino all'incandescenza, che emette elettroni per effetto termoionico",
      "Dentro il tubo gli elettroni sono convogliati in un fascio da un'alta differenza di potenziale tra catodo e anodo",
      "Altri campi elettromagnetici mettono a fuoco il fascio",
      ["Il fascio, il pennello elettronico, viene deflesso", ["da campi magnetici (la forza di Lorentz), o da campi elettrici"]],
      "Colpisce un punto della superficie interna dello schermo, rivestita di fosforo, che si illumina",
      "Facendo scorrere il fascio riga per riga, molte volte al secondo, si dipinge l'immagine",
    ], "Lo schema originale aveva le etichette in italiano: griglia, anodo, bobina di deflessione, riscaldatore, catodo, fascio, bobina di focalizzazione, schermo fluorescente.", { img: "crt_scope.jpg", cap: "Un oscilloscopio a raggi catodici usato come display" }),
    T("I display a cristalli liquidi", [
      "I monitor LCD hanno sostituito quasi del tutto il tubo a raggi catodici",
      "Vantaggi: immagine migliore; meno ingombro, peso e consumo; minore affaticamento della vista",
      "I cristalli liquidi sono molecole organiche viscose che scorrono come un liquido ma hanno una struttura spaziale",
      "Un campo elettrico cambia l'orientamento delle molecole, e con esso le proprietà ottiche del cristallo: l'angolo di polarizzazione della luce che lo attraversa",
      "Un cristallo è una valvola per la luce, aperta e chiusa da una tensione",
    ], "LCD: liquid crystal display, display a cristalli liquidi.", { img: "lcd_layers.jpg", cap: "Gli strati di un display a cristalli liquidi" }),
    T("Dentro un pannello LCD", [
      "Lo schermo è fatto di molte celle, spesso una per pixel, in cui sono intrappolati i cristalli liquidi",
      "Ogni cella ha contatti elettrici, così che si possa applicare un campo al liquido che contiene",
      "Le celle stanno tra due filtri polarizzatori con gli assi perpendicolari tra loro, con una luce dietro quello posteriore",
      ["La polarizzazione decide se la luce passa", ["cristalli non pilotati: la luce viene ruotata e attraversa il polarizzatore anteriore", "cristalli pilotati: la luce è bloccata del tutto"]],
      "In uno schermo a colori ogni cella è divisa in tre sezioni con un filtro rosso, uno verde e uno blu",
    ], "Tre sub-pixel per pixel: i campi R, G e B del colore RGB565 della Lezione 04 finiscono qui, come tre tensioni.", { img: "lcd_pixels.jpg", cap: "Sub-pixel rossi, verdi e blu sotto la lente" }),
    V("Pilotare le celle: dai segmenti alla matrice attiva",
      ["Segmenti e matrice passiva", ["Calcolatrici e orologi digitali: un contatto elettrico per segmento", "Impossibile quando il numero di elementi cresce", "Matrice passiva: un gruppo di contatti per riga e per colonna, non per pixel", "Si pilota un solo pixel alla volta: gli altri devono ricordare il proprio stato", "Problemi: persistenza (scie dietro gli oggetti in movimento) e diafonia"]],
      ["Matrice attiva: TFT", ["Usata per gli schermi ad alta risoluzione", "Il pannello contiene un film sottile di transistor, su uno strato semiconduttore trasparente", "Il campo è applicato esattamente dove serve da un transistor in ogni cella", "Il transistor conserva lo stato elettrico del suo pixel mentre gli altri vengono aggiornati", "Ogni pixel è, di fatto, una cella di memoria analogica"]],
      "TFT: thin-film transistor, transistor a film sottile. Il display del kit è un pannello TFT con un controller ILI9341. Novità rispetto alla presentazione originale: i display OLED, in cui ogni pixel emette luce propria e non serve retroilluminazione."),

    H("Tastiera e mouse"),
    T("La tastiera", [
      "Derivata da quella delle macchine per scrivere; il principale dispositivo di ingresso per i caratteri",
      ["I suoi tasti sono raggruppati", ["tasti alfanumerici", "tasti speciali: invio, backspace, ...", "tasti freccia e tasti funzione"]],
      "Tastiera e video non sono collegati direttamente tra loro",
      "È il processore a riprodurre sul video le informazioni battute sulla tastiera",
      "Le tastiere di oggi si collegano via USB, o senza fili",
    ], "PS/2 era il connettore standard prima di USB. L'eco di un tasto sullo schermo è un programma: leggi un codice, disegna un carattere."),
    D("Il percorso della pressione di un tasto", (s, h) => {
      const y = h.TOP + 0.2, keys = ["Q", "W", "E", "R", "T", "Y", "A", "S", "D", "F", "G", "H", "Z", "X", "C", "V", "B", "N"];
      keys.forEach((k, i) => s.addText(k, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.05, x: h.MX + (i % 6) * 0.62 + Math.floor(i / 6) * 0.2, y: y + Math.floor(i / 6) * 0.62, w: 0.54, h: 0.54,
        fill: { color: k === "D" ? P.amber : P.steel }, line: { color: P.white, width: 0 }, color: P.white, bold: true, fontFace: h.MONO, fontSize: 15, align: "center", valign: "middle", margin: 0 }));
      h.tx(s, "righe e colonne di interruttori", { x: h.MX, y: y + 1.9, w: 4.2, h: 0.3, fontSize: 12.5, italic: true, color: P.mute });
      const bx = 5.0, bw = 2.35;
      [["codificatore", "da riga e colonna\na un codice di n bit", P.teal], ["registro a scorrimento", "da n bit in parallelo\na n bit in serie", P.violet], ["interfaccia seriale", "per esempio\nun controller USB", P.green]].forEach(([t, d, c], i) => {
        const x = bx + i * (bw + 0.35);
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y: y + 0.2, w: bw, h: 1.3, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        h.arrow(s, x - 0.33, y + 0.85, x - 0.03, y + 0.85, P.mute, 2.5); });
      h.arrow(s, bx + 2 * (bw + 0.35) + bw / 2, y + 1.53, bx + 2 * (bw + 0.35) + bw / 2, y + 2.25, P.mute, 2.5);
      h.line(s, bx, y + 2.3, h.W - h.MX, y + 2.3, P.amber, 6); h.tx(s, "bus di sistema", { x: bx, y: y + 2.4, w: 2, h: 0.3, fontSize: 13, bold: true, color: P.amber });
      h.rows(s, [
        "La tastiera è gestita da un controller della tastiera",
        "Il codificatore trasforma una combinazione di riga e colonna in un codice di n bit: il codificatore della Lezione 11",
        "Il registro a scorrimento trasforma gli n bit in una sequenza, da trattare in serie: il registro a scorrimento della Lezione 14",
        "L'interfaccia seriale invia il codice al bus di sistema nel modo dovuto, e alza un'interruzione",
      ], h.MX, 4.7, h.CW, 2.05);
    }, "Ogni blocco di questa slide è una macchina che gli studenti hanno già progettato: è il frutto delle Lezioni dalla 11 alla 14."),
    T("Il mouse", [
      "Inventato negli anni Sessanta da Douglas Engelbart: il primo dispositivo di puntamento della storia",
      "Una scatola di legno con due ruote sotto e un filo che esce da dietro, come la coda di un topo",
      "Le due ruote rilevavano i movimenti lungo l'asse orizzontale e quello verticale; l'elettronica li trasformava in segnali elettrici",
      "Mouse meccanico: una pallina fa girare due rulli, ciascuno collegato a un contatore",
      "Mouse ottico: una sorgente di luce e una minuscola telecamera misurano il movimento della superficie sottostante",
    ], "La presentazione originale data il mouse al 1967, l'anno di deposito del brevetto; il primo prototipo è del 1964 e la celebre dimostrazione pubblica del 1968. Contatori: le macchine sequenziali della Lezione 13."),
    D("Che cosa invia un mouse", (s, h) => {
      h.rows(s, [
        "Ogni volta che si sposta di una distanza minima, circa un centesimo di pollice, detta mickey, il mouse invia tre byte",
        "Byte 1: di quante unità si è spostato lungo x dall'ultimo rapporto",
        "Byte 2: lo spostamento lungo y",
        "Byte 3: lo stato dei pulsanti",
        "Il software di controllo, il driver di periferica, sovrintende alla comunicazione con il processore",
      ], h.MX, h.TOP, 7.2, h.BOT - h.TOP);
      const x = 8.4, y = h.TOP + 0.5;
      [["due contatori", "spostamento in x e in y", P.teal], ["registro a scorrimento", "tre byte, in serie", P.violet], ["interfaccia seriale", "controller USB", P.green]].forEach(([t, d, c], i) => {
        s.addText([{ text: t, options: { bold: true, fontSize: 15, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y: y + i * 1.4, w: 3.6, h: 1.0, fill: { color: c }, line: { color: c, width: 0 }, color: P.white, fontFace: h.BODY, align: "center", valign: "middle", margin: 3 });
        if (i < 2) h.arrow(s, x + 1.8, y + i * 1.4 + 1.03, x + 1.8, y + (i + 1) * 1.4 - 0.03, P.mute, 2.5); });
      h.mem(s, x, y + 4.3, 1.2, [{ val: "dx", color: P.teal }, { val: "dy", color: P.teal }, { val: "pulsanti", color: P.amber }], { h: 0.6, fs: 14 });
    }, "La presentazione originale dice che il primo byte riporta lo spostamento «negli ultimi 100 millisecondi»; i mouse moderni riferiscono fino a mille volte al secondo. I byte di spostamento con segno sono numeri in complemento a due (Lezione 05)."),

    H("Le stampanti"),
    T("La stampante", [
      "Un dispositivo di uscita che stampa informazioni su carta",
      "Velocità di stampa: righe al minuto, caratteri al secondo o pagine al minuto",
      "Risoluzione, la qualità di stampa: punti per pollice",
      ["Tipi", ["a margherita e a catena, ormai in disuso", "ad aghi: gli aghi colpiscono un nastro inchiostrato", "a getto d'inchiostro: minuscole gocce di inchiostro", "laser"]],
      "Una stampante è anche un piccolo calcolatore: ha processore, memoria e firmware propri",
    ], "In inglese: daisy wheel, chain, dot matrix, ink jet, laser."),
    T("La stampante laser", [
      "Deriva dalla fotocopiatrice",
      "Un tamburo viene caricato elettricamente, a circa 1.000 volt",
      "Un raggio laser, riflesso da uno specchio rotante, scandisce il tamburo per la sua lunghezza; il raggio è modulato per produrre una trama di punti chiari e scuri",
      "I punti colpiti dal raggio perdono la carica; dopo ogni riga il tamburo ruota di una frazione di grado",
      "Il toner è attratto dai punti ancora carichi: si forma un'immagine della riga",
      "Il tamburo viene premuto contro la carta e vi trasferisce il toner; rulli riscaldati lo fissano in modo permanente; il tamburo viene scaricato e pulito",
    ], "Tre slide dell'originale sono fuse in una. La pagina viene prima costruita come bitmap nella memoria della stampante: un frame buffer per la carta.", { img: "laser_printer.jpg", cap: "Il percorso della carta in una stampante laser" }),

    H("Ritorno alla macchina", "Ingresso e uscita sul kit, e tre modi di realizzarli."),
    G("I dispositivi del kit PRG32", ["Dispositivo", "Direzione", "Come è collegato", "Come lo usa una cartuccia"], [
      ["joystick e pulsanti", "ingresso", "un interruttore per piedino di ingresso (GPIO)", "prg32_input_read: un bit per pulsante"],
      ["display, TFT 320 x 240", "uscita", "bus seriale SPI, con DMA", "le chiamate prg32_gfx_* disegnano nel frame buffer"],
      ["amplificatore e altoparlante", "uscita", "bus seriale I2S", "chiamate prg32_audio_*: note, campioni, musica"],
      ["radio Wi-Fi", "ingresso e uscita", "dentro il chip", "caricamento delle cartucce, lo Store, multigiocatore"],
      ["porta seriale USB", "ingresso e uscita", "USB", "scrittura del firmware, messaggi di debug"],
    ], "Hardware dal README di PRG32 e da docs/hardware. Un interruttore rimbalza per qualche millisecondo quando viene premuto; campionarlo una volta per frame, ogni poche decine di millisecondi, nasconde il rimbalzo.", { widths: [2.8, 1.8, 3.6, 4] }),
    C("Tre modi di gestire un dispositivo", [
      ["Polling", "Il programma chiede al dispositivo, ancora e ancora, se ha qualcosa. Semplice, ed è ciò che fa un gioco una volta per frame; uno spreco quando non succede nulla."],
      ["Interruzioni", "Il dispositivo chiede attenzione quando gli serve; il processore sospende ciò che sta facendo, serve il dispositivo e riprende. L'argomento della Lezione 19."],
      ["Accesso diretto alla memoria", "Il dispositivo scambia da solo interi blocchi di dati con la memoria; il processore si limita ad avviare il trasferimento e viene avvisato quando finisce."],
    ], "I/O programmato, I/O a interruzioni e DMA. Sul kit sono all'opera tutti e tre: il vostro gioco interroga il joystick, il timer che cadenza i frame interrompe, il display e l'audio sono alimentati in DMA."),

    Q("Che cosa fa il codificatore di un controller di tastiera?", ["Illumina il tasto premuto", "Trasforma una combinazione di riga e colonna in un codice di tasto", "Invia il codice al monitor", "Conta per quanto tempo un tasto resta premuto"], 1, "Da una posizione decodificata nella matrice dei tasti a un codice compatto di n bit, come il codificatore della Lezione 11."),
    Q("In un LCD a colori, un pixel è fatto di:", ["una cella che cambia colore", "tre celle con filtri rosso, verde e blu", "un punto di fosforo colpito da elettroni", "un transistor che emette luce"], 1, "Tre sub-pixel, ciascuno una cella di cristalli liquidi dietro un filtro colorato; un TFT in ognuno ne conserva lo stato."),
    Q("Perché un LCD a matrice passiva mostra scie dietro gli oggetti in movimento?", ["La retroilluminazione è troppo debole", "I pixel sono pilotati uno alla volta e nel frattempo devono mantenere il proprio stato", "Ha troppo pochi colori", "La scheda video è lenta"], 1, "Persistenza: senza un transistor per pixel, le celle rispondono lentamente e conservano male il proprio stato mentre si scandiscono le altre."),
    Q("Un gioco PRG32 legge il joystick una volta per frame. Questa tecnica si chiama:", ["accesso diretto alla memoria", "ingresso a interruzioni", "polling", "mappatura in memoria"], 2, "Il programma interroga periodicamente il dispositivo. Con le interruzioni sarebbe il dispositivo a chiamare il programma."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Una tastiera ha 104 tasti: quanti bit servono per il codice di tasto? Quante righe e colonne potrebbe avere la matrice?",
      "Una pagina di 8 per 11 pollici a 600 punti per pollice, un bit per punto: quanta memoria serve alla stampante per la bitmap?",
      "Muovete un puntatore sullo schermo di PRG32 con il joystick, come farebbe un mouse: conservate x e y, limitateli allo schermo",
      "Fate in modo che il pulsante A agisca una sola volta per pressione (rilevamento del fronte, Lezione 13)",
      "Disegnate un punteggio a sette segmenti con dei rettangoli, usando la tabella del transcodificatore della Lezione 11",
    ], "Su carta: 7 bit, per esempio 8 per 13; circa 4 MB. Su PRG32: un puntatore che resta sullo schermo e un pulsante che scatta una volta per pressione.",
      "8 x 600 = 4.800 per 11 x 600 = 6.600 punti: 31.680.000 bit = 3,96 MB."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["cathode-ray tube", "tubo a raggi catodici", "pointing device", "periferica di puntamento"],
      ["liquid crystals", "cristalli liquidi", "dot-matrix / ink-jet printer", "stampante ad aghi / a getto d'inchiostro"],
      ["backlight", "retroilluminazione", "drum / toner", "tamburo / toner"],
      ["active matrix", "matrice attiva", "polling", "interrogazione ciclica"],
      ["keyboard / key", "tastiera / tasto", "device driver", "driver di periferica"],
    ], null, { widths: [2.8, 3, 3.2, 3.8] }),
    T("Conclusioni e letture", [
      "I dispositivi di ingresso/uscita sono una componente fondamentale dei calcolatori",
      "La tecnologia dei display ha fatto progressi enormi, dal fascio di elettroni a un transistor dietro ogni pixel",
      "Tastiera, mouse e stampante sono cambiati poco nella forma, e dentro sono fatti di codificatori, contatori e registri a scorrimento",
      "Un dispositivo raggiunge il processore tramite un controller e un bus, ed è gestito con il polling, con le interruzioni o con il DMA",
      "Sul kit PRG32 l'intera catena, da un interruttore a un pixel, si può seguire istruzione per istruzione",
      ["Letture", ["Tanenbaum, Austin: Architettura dei calcolatori. Un approccio strutturale, paragrafo 2.4 (ingresso/uscita)", "Stallings: Computer Organization and Architecture, il capitolo sull'ingresso/uscita", "Playing with RISC-V, capitolo 6: State and Input"]],
    ], "Poi: Verm1, parte 4: il gioco finito. Quindi la sua pubblicazione sul Cartridge Store."),
  ],
});
