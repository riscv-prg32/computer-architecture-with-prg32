// Italian version of decks/en/17-verm1-part3.js: same slides, same listings, text in Italian.
// Lecture 17 - Verm1, part 3: a body, rules and states.  Third of the project tutorials.
// Listings: verm1/verm1_part3.S (tests/verm1_check.py); the checkpoints of steps 2 and 3 are built by tests/verm1_steps.py.
const V16 = require("../../lib/verm1");
const D16 = require("../../lib/draw");

// The ring buffer: 16 of the 256 entries, with head and tail.
function ring16(headI, len, title) {
  const c = 44, L = 20, T = 56, n = 12, W = n * c + 2 * L + 60, H = 170;
  const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="Arial" font-size="${o.size || 14}" font-weight="${o.bold === false ? "normal" : "bold"}" fill="${o.fill || "#1B2530"}" text-anchor="${o.anchor || "middle"}">${s}</text>`;
  let o = t(L, 20, title, { anchor: "start", size: 15 });
  const first = headI - len - 1;                       // index shown in the leftmost box
  for (let j = 0; j < n; j++) {
    const idx = ((first + j) % 256 + 256) % 256, d = (headI - idx + 256) % 256, used = d < len;
    o += `<rect x="${L + j * c}" y="${T}" width="${c}" height="${c}" fill="${d === 0 ? "#00C000" : used ? "#0B7A0B" : "#EEF2F5"}" stroke="#2E4A62" stroke-width="1.5"/>`;
    o += t(L + j * c + c / 2, T + c + 18, String(idx), { bold: false, size: 13, fill: "#5B6B78" });
    if (d === 0) o += t(L + j * c + c / 2, T - 10, "head_i", { fill: "#0E7C86" });
    if (d === len - 1) o += t(L + j * c + c / 2, T - 10, "coda", { fill: "#B23A48" });
  }
  o += t(L + n * c + 8, T + 28, "...", { anchor: "start", size: 20 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${o}</svg>`;
}
const fsm16 = () => D16.fsm([{ id: "T", x: 95, y: 150, label: "TITLE", color: "#2E4A62" }, { id: "P", x: 300, y: 150, label: "PLAY", color: "#0E7C86" }, { id: "O", x: 505, y: 150, label: "OVER", color: "#B23A48" }],
  [{ from: "T", to: "P", label: "A premuto", bend: -40 }, { from: "P", to: "O", label: "si morde", bend: -40 }, { from: "O", to: "T", label: "A premuto", bend: -110 }, { from: "P", to: "P", label: "a ogni frame", loop: "top" }], { w: 600, h: 330, r: 44 });

Deck({
  n: "17", file: "17-Architettura_dei_Calcolatori-Verm1_Parte_3",
  title: "Verm1, parte 3: un corpo, regole e stati", short: "Verm1, parte 3",
  sub: "La memoria entra nel gioco: un anello di byte, una mappa del mondo, una macchina a tre stati",
  quote: ["Mostrami le tue tabelle, e di solito non avrò bisogno dei tuoi diagrammi di flusso: saranno ovvi.", "Fred Brooks, The Mythical Man-Month"],
  cover: "verm1_p3_play.png",
  credit: V16.CREDIT,
  notes: "Terzo tutorial del progetto. Usa le Lezioni da 13 a 16: macchine a stati finiti e rilevamento del fronte (13), registri che conservano il valore precedente (14), la memoria come vettore di byte, indirizzi e indici (15), ciò che resta nel file della cartuccia e ciò che si perde allo spegnimento (16). Il file di riferimento è verm1/verm1_part3.S. La citazione è la seconda metà dell'osservazione di Brooks su diagrammi di flusso e tabelle: con «strutture dati» al posto di «tabelle» è il motto di questa parte.",
  slides: [
    O("Che cosa avrete alla fine", [
      "Un verme con un corpo che segue la testa e cresce di una cella a ogni pasto",
      "Un gioco che si può perdere: il verme non deve mordersi",
      "Tre schermate: un titolo, il gioco, un game over, collegate dal pulsante A",
      "Il cibo che non compare mai sul verme",
      "Un punteggio migliore, conservato finché la cartuccia resta in memoria",
    ]),
    G("Che cosa prende la Parte 3 dalle lezioni", ["Da", "Idea", "Dove compare oggi"], [
      ["Lezione 13", "una macchina a stati finiti: stati, ingressi, transizioni", "TITLE, PLAY, OVER"],
      ["Lezione 13", "un fronte è un cambiamento, non un livello", "A premuto adesso e non un frame fa"],
      ["Lezione 14", "un registro conserva un valore per il clock successivo", "prev_btn: i pulsanti dell'ultimo frame"],
      ["Lezione 15", "la memoria è un vettore di byte: indirizzo = base + indice", "il corpo, la mappa del mondo"],
      ["Lezione 16", "che cosa resta nel file e che cosa vive in RAM", ".rodata e .data; il punteggio migliore"],
    ], "Il frame è il clock della nostra macchina: update calcola lo stato prossimo dallo stato presente e dagli ingressi, esattamente come nella Lezione 13.", { widths: [1.6, 5.6, 5.0] }),
    I("Dove state andando", [["verm1_p3_title.png", "TITLE"], ["verm1_p3_play.png", "PLAY: sette celle dopo quattro pasti"], ["verm1_p3_over.png", "OVER"]],
      "Schermate prodotte da tools/tests/verm1_check.py con un giocatore programmato.", "Tre schermate, un solo programma. Partite da una Parte 2 che gira; se la vostra non gira, copiate verm1_part2.S."),
    K("Il ciclo di lavoro, di nuovo", V16.BUILD, null, "Gli stessi due comandi. Oggi il file cambia molto: compilare dopo ogni slide che dice Eseguite, non solo alla fine.", "sh"),

    H("Il progetto, prima del codice", "Due strutture dati e un diagramma."),
    D("Il corpo è un anello di 256 elementi", async (s, h) => {
      await h.svg(s, ring16(2, 3, "Una nuova partita: tre celle, la testa nell'elemento 2"), h.MX, h.TOP, 6.3, 1.72);
      await h.svg(s, ring16(3, 3, "Un passo: si scrive la nuova testa nell'elemento 3; la coda è ora l'elemento 1"), h.MX, h.TOP + 1.8, 6.3, 1.72);
      await h.svg(s, ring16(4, 4, "Un passo con un pasto: la testa avanza, la coda resta"), h.MX, h.TOP + 3.6, 6.3, 1.72);
      h.rows(s, [
        "Due vettori di byte, body_x e body_y: l'elemento k contiene la cella di un segmento",
        "Non si sposta mai nulla: un passo scrive un elemento nuovo e muove un indice",
        ["Due numeri descrivono il verme", ["head_i: l'elemento della testa", "length: quanti elementi sono in uso"]],
        "La coda è l'elemento head_i - length + 1",
        "Dopo l'elemento 255 viene l'elemento 0: indice AND 255. Un anello",
      ], 7.1, h.TOP, h.W - h.MX - 7.1, h.BOT - h.TOP);
    }, "Un buffer circolare, la struttura che sta dietro ogni coda FIFO (first in, first out); l'aritmetica degli indirizzi è quella della Lezione 15. Muovere un verme di 200 celle costa quanto muoverne uno di 3. La dimensione 256 è scelta perché il ritorno a capo sia un solo AND: una potenza di due."),
    T("Il mondo è una mappa di 960 byte", [
      "La nuova testa tocca il corpo? Guardare ogni segmento costa fino a 255 confronti",
      "Si tiene invece una mappa: un byte per cella, 1 se c'è un segmento, 0 se no",
      ["La cella in colonna c della riga r è il byte numero", ["r x 40 + c, da 0 a 959", "il suo indirizzo è grid + r x 40 + c"]],
      "Un passo pone a 1 un byte, la nuova testa, e ne azzera uno, la vecchia coda",
      "Il test di collisione è un solo load, qualunque sia la lunghezza del verme",
    ], "Memoria in cambio di tempo: lo scambio classico. La mappa e l'anello dicono la stessa cosa in due modi, e il programma deve tenerli coerenti: ogni scrittura nell'una è accoppiata a una scrittura nell'altro.", { big: "r x 40 + c", label: "Un mondo a due dimensioni in una memoria a una dimensione: il calcolo dell'indirizzo della Lezione 15" }),
    D("Il gioco è una macchina a tre stati", async (s, h) => {
      await h.svg(s, fsm16(), h.MX, h.TOP, 6.3, 3.45);
      h.rows(s, [
        "Lo stato è una parola in memoria",
        "update guarda prima lo stato, poi gli ingressi",
        "A premuto significa: giù adesso, su un frame fa",
        "Tenere premuto A non deve saltare il titolo: un fronte, non un livello",
      ], 7.4, h.TOP, h.W - h.MX - 7.4, 3.45);
      h.table(s, h.MX, h.TOP + 3.65, [2.2, 3.4, 2.6, 4.0], ["Stato presente", "Ingresso", "Stato prossimo", "Azione"], [["TITLE", "A premuto", "PLAY", "new_game"], ["PLAY", "nuova testa sul corpo", "OVER", "aggiorna il punteggio migliore"], ["OVER", "A premuto", "TITLE", "-"]], { fs: 14 });
    }, "Il diagramma e la tabella della Lezione 13, per il nostro gioco. In ogni altro caso lo stato non cambia. Disegnarlo alla lavagna prima di mostrare il codice: il codice è una trascrizione."),

    H("Passo 1: la memoria del gioco", "Nomi, costanti nel file, variabili in RAM."),
    V16.slide(3, "constants", "MODIFICATO  Costanti: un pulsante, un colore, tre stati", [
      "BODY: un verde più scuro, 0x03e0",
      "BTN_A è il bit 4 della parola dei pulsanti",
      "Gli stati sono numeri: 0, 1, 2",
      "Le righe .section e .global passano alla slide successiva",
    ], "Sostituite le costanti della Parte 2."),
    V16.slide(3, "data", "MODIFICATO  .rodata: ciò che resta nel file", [
      "Tre stringhe e le due tabelle della Parte 2",
      "Sola lettura: il programma qui non scrive mai",
      "Sulla scheda potrebbe restare nella flash",
    ], "Sostituite la .rodata della Parte 2."),
    V16.slide(3, "data-ram", "MODIFICATO  .data: ciò che vive in RAM", [
      "head_x e head_y sono sparite: la testa sta nell'anello",
      ".space riserva byte senza dare un nome a ciascuno",
      "256 + 256 + 960 byte: il verme e il suo mondo",
      "best sopravvive a una partita, non a uno spegnimento",
    ], "Sostituite la .data della Parte 2. Tutto ciò che sta qui si perde quando la cartuccia viene scaricata: Lezione 16. Un punteggio migliore che sopravviva richiede memoria permanente, che una cartuccia portabile non ha: un limite onesto."),

    H("Passo 2: tre stati", "Prima la macchina, con funzioni che ancora non fanno nulla."),
    V16.slide(3, "init", "MODIFICATO  init: si parte dal titolo", [
      "init sceglie soltanto il primo stato",
      "La partita vera e propria la prepara new_game",
      "Di nuovo una foglia: nessun frame",
    ], "Sostituite verm1_init. Cancellate dal vostro file verm1_update, step e verm1_draw della Parte 2: le prossime slide le sostituiscono. Tenete place_food, eat_sound e draw_cell."),
    V16.slide(3, "update", "MODIFICATO  update: i pulsanti, e i loro fronti", [
      "s0 = pulsanti adesso; prev_btn = pulsanti di un frame fa",
      "prev_btn è un registro: ritarda di un frame",
      "adesso AND NOT prima: 1 solo dove una pressione è cominciata",
      "s0 e s1 devono sopravvivere alle chiamate: salvati nel frame",
    ], "Il rilevatore di fronte della Lezione 13: un flip-flop e una porta AND con un ingresso invertito. Qui il flip-flop è una parola di memoria e il clock è il frame."),
    V16.slide(3, "update-states", "MODIFICATO  update: un ramo per stato", [
      "Lo stato si legge per primo: decide chi guarda gli ingressi",
      "TITLE e OVER reagiscono solo a una nuova pressione di A",
      "PLAY passa a play_update i pulsanti tenuti premuti",
      "Etichette con un nome: u_play, u_start, u_done",
    ], "È il resto di verm1_update: la tabella delle transizioni, riga per riga. Da OVER a TITLE si memorizza soltanto il nuovo stato; da TITLE a PLAY si chiama new_game, che memorizza PLAY da sé."),
    V16.slide(3, "draw", "MODIFICATO  draw: che cosa mostrare in ogni stato", [
      "La riga del titolo si disegna sempre",
      "TITLE: solo l'invito, PRESS A",
      "PLAY e OVER: punteggio, verme, cibo",
      "x = 132 centra 7 caratteri da 8 pixel",
    ], "Sostituite verm1_draw. L'uscita dipende solo dallo stato e dalla memoria: draw non modifica nulla."),
    V16.slide(3, "draw-over", "MODIFICATO  draw: il game over, e draw_text", [
      "OVER aggiunge due parole sopra la scena",
      "draw_text: bianco su nero, scritto una volta sola",
      "Riempie a3 e a4 e lascia passare a0-a2",
    ], "La fine di verm1_draw, e una piccola funzione di servizio che toglie due righe da ogni chiamata di testo."),
    V16.stubSlide("p3_stubs_a", "Per ora: quattro funzioni che non fanno nulla", [
      "Stub: i nomi esistono, quindi il programma si compila",
      "new_game cambia soltanto lo stato",
      "I passi 3 e 4 li sostituiscono uno alla volta",
    ], "Si parte da funzioni che ritornano senza fare nulla, poi si aggiunge una cosa alla volta: il metodo della prima lezione. Questo programma intermedio è compilato ed eseguito da tests/verm1_steps.py."),
    X("Eseguite: una macchina con niente dentro", [
      "Compilate ed eseguite: la riga del titolo e PRESS A al centro dello schermo",
      "Premete A: l'invito scompare. Nell'angolo in alto a sinistra c'è una cella rossa: il cibo, alla colonna 0 della riga 0",
      "Nulla si muove e la partita non può finire: PLAY non ha ancora regole",
      "Nel debugger trovate la variabile state e guardatela passare da 0 a 1 quando premete A",
    ], "Schermata del titolo, poi un campo vuoto con una cella rossa in alto a sinistra.",
      "Il cibo sta in (0, 0) perché food_x e food_y partono da zero e lo stub di new_game non chiama place_food."),

    H("Passo 3: un verme in memoria", "Riempire l'anello e la mappa, e disegnarli."),
    V16.slide(3, "new-game-memory", "NUOVO  new_game: svuotare la mappa, posare il verme", [
      "Sostituite con questo lo stub di new_game",
      "960 byte posti a zero, una sb alla volta",
      "Tre segmenti: colonne 3, 4, 5 della riga 12",
      "Ognuno è scritto due volte: nell'anello e nella mappa",
    ], "grid+12*COLS è calcolato dall'assemblatore: l'indirizzo del primo byte della riga 12. sb memorizza un byte; l'indice si somma all'indirizzo base, senza scorrimento perché ogni elemento è un byte."),
    V16.slide(3, "new-game-state", "NUOVO  new_game: le variabili, il cibo, PLAY", [
      "head_i = 2 e length = 3 descrivono il verme",
      "Direzione, timer e punteggio partono da zero",
      "L'ultima cosa: lo stato diventa PLAY",
    ], "La seconda metà di new_game. La transizione da TITLE a PLAY è completa solo quando tutto è pronto: lo stato si memorizza per ultimo."),
    V16.slide(3, "draw-worm", "NUOVO  draw_worm: percorrere l'anello all'indietro", [
      "Sostituite con questo lo stub di draw_worm",
      "Il segmento i è l'elemento head_i - i, AND 255",
      "lbu carica un byte come numero senza segno",
      "Il segmento 0 è la testa: un verde più chiaro",
    ], "lbu e non lb: una colonna è un numero da 0 a 39, mai negativo. Con lb un byte da 200 in su diventerebbe negativo: Lezione 05. Qui funzionerebbero entrambe; lbu dice ciò che intendiamo."),
    V16.slide(3, "draw-score", "NUOVO  draw_score: le tacche della Parte 2", [
      "Sostituite con questo lo stub di draw_score",
      "Il ciclo della Parte 2, ora una funzione",
      "Usa s0, quindi lo salva e lo ripristina",
    ], "Lo stesso ciclo che nella Parte 2 stava dentro verm1_draw."),
    V16.stubSlide("p3_stubs_b", "Resta uno stub", [
      "play_update non fa ancora nulla",
      "Il verme esiste, e sta fermo",
    ], "Dei quattro precedenti resta solo questo stub."),
    X("Eseguite: un verme che sta fermo", [
      "Compilate ed eseguite, premete A: un verme di tre celle nella riga 12, colonne da 3 a 5, con la testa a destra",
      "Il cibo ora è in una cella a caso: new_game chiama place_food",
      "Nel debugger scrivete l'indirizzo di body_x nel campo Memory: i primi byte sono 03 04 05",
      "Trovate grid + 12 x 40 + 3: tre byte a 01 in un mare di zeri",
    ], "Tre celle verdi, la più a destra più chiara; una cella rossa da qualche parte; nulla si muove.",
      "Per trovare l'indirizzo di body_x: fermarsi all'inizio di draw_worm e avanzare finché la t0, body_x è stata eseguita; t0 lo contiene. grid sta 512 byte dopo body_x; la riga 12 comincia 480 byte dopo grid."),

    H("Passo 4: le regole", "Un passo del verme: decidere, guardare, scrivere."),
    V16.slide(3, "play-input", "MODIFICATO  play_update: la vostra update della Parte 2", [
      "Sostituite l'ultimo stub con questa slide e la successiva",
      "La guida della Parte 2, con un nome nuovo",
      "I pulsanti arrivano in a0: nessuna chiamata per leggerli",
    ], "Si prende il corpo della vecchia verm1_update: si toglie la chiamata a prg32_input_read e si rinomina la funzione."),
    V16.slide(3, "play-timer", "MODIFICATO  play_update: il timer", [
      "Esattamente il timer della Parte 2",
      "Accumulata una cella intera: si chiama step",
    ], "La fine di play_update."),
    V16.slide(3, "step-direction", "MODIFICATO  step: tre registri da conservare", [
      "s0, s1: la cella della nuova testa",
      "s2: zero quando il verme mangia",
      "Devono sopravvivere a place_food: registri s",
      "La ricerca in tabella è quella della Parte 2",
    ], "Il frame ha posto per quattro parole: ra e tre registri salvati."),
    V16.slide(3, "step-head", "MODIFICATO  step: dove sarà la testa?", [
      "La testa attuale è l'elemento head_i dell'anello",
      "Un byte ciascuno per colonna e riga: lbu",
      "Si sommano dx e dy, si rientra come nella Parte 2",
      "Non si scrive ancora nulla: prima bisogna guardare",
    ], "La nuova cella è soltanto calcolata, in s0 e s1. La scrittura viene dopo il test di collisione."),
    V16.slide(3, "step-tail", "MODIFICATO  step: mangiare, o muovere la coda", [
      "Il comparatore della Parte 2 lascia il risultato in s2",
      "Mangiare: length + 1, la coda resta dov'è",
      "Non mangiare: trovare la coda, elemento head_i - length + 1",
      "A 255 celle il verme smette di crescere",
    ], "Crescere e non muovere la coda sono la stessa cosa: è tutto qui il trucco di Snake. t3 e t4 ricevono colonna e riga della coda."),
    V16.slide(3, "step-collide", "NUOVO  step: liberare la coda, esaminare la testa", [
      "Numero del byte = riga x 40 + colonna: mul e add",
      "Prima si azzera il byte della coda, poi si esamina quello della testa",
      "Così la testa può entrare nella cella appena lasciata dalla coda",
      "Occupata: lo stato diventa OVER, best viene aggiornato",
    ], "L'ordine conta: liberare la coda prima del test permette al verme di inseguire la propria coda, come nel gioco originale. mul richiede l'estensione M di RISC-V, che l'ESP32-C6 ha."),
    V16.slide(3, "step-insert", "NUOVO  step: scrivere la nuova testa", [
      "Si segna la cella nella mappa: t0 punta ancora lì",
      "head_i + 1, AND 255: l'anello si chiude",
      "Si scrivono colonna e riga nel nuovo elemento",
      "Se s2 vale zero: un punto, nuovo cibo, un suono",
    ], "La fine di step. Dopo una collisione la funzione salta direttamente all'etichetta 9: non si scrive nulla, e lo schermo mostra il verme com'era prima del passo fatale."),
    V16.slide(3, "food", "MODIFICATO  place_food: non sul verme", [
      "Si estrae una cella a caso, poi si guarda la mappa",
      "Occupata: si estrae di nuovo, finché non esce una cella libera",
      "La colonna aspetta in s0 durante la seconda chiamata",
    ], "Sostituite place_food della Parte 2. Il ciclo finisce presto finché il verme è corto: con 255 celle su 960 la media è meno di due tentativi."),
    I("Eseguite: Verm1, Parte 3", [["verm1_p3_play.png", "Dopo quattro pasti: sette celle e quattro tacche"], ["verm1_p3_over.png", "Il verme si è morso"]],
      "Schermate prodotte da tools/tests/verm1_check.py.", "Atteso: il verme segue la testa e cresce; girare contro il corpo fa finire la partita; A riporta al titolo, A di nuovo avvia una nuova partita."),

    H("Passo 5: guardare la memoria muoversi", "PRG32-QT mostra l'anello e la macchina."),
    O("Guardare l'anello girare", [
      "Eseguite in modalità debug, premete A per avviare una partita, poi mettete in pausa",
      "Premete Update e mettete un breakpoint sulla prima istruzione di step",
      "Resume: il programma si ferma una volta per passo del verme, non una volta per frame",
      "Scrivete l'indirizzo di body_x nel campo Memory: i byte 03 04 05 dell'inizio, poi 06, 07 ... un byte nuovo per passo",
      "Scendete per qualche passo: body_x ripete la stessa colonna, e body_y, 256 byte più avanti, conta le righe",
      "Mangiate, e confrontate head_i e length prima e dopo: crescono entrambi di uno",
    ], "I byte delle vecchie posizioni non vengono mai cancellati: l'anello conserva tutta la storia degli ultimi 256 passi, e length dice quanta di essa è ancora verme. Dopo 256 passi la scrittura ricomincia dal primo byte."),
    G("Cogliere il fronte del pulsante A", ["Frame", "A è", "s0 (adesso)", "prev_btn", "NOT prev", "s1 = s0 AND NOT prev", "Effetto"], [
      ["n", "su", "0x00", "0x00", "0xff...ff", "0x00", "-"],
      ["n + 1", "giù", "0x10", "0x00", "0xff...ff", "0x10", "transizione"],
      ["n + 2", "giù", "0x10", "0x10", "0xff...ef", "0x00", "-"],
      ["n + 3", "su", "0x00", "0x10", "0xff...ef", "0x00", "-"],
    ], "Mettere un breakpoint su and s1, s0, t1 in verm1_update, tenere premuto A e premere Resume tre volte: s1 vale 0x10 in un solo frame. Il test del file di riferimento tiene premuto A per 28 frame e verifica che avvenga esattamente una transizione.", { widths: [1.2, 1.2, 1.6, 1.7, 1.8, 3.2, 1.8], mono: [2, 3, 4, 5], fs: 15, caption: "s1 vale 0x10 in un solo frame: quello in cui il pulsante scende." }),
    T("Tre domande per il debugger", [
      "Dov'è state? Dopo la t0, state in verm1_update, t0 ne contiene l'indirizzo. Guardate 00, 01, 02 mentre giocate e perdete",
      "La mappa è coerente con l'anello? Mettete in pausa, leggete la testa da body_x e body_y, calcolate riga x 40 + colonna, e guardate quel byte di grid",
      "Che cosa ha visto il passo fatale? Fermatevi sulla lbu che segue la seconda mul in step: t1 vale 1 una volta sola, al morso",
      "Un programma è giusto quando è giusta la sua memoria: imparate a leggerla",
    ], "La terza domanda è la più istruttiva: s0 e s1 contengono la cella in cui la testa voleva entrare, e lo schermo mostra che fa parte del corpo.", { img: "prg32qt_debugger_details.png", cap: "PRG32-QT: listato, registri, memoria", wide: true }),

    Q("head_i = 1 e length = 4. Quali elementi dell'anello contengono il verme?", ["1, 2, 3, 4", "0, 1, 2, 3", "254, 255, 0, 1", "253, 254, 255, 0"], 2, "Dalla coda, head_i - length + 1 = -2, cioè 254 dopo AND 255, fino alla testa: 254, 255, 0, 1."),
    Q("Quale byte di grid descrive la cella in colonna 7 della riga 3?", ["il byte 37", "il byte 127", "il byte 283", "il byte 307"], 1, "3 x 40 + 7 = 127."),
    Q("Il giocatore tiene premuto A per due secondi sulla schermata del titolo. Che cosa accade?", ["la partita comincia e finisce subito", "la partita comincia una volta", "nulla, finché A non viene rilasciato", "gli stati si alternano a ogni frame"], 1, "Solo il frame in cui A scende dà s1 = 0x10: un fronte, una transizione."),
    Q("Perché il byte della coda viene azzerato prima di esaminare quello della testa?", ["per risparmiare un'istruzione", "perché la testa possa entrare nella cella lasciata dalla coda", "perché sb è più veloce di lbu", "l'ordine non conta"], 1, "Nello stesso passo la coda si sposta: quella cella è libera per la testa."),
    X("Fatelo vostro", [
      "Muri: il verme muore quando esce dallo schermo invece di rientrare",
      "Partite con un verme di cinque celle; poi fate dipendere la lunghezza iniziale dal punteggio migliore",
      "Veleno: una seconda cella, blu, che accorcia il verme di una cella",
      "Nella schermata di game over mostrate il punteggio migliore come tacche sulla seconda riga",
    ], "Ogni modifica tocca una o due funzioni. Tenete una copia della Parte 3 funzionante: la Parte 4 parte da lì.",
      "Muri: in step-head, sostituire ogni rientro con un salto al codice che memorizza OVER. Veleno: muovere la coda due volte in un passo, azzerando entrambi i byte della mappa, senza mai scendere sotto length 1."),
    T("Appendice: due funzioni che non sono cambiate", [
      "eat_sound e draw_cell sono quelle della Parte 2: tenetele come sono",
      "Sono nelle due slide successive, così questa presentazione contiene l'intero programma",
      "Il file completo è la somma delle slide con NUOVO e MODIFICATO, più queste due",
    ], "File di riferimento di questa parte: verm1/verm1_part3.S (" + V16.lines(3) + " righe)."),
    V16.slide(3, "sound", "INVARIATO  eat_sound", ["Una nota di 60 millisecondi, come nella Parte 2"]),
    V16.slide(3, "draw-cell", "INVARIATO  draw_cell", ["Colonna, riga e colore in ingresso; un rettangolo in uscita"]),
    T("Dove siamo, e che cosa viene dopo", [
      "Verm1 è un gioco: ha uno scopo, un rischio, un inizio e una fine",
      "Una macchina a tre stati, un anello di byte, una mappa: logica sequenziale e memoria, scritte come programma",
      "Manca: ridisegna l'intero schermo a ogni frame, il punteggio è una fila di tacche, la velocità non cambia mai",
      "Le Lezioni da 18 a 21 danno gli strumenti: come esegue il processore, chiamate e divisione, come funzionano video e suono",
      "Parte 4: il gioco finito",
    ], "Gli studenti hanno ora circa 450 righe di assembly che hanno scritto e sanno spiegare. Le prossime quattro lezioni aprono la macchina che le esegue."),
  ],
});
V16.done(3);
