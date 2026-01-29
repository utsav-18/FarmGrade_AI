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
       1️⃣ SHOW "COMPUTING..." STATE
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
    cropDisplay.innerText = "--";

    /* ===============================
       2️⃣ SEND IMAGE TO BACKEND
       =============================== */
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/predict", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      /* ===============================
         3️⃣ SHOW UPLOADED IMAGE
         =============================== */
      const reader = new FileReader();
      reader.onload = () => {
        cropIcon.innerHTML = `
          <img 
            src="${reader.result}" 
            alt="Uploaded Crop"
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
      gradeDisplay.innerText = data.grade;
      confidenceDisplay.innerText = data.confidence + "%";
      priceDisplay.innerText = data.price;
      cropDisplay.innerText = data.crop;

    } catch (err) {
      console.error(err);
      cropIcon.innerHTML = `<span style="color:red;">Failed</span>`;
      alert("Prediction failed. Check backend.");
    }
  };

  input.click();
});
