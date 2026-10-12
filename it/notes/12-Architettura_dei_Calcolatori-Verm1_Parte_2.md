# Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 2: la guida, il cibo e un punteggio

Il secondo tutorial del progetto. Alla fine della Parte 1 la testa attraversava lo schermo da sola; oggi nel gioco entra il giocatore. Aggiungete la guida con il joystick, il cibo che compare a caso, un punteggio e un suono. Tutto poggia sulle quattro lezioni del blocco di logica: un pulsante è un bit selezionato da una maschera, la regola contro l'inversione a U è un solo XOR, il movimento si legge da una tabella come lo selezionerebbe un multiplexer. La frase di Sid Meier in copertina dice che cosa state aggiungendo: scelte.

## Slide 2: Che cosa avrete alla fine

Cinque risultati: una testa che guidate in quattro direzioni; una regola che vieta l'inversione a U, scritta con uno XOR e un confronto; il movimento preso da due piccole tabelle invece che da quattro salti; il cibo che compare in una cella a caso, viene mangiato e ricompare; e un punteggio, disegnato come piccole tacche accanto al titolo, con un suono a ogni boccone. Notate che tre dei cinque sono modi di scrivere bene qualcosa, non solo di farlo funzionare.

## Slide 3: Che cosa prende la Parte 2 dalle lezioni

Ogni riga collega un'idea delle lezioni di logica a un punto del programma di oggi. AND come maschera seleziona un pulsante dalla parola dei pulsanti. Una tabella di verità diventa il codice delle quattro direzioni. XOR, che vale 1 dove due bit differiscono, dà sia la regola dell'inversione a U sia il test di uguaglianza. Il pull-up della Lezione 10 spiega perché un pulsante premuto arriva come 1. Il comparatore, il multiplexer e la ROM della Lezione 11 diventano il test «testa sul cibo» e le tabelle `dx` e `dy`.

## Slide 4: Partire da una Parte 1 che gira

Partite da una Parte 1 che gira: aprite il file, compilatelo e verificate che la testa attraversi lo schermo. Se non lo fa, prendete il file di riferimento della Parte 1. Oggi il file cambia in tre passi, e lo eseguite dopo il secondo e dopo il terzo. Leggete con attenzione la quarta riga, perché è la convenzione di tutti i tutorial da qui in poi: una slide con MODIFICATO sostituisce codice che avete già; una slide con NUOVO aggiunge codice.

## Slide 5: Il ciclo di lavoro, di nuovo

Gli stessi due comandi della Parte 1: compilare la cartuccia, poi caricarla su PRG32-QT ed eseguirla. Tenete aperto PRG32-QT per tutta la seduta, con la modalità debug attiva se volete il debugger a portata di mano: lo usa il passo 4.

## Slide 6: Passo 1: nomi per i bit

Il passo 1 prepara soltanto dei nomi: costanti per i pulsanti e le direzioni, e le variabili che servono al resto del tutorial. Sullo schermo non compare ancora nulla di nuovo.

## Slide 7: MODIFICATO Costanti: pulsanti e direzioni

Aggiungete queste righe alle costanti della Parte 1. `RED` è il colore del cibo. Le quattro costanti `BTN_` sono maschere: ognuna ha un solo bit a 1, il bit di quel pulsante nella parola restituita dal runtime. Le quattro costanti `DIR_` sono i codici delle direzioni, numeri da 0 a 3, cioè due bit. I commenti dicono che cosa significa ciascuno dei due bit, e la slide successiva spiega perché i codici sono stati scelti così.

## Slide 8: Un codice scelto con cura: le quattro direzioni

I codici delle direzioni sono scelti con cura. Il bit 0 dice se il movimento è verticale; il bit 1 dice se è «all'indietro», verso coordinate minori. Di conseguenza una direzione e la sua opposta differiscono nel bit 1 e solo lì: RIGHT è 00 e LEFT è 10, DOWN è 01 e UP è 11. Quindi lo XOR di due direzioni opposte è sempre 10, cioè 2. Una buona codifica trasforma una regola in una sola porta. Notate anche la didascalia: sullo schermo y cresce verso il basso, quindi DOWN è più 1.

## Slide 9: MODIFICATO Dati: due tabelle e cinque variabili nuove

