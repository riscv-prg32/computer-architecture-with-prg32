# Lezione 22: Verm1, parte 4: il gioco finito

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Verm1, parte 4: il gioco finito

Il quarto e ultimo tutorial completa Verm1. Nella Parte 3 il gioco era completo nelle regole; oggi diventa completo come programma. Il punteggio è scritto in cifre, il verme accelera, ci sono due suoni, e lo schermo viene ridisegnato solo dove cambia. La frase di Knuth in copertina spiega l'ordine del lavoro: prima il gioco è stato fatto funzionare, e solo adesso, con una misura in mano, lo rendiamo veloce.

## Slide 2: Che cosa avrete alla fine

Cinque risultati. Il punteggio e il punteggio migliore in cifre, convertiti da una divisione per dieci scritta da voi. Un verme che va più veloce al crescere del punteggio, fino a un limite. Due suoni, uno per un pasto e uno per la fine. Una `draw` che tocca una manciata di celle per passo invece dell'intero schermo. E un gioco finito, pronto per essere confezionato e pubblicato nella prossima lezione.

## Slide 3: Che cosa prende la Parte 4 dalle lezioni

Le idee dell'ultimo blocco di lezioni, e dove compaiono oggi. La convenzione di chiamata della Lezione 18 diventa piccole funzioni con un contratto, alcune delle quali foglie. L'estensione M dà quoziente e resto per le cifre. Il ciclo del processore ricorda che ogni istruzione costa tempo, quindi si misura. Lo schermo come memoria, dalla Lezione 20, suggerisce di disegnare solo ciò che è cambiato. E dalla Lezione 21: i dispositivi sono del runtime, a cui chiediamo una nota di una certa durata.

## Slide 4: Dove state andando

Dove state andando: la schermata del titolo con il punteggio migliore, il gioco con il punteggio in cifre, il game over. Partite da una Parte 3 che gira; se la vostra non gira, copiate il file di riferimento. Oggi ci sono quattro passi di codice, e il programma gira dopo ciascuno.

## Slide 5: Il ciclo di lavoro, di nuovo

Gli stessi due comandi di sempre. Prima di cambiare qualcosa, eseguite la Parte 3 in modalità debug e annotate ciò che mostra la telemetria durante una partita: istruzioni eseguite, frame al secondo, frame in ritardo. Questi numeri sono il «prima» della misura che chiude la lezione; senza di essi non potrete dire che cosa avete guadagnato.

## Slide 6: Passo 1: il punteggio in cifre

Il primo passo sostituisce le tacche del punteggio con le cifre. Servono una funzione nuova e un cambio di punto di vista: un numero e la sua forma scritta sono cose diverse.

## Slide 7: Un numero non è le sue cifre

La variabile `score` contiene un numero binario: 137 è il byte 0x89. Lo schermo vuole tre caratteri, i byte 0x31, 0x33 e 0x37. La conversione è quella che avete fatto a mano nella Lezione 05: si divide per dieci, e il resto è una cifra; si ripete sul quoziente. Le cifre escono da destra, prima le unità, quindi si memorizzano dall'ultimo carattere al primo. Una cifra diventa un carattere sommando 48, il codice ASCII del carattere zero.

## Slide 8: NUOVO to_decimal: dividere per dieci, tre volte

`to_decimal` ha un contratto scritto nel suo commento: il valore in `a0`, l'indirizzo di tre caratteri in `a1`. Per tre volte fa la stessa cosa: `remu` dà il resto della divisione per dieci, si somma 48, `sb` memorizza il byte, e `divu` lascia il quoziente per il giro successivo. Gli scostamenti sono 2, 1 e 0: dalle unità alle centinaia. È una funzione *foglia*: non chiama nessuno e usa solo registri temporanei, quindi non ha bisogno di alcuno stack frame.

## Slide 9: MODIFICATO draw_score: due numeri, due testi

`draw_score` sostituisce quella della Parte 3. Chiama `to_decimal` due volte, una per il punteggio e una per il punteggio migliore, ogni volta con l'indirizzo, dentro una stringa, in cui devono andare le cifre: `best_txt+5` salta la parola BEST e lo spazio. Poi le due stringhe si disegnano come qualunque altro testo. Poiché il testo viene disegnato con il suo sfondo, le nuove cifre coprono le vecchie.

## Slide 10: MODIFICATO .data: le variabili della Parte 4

La nuova sezione `.data`. Due stringhe che il programma compila: stanno in `.data` e non in `.rodata` proprio perché il programma ci scrive dentro. Poi sei nuove variabili: `dirty`, la vecchia posizione della testa, e la cella da cancellare. Non vengono usate fino al terzo passo; scrivetele adesso, così la sezione si scrive una volta sola.

