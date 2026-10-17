# Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; i codici; gli array in memoria; gli ingressi con pull-up; l'algebra di Boole; la virgola fissa; i multiplexer; istruzioni con o senza segno; comparatori e parità; gli argomenti in a0 ... a7. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) leggere i pulsanti con le maschere e rifiutare un'inversione a U con un solo XOR; (2) confrontare posizioni con XOR e OR per riconoscere il cibo; (3) tenere e mostrare un punteggio. Si appoggia su: le maschere di bit (Lezione 08); i codici (Lezione 11); gli array in memoria (Lezione 04); gli ingressi con pull-up (Lezione 10); l'algebra di Boole (Lezione 08). Prossimo passo: Lezione 13, Macchine sequenziali.

Ponte. Nella Lezione 07 una funzione che ne chiama un'altra salvava ra in un frame di 16 byte. Oggi le funzioni di Verm1 si chiamano più in profondità: ciascuna salva ra una volta, all'ingresso, e lo ripristina prima di ret. La Lezione 18 enuncia le regole: quali registri una chiamata può cambiare e quali deve conservare. Richiamo: Una funzione chiama altre due funzioni. Quante volte deve salvare ra, e dove?

Il filo della lezione: Ogni regola del gioco è diventata qualche istruzione logica: una maschera, uno XOR, un confronto. Prossimo passo: i circuiti che ricordano, e gli stati di un gioco.

## Slide 1: Verm1, parte 2: la guida, il cibo e un punteggio: il codice

Questa è la presentazione del codice della Lezione 12. Mentre la presentazione della lezione sviluppa i concetti, questa raccoglie tutto ciò che si scrive e si esegue: ogni listato con il suo commento, il programma completo della lezione, il risultato che deve produrre, e la procedura per provarlo su ciascuno dei tre host. Le due presentazioni vanno lette insieme: i concetti spiegano il codice, e il codice dà ai concetti una conseguenza osservabile.

## Slide 2: In questa presentazione

Il contenuto della presentazione, nell'ordine delle slide. Il programma della lezione è un file sorgente completo, che si può compilare ed eseguire così com'è. Il percorso consigliato è eseguirlo per primo, osservarne il comportamento, e poi tornare ai singoli listati per capire come ciascuna parte contribuisce a quel comportamento. Il programma di riferimento è ~/arc12/verm1/verm1_part2.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

Gli stessi due comandi della Parte 1: compilare la cartuccia, poi caricarla su PRG32-QT ed eseguirla. PRG32-QT va tenuto aperto per tutta la sessione, con la modalità debug attiva così che il debugger sia a portata di mano; il passo 4 ne ha bisogno.

## Slide 4: MODIFICATO Costanti: pulsanti e direzioni

Queste righe si aggiungono alle costanti della Parte 1. `RED` è il colore del cibo. Le quattro costanti `BTN_` sono maschere, ciascuna con un solo bit a 1, il bit di quel pulsante nella parola restituita dal runtime. Le quattro costanti `DIR_` sono i codici delle direzioni, numeri da 0 a 3, quindi due bit. I commenti dicono il significato di ciascuno dei due bit, e la presentazione della lezione, nella slide "Un codice scelto con cura", giustifica la scelta dei codici.

## Slide 5: MODIFICATO Dati: due tabelle e cinque variabili nuove

Queste righe sostituiscono i dati della Parte 1. La sezione `.rodata` contiene due tabelle di quattro parole, `dx` e `dy`: per ogni codice di direzione, la variazione di colonna e la variazione di riga. Essendo costanti, risiedono con gli altri dati di sola lettura; sono di fatto una piccola ROM, nel senso della Lezione 11. La sezione `.data` contiene cinque nuove variabili: `dir`, la direzione dell'ultimo passo; `want`, la direzione richiesta dal giocatore; e `score`, `food_x` e `food_y`, usate nel passo 3.

## Slide 6: MODIFICATO update: dai pulsanti a un desiderio

Questo sostituisce l'inizio di `verm1_update`. Dopo la chiamata a `prg32_input_read`, `t1` riceve la direzione corrente e `t2` la richiesta corrente. Seguono quattro blocchi identici: `andi` isola un pulsante; se il risultato è zero l'istruzione successiva viene saltata; altrimenti la richiesta in `t2` viene sovrascritta con quella direzione. Infine la regola: lo XOR di richiesta e direzione si confronta con 2, e se sono uguali la richiesta è un'inversione a U e lo `sw` viene saltato, così la richiesta precedente sopravvive. Poiché ora `update` fa una chiamata, richiede uno stack frame.

## Slide 7: MODIFICATO update: il timer chiama step

