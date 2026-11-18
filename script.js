const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const modal = document.getElementById("infoModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

const dialogScrollPositions = new WeakMap();
function showDialogAtCurrentPosition(dialog) {
  dialogScrollPositions.set(dialog, window.scrollY);
  dialog.showModal();
}

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    const savedScrollY = dialogScrollPositions.get(dialog);
    if (savedScrollY === undefined) return;
    requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, savedScrollY);
      requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

function openInfo(title, message) {
  modalTitle.textContent = title;
  modalText.textContent = message;
  if (typeof modal.showModal === "function") {
    showDialogAtCurrentPosition(modal);
  } else {
    window.alert(`${title}\n\n${message}`);
  }
}

const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginFeedback = document.getElementById("loginFeedback");
const authModeToggle = document.getElementById("authModeToggle");
let isSignUp = false;

function setAuthMode(signUp) {
  isSignUp = signUp;
  loginForm.reset();
  loginFeedback.textContent = "";
  loginModal.classList.toggle("signup-mode", signUp);
  document.getElementById("loginCredentials").hidden = signUp;
  document.getElementById("signupFields").hidden = !signUp;
  document.getElementById("loginKicker").textContent = signUp ? "CREATE YOUR PROFILE" : "ONLINE BANKING";
  document.getElementById("loginTitle").textContent = signUp ? "Register to Stark Bank management system" : "Welcome back";
  document.querySelector(".login-subtitle").textContent = signUp
    ? "Complete your details to request a Stark account."
    : "Sign in to access your accounts and services.";
  loginForm.querySelectorAll("#loginCredentials [data-required]").forEach((field) => {
    field.required = !signUp;
  });
  loginForm.querySelectorAll("#signupFields [data-required]").forEach((field) => {
    field.required = signUp;
  });
document.getElementById("forgotPassword").hidden = signUp;
  document.getElementById("loginSubmit").innerHTML = signUp
    ? 'Submit registration <span aria-hidden="true">→</span>'
    : 'Sign in <span aria-hidden="true">→</span>';
  authModeToggle.innerHTML = signUp
    ? 'Already have an account? <strong>Sign in</strong>'
    : 'New to Stark? <strong>Sign up</strong>';
  document.getElementById("loginHelpText").textContent = signUp
    ? "Questions about opening an account?"
    : "Need help signing in?";
}

const loginBtn = document.getElementById("loginBtn");
let currentUserName = "";
loginBtn.addEventListener("click", () => {
  const name = prompt("Enter your name to sign in:", currentUserName || "Ankit Kumar");
  if (name && name.trim()) {
    currentUserName = name.trim();
    loginBtn.textContent = `Welcome, ${currentUserName}`;
  }
});
authModeToggle.addEventListener("click", () => setAuthMode(!isSignUp));
document.getElementById("loginClose").addEventListener("click", () => loginModal.close());
loginModal.addEventListener("click", (event) => {
  if (event.target === loginModal) loginModal.close();
});
document.getElementById("forgotPassword").addEventListener("click", (event) => {
  event.preventDefault();
  loginFeedback.textContent = "For account recovery, please contact Stark customer support.";
});
const signupPassword = document.getElementById("signupPassword");
const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
function validateSignupPasswordMatch() {
  signupPasswordConfirm.setCustomValidity(
    signupPasswordConfirm.value && signupPassword.value !== signupPasswordConfirm.value
      ? "Passwords do not match."
      : ""
  );
}
signupPassword.addEventListener("input", validateSignupPasswordMatch);
signupPasswordConfirm.addEventListener("input", validateSignupPasswordMatch);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isSignUp) {
    validateSignupPasswordMatch();
    if (!loginForm.reportValidity()) return;
    loginFeedback.textContent = "Registration successful! Welcome to Stark Bank.";
    setTimeout(() => {
      loginForm.reset();
      setAuthMode(false);
    }, 1500);
  } else {
    loginFeedback.textContent = "Sign-in successful! Welcome back.";
    setTimeout(() => {
      loginForm.reset();
      loginModal.close();
    }, 1500);
  }
});

