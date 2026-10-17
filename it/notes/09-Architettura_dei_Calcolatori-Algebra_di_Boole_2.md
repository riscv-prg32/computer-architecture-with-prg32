# Lezione 09: Elementi di algebra di Boole

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il sommatore; le funzioni booleane; le forme canoniche; minimizzazione, Karnaugh. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) scrivere una funzione in forma canonica dalla sua tabella di verità; (2) minimizzare una funzione di al più quattro variabili con una mappa di Karnaugh; (3) costruire un sommatore completo e concatenarlo in un sommatore a n bit. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 10, Introduzione all'elettronica e all'elettronica digitale.

Il filo della lezione: La add della Lezione 02 è ora un circuito che sapreste disegnare: 32 sommatori completi e un riporto che si propaga. Prossimo passo: l'elettronica che fa una porta.

## Slide 1: Elementi di algebra di Boole

La lezione precedente ha fornito operatori e proprietà. Questa affronta la domanda pratica che ne segue: dato ciò che un circuito deve fare, come se ne trovano le porte? La risposta è un metodo in tre passi, tavola di verità, forma canonica e minimizzazione, applicato al circuito più importante del corso, il sommatore. La lezione si apre con due istruzioni che sommano due bit e si chiude con i trentadue sommatori che eseguono ogni `add` scritto finora. Passa così dall'algebra come calcolo all'algebra come metodo di progetto.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Padroneggiare il lessico: letterale, clausola, fattore, mintermine, maxtermine. Dire quante funzioni booleane di n variabili esistono. Scrivere una funzione in entrambe le forme canoniche a partire dalla sua tavola di verità. Minimizzare una funzione di al più quattro variabili con una mappa di Karnaugh, l'abilità più esercitata dalla prova intercorso e dal laboratorio. E ricavare il semisommatore e il sommatore completo, spiegando poi come trentadue di essi eseguono un'addizione.

## Slide 3: Espressioni booleane: il vocabolario

Tre termini. Un *letterale* è una variabile, o il suo complemento, così come compare in un'espressione: a, b', x. Una *clausola*, o termine prodotto, è un prodotto logico di letterali: a b' x. Un *fattore*, o termine somma, è una somma logica di letterali: (a + x'). Il numero dei letterali è una prima misura del costo di un'espressione, perché ogni occorrenza di una variabile è l'ingresso di qualche porta; contare i letterali è il modo in cui si confronteranno due forme della stessa funzione.

## Slide 4: Quante funzioni di n variabili?

Una funzione booleana assegna 0 o 1 a ogni combinazione dei suoi n ingressi. Le combinazioni sono 2^n, e per ciascuna ci sono due uscite possibili, quindi il numero di funzioni distinte è 2^(2^n): 4 per una variabile, 16 per due, 256 per tre, 65.536 per quattro. Il numero è finito ma cresce in modo doppiamente esponenziale. L'ultima riga dice perché l'argomento conta: ogni circuito digitale si può scrivere come espressione booleana, e ogni espressione booleana si può costruire come circuito. La corrispondenza tra algebra e hardware è esatta.

## Slide 5: Le sedici funzioni di due variabili

Tutte le sedici funzioni di due variabili. Ogni riga è una funzione, le quattro colonne centrali ne danno le uscite per gli ingressi 00, 01, 10 e 11; l'indice della funzione è quella colonna di uscite letta come numero binario. Tra esse compaiono, evidenziate, le porte della Lezione 08: AND è f1, XOR è f6, OR è f7, NOR è f8, XNOR è f9, NAND è f14. Le restanti sono le due costanti, i due ingressi riportati invariati, le loro negazioni e quattro funzioni meno comuni, come l'implicazione.

## Slide 6: Insiemi funzionalmente completi

Un insieme di operatori è *funzionalmente completo* se ogni funzione booleana si può esprimere con esso soltanto. AND, OR e NOT formano un insieme completo. Poiché le leggi di De Morgan permettono di ottenere AND o OR l'uno dall'altro con l'aiuto di NOT, bastano due operatori. Il fatto notevole viene per ultimo: NAND da solo è completo, e così NOR da solo. Un solo tipo di porta basta a costruire qualsiasi circuito digitale, un intero processore compreso, ed è per questo che NAND e NOR si chiamano porte universali. La Lezione 10 mostra perché questo conta dal punto di vista economico.

