let currentStep = 0;
let draggedElement = null;
let offsetX = 0,
  offsetY = 0;
let whiskCircleProgress = 0;
let whiskStartX = 0,
  whiskStartY = 0;
let cupPlaced = false;
let icePlaced = false;
let milkPlaced = false;

const steps = [
  {
    item: "kettle",
    instruction: "Pour water into the bowl with the kettle!",
    bowlState: "water",
  },
  {
    item: "spoon",
    instruction: "Add matcha powder with the spoon!",
    bowlState: "powder",
  },
  {
    item: "whisk",
    instruction: "Whisk in a circular motion to mix!",
    bowlState: "mixed",
  },
  {
    item: "cup-item",
    instruction: "Bring the empty cup to the coaster!",
    bowlState: "mixed",
  },
  { item: "ice", instruction: "Add ice to the cup!", bowlState: "mixed" },
  { item: "milk", instruction: "Pour milk into the cup!", bowlState: "mixed" },
  {
    item: "bowl",
    instruction: "Pour matcha from the bowl into the cup!",
    bowlState: "mixed",
  },
];

function initDrag(e) {
  e.preventDefault();
  const target = e.target.closest(".draggable");
  if (!target || target.classList.contains("disabled")) return;

  const expectedItem = steps[currentStep].item;
  if (target.id !== expectedItem) {
    return;
  }

  draggedElement = target;
  draggedElement.classList.add("dragging");

  // Get the container position
  const container = document.getElementById("game-container");
  const containerRect = container.getBoundingClientRect();

  // Calculate mouse position relative to container
  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  // Get current element position
  const rect = draggedElement.getBoundingClientRect();
  const elementX = rect.left - containerRect.left;
  const elementY = rect.top - containerRect.top;

  // Calculate offset
  offsetX = mouseX - elementX;
  offsetY = mouseY - elementY;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  if (target.id === "whisk" && currentStep === 2) {
    whiskStartX = e.clientX;
    whiskStartY = e.clientY;
  }
}

function drag(e) {
  if (!draggedElement) return;

  // Get the container position
  const container = document.getElementById("game-container");
  const containerRect = container.getBoundingClientRect();

  // Calculate mouse position relative to container
  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  // Calculate new element position
  const newX = mouseX - offsetX;
  const newY = mouseY - offsetY;

  // Set position
  draggedElement.style.left = newX + "px";
  draggedElement.style.top = newY + "px";
  draggedElement.style.right = "";
  draggedElement.style.transform = "";

  if (draggedElement.id === "whisk" && currentStep === 2) {
    checkWhiskCircle(e.clientX, e.clientY);
  }
}

function checkWhiskCircle(x, y) {
  const distance = Math.sqrt(
    Math.pow(x - whiskStartX, 2) + Math.pow(y - whiskStartY, 2)
  );
  if (distance > 100) {
    whiskCircleProgress += 1;
    whiskStartX = x;
    whiskStartY = y;

    if (whiskCircleProgress >= 15) {
      updateBowl("mixed");
      resetItemPosition(draggedElement);
      nextStep();
    }
  }
}

function stopDrag(e) {
  if (!draggedElement) return;

  draggedElement.classList.remove("dragging");

  const rect = draggedElement.getBoundingClientRect();
  const bowl = document.getElementById("bowl").getBoundingClientRect();
  const finalCup = document.getElementById("final-cup").getBoundingClientRect();

  const currentItem = draggedElement.id;

  if (currentItem === "kettle" && isOverlapping(rect, bowl)) {
    updateBowl("water");
    resetItemPosition(draggedElement);
    nextStep();
  } else if (currentItem === "spoon" && isOverlapping(rect, bowl)) {
    updateBowl("powder");
    resetItemPosition(draggedElement);
    nextStep();
  } else if (currentItem === "cup-item" && isOverlapping(rect, finalCup)) {
    cupPlaced = true;
    draggedElement.style.display = "none";
    document.getElementById("coaster-placeholder").style.display = "none";
    document.getElementById("final-cup-image").style.display = "block";
    nextStep();
  } else if (
    currentItem === "ice" &&
    cupPlaced &&
    isOverlapping(rect, finalCup)
  ) {
    icePlaced = true;
    draggedElement.style.display = "none";
    document.getElementById("placed-cup").style.display = "none";
    document.getElementById("cup-with-ice").style.display = "flex";
    nextStep();
  } else if (
    currentItem === "milk" &&
    icePlaced &&
    isOverlapping(rect, finalCup)
  ) {
    milkPlaced = true;
    draggedElement.style.display = "none";
    document.getElementById("cup-with-ice").style.display = "none";
    document.getElementById("cup-with-ice-milk").style.display = "flex";
    nextStep();
    document.getElementById("bowl").classList.add("draggable");
    document.getElementById("bowl").style.cursor = "grab";
  } else if (
    currentItem === "bowl" &&
    milkPlaced &&
    isOverlapping(rect, finalCup)
  ) {
    // Hide all previous elements and show completed latte
    document.getElementById("placed-cup").style.display = "none";
    document.getElementById("cup-with-ice").style.display = "none";
    document.getElementById("cup-with-ice-milk").style.display = "none";
    document.getElementById("completed-latte").style.display = "flex";

    // Reset bowl position
    resetItemPosition(draggedElement);

    // Show completion message
    setTimeout(() => {
      showComplete();
    }, 600);
  } else {
    resetItemPosition(draggedElement);
  }

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
  draggedElement = null;
}

