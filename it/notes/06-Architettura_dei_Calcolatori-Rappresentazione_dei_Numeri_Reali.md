# Lezione 06: Rappresentazione dei numeri: i reali

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: la virgola fissa; complemento a uno ed eccesso k; la virgola mobile IEEE 754; il nome RV32IMAC. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) rappresentare un numero reale in virgola fissa e calcolarci con le istruzioni intere; (2) decodificare un numero IEEE 754 in precisione singola; (3) leggere il nome RV32IMAC e dire che cosa il kit sa e non sa calcolare in hardware. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 07, Verm1, parte 1: una testa che attraversa il mondo.

Il filo della lezione: Senza l'estensione F, le frazioni sono interi con una scala concordata: Verm1 muoverà la testa di frazioni di cella proprio così. Prossimo passo: la prima parte del progetto.

## Slide 1: Rappresentazione dei numeri: i reali

La lezione precedente ha trattato gli interi; questa tratta i numeri con una parte frazionaria. Comincia da un problema ingegneristico concreto: una pallina deve muoversi di meno di un pixel per frame, su un processore privo di istruzioni per i numeri reali. La prima soluzione, la virgola fissa, non usa nulla al di là dell'aritmetica intera già compresa. La virgola mobile emerge poi come soluzione generale, insieme allo standard a cui si conforma sostanzialmente ogni calcolatore, IEEE 754. La lezione è quindi organizzata come una progressione da un vincolo specifico a una teoria generale, e di nuovo al vincolo.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Due ulteriori codifiche degli interi con segno, il complemento a uno e l'eccesso k, completano la lezione precedente e sono prerequisiti della virgola mobile. Segue la rappresentazione in virgola fissa, che il progetto del corso userà. Poi la virgola mobile: mantissa, esponente e normalizzazione, codifica e decodifica in precisione singola, e le configurazioni speciali. L'ultimo risultato riguarda il kit dello studente: il suo processore non ha istruzioni in virgola mobile, e lo studente deve saper spiegare che cosa fanno invece i programmi, e perché.

## Slide 3: Complemento a uno

In complemento a uno un numero negativo si ottiene invertendo ogni bit del suo corrispondente positivo: 6 è 0110, -6 è 1001. Il cambio di segno non potrebbe essere più semplice. Il costo è quello già pagato da segno e modulo: lo zero ha due rappresentazioni, 0000 e 1111, e l'intervallo è simmetrico, da -7 a +7 su quattro bit. L'istruzione RISC-V `not` calcola esattamente il complemento a uno di un registro, e la lezione precedente ha mostrato che sommandogli 1 si ottiene il complemento a due.

## Slide 4: Aritmetica in complemento a uno

La somma in complemento a uno usa un normale sommatore binario con una correzione: quando un riporto esce dalla posizione più significativa, al risultato va sommato 1, un'operazione nota come *riporto circolare*. Il primo esempio non richiede correzione; nel secondo e nel terzo il riporto uscente viene riportato in fondo e sommato. Questo passo in più, insieme al doppio zero, spiega perché nel progetto delle unità aritmetiche si è affermato il complemento a due, in cui il riporto uscente si scarta semplicemente.

## Slide 5: Rappresentazione in eccesso k (polarizzata)

Nella rappresentazione in eccesso k ogni numero è spostato verso l'alto di una costante: X = x + k. Con quattro bit e k = 8, la configurazione 0000 indica -8, 1000 indica zero e 1111 indica +7. La sua proprietà preziosa è la conservazione dell'ordine: un numero più grande ha sempre una configurazione più grande, quindi due valori con segno si possono confrontare come se fossero numeri naturali. L'aritmetica è meno comoda, perché ogni somma va corretta sottraendo k. È proprio la codifica dell'esponente nei formati in virgola mobile, dove il confronto rapido conta più della somma comoda.

## Slide 6: Quattro bit, cinque letture

La tabella della Lezione 05, estesa di due colonne: le stesse sedici configurazioni lette senza segno, in segno e modulo, in complemento a uno, in complemento a due e in eccesso 8. Tre osservazioni. Segno e modulo e complemento a uno hanno ciascuno due zeri, evidenziati. Complemento a due ed eccesso 8 coprono lo stesso intervallo, da -8 a +7, e differiscono solo nel bit più a sinistra. E l'eccesso 8 è l'unica colonna in cui i valori crescono monotonamente dall'alto al basso della tabella, che è la proprietà di conservazione dell'ordine in forma visiva.

## Slide 7: Numeri in virgola fissa

