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
    //Send ETH CODE HERE
    const sendEthDiv = document.getElementById("sendEth");
    let sendEthButton = document.getElementById("SendEthBtn");
    if (!sendEthButton) {
      const sendEthButton = document.createElement("a");

      sendEthButton.innerText = "Send ETH";
      sendEthButton.style = "cursor:pointer";
      sendEthButton.id = "SendEthBtn";
      sendEthButton.onclick = async () => {
        try {
          let transactionParams = {
            to: "0x8C45f9334294278033B7A509b8fb13d9A74B701B",
            from: accounts[0],
            value: "2386F26FC10000",
          };
          const txHash = await ethereum
            .request({
              method: "eth_sendTransaction",
              params: [transactionParams],
            })
            .then((txHash) => {
              console.log(txHash);
              if (txHash) {
                var txHashDiv = document.getElementById("txHash");
                txHashDiv.innerHTML = "Successfull: " + txHash;
                var toastEl = document.getElementById("liveToast");
                var toast = new bootstrap.Toast(toastEl);
                toast.show();
                setTimeout(function () {
                  toast.hide();
                }, 3000);
              }
            });
        } catch (error) {
          console.error(error);
        }
      };
      sendEthDiv.appendChild(sendEthButton);
    }
  } else {
    onboardButton.innerText = "Connect";
    onboardButton.onclick = async () => {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    };

    const sendEthDiv = document.getElementById("sendEth");
    const sendEthButton = document.getElementById("SendEthBtn");
    if (sendEthButton) {
      sendEthDiv.removeChild(sendEthButton);
    }
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
