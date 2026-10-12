// Italian version of decks/en/12-verm1-part2.js: same slides, same listings, text in Italian.
// Lecture 12 - Verm1, part 2: steering, food and a score.  Second of the project tutorials.
// Every listing is read from verm1/verm1_part2.S (tests/verm1_check.py); the checkpoint of step 2 is built by tests/verm1_steps.py.
const V11 = require("../../lib/verm1");

Deck({
  n: "12", file: "12-Architettura_dei_Calcolatori-Verm1_Parte_2",
  title: "Verm1, parte 2: la guida, il cibo e un punteggio", short: "Verm1, parte 2",
  sub: "Il giocatore entra nel gioco: bit, maschere, una regola in un solo XOR, una tabella che seleziona",
  quote: ["Un gioco è una serie di scelte interessanti.", "Sid Meier"],
  cover: "verm1_p2.png",
  credit: V11.CREDIT,
  notes: "Secondo tutorial del progetto. Usa le Lezioni da 08 a 11: operatori booleani e tabelle di verità (08), XOR e uguaglianza, semplificazione (09), pulsanti come interruttori con pull-up (10), comparatori, multiplexer e ROM come tabella (11). Gli studenti partono dalla propria Parte 1 funzionante; il file di riferimento è verm1/verm1_part2.S.",
  slides: [
    O("Che cosa avrete alla fine", [
      "La testa di un verme che guidate con il joystick, in quattro direzioni",
      "Una regola che vieta l'inversione a U, scritta con un solo XOR e un solo confronto",
      "Il movimento preso da due piccole tabelle invece che da quattro salti",
      "Il cibo che compare in una cella a caso, viene mangiato, e ricompare",
      "Un punteggio, mostrato come tacche nella riga del titolo, e un suono quando il verme mangia",
    ]),
    G("Che cosa prende la Parte 2 dalle lezioni", ["Da", "Idea", "Dove compare oggi"], [
      ["Lezione 08", "AND come maschera: tenere un bit, azzerare gli altri", "un pulsante dalla parola dei pulsanti"],
      ["Lezione 08", "tabelle di verità: un codice per ogni caso", "le quattro direzioni in due bit"],
      ["Lezione 09", "XOR vale 1 dove due bit differiscono", "la regola dell'inversione a U; il test di uguaglianza"],
      ["Lezione 10", "un pulsante è un interruttore verso massa con un pull-up", "perché premuto arriva come 1 solo dopo che il runtime lo inverte"],
      ["Lezione 11", "comparatore, multiplexer, ROM come tabella", "la testa sul cibo; dx e dy"],
    ], "Ogni riga è qualcosa che gli studenti hanno visto come circuito. Oggi le stesse idee sono istruzioni.", { widths: [1.6, 5.4, 5.2] }),
    T("Partire da una Parte 1 che gira", [
      "Aprite il vostro verm1.S della Parte 1, compilatelo ed eseguitelo: la testa deve attraversare lo schermo",
      "Se non lo fa, copiate il file di riferimento verm1_part1.S e partite da quello",
      "Oggi modificate il file in tre passi, e lo eseguite dopo il secondo e dopo il terzo",
      "Le slide con MODIFICATO sostituiscono codice che avete; quelle con NUOVO aggiungono codice",
      "Tenete aperto il debugger di PRG32-QT: il passo 4 lo usa per osservare una decisione mentre viene presa",
    ], "I file di riferimento sono nella cartella verm1 del materiale del corso. Tenete una copia di ogni parte finita: verm1_part1.S, verm1_part2.S e così via.", { img: "verm1_p2.png", cap: "Verm1 alla fine della Parte 2" }),
    K("Il ciclo di lavoro, di nuovo", V11.BUILD, null, "Gli stessi due comandi della Parte 1. PRG32-QT deve essere in esecuzione, con Run cartridges in RISC-V debug mode attivo in Settings se si vuole il debugger.", "sh"),

    H("Passo 1: nomi per i bit", "Pulsanti, direzioni, e le variabili di oggi."),
    V11.slide(2, "constants", "MODIFICATO  Costanti: pulsanti e direzioni", [
      "Nuovo colore: RED, per il cibo",
      "Ogni pulsante è un bit di una parola: una maschera lo seleziona",
      "Una direzione è un numero da 0 a 3: due bit",
      "I codici non sono arbitrari: si veda la slide successiva",
    ], "Aggiungete alle costanti della Parte 1 la riga di RED e quelle da BTN_LEFT a DIR_UP."),
    G("Un codice scelto con cura: le quattro direzioni", ["Direzione", "Codice", "Bit 1", "Bit 0", "dx", "dy", "Opposta"], [
      ["RIGHT", "0", "0", "0", "+1", "0", "LEFT = 2"],
      ["DOWN", "1", "0", "1", "0", "+1", "UP = 3"],
      ["LEFT", "2", "1", "0", "-1", "0", "RIGHT = 0"],
      ["UP", "3", "1", "1", "0", "-1", "DOWN = 1"],
    ], "Il bit 0 dice verticale, il bit 1 dice all'indietro. Una direzione e la sua opposta differiscono nel bit 1 e solo lì: codice XOR opposta è sempre 10 in binario, cioè 2. Una buona codifica trasforma una regola in una sola porta: la lezione della Lezione 09.", { widths: [2, 1.3, 1.3, 1.3, 1.3, 1.3, 3.7], caption: "Sullo schermo y cresce verso il basso: DOWN è +1, UP è -1." }),
    V11.slide(2, "data", "MODIFICATO  Dati: due tabelle e cinque variabili nuove", [
      "dx e dy: quattro parole ciascuna, una per direzione",
      "Sono costanti, quindi vivono in .rodata",
      "dir è la direzione dell'ultimo passo, want quella richiesta",
      "score, food_x, food_y: si usano nel passo 3",
    ], "Sostituite con questi i dati della Parte 1. I valori iniziali bastano per il passo 2: init si completa nel passo 3."),

    H("Passo 2: la guida", "Leggere i pulsanti, rifiutare l'inversione a U, cercare il movimento in una tabella."),
    D("Dal dito al bit", async (s, h) => {
      const C = require("../../lib/circuit");
      let o = C.vdd(120, 40, "3,3 V") + C.resistor(120, 40, 110, { label: "pull-up" }) + C.wire([[120, 150], [120, 190]]) + C.dot(120, 170) + C.wire([[120, 170], [250, 170]]) + C.text(256, 175, "piedino GPIO", { size: 14 }) +
        C.button(120, 190, 100, false, "UP") + C.wire([[120, 290], [120, 310]]) + C.ground(120, 310);
      await h.svg(s, C.doc(380, 350, o), h.MX, h.TOP + 0.1, 4.1, 3.8);
      h.table(s, 4.9, h.TOP + 0.1, [1.75, 1.75, 2.5, 1.3], ["Pulsante", "Piedino", "Dopo il runtime", "Maschera"], [["rilasciato", "1 (3,3 V)", "bit = 0", "-"], ["LEFT", "0", "bit 0 = 1", "0x01"], ["RIGHT", "0", "bit 1 = 1", "0x02"], ["UP", "0", "bit 2 = 1", "0x04"], ["DOWN", "0", "bit 3 = 1", "0x08"]], { fs: 14 });
      h.rows(s, [
        "Il piedino legge 0 quando il pulsante è premuto: attivo basso (Lezione 10)",
        "prg32_input_read inverte e impacchetta: una parola, un bit per pulsante, 1 = premuto",
        "UP e RIGHT insieme danno 0x04 OR 0x02 = 0x06",
        "a0 AND 0x04 vale zero se e solo se UP non è premuto",
      ], 4.9, h.TOP + 3.0, h.W - h.MX - 4.9, h.BOT - h.TOP - 3.0);
    }, "Il kit ha pull-up interni di circa 45 kilohm; gli interruttori vanno a massa. La cartuccia non vede mai il livello elettrico: il runtime dà la stessa parola sulla scheda, su QEMU e su PRG32-QT."),
    V11.slide(2, "update-input", "MODIFICATO  update: dai pulsanti a un desiderio", [
      "andi tiene un bit: zero significa non premuto",
      "Ogni pulsante premuto sovrascrive il desiderio in t2",
      "xor di desiderio e direzione: 2 significa opposta",
      "Un'inversione a U non viene memorizzata: resta il desiderio precedente",
    ], "Sostituisce l'inizio di verm1_update. update ora chiama una funzione, quindi le serve un frame di stack. Con due pulsanti premuti vince l'ultimo test: UP batte LEFT che batte DOWN che batte RIGHT. Il desiderio del giocatore è memorizzato in want e diventa la direzione solo al passo successivo: così due pressioni rapide non possono ripiegare il verme su se stesso."),
    G("La regola dell'inversione a U, come tabella di verità", ["dir", "want", "dir XOR want", "= 2 ?", "Decisione"], [
      ["0 RIGHT", "0 RIGHT", "00", "no", "prosegue"],
      ["0 RIGHT", "1 DOWN", "01", "no", "gira"],
      ["0 RIGHT", "2 LEFT", "10", "sì", "rifiuta: inversione a U"],
      ["0 RIGHT", "3 UP", "11", "no", "gira"],
      ["1 DOWN", "3 UP", "10", "sì", "rifiuta: inversione a U"],
      ["3 UP", "2 LEFT", "01", "no", "gira"],
    ], "Sedici righe in tutto: chiedere agli studenti di completare la tabella e di contare i rifiuti. Sono quattro, uno per direzione. Senza la codifica accurata la regola richiederebbe quattro confronti.", { widths: [2.2, 2.2, 2.6, 1.6, 3.6], caption: "Sei delle sedici righe. La regola è uno XOR e un confronto con la costante 2." }),
    V11.slide(2, "update-timer", "MODIFICATO  update: il timer chiama step", [
      "Il timer in virgola fissa della Parte 1, invariato",
      "Muoversi è ora una funzione a sé: step",
      "Etichette 6 e 7: i numeri da 1 a 5 sono usati sopra",
    ], "È il resto di verm1_update. Le righe che nella Parte 1 muovevano head_x sono sparite: diventano la funzione step."),
    V11.slide(2, "step-direction", "NUOVO  step: cercare il movimento", [
      "Il desiderio diventa la direzione, una volta per passo",
      "Una parola sono 4 byte: scostamento = codice scorso a sinistra di 2",
      "indirizzo della tabella + scostamento: la parola da caricare",
      "Nessun salto: il codice seleziona, come un multiplexer",
    ], "Una tabella in memoria di sola lettura indirizzata da un codice è una ROM: Lezione 11. L'alternativa sono quattro salti; la tabella è più corta, e cambiare le regole significa cambiare dati, non codice."),
    V11.slide(2, "step-wrap", "NUOVO  step: muoversi e rientrare, nei due versi", [
      "Si somma dx: la colonna ora può scendere sotto 0",
      "bgez esamina il segno: negativo significa fuori a sinistra",
      "Lo stesso per la riga, con ROWS",
      "t4 e t6 conservano la nuova cella per la slide successiva",
    ], "Nella Parte 1 esisteva solo il bordo destro. Una colonna negativa è un numero con segno: bgez e blt sono i confronti con segno della Lezione 05."),
    V11.stubSlide("p2_step_end", "Per ora: chiudere la funzione", [
      "Scrivete queste tre righe dopo il rientro",
      "Ripristinano ra e ritornano: step è completa",
      "Il passo 3 mette prima di esse il test del cibo",
    ], "Un finale provvisorio, perché il programma possa girare subito. Questo programma intermedio è compilato ed eseguito da tests/verm1_steps.py."),
    X("Eseguite: state guidando", [
      "Compilate ed eseguite: la testa parte ancora verso destra, dalla colonna 5 della riga 12",
      "Tenete premuto DOWN: la testa gira al passo successivo e scende, rientrando dalla riga 23 alla riga 0",
      "Mentre va a destra, tenete premuto LEFT: non accade nulla. L'inversione a U è rifiutata",
      "Tenete premuto DOWN e poi LEFT: due svolte, e ora la testa va a sinistra",
    ], "Tenendo premuto DOWN dall'inizio per 64 frame la testa arriva alla colonna 5, riga 22: dieci passi, tutti verso il basso.",
      "Verificato sull'esecutore headless di PRG32-QT: DOWN premuto per 64 frame dà (5, 22); LEFT premuto per 64 frame dà (15, 12), come se non fosse stato premuto nulla."),

    H("Passo 3: il cibo, un punteggio, un suono", "Una cella a caso, un comparatore, e un ciclo che disegna."),
    V11.slide(2, "init", "MODIFICATO  init: una partenza completa", [
      "Ogni variabile riceve il suo valore iniziale",
      "init ora chiama una funzione: le serve un frame di stack",
      "Il primo cibo viene piazzato qui",
    ], "Sostituite verm1_init."),
    V11.slide(2, "food", "NUOVO  place_food: una cella a caso", [
      "prg32_random_number(min, max): estremi compresi",
      "Argomenti in a0 e a1, risultato in a0",
      "Una colonna da 0 a 39, una riga da 0 a 23",
      "Il cibo può cadere sulla testa: lo corregge la Parte 3",
    ], "I numeri casuali vengono dal runtime: sulla scheda dal generatore hardware dell'ESP32-C6. Due partite sono diverse."),
    V11.slide(2, "step-eat", "MODIFICATO  step: la testa è sul cibo?", [
      "Sostituite con questo il finale provvisorio",
      "xor vale 0 quando due numeri sono uguali",
      "or dei due risultati: 0 solo se entrambi sono uguali",
      "Mangiare: un punto in più, nuovo cibo, un suono",
    ], "Un comparatore di uguaglianza è una fila di porte XOR seguita da un OR: Lezione 11. Qui sono due xor e una or. I registri t4 e t6 contengono ancora la nuova colonna e la nuova riga; dopo le chiamate non servono più, ed è per questo che si possono tenere in registri temporanei."),
    V11.slide(2, "sound", "NUOVO  eat_sound: una nota", [
      "Cinque argomenti, da a0 ad a4, poi la chiamata",
      "La nota 72 è il Do5 nella numerazione MIDI",
      "Il suono viene per ultimo: il gioco funzionava anche senza",
    ], "prg32_audio_note(canale, strumento, nota, volume, millisecondi). Su PRG32-QT la nota è suonata dal computer; sulla scheda dall'amplificatore con il suo altoparlante."),
    V11.slide(2, "draw", "MODIFICATO  draw: il punteggio a tacche", [
      "s0 conta le tacche: deve sopravvivere alle chiamate",
      "Perciò s0 è salvato nel frame, insieme a ra",
      "Un rettangolino per punto, a 4 pixel di distanza",
      "Il ciclo finisce quando s0 raggiunge il punteggio",
    ], "Sostituite l'inizio di verm1_draw. Un registro t può essere distrutto da qualunque chiamata; un registro s è conservato, purché lo salviamo e lo ripristiniamo noi: la convenzione, incontrata nella Lezione 02, si studia nella Lezione 18. Le cifre arrivano nella Parte 4, quando è disponibile la divisione."),
    V11.slide(2, "draw-cells", "MODIFICATO  draw: cibo e testa", [
      "Le stesse tre righe due volte: colonna, riga, colore",
      "draw_cell fa la conversione in pixel",
      "La testa si disegna per ultima: copre il cibo",
    ], "È il resto di verm1_draw: sostituisce il rettangolo della Parte 1."),
    V11.slide(2, "draw-cell", "NUOVO  draw_cell: dalle celle ai pixel", [
      "L'aritmetica della Parte 1, scritta una volta sola",
      "Il colore arriva in a2 e deve uscire in a4",
      "Va spostato per primo: a2 sta per essere sovrascritto",
    ], "Una funzione con un contratto: a0 = colonna, a1 = riga, a2 = colore. Scrivere il contratto in un commento fa parte del lavoro."),
    I("Eseguite: Verm1, Parte 2", [["verm1_p2.png", "La testa, il cibo, e due tacche dopo il titolo: due punti"]],
      "Schermata prodotta da tools/tests/verm1_check.py: un giocatore programmato guida due volte la testa sul cibo.", "Atteso: una cella rossa da qualche parte; guidate la testa su di essa; suona una nota, compare una tacca accanto a VERM1, il cibo si sposta."),

    H("Passo 4: osservare una decisione", "PRG32-QT come sonda logica."),
    O("Cogliere al lavoro la regola dell'inversione a U", [
      "Eseguite la cartuccia in modalità debug e premete Update: il listato mostra verm1_update",
      "Guardate la telemetria mentre tenete premuto un pulsante: la maschera di ingresso mostra 0x04 per UP, 0x01 per LEFT",
      "Trovate l'istruzione xor t3, t2, t1 e cliccate nel margine: un breakpoint",
      "Tenete premuto LEFT mentre la testa va a destra, e premete Resume: il programma si ferma sulla xor",
      "Leggete i registri: t1 vale 0, la direzione; t2 vale 2, il desiderio",
      "Premete Step: t3 diventa 2. Altri due passi: il salto avviene e la sw è saltata",
    ], "Abbassare la velocità del debugger a 0.25x se serve tempo per premere. Resume ignora una volta il breakpoint corrente: ogni Resume esegue un frame. Senza pulsanti premuti t2 è il desiderio precedente e t3 vale 0."),
    G("Che cosa si legge nei registri", ["Premete", "a0 (maschera)", "t1 = dir", "t2 = want", "t3 = t2 XOR t1", "Memorizzato?"], [
      ["niente", "0x00", "0", "0", "0", "sì: 0"],
      ["DOWN", "0x08", "0", "1", "1", "sì: 1"],
      ["LEFT", "0x01", "0", "2", "2", "no: inversione a U"],
      ["UP", "0x04", "0", "3", "3", "sì: 3"],
      ["UP + RIGHT", "0x06", "0", "3", "3", "sì: 3"],
    ], "Tutte con la testa che va a destra. L'ultima riga mostra la priorità dei test: UP è esaminato per ultimo e vince. a0 viene sovrascritto più avanti nel frame: va letto alla prima istruzione dopo la chiamata.", { widths: [2.2, 1.9, 1.6, 1.8, 2.6, 2.1], mono: [1] }),
    T("Leggere le variabili in memoria", [
      "Dopo la t0, dir il registro t0 contiene l'indirizzo di dir: scrivetelo nel campo Memory",
      "Le variabili si susseguono, 4 byte ciascuna, nell'ordine del file",
      ["A partire dall'indirizzo di dir", ["+0 dir, +4 want, +8 step_q8", "+12 score, +16 food_x, +20 food_y"]],
      "Mangiate una volta, mettete in pausa, e leggete score: 01 00 00 00",
      "Leggete food_x e food_y, e confrontateli con lo schermo: colonna e riga della cella rossa",
    ], "head_x e head_y sono le due parole prima di dir. Little-endian: il byte più basso viene per primo.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listato, registri, memoria", wide: true }),

    Q("Il giocatore tiene premuti insieme DOWN e RIGHT: prg32_input_read restituisce", ["0x02", "0x08", "0x0a", "0x10"], 2, "0x08 OR 0x02 = 0x0a: un bit per pulsante."),
    Q("Il verme va verso UP (3). Quale desiderio viene rifiutato?", ["RIGHT (0)", "DOWN (1)", "LEFT (2)", "UP (3)"], 1, "3 XOR 1 = 2: DOWN è l'opposto di UP."),
    Q("Perché slli t1, t1, 2 prima di sommare all'indirizzo di dx?", ["per rendere positivo il codice", "ogni elemento della tabella è di 4 byte", "per azzerare il bit 1", "le tabelle cominciano all'indirizzo 4"], 1, "Gli elementi sono parole: l'elemento k sta allo scostamento 4k."),
    Q("xor t1, t1, t4 dà zero esattamente quando", ["t1 vale zero", "t4 vale zero", "t1 e t4 sono uguali", "t1 e t4 sono opposti"], 2, "XOR vale 1 dove i bit differiscono: nessuna differenza, tutti zeri."),
    X("Fatelo vostro", [
      "Fate del pulsante A un freno: mentre è premuto, il timer non avanza",
      "Date due punti per un pezzo di cibo mangiato nella riga più in alto",
      "Disegnate la testa di un colore diverso per ogni direzione, usando una terza tabella di quattro colori",
      "Cambiate la codifica in RIGHT = 0, LEFT = 1, DOWN = 2, UP = 3: che cosa diventa la regola dell'inversione a U?",
    ], "Ogni modifica sono poche righe. Tenete una copia della Parte 2 funzionante prima di sperimentare: la Parte 3 parte da lì.",
      "Freno: andi con BTN_A (0x10) all'inizio del timer, salto all'uscita. Tabella dei colori: quattro .word in .rodata, indicizzate come dx. Nuova codifica: gli opposti differiscono nel bit 0, quindi il test è XOR = 1."),
    T("Dove siamo, e che cosa viene dopo", [
      "Il giocatore è nel gioco: un desiderio, una regola, un movimento, una ricompensa",
      "Bit e maschere, XOR come comparatore, una tabella come selettore: la logica trasformata in istruzioni",
      "Manca: il verme non ha corpo, niente può andare storto, e il gioco non finisce mai",
      "Le Lezioni da 13 a 16 danno gli strumenti: macchine a stati, registri, la memoria come vettore, ciò che sopravvive allo spegnimento",
      "Parte 3: un corpo che cresce, le collisioni, una schermata del titolo e un game over",
    ], "File di riferimento di questa parte: verm1/verm1_part2.S (" + V11.lines(2) + " righe)."),
  ],
});
V11.done(2);
