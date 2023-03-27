import MetaMaskOnboarding from "@metamask/onboarding";
import writeValue from "./writeToTheContract";

const onboarding = new MetaMaskOnboarding();

const onboardButton = document.getElementById("onboard");
const accSpan = document.getElementById("account");

let accounts;

const updateButton = () => {
  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    onboardButton.innerText = "Click here to install MetaMask!";
    onboardButton.onclick = () => {
      onboardButton.innerText = "Onboarding in progress";
      onboardButton.disabled = true;
      onboarding.startOnboarding();
    };
  } else if (accounts && accounts.length > 0) {
    onboardButton.innerText = "Connected";
    onboardButton.disabled = false;
    onboarding.stopOnboarding();
    onboardButton.onclick = async () => {
      try {
        const result = await writeValue("Hello World! 0x", accounts);
        console.log(result);
        if (result.code === 4001) {
          alert("User rejected transaction");
        } else if (result.code !== 0) {
          alert(`Transaction failed with error code: ${result.code}`);
        }
      } catch (error) {
        alert(`Transaction failed with error: ${error.message}`);
      }
    };
  } else {
    onboardButton.innerText = "Connect";
    onboardButton.onclick = async () => {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    };
  }
};

window.addEventListener("DOMContentLoaded", () => {
  updateButton();

  if (MetaMaskOnboarding.isMetaMaskInstalled()) {
    window.ethereum.request({ method: "eth_accounts" }).then((accs) => {
      accounts = accs;
      if (accounts.length > 0) {
        accSpan.innerHTML = accounts[0];
      }
      updateButton();
    });

    window.ethereum.on("accountsChanged", (newAccounts) => {
      accounts = newAccounts;
      if (accounts.length > 0) {
        accSpan.innerHTML = accounts[0];
      } else {
        accSpan.innerHTML = "";
      }

      updateButton();
    });
  }
});
