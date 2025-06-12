@@ -1,56 +1,75 @@
// app.js

const rowLabels = ["Snatch Winner", "Finale Queen", "1 Lipsync Win"];
const colLabels = ["Season 5", "2+ Maxi Wins", "1 Mini Win"];Add commentMore actions
const VALID_QUEENS = ["Bosco", "Q", "Utica Queen"];

// build the grid
const grid = document.getElementById("grid-container");

// top-left corner blank
grid.innerHTML += `<div class="cell label"></div>`;

// column headers
colLabels.forEach(label => {
  grid.innerHTML += `<div class="cell label">${label}</div>`;
});

for (let row = 0; row < 3; row++) {
  // row header
  grid.innerHTML += `<div class="cell label">${rowLabels[row]}</div>`;

  for (let col = 0; col < 3; col++) {
    const cellId = `cell-${row}-${col}`;
    grid.innerHTML += `<div class="cell" id="${cellId}" onclick="selectCell(${row}, ${col})"></div>`;
    grid.innerHTML += `<div class="cell" id="${cellId}" onclick="openModal(${row}, ${col})"></div>`;
  }
}

let selectedRow = null;
let selectedCol = null;

function selectCell(row, col) {
function openModal(row, col) {
  selectedRow = row;
  selectedCol = col;
  document.getElementById("selected-cell").textContent = `${rowLabels[row]} x ${colLabels[col]}`;
  document.getElementById("queen-input").focus();
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("queen-input").value = "";
  document.getElementById("suggestions").innerHTML = "";
  document.getElementById("guess-message").textContent = "";
  document.getElementById("modal-clue").textContent = `${rowLabels[row]} x ${colLabels[col]}`;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function filterQueens() {
  const input = document.getElementById("queen-input").value.toLowerCase();
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  VALID_QUEENS.filter(name => name.toLowerCase().includes(input)).forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      document.getElementById("queen-input").value = name;
      suggestions.innerHTML = "";
    };
    suggestions.appendChild(div);
  });
}

function submitGuess() {
  const name = document.getElementById("queen-input").value.trim();
  if (!name || selectedRow === null || selectedCol === null) {
    alert("Please select a cell and enter a name.");
  const msg = document.getElementById("guess-message");
  const cell = document.getElementById(`cell-${selectedRow}-${selectedCol}`);

  if (!VALID_QUEENS.includes(name)) {
    msg.textContent = "❌ Please select a valid queen from the list.";
    return;
  }

  const cell = document.getElementById(`cell-${selectedRow}-${selectedCol}`);

  // FOR NOW — placeholder image
  const img = document.createElement("img");
  img.src = "https://upload.wikimedia.org/wikipedia/en/4/4f/RuPaul_2011.jpg";
  img.className = "queen-img correct";
  img.src = "https://upload.wikimedia.org/wikipedia/en/4/4f/RuPaul_2011.jpg"; // Placeholder
  img.className = "queen-img";
  cell.innerHTML = "";
  cell.appendChild(img);

  // Reset
  document.getElementById("queen-input").value = "";
  selectedRow = null;
  selectedCol = null;
  document.getElementById("selected-cell").textContent = "None";
  closeModal();
}
