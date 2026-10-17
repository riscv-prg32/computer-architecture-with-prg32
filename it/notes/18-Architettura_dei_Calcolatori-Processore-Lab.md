# Lezione 18: Il processore: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: accumulatore, pila, registri; il modello del processore; i registri di RISC-V; la convenzione di chiamata; la pila; il processore RV32. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: interruzioni e trap (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) seguire un'istruzione attraverso i blocchi di un processore RV32; (2) usare correttamente lo stack e la convenzione di chiamata; (3) confrontare macchine ad accumulatore, a stack e a registri. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 19, Istruzioni e interruzioni.

Il filo della lezione: Il ra salvato nella Lezione 02 è ora spiegato: lo stack e la convenzione di chiamata sono regole che permettono a funzioni scritte da persone diverse di chiamarsi. Prossimo passo: come un'istruzione è codificata ed eseguita, e come il processore viene interrotto.

## Slide 1: Il processore: il codice

Questa è la presentazione del codice della Lezione 18. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l18.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: z = x + y

Il riscaldamento. Per calcolare z = x + y il programma carica x in un registro e y in un altro, somma i due registri in un terzo, e memorizza il risultato in z: sette righe per una somma. Alla memoria accedono solo `lw` e `sw`; l'aritmetica si svolge solo tra registri. Altri processori svolgono lo stesso compito con tre istruzioni, o con una. Perché RISC-V è progettato così? Rispondere richiede prima un modello di che cosa sia un processore, e poi un confronto tra i diversi modi di costruirne uno, che è il piano della lezione.

## Slide 4: Push e pop in RISC-V

In RISC-V il puntatore allo stack `sp` contiene l'indirizzo dell'ultima locazione occupata, e lo stack cresce verso gli indirizzi bassi. Un push richiede due istruzioni: sottrarre 4 a `sp`, poi memorizzare nella nuova cima. Un pop è l'inverso: caricare dalla cima, poi sommare 4. La tabella confronta tre processori: RISC-V richiede due istruzioni, il 68000 un'istruzione con un modo di indirizzamento a pre-decremento, x86 un'istruzione dedicata. In pratica una funzione RISC-V alloca l'intero frame una volta sola, sedici byte alla volta per rispettare l'allineamento richiesto dalla convenzione di chiamata, come si fa dalla Lezione 02.

## Slide 5: z = x + y in quattro processori

La somma del riscaldamento su quattro macchine. La macchina ad accumulatore: carica x, somma y, memorizza z. La macchina a stack: push x, push y, add, pop z. Una macchina a registri con operandi in memoria: sposta x in un registro, sommagli y, sposta il registro in z. RISC-V: due caricamenti, una somma tra registri, una memorizzazione. In ogni caso si compiono tre accessi alla memoria. Ciò che cambia è il numero di istruzioni e il lavoro che ciascuna svolge: in RISC-V ogni istruzione fa esattamente una cosa, il che permette di eseguirla in fretta e in una pipeline.

## Slide 6: Il programma completo: l18.S (1 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l18.S (2 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l18.S (3 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l18.S (4 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 11: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 12: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 13: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 14: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 15: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Scrivere z = (a + b) - (c + d) per una macchina ad accumulatore, una a stack e RISC-V, contando in ciascuna istruzioni e accessi alla memoria. Scrivere push e pop di due registri mantenendo `sp` multiplo di 16, come richiede la convenzione di chiamata. Classificare per funzione i registri del proprio ultimo programma, distinguendo quelli salvati dal chiamante da quelli salvati dal chiamato. Eseguire passo-passo una chiamata e il suo ritorno in PRG32-QT, osservando `pc`, `ra` e `sp`. E individuare il processore del proprio telefono o portatile, collocandolo tra i modelli della lezione.
