# Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 2: la guida, il cibo e un punteggio

Il secondo tutorial del progetto. Alla fine della Parte 1 la testa attraversava lo schermo da sola; oggi nel gioco entra il giocatore. Aggiungete la guida con il joystick, il cibo che compare a caso, un punteggio e un suono. Tutto poggia sulle quattro lezioni del blocco di logica: un pulsante è un bit selezionato da una maschera, la regola contro l'inversione a U è un solo XOR, il movimento si legge da una tabella come lo selezionerebbe un multiplexer. La frase di Sid Meier in copertina dice che cosa state aggiungendo: scelte.

## Slide 2: Che cosa avrete alla fine

Cinque risultati: una testa che guidate in quattro direzioni; una regola che vieta l'inversione a U, scritta con uno XOR e un confronto; il movimento preso da due piccole tabelle invece che da quattro salti; il cibo che compare in una cella a caso, viene mangiato e ricompare; e un punteggio, disegnato come piccole tacche accanto al titolo, con un suono a ogni boccone. Notate che tre dei cinque sono modi di scrivere bene qualcosa, non solo di farlo funzionare.

## Slide 3: Che cosa prende la Parte 2 dalle lezioni

Ogni riga collega un'idea delle lezioni di logica a un punto del programma di oggi. AND come maschera seleziona un pulsante dalla parola dei pulsanti. Una tabella di verità diventa il codice delle quattro direzioni. XOR, che vale 1 dove due bit differiscono, dà sia la regola dell'inversione a U sia il test di uguaglianza. Il pull-up della Lezione 10 spiega perché un pulsante premuto arriva come 1. Il comparatore, il multiplexer e la ROM della Lezione 11 diventano il test «testa sul cibo» e le tabelle `dx` e `dy`.

## Slide 4: Partire da una Parte 1 che gira

Partite da una Parte 1 che gira: aprite il file, compilatelo e verificate che la testa attraversi lo schermo. Se non lo fa, prendete il file di riferimento della Parte 1. Oggi il file cambia in tre passi, e lo eseguite dopo il secondo e dopo il terzo. Leggete con attenzione la quarta riga, perché è la convenzione di tutti i tutorial da qui in poi: una slide con MODIFICATO sostituisce codice che avete già; una slide con NUOVO aggiunge codice.

## Slide 5: Un codice scelto con cura: le quattro direzioni

I codici delle direzioni sono scelti con cura. Il bit 0 dice se il movimento è verticale; il bit 1 dice se è «all'indietro», verso coordinate minori. Di conseguenza una direzione e la sua opposta differiscono nel bit 1 e solo lì: RIGHT è 00 e LEFT è 10, DOWN è 01 e UP è 11. Quindi lo XOR di due direzioni opposte è sempre 10, cioè 2. Una buona codifica trasforma una regola in una sola porta. Notate anche la didascalia: sullo schermo y cresce verso il basso, quindi DOWN è più 1.

## Slide 6: Dal dito al bit

Il percorso di un pulsante, dalla Lezione 10. Il piedino del chip è tenuto a 3,3 V da una resistenza di pull-up; premendo il pulsante lo si collega a massa, quindi il piedino legge 0 quando è premuto. Il runtime inverte i livelli e impacchetta tutti i pulsanti in una parola, in cui 1 significa premuto. La tabella dà la maschera di ogni pulsante di direzione. Due fatti da usare subito: UP e RIGHT premuti insieme danno 0x04 OR 0x02, cioè 0x06; e `a0` AND 0x04 vale zero esattamente quando UP non è premuto.

## Slide 7: La regola dell'inversione a U, come tabella di verità

La regola come tabella di verità: sei delle sue sedici righe. Con la testa che va a destra, chiedere RIGHT dà 00 e la testa prosegue; chiedere DOWN o UP dà 01 o 11, e gira; chiedere LEFT dà 10, cioè 2, e la richiesta è rifiutata. Lo stesso accade per DOWN e UP. Completate voi la tabella e contate i rifiuti: sono quattro, uno per direzione. Con codici scelti a caso la stessa regola richiederebbe quattro confronti distinti.

## Slide 8: Cogliere al lavoro la regola dell'inversione a U

Eseguite la cartuccia in modalità debug e mostrate `verm1_update`. Guardate prima la telemetria mentre tenete premuto un pulsante: la maschera di ingresso mostra 0x04 per UP e 0x01 per LEFT. Poi mettete un breakpoint sull'istruzione `xor t3, t2, t1`. Tenete premuto LEFT mentre la testa va a destra e riprendete: il programma si ferma sullo XOR. Leggete i registri: `t1` vale 0, la direzione, e `t2` vale 2, il desiderio. Un passo: `t3` diventa 2. Altri due passi, e vedete il salto avvenire e la `sw` saltata.

## Slide 9: Che cosa si legge nei registri

Ciò che dovreste leggere, con la testa che va a destra. Senza pulsanti premuti il desiderio è quello precedente e lo XOR vale 0. Con DOWN vale 1 e con UP vale 3: entrambi vengono memorizzati. Con LEFT vale 2, l'inversione a U, e non si memorizza nulla. L'ultima riga mostra la priorità tra i test: con UP e RIGHT insieme vince UP, perché è esaminato per ultimo. Leggete `a0` alla prima istruzione dopo la chiamata: più avanti nel frame viene sovrascritto.

## Slide 10: Leggere le variabili in memoria

Le variabili si possono leggere anche in memoria. Dopo `la t0, dir` il registro `t0` contiene l'indirizzo di `dir`: scrivetelo nel campo *Memory*. Le variabili si susseguono nell'ordine del file, quattro byte ciascuna: `dir`, `want`, `step_q8`, `score`, `food_x`, `food_y`. Mangiate una volta, mettete in pausa e leggete il punteggio: 01 00 00 00, il byte meno significativo per primo. Poi leggete la posizione del cibo e confrontatela con la cella rossa sullo schermo.

## Slide 11: Verifica la comprensione: Il giocatore tiene premuti insieme DOWN e RIGHT: prg32_input_read restituisce / Il verme va verso UP (3). Quale desiderio viene rifiutato?

Un bit per pulsante: DOWN è 0x08 e RIGHT è 0x02. Premuti insieme, i due bit valgono entrambi 1: l'OR delle due maschere.

Applicate la regola: il desiderio rifiutato è quello il cui XOR con la direzione vale 2. La direzione è 3, cioè 11 in binario; quale codice ne differisce solo nel bit 1?

## Slide 12: Verifica la comprensione: Perché slli t1, t1, 2 prima di sommare all'indirizzo di dx? / xor t1, t1, t4 dà zero esattamente quando

Le tabelle sono fatte di parole, e una parola sono quattro byte. L'elemento numero k sta a k per 4 byte dall'inizio della tabella, e uno scorrimento a sinistra di 2 moltiplica per 4.

XOR dà 1 in ogni posizione in cui i due bit differiscono. Un risultato di tutti zeri significa che nessuna posizione differisce.

## Slide 13: Dove siamo, e che cosa viene dopo

Dove siete. Il giocatore è nel gioco: un desiderio, una regola, un movimento, una ricompensa. La logica di quattro lezioni è diventata istruzioni: bit e maschere, XOR come comparatore, una tabella come selettore. Ma il verme non ha corpo, niente può andare storto, e il gioco non finisce mai. Il prossimo blocco, su stato e memoria, dà gli strumenti, e la Parte 3 aggiunge un corpo che cresce, le collisioni, una schermata del titolo e un game over.