Il resto di `verm1_update` è il timer in virgola fissa della Parte 1, invariato: si somma la velocità, e quando si è accumulata una cella intera si sottrae 256. L'unica differenza è ciò che accade dopo: invece di aggiornare direttamente `head_x`, il codice chiama una nuova funzione, `step`. Separare il "quando muoversi" dal "come muoversi" è un primo esercizio di scomposizione. Le etichette locali qui sono 6 e 7 perché da 1 a 5 sono già usate nella prima metà della funzione.

## Slide 8: NUOVO step: cercare il movimento

La prima metà di `step`. La richiesta diventa direzione una volta per passo e non una volta per frame, così che due pressioni rapide non possano ripiegare il verme su sé stesso. Poi la consultazione: il codice della direzione si fa scorrere a sinistra di 2, perché ogni voce della tabella è una parola di quattro byte, e si somma all'indirizzo di `dx`; la parola caricata è la variazione di colonna, -1, 0 o +1. Lo stesso spostamento serve per `dy`. Non c'è alcun salto: il codice *seleziona* il valore, esattamente come fa un multiplexer, e cambiare le regole del movimento significa cambiare dati e non codice.

## Slide 9: NUOVO step: muoversi e rientrare, nei due versi

La seconda metà muove la testa e gestisce i bordi in entrambe le direzioni. Colonna più `dx` può ora valere -1: `bgez` verifica il segno, e una colonna negativa viene sostituita dall'ultima; se invece ha raggiunto `COLS`, diventa 0. La riga si tratta allo stesso modo con `ROWS`. Entrambi i test interpretano il valore come numero con segno, come richiede la Lezione 05. L'ultimo richiamo nota che `t4` e `t6` contengono ancora la nuova colonna e la nuova riga, che il frammento successivo usa.

## Slide 10: Per ora: chiudere la funzione

Tre righe provvisorie ripristinano `ra`, rilasciano il frame e ritornano, completando `step` così che il programma si possa eseguire subito. È una pratica ricorrente dei tutorial: una funzione da finire più tardi si chiude provvisoriamente, e si prova ciò che c'è. Nel passo 3 il test del cibo si inserisce prima di queste righe.

## Slide 11: Eseguite: state guidando

Eseguire: ora lo studente guida. La testa parte verso destra come prima. Tenendo premuto DOWN gira al suo passo successivo. Mentre va a destra, tenere premuto LEFT non ha effetto, perché l'inversione a U è rifiutata; per andare a sinistra servono due svolte, DOWN e poi LEFT. Il riquadro verde dà un test di accettazione preciso: tenendo premuto DOWN dall'inizio per 64 frame la testa arriva alla colonna 5 della riga 22, dieci passi più in basso. Una previsione quantitativa verificata sulla macchina è il criterio di correttezza in tutto il corso.

## Slide 12: MODIFICATO init: una partenza completa

`verm1_init` è sostituita da una versione completa in cui ogni variabile riceve il suo valore iniziale, compresi la direzione, la richiesta e il punteggio, e il primo cibo viene piazzato chiamando `place_food`. Poiché ora fa una chiamata, anche `init` richiede uno stack frame che salvi `ra`.

## Slide 13: NUOVO place_food: una cella a caso

`place_food` chiede al runtime due numeri casuali. Il contratto di `prg32_random_number` è: minimo in `a0`, massimo in `a1`, entrambi inclusi, risultato in `a0`. La prima chiamata dà una colonna da 0 a 39, la seconda una riga da 0 a 23, e ciascuna si memorizza nella sua variabile. Un difetto è lasciato di proposito: il cibo può cadere sulla testa. La Parte 3, quando il verme avrà un corpo, lo corregge. Riconoscere esplicitamente un limite noto fa parte di una buona pratica ingegneristica.

## Slide 14: MODIFICATO step: la testa è sul cibo?

Questo sostituisce il finale provvisorio di `step`. È un comparatore costruito con istruzioni: lo `xor` tra la colonna del cibo e quella della testa vale 0 quando sono uguali; lo stesso per le righe; l'`or` dei due risultati vale 0 solo se entrambe le coppie sono uguali. Se il risultato è diverso da zero, la funzione ritorna. Altrimenti il verme ha mangiato: il punteggio si incrementa, si piazza un nuovo cibo e si suona un suono. È l'AND di XNOR della Lezione 11, scritto come due `xor` e un `or`, con la logica invertita da De Morgan.

## Slide 15: NUOVO eat_sound: una nota

`eat_sound` suona una singola nota. `prg32_audio_note` prende cinque argomenti da `a0` ad `a4`: canale, strumento, nota, volume e durata in millisecondi. La nota 72 è il Do della quinta ottava nella numerazione MIDI. L'ultimo richiamo ribadisce un principio dello sviluppo con PRG32: il suono viene per ultimo. Il gioco funzionava senza, e lo si aggiunge solo quando tutto il resto è solido.

