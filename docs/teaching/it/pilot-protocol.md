# Sperimentazione in aula: Lezioni da 02 a 05

Un protocollo per capire, con dati reali, se la riprogettazione pensata per chi parte da zero aiuta. Finché non sarà
svolto, ogni affermazione sull'apprendimento è **NON VERIFICATA: richiede dati raccolti in aula**.

## Domande

1. Gli studenti che partono da zero raggiungono i risultati delle Lezioni 02-05 (in `roadmaps.md`)?
2. Quali concetti restano poco chiari dopo la lezione (gli errori tipici di `rubrics.md`)?
3. Gli studenti percepiscono obiettivi chiari, prerequisiti adeguati e collegamenti chiari (questionario lampo)?

## Strumenti

| Quando | Strumento | Tempo |
| --- | --- | --- |
| Inizio della Lezione 02 | **Verifica iniziale**: le due domande del biglietto d'uscita della Lezione 02 e la domanda A04.1, senza preavviso e senza voto | 5 min |
| Fine di ciascuna delle Lezioni 02-05 | **Biglietto d'uscita** della lezione (`exit-tickets.md`) | 3 min |
| Fine di ciascuna delle Lezioni 02-05 | **Questionario lampo** (`pulse-survey.md`) | 2 min |
| Fine di ogni lezione, facoltativo | **Sforzo percepito**: "Quanto sforzo mentale ha richiesto la lezione di oggi?" da 1 (pochissimo) a 9 (moltissimo) | 1 min |
| Inizio della Lezione 06 | **Verifica finale**: le stesse domande della verifica iniziale, più A05.1 e A05.2 | 8 min |

## Correzione

Correggere ogni risposta con la griglia di `rubrics.md`: **2** giusta e motivata, **1** in parte giusta, **0** sbagliata o
vuota. Registrare anche se la risposta mostra l'errore tipico indicato nella griglia. Due persone correggano in modo
indipendente un campione di 20 risposte e confrontino; si discutano i disaccordi e si precisi la lettura della griglia
prima di correggere il resto.

## Registrazione, riservatezza e consenso

- Raccogliere i fogli senza nomi. Se le verifiche iniziale e finale vanno appaiate, gli studenti scrivono su entrambe uno
  pseudonimo a loro scelta; la chiave non viene mai raccolta.
- Registrare solo conteggi per domanda: numero di 0, 1, 2 e di ogni errore tipico; per il questionario, i conteggi di ogni valore.
- Dire prima alla classe che cosa si raccoglie, perché, e che partecipare non ha alcun effetto sul voto. Chiunque può consegnare un foglio in bianco.
- Conservare i conteggi, non i fogli; distruggere i fogli una volta contati. Verificare con l'ateneo se lo studio richiede
  un parere etico o un'informativa formale (GDPR) prima di pubblicare qualsiasi risultato fuori dal corso.

## Analisi

- Per ogni prova: la proporzione di 2, 1, 0 e dell'errore tipico principale; per le domande iniziali e finali, la variazione
  della proporzione di risposte corrette.
- Per il questionario: la mediana e la distribuzione di ogni affermazione, per lezione.
- Leggere le risposte libere e raggrupparle per tema.

**Avvertenze.** Una classe, un anno, nessun gruppo di controllo: una differenza tra verifica iniziale e finale non si può
attribuire alla sola riprogettazione (gli studenti studiano anche da soli, frequentano il laboratorio e usano altro
materiale). Con gruppi piccoli le proporzioni sono instabili: sotto le 30 risposte riportare conteggi, non percentuali.
Da questa sperimentazione non si deve affermare alcuna significatività statistica.

## Griglia di decisione: che cosa cambiare

| Osservazione | Soglia (suggerita) | Azione |
| --- | --- | --- |
| Una prova del biglietto d'uscita ha risposta giusta (2) da meno della metà | < 50 % | Riprendere il concetto all'inizio della lezione successiva con un nuovo esempio svolto; verificare che la slide che lo insegna abbia il suo punto di controllo |
| Un errore tipico compare in più di un quarto delle risposte | > 25 % | Aggiungere una slide o una nota che nomina l'errore e mostra perché non funziona; aggiungerlo al punto di controllo |
| Indirizzo e valore sono ancora confusi alla verifica finale (punto di controllo 2 della 02, domanda su `la`/`lw`) | > 25 % sbagliate | Aggiungere un secondo esercizio di traccia alla Lezione 04 o 05 con un array; riusare il disegno con le due frecce |
| L'affermazione 1 (obiettivi) ha mediana 3 o meno | ≤ 3 | Leggere ad alta voce il percorso all'inizio e tornarci alla fine |
| L'affermazione 2 (prerequisiti) ha mediana 3 o meno | ≤ 3 | Indicare *Partire da zero* e il glossario prima della lezione; controllare il primo uso dei termini della lezione |
| Sforzo percepito sopra 7 per la maggior parte degli studenti | > 7 | Dividere la lezione: spostare un argomento DA UTILIZZARE OGGI nella presentazione del codice o nella lezione successiva |

Registrare ogni decisione e la sua ragione in `docs/audit`, così che l'iterazione successiva possa confrontare.
