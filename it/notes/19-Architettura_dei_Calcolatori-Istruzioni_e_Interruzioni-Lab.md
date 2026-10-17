# Lezione 19: Istruzioni e interruzioni: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: formati delle istruzioni; i modi di indirizzamento; il ciclo del processore; interruzioni e trap. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) decodificare un'istruzione RISC-V nei suoi campi; (2) nominare il modo di indirizzamento di ogni operando; (3) descrivere il ciclo dell'istruzione e che cosa cambia un'interruzione. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 20, I bus e la scheda video.

Il filo della lezione: Il numero 0x00130313 della Lezione 02 si legge ora campo per campo, e il processore che lo preleva può essere interrotto e ripreso. Prossimo passo: i dispositivi che il processore serve.

## Slide 1: Istruzioni e interruzioni: il codice

Questa è la presentazione del codice della Lezione 19. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l19.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Quattro parole in memoria

Il riscaldamento: quattro parole di memoria, a quattro indirizzi di distanza l'una dall'altra, che insieme costituiscono `first_update`, la funzione della Lezione 02 che incrementa un contatore. A sinistra ci sono gli indirizzi, al centro il codice macchina, a destra il sorgente così come è stato scritto. Il processore possiede solo la colonna centrale. Tre domande organizzano la lezione. Come fa a sapere che la prima parola è un caricamento e la seconda un'addizione? Quali passi compie per eseguire ciascuna? E mentre le esegue, come si accorge che è stato premuto un pulsante o che un timer è scaduto?

## Slide 4: Decodifica a mano

Due istruzioni decodificate a mano. Le otto cifre esadecimali si scrivono in binario; si separano per primi gli ultimi sette bit, l'opcode, perché determinano il formato; poi si separano di conseguenza i campi restanti. Per 0x006283B3 l'opcode indica un'operazione tra registri, i campi danno x7, x5 e x6, e `funct3` con `funct7` selezionano l'addizione: `add t2, t0, t1`. Per 0x0002A303 l'opcode indica un caricamento, l'immediato è 0, la base x5 e la destinazione x6: `lw t1, 0(t0)`. L'esercizio va fatto una volta con carta e matita; è l'inverso del lavoro dell'assemblatore.

## Slide 5: La fase di prelievo, trasferimento per trasferimento

La fase di prelievo espressa come quattro trasferimenti tra registri, usando i registri del modello di riferimento della Lezione 18. Il contenuto del PC va in MA, il registro indirizzo di memoria. La memoria viene letta, e la parola arriva in MB, il registro buffer. La parola viene copiata in D, il registro di decodifica. Il PC viene incrementato di 4, perché un'istruzione occupa quattro byte, così che punti all'istruzione successiva. Ogni riga è un trasferimento sul bus interno, comandato dall'unità di controllo.

## Slide 6: Il resto del ciclo per due istruzioni

Le restanti quattro fasi, affiancate per due istruzioni. Per `add` la decodifica legge i due registri nei registri operando della ALU, l'esecuzione li somma, la fase di memoria si salta, e la somma si scrive in `t2`. Per `lw` il secondo operando è l'immediato, la somma è un *indirizzo*, la fase di memoria legge la parola a quell'indirizzo, e la parola letta si scrive in `t1`. Lo stesso sommatore serve entrambe le istruzioni; cambiano solo i comandi emessi dall'unità di controllo. L'economia del percorso dei dati poggia su questa condivisione.

## Slide 7: Un gestore di trap, per sommi capi

Un gestore di trap a grandi linee. Riserva spazio sullo stack e salva i registri che userà, la parte software del contesto. Legge `mcause` con `csrr` e ne verifica il segno: il bit più alto è il bit di segno, quindi `bgez` separa le eccezioni dalle interruzioni in una sola istruzione. Dopo aver servito l'evento ripristina i registri, rilascia lo stack ed esegue `mret`. Il programma interrotto non deve osservare nulla: un solo registro lasciato modificato qui produce un errore che compare a caso, dovunque, il che rende irrinunciabile la disciplina del salvataggio del contesto. Un gestore reale salva tutti i registri salvati dal chiamante, di solito su uno stack separato raggiunto attraverso `mscratch`.

## Slide 8: Il programma completo: l19.S (1 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l19.S (2 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l19.S (3 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Il programma completo: l19.S (4 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 12: Il programma completo: l19.S (5 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 13: Il programma completo: l19.S (6 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 14: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 15: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 16: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 17: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 18: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 19: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Decodificare a mano due parole, dando formato, campi e assembly. Codificare `sub t0, t1, t2` e `sw a0, 8(sp)`, seguendo il percorso inverso. Scrivere i trasferimenti tra registri dell'intero ciclo per una memorizzazione e per un salto. Disegnare il diagramma della pipeline di sei istruzioni su quattro stadi e stabilire in quale ciclo si completa la sesta. E in PRG32-QT, fermarsi in `first_update`, eseguire passo-passo e confrontare il codice macchina mostrato con la propria decodifica del riscaldamento.
