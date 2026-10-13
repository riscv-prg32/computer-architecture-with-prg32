# Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio: il codice

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 2: la guida, il cibo e un punteggio: il codice

Questa è la presentazione del codice della Lezione 12. La presentazione della lezione contiene i concetti; questa contiene tutto ciò che si scrive e si esegue: i listati con la loro spiegazione, il programma completo, che cosa mostra, e il modo di provarlo su ciascuno dei tre host.

## Slide 2: In questa presentazione

Che cosa contiene la presentazione, nell'ordine delle slide. Il programma della lezione è un file che potete compilare ed eseguire così com'è: partite da lì, e tornate ai listati per capire ogni parte. Il programma di riferimento è ~/arc12/verm1/verm1_part2.S; tools/tests/verm1_check.py lo compila e lo gioca con un giocatore programmato, e verm1_steps.py esegue i punti di controllo intermedi.

## Slide 3: Il ciclo di lavoro, di nuovo

Gli stessi due comandi della Parte 1: compilare la cartuccia, poi caricarla su PRG32-QT ed eseguirla. Tenete aperto PRG32-QT per tutta la seduta, con la modalità debug attiva se volete il debugger a portata di mano: lo usa il passo 4.

## Slide 4: MODIFICATO Costanti: pulsanti e direzioni

Aggiungete queste righe alle costanti della Parte 1. `RED` è il colore del cibo. Le quattro costanti `BTN_` sono maschere: ognuna ha un solo bit a 1, il bit di quel pulsante nella parola restituita dal runtime. Le quattro costanti `DIR_` sono i codici delle direzioni, numeri da 0 a 3, cioè due bit. I commenti dicono che cosa significa ciascuno dei due bit, e la slide successiva spiega perché i codici sono stati scelti così.

## Slide 5: MODIFICATO Dati: due tabelle e cinque variabili nuove

Sostituite con questi i dati della Parte 1. In `.rodata` ci sono due tabelle di quattro parole, `dx` e `dy`: per ogni codice di direzione, la variazione di colonna e la variazione di riga. Non cambiano mai, quindi stanno con le costanti. In `.data` ci sono cinque variabili nuove: `dir`, la direzione dell'ultimo passo; `want`, la direzione chiesta dal giocatore; e `score`, `food_x` e `food_y`, che si usano nel passo 3.

## Slide 6: MODIFICATO update: dai pulsanti a un desiderio

Sostituisce l'inizio di `verm1_update`. Dopo la chiamata a `prg32_input_read`, `t1` riceve la direzione corrente e `t2` il desiderio corrente. Poi quattro blocchi identici: `andi` isola un pulsante; se il risultato è zero si salta l'istruzione successiva; altrimenti il desiderio in `t2` viene sovrascritto con quella direzione. Infine la regola: lo XOR di desiderio e direzione si confronta con 2; se sono uguali la richiesta è un'inversione a U e la `sw` viene saltata, così resta il desiderio precedente. `update` ora fa una chiamata, quindi ha un frame di stack.

## Slide 7: MODIFICATO update: il timer chiama step

Il resto di `verm1_update` è il timer in virgola fissa della Parte 1, invariato: si somma la velocità, e quando si è accumulata una cella intera si sottrae 256. L'unica differenza è ciò che accade dopo: invece di muovere direttamente `head_x`, il codice chiama una funzione nuova, `step`. Qui le etichette locali sono 6 e 7 perché i numeri da 1 a 5 sono già usati nella prima metà della funzione.

## Slide 8: NUOVO step: cercare il movimento

La prima metà di `step`. Il desiderio diventa la direzione: accade una volta per passo, non una volta per frame, così due pressioni rapide non possono ripiegare il verme su se stesso. Poi la ricerca in tabella: il codice della direzione viene scorso a sinistra di 2, perché ogni elemento di una tabella è una parola di quattro byte, e sommato all'indirizzo di `dx`; la parola caricata è la variazione di colonna, meno 1, 0 o più 1. Lo stesso scostamento serve per `dy`. Non c'è alcun salto: il codice seleziona il valore, come farebbe un multiplexer.