## Slide 7: Il semisommatore

Il semisommatore somma due bit A e B e produce un bit di somma S e un riporto C. La tavola di verità mostra che S vale 1 quando gli ingressi differiscono, cioè XOR, e che C vale 1 quando entrambi valgono 1, cioè AND. Il circuito a destra corrisponde esattamente alle due istruzioni del riscaldamento. Si chiama "semi" perché non ha un ingresso per il riporto da una posizione meno significativa, quindi da solo può sommare solo i bit meno significativi di due numeri.

## Slide 8: Il sommatore completo

Il sommatore completo ha tre ingressi, i due bit degli operandi A e B e un riporto entrante, e due uscite, un bit di somma e un riporto uscente. Dalla tavola, S vale 1 quando un numero dispari di ingressi vale 1, e il riporto uscente vale 1 quando almeno due ingressi valgono 1. Il circuito consiste di due semisommatori e di una porta OR: il primo somma A e B, il secondo somma il riporto entrante alla loro somma parziale, e l'OR fonde i due riporti possibili, che non possono mai valere 1 entrambi. Nel disegno, fili che si incrociano senza un punto non sono collegati.

## Slide 9: Mintermini e maxtermini

Un *mintermine* è un prodotto che contiene ogni variabile esattamente una volta, complementata o no. La sua proprietà caratteristica è di valere 1 per una sola riga della tavola di verità: a'b'c vale 1 solo quando a = 0, b = 0 e c = 1. Un *maxtermine* è una somma che contiene ogni variabile esattamente una volta, e vale 0 per una sola riga. Per scrivere il mintermine di una riga si complementano le variabili che in quella riga valgono 0; per il maxtermine, quelle che valgono 1. Mintermini e maxtermini sono i mattoni delle forme canoniche.

## Slide 10: Dalla tabella di verità alle forme canoniche

Il procedimento applicato a F. Per ogni riga in cui F vale 1 si scrive il suo mintermine, e l'OR di questi mintermini è la forma canonica P: F è la somma dei mintermini 3, 4, 5, 6 e 7. Per ogni riga in cui F vale 0 si scrive il suo maxtermine, e l'AND di questi maxtermini è la forma canonica S: il prodotto dei maxtermini 0, 1 e 2. Entrambe le espressioni sono corrette e uniche, il che ne fa il valore teorico; nessuna delle due è economica, perché la prima ha cinque clausole e quindici letterali.

## Slide 11: Minimizzazione algebrica di F

La forma canonica di F ridotta passo per passo con le leggi della Lezione 08. Si raccoglie A da quattro clausole; si raccoglie di nuovo dentro la parentesi; si applica due volte la legge del complemento; infine la semplificazione x + x'y = x + y. Quindici letterali diventano tre: F = A + BC. Il metodo funziona, ma la didascalia ne indica il punto debole: a ogni passo bisognava vedere quale legge applicare. Per funzioni più grandi questo è impraticabile, e serve un metodo indipendente dall'intuizione.

## Slide 12: Mappe di Karnaugh: l'idea

Una mappa di Karnaugh è la tavola di verità ridisegnata come griglia, una cella per riga. La sua caratteristica essenziale è l'ordine delle celle: due celle vicine qualsiasi differiscono nel valore di esattamente una variabile, ed è per questo che le colonne sono etichettate 00, 01, 11, 10 (un codice Gray) e non in ordine di conteggio. Di conseguenza due 1 adiacenti si possono fondere in una sola clausola con un letterale in meno, grazie alla legge xy + xy' = x. La regola è raggruppare gli 1 in rettangoli di 1, 2, 4 o 8 celle, ciascuno il più grande possibile, finché ogni 1 è coperto. Anche i bordi sinistro e destro sono adiacenti.

## Slide 13: Una mappa di tre variabili: la nostra F

La funzione F posta su una mappa a tre variabili. Si scrive 1 nelle celle dei mintermini 3, 4, 5, 6 e 7. Il gruppo rosso copre l'intera riga A = 1, quattro celle in cui variano sia B sia C, quindi la clausola è A. Il gruppo viola copre la colonna BC = 11, in cui varia A, quindi la clausola è BC. Ogni 1 è coperto e nessun gruppo si può allargare: F = A + BC. È il risultato della minimizzazione algebrica, ottenuto a colpo d'occhio in pochi secondi.

