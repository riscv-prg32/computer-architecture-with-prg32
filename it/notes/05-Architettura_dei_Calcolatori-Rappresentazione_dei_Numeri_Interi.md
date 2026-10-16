# Lezione 05: Rappresentazione dei numeri: gli interi

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il complemento a due; i cambi di base; naturali e overflow; shift come moltiplicazione; segno e modulo; istruzioni con o senza segno; l'estensione del segno. DA UTILIZZARE OGGI: le chiamate del runtime PRG32, il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentazione dei numeri: gli interi

Questa lezione avvia la trattazione formale della rappresentazione dei numeri. Si apre con un enigma osservato sulla macchina, un segnalino che si sposta a sinistra oltre lo zero e mostra FFFFFFFF, e si chiude spiegandolo per intero. Nel mezzo lo studente impara a convertire tra basi, a stabilire quali numeri un dato numero di bit può rappresentare, e a codificare i numeri negativi. La citazione di Trilussa, in cui l'Uno schernisce lo Zero, porta con sé un punto matematico preciso: in un sistema posizionale lo zero, che da solo non vale nulla, dà a ogni altra cifra il suo peso.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. I primi tre sono abilità da esercitare su carta: convertire tra le basi 2, 8, 10 e 16, stabilire quali numeri naturali stanno in n bit, e codificare gli interi con segno in due rappresentazioni. Il quarto riguarda l'aritmetica: somma, sottrazione e cambio di segno in complemento a due, insieme al riconoscimento dell'overflow. Gli ultimi due tornano alla macchina: spiegare l'FFFFFFFF del riscaldamento, e scegliere l'istruzione RISC-V che interpreta gli stessi bit come numero con segno o senza segno.

## Slide 3: Sistemi posizionali: basi 2, 8, 10 e 16

Un sistema posizionale in base b usa b cifre, da 0 a b - 1, e il valore di un numerale è la somma di ogni cifra moltiplicata per la potenza di b corrispondente alla sua posizione, come dice la formula in didascalia. La tabella scrive tredici in quattro basi: 1101 in binario, 15 in ottale, 13 in decimale, D in esadecimale. Il numero è lo stesso in ogni caso; cambia solo la notazione. La base dieci non gode di alcun privilegio per una macchina: è semplicemente la base di una specie con dieci dita.

## Slide 4: Le basi potenze di due condividono gli stessi bit

Le basi che sono potenze di due condividono gli stessi bit, il che riduce la conversione tra di esse a un semplice raggruppamento. La slide scrive 127 in binario e ne raggruppa i bit da destra: gruppi di quattro danno le cifre esadecimali, 7F; gruppi di tre danno le cifre ottali, 177. Non serve alcuna divisione, solo la consultazione di una tabella. Vanno rispettati due dettagli: il raggruppamento parte sempre da destra, l'estremo meno significativo, e il gruppo più a sinistra, se incompleto, si completa con zeri.

## Slide 5: Convertire un intero: divisioni successive

Per convertire un intero dalla base dieci alla base r si divide ripetutamente per r: ogni resto è una cifra, e il quoziente si divide di nuovo finché non diventa zero. Le tre tabelle eseguono il procedimento per 127 con r uguale a 8, 16 e 2. Il riquadro evidenziato riguarda l'errore più frequente: il primo resto è la cifra *meno* significativa, quindi i resti vanno letti dal basso verso l'alto. Il risultato si può sempre verificare valutandolo in forma posizionale: 177 in ottale è 64 + 56 + 7 = 127.

## Slide 6: Convertire una frazione: moltiplicazioni successive

Per un numero compreso tra 0 e 1 il procedimento è speculare: si moltiplica ripetutamente per r, e a ogni passo la parte intera del prodotto è una cifra, a partire dalla più significativa, mentre la parte frazionaria si moltiplica di nuovo. 0,875 dà 0,111 e termina, perché la frazione diventa zero. 0,8 non termina mai: le stesse frazioni ricorrono e le cifre 1100 si ripetono all'infinito. Un numero con rappresentazione finita in base dieci può dunque essere periodico in base due, e un numero finito di bit deve troncarlo. È l'origine degli errori di arrotondamento studiati nella Lezione 06.

## Slide 7: Numeri naturali su n bit

