# Lezione 16: La memoria permanente: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: ROM, flash, firmware; l'architettura di von Neumann; la cache; la memoria secondaria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) classificare le memorie permanenti e dire dove è conservata la cartuccia; (2) spiegare un successo e un fallimento di cache, e la località; (3) confrontare i tempi di accesso di dischi e memorie a stato solido. Si appoggia su: l'architettura di von Neumann (Lezione 03). Prossimo passo: Lezione 17, Verm1, parte 3: un corpo, regole e stati.

Il filo della lezione: La memoria è una gerarchia: piccola e veloce vicino al processore, grande e lenta lontano, e la località fa funzionare il trucco. Prossimo passo: la terza parte di Verm1, che ha bisogno di memoria per un corpo intero.

## Slide 1: La memoria permanente: il codice

Questa è la presentazione del codice della Lezione 16. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l16.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Spegnete e riaccendete il kit

Il riscaldamento. Il titolo risiede nella sezione `.rodata`, che fa parte del file della cartuccia; il file è memorizzato nella flash e quindi sopravvive. Il punteggio migliore è una variabile della sezione `.data`, che viene copiata in RAM all'avvio della cartuccia; vive nella SRAM e si perde. Dopo uno spegnimento e una riaccensione il titolo è ancora presente e il punteggio è tornato a 0. Per conservare un punteggio in modo permanente bisognerebbe scriverlo in una memoria non volatile, e la lezione passa in rassegna le memorie che esistono. La lezione riguarda più del punteggio: ogni sezione di un programma ha una collocazione fisica, e quella collocazione ne determina la durata.

## Slide 4: Il programma completo: l16.S (1 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 5: Il programma completo: l16.S (2 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 6: Il programma completo: l16.S (3 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l16.S (4 di 4)

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

## Slide 13: Esercizi

Cinque esercizi. Calcolare la latenza rotazionale media di un disco a 7.200 giri al minuto, che è il tempo di mezzo giro. Calcolare il tempo di accesso medio di una cache con il 95% di hit, come media pesata dei tempi di hit e di miss. Dire dove risiedono cinque oggetti sul kit: il codice di avvio, il firmware, una cartuccia, una variabile e un registro. Trovare le specifiche della memorizzazione del proprio portatile o telefono. E misurare su PRG32 due cicli su un grande array, uno sequenziale e uno a salti: c'è una differenza, e perché potrebbe non essercene su questo chip particolare, che non ha una cache dei dati davanti alla sua SRAM?
