# Kontrola szablonu — 14.10.2026

## Wykonane sprawdzenia

- TypeScript: bez błędów (`npm run typecheck`).
- Sześć testów logiki: wszystkie przeszły. Obejmują czas filmu, brak luk, cięcia i powtórzenia, synchronizację napisów, przerwy oraz nieprawidłowe dane.
- Walidator domyślnej konfiguracji: 1080 × 1920, 30 fps, 540 klatek / 18 s. Wypowiedź 14 s + CTA 4 s.
- Zbudowano produkcyjny bundle Remotion 4.0.535.
- Sprawdzono kompozycję w bezgłowej przeglądarce Chromium. Przechwycono klatki 0, 30, 108, 155, 299, 300, 306, 419, 435, 480, 539. Obejmują hook, napisy, granice cięć, przejście, CTA i ostatnią klatkę.
- Wizualnie sprawdzono hook, napisy i CTA; w odczytanych polach tekstowych nie wykryto przepełnienia poziomego. Polskie znaki i lokalne fonty zostały załadowane.
- Powtórzono kontrolę tych klatek po podmianie tła na lokalny, syntetyczny 24-sekundowy plik WebM z planszą testową i zegarem źródłowym. Walidator potwierdził czas pliku przez ffprobe. Wideo jest dekodowane i przycinane, a napisy wyświetlane na jego tle.
- Do GitHuba trafiają wyłącznie pliki projektu i trzy poglądowe zrzuty proceduralnej demonstracji. Plik testowego wideo, lokalna konfiguracja i wyniki robocze są ignorowane przez Git.

## Zakres i ograniczenia testu

W tym środowisku Remotion Studio i standardowa ścieżka renderera nie mogły wystartować z powodu błędu odczytu interfejsów sieciowych (`uv_interface_addresses`). Dlatego kontrolę wizualną wykonano na zbudowanym bundle w Chromium, sterując klatkami kompozycji. Nie wykonano pełnego eksportu MP4 przez standardowe CLI ani odsłuchu finalnego montażu. Przed pierwszą publikacją należy uruchomić `npm run render` na komputerze produkcyjnym i obejrzeć cały plik z dźwiękiem.

Materiał testowy jest syntetyczny. Nie sprawdzono kadrowania twarzy konkretnego eksperta, zgodności transkrypcji z wypowiedzią ani brzmienia cięć mowy. Wymaga to właściwego nagrania.

## Podgląd wyglądu

| Hook | Napisy | CTA |
| --- | --- | --- |
| ![Hook](docs/hook.jpg) | ![Napisy](docs/captions.jpg) | ![CTA](docs/cta.jpg) |
