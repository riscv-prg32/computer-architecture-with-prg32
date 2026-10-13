# Lezione 15: La memoria: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: La memoria: il codice

Questa è la presentazione del codice della Lezione 15. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l15.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Leggere la stessa memoria come parola e come byte

`value` è una parola che contiene 0x12345678. `lw` la carica tutta in `t1`. Poi tre istruzioni `lbu` caricano byte singoli, all'indirizzo della parola, a quell'indirizzo più 1 e più 3: danno 0x78, 0x56 e 0x12. Ne seguono due fatti. Una parola occupa quattro indirizzi consecutivi, perché la memoria si indirizza byte per byte. E il byte all'indirizzo più basso è il meno significativo: l'ordine little-endian. Aprite la vista della memoria di PRG32-QT all'indirizzo contenuto in `t0` e vedrete 78 56 34 12.

## Slide 4: Parole allineate e non allineate

Una parola è *allineata* quando comincia a un indirizzo multiplo della propria dimensione: un multiplo di 4 per le parole di 32 bit. Una parola allineata si preleva con un solo accesso; una non allineata sta a cavallo di due parole di memoria. In RISC-V l'assemblatore allinea per voi i dati `.word`, e un load da un indirizzo disallineato è, secondo il processore, più lento oppure rifiutato. Il codice a destra mostra il caso tipico: dopo una stringa di sei byte, `.balign 4` salta due byte perché la parola successiva sia allineata.

## Slide 5: Prelevare una parola: lw t1, 0(t0)

I sei passi di `lw t1, 0(t0)`. La ALU calcola l'indirizzo e lo mette in MA. MA pilota il bus indirizzi. L'unità di controllo alza l'abilitazione alla lettura. La memoria decodifica l'indirizzo e mette la parola sul bus dati. Il dato viene catturato in MB. MB viene copiato in `t1`. Uno store è simmetrico: l'indirizzo va in MA, il dato in MB, si alza l'abilitazione alla scrittura, e la memoria memorizza ciò che trova sul bus dati. Il tempo di accesso è quello che trascorre tra il secondo e il quinto passo.

## Slide 6: Dove stanno le cose sull'ESP32-C6 (semplificato)

Una mappa semplificata degli indirizzi dell'ESP32-C6. Gli indirizzi che cominciano con 0x4000 sono la ROM con il codice che avvia il chip; 0x4080 è la SRAM, dove viene caricata la vostra cartuccia; 0x4200 è la flash esterna con il firmware; 0x6000 sono i registri delle periferiche. Le stesse trentadue linee di indirizzo raggiungono tutto, e le stesse `lw` e `sw` fanno funzionare tutto. L'indirizzo della cartuccia visto nel debugger, 0x40800000, è l'inizio della RAM.

## Slide 7: Il programma completo: l15.S (1 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l15.S (2 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l15.S (3 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l15.S (4 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Il programma completo: l15.S (5 di 5)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 12: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 13: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 14: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 15: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 16: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 17: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Calcolate linee di indirizzo, linee di dati e bit totali di una memoria di 4 KiB parole di 16 bit. Scrivete, in ordine di indirizzo, i byte memorizzati da una parola e da una stringa su una macchina little-endian. Elencate i passi di uno store sull'interfaccia processore-memoria. In PRG32-QT trovate il vostro contatore nella vista della memoria e guardatene cambiare i quattro byte. E memorizzate una parola, rileggetela come quattro byte, ricostruitela con scorrimenti e OR, e verificate che coincida.
