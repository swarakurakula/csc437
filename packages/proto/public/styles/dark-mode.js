// Attach a listener to the <label> for the checkbox
const darkModeLabel = document.querySelector('label input#dark-mode-toggle');
darkModeLabel.parentElement.addEventListener("change", (event) => {
  // Prevent the original event from propagating further
  event.stopPropagation();

  // Dispatch a custom event with the checkbox state
  const isChecked = event.target.checked;
  const customEvent = new CustomEvent("darkmode:toggle", {
    detail: { checked: isChecked },
  });
  document.body.dispatchEvent(customEvent);
});

// Update the body listener to use the custom event
document.body.addEventListener("darkmode:toggle", (event) => {
  if (event.detail.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});
