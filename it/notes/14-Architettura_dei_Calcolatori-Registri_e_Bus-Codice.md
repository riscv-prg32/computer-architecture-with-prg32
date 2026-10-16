# Lezione 14: Macchine elementari: registri e bus: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i registri a scorrimento; i registri come flip-flop; bus e porte three-state. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'I/O mappato in memoria (Lezione 15); memorie e indirizzi (Lezione 15). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Macchine elementari: registri e bus: il codice

Questa è la presentazione del codice della Lezione 14. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l14.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Inviare un byte un bit alla volta

Il ciclo invia un byte un bit alla volta, a partire dal più significativo. A ogni giro il byte viene scorso a destra di 7 e mascherato con 1, il che ne isola il bit più alto; quel bit verrebbe messo su una linea dati e si darebbe un impulso su una linea di clock; poi il byte viene scorso a sinistra di uno, così il bit successivo sale nella posizione più alta. Dopo otto giri tutto il byte è partito. Il ciclo è un registro a scorrimento in software. Il chip del kit contiene hardware che fa la stessa cosa, milioni di volte al secondo.

## Slide 4: I bus del kit PRG32

I bus del kit. Dentro il chip il bus è parallelo. Il display è collegato con SPI, un bus seriale con un clock, una linea dati, un chip select e una linea che distingue i dati dai comandi: ogni pixel di ogni frame vi viaggia bit per bit. L'amplificatore è collegato con I2S, un altro bus seriale, che porta 22.050 campioni audio al secondo. I pulsanti usano un filo ciascuno: una rappresentazione decodificata. USB, anch'esso seriale, porta il firmware e la console di debug.

## Slide 5: Scorrimenti in RISC-V: uno shift register in un'istruzione

Le istruzioni di scorrimento spostano tutti i bit di un registro in un solo passo: `slli` e `srli` riempiono di zeri, `srai` con copie del bit di segno; `sll`, `srl` e `sra` prendono il numero di posizioni da un registro. In hardware non si tratta di una catena di flip-flop, che richiederebbe un impulso di clock per posizione, ma di un *barrel shifter*, una rete combinatoria fatta di strati di multiplexer, ed è una delle unità della ALU. Il codice a destra mostra le due conversioni tra parallelo e seriale.

## Slide 6: Il programma completo: l14.S (1 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 7: Il programma completo: l14.S (2 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 8: Il programma completo: l14.S (3 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l14.S (4 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l14.S (5 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Il programma completo: l14.S (6 di 6)

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

Cinque esercizi. Disegnate un registro a scorrimento a 4 bit con ingresso seriale e uscita parallela e seguitene il contenuto su quattro impulsi di clock. Scrivete i segnali di abilitazione e di caricamento che copiano un registro in un altro su un bus comune. Completate il riscaldamento con il ciclo di ricezione. Su PRG32 mostrate un byte come otto lampade e fatelo scorrere ogni mezzo secondo. Infine fate rientrare da un lato il bit che esce dall'altro: una rotazione, detta anche contatore ad anello.
