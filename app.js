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

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove accents
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

function filterQueens() {
  const input = normalize(document.getElementById("queen-input").value);
  const suggestions = document.getElementById("suggestions");
  suggestions.innerHTML = "";

  if (!input) return;

  const distances = queenNames.map(name => ({
    name,
    distance: levenshteinDistance(input, normalize(name))
  }));

  distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .forEach(({ name }) => {
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
      const imageUrl = result.image;

      if (isCorrect && imageUrl) {
        cell.innerHTML = `
          <div class='img-wrapper'>
            <img src='${imageUrl}' alt='${name}' class='queen-img'/>
            <div class='overlay-name'>${name}</div>
          </div>`;
      } else {
        cell.innerHTML = `<div class='guess-label incorrect'>${name}</div>`;
      }

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
