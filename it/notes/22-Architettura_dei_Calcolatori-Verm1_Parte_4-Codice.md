# Lezione 22: Verm1, parte 4: il gioco finito: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: quoziente e resto; caratteri e stringhe; la virgola fissa; la convenzione di chiamata; gli array in memoria; macchine a stati finiti; il frame buffer; il ciclo del processore. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Verm1, parte 4: il gioco finito: il codice

Questa è la presentazione del codice della Lezione 22. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di riferimento è ~/arc12/verm1/verm1_part4.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

Gli stessi due comandi di sempre. Prima di cambiare qualcosa, eseguite la Parte 3 in modalità debug e annotate ciò che mostra la telemetria durante una partita: istruzioni eseguite, frame al secondo, frame in ritardo. Questi numeri sono il «prima» della misura che chiude la lezione; senza di essi non potrete dire che cosa avete guadagnato.

## Slide 4: NUOVO to_decimal: dividere per dieci, tre volte

`to_decimal` ha un contratto scritto nel suo commento: il valore in `a0`, l'indirizzo di tre caratteri in `a1`. Per tre volte fa la stessa cosa: `remu` dà il resto della divisione per dieci, si somma 48, `sb` memorizza il byte, e `divu` lascia il quoziente per il giro successivo. Gli scostamenti sono 2, 1 e 0: dalle unità alle centinaia. È una funzione *foglia*: non chiama nessuno e usa solo registri temporanei, quindi non ha bisogno di alcuno stack frame.

## Slide 5: MODIFICATO draw_score: due numeri, due testi

`draw_score` sostituisce quella della Parte 3. Chiama `to_decimal` due volte, una per il punteggio e una per il punteggio migliore, ogni volta con l'indirizzo, dentro una stringa, in cui devono andare le cifre: `best_txt+5` salta la parola BEST e lo spazio. Poi le due stringhe si disegnano come qualunque altro testo. Poiché il testo viene disegnato con il suo sfondo, le nuove cifre coprono le vecchie.

## Slide 6: MODIFICATO .data: le variabili della Parte 4

La nuova sezione `.data`. Due stringhe che il programma compila: stanno in `.data` e non in `.rodata` proprio perché il programma ci scrive dentro. Poi sei nuove variabili: `dirty`, la vecchia posizione della testa, e la cella da cancellare. Non vengono usate fino al terzo passo; scrivetele adesso, così la sezione si scrive una volta sola.

## Slide 7: Eseguite: le cifre

Compilate ed eseguite. La riga in alto dice VERM1 000 e, a destra, BEST 000; ogni pasto aggiunge uno; quando perdete, BEST mostra il vostro punteggio. Poi aprite il debugger e guardate `score_txt` in memoria: dopo tre pasti i suoi byte sono 30 30 33 00. State leggendo i caratteri prodotti dalla vostra divisione.

## Slide 8: MODIFICATO Costanti: due velocità invece di una

La costante `SPEED_Q8` è sostituita da due: un minimo di 32 e un massimo di 96. Sono valori in virgola fissa, in 256-esimi di cella per frame, come nella Parte 2: 32 significa un passo ogni otto frame, 96 significa tre passi ogni otto frame.

## Slide 9: MODIFICATO play_update: una velocità che cresce

Il timer alla fine di `play_update`. La velocità è 32 più quattro volte il punteggio: uno scorrimento di due posizioni e una somma. Poi un confronto tiene il minore tra questo valore e il massimo. Il resto è il timer che conoscete: la velocità si somma a un accumulatore, e si fa un passo quando questo supera 256. Un valore che segue una retta e poi resta a un limite è una *saturazione*.

## Slide 10: Eseguite: sempre più veloce

Compilate ed eseguite: il verme parte più lento che nella Parte 3 e accelera a ogni pasto. Con il debugger contate i frame tra due passi a punteggio zero: otto. Arrivate a sedici punti e verificate che la velocità non cambia più. Poi, se ne avete il coraggio, provate un massimo di 256: un passo per frame.