function resetItemPosition(element) {
  const positions = {
    kettle: { left: "40px", top: "120px" },
    spoon: { left: "40px", top: "230px" },
    whisk: { left: "40px", top: "340px" },
    "cup-item": { left: "calc(100% - 130px)", top: "120px" },
    ice: { left: "calc(100% - 100px)", top: "250px" },
    milk: { left: "calc(100% - 110px)", top: "330px" },
    bowl: { left: "calc(50% - 110px)", top: "calc(35% - 110px)" },
  };

  const pos = positions[element.id];
  if (pos) {
    element.style.left = pos.left;
    element.style.right = "";
    element.style.top = pos.top;
    element.style.transform = "";
  }
}

function isOverlapping(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

function updateBowl(state) {
  const bowl = document.getElementById("bowl");
  const stateTexts = {
    water: "Bowl with<br>Water PNG",
    powder: "Bowl with<br>Powder PNG",
    mixed: "Mixed<br>Bowl PNG",
  };
  bowl.innerHTML = stateTexts[state] || "Empty<br>Bowl PNG";
}

function nextStep() {
  const current = steps[currentStep];

  // Disable current item
  if (current.item !== "bowl") {
    document.getElementById(current.item).classList.add("disabled");
  }

  currentStep++;
  if (currentStep < steps.length) {
    const next = steps[currentStep];

    // Enable next item
    const nextElement = document.getElementById(next.item);
    if (nextElement) {
      nextElement.classList.remove("disabled");
    }

    document.getElementById("instruction").textContent = next.instruction;
  }
}

function showComplete() {
  const msg = document.getElementById("complete-message");
  msg.classList.add("show");
}

function resetGame() {
  // Reset variables
  currentStep = 0;
  whiskCircleProgress = 0;
  cupPlaced = false;
  icePlaced = false;
  milkPlaced = false;

  // Hide complete message
  document.getElementById("complete-message").classList.remove("show");

  // Reset bowl
  const bowl = document.getElementById("bowl");
  bowl.innerHTML = "Empty<br>Bowl PNG";
  bowl.classList.remove("draggable");
  bowl.style.cursor = "";
  bowl.style.left = "calc(50% - 110px)";
  bowl.style.top = "calc(35% - 110px)";
  bowl.style.transform = "";
  bowl.style.right = "";

  // Reset final cup
  document.getElementById("coaster-placeholder").style.display = "flex";
  document.getElementById("final-cup-image").style.display = "none";
  document.getElementById("placed-cup").style.display = "flex";
  document.getElementById("cup-with-ice").style.display = "none";
  document.getElementById("cup-with-ice-milk").style.display = "none";
  document.getElementById("completed-latte").style.display = "none";

  // Reset all items - show and enable only kettle
  const allItems = ["kettle", "spoon", "whisk", "cup-item", "ice", "milk"];
  allItems.forEach((id) => {
    const el = document.getElementById(id);
    el.style.display = "block";
    if (id === "kettle") {
      el.classList.remove("disabled");
    } else {
      el.classList.add("disabled");
    }
    resetItemPosition(el);
  });

  // Reset instruction
  document.getElementById("instruction").textContent = steps[0].instruction;
}

document.addEventListener("mousedown", initDrag);
document.getElementById("reset-button").addEventListener("click", resetGame);