Sostituite con questi i dati della Parte 1. In `.rodata` ci sono due tabelle di quattro parole, `dx` e `dy`: per ogni codice di direzione, la variazione di colonna e la variazione di riga. Non cambiano mai, quindi stanno con le costanti. In `.data` ci sono cinque variabili nuove: `dir`, la direzione dell'ultimo passo; `want`, la direzione chiesta dal giocatore; e `score`, `food_x` e `food_y`, che si usano nel passo 3.

## Slide 10: Passo 2: la guida

Il passo 2 è il cuore del tutorial: leggere i pulsanti, rifiutare l'inversione a U, e prendere il movimento dalle tabelle. Alla fine state guidando la testa.

## Slide 11: Dal dito al bit

Il percorso di un pulsante, dalla Lezione 10. Il piedino del chip è tenuto a 3,3 V da una resistenza di pull-up; premendo il pulsante lo si collega a massa, quindi il piedino legge 0 quando è premuto. Il runtime inverte i livelli e impacchetta tutti i pulsanti in una parola, in cui 1 significa premuto. La tabella dà la maschera di ogni pulsante di direzione. Due fatti da usare subito: UP e RIGHT premuti insieme danno 0x04 OR 0x02, cioè 0x06; e `a0` AND 0x04 vale zero esattamente quando UP non è premuto.

## Slide 12: MODIFICATO update: dai pulsanti a un desiderio

Sostituisce l'inizio di `verm1_update`. Dopo la chiamata a `prg32_input_read`, `t1` riceve la direzione corrente e `t2` il desiderio corrente. Poi quattro blocchi identici: `andi` isola un pulsante; se il risultato è zero si salta l'istruzione successiva; altrimenti il desiderio in `t2` viene sovrascritto con quella direzione. Infine la regola: lo XOR di desiderio e direzione si confronta con 2; se sono uguali la richiesta è un'inversione a U e la `sw` viene saltata, così resta il desiderio precedente. `update` ora fa una chiamata, quindi ha un frame di stack.

## Slide 13: La regola dell'inversione a U, come tabella di verità

La regola come tabella di verità: sei delle sue sedici righe. Con la testa che va a destra, chiedere RIGHT dà 00 e la testa prosegue; chiedere DOWN o UP dà 01 o 11, e gira; chiedere LEFT dà 10, cioè 2, e la richiesta è rifiutata. Lo stesso accade per DOWN e UP. Completate voi la tabella e contate i rifiuti: sono quattro, uno per direzione. Con codici scelti a caso la stessa regola richiederebbe quattro confronti distinti.

## Slide 14: MODIFICATO update: il timer chiama step

Il resto di `verm1_update` è il timer in virgola fissa della Parte 1, invariato: si somma la velocità, e quando si è accumulata una cella intera si sottrae 256. L'unica differenza è ciò che accade dopo: invece di muovere direttamente `head_x`, il codice chiama una funzione nuova, `step`. Qui le etichette locali sono 6 e 7 perché i numeri da 1 a 5 sono già usati nella prima metà della funzione.

## Slide 15: NUOVO step: cercare il movimento

La prima metà di `step`. Il desiderio diventa la direzione: accade una volta per passo, non una volta per frame, così due pressioni rapide non possono ripiegare il verme su se stesso. Poi la ricerca in tabella: il codice della direzione viene scorso a sinistra di 2, perché ogni elemento di una tabella è una parola di quattro byte, e sommato all'indirizzo di `dx`; la parola caricata è la variazione di colonna, meno 1, 0 o più 1. Lo stesso scostamento serve per `dy`. Non c'è alcun salto: il codice seleziona il valore, come farebbe un multiplexer.

## Slide 16: NUOVO step: muoversi e rientrare, nei due versi

La seconda metà muove la testa e gestisce i bordi, nei due versi. La colonna più `dx` ora può diventare meno 1: `bgez` esamina il segno, e una colonna negativa è sostituita dall'ultima colonna. Se invece ha raggiunto `COLS`, diventa 0. Lo stesso si fa per la riga con `ROWS`. Notate l'ultima nota: `t4` e `t6` contengono ancora la nuova colonna e la nuova riga, e il pezzo di codice successivo li userà.

## Slide 17: Per ora: chiudere la funzione

Tre righe provvisorie che ripristinano `ra`, rilasciano il frame e ritornano, così `step` è completa e il programma può girare subito. È un'abitudine dei tutorial: quando una funzione verrà finita più tardi, la si chiude in modo provvisorio e si prova ciò che c'è. Nel passo 3 inserirete prima di queste righe il test del cibo.

## Slide 18: Eseguite: state guidando

