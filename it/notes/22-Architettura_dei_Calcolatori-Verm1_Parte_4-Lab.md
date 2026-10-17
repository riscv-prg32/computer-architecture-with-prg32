# Lezione 22: Verm1, parte 4: il gioco finito: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: quoziente e resto; caratteri e stringhe; la virgola fissa; la convenzione di chiamata; gli array in memoria; macchine a stati finiti; il frame buffer; il ciclo del processore. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) trasformare un numero in cifre decimali con divu e remu; (2) disegnare solo ciò che è cambiato, con un flag dirty; (3) completare il gioco: livelli, suono, velocità. Si appoggia su: caratteri e stringhe (Lezione 04); la virgola fissa (Lezione 06); la convenzione di chiamata (Lezione 18); gli array in memoria (Lezione 04); macchine a stati finiti (Lezione 13). Prossimo passo: Lezione 23, Verm1 sul Cartridge Store.

Il filo della lezione: Verm1 è finito: ogni argomento del corso vi ha una riga. Prossimo passo: dargli un nome, un'icona e un posto sullo Store.

## Slide 1: Verm1, parte 4: il gioco finito: il codice

Questa è la presentazione del codice della Lezione 22. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di riferimento è ~/arc12/verm1/verm1_part4.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

I soliti due comandi. Prima di cambiare qualsiasi cosa si esegue la Parte 3 in modalità debug e si annota la telemetria durante una partita: istruzioni eseguite, frame al secondo, frame in ritardo. Queste cifre sono il riferimento della misura che chiude la lezione; senza di esse nessuna affermazione di miglioramento sarebbe sostenibile.

## Slide 4: NUOVO to_decimal: dividere per dieci, tre volte

`to_decimal` dichiara il suo contratto in un commento: il valore in `a0`, l'indirizzo di tre caratteri in `a1`. Esegue tre volte la stessa operazione: `remu` dà il resto della divisione per dieci, gli si somma 48, `sb` memorizza il byte, e `divu` lascia il quoziente per il giro successivo. Gli spiazzamenti sono 2, 1 e 0, dalle unità alle centinaia. La funzione è una *foglia*: non chiama nulla e usa solo temporanei, quindi non le serve alcuno stack frame. Le istruzioni di divisione sono lente su un piccolo processore, decine di cicli ciascuna, ma dieci di esse per passo sono trascurabili.

## Slide 5: MODIFICATO draw_score: due numeri, due testi

`draw_score` sostituisce quella della Parte 3. Chiama `to_decimal` due volte, una per il punteggio e una per il punteggio migliore, ogni volta con un indirizzo dentro una stringa in cui vanno le cifre: `best_txt+5` salta la parola BEST e lo spazio che la segue. Le due stringhe si disegnano poi come qualsiasi altro testo. Poiché il testo si disegna con il suo colore di sfondo, le nuove cifre coprono le vecchie senza bisogno di cancellarle prima.

## Slide 6: MODIFICATO .data: le variabili della Parte 4

La nuova sezione `.data`. Due stringhe che il programma riempie, poste in `.data` e non in `.rodata` proprio perché il programma vi scrive. Seguono sei nuove variabili: `dirty`, la posizione precedente della testa, e la cella da cancellare. Non si usano fino al terzo passo, ma si scrivono ora perché la sezione si scriva una volta sola.

## Slide 7: Eseguite: le cifre

Compilare ed eseguire. La riga in alto mostra VERM1 000 e, a destra, BEST 000; ogni pasto incrementa il primo; perdendo, BEST mostra il punteggio raggiunto. Nel debugger si può ispezionare `score_txt` in memoria: dopo tre pasti i suoi byte sono 30 30 33 00, i caratteri prodotti dalla divisione dello studente.

## Slide 8: MODIFICATO Costanti: due velocità invece di una

La costante `SPEED_Q8` è sostituita da due: un minimo di 32 e un massimo di 96. Entrambi sono valori in virgola fissa in 256-esimi di cella per frame, come nella Parte 2: 32 significa un passo ogni otto frame, 96 tre passi ogni otto frame.

## Slide 9: MODIFICATO play_update: una velocità che cresce

Il timer alla fine di `play_update`. La velocità è 32 più quattro volte il punteggio, calcolata con uno scorrimento di due posizioni e una somma. Un confronto conserva poi il minore tra questo valore e il massimo. Il resto è il timer consueto: la velocità si somma a un accumulatore, e si fa un passo ogni volta che supera 256. Una grandezza che segue una retta e poi resta a un limite si dice che *satura*, la stessa idea del clamping della Lezione 05.

