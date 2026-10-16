# Lezione 05: Rappresentazione dei numeri: gli interi

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il complemento a due; i cambi di base; naturali e overflow; shift come moltiplicazione; segno e modulo; istruzioni con o senza segno; l'estensione del segno. DA UTILIZZARE OGGI: le chiamate del runtime PRG32, il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentazione dei numeri: gli interi

Questa lezione avvia la trattazione formale dei numeri. Si apre con una piccola sorpresa sulla macchina, un segnalino che va a sinistra oltre lo zero e mostra FFFFFFFF, e si chiude spiegando esattamente perché accade. In mezzo imparate a convertire tra basi, a dire quali numeri stanno in un dato numero di bit, e a scrivere i numeri negativi. La citazione di Trilussa, l'Uno che discute con lo Zero, ricorda che in un sistema posizionale anche uno zero ha il suo peso.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. I primi tre sono abilità su carta: convertire tra le basi 2, 8, 10 e 16, dire quali naturali stanno in n bit, e codificare in due modi gli interi con segno. Il quarto è aritmetica: sommare, sottrarre e cambiare segno in complemento a due, e riconoscere un overflow. Gli ultimi due tornano alla macchina: spiegare l'FFFFFFFF del riscaldamento, e scegliere l'istruzione RISC-V che legge gli stessi bit come numero con segno o senza segno.

## Slide 3: Sistemi posizionali: basi 2, 8, 10 e 16

Un sistema posizionale in base b usa b cifre, da 0 a b meno 1, e il valore di un numero è la somma di ogni cifra per la potenza di b che corrisponde alla sua posizione: la formula della didascalia. La tabella mostra il tredici in quattro basi: 1101 in binario, 15 in ottale, 13 in decimale, D in esadecimale. È sempre lo stesso numero: cambia solo la scrittura. Per una macchina la base 10 non ha alcuno statuto speciale; è la base di chi ha dieci dita.

## Slide 4: Le basi potenze di due condividono gli stessi bit

Le basi che sono potenze di due condividono gli stessi bit. La slide prende 127, lo scrive in binario, e raggruppa i bit da destra: a quattro a quattro, ogni gruppo è una cifra esadecimale, e si ottiene 7F; a tre a tre, ogni gruppo è una cifra ottale, e si ottiene 177. Non serve alcuna divisione, solo una ricerca in tabella. Due dettagli: si raggruppa sempre da destra, dal lato meno significativo, e il gruppo più a sinistra, se incompleto, si completa con zeri.

## Slide 5: Convertire un intero: divisioni successive

Per convertire un intero dalla base 10 alla base r si divide ripetutamente per r: ogni resto è una cifra, e il quoziente si divide di nuovo finché non diventa zero. Le tre tabelle lo fanno per 127 con r uguale a 8, 16 e 2. Il riquadro giallo contiene il dettaglio che si sbaglia più spesso: il primo resto è la cifra *meno* significativa, quindi i resti si leggono dal basso verso l'alto. Verifica: 177 in ottale è 64 + 56 + 7 = 127.

## Slide 6: Convertire una frazione: moltiplicazioni successive

Per un numero tra 0 e 1 il procedimento è speculare: si moltiplica ripetutamente per r; ogni volta la parte intera del prodotto è una cifra, a partire dalla più significativa, e la parte frazionaria si moltiplica di nuovo. 0,875 dà 0,111 e si ferma, perché la frazione diventa zero. 0,8 non si ferma mai: tornano le stesse frazioni, e le cifre 1100 si ripetono all'infinito. Un numero finito in base dieci può essere periodico in base due, e con un numero finito di bit va troncato. È l'origine degli errori di arrotondamento della Lezione 06.

## Slide 7: Numeri naturali su n bit

