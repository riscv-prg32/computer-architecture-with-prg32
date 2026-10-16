# Lezione 18: Il processore: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: accumulatore, pila, registri; il modello del processore; i registri di RISC-V; la convenzione di chiamata; la pila; il processore RV32. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: interruzioni e trap (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Il processore: il codice

Questa è la presentazione del codice della Lezione 18. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l18.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: z = x + y

Per calcolare z = x + y il programma carica x in un registro, carica y in un altro, somma i due registri in un terzo, e memorizza il risultato in z. Sette righe per una somma. La memoria è toccata solo da `lw` e `sw`; l'aritmetica avviene solo tra registri. Altri processori fanno lo stesso lavoro con tre istruzioni, o con una. Perché RISC-V è fatto così? Per rispondere servono un modello di che cos'è un processore, e poi un confronto tra modi diversi di costruirne uno.

## Slide 4: Push e pop in RISC-V

In RISC-V il puntatore allo stack `sp` contiene l'indirizzo dell'ultima locazione occupata, e lo stack cresce verso gli indirizzi bassi. Un push sono due istruzioni: si sottrae 4 da `sp`, poi si memorizza sulla nuova cima. Un pop è il contrario: si carica dalla cima, poi si somma 4. La tabella confronta tre processori: a RISC-V servono due istruzioni, al 68000 un'istruzione con un modo di indirizzamento speciale, a x86 un'istruzione dedicata. In pratica una funzione RISC-V alloca il suo intero frame in una volta, come fate dalla Lezione 02.

## Slide 5: z = x + y in quattro processori

La somma del riscaldamento in quattro macchine. La macchina ad accumulatore: carica x, somma y, memorizza z. La macchina a stack: push di x, push di y, somma, pop in z. Una macchina a registri con operandi in memoria: sposta x in un registro, vi somma y, sposta il registro in z. RISC-V: due load, una somma tra registri, uno store. Gli accessi alla memoria sono tre in tutti i casi. Cambia il numero di istruzioni e quanto fa ciascuna: in RISC-V ognuna fa una cosa sola.

## Slide 6: Il programma completo: l18.S (1 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l18.S (2 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l18.S (3 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l18.S (4 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 11: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 12: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 13: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 14: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 15: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Scrivete l'espressione z = (a + b) - (c + d) per una macchina ad accumulatore, una a stack e RISC-V, contando istruzioni e accessi alla memoria. Scrivete push e pop di due registri tenendo `sp` multiplo di 16. Classificate per funzione i registri del vostro ultimo programma. Eseguite passo-passo in PRG32-QT una chiamata e il suo ritorno, osservando `pc`, `ra` e `sp`. E cercate il processore del vostro telefono o portatile.
