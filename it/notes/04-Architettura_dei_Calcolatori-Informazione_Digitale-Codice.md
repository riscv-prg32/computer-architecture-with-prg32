# Lezione 04: Rappresentare l'informazione digitale: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Rappresentare l'informazione digitale: il codice

Questa è la presentazione del codice della Lezione 04. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l04.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un vettore in memoria, un elemento in un registro

Un vettore di quattro parole, e le quattro istruzioni che leggono l'elemento 2. `la` carica l'indirizzo del primo elemento. L'indice viene moltiplicato per 4, la dimensione in byte di una parola, con uno scorrimento a sinistra di 2: scorrere di una posizione raddoppia un numero binario. `add` forma l'indirizzo dell'elemento, e `lw` ne legge il valore, 34. L'espressione `scores[i]` di un linguaggio di alto livello è esattamente questo. Notate che cosa manca: nessuno controlla che l'indice sia minore di 4.

## Slide 4: Un algoritmo probabilistico: n è primo?

Due esempi di algoritmi che usano il caso. Il primo verifica se un numero è primo provando valori casuali: se una prova fallisce, il numero è certamente composto; se trenta prove passano, è primo con probabilità schiacciante. Barattare una minima probabilità d'errore con un grande guadagno di velocità è il modo in cui la crittografia lavora in pratica. Il secondo è un cammino casuale: il percorso è diverso a ogni esecuzione, e una simulazione media molte esecuzioni. Il listato è pseudocodice, non un linguaggio che si possa compilare.

## Slide 5: Il programma completo: l04.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 6: Il programma completo: l04.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l04.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 9: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 10: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 11: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 12: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 13: Esercizi su PRG32

Quattro esercizi sulla cartuccia della Lezione 02. Calcolate a mano un valore RGB565 prima di provarlo: scegliete le tre intensità, scrivete i campi in binario, raggruppate per quattro. Stampate il vostro nome e contate i byte, terminatore compreso. Dichiarate un vettore di colori con `.word` e leggetelo con `lw`, come nella slide del vettore. Infine guardate la stringa e il vettore nella vista della memoria di PRG32-QT: trovate lo zero finale, e verificate che ogni parola mostri per primo il byte meno significativo.
