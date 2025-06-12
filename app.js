const rowLabels = ["Snatch Winner", "Finale Queen", "1 Lipsync Win"];
const colLabels = ["Season 5", "2+ Maxi Wins", "1 Mini Win"];

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
    grid.innerHTML += `<div class="cell" id="${cellId}" onclick="sendGuess(${row}, ${col})"></div>`;
  }
}

function sendGuess(row, col) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  const name = prompt("Enter queen name:");

  // FOR NOW — placeholder image
  const img = document.createElement("img");
  img.src = "https://upload.wikimedia.org/wikipedia/en/4/4f/RuPaul_2011.jpg";
  img.className = "queen-img correct";
  cell.innerHTML = "";
  cell.appendChild(img);
}