const accountCreationModal = document.getElementById("accountCreationModal");
const accountCreationForm = document.getElementById("accountCreationForm");
const accountPhotoInput = document.getElementById("accountPhoto");
const accountPhotoPreview = document.getElementById("accountPhotoPreview");
let accountPhotoPreviewUrl = "";

function clearAccountPhotoPreview() {
  if (accountPhotoPreviewUrl) URL.revokeObjectURL(accountPhotoPreviewUrl);
  accountPhotoPreviewUrl = "";
  accountPhotoPreview.removeAttribute("src");
  accountPhotoPreview.hidden = true;
}

accountPhotoInput.addEventListener("change", () => {
  const photo = accountPhotoInput.files[0];
  const isJpeg = photo && (photo.type === "image/jpeg" || /\.jpe?g$/i.test(photo.name));
  accountPhotoInput.setCustomValidity(photo && !isJpeg ? "Please select a JPEG photo (.jpg or .jpeg)." : "");
  clearAccountPhotoPreview();
  if (isJpeg) {
    accountPhotoPreviewUrl = URL.createObjectURL(photo);
    accountPhotoPreview.src = accountPhotoPreviewUrl;
    accountPhotoPreview.hidden = false;
  }
});

document.getElementById("createBankAccountBtn").addEventListener("click", () => {
  accountCreationForm.reset();
  clearAccountPhotoPreview();
  accountPhotoInput.setCustomValidity("");
  document.getElementById("accountCreationFeedback").textContent = "";
  showDialogAtCurrentPosition(accountCreationModal);
});
document.getElementById("accountCreationClose").addEventListener("click", () => {
  accountCreationModal.close();
  accountCreationForm.reset();
  clearAccountPhotoPreview();
});
accountCreationModal.addEventListener("click", (event) => {
  if (event.target === accountCreationModal) accountCreationModal.close();
});
accountCreationModal.addEventListener("close", () => {
  accountCreationForm.reset();
  accountPhotoInput.setCustomValidity("");
  clearAccountPhotoPreview();
});
accountCreationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!accountCreationForm.reportValidity()) return;
  const formData = new URLSearchParams(new FormData(accountCreationForm));
  try {
    const res = await fetch("http://localhost:8080/api/account/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await res.json();
    const fb = document.getElementById("accountCreationFeedback");
    fb.textContent = data.message || (data.success ? "Account created successfully with number: " + data.accountNumber : "Application failed.");
    if (data.success) {
      setTimeout(() => {
        accountCreationModal.close();
        accountCreationForm.reset();
        clearAccountPhotoPreview();
      }, 3000);
    }
  } catch (err) {
    document.getElementById("accountCreationFeedback").textContent = "Error connecting to backend server at localhost:8080.";
  }
});
const fdAmountInput = document.getElementById("fdAmount");
const fdTermInput = document.getElementById("fdTerm");
const fdPayoutInput = document.getElementById("fdPayout");
const fdDemoRate = 0.065;
document.getElementById("fdCalculator").addEventListener("submit", (event) => event.preventDefault());
const formatRupees = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);

function updateFdEstimate() {
  const principal = Math.max(0, Number(fdAmountInput.value) || 0);
  const months = Math.min(120, Math.max(1, Number(fdTermInput.value) || 1));
  const years = months / 12;
  const payout = fdPayoutInput.value;
  const interest = payout === "maturity"
    ? principal * (Math.pow(1 + fdDemoRate / 4, 4 * years) - 1)
    : payout === "monthly" ? principal * fdDemoRate / 12 : principal * fdDemoRate / 4;
  const maturityAmount = payout === "maturity" ? principal + interest : principal;
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + months);

  document.getElementById("fdMaturity").textContent = formatRupees(maturityAmount);
  document.getElementById("fdPrincipal").textContent = formatRupees(principal);
  document.getElementById("fdInterest").textContent = formatRupees(interest);
  document.getElementById("fdMaturityDate").textContent = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(maturityDate);
  document.querySelector(".fd-result-label").textContent = payout === "maturity"
    ? "Estimated maturity amount" : "Principal returned at maturity";
  document.getElementById("fdInterest").parentElement.querySelector("span").textContent = payout === "maturity"
    ? "Estimated interest at maturity" : `Estimated ${payout} interest payout`;
}
[fdAmountInput, fdTermInput, fdPayoutInput].forEach((input) => {
  input.addEventListener("input", updateFdEstimate);
  input.addEventListener("change", updateFdEstimate);
});
updateFdEstimate();

