# Lezione 09: Elementi di algebra di Boole

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il sommatore; le funzioni booleane; le forme canoniche; minimizzazione, Karnaugh. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Elementi di algebra di Boole

La lezione precedente vi ha dato operatori e proprietà. Questa risponde alla domanda pratica che ne segue: dato ciò che un circuito deve fare, come si trovano le porte? La risposta è un metodo in tre passi, tabella di verità, forma canonica e minimizzazione, e lo applicherete al circuito più importante del corso, l'addizionatore. La lezione si apre con due istruzioni che sommano due bit, e si chiude con i trentadue sommatori che eseguono ogni `add` che avete scritto.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Conoscere il vocabolario: letterale, clausola, fattore, mintermine, maxtermine. Dire quante funzioni booleane di n variabili esistono. Scrivere una funzione nelle due forme canoniche a partire dalla tabella di verità. Minimizzare una funzione fino a quattro variabili con una mappa di Karnaugh: è l'abilità più esercitata dalla prova intercorso e dal laboratorio. E ricavare semisommatore e sommatore completo, spiegando come trentadue di essi svolgono un'addizione.

## Slide 3: Espressioni booleane: il vocabolario

Tre parole. Un *letterale* è una variabile o il suo complemento così come compare in un'espressione: a, b', x. Una *clausola*, o termine prodotto, è un prodotto logico di letterali: a b' x. Un *fattore*, o termine somma, è una somma logica di letterali: (a + x'). Il numero di letterali misura il costo di un'espressione, perché ogni occorrenza di una variabile è l'ingresso di una porta. Conterete i letterali per confrontare due forme della stessa funzione.

## Slide 4: Quante funzioni di n variabili?

Una funzione booleana assegna uno 0 o un 1 a ogni combinazione dei suoi n ingressi. Le combinazioni sono 2 alla n, e per ciascuna ci sono due uscite possibili: le funzioni sono quindi 2 elevato a 2 alla n. Con una variabile sono 4, con due 16, con tre 256, con quattro 65.536. Il numero è finito ma cresce con estrema rapidità. L'ultima riga è la ragione per cui si studia tutto questo: ogni circuito digitale si può scrivere come espressione, e ogni espressione si può realizzare come circuito.

## Slide 5: Le sedici funzioni di due variabili

Tutte e sedici le funzioni di due variabili. Ogni riga è una funzione, e le quattro colonne centrali sono le sue uscite per gli ingressi 00, 01, 10 e 11; il numero della funzione è quella colonna di uscite letta come numero binario. Tra esse riconoscete, evidenziate, le porte della Lezione 08: AND è f1, XOR è f6, OR è f7, NOR è f8, XNOR è f9, NAND è f14. Le altre sono le due costanti, i due ingressi lasciati passare invariati, le loro negazioni, e quattro funzioni meno comuni.

## Slide 6: Insiemi funzionalmente completi

Un insieme di operatori è *funzionalmente completo* se con esso si può costruire ogni funzione booleana. AND, OR e NOT sono completi. Per le leggi di De Morgan uno tra AND e OR si ottiene dall'altro con NOT, quindi bastano due operatori. Il fatto sorprendente è l'ultimo: NAND da solo è completo, e così NOR da solo. Un solo tipo di porta basta a costruire qualunque circuito digitale, un intero processore compreso; per questo NAND e NOR si chiamano porte universali.

## Slide 7: Il semisommatore

Il semisommatore somma due bit A e B e produce un bit di somma S e un riporto C. Dalla tabella, S vale 1 quando gli ingressi sono diversi, cioè lo XOR, e C vale 1 quando entrambi valgono 1, cioè l'AND. Il circuito a destra è esattamente la coppia di istruzioni del riscaldamento. Si chiama «semi» perché non ha un ingresso per il riporto proveniente da una posizione precedente, quindi da solo può sommare soltanto i bit meno significativi di due numeri.

## Slide 8: Il sommatore completo

Il sommatore completo ha tre ingressi: i due bit A e B e un riporto entrante. Produce un bit di somma e un riporto uscente. Leggete la tabella: S vale 1 quando è a 1 un numero dispari di ingressi; il riporto uscente vale 1 quando almeno due ingressi sono a 1. Il circuito è fatto di due semisommatori e un OR: il primo somma A e B, il secondo somma il riporto entrante alla loro somma, e l'OR combina i due possibili riporti. Nel disegno i fili che si incrociano senza un punto non sono collegati.

## Slide 9: Mintermini e maxtermini

Un *mintermine* è un prodotto che contiene ogni variabile una volta, complementata o no. La sua proprietà speciale è di valere 1 per una e una sola riga della tabella di verità: a'b'c vale 1 solo quando a è 0, b è 0 e c è 1. Un *maxtermine* è una somma che contiene ogni variabile una volta, e vale 0 per una e una sola riga. Per scrivere il mintermine di una riga si complementano le variabili che in quella riga valgono 0; per il maxtermine, quelle che valgono 1.

## Slide 10: Dalla tabella di verità alle forme canoniche

La ricetta applicata a F. Per ogni riga in cui F vale 1 si scrive il suo mintermine; l'OR di questi mintermini è la forma canonica P: F è la somma dei mintermini 3, 4, 5, 6 e 7. Per ogni riga in cui F vale 0 si scrive il suo maxtermine; l'AND di questi maxtermini è la forma canonica S: il prodotto dei maxtermini 0, 1 e 2. Entrambe le espressioni sono corrette e uniche. Nessuna è economica: la prima ha cinque clausole e quindici letterali.

## Slide 11: Minimizzazione algebrica di F

