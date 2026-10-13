# Lezione 11: Macchine combinatorie: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine combinatorie: il codice

Questa è la presentazione del codice della Lezione 11. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l11.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Scegliere uno di quattro colori

`a0` contiene un numero da 0 a 3. Le quattro istruzioni sono l'accesso al vettore della Lezione 04: si carica l'indirizzo della tabella, si moltiplica il selettore per 4, si somma, e si carica la parola selezionata. Lo stesso selettore dà sempre lo stesso colore, e nulla viene ricordato da un uso al successivo. Questo comportamento, uscite che dipendono solo dagli ingressi presenti, definisce le macchine di oggi. In hardware questa in particolare è un *multiplexer*: quattro ingressi dati, due bit di selezione, un'uscita.

## Slide 4: Nel processore: quale registro viene scritto?

Un decodificatore al lavoro nel processore. L'istruzione `addi t1, t1, 1` contiene un campo di 5 bit, `rd`, con il numero del registro di destinazione: 00110, cioè 6, il registro `t1`. Un decodificatore 5-a-32 trasforma quei cinque bit in trentadue linee di abilitazione alla scrittura, di cui è attiva solo la sesta: solo quel registro riceve il risultato. La stessa istruzione contiene altri due numeri di registro, che selezionano i registri da leggere.

## Slide 5: Nel processore: registro o costante?

Un multiplexer al lavoro nel processore. `add t2, t0, t1` somma due registri; `addi t2, t0, 5` somma un registro e una costante presa dall'istruzione. Entrambe usano lo stesso addizionatore. Un multiplexer davanti al secondo ingresso della ALU sceglie tra il valore di un registro e la costante: la sua linea di selezione vale 0 per `add` e 1 per `addi`. È un multiplexer su parole intere: trentadue multiplexer a un bit con una linea di selezione comune. Anche leggere un registro è un multiplexer.

## Slide 6: Una rete di parità in sette istruzioni

Una rete di parità in software, per un byte. Ogni coppia di istruzioni scorre il valore a destra e lo combina con se stesso tramite XOR: il primo ripiegamento porta otto bit su quattro, il secondo quattro su due, il terzo due su uno. L'ultima istruzione tiene solo il bit più basso, che è la parità. In hardware gli stessi tre livelli sono un albero di sette porte XOR. Tracciatela a mano con 0x53, che ha quattro 1, e con 0x13, che ne ha tre.

## Slide 7: Le istruzioni RISC-V e la ALU

Come un'istruzione sceglie l'operazione. Il campo di 3 bit `funct3` dell'istruzione è un codice compatto: 000 per somma o differenza, 001 per lo scorrimento a sinistra, 100 per XOR, 110 per OR, 111 per AND. Un piccolo decodificatore lo trasforma nelle linee di selezione del multiplexer della ALU. Dove due istruzioni condividono un valore, come `add` e `sub`, le distingue un altro bit altrove nell'istruzione. Un codice, un decodificatore, un multiplexer: l'intera lezione in una tabella.

## Slide 8: Il programma completo: l11.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l11.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l11.S (3 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 12: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 13: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 14: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 15: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 16: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Sintetizzate il segmento g con una mappa, usando le indifferenze. Costruite un decodificatore 3-a-8 con due decodificatori 2-a-4 con abilitazione e un invertitore. Realizzate una funzione con un solo multiplexer mettendo la sua tabella di verità sugli ingressi dati, e riconoscete la funzione. Scrivete un comparatore in assembly con le sole `xor` e `sltiu`. E disegnate su PRG32 una cifra a sette segmenti: una tabella di dieci byte, uno per cifra, e sette rettangoli accesi esaminandone i bit: un transcodificatore in software.