## Slide 11: MODIFICATO play_note: una funzione, ogni nota

`play_note` sostituisce `eat_sound`. Il chiamante sceglie la nota e la durata, in `a2` e `a4`; la funzione compila canale, strumento e volume e chiama `prg32_audio_note`. Notate la scelta dei registri: nota e durata sono già dove le aspetta la funzione del runtime, quindi non c'è nulla da spostare. Un contratto progettato attorno al chiamato risparmia istruzioni.

## Slide 12: MODIFICATO step: ricordare la vecchia testa

L'inizio di `step`, con due store in più: prima che la testa si muova, le sue coordinate vengono scritte in `old_x` e `old_y`. Quella cella sta per smettere di essere testa e diventare corpo, e `draw` dovrà ridipingerla.

## Slide 13: MODIFICATO step: c'è una cella da cancellare?

Il ramo del pasto. Quando il verme mangia, la coda non si muove, quindi non c'è alcuna cella da cancellare: `erase_on` viene messo a zero per dirlo.

## Slide 14: MODIFICATO step: annotare la coda, chiamare la fine

Quando il verme non mangia, la coda lascia una cella: le sue coordinate vengono salvate in `erase_x` ed `erase_y`, ed `erase_on` diventa 1. Più sotto, la collisione con il corpo non è più gestita qui: è diventata una sola chiamata a `game_is_over`.

## Slide 15: MODIFICATO step: scrivere la nuova testa

La nuova testa viene scritta nell'anello e nella mappa, esattamente come nella Parte 3. La slide è qui solo perché la funzione continua nella successiva.

## Slide 16: NUOVO step: qualcosa è cambiato

La nuova fine di `step`. Prima `dirty` viene messo a 1: c'è stato un passo, e `draw` ha da fare. Poi, se il verme ha mangiato: un punto in più, nuovo cibo, e una nota breve e acuta, la numero 72 per 60 millisecondi, richiesta con due `li` e una chiamata.

## Slide 17: NUOVO game_is_over: la transizione, in un posto solo

`game_is_over` raccoglie in un posto solo tutto ciò che comporta la transizione da PLAY a OVER: il nuovo stato, l'aggiornamento del punteggio migliore, `dirty` messo a 2 perché va disegnata un'intera schermata nuova, e una nota lunga e bassa, la numero 36 per 400 millisecondi. Una transizione della macchina a stati merita una funzione tutta sua.

## Slide 18: Eseguite: il suono della sconfitta

Compilate ed eseguite: il gioco appare esattamente come dopo il secondo passo. Ciò che cambia si sente: una nota bassa quando vi mordete. Nel debugger guardate `erase_x` ed `erase_y` seguire la coda, un passo indietro, e `dirty` restare a 1 o 2: viene scritto, e nessuno lo legge ancora.

## Slide 19: MODIFICATO draw: niente, poco, o tutto

La nuova `verm1_draw` legge `dirty` e lo azzera subito. Se valeva zero, ritorna immediatamente: niente stack frame, niente chiamate, cinque istruzioni macchina. Se valeva 1, c'è stato un passo e viene chiamata `draw_changes`. Se valeva 2, lo stato è cambiato e `draw_full` ridisegna tutto. Il caso più frequente è il meno costoso, ed è il segno di un'ottimizzazione ben fatta.

## Slide 20: NUOVO draw_changes: tre celle e il punteggio

`draw_changes` dipinge al massimo tre celle. Se `erase_on` è a 1, la cella lasciata dalla coda diventa nera. La vecchia testa viene ridipinta con il colore del corpo. Poi la nuova testa, il cibo e il punteggio. L'ordine conta: la testa può entrare proprio nella cella che la coda ha appena lasciato, quindi la cancellazione deve venire prima e la testa dopo.

## Slide 21: NUOVO draw_full: una schermata intera

