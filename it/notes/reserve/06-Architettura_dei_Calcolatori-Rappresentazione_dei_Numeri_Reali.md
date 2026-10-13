# Lezione 06: Rappresentazione dei numeri: i reali

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Esempio: l'intervallo di un piccolo formato decimale

Un piccolo formato decimale, con quattro cifre di mantissa e due di esponente, per vedere la forma dell'insieme rappresentabile. Le due fasce con la scritta *rappresentabile* sono i numeri che si possono scrivere in questo formato: da circa 10 alla meno 99 fino a circa 10 alla 99, con entrambi i segni. Alle due estremità c'è l'*overflow*: il modulo è troppo grande per l'esponente. Al centro, attorno allo zero, c'è un vuoto, la regione dell'*underflow*: i numeri troppo piccoli in modulo collassano a zero. La virgola mobile binaria ha esattamente questa forma.

## Oltre singola e doppia

La storia non è finita. La mezza precisione usa sedici bit, con circa tre cifre decimali. Conta perché le reti neurali contengono miliardi di numeri, e dimezzare ciascuno dimezza memoria ed energia. Molti modelli vanno oltre e memorizzano i propri numeri come interi a 8 bit con un fattore di scala: di nuovo virgola fissa, su scala industriale. L'ultimo riquadro enuncia la lezione generale: i bit sono un bilancio, e intervallo, precisione e costo tirano in direzioni diverse.
