# Lezione 06: Rappresentazione dei numeri: i reali: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: la virgola fissa; complemento a uno ed eccesso k; la virgola mobile IEEE 754; il nome RV32IMAC. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentazione dei numeri: i reali: il codice

Questa è la presentazione del codice della Lezione 06. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l06.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Tre ottavi di pixel, con soli interi

Un pixel per frame è troppo veloce, e zero non è un movimento: alla palla servono 0,375 pixel per frame. Il trucco è memorizzare la posizione moltiplicata per 256. `ball_update` somma 96 a ogni frame, e 96 diviso 256 fa 0,375. A `ball_draw` servono pixel interi, quindi scorre il valore a destra di 8 posizioni, cioè lo divide per 256, con `srai`. Tutta l'aritmetica è fatta con istruzioni intere. Il suffisso `_q8` nei nomi ricorda che il valore porta otto bit frazionari.

## Slide 4: La palla, bit per bit: Q24.8

La palla vista bit per bit. La parola 0x00002A60 si divide in 24 bit di parte intera, 0x2A, cioè 42 pixel, e 8 bit di frazione, 0x60, cioè 96/256 = 0,375. Come intero la parola vale 10848, e 10848 diviso 256 fa 42,375. La tabella dà le regole: somma e sottrazione funzionano come per gli interi, perché le virgole sono allineate; per ottenere pixel interi si scorre a destra di f; dopo una moltiplicazione si scorre a destra di f, perché il prodotto ha il doppio dei bit frazionari.

## Slide 5: La virgola mobile non è l'insieme dei reali

I numeri in virgola mobile si comportano quasi come i numeri reali, e il «quasi» causa bug veri. 0,1 non ha uno sviluppo binario finito, quindi è memorizzato in modo approssimato, e 0,1 più 0,2 non fa esattamente 0,3, come mostra il codice. Da qui la regola: mai confrontare per uguaglianza due risultati in virgola mobile; si confronta la loro differenza con una tolleranza. La somma non è nemmeno associativa. Per il denaro e per le posizioni in un gioco gli interi scalati, cioè la virgola fissa, sono spesso lo strumento giusto.

## Slide 6: Il programma completo: l06.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l06.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l06.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 10: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 11: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 12: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 13: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 14: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Su carta: scrivete meno 6 nelle quattro codifiche; codificate 10,5 e 0,15625 in singola precisione; decodificate 0xBF800000. Su PRG32: eseguite la palla con tre velocità e contate dopo quanti frame si sposta di un pixel, poi datele una velocità verticale e fatela rimbalzare cambiando segno alla velocità con `neg` ai bordi. I risultati sono nel riquadro verde; ricavateli prima di guardare.
