# Lezione 08: Elementi di algebra di Boole: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; l'architettura di von Neumann; analisi e sintesi; l'algebra di Boole; le porte logiche. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: minimizzazione, Karnaugh (Lezione 09). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Elementi di algebra di Boole: il codice

Questa è la presentazione del codice della Lezione 08. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l08.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: LEFT è premuto?

Il riscaldamento. `prg32_input_read` restituisce in `a0` lo stato di tutti i pulsanti insieme, un bit per pulsante. `andi t3, t0, 0x01` conserva il bit 0 e forza a zero ogni altro bit; il risultato è diverso da zero esattamente quando LEFT è premuto, e `beqz` altrimenti salta lo spostamento. Lo stesso schema con 0x02 verifica RIGHT. La costante usata con `andi` si chiama *maschera*. L'ultimo richiamo pone la domanda della lezione: `andi` sono trentadue porte AND che lavorano fianco a fianco; che cos'è, esattamente, un AND?

## Slide 4: Un bit per pulsante

Il valore restituito per i pulsanti è una parola in cui ogni bit ha un significato assegnato: il bit 0 è LEFT, il bit 1 RIGHT, il bit 2 UP, il bit 3 DOWN, i bit 4 e 5 sono A e B, il bit 6 è START. Tenendo premuti insieme RIGHT e A si ottiene 0x12, cioè 0001 0010. Nell'immagine ogni lampada mostra un bit di questa parola. Ogni domanda che si può porre sui comandi, come "LEFT è premuto ma RIGHT no?", è un'espressione booleana su queste sette variabili; è la rappresentazione *decodificata* che la Lezione 11 nomina.

## Slide 5: Istruzioni bit a bit: l'algebra su un registro intero

`and`, `or`, `xor` e `not` applicano una singola porta a ogni coppia di bit corrispondenti di due registri, in tutte le posizioni contemporaneamente. La terza colonna svolge un esempio a otto bit: con a uguale a 1100 1010 e b uguale a 0000 1111, AND dà 0000 1010, OR dà 1100 1111, XOR dà 1100 0101. L'ultima colonna mostra gli operatori C corrispondenti. `not` è una pseudo-istruzione: è `xori` con -1, perché -1 in complemento a due è fatto interamente di uni, e lo XOR con 1 inverte un bit.

## Slide 6: Quattro cose da fare con una maschera

I quattro usi canonici di una maschera, ciascuno fondato su una legge dell'algebra. Per *verificare* un bit, AND con una maschera che ha 1 in quella posizione, poiché x AND 1 è x e x AND 0 è 0. Per *porlo a uno*, OR con la stessa maschera. Per *azzerarlo*, AND con la maschera complementata. Per *invertirlo*, XOR con la maschera. Negli ultimi tre casi gli altri bit non sono toccati, ed è la proprietà essenziale: una maschera agisce sui bit scelti e lascia intatti tutti gli altri.

## Slide 7: De Morgan al joystick

Le leggi di De Morgan applicate in un programma. Il giocatore è fermo quando né LEFT né RIGHT è premuto. La versione breve usa una maschera a due bit, 0x03: il risultato è zero solo se entrambi i bit sono zero, cioè NOT (LEFT OR RIGHT). La versione lunga verifica ogni pulsante separatamente: (NOT LEFT) AND (NOT RIGHT). La seconda legge di De Morgan garantisce che le due condizioni siano identiche. Due istruzioni ne sostituiscono cinque: la semplificazione è preziosa nel software quanto nell'hardware, ed è l'algebra a certificare che il programma più breve è corretto.

## Slide 8: Una lampada per bit: scorrere e mascherare

Per leggere il bit numero n di una parola quando n sta in un registro, si fa scorrere la parola a destra di n posizioni, così che il bit desiderato arrivi in posizione 0, e poi la si maschera con 1. Qui `s0` contiene l'indice della lampada, `srl` fa scorrere la parola dei pulsanti, `andi` isola il bit, e il colore si sceglie di conseguenza: grigio per spenta, giallo per accesa. Scorrimento e maschera è tra gli idiomi più comuni della programmazione a basso livello. `srl` è lo scorrimento logico della Lezione 05, che inserisce zeri a sinistra.

## Slide 9: Il programma completo: l08.S (1 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l08.S (2 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 11: Il programma completo: l08.S (3 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 12: Il programma completo: l08.S (4 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 13: Il programma completo: l08.S (5 di 6)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 14: Il programma completo: l08.S (6 di 6)

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

Cinque esercizi. Dimostrare la seconda legge di De Morgan per induzione completa. Semplificare un'espressione, nominando la legge che giustifica ogni passo. Scrivere la maschera e il test per "A e B premuti insieme", notando che verificare semplicemente un risultato diverso da zero esprimerebbe "A o B", un errore logico frequente. Modificare le lampade in modo che mostrino il complemento dei pulsanti. E convertire una lettera tra maiuscola e minuscola con una sola istruzione, ricordando dalla Lezione 04 che i due codici differiscono esattamente per un bit.