const fdApplyModal = document.getElementById("fdApplyModal");
const fdApplyForm = document.getElementById("fdApplyForm");
document.getElementById("fdApplyOpen").addEventListener("click", () => {
  fdApplyForm.reset();
  fdApplyForm.elements.amount.value = fdAmountInput.value;
  fdApplyForm.elements.termYears.value = (Number(fdTermInput.value) / 12).toFixed(2);
  fdApplyForm.elements.payout.value = fdPayoutInput.value;
  document.getElementById("fdApplyFeedback").textContent = "";
  showDialogAtCurrentPosition(fdApplyModal);
});
document.getElementById("fdApplyClose").addEventListener("click", () => fdApplyModal.close());
fdApplyModal.addEventListener("click", (event) => {
  if (event.target === fdApplyModal) fdApplyModal.close();
});
fdApplyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!fdApplyForm.reportValidity()) return;
  const formData = new URLSearchParams(new FormData(fdApplyForm));
  try {
    const res = await fetch("http://localhost:8080/api/fd/apply", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await res.json();
    const fb = document.getElementById("fdApplyFeedback");
    fb.textContent = data.message || (data.success ? "FD application submitted! Maturity Amount: ₹ " + Math.round(data.maturityAmount) : "Submission failed.");
    if (data.success) {
      setTimeout(() => fdApplyModal.close(), 3000);
    }
  } catch (err) {
    document.getElementById("fdApplyFeedback").textContent = "Error connecting to backend server at localhost:8080.";
  }
});

const rateSlides = [
  { icon: "⌂", label: "VEHICLE LOAN", rate: "7.60" },
  { icon: "⌂", label: "HOME LOAN", rate: "8.50" },
  { icon: "▣", label: "PERSONAL LOAN", rate: "10.50" },
  { icon: "▤", label: "EDUCATION LOAN", rate: "9.25" }
];
const rateDots = document.getElementById("rateDots");
let activeRateSlide = 0;
let rateRotationTimer;

function showRateSlide(index) {
  activeRateSlide = (index + rateSlides.length) % rateSlides.length;
  const slide = rateSlides[activeRateSlide];
  document.getElementById("rateIcon").textContent = slide.icon;
  document.getElementById("rateLabel").textContent = slide.label;
  document.getElementById("rateNumber").innerHTML = `${slide.rate}<small>% p.a.</small>`;
  [...rateDots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeRateSlide);
    dot.setAttribute("aria-current", dotIndex === activeRateSlide ? "true" : "false");
  });
}

rateSlides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.className = "rate-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Show ${slide.label.toLowerCase()} rate`);
  dot.addEventListener("click", () => {
    showRateSlide(index);
    startRateRotation();
  });
  rateDots.append(dot);
});

document.getElementById("ratePrevious").addEventListener("click", () => {
  showRateSlide(activeRateSlide - 1);
  startRateRotation();
});
document.getElementById("rateNext").addEventListener("click", () => {
  showRateSlide(activeRateSlide + 1);
  startRateRotation();
});

function startRateRotation() {
  window.clearInterval(rateRotationTimer);
  rateRotationTimer = window.setInterval(() => showRateSlide(activeRateSlide + 1), 4500);
}

showRateSlide(0);
startRateRotation();

