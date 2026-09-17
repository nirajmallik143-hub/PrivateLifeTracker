const installButton = document.getElementById("installButton");
const localNote = document.getElementById("localNote");
const saveStatus = document.getElementById("saveStatus");

const NOTE_KEY = "private-life-tracker-note";
let deferredPrompt = null;

if (localNote instanceof HTMLTextAreaElement) {
  localNote.value = localStorage.getItem(NOTE_KEY) || "";

  localNote.addEventListener("input", () => {
    localStorage.setItem(NOTE_KEY, localNote.value);
    if (saveStatus) {
      saveStatus.textContent = "Saved only on this device.";
    }
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  if (installButton instanceof HTMLButtonElement) {
    installButton.hidden = false;
  }
});

if (installButton instanceof HTMLButtonElement) {
  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installButton.hidden = true;
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
