# I tre stati di apprendimento: guida in una pagina

Ogni slide che insegna o usa un concetto porta un'etichetta sopra il titolo. L'etichetta ha sempre tre segnali, così che
si possa leggere in bianco e nero e da chi non distingue i colori: una **scritta**, un'**icona** e un **colore con una barra**.

| Etichetta | Icona e barra | Significa | Lo studente sa |
| --- | --- | --- | --- |
| **DA COMPRENDERE OGGI** | libro aperto, barra piena, blu | questa lezione spiega il concetto e lo verifica | spiegarlo, tracciarlo, applicarlo a un caso nuovo |
| **DA UTILIZZARE OGGI** | chiave inglese, barra doppia, ambra | lo usate oggi seguendo una ricetta; l'interno arriva dopo (l'etichetta nomina la lezione) o mai | usarlo correttamente, e dire a che cosa serve |
| **DA COMPRENDERE PIÙ AVANTI** | orologio, barra punteggiata, viola | un'anteprima: l'etichetta nomina la lezione che lo spiega | riconoscerne il nome e lo scopo |

Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Che cosa dire, la prima volta (Lezione 00 o 01)

> "In molte slide vedrete una di tre etichette. *Da comprendere oggi* significa che alla fine di oggi dovreste saperlo
> spiegare, e il biglietto d'uscita ve lo chiederà. *Da utilizzare oggi* significa: usatelo come uno strumento, seguite i
> passi, non preoccupatevi ancora di come funziona dentro; l'etichetta vi dice quale lezione lo aprirà. *Da comprendere più
> avanti* è un'anteprima: ricordatene il nome; l'etichetta vi dice quando ci torneremo. Se vi sentite persi su una slide
> *da utilizzare oggi* o *da comprendere più avanti*, siete esattamente dove dovete essere."

## Che cosa dire durante una lezione

- Su una slide **DA UTILIZZARE OGGI**: "Oggi lo usiamo soltanto. Quale lezione lo spiega? Leggete l'etichetta." Non
  entrare nei dettagli interni, anche se richiesto: scrivere la domanda alla lavagna, con la lezione che risponderà.
- Su una slide **DA COMPRENDERE PIÙ AVANTI**: "Annotate il nome; lo ritroverete nella Lezione NN."
- Su una slide **DA COMPRENDERE OGGI**: "Questo è per oggi. Vi chiederò di spiegarlo."

## Come evolve uno stato

Di solito un concetto passa da *più avanti* o *da utilizzare oggi* a *da comprendere oggi* nella sua lezione formale, e
poi ricompare come *da utilizzare oggi* nelle lezioni successive, come uno strumento ormai capito. Per esempio `ra` e lo
stack si usano nella Lezione 02 (il passo 2 salva `ra`), si richiamano nelle Lezioni 07 e 12 (i ponti) e si spiegano
nella Lezione 18. Il registro (`tools/concepts/registry.json`) registra per ogni concetto la prima lezione, il primo uso e
la lezione formale; `tools/concepts/coverage.md` mostra l'intera progressione.

## Tre cose che le etichette non sono

- Non sono una classifica di importanza: uno strumento *da utilizzare oggi* può contare quanto un concetto.
- Non sono la promessa di un esame facile: ciò che è *da comprendere oggi* viene valutato.
- Non sono un motivo per saltare una slide: *più avanti* significa comunque *guardatela ora*.
