# ILT · Szablon rolek

Uniwersalny projekt Remotion do filmów eksperckich na Facebooka i Instagram. **1080 × 1920, 9:16, 30 fps.** Domyślnie uruchamia 18-sekundową demonstrację z autorską abstrakcyjną animacją, bez nagrania ani lektora.

## Pierwsze uruchomienie

Wymagany Node.js 22+ i npm. Dla walidacji własnych nagrań także FFmpeg/ffprobe w PATH.

```sh
npm ci
npm start
```

Otwórz adres wypisany przez terminal i wybierz **ILT-Reel**. Pierwszy eksport może wymagać pobrania Chrome Headless Shell przez Remotion. Fonty Montserrat i League Spartan są dostarczane lokalnie z zależnościami npm; render nie pobiera ich z Google.

## Kolejna rolka — bez edycji komponentów

1. Skopiuj nagranie do `public/media/ekspert.mp4` (pozostaje na Twoim komputerze).
2. Otwórz **`config/reel.json`**. Ustaw `source` na `media/ekspert.mp4` oraz faktyczną długość w `sourceDurationSeconds`. Puste `source` uruchamia demonstrację.
3. Podmień `hook`, `speaker`, `role`, `topic` i trzy teksty w `cta`. Opcjonalnie wskaż `logo`, np. `media/logo-ilt.png`. Bez pliku używany jest podpis typograficzny, nie oficjalny znak graficzny.
4. Ustaw `clips`: początek i koniec każdego fragmentu w **sekundach oryginalnego nagrania**. Kolejność tablicy jest kolejnością montażu. Możesz powtórzyć najmocniejszą wypowiedź na początku jako hook. Pierwszy fragment musi trwać przynajmniej tyle, ile `hookSeconds` (maks. 3 s).
5. Podmień całą tablicę `captions` na napisy do swojego nagrania. Czas napisów jest w **milisekundach oryginalnego pliku**; po cięciu, powtórzeniu lub przestawieniu fragmentu szablon przelicza go automatycznie. Nie aktualizuj czasów do osi finalnego filmu.
6. Uruchom `npm run validate`, obejrzyj podgląd z dźwiękiem. Sprawdź nazwiska, treść, łamanie wierszy, kadr twarzy i CTA. Wyłącz `showSafeArea`.
7. `npm run render` zapisze `out/ilt-reel.mp4` (H.264, yuv420p, CRF 18). `npm run still` zapisze klatkę z hookiem w `out/cover.png`.

`config/reel.json` jest trwałym źródłem ustawień. Panel Props w Studio pozwala eksperymentować z polami; zapisuj zaakceptowane zmiany w JSON. Nie korzystaj z przeciągania wygenerowanych fragmentów jako sposobu zapisania montażu — oś jest generowana z konfiguracji.

## Co zawiera szablon

- Hook od pierwszej klatki, maks. 3 s; podczas hooka dolne napisy są ukryte, aby nie powielać tekstu.
- Montaż fragmentów bez luk. Domyślnie twarde cięcia wypowiedzi; opcjonalny krótki `dip` obrazu na granicy ujęć. Dźwięk nie nakłada się między fragmentami.
- Delikatne zoomy (`zoomFrom` → `zoomTo`, zakres 1–1.12) i punkt kadrowania (`focusX`, `focusY`, 0–100%).
- Animowane strony napisów: do 5 elementów / ok. 38 znaków, akcent bieżącego słowa w kolorze #c79a68; alternatywnie `phrase` z jednolitym tekstem.
- Podpis eksperta po hooku; osobna końcówka CTA, 3–8 s.
- Paleta ILT: #172121, #c79a68, #f2edeb, biel. Nagłówki League Spartan, pozostały tekst Montserrat.
- Pomocniczy obszar bezpieczny: 80 px z lewej, 160 px z prawej, 180 px od góry, 320 px od dołu. To zapas projektowy, nie gwarancja zgodności z każdym wariantem interfejsu platformy. Sprawdź podgląd publikacji w Meta.

Dla naturalnego rytmu tnij w przerwach między zdaniami. `dip` przyciemnia obraz przez 9 klatek; nie usuwa trzasków ani nie miksuje dźwięku. Transkrypcja, wykrywanie ciszy, czyszczenie audio i weryfikacja merytoryczna pozostają osobnymi etapami. Muzyka nie jest dodawana automatycznie.

## Napisy — format

Format zgodny z typem `Caption` z `@remotion/captions`. Dla podświetlania słów dodaj osobny element na słowo, w kolejności czasu. Dla napisów zdaniowych ustaw `captionsStyle` na `phrase` i dziel długie zdania na krótkie frazy. Nie umieszczaj całego akapitu w jednym elemencie. Limit 80 znaków na element jest granicą techniczną, zalecane są znacznie krótsze frazy.

```json
{
  "text": " decyzja.",
  "startMs": 3400,
  "endMs": 3900,
  "timestampMs": null,
  "confidence": null,
  "pageBreakAfter": true
}
```

`pageBreakAfter` wymusza koniec strony. Przerwy ponad 250 ms rozdzielają strony, żeby napis nie pozostawał na długiej pauzie. Niepoprawne czasy i nakładanie elementów blokują kompozycję. Szablon nie wykonuje automatycznej transkrypcji.

## Osobne warianty konfiguracji

Skopiuj konfigurację np. do `config/local-webinar.json` (pliki `local*.json` są ignorowane przez Git), a następnie:

```sh
npm run validate -- config/local-webinar.json
npx remotion studio src/index.ts --props=config/local-webinar.json
npx remotion render src/index.ts ILT-Reel out/webinar.mp4 --props=config/local-webinar.json
```

Przy eksporcie własnego wariantu uruchom jego walidację przed renderem. Długość kompozycji = suma zaokrąglonych do klatek fragmentów + CTA. Nie trzeba ręcznie zmieniać `durationInFrames` w kodzie.

## Kontrola projektu

```sh
npm run check
npm run validate
```

Testy sprawdzają m.in. czas filmu, powtarzanie i przestawianie ujęć, przycinanie napisów na granicach, przerwy w napisach i odrzucanie błędnych danych. Pełny przebieg sprawdzenia tej wersji opisuje `QA.md`.

## Pliki i prywatność

Nagrania, audio, eksporty i lokalne konfiguracje są wyłączone przez `.gitignore`. Nie dodawaj ich z `git add -f`. Repozytorium zawiera kod, demonstrację proceduralną i neutralną konfigurację; nie ma w nim surowych nagrań ekspertów ani danych klientów. Gitignore nie usuwa plików wcześniej dodanych do historii — sprawdzaj `git status` przed commitem.

## Licencje zależności

Warunki użycia Remotion: https://www.remotion.dev/license. Przed produkcyjnym użyciem w firmie sprawdź plan odpowiedni dla organizacji. Fonty Fontsource zawierają własne pliki licencji OFL w zainstalowanych pakietach. Nie dołączono muzyki ani materiałów stockowych wymagających osobnych licencji.
