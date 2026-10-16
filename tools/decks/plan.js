/*
 * The plan of the course: for each lecture, what goes in which deck.
 *
 * A specification (decks/<lang>/NN-*.js) lists the slides of a lecture in teaching order.  Two decks
 * are built from it:
 *   - the LECTURE deck, at most 20 slides: the concepts;
 *   - the CODE deck: every listing with its explanation, the complete program of the lecture
 *     (../../code), what it shows, how to test it on PRG32-QT, on QEMU and on the board, the exercises.
 *
 * Slide numbers are those of the specification: the cover is 1, slides[0] is 2.  The plan is the same
 * for every language: the English and the Italian specifications have the same slides in the same order.
 *
 *   automatically in the code deck   K and WK (listings), T with a listing at its side, X (exercises)
 *   code: [...]                      other slides that belong with the code (traces, the debugger, "Run it")
 *   drop: [...]                      slides left out of both decks: their content is in the textbook
 *   H (section titles)               never a slide: they name the sections of the PowerPoint file
 *   Q (questions)                    two per slide in the lecture deck
 *
 *   lab: { src, prefix }             the program of the lecture, code/<src>.S, and its entry prefix
 *        { verm1: N }                the lecture is a part of Verm1: verm1/verm1_partN.S
 *        { store: true }             Lecture 23: the bundle of the Cartridge Store
 *        keys / see                  what to press and what appears, in each language
 */
const lab = (src, keys, see, prefix) => ({ src, prefix: prefix || src, keys, see });
const NONE = { en: "nothing: the program runs by itself", it: "niente: il programma va da solo" };

