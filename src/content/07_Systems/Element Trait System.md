---
id: Systems_element_trait_system
title: Element Trait System
category: Systems
aliases: Element Traits, Element Affinity, Element Imbue System, Element System
editedAt: 2026-01-03T13:44:49.687Z
updatedAt: 2026-01-01T15:38:13.674Z
createdAt: 2026-01-01T15:38:13.674Z
---

# ElementTraitSystem

# General
- Kategorie: Core Systems 
- Status: Grundmechanik 
- Gültigkeit: Gesamtes Spiel

---

## Kurzbeschreibung

**Elemente als zusätzliche Traits (nicht als Klassen/Subklassen, nicht als Nationen-System)**

Das ElementTraitSystem führt **Element-Affinitäten** als frei wählbare **Traits** ein.
Ein Element ist kein eigenes „Klassen-Kit“, sondern ein **Augment-Layer**:  
Es verändert Optik und Verhalten ausgewählter Angriffe/Skills (Imbue), erzeugt **Status-Effekte** und schafft eine klare Logik für **Stärken/Schwächen** (RPS).

**Ziel:** Mehr taktische Tiefe durch Matchups und proccende Effekte, ohne dass die Klassenbalance durch Subklassen zerfällt.

---

## Designziele

- **Klar & merkbar:** 4 Basis-Elemente als Einstieg (Fire/Water/Earth/Air)
- **Modular:** Erweiterbar um Advanced-Elemente (z. B. Lightning, Ice, Crystal), ohne Systembruch
- **Balance-sicher:** Kein Perma-Freeze/Perma-Stun → Caps + interne Cooldowns
- **Klassen bleiben Kern:** Klasse bestimmt Moveset; Element bestimmt Augment (Status/Optik/Proc)
- **Inhalte profitieren:** Dungeons, Pets, Gegner und Items können Element-Tags tragen

---

## Begriffe (Definitionen)

- **Element Trait / Affinity:** Gewähltes Element eines Charakters (z. B. Fire)
- **Imbue / Infuse:** Elementare „Einfärbung“ für ausgewählte Angriffe/Skills (Optik + Proc)
- **Status:** Über Zeit aufgebauter Effekt (Stacks) mit klaren Trigger-Regeln
- **Vulnerability / Advantage:** Ziel ist anfälliger (mehr Effektstärke / mehr Status-Aufbau)
- **Resist / Disadvantage:** Ziel ist widerstandsfähiger (weniger Effektstärke / weniger Status-Aufbau)
- **Hard Control:** Root/Freeze/Knockdown/Interrupt (stark) → streng limitiert
- **Soft Control:** Slow/Accuracy-Down/Armor-Down/DoT (weicher) → weniger limitiert

---

## Grundregeln (MVP)

- Jeder Charakter hat **1 Element-Slot**.
- Ein Element besteht immer aus:
  1) **Passive** (kleiner, dauerhafter Bonus)
  2) **Imbue** (Optik + Proc auf ausgewählten Attacken/Skills)
  3) **Status-Effekt** (Stacks + Trigger)
- Elemente sind **frei wählbar** (keine harten Klassenverbote).
- Gegner, Dungeons, Pets etc. können **Element-Tags** haben → Resist/Vulnerability + Status-Interaktionen.

---

## Slot-Erweiterung (Später: 2 Slots)

**Jetzt (MVP):**
- 1 Slot aktiv (Main Element)

**Später (Upgrade):**
- Slot 1 = **Main Element** (Passive + Imbue + Status)
- Slot 2 = **Secondary Element** (nur Passive + Resist, kein voller Status-Loop)

**Wichtige Regeln für Slot 2 (um Chaos zu vermeiden):**
- Es ist immer nur **1 Imbue aktiv** (Main Element).
- Slot 2 kann optional nur „kleine“ Zusatzeffekte haben (Endgame), aber:
  - keine zweite Hard-Control-Kette
  - keine zweite „Stack-Engine“ parallel

---

## Status-Framework (Caps & Counterplay)

