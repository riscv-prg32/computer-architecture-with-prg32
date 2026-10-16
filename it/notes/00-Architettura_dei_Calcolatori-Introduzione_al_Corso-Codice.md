# Lezione 00: Introduzione al corso: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il metodo: prima il programma; le regole del corso. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: i componenti di PRG32 (Lezione 01); RISC e un ISA aperto (Lezione 03); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Introduzione al corso: il codice

Questa è la presentazione del codice della Lezione 00. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l00.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Prima della prossima lezione: installiamo tutto insieme

Il compito per la prossima lezione, che è un'installazione pratica. Portate il portatile, carico, su cui avete il permesso di installare programmi. Scaricate l'installatore di PRG32-QT per il vostro sistema. A casa, con una buona connessione, avviate il lungo scaricamento di ESP-IDF, seguendo il README di PRG32. Se qualcosa non va, non perdeteci una serata: portate il messaggio d'errore esatto e lo si risolve in aula. Il risultato atteso è scritto in fondo: dopo la Lezione 01 ognuno ha PRG32-QT funzionante e una cartuccia compilata sulla propria macchina.

## Slide 4: Il programma completo: l00.S (1 di 2)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 5: Il programma completo: l00.S (2 di 2)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 6: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 7: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 8: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 9: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 10: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.
