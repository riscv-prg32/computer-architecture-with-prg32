# Lezione 06: Rappresentazione dei numeri: i reali

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Rappresentazione dei numeri: i reali

La lezione precedente trattava i numeri interi. Questa tratta i numeri con una parte frazionaria, e parte da un problema pratico: una palla che deve spostarsi di meno di un pixel per frame, su un processore che non ha istruzioni per i numeri reali. La soluzione, la virgola fissa, usa solo ciò che già conoscete. La virgola mobile compare poi come risposta generale, con lo standard seguito da ogni calcolatore, IEEE 754.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Due codifiche degli interi con segno che completano la lezione precedente, complemento a uno ed eccesso k: servono per capire la virgola mobile. Poi la virgola fissa, che userete nel progetto. Poi la virgola mobile: mantissa, esponente, normalizzazione, codifica e decodifica di un numero in singola precisione, e le configurazioni speciali. Infine un fatto sul vostro kit: il suo processore non ha istruzioni in virgola mobile, e saprete dire che cosa fanno invece i programmi.

## Slide 3: Complemento a uno

In complemento a uno un numero negativo si ottiene invertendo ogni bit del positivo: 6 è 0110, meno 6 è 1001. Cambiare segno non potrebbe essere più semplice. Il prezzo è lo stesso del segno e modulo: lo zero ha due rappresentazioni, 0000 e 1111, e l'intervallo è simmetrico, da meno 7 a più 7 su quattro bit. L'istruzione `not` di RISC-V calcola esattamente il complemento a uno di un registro.

## Slide 4: Aritmetica in complemento a uno

La somma in complemento a uno funziona con l'addizionatore ordinario, con una correzione: quando c'è un riporto uscente dal bit più a sinistra, al risultato va sommato 1. Si chiama *riporto circolare*. Il primo esempio non richiede correzione. Nel secondo e nel terzo il riporto uscente fa il giro e viene sommato. Il passo in più e il doppio zero sono le ragioni per cui ha vinto il complemento a due, in cui il riporto si scarta e basta.

## Slide 5: Rappresentazione in eccesso k (polarizzata)

In eccesso k ogni numero è traslato verso l'alto di una costante: X = x + k. Con quattro bit e k = 8, la configurazione 0000 significa meno 8, 1000 significa zero e 1111 significa più 7. La proprietà preziosa è che l'ordine si conserva: a un numero maggiore corrisponde sempre una configurazione maggiore, quindi due numeri con segno si confrontano come se fossero naturali. L'aritmetica è meno comoda, perché ogni somma va corretta. È la codifica dell'esponente nei numeri in virgola mobile.

## Slide 6: Quattro bit, cinque letture

La tabella della Lezione 05 con due colonne in più: le stesse sedici configurazioni lette senza segno, in segno e modulo, in complemento a uno, in complemento a due e in eccesso 8. Tre osservazioni. Segno e modulo e complemento a uno hanno due zeri, evidenziati. Complemento a due ed eccesso 8 coprono lo stesso intervallo, da meno 8 a più 7, e differiscono solo nel bit più a sinistra. E l'eccesso 8 è l'unica colonna in cui i valori crescono con regolarità dall'alto al basso della tabella.

## Slide 7: Numeri in virgola fissa

In virgola fissa la parte intera e la parte frazionaria stanno fianco a fianco in una parola, e la posizione della virgola è fissa. Non è memorizzata da nessuna parte: è un accordo che il programma conosce. Se f bit sono riservati alla frazione, la parola contiene il numero moltiplicato per 2 alla f, e il passo più piccolo rappresentabile, la *risoluzione*, è 2 alla meno f. La notazione Qm.f dice come sono divisi i bit: Q24.8 significa 24 bit interi e 8 bit frazionari.

## Slide 8: Numeri razionali: l'errore di approssimazione

I numeri reali sono densi: tra due qualsiasi ce ne sono infiniti altri, quindi con un numero finito di bit la maggior parte non si può rappresentare, e ciascuno è sostituito dal più vicino tra quelli rappresentabili. In Q24.8 il numero 0,1 diventa 26/256, circa 0,1016. L'errore è al più metà della risoluzione. Un numero troppo vicino a zero diventa zero: è l'*underflow*, ed è il motivo per cui una velocità di 0,001 pixel per frame lascerebbe ferma la palla. In virgola fissa l'errore assoluto è lo stesso ovunque.

## Slide 9: Numeri reali in virgola mobile

Un numero reale si scrive come una coppia: una *mantissa* m e un *esponente* e, tali che x è m per la base elevata a e. È la notazione scientifica del laboratorio di fisica. La virgola è «mobile» perché è l'esponente a dire dove si trova. Poiché lo stesso numero ha infinite coppie di questo tipo, se ne sceglie una con una regola, la *normalizzazione*: la virgola si mette subito dopo la prima cifra significativa, così 346,09801 diventa 3,4609801 con esponente 2.

## Slide 10: Approssimazione: errore assoluto e relativo

In virgola mobile la distanza tra due numeri rappresentabili consecutivi non è costante. Vicino a zero sono vicinissimi; vicino al limite superiore sono molto distanti. L'errore assoluto cresce quindi con la grandezza del numero. Ciò che resta costante è l'errore *relativo*, perché ogni numero ha lo stesso numero di cifre significative: quattro in questo esempio. È l'opposto della virgola fissa, dove l'errore assoluto è costante e quello relativo diventa grande vicino a zero.

## Slide 11: IEEE 754 a singola precisione: 32 bit