Damit PvP/PvE spielbar bleibt, hat das System klare Default-Grenzen:

### Standardwerte (MVP Defaults)
- **Stack Limit:** 5
- **Trigger Threshold:** bei 3 Stacks
- **Hard Control ICD:** 8 Sekunden  
  (Freeze/Root/Knockdown/Interrupt)

### Verhalten bei aktivem ICD
Wenn das Hard-Control-ICD aktiv ist, wird der Trigger **automatisch** zu einem Soft-Effekt:
- statt Root/Freeze → zusätzlicher Slow / extra Stack-Druck
- statt Knockdown → zusätzlicher Armor-Shred / Stagger-Resist-Down
- statt Interrupt → Accuracy/Focus-Down / kürzere „Flinch“-Variante

### Cleanse / Gegenmaßnahmen (Prinzip)
- Cleanse entfernt z. B. **2 Stacks** (tunable)
- Movement/Resists reduzieren die Wirkung von Slow/Disrupt
- RPS-Resists reduzieren Status-Aufbau (nicht nur Damage)

**Wichtig:** Kein Element soll „unfair“ sein. Jedes Element braucht Counterplay.

---

## Stärken & Schwächen (RPS)

MVP nutzt einen einfachen 4er-Kreis:

- **Fire > Earth**
- **Earth > Air**
- **Air > Water**
- **Water > Fire**

### Default-Werte (tunable)
- Advantage (Vulnerability): **+15%** Effektstärke / Status-Application
- Disadvantage (Resist): **-15%** Effektstärke / Status-Application

Hinweis:
- Diese Werte betreffen primär **Status-Aufbau & elementare Procs**.
- Reiner Grundschaden einer Klasse wird nicht „komplett umgebogen“, damit Klassenbalance stabil bleibt.

---

## Die 4 Basis-Elemente (MVP Überblick)

> Detailwerte der einzelnen Elemente werden später auf eigenen Trait-Seiten dokumentiert  
> (z. B. Traits/Fire, Traits/Water, …).  
> Hier steht bewusst nur die **System-Übersicht**.

### Fire (Druck / DoT)
- Kernidee: **Burn** (DoT) + aggressives Tempo
- Typischer Nutzen: Zermürbung, Damage-Pressure, schnelle Kills auf schwache Ziele
- Hard Control: **keine** (Fire ist bewusst „Damage/Pressure“)

### Water (Tempo brechen / Control)
- Kernidee: **Chill** (Slow-Stacks) → kurzer Root/Freeze als Trigger (limitiert)
- Typischer Nutzen: Kontrolle, Gegner verlangsamen, Stabilität
- Advanced später: **Ice** als Variante/Upgrade

### Earth (Tank / Break)
- Kernidee: **Crack** (Armor/Guard/Poise-Down) → kurzer Stagger/Knockdown (limitiert)
- Typischer Nutzen: „Frontline“-Augment, Rüstung brechen, Gegner „festnageln“
- Advanced später: **Crystal/Metal/Sand** als Varianten

### Air (Mobility / Disrupt)
- Kernidee: **Disrupt** (Focus/Accuracy/Control-Resist-Down) → kurzer Flinch/Interrupt-lite (limitiert)
- Typischer Nutzen: Mobility, Cast-Pressure, „hit and run“
- Advanced später: **Lightning** als Variante/Upgrade

---

## Imbue-Regeln (Wie das Element auf Skills wirkt)

### Was Imbue macht (immer)
- Optik: Waffen/Fäuste/Skill-VFX zeigen das Element
- Mechanik: Proc-Chance auf Status-Stack (oder elementare Zusatzwirkung)

### Was Imbue nicht machen soll (MVP)
- keine komplette Skill-Neuerfindung
- keine „100% Status pro Hit“ Standard (sonst Stunlock-Fallen)

### Beispiel-Logik (abstrakt)
- Ein Skill hat: Base Damage + optional Imbue-Proc
- Imbue-Proc:
  - Chance auf +1 Stack
  - Trigger bei 3 Stacks (mit ICD Regeln)

