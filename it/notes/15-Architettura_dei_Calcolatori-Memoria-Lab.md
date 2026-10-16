# Lezione 15: La memoria: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: memorie e indirizzi; l'ordine little-endian; processore e memoria; l'I/O mappato in memoria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: La memoria: il codice

Questa è la presentazione del codice della Lezione 15. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l15.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Leggere la stessa memoria come parola e come byte

Il riscaldamento. `value` è una parola che contiene 0x12345678. `lw` la carica tutta in `t1`; tre istruzioni `lbu` caricano poi singoli byte all'indirizzo della parola e a quell'indirizzo più 1 e più 3, ottenendo 0x78, 0x56 e 0x12. Ne seguono due fatti. Una parola occupa quattro indirizzi consecutivi, perché la memoria è indirizzata byte per byte. E il byte all'indirizzo più basso è il meno significativo, cioè l'ordine little-endian. Aprendo la vista della memoria di PRG32-QT all'indirizzo contenuto in `t0` si vede 78 56 34 12, così la slide sull'ordine dei byte della Lezione 04 diventa un'osservazione.

## Slide 4: Parole allineate e non allineate

Una parola è *allineata* quando comincia a un indirizzo multiplo della sua dimensione, multiplo di 4 per le parole a 32 bit. Una parola allineata si preleva con un solo accesso; una non allineata si trova a cavallo di due parole di memoria. In RISC-V l'assemblatore allinea automaticamente i dati `.word`, e un caricamento da un indirizzo non allineato è, a seconda dell'implementazione, più lento o rifiutato del tutto; la specifica lascia la scelta all'implementatore, e i programmi corretti tengono allineati i propri dati. Il codice a destra mostra il caso tipico: dopo una stringa di sei byte, `.balign 4` salta due byte così che la parola seguente sia allineata.

## Slide 5: Prelevare una parola: lw t1, 0(t0)

I sei passi di `lw t1, 0(t0)`. La ALU calcola l'indirizzo e lo pone in MA. MA pilota il bus indirizzi. L'unità di controllo attiva read enable. La memoria decodifica l'indirizzo e pone la parola sul bus dati. Il dato viene catturato in MB. MB viene copiato in `t1`. Una memorizzazione è simmetrica: l'indirizzo va in MA, il dato in MB, si attiva write enable, e la memoria memorizza ciò che trova sul bus dati. Il tempo di accesso è l'intervallo tra il secondo e il quinto passo, e la Lezione 19 colloca questi passi dentro il ciclo del processore.

## Slide 6: Dove stanno le cose sull'ESP32-C6 (semplificato)

Una mappa semplificata degli indirizzi dell'ESP32-C6. Gli indirizzi che cominciano con 0x4000 contengono la ROM con il codice di avvio; 0x4080 è la SRAM, in cui viene caricata la cartuccia; 0x4200 è la flash esterna che contiene il firmware; 0x6000 sono i registri delle periferiche. Le stesse trentadue linee di indirizzo raggiungono tutto, e le stesse `lw` e `sw` comandano tutto, il che è l'I/O mappato in memoria in forma concreta. L'indirizzo della cartuccia visto nel debugger, 0x40800000, è l'inizio della RAM.

## Slide 7: Il programma completo: l15.S (1 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l15.S (2 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l15.S (3 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l15.S (4 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Il programma completo: l15.S (5 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 12: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 13: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 14: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 15: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 16: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 17: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Calcolare le linee di indirizzo, le linee di dato e il numero totale di bit di una memoria di 4 Ki parole da 16 bit. Scrivere, in ordine di indirizzo crescente, i byte memorizzati per una parola e per una stringa su una macchina little-endian. Elencare i passi di una memorizzazione sull'interfaccia processore-memoria. In PRG32-QT, individuare il contatore nella vista della memoria e osservarne cambiare i quattro byte. E memorizzare una parola, rileggerla come quattro byte, ricostruirla con scorrimenti e OR, e verificare che il risultato coincida: un esercizio che unisce l'ordine dei byte di questa lezione alle operazioni bit a bit della Lezione 08.
