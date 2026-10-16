# Lezione 14: Macchine elementari: registri e bus: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i registri a scorrimento; i registri come flip-flop; bus e porte three-state. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'I/O mappato in memoria (Lezione 15); memorie e indirizzi (Lezione 15). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Macchine elementari: registri e bus: il codice

Questa è la presentazione del codice della Lezione 14. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l14.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Inviare un byte un bit alla volta

Il ciclo del riscaldamento trasmette un byte un bit alla volta, il più significativo per primo. A ogni iterazione il byte si fa scorrere a destra di 7 e si maschera con 1, isolandone il bit più alto; quel bit verrebbe posto su una linea di dato e verrebbe dato un impulso su una linea di clock; il byte si fa poi scorrere a sinistra di uno, così che il bit successivo passi in cima. Dopo otto iterazioni l'intero byte è stato inviato. Il ciclo è un registro a scorrimento realizzato in software. Le due righe omesse scriverebbero in registri GPIO mappati in memoria, un meccanismo spiegato nella Lezione 15. Il chip del kit contiene hardware dedicato che esegue la stessa operazione milioni di volte al secondo.

## Slide 4: I bus del kit PRG32

I bus del kit. Dentro il chip il bus è parallelo. Il display è collegato da SPI, un bus seriale con una linea di clock, una linea di dato, una linea di chip select e una linea che distingue dati da comandi; ogni pixel di ogni frame lo attraversa bit per bit. L'amplificatore è collegato da I2S, un altro bus seriale, che porta 22.050 campioni audio al secondo. I pulsanti usano un filo ciascuno, una rappresentazione decodificata. L'USB, anch'esso seriale, porta il firmware e la console di debug. Il kit esemplifica così la tendenza generale enunciata nella lezione: parallelo dentro il chip, seriale tra chip.

## Slide 5: Scorrimenti in RISC-V: uno shift register in un'istruzione

Le istruzioni di scorrimento spostano ogni bit di un registro in un solo passo: `slli` e `srli` riempiono con zeri, `srai` con copie del bit di segno, mentre `sll`, `srl` e `sra` prendono l'entità dello scorrimento da un registro. In hardware non si tratta di una catena di flip-flop, che richiederebbe un impulso di clock per posizione, ma di un *barrel shifter*, una rete combinatoria di strati di multiplexer, e una delle unità della ALU. Il codice a destra mostra le due conversioni, da parallelo a seriale e da seriale a parallelo.

## Slide 6: Il programma completo: l14.S (1 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 7: Il programma completo: l14.S (2 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 8: Il programma completo: l14.S (3 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l14.S (4 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l14.S (5 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Il programma completo: l14.S (6 di 6)

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

Cinque esercizi. Disegnare un registro a scorrimento a 4 bit con ingresso seriale e uscita parallela e seguirne il contenuto per quattro impulsi di clock. Scrivere i segnali di abilitazione e di caricamento che copiano un registro in un altro attraverso un bus comune. Completare il riscaldamento con il ciclo di ricezione, che ricostruisce il byte. Su PRG32, mostrare un byte come otto lampade e farlo scorrere ogni mezzo secondo. Infine, far rientrare dall'altro lato il bit che esce da un lato: una rotazione, che in hardware si chiama contatore ad anello.