Per i numeri naturali la legge è la più semplice possibile: X è x scritto in binario. Con n bit ci sono 2 alla n configurazioni, quindi i numeri vanno da 0 a 2 alla n meno 1: con quattro bit, da 0 a 15, come mostra la striscia. La tabella dà i casi che si incontrano su RISC-V: un byte arriva a 255, una halfword a 65.535, una parola a 4.294.967.295. Quest'ultimo è la lettura senza segno di FFFFFFFF: metà della risposta al riscaldamento.

## Slide 8: Overflow

La definizione da ricordare. Un registro ha un numero finito di bit, quindi rappresenta un sottoinsieme finito di un insieme infinito di numeri. Le operazioni aritmetiche sono chiuse sull'insieme intero, non sul sottoinsieme: la somma di due numeri rappresentabili può cadere fuori. Quando accade si ha un *overflow*. L'esempio usa sette bit, che coprono da 0 a 127: 100 e 38 sono entrambi rappresentabili, e la loro somma, 138, no. L'overflow non è un difetto della macchina: è una conseguenza della finitezza.

## Slide 9: Aritmetica su quattro bit

Quattro calcoli su quattro bit, svolti colonna per colonna come in decimale: 1 più 1 fa 0 con riporto di 1. Sei più otto ci sta. Quattordici più tre fa diciassette, che richiede un quinto bit: un overflow. La differenza usa il prestito come in decimale. Il prodotto di due numeri di n bit può richiedere 2n bit, ed è per questo che RISC-V ha due istruzioni: `mul` per la metà bassa del prodotto e `mulhu` per la metà alta. Rifate a mano i quattro calcoli, coprendo i risultati.

## Slide 10: Segno e modulo

L'idea più naturale: usare il bit più a sinistra per il segno e i bit restanti per il modulo. È facile da leggere per una persona, e ha due difetti. Lo zero ha due rappresentazioni, più zero e meno zero. E l'aritmetica è scomoda: per sommare due numeri di segno opposto il circuito deve confrontare i moduli, sottrarre il minore dal maggiore e scegliere il segno. Una rappresentazione che complica la somma è una legge scadente nel senso della sezione precedente.

## Slide 11: Complemento a due

Il complemento a due. I numeri non negativi sono rappresentati da se stessi. Un numero negativo x è rappresentato da 2 alla n meno il suo modulo: su quattro bit, meno 3 è 16 meno 3, cioè 13, 1101. L'intervallo non è simmetrico: da meno 2 alla n meno 1 fino a 2 alla n meno 1, meno 1, quindi su quattro bit da meno 8 a più 7. Lo zero ha una sola rappresentazione, e il bit più a sinistra vale 1 esattamente quando il numero è negativo. Per un registro a 32 bit l'intervallo va da circa meno due miliardi a più due miliardi.

## Slide 12: Quattro bit, tre letture

Le stesse sedici configurazioni lette in tre modi. Nella tabella di sinistra, dove il bit più a sinistra è 0, le tre letture coincidono. Nella tabella di destra differiscono: 1000 vale 8 senza segno, meno zero in segno e modulo, e meno 8 in complemento a due; 1111 vale 15, meno 7 oppure meno 1. La frase in fondo è la chiave di tutta la lezione: i bit non dicono quale colonna è quella giusta. Lo dice il programma, attraverso le istruzioni che sceglie.

## Slide 13: La ruota dei numeri

Con n bit i numeri formano un cerchio: dopo l'ultima configurazione viene la prima. Sommare 1 sposta di un passo in senso orario. L'anello interno dà il valore senza segno, i dischi esterni il valore in complemento a due. La ruota «si spezza» in due punti diversi. Per la lettura senza segno la rottura è in alto, tra 1111 e 0000: attraversarla è un riporto. Per il complemento a due è in basso, tra 0111 e 1000: attraversarla è un overflow con segno. E un passo indietro da 0000 porta a 1111: è l'FFFFFFFF del riscaldamento.

## Slide 14: Aritmetica in complemento a due