## Slide 10: Eseguite: sempre più veloce

Compilare ed eseguire: il verme parte più lento che nella Parte 3 e accelera a ogni pasto. Con il debugger si possono contare i frame tra due passi a punteggio zero: otto, come previsto. Raggiunti i sedici punti, si può verificare che la velocità resti costante. I più audaci possono poi provare un massimo di 256, un passo per frame.

## Slide 11: MODIFICATO play_note: una funzione, ogni nota

`play_note` sostituisce `eat_sound`. Il chiamante sceglie nota e durata, in `a2` e `a4`; la funzione fornisce canale, strumento e volume e chiama `prg32_audio_note`. La scelta dei registri è voluta: nota e durata stanno già dove la funzione del runtime le aspetta, quindi non serve spostare nulla. Progettare un contratto attorno all'interfaccia della funzione chiamata risparmia istruzioni, un esempio piccolo ma caratteristico di progetto delle interfacce.

## Slide 12: MODIFICATO step: ricordare la vecchia testa

L'inizio di `step`, con due memorizzazioni aggiunte: prima che la testa si muova, le sue coordinate si scrivono in `old_x` e `old_y`. Quella cella sta per smettere di essere la testa e diventare corpo, e `draw` dovrà ridipingerla.

## Slide 13: MODIFICATO step: c'è una cella da cancellare?

Il ramo seguito in caso di pasto. Quando il verme mangia, la coda non si muove, quindi non c'è cella da cancellare, e `erase_on` si pone a zero per registrarlo.

## Slide 14: MODIFICATO step: annotare la coda, chiamare la fine

Quando il verme non mangia, la coda lascia una cella: le sue coordinate si salvano in `erase_x` ed `erase_y`, ed `erase_on` si pone a 1. Più avanti la collisione con il corpo non si gestisce più sul posto: è diventata una sola chiamata a `game_is_over`.

## Slide 15: MODIFICATO step: scrivere la nuova testa

La nuova testa si scrive nell'anello e nella mappa esattamente come nella Parte 3. La slide compare solo perché la funzione continua nella successiva.

## Slide 16: NUOVO step: qualcosa è cambiato

La nuova fine di `step`. Prima si pone `dirty` a 1, perché è avvenuto un passo e `draw` ha del lavoro da fare. Poi, se il verme ha mangiato: un punto in più, un nuovo cibo, e una nota breve e acuta, la numero 72 per 60 millisecondi, richiesta con due istruzioni `li` e una chiamata, con gli argomenti passati per contratto.

## Slide 17: NUOVO game_is_over: la transizione, in un posto solo

`game_is_over` raccoglie in un solo punto tutto ciò che comporta la transizione da PLAY a OVER: il nuovo stato, l'aggiornamento del punteggio migliore, `dirty` posto a 2 perché va disegnata un'intera schermata nuova, e una nota lunga e grave, la numero 36 per 400 millisecondi. Una transizione della macchina a stati merita una funzione propria, così che i suoi effetti non possano essere sparsi o dimenticati in parte.

## Slide 18: Eseguite: il suono della sconfitta

Compilare ed eseguire: il gioco appare esattamente come dopo il secondo passo. Ciò che cambia si sente: una nota grave quando ci si morde. Nel debugger si vedono `erase_x` ed `erase_y` seguire la coda con un passo di ritardo, e `dirty` valere 1 o 2: viene scritto, e ancora nulla lo legge.

## Slide 19: MODIFICATO draw: niente, poco, o tutto

La nuova `verm1_draw` legge `dirty` e lo azzera subito. Se valeva zero, la funzione ritorna immediatamente: nessuno stack frame, nessuna chiamata, cinque istruzioni macchina. Se valeva 1, è avvenuto un passo e si chiama `draw_changes`. Se valeva 2, lo stato è cambiato e `draw_full` ridisegna tutto. Il caso più frequente è il più economico, che è il segno di un'ottimizzazione ben concepita.

## Slide 20: NUOVO draw_changes: tre celle e il punteggio

