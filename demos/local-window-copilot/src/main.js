const agent = document.querySelector("#floatingAgent");
const dragSurface = document.querySelector("#dragSurface");
const mascotButton = document.querySelector("#mascotButton");
const stateChip = document.querySelector("#stateChip");
const stateButtons = [...document.querySelectorAll("[data-state-button]")];

const stateOrder = ["idle", "observing", "analyzing", "privacy", "error"];
const stateLabels = {
  idle: "待命",
  observing: "观察",
  analyzing: "分析",
  privacy: "隐私",
  error: "异常"
};

let activeState = "idle";
let drag = null;
let suppressClick = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAgentSize() {
  const rect = agent.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
}

function setPosition(x, y, persist = true) {
  const { width, height } = getAgentSize();
  const maxX = window.innerWidth - width - 12;
  const maxY = window.innerHeight - height - 12;
  const nextX = clamp(x, 12, Math.max(12, maxX));
  const nextY = clamp(y, 12, Math.max(12, maxY));
  agent.style.setProperty("--agent-x", `${nextX}px`);
  agent.style.setProperty("--agent-y", `${nextY}px`);
  if (persist) {
    try { localStorage.setItem("floatingAgentPosition", JSON.stringify({ x: nextX, y: nextY })); } catch { /* Private browsing still supports the demo. */ }
  }
}

function restorePosition() {
  let saved;
  try { saved = localStorage.getItem("floatingAgentPosition"); } catch { saved = null; }
  if (!saved) {
    const { width, height } = getAgentSize();
    setPosition(window.innerWidth - width - 32, window.innerHeight - height - 32, false);
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Number.isFinite(Number(parsed.x)) || !Number.isFinite(Number(parsed.y))) throw new Error('Invalid saved position');
    setPosition(Number(parsed.x), Number(parsed.y), false);
  } catch {
    try { localStorage.removeItem("floatingAgentPosition"); } catch { /* Storage is optional. */ }
    setPosition(12, Math.max(260, window.innerHeight - 360), false);
  }
}

function setState(nextState) {
  if (!stateOrder.includes(nextState)) {
    return;
  }

  activeState = nextState;
  agent.dataset.state = nextState;
  stateChip.textContent = stateLabels[nextState];

  for (const button of stateButtons) {
    button.classList.toggle("is-active", button.dataset.stateButton === nextState);
    button.setAttribute('aria-pressed', String(button.dataset.stateButton === nextState));
  }
}

function cycleState() {
  const currentIndex = stateOrder.indexOf(activeState);
  const nextIndex = (currentIndex + 1) % stateOrder.length;
  setState(stateOrder[nextIndex]);
}

mascotButton.addEventListener('keydown', event => {
  const move = {ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[event.key];
  if (!move) return;
  event.preventDefault();
  const rect = agent.getBoundingClientRect(); setPosition(rect.left + move[0], rect.top + move[1]);
});

dragSurface.addEventListener("pointerdown", (event) => {
  if (!event.isPrimary || event.button !== 0 || event.target.closest(".agent-toolbar")) {
    return;
  }

  const rect = agent.getBoundingClientRect();
  suppressClick = false;
  drag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    moved: false
  };
  agent.classList.add("is-dragging");
});

dragSurface.addEventListener("pointermove", (event) => {
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }

  const x = event.clientX - drag.offsetX;
  const y = event.clientY - drag.offsetY;
  if (Math.abs(event.clientX - drag.startX) > 4 || Math.abs(event.clientY - drag.startY) > 4) {
    if (!drag.moved) dragSurface.setPointerCapture(event.pointerId);
    drag.moved = true;
  }
  if (drag.moved) setPosition(x, y);
});

function endDrag(event) {
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }
  suppressClick = drag.moved;
  drag = null;
  if (dragSurface.hasPointerCapture(event.pointerId)) dragSurface.releasePointerCapture(event.pointerId);
  agent.classList.remove("is-dragging");
}

dragSurface.addEventListener("pointerup", endDrag);
dragSurface.addEventListener("pointercancel", endDrag);
dragSurface.addEventListener("lostpointercapture", endDrag);

mascotButton.addEventListener("click", event => {
  if (suppressClick && event.detail !== 0) {
    return;
  }
  cycleState();
});

for (const button of stateButtons) {
  button.addEventListener("click", () => {
    setState(button.dataset.stateButton);
  });
}

window.addEventListener("resize", () => {
  const rect = agent.getBoundingClientRect();
  setPosition(rect.left, rect.top, false);
});

restorePosition();
setState(activeState);
