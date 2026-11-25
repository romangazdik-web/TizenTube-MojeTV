/* Nymind TV / TizenTube navigation safety v5.
 * Disabled double-BACK shortcut entirely. Back must always reach TizenTube
 * as an ordinary remote event, even if pressed repeatedly in quick succession.
 * Returning to Nymind TV is intentional via the Samsung Home/TizenBrew menu.
 * This ES5 shim intentionally registers no keyboard listeners.
 */
(function () {
  'use strict';
  window.NymindYoutubeBackSafe = true;
}());