La forma canonica di F ridotta passo per passo con le leggi della Lezione 08. Si raccoglie A da quattro clausole; si raccoglie di nuovo dentro la parentesi; si applica due volte la legge del complemento; infine si applica la semplificazione x + x'y = x + y. Quindici letterali diventano tre: F = A + BC. Funziona, ma notate ciò che dice la didascalia: a ogni passo bisognava vedere quale legge applicare. Per una funzione più grande non è praticabile. Serve un metodo che non dipenda dall'ispirazione.

## Slide 12: Mappe di Karnaugh: l'idea

Una mappa di Karnaugh è la tabella di verità ridisegnata come griglia, con una cella per ogni riga. Il punto essenziale è l'ordine delle celle: due celle vicine differiscono nel valore di una sola variabile, ed è per questo che le colonne sono etichettate 00, 01, 11, 10 e non nell'ordine del conteggio. Grazie a ciò due 1 adiacenti si possono fondere in un'unica clausola con un letterale in meno. La regola: si raggruppano gli 1 in rettangoli di 1, 2, 4 o 8 celle, i più grandi possibile, finché ogni 1 è coperto. Anche i bordi sinistro e destro sono adiacenti.

## Slide 13: Una mappa di tre variabili: la nostra F

La funzione F della lezione su una mappa di tre variabili. Si scrive 1 nelle celle dei mintermini 3, 4, 5, 6 e 7. Il gruppo rosso prende l'intera riga A = 1, quattro celle: cambiano due variabili, B e C, e la clausola è A. Il gruppo viola prende la colonna BC = 11: A cambia, e la clausola è BC. Ogni 1 è coperto e nessun gruppo si può allargare: F = A + BC. È il risultato della minimizzazione algebrica, trovato a occhio in pochi secondi.

## Slide 14: Una mappa di quattro variabili

Con quattro variabili la mappa ha sedici celle, ed entrambe le coppie di etichette seguono l'ordine 00, 01, 11, 10. Il gruppo rosso di quattro al centro dà BD. Anche i quattro angoli formano un solo gruppo, perché la mappa si richiude nelle due direzioni: immaginatela disegnata sulla superficie di una ciambella. Negli angoli B e D valgono entrambe 0, quindi la clausola è B'D'. Il risultato ha quattro letterali invece di trentadue. Guardate sempre bordi e angoli prima di concludere che un 1 è isolato.

## Slide 15: Condizioni di indifferenza

A volte una combinazione di ingressi non può mai presentarsi, oppure quando si presenta l'uscita non importa. Una cifra decimale codificata su quattro bit usa solo dieci delle sedici configurazioni: le altre sei non compaiono mai. Le loro celle si segnano con una x, una *condizione di indifferenza*, e ogni x si può leggere come 1 o come 0, a seconda di ciò che conviene. Usate una x come 1 quando permette di allargare un gruppo; ignoratela altrimenti. Più libertà significa gruppi più grandi e un circuito più economico.

## Slide 16: Trentadue sommatori completi fanno una add

Mettete in fila trentadue sommatori completi, uno per posizione di bit. Ognuno riceve un bit di A, un bit di B e il riporto dalla posizione alla sua destra, e passa il proprio riporto a sinistra: un *sommatore a propagazione del riporto*. È ciò che esegue `add t2, t0, t1`. Il primo riporto entrante è 0. Per una sottrazione si usa lo stesso addizionatore: il secondo operando è complementato e il primo riporto entrante è 1, cioè il complemento a due della Lezione 05. Il riporto uscente dall'ultima posizione viene semplicemente scartato.

## Slide 17: Verifica la comprensione: Quante funzioni booleane distinte di tre variabili esistono? / Quale mintermine di tre variabili A, B, C corrisponde alla riga 5 della tabella di verità?

Usate la formula del numero di funzioni con n uguale a 3. Prima l'esponente: 2 alla 3 fa 8, il numero di righe della tabella di verità; poi 2 alla 8.

Scrivete 5 in binario su tre bit: 101. In un mintermine una variabile compare diretta dove la riga ha un 1 e complementata dove ha uno 0. Scartate subito l'opzione con i segni più: è una somma, quindi non può essere un mintermine.

## Slide 18: Verifica la comprensione: In una mappa di Karnaugh, un gruppo rettangolare di quattro 1 adiacenti elimina: / In un sommatore completo, il riporto uscente vale 1 quando:

Un gruppo di 2 alla k celle elimina k variabili. Quattro è 2 al quadrato. Verificatelo sulla mappa di tre variabili: la riga di quattro 1 ha perso sia B sia C.

Guardate la tabella del sommatore completo. Il riporto uscente vale 1 nelle righe con due o tre 1 tra gli ingressi: è la funzione di *maggioranza*. «Un numero dispari di 1» descrive l'altra uscita, il bit di somma.

## Slide 19: Glossario: inglese e italiano

Dodici termini. In italiano le forme canoniche si indicano con le lettere P, per prodotti, e S, per somme; i testi inglesi dicono SOP e POS. *Half adder* è il semisommatore e *full adder* il sommatore completo. *Don't care* è la condizione di indifferenza. Il *ripple-carry adder* è il sommatore in cui il riporto si propaga da una posizione alla successiva.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Una funzione booleana è una tabella di verità, e una tabella di verità dà sempre un'espressione canonica. La minimizzazione ottimizza la rete per renderla più economica. Le mappe di Karnaugh trasformano l'algebra in una figura: si raggruppano gli 1 e si leggono le clausole. Il semisommatore e il sommatore completo sono i primi veri circuiti del corso. E trentadue sommatori completi in fila eseguono la `add` che avete scritto nella prima lezione. A seguire: di che cosa sono fatte le porte.
