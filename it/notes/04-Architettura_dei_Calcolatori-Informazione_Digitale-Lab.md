# Lezione 04: Rappresentare l'informazione digitale: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: analogico e digitale; bit, byte, parola; l'esadecimale; la notazione posizionale; un colore è un numero; caratteri e stringhe; l'ordine little-endian; le strutture dati; gli array in memoria; gli algoritmi. DA UTILIZZARE OGGI: shift come moltiplicazione (Lezione 05) e, usati senza essere studiati nel corso, il programma completo, gli strumenti di PRG32. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentare l'informazione digitale: il codice

Questa è la presentazione del codice della Lezione 04. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l04.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un vettore in memoria, un elemento in un registro

Un array di quattro parole, e le quattro istruzioni che leggono l'elemento 2. `la` carica l'indirizzo base, quello del primo elemento. L'indice viene moltiplicato per 4, la dimensione di una parola in byte, con uno scorrimento a sinistra di due posizioni, perché far scorrere un numero binario di una posizione a sinistra lo raddoppia; la proprietà si dimostra nella Lezione 05 e qui si usa. `add` forma l'indirizzo dell'elemento, base più indice scalato, e `lw` ne legge il valore, 34. L'espressione di alto livello `scores[i]` si traduce esattamente in questa sequenza. Ciò che manca è altrettanto istruttivo: nulla verifica che l'indice sia minore di 4, quindi un indice fuori intervallo legge in silenzio ciò che segue l'array in memoria.

## Slide 4: Un algoritmo probabilistico: n è primo?

Due esempi di algoritmi che usano deliberatamente il caso. Il primo verifica se un numero è primo provando basi casuali: se un test fallisce, il numero è certamente composto; se trenta test passano, è primo con probabilità schiacciante. Accettare una probabilità d'errore trascurabile in cambio di un grande guadagno di velocità è pratica corrente in crittografia, dove le librerie reali usano la variante di Miller-Rabin del test. Il secondo è una passeggiata aleatoria: il percorso cambia a ogni esecuzione, e una simulazione ne stima le proprietà facendo la media di molte esecuzioni. Il listato è pseudocodice, pensato per esprimere l'algoritmo e non per essere compilato.

## Slide 5: Il programma completo: l04.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 6: Il programma completo: l04.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l04.S (3 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 9: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 10: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 11: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 12: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 13: Esercizi su PRG32

Quattro esercizi sulla cartuccia della Lezione 02. Un valore RGB565 si calcola a mano prima di provarlo: si scelgono le tre intensità, si scrivono i campi in binario e si raggruppano i bit a quattro a quattro per ottenere la costante esadecimale. Si stampa il proprio nome e se ne contano i byte, terminatore compreso. Si dichiara con `.word` un array di colori e lo si legge con `lw`, seguendo lo schema della slide sull'array. Infine si individuano la stringa e l'array nella vista della memoria di PRG32-QT, dove si deve trovare lo zero finale e vedere che ogni parola presenta per primo il byte meno significativo, a conferma dell'ordine little-endian.
