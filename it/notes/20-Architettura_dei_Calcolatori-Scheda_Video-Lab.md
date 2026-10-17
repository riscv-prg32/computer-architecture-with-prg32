# Lezione 20: I bus e la scheda video: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il frame buffer; i controllori delle periferiche; bus e banda; la scheda video; GPU e GPGPU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) spiegare perché i dispositivi stanno dietro ai controllori e come il processore dialoga con loro; (2) calcolare la dimensione di un frame buffer e la banda di un segnale video; (3) descrivere che cosa fanno una scheda video e una GPU. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 21, Ingresso e uscita.

Il filo della lezione: Ogni rettangolo disegnato dalla Lezione 02 è finito in un frame buffer che un controllore invia allo schermo molte volte al secondo. Prossimo passo: gli altri dispositivi: display, tastiere, stampanti.

## Slide 1: I bus e la scheda video: il codice

Questa è la presentazione del codice della Lezione 20. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l20.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Un pixel, per favore

Il riscaldamento. Le prime quattro righe appartengono al programma: x in `a0`, y in `a1`, un colore in `a2`, e una chiamata a `prg32_gfx_pixel`. La seconda metà mostra in linea di principio, non come sorgente letterale del runtime, che cosa se ne fa: y si moltiplica per 320, si somma x, si somma l'indirizzo base del frame buffer, e lì si memorizza un byte. Lo schermo è quindi un array in memoria con un elemento per pixel, e disegnare un pixel è un'istruzione di memorizzazione. Nulla compare finché il frame non viene trasmesso al display. In un PC, conservare il frame e trasmetterlo sono le due funzioni della scheda video.

## Slide 4: Il programma completo: l20.S (1 di 2)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 5: Il programma completo: l20.S (2 di 2)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 6: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 7: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 8: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 9: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 10: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 11: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Calcolare la memoria di un frame 4K in True Color e i byte al secondo richiesti a 60 frame al secondo. Calcolare quanto impiega il bus del display di PRG32 a inviare 20 righe. Disegnare una linea diagonale pixel per pixel. Riempire lo schermo una volta con una sola chiamata e una volta con 64.000 chiamate, e confrontare i frame al secondo, il che rende quantitativo il costo delle chiamate per pixel. Infine modificare una voce della palette a ogni frame: ogni pixel che la usa cambia insieme agli altri senza essere ridisegnato, il che dimostra la potenza dell'indirezione che un frame buffer indicizzato offre.
