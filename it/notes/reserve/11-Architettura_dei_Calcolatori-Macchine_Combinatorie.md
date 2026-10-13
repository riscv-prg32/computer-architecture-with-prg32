# Lezione 11: Macchine combinatorie

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Progettare una macchina combinatoria

Il progetto di una macchina combinatoria in quattro passi: una specifica a parole; una tabella di verità, con le indifferenze; una minimizzazione, un'uscita alla volta; e una rete di porte o di blocchi standard. È il metodo della Lezione 09. Oltre i quattro o cinque ingressi nessuno disegna più mappe: i progettisti assemblano blocchi già pronti, ed è per questo che la lezione ne è un catalogo. L'analisi procede nel verso opposto, dallo schema alla tabella.

## Il concetto di informazione

Sei parole per parlare di informazione. L'*attributo* è il significato: il voto di un esame. Il *tipo* è l'insieme dei valori possibili: i voti da 18 a 30, e il 30 e lode. Il *valore* è l'elemento effettivamente assunto: 30. La *cardinalità* è il numero di elementi del tipo, qui 14. Poi due distinzioni: lo stesso valore si può scrivere in molti modi, ed è il problema della codifica; e i tipi possono essere semplici o strutturati. Notate che «30 e lode» non è un numero: è un quattordicesimo elemento.

## Alfabeti e stringhe

Un *alfabeto* è un insieme finito e non vuoto di simboli: quello binario ne ha due, quello decimale dieci. Una *stringa*, o parola, è una sequenza finita di simboli di un alfabeto, e la sua lunghezza è il numero dei suoi simboli. La stringa di lunghezza zero è la stringa vuota. L'insieme di tutte le stringhe su un alfabeto S si indica con S asterisco. Una sequenza infinita non è una stringa. Queste definizioni sono la base della teoria dei codici, e più avanti dei linguaggi formali.

## Codici a lunghezza variabile

In un codice *a lunghezza variabile* agli elementi frequenti vanno parole corte e a quelli rari parole lunghe, con risparmio di spazio e di tempo. Chi legge deve comunque sapere dove finisce ogni parola, e lo garantisce la *proprietà del prefisso*: nessuna parola è l'inizio di un'altra. Avete già incontrato due codici di questo tipo: UTF-8, con uno-quattro byte per carattere, e le istruzioni del kit, lunghe 16 o 32 bit. I due bit più bassi di un'istruzione dicono quale: 11 significa 32 bit.

## Comporre decodificatori: da 2-a-4 a 4-a-16

I decodificatori grandi si costruiscono con quelli piccoli. Per selezionare una linea su sedici a partire da quattro bit, un primo decodificatore 2-a-4 guarda i due bit alti e abilita uno di altri quattro decodificatori; tutti e quattro ricevono i due bit bassi, e solo quello abilitato attiva una delle sue linee. Cinque piccoli decodificatori fanno il lavoro. È la composizione modulare, ed è la strategia generale del progetto digitale: risolvere un problema grande con copie della soluzione di uno piccolo.

## Sintesi del segmento a

La sintesi del segmento a con il metodo della Lezione 09. Il segmento è spento solo per le cifre 1 e 4. Le sei parole BCD non usate sono segnate con x. Usando le celle x come 1, quattro grandi gruppi coprono la mappa: le due righe in basso danno A, le due colonne a destra danno C, il quadrato centrale dà BD, e i quattro angoli danno B'D'. Il risultato è a = A + C + BD + B'D'. Senza le indifferenze i gruppi sarebbero più piccoli e l'espressione più lunga. Provate voi il segmento g.

## Trasmissione con controllo di parità

Lo schema completo di una trasmissione con controllo di parità. La sorgente produce una parola; una prima rete di parità calcola il bit di parità e lo accoda; la parola viaggia su un canale dove può essere alterata; una seconda rete verifica la parità e alza un segnale di errore se non torna. La didascalia enuncia con precisione i limiti: un solo bit di parità rileva un numero dispari qualsiasi di bit alterati, non sa dire quale bit è sbagliato, e gli sfugge un numero pari di errori.
