// app.js (live backend version with dynamic queen list)

const grid = document.getElementById("grid-container");
let selectedRow = null;
let selectedCol = null;
let rowLabels = [];
let colLabels = [];
let queenNames = [];

// Fetch grid and queen list
Promise.all([
  fetch("https://dragdoku-backend.onrender.com/grid").then(res => res.json()),
  fetch("https://dragdoku-backend.onrender.com/queens").then(res => res.json())
])
.then(([gridData, queenList]) => {
  rowLabels = gridData.rows.map((label, i) => ({
    label,
    note: gridData.row_desc[i]
  }));

  colLabels = gridData.cols.map((label, i) => ({
    label,
    note: gridData.col_desc[i]
  }));

  queenNames = queenList;

  renderGrid();
})
.catch(err => {
  console.error("Error loading grid or queen list:", err);
});

// Render the grid
function renderGrid() {
  grid.innerHTML = "";

  // top-left blank corner
  grid.innerHTML += `<div class="cell label"></div>`;

  // column headers
  colLabels.forEach(item => {
    grid.innerHTML += `<div class="cell label clickable" onclick="showNote('${item.label}', '${item.note}')">${item.label}</div>`;
  });

  // rows and grid cells
  for (let row = 0; row < 3; row++) {
    grid.innerHTML += `<div class="cell label clickable" onclick="showNote('${rowLabels[row].label}', '${rowLabels[row].note}')">${rowLabels[row].label}</div>`;
    for (let col = 0; col < 3; col++) {
      const cellId = `cell-${row}-${col}`;
      grid.innerHTML += `<div class="cell" id="${cellId}" onclick="openModal(${row}, ${col})"></div>`;
    }
  }
}

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

  queenNames
    .filter(name => name.toLowerCase().includes(input))
    .forEach(name => {
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

  if (!name) {
    msg.textContent = "❌ Please enter a name.";
    return;
  }

  fetch("https://dragdoku-backend.onrender.com/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      row: selectedRow,
      col: selectedCol,
      queen: name
    })
  })
    .then(res => res.json())
    .then(result => {
      const isCorrect = result.valid;
      cell.innerHTML = `<div class='guess-label ${isCorrect ? "correct" : "incorrect"}'>${name}</div>`;
      closeModal();
    })
    .catch(() => {
      msg.textContent = "❌ Error contacting the server.";
    });
}

function showNote(title, note) {
  document.getElementById("note-modal-title").textContent = title;
  document.getElementById("note-modal-text").textContent = note;
  document.getElementById("note-modal").classList.remove("hidden");
}