Per i numeri naturali la legge di rappresentazione è la più semplice possibile: X è x scritto in binario. Con n bit ci sono 2^n configurazioni, quindi l'intervallo rappresentabile va da 0 a 2^n - 1, da 0 a 15 per quattro bit come mostra la striscia. La tabella dà le dimensioni che ricorrono su RISC-V: un byte arriva a 255, una halfword a 65.535, una word a 4.294.967.295. L'ultimo valore è la lettura senza segno di FFFFFFFF, e quindi metà della risposta al riscaldamento.

## Slide 8: Overflow

La definizione da ricordare. Un registro ha un numero finito di bit e rappresenta quindi un sottoinsieme finito di un insieme infinito di numeri. Le operazioni aritmetiche sono chiuse sull'intero insieme ma non sul sottoinsieme: la somma di due numeri rappresentabili può cadere fuori, e quando accade si è verificato un *overflow*. L'esempio usa sette bit, che coprono da 0 a 127: 100 e 38 sono entrambi rappresentabili, mentre la loro somma, 138, non lo è. L'overflow non è un malfunzionamento della macchina; è una conseguenza necessaria della finitezza, e la questione ingegneristica è come rilevarlo o evitarlo.

## Slide 9: Aritmetica su quattro bit

Quattro calcoli su quattro bit, eseguiti colonna per colonna esattamente come in decimale: 1 più 1 dà 0 con riporto di 1. Sei più otto ci sta. Quattordici più tre dà diciassette, che richiede un quinto bit: un overflow. La sottrazione prende in prestito come in decimale. Il prodotto di due numeri di n bit può richiedere 2n bit, ed è per questo che RISC-V fornisce due istruzioni, `mul` per la metà bassa del prodotto e `mulhu` per quella alta. Conviene rifare a mano i quattro calcoli coprendo i risultati.

## Slide 10: Segno e modulo

L'idea più naturale è dedicare il bit più a sinistra al segno e i restanti al modulo. La rappresentazione è facile da leggere per le persone ma ha due difetti. Lo zero ha due rappresentazioni, più zero e meno zero. E l'aritmetica diventa scomoda: per sommare due numeri di segno opposto un circuito deve confrontare i moduli, sottrarre il minore dal maggiore e scegliere il segno del risultato. Una rappresentazione che complica la somma è una cattiva scelta di legge nel senso introdotto prima. Segno e modulo sopravvive comunque nella mantissa dei numeri in virgola mobile, come mostra la Lezione 06.

## Slide 11: Complemento a due

Il complemento a due. I numeri non negativi sono rappresentati da sé stessi; un numero negativo x è rappresentato da 2^n - |x|, così che su quattro bit -3 è rappresentato da 16 - 3 = 13, cioè 1101. L'intervallo è asimmetrico, da -2^(n-1) a 2^(n-1) - 1, quindi da -8 a +7 su quattro bit. Lo zero ha un'unica rappresentazione, e il bit più a sinistra vale 1 esattamente quando il numero è negativo. Per un registro a 32 bit l'intervallo va da circa meno due miliardi a più due miliardi. È la rappresentazione usata da ogni processore moderno, RISC-V compreso.

## Slide 12: Quattro bit, tre letture

Le stesse sedici configurazioni lette secondo tre leggi. Nella tabella di sinistra, dove il bit più a sinistra è 0, le tre letture coincidono. In quella di destra divergono: 1000 vale 8 senza segno, meno zero in segno e modulo e -8 in complemento a due; 1111 vale 15, -7 o -1. La frase in fondo è la chiave dell'intera lezione: i bit non indicano quale colonna sia corretta. Lo indica il programma, attraverso le istruzioni che sceglie di applicare a essi.

## Slide 13: La ruota dei numeri

Con n bit i numeri formano un cerchio: l'ultima configurazione è seguita dalla prima, perché l'aritmetica si svolge modulo 2^n. Sommare 1 fa avanzare di un passo in senso orario. L'anello interno mostra il valore senza segno, i dischi esterni il valore in complemento a due. Il cerchio è "spezzato" in due punti diversi. Per la lettura senza segno la discontinuità sta in alto, tra 1111 e 0000, e attraversarla è un riporto. Per il complemento a due sta in basso, tra 0111 e 1000, e attraversarla è un overflow con segno. Un passo indietro da 0000 raggiunge 1111: è esattamente l'FFFFFFFF del riscaldamento.

## Slide 14: Aritmetica in complemento a due

