const rowLabels = ["Snatch Winner", "Finale Queen", "1 Lipsync Win"];
const colLabels = ["Season 5", "2+ Maxi Wins", "1 Mini Win"];
const VALID_QUEENS = ["Bosco", "Q", "Utica Queen"];

const CRITERIA_NOTES = {
  "Snatch Winner": "A queen who won the Snatch Game challenge.",
  "Finale Queen": "A queen that made it to the final competitive episode without being eliminated.",
  "1 Lipsync Win": "A queen who has won exactly one lip sync.",
  "Season 5": "A queen who competed in Season 5 of RuPaul's Drag Race.",
  "2+ Maxi Wins": "A queen who has won two or more main challenges.",
  "1 Mini Win": "A queen who has won exactly one mini challenge."
};

const grid = document.getElementById("grid-container");

// top-left corner blank
grid.innerHTML += `<div class="cell label"></div>`;

// column headers (make clickable)
colLabels.forEach(label => {
  grid.innerHTML += `<div class="cell label" onclick="showNote('${label}', CRITERIA_NOTES['${label}'])">${label}</div>`;
});

// row headers and grid cells
for (let row = 0; row < 3; row++) {
  grid.innerHTML += `<div class="cell label" onclick="showNote('${rowLabels[row]}', CRITERIA_NOTES['${rowLabels[row]}'])">${rowLabels[row]}</div>`;

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

function showNote(title, note) {
  document.getElementById("note-title").textContent = title;
  document.getElementById("note-text").textContent = note;
  document.getElementById("note-modal").classList.remove("hidden");
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
