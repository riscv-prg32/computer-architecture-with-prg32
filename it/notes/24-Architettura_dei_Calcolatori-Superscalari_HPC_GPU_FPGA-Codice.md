# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: l'equazione delle prestazioni; i processori superscalari; le istruzioni vettoriali; HPC e legge di Amdahl; acceleratori GPU e FPGA. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA: il codice

Questa è la presentazione del codice della Lezione 24. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l24.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Il ciclo che svuota la mappa

Il ciclo che svuota la mappa in `new_game`: 960 byte messi a zero. Quattro istruzioni per giro: lo store di un byte, l'incremento dell'indirizzo, il decremento del contatore, il salto all'indietro. In tutto 3.840 istruzioni, un byte alla volta, un'istruzione alla volta. Sul kit impiega circa 24 microsecondi, e nessuno ha bisogno che sia più veloce. È stato scelto perché è abbastanza piccolo da poterlo seguire su ogni macchina di oggi. In quanti modi lo si può rendere più veloce?

## Slide 4: Che cosa si mette di mezzo: le dipendenze

Che cosa si mette di mezzo. La seconda istruzione usa `t0`, che la prima sta ancora calcolando: non può correrle accanto. È una *dipendenza sui dati*. La terza non dipende da nessuno, eppure in un processore in ordine aspetta dietro la seconda. La quarta è un salto: finché non è risolto il processore non sa se la quinta vada eseguita. È una *dipendenza sul controllo*. I programmi veri sono pieni di catene così, quindi la larghezza da sola non basta.

## Slide 5: Ridenominazione dei registri: trentadue nomi, molti registri

La ridenominazione dei registri su un esempio. A sinistra il codice come è scritto: due metà, ciascuna delle quali carica una parola, la incrementa e la memorizza di nuovo, ed entrambe usano `t0`. La seconda metà riusa il nome, non il valore: è una falsa dipendenza. A destra, dopo la ridenominazione, ogni nuovo valore ha il suo registro fisico, e le due metà non condividono nulla, quindi possono essere eseguite nello stesso momento. I trentadue registri che conoscete sono nomi; il chip ha qualche centinaio di registri.

## Slide 6: Lo stesso ciclo, con i vettori

Lo stesso ciclo con l'estensione vettoriale. `v0` è un registro vettoriale, largo molti byte, riempito di zeri. A ogni giro `vsetvli` chiede: dei byte ancora da fare, quanti ne entrano in un registro? La risposta va in `t2`. `vse8.v` memorizza quel numero di byte con una sola istruzione, e l'indirizzo e il contatore avanzano di `t2`. Con registri a 128 bit un giro tratta 16 byte: 60 giri invece di 960. Il codice non dichiara mai la larghezza dei registri, quindi lo stesso programma funziona con qualunque larghezza.

## Slide 7: Una somma, corsia per corsia

Una somma, corsia per corsia. Un registro vettoriale contiene più parole, ciascuna nella sua *corsia* (lane). `vle32.v` carica più parole insieme; `vadd.vv` somma due registri corsia per corsia, così `v1` accumula tante somme parziali quante sono le corsie. Alla fine `vredsum` somma tra loro le corsie in un solo numero. Con i sedici numeri da 1 a 16 il risultato è 136. È la somma parallela che avete visto come figura nella Lezione 04, ora in forma di istruzioni.

## Slide 8: La mappa di Verm1, un thread per cella

La mappa di Verm1 su una GPU. La funzione marcata come kernel gira una volta in ogni thread. Ogni thread calcola anzitutto chi è, il suo indice `i`, dal numero del suo blocco e dalla sua posizione nel blocco; poi, se l'indice sta dentro la mappa, azzera la propria cella. Non c'è un ciclo: ci sono 960 thread. L'ultima riga, sull'host, lancia quattro blocchi di 256 thread. Per 960 byte le due copie costano molto più del lavoro: questo esempio mostra la forma, non un guadagno.

## Slide 9: La regola dell'inversione a U di Verm1, in hardware

La regola di Verm1 che vieta l'inversione a U, scritta come hardware. Verilog è un linguaggio che descrive circuiti, non sequenze di passi. Il modulo ha due ingressi di due bit, la direzione attuale e quella richiesta, e un'uscita. La riga con `assign` è un filo sempre vero: l'uscita vale 1 quando lo XOR delle due direzioni è uguale a 10 in binario. Non c'è un prima e un dopo. Sul kit la stessa regola costava tre istruzioni.

## Slide 10: Svuotare la mappa di Verm1: 960 celle

Svuotare le 960 celle della mappa. Sul kit: un byte per giro, 3.840 cicli. Su un core RISC-V fuori ordine: lo stesso binario, in una frazione di quei cicli. Con vettori a 128 bit: 60 giri. Su una GPU: un lancio di 960 thread, più due copie. Su una FPGA: 960 flip-flop con un reset comune, un ciclo di clock. Il lavoro è lo stesso; cambia quanta parte ne avviene nello stesso momento, e quanto costa ottenerlo. La domanda dell'ingegnere non è quale sia la più veloce, ma quale basti.

## Slide 11: Il programma completo: l24.S (1 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 12: Il programma completo: l24.S (2 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 13: Il programma completo: l24.S (3 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 14: Il programma completo: l24.S (4 di 4)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 15: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 16: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 17: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 18: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 19: I listati vettoriali: provateli sul QEMU originale

I listati vettoriali di questa lezione non possono girare sul kit, il cui processore non ha l'estensione V. Sono provati invece su un processore emulato senza sistema: i comandi compilano un solo binario e lo eseguono con quattro lunghezze di vettore. Il codice di uscita è il risultato.

## Slide 20: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 21: Esercizi: prima su carta, poi sulla macchina

Cinque esercizi. Compilate la tabella di Amdahl per p = 0,95. Disegnate il diagramma della pipeline di un processore di larghezza tre per nove istruzioni indipendenti. Rinominate i registri di un frammento di Verm1 e dite quali istruzioni potrebbero correre nello stesso ciclo. Scrivete la tabella di verità di una tabella di look-up a quattro ingressi per la regola dell'inversione a U. E compilate il test vettoriale ed eseguitelo su QEMU con due larghezze diverse: perché funziona lo stesso binario?