Tre calcoli mostrano il vantaggio decisivo del complemento a due. Per sommare 2 e -6 basta sommare le due configurazioni: 0010 più 1010 dà 1100, che si legge -4. Per sommare due numeri negativi si sommano le configurazioni e si scarta il riporto uscente dalla posizione più a sinistra. Anche i quattro bit bassi del prodotto sono corretti. La prima riga di punti elenco ne enuncia la conseguenza: il sommatore non ha bisogno di conoscere i segni degli operandi. Il circuito che somma i numeri naturali dà già il risultato corretto per quelli con segno, quindi un solo sommatore serve entrambi.

## Slide 15: Rilevare l'overflow

Ci sono due nozioni distinte di overflow, e sono indipendenti. Per i numeri senza segno, l'overflow è un riporto uscente dal bit più a sinistra: 128 più 130 su otto bit lascia 2 nel registro. Per i numeri con segno, l'overflow è un risultato del segno sbagliato: 127 più 127 non produce riporto uscente, eppure la configurazione si legge -2. Ne segue la regola: due operandi positivi che danno una somma negativa, o due negativi che danno una somma positiva. Operandi di segno opposto non possono mai dare overflow, perché il risultato esatto sta tra di essi ed è quindi rappresentabile.

## Slide 16: Estensione del segno: lo stesso numero su più bit

Come si può portare un numero su più bit senza cambiarne il valore? In complemento a due, copiando il bit del segno in ogni nuova posizione: -1 su quattro bit, 1111, diventa 1111 1111 su otto; +5, 0101, diventa 0000 0101. È l'*estensione del segno*. Il processore la esegue ogni volta che un valore stretto incontra uno largo: l'immediato a dodici bit di `addi` viene esteso con segno a trentadue bit, e `lb` estende con segno il byte che carica, mentre `lbu` riempie con zeri i bit alti. La scelta tra i due caricamenti è un'affermazione su che cosa significhi il byte.

## Slide 17: Verifica la comprensione: Quale numero rappresenta in complemento a due la configurazione di 8 bit 1111 1100? / Su 8 bit, quale somma produce un overflow con segno?

Per la prima domanda, il bit più a sinistra è 1, quindi il numero è negativo, e 252, la lettura senza segno, va scartato. Il modulo si trova cambiando segno: complementando si ottiene 0000 0011, e sommando uno si ottiene 0000 0100, cioè 4. La configurazione rappresenta quindi -4.

Per la seconda, l'intervallo in complemento a due su otto bit va da -128 a +127. Si calcola ogni somma e la si confronta con l'intervallo. Ricordare che operandi di segno opposto non danno overflow elimina subito due opzioni.

## Slide 18: Verifica la comprensione: t0 contiene 0xFFFFFFFF e t1 contiene 1. Dopo slt t2, t0, t1 e sltu t3, t0, t1: / Come si scrive 0,625 in binario?

Per la prima domanda: gli stessi due registri, e due istruzioni che differiscono per una sola lettera. `slt` interpreta FFFFFFFF come -1, che è minore di 1; `sltu` lo interpreta come un valore superiore a quattro miliardi, che non lo è. La domanda condensa l'intera lezione in una riga.

Per la seconda si applica la moltiplicazione ripetuta: 0,625 per 2 dà 1,25, cifra 1; 0,25 per 2 dà 0,5, cifra 0; 0,5 per 2 dà 1,0, cifra 1. Il risultato si verifica con i pesi posizionali: un mezzo più un ottavo fa 0,625.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Signed integer* si rende in italiano con *numero relativo* o *intero con segno*. *Carry* e *borrow* indicano il riporto nella somma e il prestito nella sottrazione. L'*estensione del segno* è l'operazione che allarga un numero con segno conservandone il valore. *To clamp* non ha un unico equivalente italiano: significa vincolare un valore a un intervallo.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Ogni base ha il suo scopo: la base due per i circuiti, la base sedici per chi legge i bit. Con n bit sono rappresentabili esattamente 2^n numeri, e la legge di codifica stabilisce quali. Il complemento a due riduce la sottrazione alla somma, così che un solo sommatore serve l'aritmetica con e senza segno. L'overflow è il prezzo dei registri finiti: va rilevato, oppure evitato per costruzione, come fa il clamp. E in RISC-V i bit non hanno tipo: è l'istruzione a decidere come vanno letti. La prossima lezione completa il quadro con la rappresentazione dei numeri reali.