`draw_full` è il corpo della vecchia `verm1_draw`: cancella lo schermo e disegna il punteggio; nello stato TITLE aggiunge l'invito e ritorna. Viene chiamata una volta per ogni cambio di stato, non a ogni frame.

## Slide 22: NUOVO draw_full: PLAY e OVER

La seconda metà di `draw_full`: in PLAY e OVER disegna il verme e il cibo con le loro funzioni, e in OVER aggiunge le due parole del game over.

## Slide 23: NUOVO draw_head

`draw_head` disegna una cella in verde brillante: la voce `head_i` dell'anello. È una piccola funzione con un solo compito, usata da `draw_changes`.

## Slide 24: NUOVO draw_food

`draw_food`: le tre righe che stavano dentro `draw` ora hanno un nome e due chiamanti, il disegno completo e quello parziale.

## Slide 25: INVARIATO draw_text

`draw_text`, la funzione di servizio della Parte 3, invariata. Ha una slide tutta sua perché nella Parte 3 ne condivideva una con il testo del game over.

## Slide 26: MODIFICATO init: chiedere la prima schermata

`verm1_init` con tre righe in più: `dirty` parte da 2, perché la schermata del titolo va disegnata una volta.

## Slide 27: MODIFICATO update: un nuovo stato è una nuova schermata

In `verm1_update`, la transizione da OVER di nuovo a TITLE ora mette anche `dirty` a 2: un nuovo stato è una nuova schermata.

## Slide 28: MODIFICATO new_game: e anche qui

Lo stesso in `new_game`, per la transizione da TITLE a PLAY. È la regola della tecnica: ogni transizione chiede un disegno completo, ogni passo uno parziale. Se ne dimenticate uno, lo schermo mostra uno stato che non è più vero, ed è l'errore tipico.

## Slide 29: Eseguite: il Verm1 finito

Il Verm1 finito. Deve essere lo stesso gioco di dopo il terzo passo, pixel per pixel: l'ottimizzazione non deve vedersi. Se vedete scie o buchi, qualche cambiamento non è stato annotato: trovatelo con il debugger, partendo dalle tre variabili che scrive `step`.

## Slide 30: Appendice: le funzioni che non sono cambiate

Segue un'appendice: le otto parti del file che non sono cambiate rispetto alla Parte 3. Sono incluse perché questa presentazione contenga l'intero programma; nel vostro file tenetele come sono.

## Slide 31: INVARIATO update: pulsanti e fronti

`verm1_update`: la lettura dei pulsanti e il rilevatore di fronte della Parte 3.

## Slide 32: INVARIATO new_game: la mappa e il verme

La prima metà di `new_game`: la mappa viene svuotata e il verme viene posato.

## Slide 33: INVARIATO play_update: la sterzata

La sterzata dentro `play_update`: le maschere dei pulsanti e la regola che vieta l'inversione a U, dalla Parte 2.

## Slide 34: INVARIATO step: la ricerca in tabella

L'inizio di `step`: lo stack frame e la ricerca della direzione nelle tabelle `dx` e `dy`.

## Slide 35: INVARIATO place_food

`place_food`: una cella a caso, ritentata finché non è libera.

## Slide 36: INVARIATO draw_worm

`draw_worm`, che percorre l'anello all'indietro. Ora è usata solo da `draw_full`, una volta per nuova schermata.

## Slide 37: INVARIATO draw_cell

`draw_cell`, dalle celle ai pixel: la stessa funzione dalla Parte 2.

## Slide 38: INVARIATO .rodata

La sezione `.rodata`: le stringhe e le tabelle delle direzioni.

## Slide 39: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 40: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 41: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 42: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 43: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 44: Fatelo vostro

Quattro idee per fare vostro il gioco. Una pausa con il pulsante B: un quarto stato. Una melodia nella schermata del titolo, da una tabella di note. Cibo bonus che vale di più e scompare. I vostri colori, o le vostre regole. La versione che pubblicherete nella prossima lezione dovrebbe contenere qualcosa di vostro, a cominciare dal titolo.
