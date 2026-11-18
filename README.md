# TizenTube – Moje TV (testovací modul)

Experimentální **oddělený** modul pro TizenBrew. Vezme oficiální `@foxreis/tizentube@1.15.2` z npm, zachová jeho `dist/service.js` a k `dist/userScript.js` připojí náš JavaScript pro dvojité stisknutí tlačítka Zpět. **Na TV zatím neověřeno!**

## Instalace na GitHub

1. Vytvoř nový **Public** repozitář pod účtem `romangazdik-web` s názvem `TizenTube-MojeTV` a bez vytvoření README.
2. Rozbal ZIP, otevři jeho složku `tizentube-mojeTV-test` a na GitHub přes **uploading an existing file** nahraj soubory **`package.json`, `home-shortcut.js`, `README.md` a složku `.github`**. Nahraj obsah složky, ne složku samotnou.
3. Klikni **Commit changes**. GitHub Actions automaticky provede sestavení. V kartě **Actions** sleduj zelené potvrzení `Sestavit TizenTube pro Moje TV`. Při chybě `Permission denied` v GitHubu nastav Settings → Actions → General → Workflow permissions → Read and write permissions a spusť workflow znovu.
4. Zkontroluj, že v repozitáři vznikla složka `dist` obsahující `userScript.js` a `service.js`.
5. V TV otevři TizenBrew a přidej **Add GitHub Module**: `romangazdik-web/TizenTube-MojeTV`. Není třeba nic instalovat z ZIPu do TV. Pokud máš autolaunch Moje TV, při spuštění TizenBrew ihned drž šipku nahoru pro jeho přeskočení.
6. Z Moje TV → **Další aplikace** otevři **TizenTube – Moje TV TEST**. Nejprve otestuj **1× Zpět** (navigace) a pak **2× rychle Zpět** (Moje TV).

Původní `npm/@foxreis/tizentube` a funkční StremioK nemaž a neměň autolaunch. Pokud se nové TizenTube nespustí, používej původní.

## Omezení

- TizenTube je **mods** modul, ne HTML aplikace. Nelze na něj použít stejný `index.html` postup jako u StremioK.
- Dvojklik ve skriptu oddaluje jediné Zpět asi o 520 ms a opakuje jej syntetickou klávesou. YouTube toto opakování může ignorovat, zejména při přehrávání. Jestli nefunguje 1× Zpět, test hned ukonči a vrať se k původnímu TizenTube.
- Obě verze obsahují stejnou původní službu; **neotevírej je současně**. Mohou vzniknout konflikty při spuštění služby. Při problémech novou testovací verzi odeber.
- Sestavení na GitHub Actions vyžaduje přístup k npm. Nezávisí na nepřetržitém běhu tvého počítače.
- Zdroj TizenTube: https://github.com/reisxd/TizenTube, autor Reis Can, GPL-3.0-only; nová testovací verze je založena na npm 1.15.2. Skript pro dvojklik je vlastní experimentální úprava.
