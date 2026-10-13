# Lezione 08: Elementi di algebra di Boole: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Elementi di algebra di Boole: il codice

Questa è la presentazione del codice della Lezione 08. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l08.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: LEFT è premuto?

`prg32_input_read` restituisce in `a0` tutti i pulsanti insieme, un bit per pulsante. `andi t3, t0, 0x01` conserva il bit 0 e forza a zero tutti gli altri; il risultato è diverso da zero esattamente quando LEFT è premuto, e in caso contrario `beqz` salta il movimento. Lo stesso schema, con 0x02, esamina RIGHT. La costante usata con `andi` si chiama *maschera*. L'ultima nota pone la domanda della lezione: `andi` sono trentadue porte AND che lavorano fianco a fianco; che cos'è dunque un AND?

## Slide 4: Un bit per pulsante

Il valore restituito dai pulsanti è una parola in cui ogni bit ha un significato: il bit 0 è LEFT, il bit 1 RIGHT, il bit 2 UP, il bit 3 DOWN, i bit 4 e 5 sono A e B, il bit 6 è START. Tenendo premuti insieme RIGHT e A si ottiene 0x12, cioè 0001 0010. Nell'immagine ogni lampada è un bit di questa parola. Ogni domanda che si può fare sul joystick, come «LEFT è premuto ma RIGHT no?», è un'espressione booleana su queste sette variabili.

## Slide 5: Istruzioni bit a bit: l'algebra su un registro intero

`and`, `or`, `xor` e `not` applicano una porta a ogni coppia di bit corrispondenti di due registri, in tutte le posizioni insieme. La terza colonna svolge un esempio su otto bit: con a uguale a 1100 1010 e b uguale a 0000 1111, AND dà 0000 1010, OR dà 1100 1111, XOR dà 1100 0101. L'ultima colonna mostra gli stessi operatori in C. `not` è una pseudo-istruzione: è `xori` con meno 1, perché meno 1 in complemento a due è fatto di tutti uni.

## Slide 6: Quattro cose da fare con una maschera

I quattro usi standard di una maschera, ciascuno fondato su una legge dell'algebra. Per *esaminare* un bit, AND con una maschera che ha 1 in quella posizione: x AND 1 è x, x AND 0 è 0. Per *porlo a 1*, OR con la stessa maschera. Per *azzerarlo*, AND con la maschera complementata. Per *invertirlo*, XOR con la maschera. Negli ultimi tre casi gli altri bit restano invariati, ed è proprio questo il punto: una maschera agisce sui bit scelti e lascia stare gli altri.

## Slide 7: De Morgan al joystick

De Morgan in un programma. Il giocatore è fermo quando non è premuto né LEFT né RIGHT. La versione breve usa una maschera con due bit, 0x03: il risultato è zero solo se entrambi i bit sono zero, cioè NOT (LEFT OR RIGHT). La versione lunga esamina ogni pulsante separatamente: (NOT LEFT) AND (NOT RIGHT). La seconda legge di De Morgan dice che le due sono la stessa condizione. Due istruzioni invece di cinque: semplificare un'espressione è utile nel software come nell'hardware.

## Slide 8: Una lampada per bit: scorrere e mascherare

Come leggere il bit numero n di una parola quando n sta in un registro: si scorre la parola a destra di n posizioni, così il bit voluto arriva in posizione 0, poi si maschera con 1. Qui `s0` contiene il numero della lampada, `srl` scorre la parola dei pulsanti, `andi` isola il bit, e il colore si sceglie di conseguenza: grigio per spenta, giallo per accesa. Scorrere e mascherare è uno degli idiomi più comuni della programmazione a basso livello.

## Slide 9: Il programma completo: l08.S (1 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l08.S (2 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 11: Il programma completo: l08.S (3 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 12: Il programma completo: l08.S (4 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 13: Il programma completo: l08.S (5 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 14: Il programma completo: l08.S (6 di 6)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 15: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 16: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 17: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 18: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 19: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 20: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Dimostrate con una tabella di verità la seconda legge di De Morgan. Semplificate un'espressione, nominando la legge a ogni passo. Scrivete la maschera e il test per «A e B premuti insieme»: notate che verificare un risultato diverso da zero significherebbe A oppure B. Modificate le lampade perché mostrino il complemento dei pulsanti. E convertite una lettera tra maiuscola e minuscola con una sola istruzione, ricordando dalla Lezione 04 che le due differiscono per un bit.