const loanEstimateModal = document.getElementById("loanEstimateModal");
const estimateLoanType = document.getElementById("estimateLoanType");
const estimateAmount = document.getElementById("estimateAmount");
const estimateTerm = document.getElementById("estimateTerm");
const estimateRate = document.getElementById("estimateRate");
const loanEstimateForm = document.getElementById("loanEstimateForm");

rateSlides.forEach((slide, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = slide.label.replaceAll("_", " ");
  estimateLoanType.append(option);
});

function updateLoanEstimate() {
  const selectedSlide = rateSlides[Number(estimateLoanType.value)] || rateSlides[activeRateSlide];
  const annualRate = Number(selectedSlide.rate);
  const principal = Number(estimateAmount.value);
  const years = Number(estimateTerm.value);
  estimateRate.textContent = `${annualRate.toFixed(2)}%`;

  if (!estimateAmount.validity.valid || !estimateTerm.validity.valid || principal <= 0 || years <= 0) {
    document.getElementById("estimateEmi").textContent = "—";
    document.getElementById("estimateInterest").textContent = "—";
    document.getElementById("estimateTotal").textContent = "—";
    return;
  }

  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 1200;
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = principal * monthlyRate * factor / (factor - 1);
  const totalRepayment = monthlyPayment * months;
  const formatEstimate = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(amount);

  document.getElementById("estimateEmi").textContent = formatEstimate(monthlyPayment);
  document.getElementById("estimateInterest").textContent = formatEstimate(totalRepayment - principal);
  document.getElementById("estimateTotal").textContent = formatEstimate(totalRepayment);
}

estimateLoanType.addEventListener("change", updateLoanEstimate);
[estimateAmount, estimateTerm].forEach((input) => {
  input.addEventListener("input", updateLoanEstimate);
  input.addEventListener("change", updateLoanEstimate);
});
loanEstimateForm.addEventListener("submit", (event) => event.preventDefault());
document.getElementById("rateBtn").addEventListener("click", () => {
  estimateLoanType.value = String(activeRateSlide);
  updateLoanEstimate();
  showDialogAtCurrentPosition(loanEstimateModal);
});
document.getElementById("loanEstimateClose").addEventListener("click", () => loanEstimateModal.close());
document.getElementById("loanEstimateDone").addEventListener("click", () => loanEstimateModal.close());
loanEstimateModal.addEventListener("click", (event) => {
  if (event.target === loanEstimateModal) loanEstimateModal.close();
});

const installmentForm = document.getElementById("installmentForm");
installmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!installmentForm.reportValidity()) return;
  const formData = new URLSearchParams(new FormData(installmentForm));
  try {
    const res = await fetch("http://localhost:8080/api/installment/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await res.json();
    const fb = document.getElementById("installmentFeedback");
    if (data.success) {
      fb.textContent = "Installment found in MySQL database!";
      const reminder = document.getElementById("installmentReminder");
      reminder.hidden = false;
      document.getElementById("installmentStatus").textContent = "ACTIVE LOAN — " + data.loanType.toUpperCase();
      document.getElementById("remainingTime").textContent = "₹ " + new Intl.NumberFormat("en-IN").format(data.emi) + " / EMI";
      document.getElementById("nextDueDate").textContent = "Next due date: " + data.nextDueDate;
      document.getElementById("reminderReference").textContent = "Loan Ref: " + data.loanReference + " | Paid: " + data.paid + " / " + data.total;
    } else {
      fb.textContent = data.message || "Loan reference not found.";
      document.getElementById("installmentReminder").hidden = true;
    }
  } catch (err) {
    document.getElementById("installmentFeedback").textContent = "Error connecting to backend server at localhost:8080.";
  }
});

document.getElementById("modalClose").addEventListener("click", () => modal.close());
document.getElementById("modalOk").addEventListener("click", () => modal.close());

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