## Slide 14: Una mappa di quattro variabili

Con quattro variabili la mappa ha sedici celle, ed entrambi gli insiemi di etichette seguono l'ordine 00, 01, 11, 10. Il gruppo rosso centrale di quattro dà BD. Anche i quattro angoli formano un gruppo, perché la mappa si richiude in entrambe le direzioni, come se fosse disegnata sulla superficie di un toro. Negli angoli B e D valgono entrambi 0, quindi la clausola è B'D'. Il risultato ha quattro letterali invece di trentadue. Prima di concludere che un 1 è isolato, vanno sempre esaminati i bordi e gli angoli.

## Slide 15: Condizioni di indifferenza

Alcune combinazioni di ingresso non possono mai presentarsi, oppure la loro uscita è irrilevante quando si presentano. Una cifra decimale codificata su quattro bit usa solo dieci delle sedici configurazioni, e le altre sei non compaiono mai. Le loro celle si marcano con x, una *condizione di indifferenza*, e ogni x si può trattare come 1 o come 0, come conviene: come 1 quando allarga un gruppo, e altrimenti la si ignora. Più libertà significa gruppi più grandi e quindi un circuito più economico. La Lezione 11 incontra questa situazione nel codice BCD e nel display a sette segmenti.

## Slide 16: Trentadue sommatori completi fanno una add

Si mettono in fila trentadue sommatori completi, uno per posizione di bit. Ciascuno riceve un bit di A, un bit di B e il riporto dalla posizione alla sua destra, e passa il proprio riporto a sinistra: è un *sommatore a propagazione del riporto*, ed è ciò che esegue `add t2, t0, t1`. Il primo riporto entrante vale 0. La sottrazione usa lo stesso sommatore: il secondo operando si complementa e il primo riporto entrante si pone a 1, che è esattamente il cambio di segno in complemento a due della Lezione 05. Il riporto uscente dall'ultima posizione si scarta. Il riporto deve attraversare tutti e trentadue gli stadi, un ritardo le cui conseguenze esamina la Lezione 11.

## Slide 17: Verifica la comprensione: Quante funzioni booleane distinte di tre variabili esistono? / Quale mintermine di tre variabili A, B, C corrisponde alla riga 5 della tabella di verità?

Per la prima domanda si applica la formula del numero di funzioni con n = 3, valutando prima l'esponente: 2^3 = 8 è il numero di righe della tavola di verità, e la risposta è 2^8.

Per la seconda, 5 si scrive in binario su tre bit, 101. In un mintermine una variabile compare non complementata dove la riga ha 1 e complementata dove ha 0. L'opzione che contiene segni più si può scartare subito: è una somma e quindi non può essere un mintermine.

## Slide 18: Verifica la comprensione: In una mappa di Karnaugh, un gruppo rettangolare di quattro 1 adiacenti elimina: / In un sommatore completo, il riporto uscente vale 1 quando:

Per la prima domanda: un gruppo di 2^k celle elimina k variabili, e quattro è 2^2. La mappa a tre variabili lo conferma: la riga di quattro 1 ha perso sia B sia C.

Per la seconda si consulta la tavola del sommatore completo. Il riporto uscente vale 1 nelle righe con due o tre 1 tra gli ingressi: è la funzione di *maggioranza*. "Un numero dispari di 1" descrive l'altra uscita, il bit di somma.

## Slide 19: Glossario: inglese e italiano

Dodici termini. In italiano le forme canoniche si indicano con P, per *prodotti*, e S, per *somme*; i testi inglesi usano SOP e POS. L'*half adder* è il *semisommatore*, il *full adder* il *sommatore completo*. Un *don't care* è una *condizione di indifferenza*. Il *ripple-carry adder* è il sommatore in cui il riporto si propaga da ogni posizione alla successiva.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Una funzione booleana è una tavola di verità, e una tavola di verità dà sempre un'espressione canonica. La minimizzazione ottimizza la rete e ne riduce il costo. Le mappe di Karnaugh trasformano l'algebra in un procedimento visivo: si raggruppano gli 1 e si leggono le clausole. Il semisommatore e il sommatore completo sono i primi veri circuiti del corso. E trentadue sommatori completi in fila eseguono l'`add` scritto nella prima lezione di programmazione. La prossima lezione si chiede di che cosa sono fatte le porte stesse.
