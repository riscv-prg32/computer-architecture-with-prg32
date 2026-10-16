# Lezione 17: Verm1, parte 3: un corpo, regole e stati

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli array in memoria; macchine a stati finiti; .text, .rodata, .data; latch e flip-flop; la virgola fissa. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1, parte 3: un corpo, regole e stati

Il terzo tutorial trasforma Verm1 in un vero gioco. Finora il verme era una sola cella e nulla poteva andare storto. Oggi la memoria entra nel progetto: il verme acquista un corpo che segue la testa e cresce, mordersi pone fine alla partita, e il programma guadagna una schermata del titolo e una di fine partita. La frase di Fred Brooks in copertina è il principio guida della sessione: si scelgano bene le strutture dati, e il codice si scrive quasi da sé. Si introducono due di queste strutture, un anello e una mappa, e il tutorial è in gran parte uno studio di come il loro progetto dia forma al codice.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Un verme con un corpo che segue la testa e cresce di una cella a ogni pasto. Un gioco che si può perdere. Tre schermate, titolo, gioco e fine partita, collegate dal pulsante A. Un cibo che non compare mai sul verme. E un punteggio migliore, conservato finché la cartuccia resta in memoria. È il passo più grande del progetto: il file raddoppia circa di lunghezza, quindi i passi vanno seguiti in ordine e il programma eseguito ogni volta che una slide lo chiede.

## Slide 3: Che cosa prende la Parte 3 dalle lezioni

Le idee del blocco su stato e memoria, e dove compaiono oggi. La macchina a stati finiti della Lezione 13 diventa i tre stati del gioco. Il fronte, un cambiamento e non un livello, diventa "A premuto ora e non un frame fa". Il registro che conserva un valore fino al clock successivo diventa `prev_btn`. La memoria come array di byte, dalla Lezione 15, diventa il corpo e la mappa del mondo. E la distinzione tra ciò che resta nel file e ciò che vive in RAM, dalla Lezione 16, diventa `.rodata`, `.data` e il punteggio migliore.

## Slide 4: Dove state andando

Le tre schermate da costruire: il titolo con il suo invito, il gioco con un verme di sette celle dopo quattro pasti, e la schermata di fine partita. Sono un solo programma in tre stati. La sessione parte da una Parte 2 funzionante; uno studente il cui file non gira copia il file di riferimento della Parte 2.

## Slide 5: Il corpo è un anello di 256 elementi

Il corpo è memorizzato in due array di 256 byte, `body_x` e `body_y`, e la voce k contiene colonna e riga di un segmento. Nulla viene mai fatto scorrere. Due numeri descrivono il verme: `head_i`, l'indice della testa, e `length`, il numero di voci in uso, così che la coda sia la voce `head_i - length + 1`. Un passo scrive una nuova voce dopo la testa e fa avanzare `head_i`; se il verme ha mangiato la coda resta, altrimenti avanza anch'essa. Dopo la voce 255 viene la voce 0, un AND con 255: l'array è un *anello*, o buffer circolare. Ogni passo costa un tempo costante, qualunque sia la lunghezza del verme.

## Slide 6: Il mondo è una mappa di 960 byte

Per stabilire se la nuova testa tocca il corpo, il programma potrebbe confrontarla con ogni segmento, fino a 255 confronti per passo. Tiene invece una mappa del mondo: un byte per ciascuna delle 960 celle, 1 se un segmento la occupa e 0 altrimenti. La cella nella colonna c della riga r è il byte r × 40 + c. Un passo pone a 1 un byte e ne azzera un altro, e il test di collisione diventa un solo caricamento. È il classico scambio di memoria con tempo. Il suo prezzo è un invariante da mantenere: mappa e anello devono sempre concordare.

## Slide 7: Il gioco è una macchina a tre stati

