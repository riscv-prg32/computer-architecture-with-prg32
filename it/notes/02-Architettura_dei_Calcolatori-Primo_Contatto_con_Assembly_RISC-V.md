# Lezione 02: Primo contatto: l'assembly RISC-V su PRG32

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Primo contatto: l'assembly RISC-V su PRG32

È la prima lezione in cui scrivete un programma, e viene di proposito prima di ogni teoria. In due ore costruite quattro piccole cartucce, ognuna un programma completo che gira. Oggi non capirete ogni dettaglio, e nessuno se lo aspetta: lo scopo è *vedere* al lavoro i registri, la memoria e una chiamata di funzione, così che le lezioni successive abbiano qualcosa di concreto da spiegare. La citazione dà il tono: meno parole, più codice.

## Slide 2: Che cosa saprete fare alla fine

Sei cose che saprete fare alla fine. Le prime quattro sono pratiche: compilare ed eseguire una cartuccia, nominare i registri, chiamare una funzione con i suoi argomenti, conservare un valore in memoria tra un frame e l'altro. La quinta è un cambio di punto di vista: un'istruzione è un numero a 32 bit. La sesta è la più importante per il corso: uscirete con un elenco di domande, e ognuna è l'argomento di una lezione successiva.

## Slide 3: La macchina

Prima di scrivere, uno sguardo alla macchina. Un processore RISC-V è descritto da due sole cose: un insieme di registri e un repertorio di istruzioni. Le prossime tre slide presentano entrambi, e il contratto tra il vostro programma e PRG32.

## Slide 4: La macchina che state programmando

L'intera macchina in quattro riquadri. Ci sono 32 *registri*, ciascuno con un valore a 32 bit, e il processore sa calcolare solo su ciò che contengono. Ci sono tre tipi di istruzione. *Calcolare*: aritmetica e logica tra registri, come `add` o `addi`. *Spostare*: trasferimenti tra un registro e la memoria, `lw` per caricare una parola e `sw` per memorizzarla; nient'altro tocca la memoria. *Saltare*: cambi dell'istruzione che verrà eseguita dopo. Tutto ciò che fa un calcolatore è una lunga sequenza di questi tre tipi.

## Slide 5: I registri che userete davvero

I registri hanno nomi che dicono come si usano. Da `a0` ad `a7` portano gli argomenti di una chiamata, e `a0` riporta indietro il risultato. Da `t0` a `t6` sono temporanei, liberi da usare e non conservati da una chiamata. Da `s0` a `s11` sono conservati. `ra` contiene l'indirizzo di ritorno, `sp` la cima dello stack, e `zero` si legge sempre 0. Leggete con cura la didascalia: questi ruoli non sono incisi nell'hardware. Sono un accordo, la *convenzione di chiamata*, ed è ciò che permette al vostro assembly e al codice C del framework di chiamarsi a vicenda.

## Slide 6: Il contratto: tre funzioni che scrivete voi

Il contratto con PRG32 è fatto di tre funzioni che scrivete voi. `init` viene chiamata una volta, all'avvio della cartuccia, per preparare lo stato. `update` viene chiamata una volta per frame, per leggere l'ingresso e cambiare lo stato. `draw` viene chiamata una volta per frame, per trasformare lo stato in un'immagine. Il firmware le trova per nome: un prefisso scelto da voi, seguito da `_init`, `_update` e `_draw`. Tenete presente dal primo giorno la divisione dei compiti: `update` decide, `draw` mostra.

## Slide 7: La prima cartuccia

Ora la pratica: quattro passi, ognuno un programma completo. Scriveteli voi; non fate copia e incolla. Battere il codice costringe a leggere ogni carattere, e gli errori che si fanno battendo sono le lezioni meno costose del corso.

## Slide 8: Passo 1: il più piccolo programma che gira

Il più piccolo programma che gira. `.option norelax` è una riga con cui comincia ogni esempio PRG32: rende prevedibile la disposizione della cartuccia. `.section .text` dice che segue del codice. Ogni `.global` rende un'etichetta visibile fuori dal file, così il firmware può trovare la funzione per nome. Poi tre funzioni, ciascuna fatta della sola istruzione `ret`, che ritorna al chiamante. Il risultato è uno schermo nero, ed è un successo: il framework ha trovato le vostre tre funzioni, le ha chiamate, e ha riavuto il controllo.

## Slide 9: Compilare, eseguire

Due comandi che batterete centinaia di volte. `cartridge build` trasforma il file assembly in una cartuccia: `--entry-prefix first` è il prefisso delle vostre tre funzioni, `--out` il nome del risultato. Poi la si esegue: in QEMU con `qemu upload` e `qemu run`, oppure su una scheda o su PRG32-QT con `upload-and-run` e l'indirizzo dell'host. Per PRG32-QT sul vostro portatile l'indirizzo è `http://localhost:8080`. Il file della cartuccia è lo stesso per tutti e tre.

## Slide 10: Passo 2: dire ciao

