# Lezione 17: Verm1, parte 3: un corpo, regole e stati

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 3: un corpo, regole e stati

Il terzo tutorial trasforma Verm1 in un vero gioco. Finora il verme era una sola cella e niente poteva andare storto. Oggi nel progetto entra la memoria: il verme prende un corpo che segue la testa e cresce, mordersi fa finire la partita, e il programma acquista una schermata del titolo e una di fine partita. La frase di Brooks in copertina è il motto del giorno: scegliete bene le strutture dati, e il codice quasi si scrive da solo. Ne incontrerete due, un anello e una mappa.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Un verme con un corpo che segue la testa e cresce di una cella a ogni pasto. Un gioco che si può perdere. Tre schermate, titolo, gioco e game over, collegate dal pulsante A. Il cibo che non compare mai sul verme. E un punteggio migliore, conservato finché la cartuccia resta in memoria. È il passo più grande del progetto: il file circa raddoppia di lunghezza, quindi seguite i passi ed eseguite il programma ogni volta che una slide lo dice.

## Slide 3: Che cosa prende la Parte 3 dalle lezioni

Le idee del blocco su stato e memoria, e dove compaiono oggi. La macchina a stati finiti della Lezione 13 diventa i tre stati del gioco. Il fronte, un cambiamento e non un livello, diventa «A premuto adesso e non un frame fa». Il registro che conserva un valore per il clock successivo diventa `prev_btn`. La memoria come vettore di byte diventa il corpo e la mappa del mondo. E la differenza tra ciò che resta nel file e ciò che vive in RAM diventa `.rodata`, `.data` e il punteggio migliore.

## Slide 4: Dove state andando

Le tre schermate che state per costruire: il titolo con il suo invito, il gioco con un verme di sette celle dopo quattro pasti, e il game over. Sono un solo programma in tre stati. Partite da una Parte 2 che gira; se la vostra non gira, copiate il file di riferimento della Parte 2.

## Slide 5: Il corpo è un anello di 256 elementi

Il corpo è memorizzato in due vettori di 256 byte, `body_x` e `body_y`: l'elemento k contiene la colonna e la riga di un segmento. Non si sposta mai nulla. Due numeri descrivono il verme: `head_i`, l'elemento della testa, e `length`, il numero di elementi in uso; la coda è l'elemento `head_i - length + 1`. Un passo scrive un elemento nuovo dopo la testa e fa avanzare `head_i`. Se il verme ha mangiato la coda resta; altrimenti avanza anche lei. Dopo l'elemento 255 viene l'elemento 0, cioè un AND con 255: il vettore è un *anello*.

## Slide 6: Il mondo è una mappa di 960 byte

Per sapere se la nuova testa tocca il corpo, il programma potrebbe confrontarla con ogni segmento: fino a 255 confronti a ogni passo. Tiene invece una mappa del mondo: un byte per ciascuna delle 960 celle, 1 se c'è un segmento e 0 se no. La cella in colonna c della riga r è il byte numero r per 40 più c. Un passo pone a 1 un byte e ne azzera uno, e il test di collisione diventa un solo load. È il classico scambio di memoria con tempo. Il prezzo: mappa e anello devono essere sempre d'accordo.

## Slide 7: Il gioco è una macchina a tre stati

Il diagramma degli stati del gioco, come nella Lezione 13: TITLE va a PLAY quando si preme A; PLAY va a OVER quando il verme si morde; OVER torna a TITLE quando si preme A. La tabella aggiunge l'azione di ogni transizione. Un dettaglio decide se la macchina funziona: «A premuto» significa giù adesso e su un frame fa, un fronte e non un livello. Altrimenti tenendo premuto A si attraverserebbero gli stati uno per frame.

## Slide 8: Guardare l'anello girare

Mettete un breakpoint sulla prima istruzione di `step` e riprendete: il programma ora si ferma una volta per passo del verme. Aprite la memoria all'indirizzo di `body_x`: dopo l'iniziale 03 04 05 compare un byte nuovo a ogni passo. Girate verso il basso: `body_x` ripete la stessa colonna, mentre `body_y`, 256 byte più avanti, conta le righe. Mangiate, e confrontate `head_i` e `length` prima e dopo: sono cresciuti entrambi di uno. I vecchi byte non vengono mai cancellati: l'anello conserva la storia degli ultimi 256 passi.

## Slide 9: Cogliere il fronte del pulsante A

Il fronte del pulsante A, frame per frame. Finché A è su tutto vale zero. Nel frame in cui A scende, `s0` vale 0x10 e `prev_btn` vale ancora 0: l'AND con la negazione dà 0x10, e la transizione avviene. Nei frame successivi A è ancora giù, ma ora anche `prev_btn` vale 0x10, e il risultato è zero. Un fronte, una transizione, per quanto a lungo si tenga premuto il pulsante.

## Slide 10: Tre domande per il debugger

Tre domande a cui rispondere con il debugger. Dov'è `state`, e che cosa contiene mentre giocate e perdete? La mappa è coerente con l'anello: il byte alla riga per 40 più la colonna della testa contiene 1? Che cosa ha visto il passo fatale: alla `lbu` dopo la seconda `mul` in `step`, `t1` vale 1 una volta sola, al morso. L'ultima riga è un principio: un programma è giusto quando è giusta la sua memoria.

## Slide 11: Verifica la comprensione: head_i = 1 e length = 4. Quali elementi dell'anello contengono il verme? / Quale byte di grid descrive la cella in colonna 7 della riga 3?

Calcolate prima la coda: `head_i - length + 1` è 1 meno 4 più 1, cioè meno 2. Mascherato con 255 diventa 254. Da lì contate quattro elementi in avanti, rientrando dopo il 255.

La formula della mappa: riga per 40 più colonna. Non scambiate le due: l'opzione con 283 è 7 per 40 più 3.

## Slide 12: Verifica la comprensione: Il giocatore tiene premuto A per due secondi sulla schermata del titolo. Che cosa accade? / Perché il byte della coda viene azzerato prima di esaminare quello della testa?

Ragionate in termini di fronti. A è giù per molti frame, ma solo nel primo è «giù adesso e su un frame fa».

In un passo la coda lascia una cella e la testa ne occupa una. Se sono la stessa cella, quale delle due operazioni va fatta per prima perché la mossa sia lecita?

## Slide 13: Dove siamo, e che cosa viene dopo

Dove siete. Verm1 ora è un gioco, con uno scopo, un rischio, un inizio e una fine, e ne sapete spiegare ogni riga. È logica sequenziale e memoria scritte come programma: una macchina a tre stati, un anello di byte, una mappa. Tre cose sono ancora grezze: l'intero schermo viene ridisegnato a ogni frame, il punteggio è una fila di tacche, la velocità non cambia mai. Le prossime quattro lezioni aprono la macchina che esegue il vostro codice, e la Parte 4 finisce il gioco.
