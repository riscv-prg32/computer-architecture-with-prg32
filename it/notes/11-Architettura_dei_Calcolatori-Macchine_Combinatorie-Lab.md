# Lezione 11: Macchine combinatorie: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i multiplexer; le reti combinatorie; i codici; decoder ed encoder; comparatori e parità; l'ALU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: macchine a stati finiti (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) distinguere una macchina combinatoria da una sequenziale; (2) usare decodificatori, multiplexer, comparatori e parità; (3) spiegare l'ALU come unità in parallelo e un multiplexer. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 12, Verm1, parte 2: la guida, il cibo e un punteggio.

Ponte. Nella Lezione 02 un'istruzione era un numero a 32 bit, e il processore in qualche modo sapeva che cosa farne. Oggi un decodificatore legge un campo di quel numero, funct3, e pilota il multiplexer che sceglie il risultato dell'ALU. La Lezione 19 descrive tutti i campi e il ciclo di prelievo, decodifica, esecuzione. Richiamo: Quale parte della parola di un'istruzione dice all'ALU di sommare invece di calcolare un AND?

Il filo della lezione: L'ALU che ha eseguito ogni add finora è una grande macchina combinatoria: molti risultati calcolati insieme, uno scelto. Prossimo passo: questi circuiti al lavoro nella seconda parte di Verm1.

## Slide 1: Macchine combinatorie: il codice

Questa è la presentazione del codice della Lezione 11. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l11.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Scegliere uno di quattro colori

Il riscaldamento. `a0` contiene un selettore da 0 a 3, e le quattro istruzioni sono l'accesso a un array della Lezione 04: si carica l'indirizzo della tabella, si moltiplica il selettore per 4, si somma, e si carica la parola selezionata. Lo stesso selettore dà sempre lo stesso colore, e nulla persiste da un uso al successivo. Questo comportamento, uscite determinate solo dagli ingressi presenti, definisce le macchine studiate oggi. In hardware questa macchina particolare è un *multiplexer*: quattro ingressi di dato, due bit di selezione, un'uscita. Il software impiega quattro istruzioni; l'hardware risponde in una frazione di nanosecondo.

## Slide 4: Nel processore: quale registro viene scritto?

Un decoder al lavoro nel processore. L'istruzione `addi t1, t1, 1` contiene un campo di 5 bit, `rd`, con il numero del registro destinazione: 00110, cioè 6, il registro `t1`. Un decoder da 5 a 32 trasforma quei cinque bit in trentadue linee di abilitazione alla scrittura, di cui è attiva solo la sesta, così che solo quel registro riceva il risultato. La stessa istruzione contiene altri due numeri di registro, che selezionano i registri da leggere per mezzo di multiplexer.

## Slide 5: Nel processore: registro o costante?

Un multiplexer al lavoro nel processore. `add t2, t0, t1` somma due registri; `addi t2, t0, 5` somma un registro e una costante presa dall'istruzione. Entrambe usano lo stesso sommatore. Un multiplexer davanti al secondo ingresso della ALU sceglie tra il valore di un registro e la costante, con la linea di selezione a 0 per `add` e a 1 per `addi`. È un multiplexer su parole intere, trentadue multiplexer a un bit che condividono la linea di selezione. Anche leggere un registro dal banco dei registri è un multiplexer, con il numero del registro come selettore.

## Slide 6: Una rete di parità in sette istruzioni

Una rete di parità in software, per un byte. Ogni coppia di istruzioni fa scorrere il valore a destra e lo combina con sé stesso con XOR: la prima piega riduce otto bit a quattro, la seconda quattro a due, la terza due a uno. L'ultima istruzione conserva solo il bit più basso, che è la parità. In hardware gli stessi tre livelli costituiscono un albero di sette porte XOR, la cui profondità, logaritmica nel numero dei bit, ne determina il ritardo. Il listato va seguito a mano con 0x53, che ha quattro 1, e con 0x13, che ne ha tre.

## Slide 7: Le istruzioni RISC-V e la ALU

Come un'istruzione sceglie l'operazione. Il campo di 3 bit `funct3` dell'istruzione è un codice compatto: 000 per somma o differenza, 001 per scorrimento a sinistra, 100 per XOR, 110 per OR, 111 per AND. Un piccolo decoder lo trasforma nelle linee di selezione del multiplexer della ALU. Dove due istruzioni condividono un codice, come `add` e `sub`, un bit aggiuntivo altrove nell'istruzione le distingue. Un codice, un decoder, un multiplexer: l'intera lezione compare in una sola tabella, incorporata nel processore.

## Slide 8: Il programma completo: l11.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l11.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l11.S (3 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 12: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 13: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 14: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 15: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 16: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Sintetizzare il segmento g con una mappa di Karnaugh, sfruttando le condizioni di indifferenza. Costruire un decoder da 3 a 8 con due decoder da 2 a 4 dotati di enable e un invertitore. Realizzare una funzione con un solo multiplexer ponendo la sua tavola di verità sugli ingressi di dato, e riconoscere la funzione. Scrivere un comparatore in assembly usando solo `xor` e `sltiu`. E disegnare una cifra a sette segmenti su PRG32: una tabella di dieci byte, uno per cifra, e sette rettangoli accesi verificandone i bit, che è un transcodificatore realizzato in software.