Il secondo passo scrive sullo schermo. Leggete `first_draw` in tre parti. Le prime due righe fanno spazio sullo stack e salvano `ra`. Poi due chiamate: `prg32_gfx_clear` con il colore in `a0`, e `prg32_gfx_text8` con cinque argomenti da `a0` ad `a4`: x, y, l'indirizzo della stringa, colore del testo, colore dello sfondo. Notate i due modi di caricare: `li` carica un numero, `la` carica l'indirizzo di un'etichetta. Le ultime tre righe ripristinano `ra`, rilasciano lo stack e ritornano. La stringa è un dato, nella sezione `.rodata`.

## Slide 11: Perché salvare ra? Il frame di stack

Perché salvare `ra`? L'istruzione `call` scrive in `ra` l'indirizzo a cui tornare. Ma la funzione che chiamate può fare a sua volta delle chiamate, e ognuna sovrascrive `ra`. Perciò una funzione che ne chiama un'altra deve prima salvare in memoria il proprio `ra`: abbassa `sp` di 16 per fare spazio, il *frame di stack*, e memorizza `ra` in `12(sp)`. Dopo la chiamata fa il contrario. Il disegno mostra il frame: lo stack cresce verso gli indirizzi bassi. Dimenticare questa coppia di operazioni è il classico primo bug: la funzione ritorna nel posto sbagliato.

## Slide 12: Passo 3: un valore che sopravvive tra i frame

Il terzo passo conserva un valore da un frame al successivo. I registri non sopravvivono tra una chiamata di `update` e l'altra, quindi il valore deve vivere in memoria. `counter` è un'etichetta: dà un nome a una locazione della sezione `.data` che contiene una parola. Le quattro istruzioni sono lo schema di ogni variabile: `la` mette in `t0` l'*indirizzo* della locazione; `lw` carica in `t1` il *valore*; `addi` lo modifica; `sw` lo riscrive. Load, modify, store. Sullo schermo non cambia ancora nulla: il contatore avanza, ma nessuno lo disegna.

## Slide 13: Indirizzo o valore? Il nodo della memoria

Questa slide separa due idee che i principianti confondono: l'indirizzo e il valore. Dopo `la`, `t0` contiene *dove* vive il contatore. Dopo `lw`, `t1` contiene *che cosa* vi è memorizzato, 41 nel disegno. `addi` porta a 42 la copia nel registro, e la memoria dice ancora 41 finché `sw` non la riscrive. Seguite le due frecce. Un'abitudine pratica dal riquadro a destra: nei commenti scrivete per ogni registro se contiene un INDIRIZZO o un VALORE. Previene l'errore più comune del primo mese.

## Slide 14: Passo 4: rendere visibile il contatore

Il quarto passo rende visibile il contatore come una barra verde. Il valore viene caricato, e `andi a2, t1, 255` ne conserva solo gli otto bit bassi, così la larghezza va da 0 a 255 e poi ricomincia. Gli altri registri sono gli argomenti di `prg32_gfx_rect`: x, y, larghezza, altezza e colore. Otto righe, e vi si nascondono tre lezioni future: 255 scritto come 0xFF, `andi` usato come maschera, e 0x07e0 che significa verde. Ricordate dove li avete visti per la prima volta.

## Slide 15: Leggere ciò che avete scritto

Avete scritto un programma; ora leggetelo come fa il processore. Le prossime slide classificano le istruzioni usate, mostrano quali sono scorciatoie, aprono un'istruzione per guardarne i bit, e tracciano il programma a mano.

## Slide 16: Le istruzioni che avete appena usato

Cinque famiglie coprono tutto ciò che avete battuto: aritmetica (`add`, `sub`), logica (`and`, `or`, `xor`), le forme con immediato che prendono una piccola costante (`addi`, `andi`), memoria (`lw`, `sw`) e controllo (`call`, `ret`). In ogni istruzione il risultato va nel primo registro nominato: `add t0, t1, t2` mette `t1 + t2` in `t0`. L'insieme di base ha circa quaranta istruzioni, e ne avete già incontrato un quarto.

## Slide 17: Pseudo-istruzioni: scorciatoie che l'assemblatore espande

Alcune delle istruzioni che avete scritto nel processore non esistono: sono *pseudo-istruzioni*, scorciatoie che l'assemblatore espande. `li t0, 42` diventa `addi t0, zero, 42`; `mv` è una `addi` con 0; `ret` è un salto all'indirizzo in `ra`; `beqz` è un confronto con il registro `zero`. Notate quante volte `zero` compare nella colonna centrale: un registro che vale sempre 0 permette a un insieme di istruzioni piccolo di fare il lavoro di uno più grande.

## Slide 18: Un'istruzione è un numero a 32 bit

Un'istruzione è un numero. `addi t1, t1, 1` è la parola di 32 bit 0x00130313, e la striscia colorata ne mostra i campi: dodici bit per la costante 1, cinque per il registro sorgente (`t1` è il registro numero 6), tre che dicono «somma», cinque per la destinazione, sette per il tipo di istruzione. Il formato non va imparato adesso. Tenete l'idea: l'assembly è una scrittura leggibile del codice macchina, e il processore legge questi campi con circuiti che imparerete a progettare.

## Slide 19: PRG32-QT: un microscopio per i registri

