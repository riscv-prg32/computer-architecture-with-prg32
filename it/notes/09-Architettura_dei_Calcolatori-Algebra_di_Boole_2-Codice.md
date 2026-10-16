# Lezione 09: Elementi di algebra di Boole: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il sommatore; le funzioni booleane; le forme canoniche; minimizzazione, Karnaugh. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Elementi di algebra di Boole: il codice

Questa è la presentazione del codice della Lezione 09. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l09.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Somma a un bit senza add

La somma di due bit può valere 0, 1 o 2, quindi il risultato richiede due bit. `xor` dà il bit basso, che vale 1 quando i due ingressi sono diversi; `and` dà il bit alto, il riporto, che vale 1 solo quando entrambi valgono 1. Il commento sotto il codice è una tabella di verità con due uscite: verificatene le quattro righe. Questa coppia di porte ha un nome, *semisommatore*. L'ultima nota enuncia il problema del giorno: qui le porte erano date; come si trovano quando si conosce solo la tabella?

## Slide 4: Un sommatore completo, una porta per istruzione

Il sommatore completo scritto come cinque istruzioni, una per porta: due `xor` per la somma, due `and` e una `or` per il riporto uscente. Il programma è lo schema, letto da sinistra a destra. Permette di esercitare entrambi i problemi della Lezione 08. Analisi: eseguitelo passo-passo in PRG32-QT per le otto combinazioni di ingresso e compilate la tabella di verità. Sintesi: ricavate queste porte dalla tabella. Con registri interi in ingresso, le stesse cinque righe lavorano su tutte e trentadue le posizioni di bit insieme.

## Slide 5: Il programma completo: l09.S (1 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 6: Il programma completo: l09.S (2 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l09.S (3 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l09.S (4 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l09.S (5 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l09.S (6 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 12: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 13: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 14: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 15: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 16: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Scrivete le forme canoniche delle due uscite del sommatore completo. Minimizzate il riporto uscente con una mappa di tre variabili e contate le porte risparmiate. Minimizzate una funzione di quattro variabili data come elenco di mintermini: ricordate gli angoli. Costruite NOT, AND e OR usando solo porte NAND e verificate ciascuno con una tabella di verità. Poi programmate il sommatore completo su PRG32 e mostratene le uscite come lampade per le otto combinazioni di ingresso.
