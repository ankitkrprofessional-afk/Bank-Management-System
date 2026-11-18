(() => {
  "use strict";
  const GOLD_RATE_22K = 13368;
  const LOAN_TO_VALUE = 0.75;
  const rowsRoot = document.getElementById("jewelleryRows");
  const amountOutput = document.getElementById("eligibleAmount");
  const interestOutput = document.getElementById("interestPayable");
  const totalOutput = document.getElementById("amountPayable");
  const rateInput = document.getElementById("interestRate");
  const rateOutput = document.getElementById("interestRateOutput");
  const tenureInputs = [...document.querySelectorAll('input[name="tenure"]')];
  const numberFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
  const moneyFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const formatMoney = (amount) => "₹ " + moneyFormat.format(Math.max(0, Math.round(amount || 0)));
  const formatWeight = (weight) => numberFormat.format(weight || 0) + " g";

  function makeJewelleryRow(index) {
    const row = document.createElement("div");
    row.className = "jewellery-row";
    row.innerHTML = '<span class="row-index">' + index + '</span>' +
      '<label class="sr-only">Carat for ornament ' + index + '</label>' +
      '<select class="carat-input" aria-label="Carat for ornament ' + index + '">' +
      '<option value="18" selected>18 Carat</option><option value="20">20 Carat</option>' +
      '<option value="22">22 Carat</option><option value="24">24 Carat</option></select>' +
      '<label class="sr-only">Net weight in grams for ornament ' + index + '</label>' +
      '<input class="weight-input" type="number" inputmode="decimal" min="0" step="0.01" placeholder="Weight (in grams)" aria-label="Net weight in grams for ornament ' + index + '">' +
      '<output class="adjusted-weight">—</output>' +
      '<button class="remove-row" type="button" aria-label="Remove ornament ' + index + '" title="Remove ornament">×</button>';
    return row;
  }

  function addJewelleryRow() {
    rowsRoot.append(makeJewelleryRow(rowsRoot.children.length + 1));
    updateCalculator();
    rowsRoot.lastElementChild.querySelector(".weight-input").focus();
  }

  function updateCalculator() {
    let totalWeight = 0;
    let adjustedWeight = 0;
    [...rowsRoot.children].forEach((row, index) => {
      const carat = Number(row.querySelector(".carat-input").value) || 18;
      const weight = Math.max(0, Number(row.querySelector(".weight-input").value) || 0);
      const adjusted = weight * (carat / 22);
      row.querySelector(".row-index").textContent = String(index + 1);
      row.querySelector(".adjusted-weight").textContent = weight ? formatWeight(adjusted) : "—";
      row.querySelector(".remove-row").setAttribute("aria-label", "Remove ornament " + (index + 1));
      row.querySelector(".carat-input").setAttribute("aria-label", "Carat for ornament " + (index + 1));
      row.querySelector(".weight-input").setAttribute("aria-label", "Net weight in grams for ornament " + (index + 1));
      totalWeight += weight;
      adjustedWeight += adjusted;
    });
    const principal = Math.round(adjustedWeight * GOLD_RATE_22K * LOAN_TO_VALUE);
    const annualRate = Number(rateInput.value) || 0;
    const months = Number(document.querySelector('input[name="tenure"]:checked')?.value) || 6;
    const interest = principal * (annualRate / 100) * (months / 12);
    document.getElementById("totalWeight").textContent = formatWeight(totalWeight);
    document.getElementById("totalAdjusted").textContent = formatWeight(adjustedWeight);
    document.getElementById("weightStatus").textContent = totalWeight ? "Based on entered net weight" : "Add your gold weight";
    amountOutput.textContent = formatMoney(principal);
    interestOutput.textContent = formatMoney(interest);
    totalOutput.textContent = formatMoney(principal + interest);
    rateOutput.textContent = annualRate.toFixed(2) + "% p.a.";
    document.getElementById("interestMeta").textContent = "@ " + annualRate.toFixed(2) + "% p.a. for " + months + " " + (months === 1 ? "month" : "months");
    document.querySelectorAll(".tenure-choice").forEach((choice) => {
      choice.classList.toggle("active", choice.querySelector("input").checked);
    });
  }

  document.getElementById("addJewellery").addEventListener("click", addJewelleryRow);
  rowsRoot.addEventListener("input", updateCalculator);
  rowsRoot.addEventListener("change", updateCalculator);
  rowsRoot.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-row");
    if (!removeButton) return;
    if (rowsRoot.children.length === 1) rowsRoot.querySelector(".weight-input").value = "";
    else removeButton.closest(".jewellery-row").remove();
    updateCalculator();
  });
  rateInput.addEventListener("input", updateCalculator);
  tenureInputs.forEach((input) => input.addEventListener("change", updateCalculator));
  rowsRoot.append(makeJewelleryRow(1));
  updateCalculator();

  document.getElementById("leadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const feedback = document.getElementById("leadFeedback");

    // Gather gold loan details from calculator
    const name = form.elements.name.value;
    const mobile = form.elements.mobile.value;
    const weightText = document.getElementById("totalAdjusted").textContent;
    const weight = parseFloat(weightText) || 0;
    const eligibleAmount = parseFloat(amountOutput.textContent.replace(/[^\d.]/g, "")) || 0;
    const rate = parseFloat(rateInput.value) || 10.96;
    const tenureMonths = Number(document.querySelector('input[name="tenure"]:checked')?.value) || 6;
    const totalInterest = parseFloat(interestOutput.textContent.replace(/[^\d.]/g, "")) || 0;
    const totalPayable = parseFloat(totalOutput.textContent.replace(/[^\d.]/g, "")) || 0;

    try {
      const res = await fetch("http://localhost:8080/api/loan/gold/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, weight, eligibleAmount, rate, tenureMonths, totalInterest, totalPayable })
      });
      const data = await res.json();
      feedback.textContent = data.message || (data.success ? "Gold loan application saved to MySQL database successfully!" : "Application failed.");
      feedback.classList.add("submitted");
    } catch (err) {
      feedback.textContent = "Error connecting to Java backend server at localhost:8080.";
    }
  });
})();
