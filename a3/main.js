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
let matchaPoured = false;

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
    item: "empty-cup",
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
  {
    item: "straw",
    instruction: "Add a straw to complete your matcha latte!",
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

  const container = document.getElementById("game-container");
  const containerRect = container.getBoundingClientRect();

  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  const rect = draggedElement.getBoundingClientRect();
  const elementX = rect.left - containerRect.left;
  const elementY = rect.top - containerRect.top;

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

  const container = document.getElementById("game-container");
  const containerRect = container.getBoundingClientRect();

  const mouseX = e.clientX - containerRect.left;
  const mouseY = e.clientY - containerRect.top;

  const newX = mouseX - offsetX;
  const newY = mouseY - offsetY;

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
  } else if (currentItem === "empty-cup" && isOverlapping(rect, finalCup)) {
    cupPlaced = true;
    draggedElement.style.visibility = "hidden";
    document.getElementById("coaster-placeholder").style.display = "none";
    document.getElementById("final-cup-image").style.display = "block";

    const cupEmpty = document.getElementById("cup-empty");
    cupEmpty.style.display = "block";
    cupEmpty.classList.add("cup-state");

    nextStep();
  } else if (
    currentItem === "ice" &&
    cupPlaced &&
    isOverlapping(rect, finalCup)
  ) {
    icePlaced = true;
    draggedElement.style.visibility = "hidden";
    document.getElementById("cup-empty").style.display = "none";

    const cupWithIce = document.getElementById("cup-with-ice");
    cupWithIce.style.display = "block";
    cupWithIce.classList.add("cup-state");

    nextStep();
  } else if (
    currentItem === "milk" &&
    icePlaced &&
    isOverlapping(rect, finalCup)
  ) {
    milkPlaced = true;
    draggedElement.style.visibility = "hidden";
    document.getElementById("cup-with-ice").style.display = "none";

    const cupWithIceMilk = document.getElementById("cup-with-ice-milk");
    cupWithIceMilk.style.display = "block";
    cupWithIceMilk.classList.add("cup-state");

    nextStep();
    document.getElementById("bowl").classList.add("draggable");
    document.getElementById("bowl").style.cursor = "grab";
  } else if (
    currentItem === "bowl" &&
    milkPlaced &&
    isOverlapping(rect, finalCup)
  ) {
    matchaPoured = true;
    document.getElementById("cup-with-ice-milk").style.display = "none";

    const completedLatte = document.getElementById("completed-latte");
    completedLatte.style.display = "block";
    completedLatte.classList.add("cup-state");

    // 그릇을 빈 그릇으로 변경
    updateBowl("empty");

    resetItemPosition(draggedElement);
    nextStep();
  } else if (
    currentItem === "straw" &&
    matchaPoured &&
    isOverlapping(rect, finalCup)
  ) {
    draggedElement.style.visibility = "hidden";
    document.getElementById("completed-latte").style.display = "none";

    const completedLatteWithStraw = document.getElementById(
      "completed-latte-with-straw"
    );
    completedLatteWithStraw.style.display = "block";
    completedLatteWithStraw.classList.add("cup-state");

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
    kettle: { left: "40px", top: "100px" },
    spoon: { left: "40px", top: "300px" },
    whisk: { left: "40px", top: "500px" },
    "empty-cup": { left: "calc(100% - 220px)", top: "120px" },
    ice: { left: "calc(100% - 160px)", top: "360px" },
    milk: { left: "calc(100% - 180px)", top: "500px" },
    straw: { left: "calc(100% - 200px)", top: "650px" },
    bowl: { left: "calc(50% - 220px)", top: "calc(35% - 220px)" },
  };

  const pos = positions[element.id];
  if (pos) {
    element.style.position = "absolute";
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
  const stateImages = {
    water: "assets/bowl_water.png",
    powder: "assets/bowl_powder.png",
    mixed: "assets/bowl_mixed.png",
    empty: "assets/bowl_empty.png",
  };

  if (stateImages[state]) {
    bowl.style.backgroundImage = `url('${stateImages[state]}')`;
  } else {
    bowl.style.backgroundImage = `url('assets/bowl_empty.png')`;
  }
}

function nextStep() {
  const current = steps[currentStep];

  if (current.item !== "bowl") {
    document.getElementById(current.item).classList.add("disabled");
  }

  currentStep++;
  if (currentStep < steps.length) {
    const next = steps[currentStep];

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
  currentStep = 0;
  whiskCircleProgress = 0;
  cupPlaced = false;
  icePlaced = false;
  milkPlaced = false;
  matchaPoured = false;

  document.getElementById("complete-message").classList.remove("show");

  const bowl = document.getElementById("bowl");
  bowl.removeAttribute("style");
  bowl.style.backgroundImage = 'url("assets/bowl_empty.png")';
  bowl.classList.remove("draggable");

  document.getElementById("coaster-placeholder").style.display = "block";
  document.getElementById("final-cup-image").style.display = "none";
  document.getElementById("cup-empty").style.display = "none";
  document.getElementById("cup-with-ice").style.display = "none";
  document.getElementById("cup-with-ice-milk").style.display = "none";
  document.getElementById("completed-latte").style.display = "none";
  document.getElementById("completed-latte-with-straw").style.display = "none";

  const allItems = [
    "kettle",
    "spoon",
    "whisk",
    "empty-cup",
    "ice",
    "milk",
    "straw",
  ];
  allItems.forEach((id) => {
    const el = document.getElementById(id);
    el.removeAttribute("style");
    el.style.visibility = "visible";
    el.style.display = "block";

    if (id === "kettle") {
      el.classList.remove("disabled");
    } else {
      el.classList.add("disabled");
    }

    const positions = {
      kettle:
        "position: absolute; display: block; visibility: visible; left: 40px; top: 100px;",
      spoon:
        "position: absolute; display: block; visibility: visible; left: 40px; top: 300px;",
      whisk:
        "position: absolute; display: block; visibility: visible; left: 40px; top: 500px;",
      "empty-cup":
        "position: absolute; display: block; visibility: visible; left: calc(100% - 220px); top: 120px;",
      ice: "position: absolute; display: block; visibility: visible; left: calc(100% - 160px); top: 360px;",
      milk: "position: absolute; display: block; visibility: visible; left: calc(100% - 180px); top: 500px;",
      straw:
        "position: absolute; display: block; visibility: visible; left: calc(100% - 200px); top: 650px;",
    };

    el.style.cssText = positions[id];
  });

  document.getElementById("instruction").textContent = steps[0].instruction;
}

document.addEventListener("mousedown", initDrag);
document.getElementById("reset-button").addEventListener("click", resetGame);