Tre calcoli che mostrano il vantaggio del complemento a due. Per sommare 2 e meno 6 basta sommare le due configurazioni: 0010 più 1010 fa 1100, che si legge meno 4. Per sommare due negativi si sommano le configurazioni e si scarta il riporto uscente dalla posizione più a sinistra. Perfino il prodotto funziona sui quattro bit bassi. La prima riga dell'elenco è il punto: all'addizionatore non serve conoscere i segni. Il circuito che somma i numeri naturali dà già la risposta giusta per quelli con segno.

## Slide 15: Rilevare l'overflow

Gli overflow sono due, e sono indipendenti. Per i numeri senza segno l'overflow è un riporto uscente dal bit più a sinistra: 128 più 130 su otto bit lascia 2 nel registro. Per i numeri con segno l'overflow è un risultato con il segno sbagliato: 127 più 127 non produce riporto uscente, ma la configurazione si legge meno 2. La regola: due operandi positivi che danno una somma negativa, o due negativi che danno una somma positiva. Due operandi di segno opposto non possono mai dare overflow, perché il risultato sta tra i due.

## Slide 16: Estensione del segno: lo stesso numero su più bit

Come si porta un numero su più bit senza cambiarne il valore? In complemento a due si copia il bit di segno in tutte le nuove posizioni: meno 1 su quattro bit, 1111, diventa 1111 1111 su otto; più 5, 0101, diventa 0000 0101. È l'*estensione del segno*. Il processore la esegue ogni volta che un valore corto ne incontra uno lungo: la costante a dodici bit di `addi` viene estesa con segno a trentadue bit, e `lb` estende il segno del byte che carica, mentre `lbu` riempie di zeri.

## Slide 17: Verifica la comprensione: Quale numero rappresenta in complemento a due la configurazione di 8 bit 1111 1100? / Su 8 bit, quale somma produce un overflow con segno?

Il bit più a sinistra vale 1, quindi il numero è negativo: scartate 252, che è la lettura senza segno. Per trovare il modulo si cambia segno: complemento, 0000 0011, e si somma uno, 0000 0100, cioè 4. La configurazione vale meno 4.

Su otto bit in complemento a due l'intervallo va da meno 128 a più 127. Calcolate ogni somma e guardate se cade nell'intervallo. Ricordate che operandi di segno opposto non possono dare overflow, e questo esclude due opzioni in un colpo.

## Slide 18: Verifica la comprensione: t0 contiene 0xFFFFFFFF e t1 contiene 1. Dopo slt t2, t0, t1 e sltu t3, t0, t1: / Come si scrive 0,625 in binario?

Gli stessi due registri, due istruzioni che differiscono per una lettera. `slt` legge FFFFFFFF come meno 1, che è minore di 1. `sltu` lo legge come più di quattro miliardi, che non lo è. Questa domanda è l'intera lezione in una riga.

Usate le moltiplicazioni successive: 0,625 per 2 fa 1,25, cifra 1; 0,25 per 2 fa 0,5, cifra 0; 0,5 per 2 fa 1,0, cifra 1. Verifica con i pesi: un mezzo più un ottavo fa 0,625.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Signed integer* è il *numero relativo*, o *intero con segno*. *Carry* e *borrow* sono il riporto di un'addizione e il prestito di una sottrazione. *Sign extension*, estensione del segno, è l'operazione che allarga un numero con segno. *To clamp* non ha un'unica parola italiana: significa limitare un valore a un intervallo.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Ogni base ha il suo uso: la due per i circuiti, la sedici per le persone che leggono i bit. Con n bit ci sono 2 alla n numeri, e la legge di codifica dice quali. Il complemento a due trasforma la sottrazione in addizione. L'overflow è il prezzo dei registri finiti: lo si rileva, oppure lo si esclude per progetto come con il clamp. E in RISC-V i bit non hanno tipo: sceglie l'istruzione. La prossima lezione completa il quadro con i numeri reali.
