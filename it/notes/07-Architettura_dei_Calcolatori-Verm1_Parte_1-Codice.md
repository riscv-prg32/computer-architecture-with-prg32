# Lezione 07: Verm1, parte 1: una testa che attraversa il mondo: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il progetto Verm1; contratto init/update/draw; un colore è un numero; gli array in memoria; .text, .rodata, .data; indirizzo, valore, load, store; perché si salva ra; shift come moltiplicazione; la virgola fissa; le pseudo-istruzioni; l'ordine little-endian. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: formati delle istruzioni (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1, parte 1: una testa che attraversa il mondo: il codice

Questa è la presentazione del codice della Lezione 07. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di riferimento è ~/arc12/verm1/verm1_part1.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Compilare ed eseguire

Create nella vostra home una cartella `verm1` e tenetevi un solo file, `verm1.S`, che crescerà di parte in parte. Il primo comando compila la cartuccia; il secondo la invia a PRG32-QT in esecuzione sullo stesso computer e la avvia. Questi due comandi sono identici in ogni tutorial. Se `localhost` non risponde, usate l'indirizzo mostrato nella schermata *Setup* di PRG32-QT. In alternativa si può importare il file dal menu di PRG32-QT.

## Slide 4: Passo 1: tre funzioni che ritornano

Il passo 1 è lo scheletro della Lezione 02 con il prefisso `verm1`: tre etichette globali e tre funzioni che ritornano e basta. Scrivetelo, compilatelo, eseguitelo. Il risultato giusto è uno schermo nero: dimostra che gli strumenti funzionano e che il firmware trova le vostre funzioni. Se qui la compilazione fallisce il problema è l'installazione, non il programma, e va risolto prima di proseguire. L'ultima nota è la regola di tutto il progetto: aggiungere una cosa, eseguire, guardare. Mai due cose insieme.

## Slide 5: Costanti: i colori e la griglia

Queste righe sostituiscono l'inizio dello scheletro. Ogni `.equ` dà un nome a un numero e non usa memoria: l'assemblatore sostituisce semplicemente il numero. Tre colori in RGB565. Poi la geometria: una cella è di 8 per 8 pixel, quindi i 320 pixel di larghezza contengono 40 colonne; gli 8 pixel in alto sono riservati al titolo, e i 192 restanti contengono 24 righe. `SPEED_Q8` è la velocità in virgola fissa e si userà nel passo 3. Le costanti con un nome rendono il programma leggibile e facile da modificare.

## Slide 6: Variabili e una stringa

Questo va in fondo al file. La sezione `.rodata` contiene ciò che non cambia mai: il titolo, una stringa che `.asciz` termina con un byte a zero. La sezione `.data` contiene le variabili, una parola di 32 bit ciascuna: la colonna della testa, la sua riga, e la frazione di passo accumulata finora. I valori iniziali scritti qui sono solo un punto di partenza: `init` li imposterà di nuovo in modo esplicito.

## Slide 7: init: la testa al suo posto

`verm1_init` mette la testa al suo posto. Per ogni variabile lo schema è lo stesso: `la` carica l'indirizzo, `li` carica il valore, `sw` memorizza il valore all'indirizzo. La frazione `step_q8` si azzera memorizzando direttamente il registro `zero`. La funzione non chiama nulla, quindi è una *foglia* e non le serve un frame di stack. Perché impostare valori che `.data` contiene già? Perché `init` può essere chiamata di nuovo per ricominciare la partita: mai fidarsi di ciò che la memoria conteneva.

## Slide 8: draw: titolo e testa

`verm1_draw` fa tre chiamate: cancella lo schermo, scrive il titolo, disegna la testa. Salva quindi `ra` in un frame di stack all'inizio e lo ripristina alla fine, come nella Lezione 02. Guardate come la cella diventa pixel: la colonna è caricata in `a0` e scorsa a sinistra di 3; la riga è caricata in `a1`, scorsa e aumentata di `TOP`. Gli argomenti restanti sono larghezza, altezza e colore. Gli argomenti viaggiano da `a0` ad `a4`, nell'ordine in cui la funzione li aspetta.

## Slide 9: Eseguite: una testa sulla griglia

Compilate ed eseguite. Dovreste vedere la parola VERM1 in alto a sinistra e un quadrato verde fermo nella colonna 5 della riga 12. La schermata sulla slide è stata presa più tardi, dalla Parte 1 finita, quindi la sua testa è più a destra: non preoccupatevi della differenza. Se il vostro quadrato è nel posto sbagliato, controllate per prima cosa i due scorrimenti e la somma di `TOP`.

## Slide 10: update: accumulare, avanzare, rientrare

Leggete `verm1_update` in due metà. Prima il timer: si carica `step_q8`, si somma la velocità, si confronta con 256. Se è minore si salta all'etichetta 2, si memorizza la frazione e si ritorna: in questo frame nulla si muove. Altrimenti si sottrae 256, tenendo il resto, e lo si memorizza. Poi il passo: si carica `head_x`, si somma 1, si confronta con `COLS`; se la colonna è arrivata a 40 diventa 0, e la testa rientra da sinistra. Le etichette `1:` e `2:` sono etichette locali: `1f` significa «la prossima etichetta 1 in avanti».

## Slide 11: Eseguite: la testa attraversa il mondo

Eseguite. La testa va verso destra a circa cinque celle al secondo, esce dalla colonna 39 e rientra dalla colonna 0. Poi sperimentate con la velocità: prima di ogni esecuzione, prevedete che cosa vedrete. Con 8 la testa è lenta; con 128 fa un passo ogni due frame; con 256, un passo per frame. Provate un valore più grande e scoprite un limite di questo programma: `update` fa al più un passo per frame.

## Slide 12: Il listato: il vostro codice dopo l'assemblatore

Il debugger non mostra il vostro sorgente: mostra ciò che l'assemblatore ha prodotto. I nomi sono spariti: le etichette sono diventate indirizzi e `SPEED_Q8` è diventato il numero 40. Le pseudo-istruzioni sono espanse: `la` è `auipc` seguita da `addi`, `li` è una `addi` da `zero`, `ret` è un salto a `ra`. Alcune istruzioni cominciano con `c.`: sono le forme compresse, a 16 bit, delle stesse istruzioni, la C di RV32IMAC. Riconoscere il proprio programma in questo listato è un'abilità che cresce con la pratica.

## Slide 13: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 14: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 15: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 16: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 17: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 18: Fatelo vostro

Quattro modifiche per fare vostro il programma, ciascuna di poche righe. Fate muovere la testa verso sinistra: la somma diventa una sottrazione, e il bordo si rileva sul segno del risultato. Fatela muovere verso il basso. Disegnate una seconda cella, più scura, dietro la testa. Scrivete il vostro nome accanto al titolo in un colore calcolato a mano. Prima di sperimentare tenete una copia della Parte 1 funzionante: la Parte 2 parte da lì.
