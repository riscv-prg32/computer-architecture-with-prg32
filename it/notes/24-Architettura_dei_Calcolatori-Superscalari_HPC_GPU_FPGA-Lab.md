# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: l'equazione delle prestazioni; i processori superscalari; le istruzioni vettoriali; HPC e legge di Amdahl; acceleratori GPU e FPGA. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA: il codice

Questa è la presentazione del codice della Lezione 24. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l24.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Il ciclo che svuota la mappa

Il riscaldamento: il ciclo in `new_game` che azzera la mappa, ponendo a zero 960 byte. Ogni iterazione esegue quattro istruzioni: una memorizzazione di byte, l'incremento dell'indirizzo, il decremento del contatore e il salto all'indietro, per 3.840 istruzioni in tutto, un byte e un'istruzione alla volta. Sul kit impiega circa 24 microsecondi, e nulla richiede che sia più veloce. È stato scelto perché è abbastanza piccolo da poter essere seguito su ogni classe di macchina contemporanea. La domanda della lezione è: in quanti modi diversi lo si può rendere più veloce?

## Slide 4: Che cosa si mette di mezzo: le dipendenze

Che cosa ostacola l'esecuzione parallela. La seconda istruzione usa `t0`, che la prima sta ancora calcolando, quindi non può eseguirsi accanto a essa: una *dipendenza dei dati*. La terza non dipende da nulla, eppure in un processore in ordine attende dietro la seconda. La quarta è un salto: finché non è risolto, il processore non può sapere se la quinta vada eseguita, una *dipendenza di controllo*. I programmi reali sono pieni di catene del genere, quindi la sola larghezza di emissione non dà velocità; il rimedio è lasciare che le istruzioni indipendenti sorpassino.

## Slide 5: Ridenominazione dei registri: trentadue nomi, molti registri

La ridenominazione dei registri illustrata. A sinistra, il codice così come è scritto: due metà, ciascuna che carica una parola, la incrementa e la riscrive, ed entrambe che usano `t0`. La seconda metà riusa il nome, non il valore, il che costituisce una falsa dipendenza. A destra, dopo la ridenominazione, ogni nuovo valore ha il suo registro fisico, così le due metà non condividono nulla e possono eseguirsi contemporaneamente. I trentadue registri dell'insieme di istruzioni sono nomi; il chip contiene qualche centinaio di registri fisici. I numeri di registro della slide sono illustrativi.

## Slide 6: Lo stesso ciclo, con i vettori

Lo stesso ciclo scritto con l'estensione vettoriale. `v0` è un registro vettoriale, largo molti byte, riempito di zeri. A ogni iterazione `vsetvli` chiede quanti dei byte rimanenti stanno in un registro, e la risposta va in `t2`. `vse8.v` memorizza quei byte in una sola istruzione, e l'indirizzo e il contatore avanzano di `t2`. Con registri a 128 bit un'iterazione tratta 16 byte: 60 iterazioni invece di 960. Il codice non dichiara mai la larghezza dei registri, quindi lo stesso binario è corretto per qualsiasi larghezza, una proprietà detta indipendenza dalla lunghezza del vettore, che il test verifica a quattro larghezze.

## Slide 7: Una somma, corsia per corsia

Una somma calcolata corsia per corsia. Un registro vettoriale contiene più parole, ciascuna nella sua *corsia*. `vle32.v` carica più parole insieme; `vadd.vv` somma due registri corsia per corsia, così che `v1` accumuli tante somme parziali quante sono le corsie. Alla fine `vredsum` riduce le corsie a un solo numero. Con i sedici numeri da 1 a 16 il risultato è 136. È la somma parallela mostrata in figura nella Lezione 04, ora espressa in istruzioni.

## Slide 8: La mappa di Verm1, un thread per cella

La mappa di Verm1 azzerata su una GPU, in CUDA C. La funzione marcata come kernel si esegue una volta in ogni thread. Ogni thread determina per prima cosa la propria identità, il suo indice `i`, dal numero del suo blocco e dalla sua posizione nel blocco; poi, se l'indice cade dentro la mappa, azzera la propria cella. Non c'è alcun ciclo: ci sono 960 thread. L'ultima riga, eseguita sull'host, lancia quattro blocchi di 256 thread. Per 960 byte le due copie di memoria costano molto più del lavoro, quindi l'esempio illustra il modello di programmazione, non un guadagno; una GPU conviene solo quando i dati sono grandi e il lavoro per elemento è consistente.

## Slide 9: La regola dell'inversione a U di Verm1, in hardware

La regola di Verm1 che vieta l'inversione a U, scritta come hardware in Verilog, un linguaggio che descrive circuiti e non sequenze di passi. Il modulo ha due ingressi a due bit, la direzione corrente e quella richiesta, e un'uscita. L'istruzione `assign` denota un filo che vale continuamente: l'uscita vale 1 quando lo XOR delle due direzioni è uguale al binario 10. Non c'è un prima e un dopo, solo una relazione combinatoria. Sul kit la stessa regola richiedeva tre istruzioni e tre cicli; come hardware risponde in una frazione di nanosecondo, in modo continuo.

## Slide 10: Svuotare la mappa di Verm1: 960 celle

Azzerare le 960 celle della mappa su cinque macchine. Sul kit: un byte per iterazione, 3.840 cicli. Su un core RISC-V fuori ordine: lo stesso binario, in una frazione di quei cicli. Con vettori a 128 bit: 60 iterazioni. Su una GPU: un lancio di 960 thread, più due copie. Su una FPGA: 960 flip-flop con un reset comune, azzerati in un ciclo di clock. Il lavoro è identico; ciò che cambia è quanto di esso avviene contemporaneamente, e a quale costo. La domanda dell'ingegnere non è quale macchina sia la più veloce, ma quale sia sufficiente.

## Slide 11: Il programma completo: l24.S (1 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 12: Il programma completo: l24.S (2 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 13: Il programma completo: l24.S (3 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 14: Il programma completo: l24.S (4 di 4)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 15: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 16: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 17: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 18: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 19: I listati vettoriali: provateli sul QEMU originale

I listati vettoriali di questa lezione non possono girare sul kit, il cui processore non implementa l'estensione V. Sono quindi provati su un processore RV32 emulato, senza sistema: i comandi compilano un solo binario e lo eseguono con quattro diverse lunghezze di vettore. Il codice di uscita è il risultato, zero se tutti i controlli sono passati, e dimostra anche che il codice non dipende dalla lunghezza del vettore.

## Slide 20: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 21: Esercizi: prima su carta, poi sulla macchina

Cinque esercizi. Completare la tabella di Amdahl per p = 0,95. Disegnare il diagramma della pipeline di un processore a tre vie che esegue nove istruzioni indipendenti. Ridenominare i registri di un frammento di Verm1 e individuare quali istruzioni potrebbero eseguirsi nello stesso ciclo. Scrivere la tavola di verità di una tabella di consultazione a quattro ingressi che realizza la regola dell'inversione a U. E compilare il test vettoriale ed eseguirlo su QEMU con due diverse larghezze di vettore, spiegando perché lo stesso binario funziona in entrambi i casi.