## Slide 9: NUOVO step: muoversi e rientrare, nei due versi

La seconda metà muove la testa e gestisce i bordi, nei due versi. La colonna più `dx` ora può diventare meno 1: `bgez` esamina il segno, e una colonna negativa è sostituita dall'ultima colonna. Se invece ha raggiunto `COLS`, diventa 0. Lo stesso si fa per la riga con `ROWS`. Notate l'ultima nota: `t4` e `t6` contengono ancora la nuova colonna e la nuova riga, e il pezzo di codice successivo li userà.

## Slide 10: Per ora: chiudere la funzione

Tre righe provvisorie che ripristinano `ra`, rilasciano il frame e ritornano, così `step` è completa e il programma può girare subito. È un'abitudine dei tutorial: quando una funzione verrà finita più tardi, la si chiude in modo provvisorio e si prova ciò che c'è. Nel passo 3 inserirete prima di queste righe il test del cibo.

## Slide 11: Eseguite: state guidando

Eseguite: state guidando. La testa parte verso destra come prima. Tenete premuto DOWN e gira al passo successivo. Mentre va a destra, tenete premuto LEFT: non accade nulla, perché l'inversione a U è rifiutata. Per andare a sinistra servono due svolte, DOWN e poi LEFT. Il riquadro verde dà una verifica precisa: tenendo premuto DOWN dall'inizio per 64 frame la testa arriva alla colonna 5 della riga 22, dieci passi verso il basso.

## Slide 12: MODIFICATO init: una partenza completa

`verm1_init` è sostituita da una versione completa: ogni variabile riceve il suo valore iniziale, comprese la direzione, il desiderio e il punteggio, e il primo cibo viene piazzato chiamando `place_food`. Poiché ora fa una chiamata, anche `init` ha un frame di stack che salva `ra`.

## Slide 13: NUOVO place_food: una cella a caso

`place_food` chiede al runtime due numeri casuali. Il contratto di `prg32_random_number` è: minimo in `a0`, massimo in `a1`, estremi compresi, risultato in `a0`. La prima chiamata dà una colonna da 0 a 39, la seconda una riga da 0 a 23, e ciascuna viene memorizzata nella propria variabile. Un difetto è lasciato di proposito: il cibo può cadere esattamente sulla testa. Lo correggerà la Parte 3, quando il verme avrà un corpo.

## Slide 14: MODIFICATO step: la testa è sul cibo?

Sostituisce il finale provvisorio di `step`. È un comparatore costruito con le istruzioni: lo `xor` della colonna del cibo e di quella della testa vale 0 quando sono uguali; lo stesso per le righe; l'`or` dei due risultati vale 0 solo se entrambe sono uguali. Se il risultato non è zero, la funzione finisce. Altrimenti il verme ha mangiato: il punteggio aumenta di uno, si piazza nuovo cibo, e si suona una nota. È l'AND di XNOR della Lezione 11, scritto con due `xor` e una `or`.

## Slide 15: NUOVO eat_sound: una nota

`eat_sound` suona una nota. `prg32_audio_note` prende cinque argomenti, da `a0` ad `a4`: canale, strumento, nota, volume e durata in millisecondi. La nota 72 è il Do della quinta ottava nella numerazione MIDI. L'ultima nota ripete un principio di PRG32: il suono viene per ultimo. Il gioco funzionava anche senza, e lo si aggiunge quando tutto il resto è solido.

## Slide 16: MODIFICATO draw: il punteggio a tacche

L'inizio della nuova `verm1_draw`: dopo il titolo, un ciclo disegna un rettangolino per ogni punto del punteggio, a 4 pixel di distanza. Il contatore del ciclo sta in `s0`, non in un registro `t`, perché deve sopravvivere alle chiamate a `prg32_gfx_rect`: una funzione può distruggere i temporanei, ma conserva i registri `s`. In cambio la vostra funzione deve salvare `s0` nel proprio frame e ripristinarlo alla fine. Questa convenzione si studia nella Lezione 18.

