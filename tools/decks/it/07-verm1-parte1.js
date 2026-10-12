// Italian version of decks/en/07-verm1-part1.js: same slides, same listings, text in Italian.
// Lecture 07 - Verm1, part 1: a head that crosses the world.  First of the project tutorials.
// Every listing is read from verm1/verm1_part1.S, which tools/tests/verm1_check.py builds and runs.
const V6 = require("../../lib/verm1");

Deck({
  n: "07", file: "07-Architettura_dei_Calcolatori-Verm1_Parte_1",
  title: "Verm1, parte 1: una testa che attraversa il mondo", short: "Verm1, parte 1",
  sub: "Comincia il progetto del corso: una griglia, una cella, una velocità in virgola fissa",
  quote: ["Un viaggio di mille miglia comincia con un solo passo.", "Laozi, Tao Te Ching"],
  cover: "verm1_p1.png",
  credit: V6.CREDIT,
  notes: "Primo tutorial del progetto. Usa solo le Lezioni da 02 a 06: registri, load e store, chiamate (02), stringhe e colori (04), interi, confronti e ritorno a capo (05), virgola fissa (06), e un po' di storia (03). Gli studenti scrivono da sé il programma; il file di riferimento è verm1/verm1_part1.S. Tutto ciò che compare sulle slide di codice è letto da quel file, che viene compilato ed eseguito automaticamente.",
  slides: [
    O("Che cosa avrete alla fine", [
      "Una cartuccia vostra, verm1.prg32, compilata da un solo file assembly scritto da voi",
      "Un titolo, una griglia di 40 per 24 celle, e la testa del verme disegnata in una di esse",
      "La testa che si muove da sola, una cella alla volta, a una velocità che controllate in virgola fissa",
      "Un mondo senza bordi: superata l'ultima colonna la testa rientra dalla prima",
      "L'abitudine del ciclo di lavoro: modificare, compilare, eseguire, guardare, e fermare il programma nel debugger",
    ]),

    H("Il progetto", "Un solo gioco, costruito in quattro sedute e pubblicato alla fine."),
    T("Verm1: un omaggio a Snake", [
      "Verm1, si legge \"vermone\": un verme che si muove su una griglia, mangia, cresce, e non deve mordersi",
      ["Un gioco con una lunga storia", ["Blockade, un arcade della Gremlin, 1976", "Snake sul Nokia 6110, 1997: uno dei giochi più giocati di sempre"]],
      "Abbastanza piccolo da scriverlo da zero in assembly, abbastanza ricco da richiedere ogni argomento del corso",
      "Scrivete ogni riga: nessun motore, nessuna libreria oltre alle chiamate di PRG32",
      "Ecco dove state andando: l'immagine a destra è il gioco della Parte 4",
    ], "Snake per il Nokia 6110 fu scritto da Taneli Armanto. Verm1 è un omaggio, non una copia: il nome, le regole di dettaglio e l'aspetto sono nostri. L'implementazione di riferimento seguita dai tutorial è un contributo di Giuseppe Coviello.", { img: "verm1_p4_play.png", cap: "Verm1 alla fine del corso (Parte 4)" }),
    G("Il piano: quattro parti e una pubblicazione", ["Lezione", "Aggiungete", "Usa le Lezioni"], [
      ["07  Parte 1", "una griglia, una testa, il movimento automatico, il ritorno a capo", "da 03 a 06: informazione e numeri"],
      ["12  Parte 2", "la guida con il joystick, il cibo, un punteggio", "da 08 a 11: logica e circuiti"],
      ["17  Parte 3", "un corpo che cresce, le collisioni, le schermate di titolo e di fine partita", "da 13 a 16: stato e memoria"],
      ["22  Parte 4", "disegno veloce, punteggio in cifre, livelli, suono: il gioco finito", "da 18 a 21: la macchina"],
      ["23  Lo Store", "un bundle con manifest, icona e crediti, pronto per la revisione", "tutte"],
    ], "Ogni parte finisce con un programma che gira. Non cominciare mai una parte con un programma che non gira: se il proprio è rotto, si parte dal file di riferimento della parte precedente.", { widths: [1.8, 6.2, 4.2] }),
    G("Che cosa prende la Parte 1 dalle lezioni", ["Da", "Idea", "Dove compare oggi"], [
      ["Lezione 02", "registri, la / lw / sw, call e il frame di stack", "ovunque"],
      ["Lezione 03", "i giochi rétro come esemplari", "la scelta del gioco"],
      ["Lezione 04", "colori come numeri RGB565; stringhe terminate da zero", "GREEN, il titolo"],
      ["Lezione 05", "scorrimenti come moltiplicazioni; confronti; ritorno a capo", "da cella a pixel; il bordo del mondo"],
      ["Lezione 06", "virgola fissa: una frazione come intero scalato", "la velocità del verme"],
    ], null, { widths: [1.8, 5.6, 4.8] }),

    H("Passo 0: il ciclo di lavoro", "Modificare, compilare, eseguire, guardare."),
    K("Compilare ed eseguire", V6.BUILD, null, "Create una cartella ~/verm1 e tenetevi un solo file, verm1.S, che cresce di parte in parte. PRG32-QT ascolta sulla porta 8080 e mostra il proprio indirizzo nella schermata Setup: usate quello se localhost non risponde. La stessa cartuccia gira su QEMU (python3 -m prg32 qemu upload, poi qemu run) e sulla scheda (--url http://192.168.4.1).", "sh"),
    K("Passo 1: tre funzioni che ritornano", `# verm1.S - my Verm1
.option norelax

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw

verm1_init:
    ret

verm1_update:
    ret

verm1_draw:
    ret`, [
      "Scrivetelo, compilatelo, eseguitelo: uno schermo nero è la risposta giusta",
      "Il prefisso verm1 è il nome che passate a --entry-prefix",
      "init viene eseguita una volta; update e draw una volta per frame",
      "Da ora in poi: aggiungere una cosa, eseguire, guardare. Mai due cose insieme",
    ], "Lo scheletro della Lezione 02. Se qui la compilazione fallisce il problema è l'installazione, non il programma: va risolto prima di proseguire."),

    H("Passo 2: una griglia e una testa", "Costanti, variabili, e un rettangolo."),
    V6.slide(1, "constants", "Costanti: i colori e la griglia", [
      "I colori sono numeri RGB565: 0x07e0 è verde puro",
      "320 pixel in larghezza, 8 per cella: 40 colonne",
      "Gli 8 pixel in alto contengono il titolo; ne restano 192: 24 righe",
      ".equ dà un nome a un numero: non si usa memoria",
    ], "Sostituite con queste le prime righe dello scheletro. SPEED_Q8 si usa nel passo 3."),
    D("Il mondo di Verm1", async (s, h) => {
      await h.svg(s, V6.gridSvg(5, 12), h.MX, h.TOP, 7.6, h.BOT - h.TOP);
      h.rows(s, [
        "Il verme non vive nei pixel: vive nelle celle",
        "Una posizione è una colonna, da 0 a 39, e una riga, da 0 a 23",
        ["Per disegnare una cella la si trasforma in pixel", ["x = colonna x 8: uno scorrimento a sinistra di 3", "y = riga x 8 + 8: prima viene la riga del titolo"]],
        "La testa parte dalla colonna 5 della riga 12",
        "Pensare in celle rende semplice ogni regola successiva: muoversi è sommare 1",
      ], 8.5, h.TOP, h.W - h.MX - 8.5, h.BOT - h.TOP);
    }, "Disegnare la griglia alla lavagna e chiedere le coordinate in pixel di alcune celle: (0,0) sta in (0,8); (39,23) sta in (312,192)."),
    V6.slide(1, "data", "Variabili e una stringa", [
      ".rodata contiene le costanti: il titolo termina con un byte a zero",
      ".data contiene le variabili: una parola di 32 bit ciascuna",
      "I valori iniziali sono solo un punto di partenza: init li imposta di nuovo",
    ], "Mettete questo in fondo al file. step_q8 si usa nel passo 3."),
    V6.slide(1, "init", "init: la testa al suo posto", [
      "la prende un INDIRIZZO, sw vi memorizza un VALORE",
      "init imposta la partenza in modo esplicito: mai fidarsi di ciò che la memoria conteneva",
      "zero è il registro che si legge sempre 0",
      "Una funzione foglia: nessuna chiamata, quindi nessun frame di stack",
    ]),
    V6.slide(1, "draw", "draw: titolo e testa", [
      "Cancellare, scrivere il titolo, disegnare un rettangolo: tre chiamate",
      "Gli argomenti viaggiano da a0 ad a4, nell'ordine",
      "slli di 3 moltiplica per 8: da cella a pixel",
      "draw fa delle chiamate, quindi salva ra in un frame di stack",
    ], "prg32_gfx_text8(x, y, stringa, colore del testo, colore dello sfondo); prg32_gfx_rect(x, y, larghezza, altezza, colore)."),
    I("Eseguite: una testa sulla griglia", [["verm1_p1.png", "Il titolo e la testa. Dopo il passo 3 la testa si muoverà: questa immagine è stata presa a 64 frame dall'avvio della Parte 1 finita"]],
      "Schermata prodotta da tools/tests/verm1_check.py a partire da verm1/verm1_part1.S.", "Atteso ora: la parola VERM1 in alto a sinistra e un quadrato verde fermo nella colonna 5, riga 12."),

    H("Passo 3: il movimento", "Una velocità minore di una cella per frame."),
    T("A che velocità deve andare un verme?", [
      "update viene eseguita circa trenta volte al secondo",
      "Una cella per frame attraverserebbe lo schermo in poco più di un secondo: ingiocabile",
      "Vogliamo una frazione di cella per frame, e il processore del kit ha solo gli interi",
      "Virgola fissa, Q24.8: si tiene la frazione in 1/256 di cella, e si fa un passo ogni volta che si è accumulata una cella intera",
      "SPEED_Q8 = 40 significa 40/256 = 0,156 celle per frame: circa un passo ogni 6 frame",
    ], "È la palla della Lezione 06, trasformata in un timer. Il resto si conserva, quindi la velocità media è esatta: 256 frame danno esattamente 40 passi.", { big: "40 / 256", label: "di cella per frame: un passo quando la somma supera 256, e il resto non si butta via" }),
    V6.slide(1, "update", "update: accumulare, avanzare, rientrare", [
      "Si somma la velocità alla frazione; sotto 256, si aspetta",
      "A 256: lo si sottrae, si tiene il resto, si avanza di una cella",
      "La colonna 40 non esiste: si torna alla colonna 0",
      "Due uscite: ognuna memorizza ciò che ha cambiato",
    ], "blt confronta numeri con segno, e qui va bene: tutti i valori sono piccoli e positivi. Le etichette locali 1: e 2: si richiamano con 1f e 2f, «il prossimo 1 o 2 in avanti»."),
    G("Tracciare a mano", ["Frame", "step_q8 prima", "+ 40", "Cella intera?", "step_q8 dopo", "head_x"], [
      ["1", "0", "40", "no", "40", "5"],
      ["2", "40", "80", "no", "80", "5"],
      ["6", "200", "240", "no", "240", "5"],
      ["7", "240", "280", "sì: 280 - 256", "24", "6"],
      ["13", "224", "264", "sì: 264 - 256", "8", "7"],
      ["64", "-", "-", "-", "0", "15"],
    ], "Dopo 64 frame la somma è 64 x 40 = 2560 = 10 x 256: dieci passi, testa nella colonna 15, esattamente ciò che mostra la schermata. Chiedere agli studenti di compilare i frame da 8 a 12.", { widths: [1.3, 2.3, 1.5, 3, 2.2, 1.9], caption: "I passi arrivano ogni 6 o 7 frame: il resto porta con sé la differenza, come in un anno bisestile." }),
    X("Eseguite: la testa attraversa il mondo", [
      "Compilate ed eseguite: la testa va verso destra, circa cinque celle al secondo",
      "Aspettate il bordo destro: la testa esce dalla colonna 39 e rientra dalla colonna 0",
      "Portate SPEED_Q8 a 8, poi a 128, poi a 256: prevedete la velocità prima di eseguire",
      "Cambiate in init la riga di partenza e il colore della testa",
    ], "La testa attraversa le quaranta colonne in 256 frame, circa otto secondi e mezzo a trenta frame al secondo, all'infinito.",
      "Con SPEED_Q8 = 256 la testa avanza di una cella per frame; valori più grandi danno comunque un passo per frame, perché update fa al più un passo: un limite che vale la pena scoprire."),

    H("Passo 4: guardare dentro con PRG32-QT", "Il debugger fa parte del metodo: non è uno strumento d'emergenza."),
    O("Fermare il programma e leggere la macchina", [
      "In PRG32-QT aprite Settings e attivate: Run cartridges in RISC-V debug mode",
      "Eseguite la vostra cartuccia: il gioco è a sinistra, il debugger a destra",
      "Premete Update: il listato salta a verm1_update. Cliccate nel margine per mettere un breakpoint sulla sua prima istruzione",
      "Il programma si ferma lì al frame successivo. Premete Step e guardate cambiare i registri, un'istruzione alla volta",
      "Dopo le due istruzioni di la, t0 contiene un indirizzo: scrivetelo nel campo Memory per vedere step_q8 in memoria",
      "Resume, e guardate i byte di step_q8 crescere di 40 (0x28) a ogni fermata",
    ], "Dalla guida al debug di PRG32-QT: pausa, ripresa, passo; viste Init / Update / Draw / PC; breakpoint nel margine; una vista di 128 byte di memoria. Resume ignora una volta il breakpoint corrente, quindi ogni pressione di Resume esegue un frame intero."),
    K("Il listato: il vostro codice dopo l'assemblatore", `verm1_update:
  auipc   t0, 0x0          # la t0, step_q8   is two instructions:
  addi    t0, t0, ...      #   t0 = address of step_q8
  lw      t1, 0(t0)
  addi    t1, t1, 40       # SPEED_Q8 is gone: only the number is left
  addi    t2, zero, 256    # li t2, 256
  blt     t1, t2, ...
  sub     t1, t1, t2
  sw      t1, 0(t0)
  ...
  c.addi  t3, 1            # addi t3, t3, 1 in a 16-bit form
  ...
  c.jr    ra               # ret`, [
      "I nomi sono spariti: le etichette sono diventate indirizzi, le costanti numeri",
      "Le pseudo-istruzioni sono espanse: la è auipc più addi, li è addi da zero, ret è un salto a ra",
      "Alcune istruzioni cominciano con c.: sono le forme compresse a 16 bit delle stesse istruzioni",
      "La cartuccia è caricata all'indirizzo 0x40800000: ogni indirizzo che vedete parte da lì",
    ], "Disassemblato di verm1_update da verm1/verm1_part1.S (objdump, rv32imac), abbreviato; gli scostamenti esatti dipendono dalla compilazione. Formati delle istruzioni e istruzioni compresse sono l'argomento della Lezione 19.", "txt"),
    T("Leggere la memoria: little-endian, dal vivo", [
      "La vista Memory mostra 128 byte a partire dall'indirizzo scritto, in esadecimale",
      "step_q8 è una parola di .data: i suoi quattro byte arrivano dal meno significativo",
      "Con step_q8 = 240 si legge F0 00 00 00",
      "head_x e head_y sono le due parole che la precedono nel file, e che la precedono in memoria",
      "Qui non si cambia nulla: il debugger osserva soltanto. Per cambiare il programma: modificare, compilare, eseguire",
    ], "Ordine dei byte: Lezione 04. Nel file l'ordine è head_x, head_y, step_q8, quattro byte ciascuna: se step_q8 sta all'indirizzo A, head_x sta in A - 8.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listato, registri, memoria", wide: true }),

    Q("Con SPEED_Q8 = 64, quanti frame passano tra due passi della testa?", ["2", "4", "64", "256"], 1, "64/256 = 1/4 di cella per frame: una cella intera ogni 4 frame."),
    Q("Quale pixel è l'angolo in alto a sinistra della cella in colonna 10, riga 3?", ["(10, 3)", "(80, 24)", "(80, 32)", "(88, 32)"], 2, "x = 10 x 8 = 80; y = 3 x 8 + 8 = 32."),
    Q("Perché verm1_draw salva ra e verm1_update no?", ["draw è più lunga", "draw chiama altre funzioni, che sovrascrivono ra", "update non usa registri", "in update ra è salvato automaticamente"], 1, "Una chiamata scrive in ra l'indirizzo di ritorno. Una funzione che fa chiamate deve mettere al sicuro sullo stack il proprio ra; a una funzione foglia non serve."),
    X("Fatelo vostro", [
      "Fate muovere la testa verso sinistra: quale istruzione cambia, e quale confronto rileva il bordo?",
      "Fatela muovere invece verso il basso, rientrando dalla riga 23 alla riga 0",
      "Disegnate una seconda cella, di un verde più scuro, una colonna dietro la testa: un primo accenno di corpo",
      "Scrivete il vostro nome accanto al titolo, in un colore calcolato a mano in RGB565",
    ], "Ogni modifica sono poche righe. Tenete una copia della Parte 1 funzionante prima di sperimentare: la Parte 2 parte da lì.",
      "Verso sinistra: addi t3, t3, -1, poi bgez t3 per saltare il rientro, altrimenti li t3, COLS-1. Il confronto è sul segno: Lezione 05. Verde più scuro: 0x03e0."),
    T("Dove siamo, e che cosa viene dopo", [
      "Avete una cartuccia che gira, compilata da un file che avete scritto e che capite riga per riga",
      "Uno stato in memoria, una regola che lo cambia a ogni frame, una funzione che lo disegna: la forma di ogni gioco",
      "Manca il giocatore. La testa va dove vuole lei",
      "Le Lezioni da 08 a 11 danno gli strumenti: bit e maschere per leggere il joystick, regole booleane, tabelle che selezionano",
      "Parte 2: la guida, il cibo e un punteggio",
    ], "File di riferimento di questa parte: verm1/verm1_part1.S (" + V6.lines(1) + " righe). Se all'inizio della Parte 2 il programma di uno studente non funziona, si parte da questo file."),
  ],
});
V6.done(1);
