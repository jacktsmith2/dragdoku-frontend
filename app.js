// app.js test

const rowLabels = [
  { label: "Snatch Winner", note: "A queen who won the Snatch Game challenge." },
  { label: "Finale Queen", note: "A queen that made it to the final competitive episode without being eliminated." },
  { label: "1 Lipsync Win", note: "A queen with exactly one lipsync win." }
];

const colLabels = [
  { label: "Season 5", note: "Queens who competed in Season 5." },
  { label: "2+ Maxi Wins", note: "Queens with two or more maxi challenge wins." },
  { label: "1 Mini Win", note: "Queens with exactly one mini challenge win." }
];

const VALID_QUEENS = ["Bosco", "Q", "Utica Queen"];

const grid = document.getElementById("grid-container");

// top-left corner blank
grid.innerHTML += `<div class="cell label"></div>`;

// column headers
colLabels.forEach((item, colIndex) => {
  grid.innerHTML += `<div class="cell label clickable" onclick="showNote('${item.label}', '${item.note}')">${item.label}</div>`;
});

for (let row = 0; row < 3; row++) {
  grid.innerHTML += `<div class="cell label clickable" onclick="showNote('${rowLabels[row].label}', '${rowLabels[row].note}')">${rowLabels[row].label}</div>`;

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
  document.getElementById("modal-clue").textContent = `${rowLabels[row].label} x ${colLabels[col].label}`;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("note-modal").classList.add("hidden");
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

function showNote(title, note) {
  document.getElementById("note-modal-title").textContent = title;
  document.getElementById("note-modal-text").textContent = note;
  document.getElementById("note-modal").classList.remove("hidden");
}