## Slide 11: Eseguite: le cifre

Compilate ed eseguite. La riga in alto dice VERM1 000 e, a destra, BEST 000; ogni pasto aggiunge uno; quando perdete, BEST mostra il vostro punteggio. Poi aprite il debugger e guardate `score_txt` in memoria: dopo tre pasti i suoi byte sono 30 30 33 00. State leggendo i caratteri prodotti dalla vostra divisione.

## Slide 12: Passo 2: i livelli

Il secondo passo rende il gioco più difficile man mano che procede: la velocità, finora una costante, diventa una funzione del punteggio.

## Slide 13: MODIFICATO Costanti: due velocità invece di una

La costante `SPEED_Q8` è sostituita da due: un minimo di 32 e un massimo di 96. Sono valori in virgola fissa, in 256-esimi di cella per frame, come nella Parte 2: 32 significa un passo ogni otto frame, 96 significa tre passi ogni otto frame.

## Slide 14: MODIFICATO play_update: una velocità che cresce

Il timer alla fine di `play_update`. La velocità è 32 più quattro volte il punteggio: uno scorrimento di due posizioni e una somma. Poi un confronto tiene il minore tra questo valore e il massimo. Il resto è il timer che conoscete: la velocità si somma a un accumulatore, e si fa un passo quando questo supera 256. Un valore che segue una retta e poi resta a un limite è una *saturazione*.

## Slide 15: I livelli, in numeri

I livelli in numeri. Per ogni punteggio, la velocità, i frame per passo, cioè 256 diviso la velocità, e le celle al secondo a trenta frame al secondo. Da 3,75 celle al secondo all'inizio a 11,25 dai sedici punti in poi. I frame per passo non sono sempre numeri interi, e non è un problema: a 48 i passi arrivano ogni cinque o sei frame, 5,33 in media. È ciò che vi dà la virgola fissa.

## Slide 16: Eseguite: sempre più veloce

Compilate ed eseguite: il verme parte più lento che nella Parte 3 e accelera a ogni pasto. Con il debugger contate i frame tra due passi a punteggio zero: otto. Arrivate a sedici punti e verificate che la velocità non cambia più. Poi, se ne avete il coraggio, provate un massimo di 256: un passo per frame.

## Slide 17: Passo 3: step dice che cosa ha cambiato

Il terzo passo prepara il quarto. La funzione `step` comincia ad annotare che cosa ha cambiato, e i suoni vengono riorganizzati. Sullo schermo non comparirà nulla di nuovo.

## Slide 18: MODIFICATO play_note: una funzione, ogni nota

`play_note` sostituisce `eat_sound`. Il chiamante sceglie la nota e la durata, in `a2` e `a4`; la funzione compila canale, strumento e volume e chiama `prg32_audio_note`. Notate la scelta dei registri: nota e durata sono già dove le aspetta la funzione del runtime, quindi non c'è nulla da spostare. Un contratto progettato attorno al chiamato risparmia istruzioni.

## Slide 19: MODIFICATO step: ricordare la vecchia testa

L'inizio di `step`, con due store in più: prima che la testa si muova, le sue coordinate vengono scritte in `old_x` e `old_y`. Quella cella sta per smettere di essere testa e diventare corpo, e `draw` dovrà ridipingerla.

## Slide 20: MODIFICATO step: c'è una cella da cancellare?

Il ramo del pasto. Quando il verme mangia, la coda non si muove, quindi non c'è alcuna cella da cancellare: `erase_on` viene messo a zero per dirlo.

## Slide 21: MODIFICATO step: annotare la coda, chiamare la fine

Quando il verme non mangia, la coda lascia una cella: le sue coordinate vengono salvate in `erase_x` ed `erase_y`, ed `erase_on` diventa 1. Più sotto, la collisione con il corpo non è più gestita qui: è diventata una sola chiamata a `game_is_over`.

## Slide 22: MODIFICATO step: scrivere la nuova testa

La nuova testa viene scritta nell'anello e nella mappa, esattamente come nella Parte 3. La slide è qui solo perché la funzione continua nella successiva.

## Slide 23: NUOVO step: qualcosa è cambiato

La nuova fine di `step`. Prima `dirty` viene messo a 1: c'è stato un passo, e `draw` ha da fare. Poi, se il verme ha mangiato: un punto in più, nuovo cibo, e una nota breve e acuta, la numero 72 per 60 millisecondi, richiesta con due `li` e una chiamata.

## Slide 24: NUOVO game_is_over: la transizione, in un posto solo

