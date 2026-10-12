// Italian version of decks/en/22-verm1-part4.js: same slides, same listings, text in Italian.
// Lecture 22 - Verm1, part 4: the finished game.  Fourth of the project tutorials.
// Listings: verm1/verm1_part4.S (tests/verm1_check.py); the checkpoints of steps 1 to 3 are built by tests/verm1_steps.py.
const V21 = require("../../lib/verm1");

Deck({
  n: "22", file: "22-Architettura_dei_Calcolatori-Verm1_Parte_4",
  title: "Verm1, parte 4: il gioco finito", short: "Verm1, parte 4",
  sub: "La macchina entra nel gioco: la divisione per le cifre, i livelli, il suono, e uno schermo disegnato solo dove cambia",
  quote: ["L'ottimizzazione prematura è la radice di tutti i mali.", "Donald Knuth, 1974"],
  cover: "verm1_p4_play.png",
  credit: V21.CREDIT,
  notes: "Quarto tutorial del progetto. Usa le Lezioni da 18 a 21: i registri per convenzione, lo stack, moltiplicazione e divisione (18), il ciclo del processore e il costo di un'istruzione (19), il frame buffer e il costo del disegno (20), ingresso, suono e il runtime come padrone dei dispositivi (21). Il file di riferimento è verm1/verm1_part4.S. La frase di Knuth è il motto giusto: il gioco è stato fatto funzionare nella Parte 3, e solo adesso, con una misura in mano, lo rendiamo veloce.",
  slides: [
    O("Che cosa avrete alla fine", [
      "Il punteggio e il punteggio migliore scritti in cifre, convertiti dalla vostra divisione per dieci",
      "Un verme che va più veloce al crescere del punteggio, fino a un limite",
      "Due suoni: una nota breve per un pasto, una lunga e bassa per la fine",
      "Una funzione draw che tocca una manciata di celle per passo invece dell'intero schermo",
      "Il Verm1 finito, pronto per essere confezionato nella Lezione 23",
    ]),
    G("Che cosa prende la Parte 4 dalle lezioni", ["Da", "Idea", "Dove compare oggi"], [
      ["Lezione 18", "la convenzione di chiamata: registri a, t, s, ra, lo stack", "piccole funzioni con un contratto; funzioni foglia"],
      ["Lezione 18", "l'estensione M: divu e remu, quoziente e resto", "le cifre del punteggio"],
      ["Lezione 19", "il ciclo del processore: ogni istruzione costa tempo", "la misura prima e dopo il passo 4"],
      ["Lezione 20", "lo schermo è memoria: il costo è scrivere pixel", "disegnare solo ciò che è cambiato"],
      ["Lezione 21", "i dispositivi sono del runtime: noi chiediamo, lui fa", "prg32_audio_note, con una durata"],
    ], "Torna anche la Lezione 04: una cifra diventa un carattere sommando 48, il codice ASCII di '0'.", { widths: [1.6, 5.8, 4.8] }),
    I("Dove state andando", [["verm1_p4_title.png", "TITLE, con il punteggio migliore"], ["verm1_p4_play.png", "PLAY: il punteggio in cifre"], ["verm1_p4_over.png", "OVER"]],
      "Schermate prodotte da tools/tests/verm1_check.py con un giocatore programmato.", "Partite da una Parte 3 che gira; se la vostra non gira, copiate verm1_part3.S. Oggi ci sono quattro passi, e il programma gira dopo ciascuno."),
    K("Il ciclo di lavoro, di nuovo", V21.BUILD, null, "Gli stessi due comandi. Prima di cominciare, eseguite la Parte 3 in modalità debug e annotate ciò che mostra la telemetria durante una partita: istruzioni eseguite (retired), frame al secondo, frame in ritardo. I numeri vi serviranno nel passo 5.", "sh"),

    H("Passo 1: il punteggio in cifre", "Da un numero a tre caratteri."),
    T("Un numero non è le sue cifre", [
      "score contiene un numero binario: 137 è 0x89, un byte",
      "Lo schermo vuole tre caratteri: '1', '3', '7', cioè i byte 0x31, 0x33, 0x37",
      ["Dividere per dieci, tre volte", ["137 / 10 = 13, resto 7: le unità", "13 / 10 = 1, resto 3: le decine", "1 / 10 = 0, resto 1: le centinaia"]],
      "Le cifre escono da destra: memorizzatele dall'ultimo carattere al primo",
      "Una cifra d diventa un carattere sommando 48: il codice ASCII di '0'",
    ], "La conversione della Lezione 05, fatta dal programma invece che a mano. remu dà il resto, divu il quoziente: due istruzioni dell'estensione M.", { big: "137", label: "0x89 in memoria; 0x31 0x33 0x37 sullo schermo" }),
    V21.slide(4, "to-decimal", "NUOVO  to_decimal: dividere per dieci, tre volte", [
      "Contratto: a0 = valore, a1 = dove vanno i 3 caratteri",
      "remu dà la cifra, divu ciò che resta",
      "sb memorizza un byte: scostamenti 2, 1, 0 da a1",
      "Una foglia: solo registri t, nessun frame",
    ], "I valori sopra 999 mostrerebbero solo le ultime tre cifre: un limite che nessun giocatore incontrerà presto. Le istruzioni di divisione sono lente, decine di cicli di clock ciascuna su un processore piccolo, e dieci per passo del verme non sono nulla."),
    V21.slide(4, "draw-score", "MODIFICATO  draw_score: due numeri, due testi", [
      "Sostituite draw_score della Parte 3: via le tacche",
      "Le cifre vengono scritte in una stringa in RAM",
      "best_txt+5: salta BEST e lo spazio, cinque caratteri",
      "Poi la stringa si disegna come ogni altra",
    ], "score_txt e best_txt sono stringhe in .data, non in .rodata: il programma ci scrive dentro. Il testo viene disegnato con il suo colore di sfondo, quindi le nuove cifre coprono le vecchie senza cancellare."),
    V21.slide(4, "data-ram", "MODIFICATO  .data: le variabili della Parte 4", [
      "Sostituite la .data della Parte 3",
      "Due stringhe che il programma compila",
      "dirty, old ed erase: usate nei passi 3 e 4",
    ], "Scrivetela tutta adesso. Le sei variabili da dirty a erase_y non vengono usate fino al passo 3."),
    X("Eseguite: le cifre", [
      "Compilate ed eseguite, premete A: la riga in alto dice VERM1 000 e, a destra, BEST 000",
      "Giocate e mangiate: 001, 002, ...",
      "Perdete: nella schermata di game over BEST mostra il vostro punteggio",
      "Nel debugger trovate score_txt in memoria e leggetene i byte: 30 30 33 00 dopo tre pasti",
    ], "Il punteggio e il punteggio migliore in cifre; tutto il resto come nella Parte 3.",
      "Questo programma intermedio, la Parte 3 con le nuove draw_score, to_decimal e .data, viene compilato ed eseguito da tests/verm1_steps.py."),

    H("Passo 2: i livelli", "La velocità diventa una funzione del punteggio."),
    V21.slide(4, "constants", "MODIFICATO  Costanti: due velocità invece di una", [
      "SPEED_Q8 è sostituita da un minimo e un massimo",
      "32/256: un passo ogni 8 frame all'inizio",
      "96/256: al massimo tre passi ogni 8 frame",
    ], "Sostituite le costanti della Parte 3. Cambiano solo le due righe SPEED."),
    V21.slide(4, "play-timer", "MODIFICATO  play_update: una velocità che cresce", [
      "speed = 32 + 4 x score: uno scorrimento e una somma",
      "ble e mv: il minore tra speed e 96",
      "Il resto è il timer che conoscete",
      "Il limite si raggiunge a 16 punti",
    ], "Sostituite il timer alla fine di play_update. Una saturazione: il valore segue una retta e poi resta al limite, come il clamp del primo laboratorio. Con la virgola fissa la velocità cambia di un sessantaquattresimo di cella per frame a ogni pasto: nessuna velocità intera potrebbe essere così fine."),
    G("I livelli, in numeri", ["Punteggio", "Velocità (1/256 di cella per frame)", "Frame per passo", "Celle al secondo a 30 fps"], [
      ["0", "32", "8", "3,75"],
      ["4", "48", "5,3", "5,6"],
      ["8", "64", "4", "7,5"],
      ["12", "80", "3,2", "9,4"],
      ["16 e oltre", "96", "2,7", "11,25"],
    ], "256 diviso la velocità dà i frame per passo; la frequenza dei frame per la velocità diviso 256 dà le celle al secondo. Chiedete agli studenti la riga del punteggio 2.", { widths: [2.2, 4.2, 2.8, 4], caption: "Le frazioni di frame sono reali: a 48/256 i passi arrivano ogni 5 o 6 frame, 5,33 in media." }),
    X("Eseguite: sempre più veloce", [
      "Compilate ed eseguite: il verme parte più lento che nella Parte 3, e accelera a ogni pasto",
      "Contate con il debugger i frame tra due passi a punteggio 0: otto",
      "Arrivate a 16 punti: la velocità non cambia più",
      "Provate SPEED_MAX = 256, se ne avete il coraggio",
    ], "Una partenza lenta, un passo ogni 8 frame, e un'accelerazione visibile nei primi pasti.",
      "Verificato da tests/verm1_steps.py: 8 passi nei primi 64 frame di una partita."),

    H("Passo 3: step dice che cosa ha cambiato", "I suoni, e gli appunti che serviranno a draw."),
    V21.slide(4, "sound", "MODIFICATO  play_note: una funzione, ogni nota", [
      "Sostituite eat_sound con play_note",
      "Il chiamante sceglie nota e durata: a2 e a4",
      "La funzione compila gli altri tre argomenti",
    ], "Gli argomenti restano nei registri in cui prg32_audio_note li aspetta: a2 è la nota e a4 la durata in entrambe le funzioni. Progettare un contratto attorno al chiamato risparmia spostamenti."),
    V21.slide(4, "step-head", "MODIFICATO  step: ricordare la vecchia testa", [
      "Sostituite la stessa parte di step",
      "old_x, old_y: la cella che la testa sta lasciando",
      "draw la ridipingerà con il colore del corpo",
    ], "Al codice della Parte 3 si aggiungono due store: le righe che scrivono old_x e old_y."),
    V21.slide(4, "step-tail", "MODIFICATO  step: c'è una cella da cancellare?", [
      "Mangiando: la coda resta, niente da cancellare",
      "erase_on = 0 lo dice a draw",
    ], "Si aggiungono due righe: lo store di zero in erase_on."),
    V21.slide(4, "step-collide", "MODIFICATO  step: annotare la coda, chiamare la fine", [
      "La coda lascia una cella: ricordare quale",
      "erase_on = 1: draw deve dipingerla di nero",
      "La collisione ora è una chiamata: game_is_over",
    ], "L'inizio è nuovo, sette righe; la fine è più corta che nella Parte 3, perché la transizione a OVER è diventata una funzione."),
    V21.slide(4, "step-insert", "MODIFICATO  step: scrivere la nuova testa", [
      "Come nella Parte 3, fino ai due sb",
      "La fine della funzione è nella prossima slide",
    ], "Righe invariate, mostrate perché la funzione continua."),
    V21.slide(4, "step-score", "NUOVO  step: qualcosa è cambiato", [
      "dirty = 1: c'è stato un passo, draw ha da fare",
      "Un pasto: un punto, nuovo cibo, una nota breve e acuta",
      "li a2 e li a4, poi call: argomenti per contratto",
    ], "Questo sostituisce la fine di step. Nota 72 per 60 millisecondi: il suono della Parte 2, attraverso la nuova funzione."),
    V21.slide(4, "game-over", "NUOVO  game_is_over: la transizione, in un posto solo", [
      "Da PLAY a OVER, e il punteggio migliore, come nella Parte 3",
      "dirty = 2: va disegnata una nuova schermata",
      "Una nota lunga e bassa: 36, per 400 millisecondi",
    ], "Una transizione della macchina a stati merita una funzione tutta sua: stato, uscite e suono in un posto solo."),
    X("Eseguite: il suono della sconfitta", [
      "Compilate ed eseguite: il gioco appare esattamente come dopo il passo 2",
      "Un pasto suona come prima; mordersi dà una nota lunga e bassa",
      "Nel debugger guardate erase_x ed erase_y seguire la coda, un passo indietro",
      "dirty resta a 1 o 2: nessuno lo legge ancora",
    ], "Nessun cambiamento visibile: lo schermo viene ancora disegnato per intero a ogni frame. Le nuove variabili vengono scritte e non ancora usate.",
      "Questo programma intermedio viene compilato ed eseguito da tests/verm1_steps.py: verm1_draw della Parte 3 con step, play_note e game_is_over della Parte 4."),

    H("Passo 4: disegnare solo ciò che è cambiato", "Da uno schermo intero per frame a poche celle per passo."),
    T("Quanto costa un frame?", [
      "La Parte 3 cancella 64 000 pixel e ridisegna il titolo, il punteggio, l'intero verme e il cibo: trenta volte al secondo",
      "Tra due passi sullo schermo non cambia nulla, e un passo cambia pochissimo",
      ["Un passo cambia al massimo", ["la cella lasciata dalla coda: nera", "la vecchia testa: ora corpo", "la nuova testa, e forse il cibo e il punteggio"]],
      "Quindi: ricordare che cosa è cambiato, e disegnare solo quello",
      "L'immagine resta sullo schermo da sola: il frame buffer è memoria",
    ], "Lezione 20: lo schermo è un array di pixel che conserva il suo contenuto. Un verme di 200 celle costa 200 rettangoli per frame nella Parte 3 e tre per passo nella Parte 4. È ciò che facevano i vecchi home computer, perché non avevano scelta.", { big: "64 000", label: "pixel per frame nella Parte 3; poche centinaia per passo nella Parte 4" }),
    V21.slide(4, "draw", "MODIFICATO  draw: niente, poco, o tutto", [
      "dirty = 0: ritorno immediato, niente frame né chiamate",
      "dirty = 1: c'è stato un passo, disegna i cambiamenti",
      "dirty = 2: una nuova schermata, disegna tutto",
      "Il flag viene azzerato appena letto",
    ], "Sostituite verm1_draw. Il frame viene creato solo se c'è qualcosa da fare: il caso comune, nulla è cambiato, costa cinque istruzioni macchina."),
    V21.slide(4, "draw-changes", "NUOVO  draw_changes: tre celle e il punteggio", [
      "La cella lasciata dalla coda, se c'è: nera",
      "La vecchia testa: colore del corpo",
      "Poi la nuova testa, il cibo, il punteggio",
      "L'ordine conta: la testa si disegna dopo la cancellazione",
    ], "La testa può entrare nella cella che la coda ha appena lasciato: cancellare prima e disegnare la testa dopo dà l'immagine giusta."),
    V21.slide(4, "draw-full", "NUOVO  draw_full: una schermata intera", [
      "Il corpo della vecchia verm1_draw",
      "Il punteggio si disegna anche nella schermata del titolo",
      "TITLE: l'invito, e nient'altro",
    ], "Chiamata una volta per ogni cambio di stato."),
    V21.slide(4, "draw-full-play", "NUOVO  draw_full: PLAY e OVER", [
      "Il verme e il cibo, con le loro funzioni",
      "OVER aggiunge le due parole",
    ], "La seconda metà di draw_full."),
    V21.slide(4, "draw-parts", "NUOVO  draw_head", [
      "La testa è la voce head_i dell'anello",
      "Una cella, verde brillante",
    ], "Una piccola funzione usata da draw_changes."),
    V21.slide(4, "draw-food", "NUOVO  draw_food", [
      "Le tre righe che stavano dentro draw",
      "Ora hanno un nome, e due chiamanti",
    ]),
    V21.slide(4, "draw-text", "INVARIATO  draw_text", [
      "La funzione di servizio della Parte 3, in una slide tutta sua",
    ], "Invariata: era mostrata insieme al testo del game over nella Parte 3."),
    V21.slide(4, "init", "MODIFICATO  init: chiedere la prima schermata", [
      "dirty = 2: la schermata del titolo va disegnata una volta",
    ], "Sostituite verm1_init: si aggiungono tre righe."),
    V21.slide(4, "update-states", "MODIFICATO  update: un nuovo stato è una nuova schermata", [
      "Da OVER a TITLE: dirty = 2",
      "Si aggiungono tre righe, dopo lo store dello stato",
    ], "Sostituite la stessa parte di verm1_update."),
    V21.slide(4, "new-game-state", "MODIFICATO  new_game: e anche qui", [
      "Da TITLE a PLAY: dirty = 2",
      "Si aggiungono tre righe, prima del ritorno",
    ], "Ogni transizione della macchina chiede un disegno completo; ogni passo ne chiede uno parziale. Dimenticarne uno è il tipico errore di questa tecnica: lo schermo mostra uno stato che non è più vero."),
    I("Eseguite: il Verm1 finito", [["verm1_p4_play.png", "Punteggio 004, sette celle"], ["verm1_p4_over.png", "La fine di una partita"]],
      "Schermate prodotte da tools/tests/verm1_check.py.", "Atteso: lo stesso gioco di dopo il passo 3, pixel per pixel. Se vedete scie o buchi, un cambiamento non è stato annotato: usate il debugger."),

    H("Passo 5: misurare", "PRG32-QT come strumento: contare prima di credere."),
    O("Prima e dopo, con i numeri", [
      "Eseguite il gioco finito in modalità debug e avviate una partita",
      "Leggete la telemetria per dieci secondi di gioco: istruzioni eseguite, frame al secondo, frame in ritardo",
      "Confrontate con i numeri annotati per la Parte 3 all'inizio di questa lezione",
      "Fate crescere il verme fino a venti celle in entrambe le versioni e rileggete: un numero cresce con il verme, l'altro no",
      "Mettete un breakpoint sulla prima istruzione di draw_changes: si ferma una volta per passo, non una volta per frame",
      "Scrivete i quattro numeri nei vostri appunti: andranno nella descrizione del gioco nella Lezione 23",
    ], "La telemetria conta le istruzioni della cartuccia, non quelle del runtime che riempie i rettangoli, quindi il risparmio reale sulla scheda è più grande di quanto mostri il conteggio: lì ogni pixel viaggia anche su SPI verso il display. Non date numeri agli studenti: fateli misurare."),
    T("Seguire una chiamata con il debugger", [
      "Fermatevi su call to_decimal dentro draw_score e leggete a0, a1, ra e sp",
      "Un passo: il PC salta dentro to_decimal, e ra ora contiene l'indirizzo dell'istruzione dopo la chiamata",
      "Proseguite passo-passo: cambiano solo i registri t e a0; sp non si muove mai. Una funzione foglia",
      "A ret il PC prende il valore di ra: siete di nuovo in draw_score",
      "Ora fate lo stesso con call draw_text: sp scende di 16, ra viene memorizzato a 12(sp), e torna",
    ], "La convenzione di chiamata della Lezione 18, osservata istruzione per istruzione. Nel listato call compare come jal, o come auipc seguita da jalr, e ret come c.jr ra.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listato, registri, memoria", wide: true }),

    Q("to_decimal riceve a0 = 205. Quali byte memorizza, dallo scostamento 0 al 2?", ["02 00 05", "32 30 35", "35 30 32", "cd 00 00"], 1, "I caratteri '2', '0', '5': 0x32, 0x30, 0x35. Le unità vanno allo scostamento 2."),
    Q("A quale punteggio il verme fa un passo ogni 4 frame?", ["4", "8", "16", "32"], 1, "Un passo ogni 4 frame è 64/256: 32 + 4 x score = 64, quindi score = 8."),
    Q("dirty vale 0 quando viene chiamata verm1_draw. Quante istruzioni macchina esegue?", ["1", "5", "circa 50", "migliaia"], 1, "la sono due istruzioni, auipc e addi; poi lw, beqz e ret."),
    Q("Perché to_decimal può fare a meno di uno stack frame?", ["è corta", "non chiama funzioni e usa solo registri a e t", "non ha argomenti", "i frame sono facoltativi"], 1, "Una funzione foglia che tocca solo registri caller-saved non ha nulla da salvare."),
    X("Fatelo vostro", [
      "Una pausa: il pulsante B ferma il gioco e scrive PAUSE; di nuovo B lo riprende. Un quarto stato",
      "Una melodia nella schermata del titolo: una tabella di note in .rodata, una nota ogni 15 frame",
      "Cibo bonus: un pezzo su cinque è giallo, vale tre punti, e scompare dopo 100 frame",
      "I vostri colori con prg32_palette_set, o le vostre regole: ora il gioco è vostro",
    ], "La versione che pubblicherete nella Lezione 23 dovrebbe avere qualcosa di vostro. Cambiate anche la stringa del titolo.",
      "Pausa: uno stato PAUSED con transizioni sul fronte di B (0x20), e dirty = 2 a entrambe le transizioni. Melodia: un indice e un contatore di frame in .data; la tabella si legge come dx."),
    T("Appendice: le funzioni che non sono cambiate", [
      "Otto parti del file sono quelle della Parte 3: tenetele come sono",
      "Sono nelle prossime slide, così questa presentazione contiene l'intero programma",
      "update, new_game (prima metà), play_update (sterzata), step (ricerca in tabella), place_food, draw_worm, draw_cell, .rodata",
    ], "File di riferimento di questa parte: verm1/verm1_part4.S (" + V21.lines(4) + " righe)."),
    V21.slide(4, "update", "INVARIATO  update: pulsanti e fronti", ["Il rilevatore di fronte della Parte 3"]),
    V21.slide(4, "new-game-memory", "INVARIATO  new_game: la mappa e il verme", ["La prima metà di new_game"]),
    V21.slide(4, "play-input", "INVARIATO  play_update: la sterzata", ["Le maschere e la regola dell'inversione a U della Parte 2"]),
    V21.slide(4, "step-direction", "INVARIATO  step: la ricerca in tabella", ["Il frame e le tabelle dx, dy"]),
    V21.slide(4, "food", "INVARIATO  place_food", ["Una cella libera a caso"]),
    V21.slide(4, "draw-worm", "INVARIATO  draw_worm", ["Usata solo da draw_full, una volta per nuova schermata"]),
    V21.slide(4, "draw-cell", "INVARIATO  draw_cell", ["Dalle celle ai pixel, dalla Parte 2"]),
    V21.slide(4, "data", "INVARIATO  .rodata", ["Stringhe e tabelle"]),
    T("Dove siamo, e che cosa viene dopo", [
      "Verm1 è finito: circa seicento righe di assembly RISC-V, tutte vostre",
      "È cominciato come tre funzioni che ritornano, ed è cresciuto un passo eseguibile alla volta",
      "Dentro c'è ogni lezione del corso: numeri, logica, stato, memoria, chiamate, pixel, dispositivi",
      "Un programma che solo il suo autore può eseguire è finito a metà",
      "Lezione 23: un nome, un'icona, i crediti, un bundle per due architetture, e il Cartridge Store",
    ], "Chiedete agli studenti di portare la propria variante alla Lezione 23: il bundle che preparano deve essere del loro gioco, non del riferimento."),
  ],
});
V21.done(4);