module.exports = {
  "00": { drop: [4, 11, 12, 19, 20, 23, 24, 28, 32, 35, 37, 38],
    lab: lab("l00", NONE, { it: "la parola ARC12 in bianco su uno schermo blu, e sotto HELLO, RISC-V." }) },
  "01": { code: [17, 18, 19, 22, 33, 34],
    lab: lab("l01", NONE, { it: "quattro barre verticali, rossa, verde, blu e bianca, e le parole PRG32 OK." }) },
  "02": { lab: lab("l02", NONE, { it: "HELLO PRG32 e, sotto, una barra verde che cresce di un pixel per frame e ricomincia a 256." }, "first") },
  "03": { drop: [5, 20],
    lab: lab("l03", NONE, { it: "una riga di 32 lampade che mostra 0x00130313, il codice macchina di addi t1, t1, 1, e un quadrato verde: la parola letta è quella attesa." }) },
  "04": { drop: [4, 11, 21, 22, 23, 24, 26],
    lab: lab("l04", NONE, { it: "quattro barre orizzontali, una per elemento dell'array (32, 11, 34, 22, quattro pixel per unità); l'elemento 2, quello che il listato carica, è giallo." }) },
  "05": { drop: [11, 23], code: [26, 27],
    lab: lab("l05", { en: "hold LEFT for a few frames", it: "tenete premuto LEFT per qualche frame" },
      { it: "i 32 bit di marker_x come lampade. Parte da 2 (una lampada); ogni frame con LEFT premuto sottrae 1: dopo 2, 1 e 0 si accendono tutte le lampade, 0xFFFFFFFF, cioè -1." }) },
  "06": { drop: [16, 23], code: [12],
    lab: lab("l06", NONE, { it: "un quadrato bianco che attraversa lentamente lo schermo da sinistra: un pixel ogni 2,67 frame." }) },
  "07": { code: [16], lab: { verm1: 1, shot: "verm1_p1.png", keys: NONE,
    see: { en: "the word VERM1 at the top left and a green head that crosses the grid from left to right, about five cells per second, and comes back in from column 0.",
      it: "la parola VERM1 in alto a sinistra e una testa verde che attraversa la griglia da sinistra a destra, circa cinque celle al secondo, e rientra dalla colonna 0." } } },
  "08": { code: [5, 22, 23],
    lab: lab("l08", { en: "LEFT and RIGHT move the marker; try A and B too", it: "LEFT e RIGHT muovono il segnalino; provate anche A e B" },
      { it: "sette lampade, una per pulsante (LEFT a sinistra), accese mentre il pulsante è premuto; un segnalino bianco mosso da LEFT e RIGHT; un quadrato verde quando né LEFT né RIGHT è premuto, rosso altrimenti." }) },
  "09": { drop: [10, 14, 18, 21],
    lab: lab("l09", NONE, { it: "otto righe, una per combinazione di A, B e Cin (000 in alto): tre lampade per gli ingressi a sinistra, poi S e Cout a destra. È la tabella di verità del sommatore completo." }) },
  "10": { drop: [9, 13, 23], code: [26, 27],
    lab: lab("l10", { en: "press and release LEFT", it: "premete e rilasciate LEFT" },
      { it: "un grande quadrato, grigio mentre LEFT è rilasciato e giallo mentre è premuto. Sul kit LEFT è un interruttore tra GPIO18 e massa." }) },
  "11": { drop: [7, 10, 11, 15, 19, 23, 31], code: [20, 27, 35],
    lab: lab("l11", NONE, { it: "quattro barre orizzontali, rossa, verde, blu e gialla dall'alto: la barra k è disegnata nel colore che il selettore k sceglie nella tabella." }) },
  "12": { code: [27], lab: { verm1: 2, shot: "verm1_p2.png", keys: { en: "steer with the joystick; a U-turn is refused", it: "guidate con il joystick; l'inversione a U è rifiutata" },
    see: { en: "a head that you steer, a red cell of food that moves when it is eaten, a note, and one mark per point next to VERM1.",
      it: "una testa che guidate, una cella rossa di cibo che si sposta quando viene mangiata, una nota, e una tacca per punto accanto a VERM1." } } },
  "13": { drop: [6, 7, 14, 16, 19, 25, 29, 33], code: [17, 32, 34],
    lab: lab("l13", { en: "press A", it: "premete A" },
      { it: "un colore per stato. Blu è TITLE: premete A e lo schermo diventa verde, PLAY. (OVER, rosso, si raggiunge solo quando una partita finisce: questo riscaldamento non ha ancora un gioco.)" }) },
  "14": { code: [24],
    lab: lab("l14", NONE, { it: "riga in alto: gli otto bit di 0xA5 nell'ordine in cui escono, il più significativo per primo (accesa, spenta, accesa, spenta, spenta, accesa, spenta, accesa). Riga in basso: il byte ricostruito dal ricevitore. Un quadrato verde dice che è uguale al byte inviato." }) },
  "15": { drop: [14], code: [23, 27],
    lab: lab("l15", NONE, { it: "cinque righe di lampade. La prima è la parola 0x12345678 letta con lw. Le altre quattro sono i byte agli indirizzi A, A+1, A+2, A+3 letti con lbu: 0x78, 0x56, 0x34, 0x12. L'indirizzo più basso contiene il byte meno significativo: little-endian." }) },
  "16": { drop: [7, 24, 27],
    lab: lab("l16", { en: "hold A, release it, then restart the cartridge", it: "tenete premuto A, rilasciatelo, poi riavviate la cartuccia" },
      { it: "il titolo HIGH SCORE e due barre: il punteggio di questa prova, che cresce mentre A è premuto e torna a zero quando A è rilasciato, e il punteggio migliore, che non scende mai. Riavviate la cartuccia: il titolo c'è ancora, il punteggio migliore è di nuovo zero." }) },
  "17": { code: [38, 48], lab: { verm1: 3, shot: "verm1_p3_play.png", keys: { en: "A starts a game; steer with the joystick", it: "A avvia una partita; guidate con il joystick" },
    see: { en: "a title screen; after A, a worm of three cells that grows by one at every meal; biting the body ends the game, and A returns to the title.",
      it: "una schermata del titolo; dopo A, un verme di tre celle che cresce di una a ogni pasto; mordere il corpo fa finire la partita, e A riporta al titolo." } } },
  "18": { drop: [10, 11, 14, 27], code: [21, 24],
    lab: lab("l18", NONE, { it: "tre barre, otto pixel per unità: x = 5 (bianca), y = 7 (bianca) e z = 12 (verde), calcolata dalle sette istruzioni della slide." }) },
  "19": { drop: [9, 22, 28], code: [8, 13, 14],
    lab: lab("l19", NONE, { it: "quattro righe di 32 lampade, il codice macchina di lw t1, 0(t0) / addi t1, t1, 1 / sw t1, 0(t0) / ret, e accanto a ciascuna un quadrato verde: la parola in memoria è quella decodificata a mano a lezione." }) },
  "20": { lab: lab("l20", NONE, { it: "un solo pixel rosso a x = 100, y = 50 su uno schermo nero. Guardate da vicino." }) },
  "21": { lab: lab("l21", { en: "LEFT moves the square; A plays a note", it: "LEFT muove il quadrato; A suona una nota" },
    { it: "un quadrato giallo al centro dello schermo. LEFT lo sposta a sinistra; A suona una nota, e il quadrato continua a muoversi mentre la nota suona." }) },
  "22": { code: [38, 47], lab: { verm1: 4, shot: "verm1_p4_play.png", keys: { en: "A starts a game; steer with the joystick", it: "A avvia una partita; guidate con il joystick" },
    see: { en: "the finished game: the score and the best score in digits, a worm that goes faster as the score grows, a short note for a meal and a long low one for the end.",
      it: "il gioco finito: il punteggio e il punteggio migliore in cifre, un verme che va più veloce al crescere del punteggio, una nota breve per un pasto e una lunga e grave per la fine." } } },
  "23": { lab: { store: true, shot: "verm1_icon.png", keys: { en: "A starts a game; steer with the joystick", it: "A avvia una partita; guidate con il joystick" },
    see: { en: "Verm1, started from the files of the bundle: on each host the title, the icon and the credits are those of the manifest.",
      it: "Verm1, avviato dai file del bundle: su ogni host il titolo, l'icona e i crediti sono quelli del manifesto." } } },
  "24": { drop: [9, 17, 22, 24, 27, 30, 32, 35, 37, 38], code: [41],
    lab: lab("l24", NONE, { it: "un quadrato verde: i 960 byte della mappa, riempiti di uni da init, sono stati tutti posti a zero dal ciclo di quattro istruzioni della lezione. Un quadrato rosso vorrebbe dire che qualche byte è sopravvissuto." }) },
};