## Slide 17: MODIFICATO draw: cibo e testa

Il resto di `verm1_draw`: le stesse tre righe due volte, prima per il cibo e poi per la testa: si carica la colonna, si carica la riga, si carica il colore, e si chiama `draw_cell`. L'ordine conta: la testa si disegna per ultima, così copre il cibo se stanno nella stessa cella. Poi `s0` e `ra` vengono ripristinati e la funzione ritorna.

## Slide 18: NUOVO draw_cell: dalle celle ai pixel

`draw_cell` raccoglie in una funzione l'aritmetica che la Parte 1 aveva dentro `draw`: colonna per 8, riga per 8 più `TOP`. Il suo contratto è scritto nel commento sulla prima riga: colonna in `a0`, riga in `a1`, colore in `a2`. Una sottigliezza: `prg32_gfx_rect` vuole il colore in `a4`, e `a2` sta per essere sovrascritto con la larghezza, quindi il colore va spostato per primo. Scrivere in un commento il contratto di una funzione fa parte del lavoro.

## Slide 19: Eseguite: Verm1, Parte 2

Eseguite. Dovreste vedere una cella rossa da qualche parte. Guidate la testa su di essa: suona una nota, compare una tacca accanto al titolo, e il cibo si sposta in un'altra cella. La schermata mostra il gioco dopo due bocconi, con due tacche. È stata prodotta dal test automatico, in cui un giocatore programmato guida due volte la testa sul cibo.

## Slide 20: Eseguite: che cosa dovreste vedere

Che cosa mostra il programma quando gira, e che cosa premere. Prevedete prima di eseguire: se lo schermo è diverso da questa immagine, la differenza è informazione. L'immagine è stata scritta dal test automatico, non disegnata a mano.

## Slide 21: Provatelo su PRG32-QT

La via più rapida: PRG32-QT sul vostro computer. Quattro passi, ciascuno con il suo comando. PRG32-QT si comporta come una scheda sulla porta 8080, ed è per questo che il comando di caricamento dice esp32c6. Con la modalità debug abilitata potete fermarvi su qualsiasi istruzione e leggere registri e memoria.

## Slide 22: Provatelo su QEMU

Lo stesso programma sull'emulatore. QEMU esegue il firmware vero su un chip emulato, quindi la cartuccia va compilata per l'architettura qemu. Caricate la cartuccia mentre QEMU è chiuso. Il firmware si apre sul menu Setup: scegliete Run Cartridge e lo slot. Ricordate che la tastiera è letta dal terminale, non dalla finestra con l'immagine.

## Slide 23: Provatelo sulla scheda

Lo stesso programma sul kit. Il firmware si scrive una volta, via USB; dopo, le cartucce viaggiano sul Wi-Fi. Il comando di caricamento è quello usato per PRG32-QT con l'indirizzo della scheda. È l'unico host che i test automatici non eseguono: provatelo, e riferite ciò che vedete.

## Slide 24: Se non funziona

I cinque sintomi più comuni, che cosa significa ciascuno, e che cosa fare. Leggete il messaggio prima di cambiare qualcosa: quasi sempre nomina la causa.

## Slide 25: Fatelo vostro

Quattro modifiche vostre. Fate del pulsante A un freno che ferma il timer mentre è premuto. Date due punti per il cibo mangiato nella riga più in alto. Disegnate la testa di un colore diverso per ogni direzione, con una terza tabella indicizzata come `dx`. E cambiate la codifica delle direzioni: con RIGHT 0, LEFT 1, DOWN 2 e UP 3, che cosa diventa la regola dell'inversione a U? Tenete una copia della Parte 2 funzionante prima di sperimentare.
