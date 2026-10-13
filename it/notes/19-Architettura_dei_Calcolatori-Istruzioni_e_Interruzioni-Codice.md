# Lezione 19: Istruzioni e interruzioni: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Istruzioni e interruzioni: il codice

Questa è la presentazione del codice della Lezione 19. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l19.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Quattro parole in memoria

Quattro parole di memoria, a quattro indirizzi di distanza: è `first_update`, la funzione che incrementa un contatore. A sinistra gli indirizzi, al centro il codice macchina, a destra ciò che avete scritto. Il processore ha soltanto la colonna centrale. Tre domande organizzano la lezione. Come fa a sapere che la prima parola è un caricamento e la seconda una somma? Quali passi compie per ciascuna? E mentre le esegue, come si accorge che è stato premuto un pulsante o che è scaduto un timer?

## Slide 4: Decodifica a mano

Due istruzioni decodificate a mano. Si scrivono in binario le otto cifre esadecimali; si staccano gli ultimi sette bit, l'opcode, che dice il formato; poi si tagliano i campi rimanenti. Per 0x006283B3 l'opcode dice da registro a registro, i campi danno x7, x5 e x6, e `funct3` con `funct7` dicono somma: `add t2, t0, t1`. Per 0x0002A303 l'opcode dice load, l'immediato è 0, la base è x5, la destinazione x6: `lw t1, 0(t0)`. Fatelo una volta con carta e matita.

## Slide 5: La fase di prelievo, trasferimento per trasferimento

La fase di prelievo in quattro trasferimenti tra registri, con i registri del modello della Lezione 18. Il contenuto del PC va in MA, il registro degli indirizzi di memoria. La memoria viene letta e la parola arriva in MB, il buffer. La parola viene copiata in D, il registro di decodifica. Il PC viene incrementato di 4, perché un'istruzione occupa quattro byte, così punta alla successiva. Ogni riga è un trasferimento sul bus interno, comandato dall'unità di controllo.

## Slide 6: Il resto del ciclo per due istruzioni

Le altre quattro fasi, affiancate per due istruzioni. Per `add`, la decodifica legge i due registri nei registri operando della ALU, l'esecuzione li somma, la fase di memoria viene saltata, e la somma viene scritta in `t2`. Per `lw`, il secondo operando è l'immediato, la somma è un *indirizzo*, la fase di memoria legge la parola a quell'indirizzo, e la parola letta viene scritta in `t1`. Lo stesso sommatore serve a entrambe: cambiano solo i comandi dell'unità di controllo.

## Slide 7: Un gestore di trap, per sommi capi

Un gestore per sommi capi. Fa spazio sullo stack e salva i registri che sta per usare: la parte software del contesto. Legge `mcause` con `csrr` e ne esamina il segno: il bit più alto è il bit di segno, quindi `bgez` separa le eccezioni dalle interruzioni con una sola istruzione. Dopo aver servito l'evento ripristina i registri, rilascia lo stack ed esegue `mret`. Il programma interrotto non deve accorgersi di nulla: un registro lasciato sporco qui è un errore che compare a caso, ovunque.

## Slide 8: Il programma completo: l19.S (1 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l19.S (2 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l19.S (3 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Il programma completo: l19.S (4 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 12: Il programma completo: l19.S (5 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 13: Il programma completo: l19.S (6 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 14: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 15: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 16: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 17: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 18: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 19: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Decodificate a mano due parole, con formato, campi e assembly. Codificate `sub t0, t1, t2` e `sw a0, 8(sp)`: il percorso inverso. Scrivete i trasferimenti tra registri dell'intero ciclo per uno store e per un salto condizionato. Disegnate il diagramma della pipeline di sei istruzioni su quattro stadi e dite quando termina la sesta. E in PRG32-QT fermatevi in `first_update`, avanzate di un passo, e confrontate il codice macchina mostrato con la vostra decodifica del riscaldamento.