`game_is_over` raccoglie in un posto solo tutto ciò che comporta la transizione da PLAY a OVER: il nuovo stato, l'aggiornamento del punteggio migliore, `dirty` messo a 2 perché va disegnata un'intera schermata nuova, e una nota lunga e bassa, la numero 36 per 400 millisecondi. Una transizione della macchina a stati merita una funzione tutta sua.

## Slide 25: Eseguite: il suono della sconfitta

Compilate ed eseguite: il gioco appare esattamente come dopo il secondo passo. Ciò che cambia si sente: una nota bassa quando vi mordete. Nel debugger guardate `erase_x` ed `erase_y` seguire la coda, un passo indietro, e `dirty` restare a 1 o 2: viene scritto, e nessuno lo legge ancora.

## Slide 26: Passo 4: disegnare solo ciò che è cambiato

Il quarto passo è l'ottimizzazione: da uno schermo intero a ogni frame a poche celle a ogni passo.

## Slide 27: Quanto costa un frame?

Quanto costa un frame della Parte 3? Cancella 64.000 pixel e ridisegna titolo, punteggio, verme e cibo, trenta volte al secondo. Eppure tra due passi sullo schermo non cambia nulla, e un passo cambia pochissimo: la cella lasciata dalla coda, la vecchia testa che diventa corpo, la nuova testa, e a volte il cibo e il punteggio. Quindi si ricorda che cosa è cambiato e si disegna solo quello. Funziona perché il frame buffer è memoria: l'immagine resta lì da sola.

## Slide 28: MODIFICATO draw: niente, poco, o tutto

La nuova `verm1_draw` legge `dirty` e lo azzera subito. Se valeva zero, ritorna immediatamente: niente stack frame, niente chiamate, cinque istruzioni macchina. Se valeva 1, c'è stato un passo e viene chiamata `draw_changes`. Se valeva 2, lo stato è cambiato e `draw_full` ridisegna tutto. Il caso più frequente è il meno costoso, ed è il segno di un'ottimizzazione ben fatta.

## Slide 29: NUOVO draw_changes: tre celle e il punteggio

`draw_changes` dipinge al massimo tre celle. Se `erase_on` è a 1, la cella lasciata dalla coda diventa nera. La vecchia testa viene ridipinta con il colore del corpo. Poi la nuova testa, il cibo e il punteggio. L'ordine conta: la testa può entrare proprio nella cella che la coda ha appena lasciato, quindi la cancellazione deve venire prima e la testa dopo.

## Slide 30: NUOVO draw_full: una schermata intera

`draw_full` è il corpo della vecchia `verm1_draw`: cancella lo schermo e disegna il punteggio; nello stato TITLE aggiunge l'invito e ritorna. Viene chiamata una volta per ogni cambio di stato, non a ogni frame.

## Slide 31: NUOVO draw_full: PLAY e OVER

La seconda metà di `draw_full`: in PLAY e OVER disegna il verme e il cibo con le loro funzioni, e in OVER aggiunge le due parole del game over.

## Slide 32: NUOVO draw_head

`draw_head` disegna una cella in verde brillante: la voce `head_i` dell'anello. È una piccola funzione con un solo compito, usata da `draw_changes`.

## Slide 33: NUOVO draw_food

`draw_food`: le tre righe che stavano dentro `draw` ora hanno un nome e due chiamanti, il disegno completo e quello parziale.

## Slide 34: INVARIATO draw_text

`draw_text`, la funzione di servizio della Parte 3, invariata. Ha una slide tutta sua perché nella Parte 3 ne condivideva una con il testo del game over.

## Slide 35: MODIFICATO init: chiedere la prima schermata

`verm1_init` con tre righe in più: `dirty` parte da 2, perché la schermata del titolo va disegnata una volta.

## Slide 36: MODIFICATO update: un nuovo stato è una nuova schermata

In `verm1_update`, la transizione da OVER di nuovo a TITLE ora mette anche `dirty` a 2: un nuovo stato è una nuova schermata.

## Slide 37: MODIFICATO new_game: e anche qui

Lo stesso in `new_game`, per la transizione da TITLE a PLAY. È la regola della tecnica: ogni transizione chiede un disegno completo, ogni passo uno parziale. Se ne dimenticate uno, lo schermo mostra uno stato che non è più vero, ed è l'errore tipico.

## Slide 38: Eseguite: il Verm1 finito

Il Verm1 finito. Deve essere lo stesso gioco di dopo il terzo passo, pixel per pixel: l'ottimizzazione non deve vedersi. Se vedete scie o buchi, qualche cambiamento non è stato annotato: trovatelo con il debugger, partendo dalle tre variabili che scrive `step`.

## Slide 39: Passo 5: misurare

L'ultimo passo non scrive codice. Usate PRG32-QT come strumento di misura, perché un'ottimizzazione non misurata è solo un'opinione.

