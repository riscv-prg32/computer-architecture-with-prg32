# Lezione 09: Elementi di algebra di Boole

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Tabelle di verità

Una tabella di verità definisce una funzione elencandone il valore per ogni combinazione degli ingressi. Con n variabili ha 2 alla n righe, scritte nell'ordine del conteggio: 000, 001, 010 e così via. La tabella a destra definisce la funzione F che vi accompagna per tutta la lezione: vale 1 nelle righe 3, 4, 5, 6 e 7. La scriverete in forma canonica, la minimizzerete con l'algebra, e poi di nuovo con una mappa di Karnaugh, e confronterete i risultati.

## Forme elementari: funzioni di livello 2

Due forme standard di espressione, entrambe a due livelli di porte. Tipo P, la *somma di prodotti*: clausole unite da OR, realizzata con uno strato di porte AND che alimentano una porta OR. Tipo S, il *prodotto di somme*: fattori uniti da AND, realizzato con uno strato di porte OR che alimentano una porta AND. Ogni funzione si può scrivere in entrambe le forme. Tenete a mente le due sigle inglesi, SOP e POS: le troverete in ogni libro.

## Lo scopo della minimizzazione

Minimizzare significa trovare, tra tutte le forme a due livelli di una funzione, una con le porte più piccole e in numero minore: costo più basso, meno consumo, un circuito più veloce. Esistono tre metodi. Le mappe di Karnaugh sono grafiche e pratiche fino a quattro o cinque variabili: sono il metodo di questo corso. Il metodo di Quine è algebrico, e quello di McCluskey è tabellare e adatto a un programma: insieme sono gli antenati degli strumenti che oggi progettano i chip veri.

## Una mappa di due variabili

L'esempio più piccolo. F vale 1 in tre celle. Il gruppo rosso copre la riga in cui A vale 1: al suo interno B assume entrambi i valori, quindi B sparisce e la clausola è A. Il gruppo viola copre la colonna in cui B vale 1: A cambia, quindi la clausola è B. Il risultato è F = A + B: la funzione era semplicemente OR. Notate che la cella AB appartiene a entrambi i gruppi: usare due volte un 1 è permesso, perché x + x = x.
