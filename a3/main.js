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
  const rect = draggedElement.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);

  if (target.id === "whisk" && currentStep === 2) {
    whiskStartX = e.clientX;
    whiskStartY = e.clientY;
  }
}

function drag(e) {
  if (!draggedElement) return;

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  draggedElement.style.left = x + "px";
  draggedElement.style.top = y + "px";

  if (draggedElement.id === "whisk" && currentStep === 2) {
    createWhiskTrail(e.clientX, e.clientY);
    checkWhiskCircle(e.clientX, e.clientY);
  }
}

function createWhiskTrail(x, y) {
  const trail = document.createElement("div");
  trail.className = "whisk-trail";
  trail.style.left = x + "px";
  trail.style.top = y + "px";
  document.getElementById("game-container").appendChild(trail);
  setTimeout(() => trail.remove(), 500);
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