const heroStories = [
  {
    eyebrow: "DISCOVER LOCAL BANKING",
    title: "A new <span>chapter</span> starts here.",
    description: "Banking that moves with you. Find simple ways to save, borrow, and plan for what comes next.",
    cta: "Explore our services",
    image: "images/lake-hero.jpg",
    alt: "A person paddling a canoe on a calm river"
  },
  {
    eyebrow: "MAKE ROOM FOR WHAT MATTERS",
    title: "Small steps. <span>Big goals.</span>",
    description: "Build a savings habit at your own pace with everyday tools designed to help you look ahead.",
    cta: "Explore savings",
    image: "images/mountain-lake.jpg",
    alt: "A peaceful lake and mountains in the morning"
  },
  {
    eyebrow: "YOUR NEXT MOVE",
    title: "Find your place to <span>belong.</span>",
    description: "From the first viewing to moving day, explore flexible home finance for the journey ahead.",
    cta: "Explore home loans",
    image: "images/modern-home.jpg",
    fallbackImage: "images/star%20home%20loan.jpeg",
    alt: "A modern home with large windows and a green lawn"
  }
];
const heroDots = [...document.querySelectorAll(".hero-dot")];
const heroPhoto = document.querySelector(".hero-photo");
let activeHeroStory = 0;
let heroRotationTimer;
let heroTransitionTimer;

function showHeroStory(index) {
  const story = heroStories[index];
  activeHeroStory = index;
  document.getElementById("heroEyebrow").textContent = story.eyebrow;
  document.getElementById("heroTitle").innerHTML = story.title;
  document.getElementById("heroDescription").textContent = story.description;
  document.getElementById("heroCta").innerHTML = `${story.cta} <span>→</span>`;
  heroDots.forEach((item, itemIndex) => {
    const active = itemIndex === index;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });

  window.clearTimeout(heroTransitionTimer);
  heroPhoto.classList.add("is-changing");
  let imageFailed = false;
  const preload = new Image();
  const applyHeroImage = (imageUrl) => {
    heroPhoto.style.backgroundImage = `linear-gradient(90deg,#0c344522,transparent 40%),url("${imageUrl}")`;
    heroPhoto.setAttribute("aria-label", story.alt);
    heroPhoto.classList.remove("is-changing");
  };
  preload.onerror = () => {
    imageFailed = true;
    if (activeHeroStory === index) applyHeroImage(story.fallbackImage || "images/star%20home%20loan.jpeg");
  };
  preload.src = story.image;
  heroTransitionTimer = window.setTimeout(() => {
    if (activeHeroStory !== index) return;
    applyHeroImage(imageFailed ? (story.fallbackImage || "images/star%20home%20loan.jpeg") : story.image);
  }, 220);
}

function startHeroRotation() {
  window.clearInterval(heroRotationTimer);
  heroRotationTimer = window.setInterval(() => {
    showHeroStory((activeHeroStory + 1) % heroStories.length);
  }, 5000);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showHeroStory(index);
    startHeroRotation();
  });
});
startHeroRotation();

const withdrawModal = document.getElementById("withdrawModal");
const withdrawForm = document.getElementById("withdrawForm");
document.getElementById("withdrawOpenBtn").addEventListener("click", () => {
  withdrawForm.reset();
  document.getElementById("withdrawFeedback").textContent = "";
  showDialogAtCurrentPosition(withdrawModal);
});
document.getElementById("withdrawClose").addEventListener("click", () => withdrawModal.close());
withdrawModal.addEventListener("click", (event) => {
  if (event.target === withdrawModal) withdrawModal.close();
});
withdrawForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!withdrawForm.reportValidity()) return;
  const formData = new URLSearchParams(new FormData(withdrawForm));
  try {
    const res = await fetch("http://localhost:8080/api/account/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });
    const data = await res.json();
    const fb = document.getElementById("withdrawFeedback");
    fb.textContent = data.message || (data.success ? "Withdrawal successful!" : "Withdrawal failed.");
    if (data.success) {
      setTimeout(() => {
        withdrawModal.close();
        withdrawForm.reset();
      }, 2500);
    }
  } catch (err) {
    document.getElementById("withdrawFeedback").textContent = "Error connecting to backend server at localhost:8080.";
  }
});