---

## Einbindung in 2D / 3D Dual-Mode

Das ElementTraitSystem ist **mode-agnostisch**:
- Es funktioniert in **2D (Turn-Based)** und **3D (Skill-Based)** identisch auf Regel-Ebene.
- Unterschied ist nur, **wann** „Hits“ stattfinden.

### 2D (Turn-Based)
- Pro Aktion/Skill wird „Hit“ oder „Multi-Hit“ definiert.
- Imbue-Procs werden pro Hit ausgewertet, aber:
  - Multi-Hit Skills haben oft reduzierte Proc-Chance (Balancing)
- Status-Ticks laufen pro „Turn“ oder pro definierte Zeiteinheit (je nach Kampfsystem).

### 3D (Skill-Based)
- Pro Treffer / pro Projektil / pro Kontaktframe wird „Hit“ definiert (Engine-abhängig).
- Um Exploits zu vermeiden:
  - pro Skill kann ein „Proc Cap“ gelten (z. B. max 1 Stack pro Skill-Use)
  - Hard-Control bleibt über ICD stabil

---

## Klassen & Spezies (Rollenverteilung)

### Grundsatz
- Klassen definieren **Kit & Identität** (Moveset, Ressourcen, Rolle).
- Elemente definieren **Augment & Spezialisierung** (Status/Proc/Matchup).

### Keine harten Verbote (MVP)
- Jede Klasse darf jedes Element wählen.
- Optional später: „Favored Elements“ als Mini-Bonus (5–10%), aber nicht als Lock.

### Spezies
- Spezies kann optional Start-Tendenzen haben (Flavor), aber Element bleibt Trait-Wahl.
- Keine Spezies soll „gefesselt“ sein, damit Builds möglich bleiben.

---

## Erweiterungen: Advanced-Elemente (später)

Advanced-Elemente sind Ableitungen der Basis-Elemente, nicht „neues System“:

- Fire → Lava / Ash / Heat
- Water → Ice / Mist
- Earth → Crystal / Metal / Sand
- Air → Lightning / Storm

Regelvorschlag:
- Advanced-Element = gleiche Slot-Regeln + gleiche Caps/ICD
- Advanced bekommt **1 Twist**, z. B.:
  - Lightning: Chain/Arc statt normaler Disrupt-Logik
  - Ice: stärkeres Chill, aber härteres ICD / weniger Damage
  - Crystal: mehr Resist, aber langsamere Stack-Application

---

## UI/UX (Wiki- & Game-Darstellung)

### Im Wiki
- Systemseite erklärt:
  - Slots, RPS, Caps/ICD, Imbue-Prinzip
- Traitseiten erklären:
  - Passive, Status, Trigger, Counterplay, Visual Notes
- Status-Effektseiten (optional) erklären:
  - Burn/Chill/Crack/Disrupt als eigenständige Effekte

### Im Spiel (später)
- Charakterprofil zeigt:
  - Element Icon + Kurztext (Passive/Status)
- Tooltip zeigt:
  - Stack Limit, Trigger Threshold, ICD
- Gegner/Dungeon zeigt:
  - Element Tag + Resist/Vulnerability Hinweis

---

## Balancing-Notes (MVP Leitplanken)

- Elemente dürfen **spürbar** sein, aber nicht „wichtiger als Klasse“.
- Hard Control ist **immer** limitiert (ICD + Stacks + Proc Caps).
- Multi-Hit Skills brauchen klare Proc-Regeln, sonst eskaliert Status-Aufbau.
- RPS wirkt primär auf Status-Tempo/Proc-Stärke, nicht nur auf rohen Damage.

---

## Verlinkung / Unterseiten (geplant)

Traits:
- Fire (Trait)
- Water (Trait)
- Earth (Trait)
- Air (Trait)

Status Effects:
- Burn
- Chill
- Crack
- Disrupt

System:
- Dual-Mode System (2D/3D)
- ElementTraitSystem (diese Seite)

---
