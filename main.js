// ✅ Init EmailJS
emailjs.init("jtfkk0sQbMAv2ABhS");

// ✅ ImgBB API key
const imgbbApiKey = "d6793e832f6f1f33f0aa7dcc8684847d";

// ✅ Click to open file input
document.getElementById("photoFrame").addEventListener("click", function () {
  document.getElementById("photoInput").click();
});

// ✅ Show uploaded image preview
document.getElementById("photoInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const preview = document.getElementById("preview");
      preview.src = event.target.result;
      preview.classList.remove("d-none");
      document.getElementById("photoText").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// ✅ Submit form and handle everything
function handleSubmit() {
  const nameInput = document.getElementById("nameInput");
  const photoInput = document.getElementById("photoInput");
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("❌ Please fill in both name and photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const base64Image = event.target.result.split(",")[1];

    const formData = new FormData();
    formData.append("key", imgbbApiKey);
    formData.append("image", base64Image);

    // ✅ Upload to ImgBB
    fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const imageUrl = data.data.url;

        const templateParams = {
          name: name,
          image_url: imageUrl,
        };

        // ✅ Send email via EmailJS
        return emailjs.send(
          "service_ehjo2d7",
          "template_q5xtecf",
          templateParams
        );
      })
      .then(() => {
        console.log("✅ Email sent. Showing modal...");

        // ✅ Set personalized modal content
        const modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = `
          <p><strong>Congratulations, ${name}!</strong></p>
          <p>You’ve successfully joined the <strong>Rusan Pharma International Yoga Day</strong> celebration. 🧘‍♀️</p>
          <p>Thank you for promoting wellness, balance, and inner peace. 🌿</p>
          <p>Stay healthy. Stay inspired.</p>
        `;

        // ✅ Show the modal
        const modalEl = document.getElementById("successModal");
        const successModal = new bootstrap.Modal(modalEl);
        successModal.show();

        // ✅ Reset form on modal close
        modalEl.addEventListener(
          "hidden.bs.modal",
          () => {
            console.log("✅ Modal closed, resetting form");
            nameInput.value = "";
            photoInput.value = "";
            document.getElementById("preview").src = "";
            document.getElementById("preview").classList.add("d-none");
            document.getElementById("photoText").style.display = "block";
          },
          { once: true }
        );
      })
      .catch((error) => {
        alert("❌ Upload or Email failed. Check console.");
        console.error(error);
      });
  };

  reader.readAsDataURL(file);
}