## Slide 40: Prima e dopo, con i numeri

Sei azioni. Eseguite il gioco finito in modalità debug e avviate una partita. Leggete la telemetria per dieci secondi. Confrontate con i numeri della Parte 3 annotati all'inizio. Fate crescere il verme fino a venti celle in entrambe le versioni e rileggete: in una il costo cresce con il verme, nell'altra no. Mettete un breakpoint su `draw_changes` e verificate che si ferma una volta per passo. Annotate i numeri: andranno nella descrizione del vostro gioco.

## Slide 41: Seguire una chiamata con il debugger

Seguite una chiamata con il debugger. Fermatevi sulla chiamata a `to_decimal` e leggete `a0`, `a1`, `ra` e `sp`. Un passo: il PC salta dentro la funzione e `ra` contiene l'indirizzo dell'istruzione dopo la chiamata. Proseguite: cambiano solo i temporanei e `sp` non si muove mai, perché è una foglia. A `ret` il PC prende il valore di `ra`. Poi fate lo stesso con `draw_text`: `sp` scende di 16, `ra` viene memorizzato e poi ripreso.

## Slide 42: Verifica la comprensione: to_decimal riceve a0 = 205. Quali byte memorizza, dallo scostamento 0 al 2?

Convertite 205 in tre cifre, poi ogni cifra nel suo codice ASCII sommando 0x30. Attenzione all'ordine: lo scostamento 0 contiene le centinaia.

## Slide 43: Verifica la comprensione: A quale punteggio il verme fa un passo ogni 4 frame?

Un passo ogni quattro frame significa una velocità di 256 diviso 4. Mettete quel valore nella formula della velocità e ricavate il punteggio.

## Slide 44: Verifica la comprensione: dirty vale 0 quando viene chiamata verm1_draw. Quante istruzioni macchina esegue?

Contate le istruzioni del percorso più breve di `verm1_draw`, ricordando che `la` è una pseudo-istruzione e si espande in due.

## Slide 45: Verifica la comprensione: Perché to_decimal può fare a meno di uno stack frame?

Chiedetevi a che cosa serve uno stack frame: salvare `ra` quando c'è un'altra chiamata, e salvare i registri da conservare. A `to_decimal` serve l'una o l'altra cosa?

## Slide 46: Fatelo vostro

Quattro idee per fare vostro il gioco. Una pausa con il pulsante B: un quarto stato. Una melodia nella schermata del titolo, da una tabella di note. Cibo bonus che vale di più e scompare. I vostri colori, o le vostre regole. La versione che pubblicherete nella prossima lezione dovrebbe contenere qualcosa di vostro, a cominciare dal titolo.

## Slide 47: Appendice: le funzioni che non sono cambiate

Segue un'appendice: le otto parti del file che non sono cambiate rispetto alla Parte 3. Sono incluse perché questa presentazione contenga l'intero programma; nel vostro file tenetele come sono.

## Slide 48: INVARIATO update: pulsanti e fronti

`verm1_update`: la lettura dei pulsanti e il rilevatore di fronte della Parte 3.

## Slide 49: INVARIATO new_game: la mappa e il verme

La prima metà di `new_game`: la mappa viene svuotata e il verme viene posato.

## Slide 50: INVARIATO play_update: la sterzata

La sterzata dentro `play_update`: le maschere dei pulsanti e la regola che vieta l'inversione a U, dalla Parte 2.

## Slide 51: INVARIATO step: la ricerca in tabella

L'inizio di `step`: lo stack frame e la ricerca della direzione nelle tabelle `dx` e `dy`.

## Slide 52: INVARIATO place_food

`place_food`: una cella a caso, ritentata finché non è libera.

## Slide 53: INVARIATO draw_worm

`draw_worm`, che percorre l'anello all'indietro. Ora è usata solo da `draw_full`, una volta per nuova schermata.

## Slide 54: INVARIATO draw_cell

`draw_cell`, dalle celle ai pixel: la stessa funzione dalla Parte 2.

## Slide 55: INVARIATO .rodata

La sezione `.rodata`: le stringhe e le tabelle delle direzioni.

## Slide 56: Dove siamo, e che cosa viene dopo

Verm1 è finito: circa seicento righe di assembly RISC-V, tutte vostre. È cominciato come tre funzioni che ritornano ed è cresciuto un passo eseguibile alla volta, e dentro c'è ogni parte del corso: numeri, logica, stato, memoria, chiamate, pixel, dispositivi. Manca una cosa: un programma che solo il suo autore può eseguire è finito a metà. La prossima lezione gli dà un nome, un'icona e i crediti, e lo pubblica.
