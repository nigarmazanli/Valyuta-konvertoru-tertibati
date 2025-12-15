document.addEventListener("DOMContentLoaded", () => {

  const API_KEY = "e6228eabcb2da11cd6cac56706e9897d";

  const boxes = document.querySelectorAll(".box");
  const leftBox = boxes[0];
  const rightBox = boxes[1];

  const leftInput = leftBox.querySelector("input");
  const rightInput = rightBox.querySelector("input");

  const leftTabs = leftBox.querySelectorAll(".tab");
  const rightTabs = rightBox.querySelectorAll(".tab");

  const leftRateText = leftBox.querySelector("span");
  const rightRateText = rightBox.querySelector("span");

  const offlineMessage = document.getElementById("offline-message");

  let leftCurrency = "RUB";
  let rightCurrency = "USD";
  let rate = 1;
  let lastChanged = "left";


  leftInput.value = "100";
  loadRate();

  
  async function loadRate() {
    if (leftCurrency === rightCurrency) {
      rate = 1;
      updateValues();
      return;
    }

    if (!navigator.onLine) {
      offlineMessage.classList.remove("hidden");
      return;
    } else {
      offlineMessage.classList.add("hidden");
    }

    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${leftCurrency}/${rightCurrency}`
      );

      const data = await res.json();
      if (data.result !== "success") throw new Error();
      rate = data.conversion_rate;
      updateValues();
    } catch {
      offlineMessage.classList.remove("hidden");
    }
  }

  function updateValues() {
    const leftVal = parseFloat(leftInput.value) || 0;
    const rightVal = parseFloat(rightInput.value) || 0;

    if (lastChanged === "left") {
      rightInput.value = (leftVal * rate).toFixed(4);
    } else {
      leftInput.value = (rightVal / rate).toFixed(4);
    }

    leftRateText.textContent =
      `1 ${leftCurrency} = ${rate.toFixed(4)} ${rightCurrency}`;

    rightRateText.textContent =
      `1 ${rightCurrency} = ${(1 / rate).toFixed(4)} ${leftCurrency}`;
  }

  function normalize(v) {
    return v.replace(",", ".").replace(/[^0-9.]/g, "");
  }

  leftInput.addEventListener("input", () => {
    leftInput.value = normalize(leftInput.value);
    lastChanged = "left";
    loadRate();
  });

  rightInput.addEventListener("input", () => {
    rightInput.value = normalize(rightInput.value);
    lastChanged = "right";
    loadRate();
  });

  leftTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      leftTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      leftCurrency = tab.textContent.trim();
      lastChanged = "left";
      loadRate();
    });
  });

  rightTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      rightTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      rightCurrency = tab.textContent.trim();
      lastChanged = "left";
      loadRate();
    });
  });

});