In virgola fissa la parte intera e la parte frazionaria occupano posizioni adiacenti in una parola, e la posizione della virgola binaria è fissa. Non è memorizzata da nessuna parte: è una convenzione nota al programma. Se si riservano f bit alla frazione, la parola contiene il numero moltiplicato per 2^f, e il più piccolo incremento rappresentabile, la *risoluzione*, è 2^-f. La notazione Qm.f specifica la divisione dei bit: Q24.8 indica 24 bit interi e 8 bit frazionari. L'aritmetica è l'ordinaria aritmetica intera, con un riscalamento solo dove un prodotto o un quoziente lo richiedono.

## Slide 8: Numeri razionali: l'errore di approssimazione

I numeri reali sono densi: tra due qualsiasi ce ne sono infiniti altri, quindi con un numero finito di bit la maggior parte di essi non si può rappresentare, e ciascuno viene sostituito dal suo vicino rappresentabile più prossimo. In Q24.8 il numero 0,1 diventa 26/256, circa 0,1016. L'errore non supera mai metà della risoluzione. Un valore abbastanza vicino a zero si arrotonda a zero, il che è l'*underflow*, ed è il motivo per cui una velocità di 0,001 pixel per frame lascerebbe la pallina immobile. In virgola fissa il limite dell'errore assoluto è lo stesso su tutto l'intervallo.

## Slide 9: Numeri reali in virgola mobile

Un numero reale si rappresenta come una coppia: una *mantissa* m e un *esponente* e, tali che x sia uguale a m moltiplicato per la base elevata a e. È la notazione scientifica del laboratorio di fisica, e la virgola "galleggia" perché è l'esponente a determinarne la posizione. Poiché lo stesso numero ammette infinite coppie di questo tipo, se ne sceglie una canonica con la *normalizzazione*: la virgola si colloca subito dopo la prima cifra significativa, così che 346,09801 diventa 3,4609801 con esponente 2. La normalizzazione garantisce l'unicità e massimizza il numero di cifre significative conservate.

## Slide 10: Approssimazione: errore assoluto e relativo

In virgola mobile la distanza tra numeri rappresentabili consecutivi non è uniforme: è molto fine vicino a zero e grossolana vicino al limite superiore dell'intervallo. L'errore assoluto cresce quindi con il modulo del numero. Ciò che resta approssimativamente costante è l'errore *relativo*, perché ogni numero porta lo stesso numero di cifre significative, quattro in questo esempio. La virgola fissa mostra il comportamento opposto: errore assoluto costante, con un errore relativo che diventa grande vicino a zero. La scelta tra le due è una scelta su quale errore conti per l'applicazione.

## Slide 11: IEEE 754 a singola precisione: 32 bit

Il formato IEEE 754 in precisione singola divide 32 bit in tre campi: un bit di segno, otto bit di esponente e ventitré bit di frazione, con il valore dato dalla formula al centro. Due decisioni di progetto meritano attenzione. Una mantissa binaria normalizzata comincia sempre con 1, quindi quel bit non va memorizzato: è il *bit nascosto*, che dà gratis un bit di precisione in più. E l'esponente è memorizzato in eccesso 127, la codifica della sezione precedente, così che numeri in virgola mobile dello stesso segno si possono confrontare come numeri naturali.

## Slide 12: Esempio svolto: -5,125 in IEEE 754

Un esempio svolto completo: -5,125. Parte intera e parte frazionaria si convertono separatamente: 5 è 101 e 0,125 è 0,001, quindi il numero è 101,001. La normalizzazione sposta la virgola di due posti: 1,01001 per 2^2. Il bit di segno è 1. Il campo esponente è 2 + 127 = 129, cioè 1000 0001. Il campo frazione è 01001 seguito da zeri, senza l'1 iniziale. Concatenando i tre campi e raggruppando a quattro bit si ottiene 0xC0A40000. L'esempio va riprodotto su carta e poi ripetuto con un numero scelto da sé.

## Slide 13: IEEE 754 in sintesi

Precisione singola e doppia a confronto. La precisione doppia usa 64 bit, con 11 bit di esponente in eccesso 1023 e 52 bit di frazione. Due righe valgono come ordini di grandezza da ricordare: la precisione singola offre circa 7 cifre decimali significative e un intervallo che arriva a circa 10^38; la doppia circa 16 cifre e un intervallo che arriva a circa 10^308. I tipi C `float` e `double` corrispondono a questi due formati praticamente su ogni piattaforma moderna.