Eseguite: state guidando. La testa parte verso destra come prima. Tenete premuto DOWN e gira al passo successivo. Mentre va a destra, tenete premuto LEFT: non accade nulla, perché l'inversione a U è rifiutata. Per andare a sinistra servono due svolte, DOWN e poi LEFT. Il riquadro verde dà una verifica precisa: tenendo premuto DOWN dall'inizio per 64 frame la testa arriva alla colonna 5 della riga 22, dieci passi verso il basso.

## Slide 19: Passo 3: il cibo, un punteggio, un suono

Il passo 3 dà al giocatore uno scopo: il cibo da raggiungere, un punteggio che conta, un suono come ricompensa. In termini di circuiti usa una sorgente casuale, un comparatore e un ciclo.

## Slide 20: MODIFICATO init: una partenza completa

`verm1_init` è sostituita da una versione completa: ogni variabile riceve il suo valore iniziale, comprese la direzione, il desiderio e il punteggio, e il primo cibo viene piazzato chiamando `place_food`. Poiché ora fa una chiamata, anche `init` ha un frame di stack che salva `ra`.

## Slide 21: NUOVO place_food: una cella a caso

`place_food` chiede al runtime due numeri casuali. Il contratto di `prg32_random_number` è: minimo in `a0`, massimo in `a1`, estremi compresi, risultato in `a0`. La prima chiamata dà una colonna da 0 a 39, la seconda una riga da 0 a 23, e ciascuna viene memorizzata nella propria variabile. Un difetto è lasciato di proposito: il cibo può cadere esattamente sulla testa. Lo correggerà la Parte 3, quando il verme avrà un corpo.

## Slide 22: MODIFICATO step: la testa è sul cibo?

Sostituisce il finale provvisorio di `step`. È un comparatore costruito con le istruzioni: lo `xor` della colonna del cibo e di quella della testa vale 0 quando sono uguali; lo stesso per le righe; l'`or` dei due risultati vale 0 solo se entrambe sono uguali. Se il risultato non è zero, la funzione finisce. Altrimenti il verme ha mangiato: il punteggio aumenta di uno, si piazza nuovo cibo, e si suona una nota. È l'AND di XNOR della Lezione 11, scritto con due `xor` e una `or`.

## Slide 23: NUOVO eat_sound: una nota

`eat_sound` suona una nota. `prg32_audio_note` prende cinque argomenti, da `a0` ad `a4`: canale, strumento, nota, volume e durata in millisecondi. La nota 72 è il Do della quinta ottava nella numerazione MIDI. L'ultima nota ripete un principio di PRG32: il suono viene per ultimo. Il gioco funzionava anche senza, e lo si aggiunge quando tutto il resto è solido.

## Slide 24: MODIFICATO draw: il punteggio a tacche

L'inizio della nuova `verm1_draw`: dopo il titolo, un ciclo disegna un rettangolino per ogni punto del punteggio, a 4 pixel di distanza. Il contatore del ciclo sta in `s0`, non in un registro `t`, perché deve sopravvivere alle chiamate a `prg32_gfx_rect`: una funzione può distruggere i temporanei, ma conserva i registri `s`. In cambio la vostra funzione deve salvare `s0` nel proprio frame e ripristinarlo alla fine. Questa convenzione si studia nella Lezione 18.

## Slide 25: MODIFICATO draw: cibo e testa

Il resto di `verm1_draw`: le stesse tre righe due volte, prima per il cibo e poi per la testa: si carica la colonna, si carica la riga, si carica il colore, e si chiama `draw_cell`. L'ordine conta: la testa si disegna per ultima, così copre il cibo se stanno nella stessa cella. Poi `s0` e `ra` vengono ripristinati e la funzione ritorna.

## Slide 26: NUOVO draw_cell: dalle celle ai pixel

`draw_cell` raccoglie in una funzione l'aritmetica che la Parte 1 aveva dentro `draw`: colonna per 8, riga per 8 più `TOP`. Il suo contratto è scritto nel commento sulla prima riga: colonna in `a0`, riga in `a1`, colore in `a2`. Una sottigliezza: `prg32_gfx_rect` vuole il colore in `a4`, e `a2` sta per essere sovrascritto con la larghezza, quindi il colore va spostato per primo. Scrivere in un commento il contratto di una funzione fa parte del lavoro.

## Slide 27: Eseguite: Verm1, Parte 2

