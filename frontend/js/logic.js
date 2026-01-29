const uploadBtn = document.getElementById("uploadBtn");
const uploadArea = document.getElementById("uploadArea");

const gradeDisplay = document.getElementById("gradeDisplay");
const confidenceDisplay = document.getElementById("confidenceDisplay");
const priceDisplay = document.getElementById("priceDisplay");
const cropDisplay = document.getElementById("cropDisplay");

const emptyState = document.getElementById("emptyState");
const resultsView = document.getElementById("resultsView");
const cropIcon = document.getElementById("cropIcon");

uploadBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    /* ===============================
       1️⃣ SHOW COMPUTING STATE
       =============================== */
    emptyState.style.display = "none";
    resultsView.style.display = "block";

    cropIcon.innerHTML = `
      <div style="
        font-size: 1.1rem;
        font-weight: 600;
        color: #6aa9ff;
        text-align: center;
      ">
        Computing...
      </div>
    `;

    gradeDisplay.innerText = "--";
    confidenceDisplay.innerText = "--";
    priceDisplay.innerText = "--";
    cropDisplay.innerText = "Turmeric";

    /* ===============================
       2️⃣ PREPARE IMAGE
       =============================== */
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/predict", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      /* ===============================
         3️⃣ SHOW UPLOADED IMAGE
         =============================== */
      const reader = new FileReader();
      reader.onload = () => {
        cropIcon.innerHTML = `
          <img 
            src="${reader.result}" 
            alt="Uploaded Turmeric"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 14px;
            "
          />
        `;
      };
      reader.readAsDataURL(file);

      /* ===============================
         4️⃣ UPDATE RESULTS
         =============================== */
      gradeDisplay.innerText = data.grade ?? "N/A";
      confidenceDisplay.innerText = data.confidence
        ? data.confidence + "%"
        : "N/A";
      priceDisplay.innerText = data.price ?? "N/A";
      cropDisplay.innerText = "Turmeric";

    } catch (err) {
      console.error(err);
      cropIcon.innerHTML = `
        <span style="color:red; font-weight:600;">
          Prediction Failed
        </span>
      `;
      alert("Prediction failed. Please check backend.");
    }
  };

  input.click();
});
