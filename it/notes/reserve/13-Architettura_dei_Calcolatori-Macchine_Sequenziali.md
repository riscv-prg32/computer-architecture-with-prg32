# Lezione 13: Macchine sequenziali

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Circuiti sequenziali

In un circuito combinatorio le uscite dipendono solo dagli ingressi presenti. In un circuito *sequenziale* dipendono anche dalla storia passata degli ingressi. La definizione porta con sé due concetti. Il tempo: quando guardiamo i segnali, e quando possono cambiare? Lo stato: che cosa ricorda il circuito del passato? La frase grande a destra è una buona sintesi: un circuito sequenziale è un circuito combinatorio più qualcosa che ricorda.

## Il tempo: dal continuo al discreto

Un segnale fisico passa per infiniti istanti e infiniti valori. Un sistema digitale rinuncia a entrambi gli infiniti. I valori sono stati ridotti a due nella Lezione 10, con le soglie. Il tempo si riduce a una sequenza di istanti scelti, t0, t1, t2: il segnale si legge solo in quegli istanti, e ciò che fa in mezzo non conta. Chi decide quando cadono quegli istanti? Un segnale periodico dedicato, il clock.

## Sintesi di una rete sequenziale

La sintesi di una rete sequenziale in cinque passi. Si definiscono ingressi, uscite e stati. Si definiscono le funzioni stato prossimo e di uscita con una tabella o un diagramma degli stati. Si assegna a ogni stato un codice binario: k variabili per un massimo di 2 alla k stati. Si sintetizzano le due reti combinatorie con i metodi noti. Si scelgono gli elementi di memoria. Con i flip-flop D il quarto passo è il più semplice, perché la rete deve solo calcolare il codice dello stato prossimo.

## Tabella e diagramma degli stati: una macchina di Moore

Le stesse transizioni come macchina di Moore. L'uscita non dipende più dall'ingresso, quindi la tabella ha per essa una colonna a parte e il diagramma la scrive dentro ogni nodo; le frecce portano solo il simbolo di ingresso. In questo esempio l'uscita è semplicemente il codice binario dello stato. Confrontate le due slide: la struttura di stati e transizioni è identica, e cambia solo il posto in cui si scrive l'uscita.

## Elementi di memoria

Un circuito che può memorizzare un bit è un *bistabile*: ha due stati stabili, 0 e 1, e resta in uno dei due finché qualcosa non lo cambia. Le famiglie sono due, latch e flip-flop, ed entrambe hanno due uscite, Q e il suo complemento. L'idea è più vecchia del transistor: il primo flip-flop elettronico fu costruito nel 1918 con due valvole, e lo stesso circuito era al cuore di Colossus.

## Perché S = R = 1 non è ammesso

Con S e R entrambi a 1, entrambe le porte NOR danno 0, quindi Q e il suo complemento non sono più complementari. Peggio: se poi i due ingressi tornano a 0 insieme, le porte fanno a gara, e lo stato finale dipende da quale è più veloce. Il risultato è imprevedibile, e il latch può perfino oscillare. Chi usa un latch SR deve garantire che S e R non siano mai a 1 insieme. Gli elementi JK e D sono stati inventati per eliminare il problema alla radice.

## La sensibilità al livello e il suo problema

Un latch è *sensibile al livello*: per tutto il tempo in cui il clock è al livello attivo è trasparente, e ogni variazione degli ingressi passa alle uscite. Quindi in un ciclo di clock lo stato può cambiare più volte. In una macchina con retroazione questo è fatale: il nuovo stato fa il giro dell'anello e cambia di nuovo lo stato nello stesso ciclo. Un latch JK con entrambi gli ingressi a 1 continua a commutare finché il clock è alto. Serve un elemento che cambi al più una volta per ciclo.

## Esempio di sintesi: un contatore a due bit

Una sintesi completa: un contatore a due bit che fa 0, 1, 2, 3 e torna a 0. Seguite i sei passi a destra. Gli stati sono i quattro valori; il codice è il conteggio stesso; la tabella dà lo stato prossimo per ogni stato presente. Con i flip-flop D gli ingressi D1 e D0 sono semplicemente i bit dello stato prossimo. Minimizzandoli come funzioni di Q1 e Q0 si ottiene D0 = NOT Q0 e D1 = Q1 XOR Q0. Due flip-flop, un invertitore e una porta XOR.