Il formato a singola precisione di IEEE 754 divide 32 bit in tre campi: un bit di segno, otto di esponente, ventitré di frazione. Il valore è dato dalla formula al centro. Due dettagli meritano attenzione. Una mantissa binaria normalizzata comincia sempre con 1, quindi quel bit non si memorizza: è il *bit nascosto*, e regala un bit di precisione in più. E l'esponente è memorizzato in eccesso 127, la codifica della sezione precedente, così gli esponenti si confrontano come numeri naturali.

## Slide 12: Esempio svolto: -5,125 in IEEE 754

Un esempio completo: meno 5,125. Si convertono in binario le due parti: 5 è 101 e 0,125 è 0,001, quindi il numero è 101,001. Si normalizza spostando la virgola di due posti: 1,01001 per 2 alla 2. Il bit di segno è 1. Il campo esponente è 2 più 127, 129, cioè 1000 0001. La frazione è 01001 seguita da zeri, senza l'1 iniziale. Mettendo insieme i tre campi e raggruppando a quattro a quattro si ottiene 0xC0A40000. Rifatelo su carta, poi provate con un altro numero.

## Slide 13: IEEE 754 in sintesi

Singola e doppia precisione a confronto. La doppia precisione ha 64 bit, 11 di esponente in eccesso 1023 e 52 di frazione. Due righe vanno ricordate come ordini di grandezza: la singola precisione dà circa 7 cifre decimali significative e arriva a circa 10 alla 38; la doppia ne dà circa 16 e arriva a circa 10 alla 308. I tipi `float` e `double` del linguaggio C sono questi due formati.

## Slide 14: IEEE 754: che cosa significano le configurazioni

Non tutte le configurazioni sono numeri ordinari. Un campo esponente compreso tra i due estremi è un numero normalizzato. Un esponente di tutti zeri significa zero, se anche la frazione è zero, oppure un numero *denormalizzato*, che riempie il vuoto attorno allo zero con precisione decrescente. Un esponente di tutti uni significa infinito, se la frazione è zero, oppure NaN, «non un numero», il risultato di un'operazione non valida come zero diviso zero. Notate che gli zeri sono due, più e meno, e che NaN non è uguale a nulla, nemmeno a se stesso.

## Slide 15: La virgola mobile su RISC-V, e sul vostro kit

RISC-V tratta la virgola mobile con due estensioni facoltative, F per la singola precisione e D per la doppia: aggiungono trentadue registri, da `f0` a `f31`, e istruzioni come `fadd.s`. Il processore del kit, RV32IMAC, non ha né l'una né l'altra. Un programma C può comunque usare `float`, ma ogni operazione diventa la chiamata di una routine software che costa decine o centinaia di istruzioni intere. Per questo i giochi PRG32 usano interi e virgola fissa: sono veloci, abbastanza esatti, e visibili nel debugger.

## Slide 16: Leggere il nome RV32IMAC

Il nome RV32IMAC si può ora leggere lettera per lettera. RV32I è la base: registri a 32 bit e istruzioni intere. M aggiunge moltiplicazione e divisione. A aggiunge le istruzioni atomiche per condividere dati in sicurezza tra task. C aggiunge le codifiche compresse, a 16 bit, delle istruzioni più comuni. F e D, le estensioni in virgola mobile, mancano. Questa modularità è una scelta di progetto di RISC-V: una piccola base obbligatoria ed estensioni facoltative, così che la stessa architettura vada bene per un microcontrollore economico e per un supercalcolatore.

## Slide 17: Verifica la comprensione: Quale codifica con segno mantiene le configurazioni di bit nello stesso ordine dei numeri? / In virgola fissa Q24.8, quale numero reale rappresenta la parola 0x00000180?

Pensate a che cosa fa ciascuna codifica all'ordine. In segno e modulo e nei complementi i numeri negativi hanno il bit più a sinistra a 1, quindi come configurazioni vengono dopo i positivi. Solo una codifica che somma una costante a ogni numero lascia intatto l'ordine.

Q24.8 significa che la parola è il numero moltiplicato per 256. Leggete 0x180 come intero e dividete per 256; oppure spezzatelo direttamente: parte intera 0x01, frazione 0x80, cioè 128/256.

## Slide 18: Verifica la comprensione: Quale numero reale è la configurazione IEEE 754 a singola precisione 0x40400000? / In IEEE 754, un campo esponente di tutti uni con frazione di tutti zeri significa:

Scrivete in binario le prime cifre esadecimali e tagliate i campi: un bit di segno, otto di esponente, poi la frazione. Sottraete 127 dall'esponente, e non dimenticate l'1 nascosto davanti alla frazione.

Tornate alla tabella delle configurazioni speciali. Un esponente di tutti uni è riservato: quale dei suoi due casi ha la frazione di tutti zeri?

## Slide 19: Glossario: inglese e italiano

Dodici termini. In inglese il separatore decimale è il punto, quindi virgola fissa e virgola mobile sono *fixed point* e *floating point*. *Mantissa* è la parola tradizionale per le cifre significative; lo standard chiama *fraction* la parte memorizzata. Il *bit nascosto*, hidden bit, è l'1 iniziale che non si memorizza. I numeri *denormalizzati* si dicono anche subnormali.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Gli interi hanno diverse rappresentazioni, scelte in base all'uso. La virgola fissa memorizza una frazione come intero scalato: errore assoluto costante, velocità degli interi. La virgola mobile memorizza mantissa ed esponente: intervallo enorme, errore relativo costante. IEEE 754 è lo standard universale, con configurazioni speciali per zero, infinito e NaN. E su un processore senza l'estensione F la virgola fissa è la scelta naturale. Ora viene la prima parte di Verm1, dove le ultime quattro lezioni si mettono al lavoro.
