// Toggle JS
const toggleCheckBox = document.querySelector(".toggle__checkbox");
const toggleCheckText = document.querySelector('.toggle__check-text');

// Draw toggle
const drawToggle = () => {
  if(appState.dark_mode) {
    document.body.classList.add("dark-mode");
    toggleCheckText.textContent = 'ON';
    toggleCheckBox.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    toggleCheckText.textContent = 'OFF';
  } 
}

// Change toggle event
toggleCheckBox.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  const newAppState = {
    ...appState,
    dark_mode: !appState.dark_mode
  };
  appState = { ...newAppState };
  localStorage.setItem('app_state', JSON.stringify(newAppState));  
  drawToggle();
});

// Draw toggle whan DOM is loaded!
document.addEventListener('DOMContentLoaded', () => {
  drawToggle();
});