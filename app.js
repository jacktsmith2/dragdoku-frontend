// app.js

const rowLabels = ["Snatch Winner", "Finale Queen", "1 Lipsync Win"];
const colLabels = ["Season 5", "2+ Maxi Wins", "1 Mini Win"];
const VALID_QUEENS = ["Bosco", "Q", "Utica Queen"];

const grid = document.getElementById("grid-container");

// top-left corner blank
grid.innerHTML += `<div class="cell label"></div>`;

colLabels.forEach(label => {
  grid.innerHTML += `<div class="cell label">${label}</div>`;
});

for (let row = 0; row < 3; row++) {
  grid.innerHTML += `<div class="cell label">${rowLabels[row]}</div>`;

  for (let col = 0; col < 3; col++) {
    const cellId = `cell-${row}-${col}`;
    grid.innerHTML += `<div class="cell" id="${cellId}" onclick="openModal(${row}, ${col})"></div>`;
  }
}

let selectedRow = null;
let selectedCol = null;

function openModal(row, col) {
  selectedRow = row;
  selectedCol = col;
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
  const msg = document.getElementById("guess-message");
  const cell = document.getElementById(`cell-${selectedRow}-${selectedCol}`);

  if (!VALID_QUEENS.includes(name)) {
    msg.textContent = "❌ Please select a valid queen from the list.";
    return;
  }

  const img = document.createElement("img");
  img.src = "https://upload.wikimedia.org/wikipedia/en/4/4f/RuPaul_2011.jpg"; // Placeholder
  img.className = "queen-img";
  cell.innerHTML = "";
  cell.appendChild(img);

  closeModal();
}
