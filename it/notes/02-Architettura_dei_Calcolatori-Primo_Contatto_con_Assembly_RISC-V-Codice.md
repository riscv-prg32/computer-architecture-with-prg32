# Lezione 02: Primo contatto: l'assembly RISC-V su PRG32: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: registri, calcolo, trasferimento, salto; i registri; contratto init/update/draw; gli argomenti in a0 ... a7; perché si salva ra; indirizzo, valore, load, store; le istruzioni di base; le pseudo-istruzioni; un'istruzione è un numero; seguire a mano l'esecuzione. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18); le maschere di bit (Lezione 08) e, usati senza essere studiati nel corso, le direttive dell'assemblatore, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT, il programma completo. DA COMPRENDERE PIÙ AVANTI: la pila (Lezione 18); i modi di indirizzamento (Lezione 19); formati delle istruzioni (Lezione 19); l'esadecimale (Lezione 04); il complemento a due (Lezione 05); la virgola fissa (Lezione 06); l'algebra di Boole (Lezione 08); il sommatore (Lezione 09); dai volt ai bit (Lezione 10); latch e flip-flop (Lezione 13); il ciclo del processore (Lezione 19); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Primo contatto: l'assembly RISC-V su PRG32: il codice

Questa è la presentazione del codice della Lezione 02. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di questa lezione è ~/arc12/code/l02.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Passo 1: il più piccolo programma che gira

Il più piccolo programma che gira. `.option norelax` è una riga con cui comincia ogni esempio PRG32: rende prevedibile la disposizione della cartuccia. `.section .text` dice che segue del codice. Ogni `.global` rende un'etichetta visibile fuori dal file, così il firmware può trovare la funzione per nome. Poi tre funzioni, ciascuna fatta della sola istruzione `ret`, che ritorna al chiamante. Il risultato è uno schermo nero, ed è un successo: il framework ha trovato le vostre tre funzioni, le ha chiamate, e ha riavuto il controllo.

## Slide 4: Compilare, eseguire

Due comandi che batterete centinaia di volte. `cartridge build` trasforma il file assembly in una cartuccia: `--entry-prefix first` è il prefisso delle vostre tre funzioni, `--out` il nome del risultato. Poi la si esegue: in QEMU con `qemu upload` e `qemu run`, oppure su una scheda o su PRG32-QT con `upload-and-run` e l'indirizzo dell'host. Per PRG32-QT sul vostro portatile l'indirizzo è `http://localhost:8080`. Il file della cartuccia è lo stesso per tutti e tre.

## Slide 5: Passo 2: dire ciao

Il secondo passo scrive sullo schermo. Leggete `first_draw` in tre parti. Le prime due righe fanno spazio sullo stack e salvano `ra`. Poi due chiamate: `prg32_gfx_clear` con il colore in `a0`, e `prg32_gfx_text8` con cinque argomenti da `a0` ad `a4`: x, y, l'indirizzo della stringa, colore del testo, colore dello sfondo. Notate i due modi di caricare: `li` carica un numero, `la` carica l'indirizzo di un'etichetta. Le ultime tre righe ripristinano `ra`, rilasciano lo stack e ritornano. La stringa è un dato, nella sezione `.rodata`.

## Slide 6: Passo 3: un valore che sopravvive tra i frame

Il terzo passo conserva un valore da un frame al successivo. I registri non sopravvivono tra una chiamata di `update` e l'altra, quindi il valore deve vivere in memoria. `counter` è un'etichetta: dà un nome a una locazione della sezione `.data` che contiene una parola. Le quattro istruzioni sono lo schema di ogni variabile: `la` mette in `t0` l'*indirizzo* della locazione; `lw` carica in `t1` il *valore*; `addi` lo modifica; `sw` lo riscrive. Load, modify, store. Sullo schermo non cambia ancora nulla: il contatore avanza, ma nessuno lo disegna.

## Slide 7: Passo 4: rendere visibile il contatore

Il quarto passo rende visibile il contatore come una barra verde. Il valore viene caricato, e `andi a2, t1, 255` ne conserva solo gli otto bit bassi, così la larghezza va da 0 a 255 e poi ricomincia. Gli altri registri sono gli argomenti di `prg32_gfx_rect`: x, y, larghezza, altezza e colore. Otto righe, e vi si nascondono tre lezioni future: 255 scritto come 0xFF, `andi` usato come maschera, e 0x07e0 che significa verde. Ricordate dove li avete visti per la prima volta.

## Slide 8: Il programma completo: l02.S (1 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 9: Il programma completo: l02.S (2 di 3)

Una pagina del programma completo, esattamente com'è nel repository. Leggetelo dall'inizio: l'intestazione dice che cosa mostra il programma e come compilarlo; seguono le tre funzioni init, update e draw, poi i dati. Le righe incontrate nei listati della lezione hanno qui gli stessi commenti.

## Slide 10: Il programma completo: l02.S (3 di 3)

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

## Slide 16: Esercizi su PRG32

Cinque esercizi sulla vostra cartuccia; ognuno è il seme di una lezione successiva. Cambiate il testo e il suo colore. Fate crescere la barra a velocità doppia o quadrupla cambiando una sola istruzione. Fatela accorciare, e osservate che cosa accade quando il contatore supera lo zero: la barra salta alla larghezza massima, e la Lezione 05 spiegherà perché. Eseguite `first_update` passo-passo e annotate i registri. Disegnate una seconda barra larga quanto il contatore modulo 64. Prima prevedete, poi eseguite.