PRG32-QT esegue la stessa cartuccia sul portatile e può fermarsi tra due istruzioni qualsiasi, mostrando tutti i registri. Usatelo ora sul terzo passo: andate su `update`, mettete in pausa, ed eseguite una alla volta le quattro istruzioni di `first_update`, osservando `t0` e `t1`. Prima di ogni pressione dite ad alta voce che cosa cambierà. L'ultima riga è una regola da ricordare: la scheda dice la verità sul tempo, PRG32-QT dice la verità su un registro.

## Slide 20: Tracciare a mano: tre frame di first_update

Una traccia a mano: per ogni frame si scrive che cosa ogni istruzione lascia in `t1` e in memoria. Nei primi frame non accade nulla di sorprendente. Guardate la riga evidenziata: al frame 256 il contatore diventa 256, eppure la larghezza della barra è 0, perché `andi` con 255 conserva solo gli otto bit bassi, e 256 in binario è un uno seguito da otto zeri. Tracciare a mano è lento e poco appariscente, ed è l'abilità di debug più utile che imparerete in questo corso.

## Slide 21: Che cosa viene dopo

La lezione finisce guardando avanti. Ciò che avete battuto ha sollevato delle domande, e la prossima slide le elenca insieme alla lezione che risponde a ciascuna.

## Slide 22: Domande che il vostro programma ha già sollevato

Ogni riga è una cosa vista oggi, la domanda che solleva e dove si trova la risposta. Perché l'esadecimale? Lezioni 04 e 05. Come fa un registro a contenere un numero negativo? Lezione 05. Che cosa fa AND a trentadue bit in un colpo solo? Lezioni 08 e 09. Come fa un circuito a ricordare un bit? Lezioni 13 e 15. Come viene decodificato ed eseguito 0x00130313? Lezioni 18 e 19. L'ultima riga è il progetto: da tre funzioni e un rettangolo, un gioco intero. Conservate questa tabella: è la mappa del corso vista dal vostro programma.

## Slide 23: Verifica la comprensione: Dopo la t0, counter e lw t1, 0(t0), che cosa contiene t0?

Applicate la distinzione tra indirizzo e valore. `la` carica in `t0` l'indirizzo dell'etichetta; `lw` usa poi `t0` per trovare la locazione e ne copia il contenuto in `t1`, senza modificare `t0`. Quindi `t0` contiene ancora l'indirizzo. Se avete scelto «il valore», tornate alla slide con le due frecce.

## Slide 24: Verifica la comprensione: Una funzione che chiama prg32_gfx_clear deve salvare un registro prima della chiamata. Quale?

La chiave è ciò che fa `call`: scrive in `ra` l'indirizzo di ritorno. Se poi la vostra funzione deve tornare al proprio chiamante, le serve il vecchio `ra`, che la chiamata ha appena sovrascritto. `a0` è fatto per essere sovrascritto, `sp` viene ripristinato dalla funzione chiamata, e `t0` è un temporaneo che nessuno ha promesso di conservare.

## Slide 25: Verifica la comprensione: t1 contiene 300. Che cosa lascia in a2 l'istruzione andi a2, t1, 255?

Fate il calcolo in binario. 300 è 256 + 44, cioè un uno in posizione 8 seguito dagli otto bit di 44. La maschera 255 è fatta di otto uni: AND conserva gli otto bit bassi e azzera il resto. Rimane 44. Sottraendo 255 da 300 si ottiene 45, una risposta sbagliata che tenta: AND non è una sottrazione.

## Slide 26: Esercizi su PRG32

Cinque esercizi sulla vostra cartuccia; ognuno è il seme di una lezione successiva. Cambiate il testo e il suo colore. Fate crescere la barra a velocità doppia o quadrupla cambiando una sola istruzione. Fatela accorciare, e osservate che cosa accade quando il contatore supera lo zero: la barra salta alla larghezza massima, e la Lezione 05 spiegherà perché. Eseguite `first_update` passo-passo e annotate i registri. Disegnate una seconda barra larga quanto il contatore modulo 64. Prima prevedete, poi eseguite.

## Slide 27: Glossario: inglese e italiano

Dodici termini di questa lezione, con l'italiano usato in aula. *Load* e *store* si intendono sempre dal punto di vista del processore: load porta un valore dalla memoria a un registro, store lo rimanda indietro. Un *immediato* è una costante scritta dentro l'istruzione stessa. Un *branch* è un salto che avviene solo se vale una condizione. La *convenzione di chiamata* è l'accordo sui ruoli dei registri.

## Slide 28: Riepilogo e letture

Quattro frasi contengono la lezione. Un processore RISC-V è fatto di trentadue registri e di un piccolo insieme di istruzioni che calcolano, spostano e saltano. Un gioco PRG32 sono tre funzioni, con gli argomenti da `a0` ad `a7`, e una funzione che ne chiama un'altra salva `ra`. Le variabili vivono in memoria: `la` per l'indirizzo, `lw` e `sw` per il valore. Un'istruzione è un numero a 32 bit, e l'assembly è la sua scrittura leggibile. La prossima lezione fa un passo indietro e racconta la storia che ha portato a questa macchina.
