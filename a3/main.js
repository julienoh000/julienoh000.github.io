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