Il diagramma degli stati del gioco, come nella Lezione 13: TITLE passa a PLAY quando si preme A; PLAY passa a OVER quando il verme si morde; OVER torna a TITLE quando si preme A. La tabella aggiunge l'azione associata a ogni transizione. Un dettaglio decide se la macchina funziona: "A premuto" deve significare premuto ora e rilasciato un frame fa, un fronte e non un livello. Altrimenti tenere premuto A attraverserebbe gli stati al ritmo di uno per frame, il difetto anticipato nel riscaldamento della Lezione 13.

## Slide 8: Guardare l'anello girare

Si pone un breakpoint sulla prima istruzione di `step` e si riprende l'esecuzione: il programma ora si ferma una volta per passo del verme. Si apre la vista della memoria all'indirizzo di `body_x`: dopo i 03 04 05 iniziali, a ogni passo compare un nuovo byte. Girando verso il basso, `body_x` ripete la stessa colonna mentre `body_y`, 256 byte più avanti, conta le righe. Dopo un pasto si confrontano `head_i` e `length` prima e dopo: entrambi sono aumentati di uno. I vecchi byte non si cancellano mai, così l'anello registra la storia degli ultimi 256 passi.

## Slide 9: Cogliere il fronte del pulsante A

Il fronte del pulsante A, frame per frame. Finché A è rilasciato, tutto è zero. Nel frame in cui A viene premuto, `s0` vale 0x10 e `prev_btn` vale ancora 0: l'AND con la negazione dà 0x10, e la transizione avviene. Nei frame successivi A resta premuto, ma ora anche `prev_btn` vale 0x10, e il risultato è zero. Un fronte, una transizione, per quanto a lungo si tenga premuto il pulsante: il rilevatore di fronti della Lezione 13, con una parola di memoria come flip-flop e il frame come clock.

## Slide 10: Tre domande per il debugger

Tre domande a cui rispondere con il debugger. Dov'è `state`, e che cosa contiene durante il gioco e dopo aver perso? La mappa è coerente con l'anello, cioè il byte in riga × 40 + colonna della testa contiene 1? Che cosa ha osservato il passo fatale: all'`lbu` dopo la seconda `mul` in `step`, `t1` vale 1 esattamente una volta, al morso. L'ultima riga enuncia un principio che va ben oltre questo gioco: un programma è corretto quando la sua memoria è corretta, e i suoi invarianti sono ciò che rende la memoria verificabile.

## Slide 11: Verifica la comprensione: head_i = 1 e length = 4. Quali elementi dell'anello contengono il verme? / Quale byte di grid descrive la cella in colonna 7 della riga 3?

Per la prima domanda si calcola prima la coda: `head_i - length + 1` è 1 - 4 + 1 = -2, che mascherato con 255 diventa 254. Da lì si contano quattro voci in avanti, ricominciando dopo 255.

Per la seconda vale la formula della mappa: riga × 40 + colonna. Le due non vanno scambiate; l'opzione con 283 è 7 × 40 + 3.

## Slide 12: Verifica la comprensione: Il giocatore tiene premuto A per due secondi sulla schermata del titolo. Che cosa accade? / Perché il byte della coda viene azzerato prima di esaminare quello della testa?

Per la prima domanda si ragiona in termini di fronti. A resta premuto per molti frame, ma solo nel primo di essi è "premuto ora e rilasciato un frame fa".

Per la seconda: in un passo la coda libera una cella e la testa ne occupa una. Se sono la stessa cella, la domanda è quale delle due operazioni debba venire prima perché la mossa sia lecita.

## Slide 13: Dove siamo, e che cosa viene dopo

La situazione attuale. Verm1 è ora un gioco, con un obiettivo, un rischio, un inizio e una fine, e ogni sua riga si può spiegare. È logica sequenziale e memoria espresse come programma: una macchina a tre stati, un anello di byte, una mappa. Restano tre aspetti grezzi: l'intero schermo viene ridisegnato a ogni frame, il punteggio è una fila di tacche, e la velocità non cambia mai. Le prossime quattro lezioni aprono la macchina che esegue il codice, e la Parte 4 completa il gioco.