`draw_changes` dipinge al più tre celle. Se `erase_on` è impostato, la cella lasciata dalla coda si dipinge di nero. La vecchia testa si ridipinge nel colore del corpo. Poi si disegnano la nuova testa, il cibo e il punteggio. L'ordine conta: la testa può entrare proprio nella cella che la coda ha appena lasciato, quindi la cancellazione deve precedere il disegno della testa.

## Slide 21: NUOVO draw_full: una schermata intera

`draw_full` è il corpo della vecchia `verm1_draw`: cancella lo schermo e disegna il punteggio, e nello stato TITLE aggiunge l'invito e ritorna. Si chiama una volta per ogni cambio di stato, non a ogni frame.

## Slide 22: NUOVO draw_full: PLAY e OVER

La seconda metà di `draw_full`: in PLAY e OVER disegna il verme e il cibo attraverso le loro funzioni, e in OVER aggiunge le due parole della schermata di fine partita.

## Slide 23: NUOVO draw_head

`draw_head` disegna una cella in verde brillante, la voce `head_i` dell'anello. È una piccola funzione con una sola responsabilità, usata da `draw_changes`.

## Slide 24: NUOVO draw_food

`draw_food`: le tre righe che stavano dentro `draw` hanno ora un nome e due chiamanti, il disegno completo e quello parziale.

## Slide 25: INVARIATO draw_text

`draw_text`, l'aiutante della Parte 3, invariato. Compare in una slide propria perché nella Parte 3 ne condivideva una con il testo di fine partita.

## Slide 26: MODIFICATO init: chiedere la prima schermata

`verm1_init` con tre righe aggiunte: `dirty` parte da 2, perché la schermata del titolo va disegnata una volta.

## Slide 27: MODIFICATO update: un nuovo stato è una nuova schermata

In `verm1_update` la transizione da OVER di nuovo a TITLE pone ora anche `dirty` a 2: un nuovo stato richiede una nuova schermata.

## Slide 28: MODIFICATO new_game: e anche qui

Lo stesso in `new_game`, per la transizione da TITLE a PLAY. È la regola che governa la tecnica: ogni transizione richiede un disegno completo, ogni passo uno parziale. Dimenticarne una produce il difetto caratteristico del disegno incrementale, uno schermo che rappresenta uno stato non più vero.

## Slide 29: Eseguite: il Verm1 finito

Il Verm1 finito. Deve essere lo stesso gioco di dopo il terzo passo, pixel per pixel: l'ottimizzazione deve essere invisibile. Scie o buchi indicano che qualche cambiamento non è stato registrato, e va cercato con il debugger, a partire dalle tre variabili che `step` scrive.

## Slide 30: Appendice: le funzioni che non sono cambiate

Segue un'appendice: le otto parti del file invariate dalla Parte 3. Sono incluse perché questa presentazione contenga l'intero programma, e vanno tenute così come sono.

## Slide 31: INVARIATO update: pulsanti e fronti

`verm1_update`: la lettura dei pulsanti e il rilevatore di fronti della Parte 3.

## Slide 32: INVARIATO new_game: la mappa e il verme

La prima metà di `new_game`: la mappa viene azzerata e il verme steso.

## Slide 33: INVARIATO play_update: la sterzata

La guida dentro `play_update`: le maschere dei pulsanti e la regola che vieta l'inversione a U, dalla Parte 2.

## Slide 34: INVARIATO step: la ricerca in tabella

L'inizio di `step`: lo stack frame e la consultazione della direzione nelle tabelle `dx` e `dy`.

## Slide 35: INVARIATO place_food

`place_food`: una cella casuale, estratta di nuovo finché non ne esce una libera.

## Slide 36: INVARIATO draw_worm

`draw_worm`, che percorre l'anello all'indietro. Ora la usa solo `draw_full`, una volta per ogni nuova schermata.

## Slide 37: INVARIATO draw_cell

`draw_cell`, dalle celle ai pixel: la stessa funzione dalla Parte 2.

## Slide 38: INVARIATO .rodata

La sezione `.rodata`: le stringhe e le tabelle delle direzioni.

## Slide 39: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 40: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 41: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 42: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 43: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 44: Fatelo vostro

Quattro idee per fare proprio il gioco. Una pausa sul pulsante B, che richiede un quarto stato. Una melodia sulla schermata del titolo, letta da una tabella di note. Un cibo bonus che vale di più e scompare dopo un certo tempo. Colori propri, o regole proprie. La versione pubblicata nella prossima lezione dovrebbe contenere qualcosa dell'autore, a cominciare dal titolo.
