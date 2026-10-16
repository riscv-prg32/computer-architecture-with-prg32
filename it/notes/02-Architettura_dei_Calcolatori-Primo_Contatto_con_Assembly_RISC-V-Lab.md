# Lezione 02: Primo contatto: l'assembly RISC-V su PRG32: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: registri, calcolo, trasferimento, salto; i registri; funzioni, chiamata e ritorno; contratto init/update/draw; leggere una riga di assembly; gli argomenti in a0 ... a7; perché si salva ra; indirizzo, valore, load, store; le istruzioni di base; le pseudo-istruzioni; un'istruzione è un numero; seguire a mano l'esecuzione. DA UTILIZZARE OGGI: l'esadecimale (Lezione 04); bit, byte, parola (Lezione 04); la convenzione di chiamata (Lezione 18); le maschere di bit (Lezione 08) e, usati senza essere studiati nel corso, le direttive dell'assemblatore, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT, il programma completo. DA COMPRENDERE PIÙ AVANTI: la pila (Lezione 18); i modi di indirizzamento (Lezione 19); formati delle istruzioni (Lezione 19); il complemento a due (Lezione 05); la virgola fissa (Lezione 06); l'algebra di Boole (Lezione 08); il sommatore (Lezione 09); dai volt ai bit (Lezione 10); latch e flip-flop (Lezione 13); il ciclo del processore (Lezione 19); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Primo contatto: l'assembly RISC-V su PRG32: il codice

Questa è la presentazione del codice della Lezione 02. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di questa lezione è ~/arc12/code/l02.S; tools/tests/cartridges/run.py lo compila, lo esegue su PRG32-QT con ingressi programmati e controlla i pixel del frame.

## Slide 3: Passo 1: il più piccolo programma che gira

Il più piccolo programma che gira. `.option norelax`, con cui comincia ogni esempio di PRG32, mantiene prevedibile la disposizione della cartuccia impedendo al linker di riscrivere sequenze di istruzioni. `.section .text` dichiara che segue codice eseguibile. Ogni `.global` esporta un'etichetta oltre il file, così che il firmware possa trovare la funzione per nome. Seguono tre funzioni, ciascuna fatta della sola istruzione `ret`, che restituisce il controllo al chiamante. Il risultato è uno schermo nero, ed è un successo: il framework ha trovato i tre punti di ingresso, li ha invocati e ha riavuto il controllo. Queste direttive si usano così come sono; il corso non studia l'assemblatore in sé.

## Slide 4: Compilare, eseguire

Due comandi che si digiteranno centinaia di volte. `cartridge build` trasforma il file assembly in una cartuccia: `--entry-prefix first` indica il prefisso dei tre punti di ingresso, `--out` il nome del file prodotto. La cartuccia si esegue poi: in QEMU con `qemu upload` seguito da `qemu run`, oppure su una scheda o su PRG32-QT con `upload-and-run` e l'indirizzo dell'host, che per PRG32-QT sul portatile dello studente è `http://localhost:8080`. Lo stesso file di cartuccia serve tutti e tre gli host.

## Slide 5: Passo 2: dire ciao

Il secondo passo scrive sullo schermo. `first_draw` si legge meglio in tre parti. Le prime due righe aprono uno stack frame e salvano `ra`, perché la funzione sta per fare delle chiamate. Seguono due chiamate: `prg32_gfx_clear`, con il colore in `a0`, e `prg32_gfx_text8`, con cinque argomenti da `a0` ad `a4`: x, y, l'indirizzo della stringa, colore di primo piano e colore di sfondo. Vanno distinti i due modi di caricare un registro: `li` carica una costante numerica, `la` l'indirizzo di un'etichetta. Le ultime tre righe ripristinano `ra`, rilasciano il frame e ritornano. La stringa stessa è un dato, collocato nella sezione di sola lettura `.rodata`.

## Slide 6: Passo 3: un valore che sopravvive tra i frame

Il terzo passo conserva un valore da un frame al successivo. I registri non mantengono il loro contenuto tra invocazioni successive di `update`, quindi il valore deve risiedere in memoria. `counter` è un'etichetta che nomina una posizione della sezione `.data`, la parte del programma che contiene dati invece di istruzioni; la posizione contiene una parola. Le quattro istruzioni costituiscono lo schema alla base di ogni *variabile*, un posto in memoria con un nome, il cui valore il programma cambia: `la` mette in `t0` l'*indirizzo* della posizione; `lw` carica il *valore* in `t1`; `addi` lo modifica; `sw` lo riscrive. Carica, modifica, memorizza: l'idioma che definisce un'architettura load-store. Sullo schermo ancora non cambia nulla: il contatore avanza, ma nulla lo disegna.

## Slide 7: Passo 4: rendere visibile il contatore

Il quarto passo rende visibile il contatore come una barra verde. Il valore viene caricato, e `andi a2, t1, 255` ne conserva solo gli otto bit meno significativi, gli otto a destra, che valgono meno, così la larghezza va da 0 a 255 e poi ricomincia. Gli altri registri portano gli argomenti di `prg32_gfx_rect`: x, y, larghezza, altezza e colore. Queste otto righe contengono i semi di tre lezioni successive: 255 scritto come 0xFF (la notazione posizionale, Lezione 04), `andi` usato come maschera (l'algebra di Boole, Lezione 08) e 0x07e0 che indica il verde (la codifica del colore, Lezione 04). Conviene ricordare dove ciascuno è stato incontrato per la prima volta.

## Slide 8: Il programma completo: l02.S (1 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 9: Il programma completo: l02.S (2 di 3)

Una pagina del programma completo, riprodotta esattamente com'è nel repository. Va letta dall'inizio. L'intestazione dice che cosa mostra il programma e come si compila; seguono i tre punti di ingresso, init, update e draw, e le sezioni dei dati chiudono il file. Le righe già incontrate nei listati della lezione hanno qui gli stessi commenti, così che ogni frammento si possa ritrovare nell'insieme.

## Slide 10: Il programma completo: l02.S (3 di 3)

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

## Slide 16: Esercizi su PRG32

Cinque esercizi sulla cartuccia dello studente, ciascuno seme di una lezione successiva. Cambiare il testo e il suo colore. Far crescere la barra due o quattro volte più in fretta modificando una sola istruzione. Farla diminuire, e osservare che cosa accade quando il contatore passa per lo zero: la barra salta alla larghezza massima, un fenomeno che la Lezione 05 spiega con il complemento a due. Eseguire passo-passo `first_update` e annotare i registri dopo ogni istruzione. Disegnare una seconda barra la cui larghezza sia il contatore modulo 64. In ogni caso il risultato va previsto prima di eseguire il programma.
