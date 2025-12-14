let leftCurrency = "RUB";
let rightCurrency = "USD";

async function convertFromLeft() {
  const amount = Number(leftInput.value.replace(",", "."));
  if (isNaN(amount)) return;

  if (leftCurrency === rightCurrency) {
    rightInput.value = amount;
    return;
  }

  try {
    error.classList.add("hidden");

    const res = await fetch(
      `https://api.exchangerate.host/latest?base=${leftCurrency}&symbols=${rightCurrency}`
    );

    if (!res.ok) throw new Error();

    const data = await res.json();
    const rate = data.rates[rightCurrency];

    rightInput.value = (amount * rate).toFixed(4);

  } catch {
    error.classList.remove("hidden");
  }
}

document.querySelectorAll(".right .tab").forEach(btn => {
  btn.addEventListener("click", () => {
    rightCurrency = btn.textContent;

    document
      .querySelectorAll(".right .tab")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    convertFromLeft(); // YENİ VALYUTA İLƏ HESABLA
  });
});

async function convertFromRight() {
  const amount = Number(rightInput.value.replace(",", "."));
  if (isNaN(amount)) return;

  if (leftCurrency === rightCurrency) {
    leftInput.value = amount;
    return;
  }

  try {
    error.classList.add("hidden");

    const res = await fetch(
      `https://api.exchangerate.host/latest?base=${rightCurrency}&symbols=${leftCurrency}`
    );

    if (!res.ok) throw new Error();

    const data = await res.json();
    const rate = data.rates[leftCurrency];

    leftInput.value = (amount * rate).toFixed(4);

  } catch {
    error.classList.remove("hidden");
  }
}