Eseguite. Dovreste vedere una cella rossa da qualche parte. Guidate la testa su di essa: suona una nota, compare una tacca accanto al titolo, e il cibo si sposta in un'altra cella. La schermata mostra il gioco dopo due bocconi, con due tacche. È stata prodotta dal test automatico, in cui un giocatore programmato guida due volte la testa sul cibo.

## Slide 28: Passo 4: osservare una decisione

Nel passo 4 usate PRG32-QT come sonda logica: fermate il programma sull'istruzione esatta che decide l'inversione a U, e leggete la decisione nei registri.

## Slide 29: Cogliere al lavoro la regola dell'inversione a U

Eseguite la cartuccia in modalità debug e mostrate `verm1_update`. Guardate prima la telemetria mentre tenete premuto un pulsante: la maschera di ingresso mostra 0x04 per UP e 0x01 per LEFT. Poi mettete un breakpoint sull'istruzione `xor t3, t2, t1`. Tenete premuto LEFT mentre la testa va a destra e riprendete: il programma si ferma sullo XOR. Leggete i registri: `t1` vale 0, la direzione, e `t2` vale 2, il desiderio. Un passo: `t3` diventa 2. Altri due passi, e vedete il salto avvenire e la `sw` saltata.

## Slide 30: Che cosa si legge nei registri

Ciò che dovreste leggere, con la testa che va a destra. Senza pulsanti premuti il desiderio è quello precedente e lo XOR vale 0. Con DOWN vale 1 e con UP vale 3: entrambi vengono memorizzati. Con LEFT vale 2, l'inversione a U, e non si memorizza nulla. L'ultima riga mostra la priorità tra i test: con UP e RIGHT insieme vince UP, perché è esaminato per ultimo. Leggete `a0` alla prima istruzione dopo la chiamata: più avanti nel frame viene sovrascritto.

## Slide 31: Leggere le variabili in memoria

Le variabili si possono leggere anche in memoria. Dopo `la t0, dir` il registro `t0` contiene l'indirizzo di `dir`: scrivetelo nel campo *Memory*. Le variabili si susseguono nell'ordine del file, quattro byte ciascuna: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. Mangiate una volta, mettete in pausa e leggete il punteggio: 01 00 00 00, il byte meno significativo per primo. Poi leggete la posizione del cibo e confrontatela con la cella rossa sullo schermo.

## Slide 32: Verifica la comprensione: Il giocatore tiene premuti insieme DOWN e RIGHT: prg32_input_read restituisce

Un bit per pulsante: DOWN è 0x08 e RIGHT è 0x02. Premuti insieme, i due bit valgono entrambi 1: l'OR delle due maschere.

## Slide 33: Verifica la comprensione: Il verme va verso UP (3). Quale desiderio viene rifiutato?

Applicate la regola: il desiderio rifiutato è quello il cui XOR con la direzione vale 2. La direzione è 3, cioè 11 in binario; quale codice ne differisce solo nel bit 1?

## Slide 34: Verifica la comprensione: Perché slli t1, t1, 2 prima di sommare all'indirizzo di dx?

Le tabelle sono fatte di parole, e una parola sono quattro byte. L'elemento numero k sta a k per 4 byte dall'inizio della tabella, e uno scorrimento a sinistra di 2 moltiplica per 4.

## Slide 35: Verifica la comprensione: xor t1, t1, t4 dà zero esattamente quando

XOR dà 1 in ogni posizione in cui i due bit differiscono. Un risultato di tutti zeri significa che nessuna posizione differisce.

## Slide 36: Fatelo vostro

Quattro modifiche vostre. Fate del pulsante A un freno che ferma il timer mentre è premuto. Date due punti per il cibo mangiato nella riga più in alto. Disegnate la testa di un colore diverso per ogni direzione, con una terza tabella indicizzata come `dx`. E cambiate la codifica delle direzioni: con RIGHT 0, LEFT 1, DOWN 2 e UP 3, che cosa diventa la regola dell'inversione a U? Tenete una copia della Parte 2 funzionante prima di sperimentare.

## Slide 37: Dove siamo, e che cosa viene dopo

Dove siete. Il giocatore è nel gioco: un desiderio, una regola, un movimento, una ricompensa. La logica di quattro lezioni è diventata istruzioni: bit e maschere, XOR come comparatore, una tabella come selettore. Ma il verme non ha corpo, niente può andare storto, e il gioco non finisce mai. Il prossimo blocco, su stato e memoria, dà gli strumenti, e la Parte 3 aggiunge un corpo che cresce, le collisioni, una schermata del titolo e un game over.
