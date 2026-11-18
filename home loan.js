const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(Number.isFinite(value) ? value : 0);

const loanAmount = document.getElementById("loanAmount");
const tenure = document.getElementById("tenure");
const rate = document.getElementById("rate");
const income = document.getElementById("income");
const deductions = document.getElementById("deductions");

function calculateEMI() {
  const principal = Math.max(0, Number(loanAmount.value) || 0);
  const years = Math.max(1, Number(tenure.value) || 1);
  const annualRate = Math.max(0, Number(rate.value) || 0);
  const monthlyRate = annualRate / 1200;
  const months = years * 12;
  let emi;

  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = principal * monthlyRate * factor / (factor - 1);
  }

  const total = emi * months;
  const interest = Math.max(0, total - principal);
  const netIncome = Math.max(0, (Number(income.value) || 0) - (Number(deductions.value) || 0));
  const interestShare = total > 0 ? (interest / total) * 100 : 0;

  document.getElementById("loanAmountOutput").textContent = money(principal);
  document.getElementById("tenureOutput").textContent = `${years} ${years === 1 ? "year" : "years"}`;
  document.getElementById("totalRepayment").textContent = money(total);
  document.getElementById("principalLegend").textContent = money(principal);
  document.getElementById("interestLegend").textContent = money(interest);
  document.getElementById("monthlyEmi").textContent = money(emi);
  document.getElementById("emiNote").textContent = `For a ${years}-year loan at ${annualRate.toFixed(2)}% p.a.`;
  document.getElementById("rateCallout").textContent = `${annualRate.toFixed(2)}% p.a.`;
  document.getElementById("totalInterest").textContent = money(interest);
  document.getElementById("netIncome").textContent = money(netIncome);
  document.getElementById("donut").style.background =
    `conic-gradient(var(--orange) 0 ${interestShare}%, var(--blue) ${interestShare}% 100%)`;
}

[loanAmount, tenure, rate, income, deductions].forEach((input) => {
  input.addEventListener("input", calculateEMI);
});
calculateEMI();

const tabs = [...document.querySelectorAll(".tab")];
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.add("hidden"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});


const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "✕" : "☰";
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});


const productGrid = document.getElementById("productGrid");
document.getElementById("nextProducts").addEventListener("click", () => {
  productGrid.append(productGrid.firstElementChild);
});
document.getElementById("prevProducts").addEventListener("click", () => {
  productGrid.prepend(productGrid.lastElementChild);
});


document.querySelectorAll('a[href="#eligibilityPanel"], a[href="#chargesPanel"], a[href="#documentsPanel"]').forEach((link) => {
  link.addEventListener("click", () => {
    const panelId = link.getAttribute("href").slice(1);
    const matchingTab = document.querySelector(`.tab[data-tab="${panelId}"]`);
    if (matchingTab) matchingTab.click();
  });
});