## Slide 14: IEEE 754: che cosa significano le configurazioni

Non ogni configurazione codifica un numero ordinario. Un campo esponente strettamente compreso tra i suoi estremi indica un numero normalizzato. Un esponente tutto a zero indica lo zero, se anche la frazione è zero, oppure un numero *denormalizzato*, che riempie il vuoto attorno allo zero con precisione gradualmente decrescente. Un esponente tutto a uno indica l'infinito, se la frazione è zero, oppure NaN, "not a number", il risultato di un'operazione non valida come zero diviso zero. Due conseguenze sono controintuitive e vanno notate: ci sono due zeri, positivo e negativo, e NaN risulta diverso da tutto, sé stesso compreso.

## Slide 15: La virgola mobile su RISC-V, e sul vostro kit

RISC-V supporta la virgola mobile con due estensioni facoltative, F per la precisione singola e D per la doppia, che aggiungono trentadue registri, da `f0` a `f31`, e istruzioni come `fadd.s`. Il processore del kit, RV32IMAC, non implementa né l'una né l'altra. Un programma C può comunque usare `float`, ma ogni operazione viene allora compilata come chiamata a una routine software che costa decine o centinaia di istruzioni intere. È per questo che i giochi PRG32 usano interi e virgola fissa: sono veloci, sufficientemente precisi per lo scopo e trasparenti nel debugger.

## Slide 16: Leggere il nome RV32IMAC

Il nome RV32IMAC si può ora leggere lettera per lettera. RV32I è la base: registri a 32 bit e le istruzioni intere. M aggiunge moltiplicazione e divisione. A aggiunge le istruzioni atomiche, per la condivisione sicura di dati tra attività concorrenti. C aggiunge codifiche compresse a 16 bit delle istruzioni più frequenti. F e D, le estensioni in virgola mobile, sono assenti. Questa modularità è un principio di progetto centrale di RISC-V: una piccola base obbligatoria ed estensioni facoltative, così che la stessa architettura possa servire un microcontrollore economico e un supercalcolatore.

## Slide 17: Verifica la comprensione: Quale codifica con segno mantiene le configurazioni di bit nello stesso ordine dei numeri? / In virgola fissa Q24.8, quale numero reale rappresenta la parola 0x00000180?

Per la prima domanda conviene considerare che cosa fa ogni codifica all'ordinamento. In segno e modulo e in entrambi i complementi i numeri negativi hanno un 1 a sinistra e quindi, letti come configurazioni, seguono quelli positivi. Solo una codifica che somma una costante a ogni numero conserva l'ordine.

Per la seconda, Q24.8 significa che la parola contiene il numero moltiplicato per 256. 0x180 si legge come intero e si divide per 256; in alternativa lo si divide direttamente in parte intera 0x01 e frazione 0x80, cioè 128/256.

## Slide 18: Verifica la comprensione: Quale numero reale è la configurazione IEEE 754 a singola precisione 0x40400000? / In IEEE 754, un campo esponente di tutti uni con frazione di tutti zeri significa:

Per la prima domanda le prime cifre esadecimali si scrivono in binario e si separano i campi: un bit di segno, otto bit di esponente, poi la frazione. Dall'esponente si sottrae la polarizzazione di 127, e davanti alla frazione si ripristina l'1 nascosto.

Per la seconda va consultata la tabella delle configurazioni speciali. Un esponente tutto a uno è riservato; la domanda è quale dei suoi due casi abbia una frazione tutta a zero.

## Slide 19: Glossario: inglese e italiano

Dodici termini. In italiano il separatore decimale è la virgola, quindi *fixed point* e *floating point* diventano *virgola fissa* e *virgola mobile*. *Mantissa* è il termine tradizionale per le cifre significative; lo standard chiama la parte memorizzata *frazione*. Il *bit nascosto* è l'1 iniziale non memorizzato. I numeri *denormalizzati* si dicono anche subnormali.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Gli interi ammettono più rappresentazioni, scelte secondo l'uso. La virgola fissa memorizza una frazione come intero scalato, con errore assoluto costante e la velocità dell'aritmetica intera. La virgola mobile memorizza mantissa ed esponente, con un intervallo enorme ed errore relativo approssimativamente costante. IEEE 754 è lo standard universale, con configurazioni speciali per lo zero, l'infinito e NaN. Su un processore privo dell'estensione F, la virgola fissa è la scelta naturale. La prossima lezione è la prima parte di Verm1, in cui il contenuto delle ultime quattro lezioni viene messo al lavoro.
