const colorInput = document.getElementById("colorInput");
const colorPreview = document.querySelector(".color-preview");

// Update the color preview when the input value changes
colorInput.addEventListener("input", () => {
    const selectedColor = colorInput.value;
    colorPreview.style.backgroundColor = selectedColor;
	boardFrame.contentWindow.postMessage({ color: selectedColor}, '*');
});
