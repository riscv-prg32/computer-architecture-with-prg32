# Lezione 05: Rappresentazione dei numeri: gli interi: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il complemento a due; i cambi di base; naturali e overflow; shift come moltiplicazione; segno e modulo; istruzioni con o senza segno; l'estensione del segno. DA UTILIZZARE OGGI: le chiamate del runtime PRG32, il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentazione dei numeri: gli interi: il codice

Questa è la presentazione del codice della Lezione 05. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l05.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Tenete premuto LEFT e guardate il numero

Il riscaldamento. Il codice legge i pulsanti, carica `marker_x` dalla memoria, sottrae 1 se LEFT è premuto e riscrive il risultato: l'idioma carica-modifica-memorizza della Lezione 02. Tenendo premuto LEFT, il valore stampato va da 00000002 a 00000001, a 00000000, e poi a FFFFFFFF. È un errore? FFFFFFFF è il numero 4.294.967.295, o meno uno? Il quarto richiamo anticipa la risposta: entrambi, a seconda di come si interpretano i bit. Il resto della lezione sviluppa le regole che stanno dietro questa frase, e alla sua fine il fenomeno dovrebbe essere pienamente spiegabile.

## Slide 4: Proprietà delle stringhe binarie

Tre proprietà delle stringhe binarie, ciascuna con un uso pratico. Estendere un numero a sinistra con zeri ne lascia invariato il valore. Uno scorrimento a sinistra di k posizioni moltiplica per 2^k: 00101, cinque, diventa 01010, dieci. Uno scorrimento a destra di k posizioni divide per 2^k e scarta il resto. Uno scorrimento costa in hardware molto meno di una moltiplicazione generale, e il codice a destra mostra la scomposizione che i compilatori applicano di routine: dieci per x è uguale a otto per x più due per x, cioè due scorrimenti e una somma. Gli scorrimenti sono anche alla base dell'aritmetica in virgola fissa della Lezione 06.

## Slide 5: Cambiare segno a un numero

Due metodi cambiano il segno di un numero in complemento a due. Il primo complementa ogni bit e somma 1: sei, 0110, diventa 1001 e poi 1010, meno sei. Il secondo, più rapido a mano, scorre da destra, copia i bit fino al primo 1 compreso e complementa tutti gli altri. La giustificazione del primo metodo è algebrica: il complemento di x vale (2^n - 1) - x, quindi sommando 1 si ottiene 2^n - x, la rappresentazione di -x. RISC-V non ha bisogno di un'istruzione dedicata: `neg` è una pseudo-istruzione per `sub` dal registro `zero`. Resta un'eccezione: il numero più negativo non ha controparte positiva, e cambiarne il segno restituisce la stessa configurazione.

## Slide 6: Il riscaldamento, spiegato

Il riscaldamento si può ora spiegare per intero. Il segnalino stava a 0, e `addi` con -1 lo ha fatto arretrare di un passo su un cerchio di 2^32 posizioni, lasciando trentadue uni nel registro. Letti senza segno, indicano 4.294.967.295; letti in complemento a due, -1. La routine di stampa mostra la configurazione e non prende posizione sul suo significato. Il segnalino scompare perché viene disegnato fuori dallo schermo con l'una e con l'altra interpretazione. Il processore non ha sbagliato: al programma mancava una decisione su come interpretare e vincolare il suo valore.

## Slide 7: Con segno o senza? Si sceglie con l'istruzione

I registri RISC-V non hanno tipo: trentadue bit sono con segno o senza segno solo per l'istruzione che li legge. La tabella individua dove le due interpretazioni richiedono istruzioni diverse. Somma, sottrazione e metà bassa di un prodotto sono identiche per entrambe. Confronti, salti condizionati, scorrimenti a destra, caricamenti di byte e divisione vengono in coppia: `slt` e `sltu`, `blt` e `bltu`, `sra` e `srl`, `lb` e `lbu`, `div` e `divu`. La lettera u nel nome indica sempre la variante senza segno. Scegliere il membro sbagliato di una coppia è un errore classico e istruttivo.

## Slide 8: Tenere il segnalino sullo schermo

Il programma corretto tiene il segnalino sullo schermo. Dopo i due possibili spostamenti, `bgez` verifica se la posizione è maggiore o uguale a zero, interpretandola come numero con segno, e se non lo è la porta a 0. `ble` la confronta poi con il massimo, 304, ancora come numero con segno, e la limita di conseguenza. Questa tecnica si chiama *clamping*. Il metodo merita attenzione: un gioco non rileva l'overflow a posteriori, ma mantiene i suoi valori in un intervallo in cui l'overflow non può verificarsi. Un solo `sw` alla fine memorizza il valore corretto.

## Slide 9: Rilevare l'overflow senza flag

Molti processori forniscono un flag di riporto e un flag di overflow; RISC-V non ne fornisce nessuno, e l'overflow si rileva con un confronto. Nel caso senza segno, se dopo `add` la somma è minore di uno degli operandi, il risultato ha fatto il giro, una condizione che `sltu` verifica con una sola istruzione. Nel caso con segno, sommare un numero negativo deve diminuire la somma e sommarne uno non negativo no; se i due fatti sono in disaccordo, c'è stato overflow. In termini della ruota dei numeri, il primo test rileva l'attraversamento in alto e il secondo quello in basso. L'assenza di flag è una scelta di progetto deliberata, discussa nella Lezione 18.

## Slide 10: Il programma completo: l05.S (1 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Il programma completo: l05.S (2 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 12: Il programma completo: l05.S (3 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 13: Il programma completo: l05.S (4 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 14: Il programma completo: l05.S (5 di 5)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 15: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 16: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 17: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 18: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 19: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 20: Esercizi: prima su carta, poi su PRG32

Cinque esercizi, tre su carta e due sulla macchina. Convertire 2026 e la frazione 0,1; scrivere -100 in due rappresentazioni; calcolare tre somme a otto bit e stabilire quali danno overflow. Poi, nel codice del clamping, sostituire i salti con segno con le loro controparti senza segno e prevedere il comportamento prima di eseguire: l'errore che ne risulta è istruttivo proprio perché prevedibile. Infine scrivere un `update` che aggiunge 0x10000000 a ogni frame e segnala l'overflow con segno. I risultati attesi sono nel riquadro verde, che va tenuto coperto finché non si sono ottenute le proprie risposte.
