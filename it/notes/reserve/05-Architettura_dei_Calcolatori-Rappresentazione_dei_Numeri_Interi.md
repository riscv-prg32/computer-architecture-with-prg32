# Lezione 05: Rappresentazione dei numeri: gli interi

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Strategie di codifica

Una rappresentazione è una legge, X = R(x), che associa a un numero x una stringa di bit X. Tenete distinte le due lettere per tutta la lezione: x minuscola è il numero che intendiamo, X maiuscola è la configurazione memorizzata nel registro. Tipi diversi di numeri richiedono leggi diverse, e una buona legge è quella che rende somma e confronto facili da realizzare come circuiti. Questo criterio, la semplicità del circuito, deciderà il vincitore tra le rappresentazioni dei numeri con segno.

## La sottrazione è un'addizione.

La conseguenza che conta per l'hardware. Per calcolare y meno x si somma a y il complemento a due di x. Quindi non serve un sottrattore: bastano un addizionatore e un circuito che complementa i bit, e dall'addizione discendono moltiplicazione e divisione. È la ragione ingegneristica della scelta del complemento a due, e l'addizionatore lo vedrete nelle lezioni sulla logica.