## Slide 16: MODIFICATO draw: il punteggio a tacche

L'inizio della nuova `verm1_draw`: dopo il titolo, un ciclo disegna un piccolo rettangolo per ogni punto del punteggio, a 4 pixel di distanza. Il contatore del ciclo sta in `s0` e non in un registro `t`, perché deve sopravvivere alle chiamate a `prg32_gfx_rect`: una funzione chiamata può distruggere i temporanei ma deve preservare i registri `s`. In cambio, la funzione deve a sua volta salvare `s0` nel suo frame e ripristinarlo all'uscita. La convenzione si usa qui come regola e si studia formalmente nella Lezione 18.

## Slide 17: MODIFICATO draw: cibo e testa

Il resto di `verm1_draw`: le stesse tre righe due volte, prima per il cibo e poi per la testa, caricando colonna, riga e colore e chiamando `draw_cell`. L'ordine è significativo: la testa si disegna per ultima, così che copra il cibo quando occupano la stessa cella. Poi si ripristinano `s0` e `ra` e la funzione ritorna.

## Slide 18: NUOVO draw_cell: dalle celle ai pixel

`draw_cell` raccoglie in una funzione l'aritmetica che la Parte 1 metteva dentro `draw`: colonna per 8, riga per 8 più `TOP`. Il suo contratto è scritto nel commento sulla prima riga: colonna in `a0`, riga in `a1`, colore in `a2`. Una sottigliezza merita attenzione: `prg32_gfx_rect` si aspetta il colore in `a4`, e `a2` sta per essere sovrascritto con la larghezza, quindi il colore va spostato per primo. Documentare in un commento il contratto di una funzione è parte integrante dello scriverla.

## Slide 19: Eseguite: Verm1, Parte 2

Eseguire. Una cella rossa compare da qualche parte sulla griglia. Quando la testa la raggiunge, suona una nota, compare una tacca accanto al titolo e il cibo si sposta in un'altra cella. La schermata mostra il gioco dopo due bocconi, con due tacche; è stata prodotta dal test automatico, in cui un giocatore programmato guida la testa verso il cibo due volte.

## Slide 20: Eseguite: che cosa dovreste vedere

Il comportamento atteso del programma, e l'ingresso che richiede. Il risultato va previsto prima di eseguire: ogni differenza tra la previsione e lo schermo è un'informazione sul proprio modello della macchina, e conviene spiegarla prima di correggerla. L'immagine è stata prodotta dal test automatico, non disegnata a mano.

## Slide 21: Provatelo su PRG32-QT

La via più diretta: PRG32-QT sul proprio computer, in quattro passi, ciascuno con il suo comando. Per gli strumenti PRG32-QT si presenta come una scheda in ascolto sulla porta 8080, ed è per questo che il comando di caricamento nomina l'esp32c6. Con la modalità debug attiva si può fermare l'esecuzione su qualsiasi istruzione e ispezionare registri e memoria.

## Slide 22: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu e caricata mentre QEMU non è in esecuzione. Il firmware si avvia sul menu Setup, da cui si scelgono Run Cartridge e lo slot. La tastiera è letta dal terminale da cui QEMU è stato avviato, non dalla finestra che mostra l'immagine.

## Slide 23: Provatelo sulla scheda

Lo stesso programma sul kit fisico. Il firmware si scrive una volta, via USB; da quel momento le cartucce viaggiano sul Wi-Fi con lo stesso comando di caricamento usato per PRG32-QT, indirizzato alla scheda. È l'unico host non esercitato dai test automatici, quindi le osservazioni fatte sulla scheda sono particolarmente preziose e vanno riferite.

## Slide 24: Se non funziona

I cinque sintomi più frequenti, il loro significato e il rimedio. Il messaggio di errore va letto per intero prima di cambiare qualsiasi cosa: quasi sempre nomina la causa. Quando si chiede aiuto, vanno riportati alla lettera il comando e il messaggio completo.

## Slide 25: Fatelo vostro

Quattro modifiche ideate dallo studente. Fare del pulsante A un freno che sospende il timer finché è premuto. Dare due punti per il cibo mangiato nella riga più alta. Disegnare la testa di un colore diverso per ogni direzione, usando una terza tabella indicizzata come `dx`. E cambiare la codifica delle direzioni: con RIGHT 0, LEFT 1, DOWN 2 e UP 3, che cosa diventa la regola dell'inversione a U? L'ultima domanda verifica se il ruolo della codifica è stato compreso. Prima di sperimentare va conservata una copia della Parte 2 funzionante.
