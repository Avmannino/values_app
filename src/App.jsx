import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

const STORAGE_KEY = "values-sort-exercise-v7";

const valueDeck = [
  {
    label: "Acceptance",
    description: "to be accepted as I am",
  },
  {
    label: "Accuracy",
    description: "to be accurate in my opinions and beliefs",
  },
  {
    label: "Achievement",
    description: "to have important accomplishments",
  },
  {
    label: "Adventure",
    description: "to have new and exciting experiences",
  },
  {
    label: "Attractiveness",
    description: "to be physically attractive",
  },
  {
    label: "Authority",
    description: "to be in charge of and responsible for others",
  },
  {
    label: "Autonomy",
    description: "to be self-determined and independent",
  },
  {
    label: "Beauty",
    description: "to appreciate beauty around me",
  },
  {
    label: "Caring",
    description: "to take care of others",
  },
  {
    label: "Challenge",
    description: "to take on difficult tasks and problems",
  },
  {
    label: "Change",
    description: "to have a life full of change and variety",
  },
  {
    label: "Comfort",
    description: "to have a pleasant and comfortable life",
  },
  {
    label: "Commitment",
    description: "to make enduring, meaningful commitments",
  },
  {
    label: "Compassion",
    description: "to feel and act on concern for others",
  },
  {
    label: "Connection",
    description: "to feel connected to others",
  },
  {
    label: "Contribution",
    description: "to make a lasting contribution in the world",
  },
  {
    label: "Cooperation",
    description: "to work collaboratively with others",
  },
  {
    label: "Courtesy",
    description: "to be considerate and polite toward others",
  },
  {
    label: "Creativity",
    description: "to have new and original ideas",
  },
  {
    label: "Dependability",
    description: "to be reliable and trustworthy",
  },
  {
    label: "Duty",
    description: "to carry out my duties and obligations",
  },
  {
    label: "Ecology",
    description: "to live in harmony with the environment",
  },
  {
    label: "Excitement",
    description: "to have a life full of thrills and stimulation",
  },
  {
    label: "Faithfulness",
    description: "to be loyal and true in relationships",
  },
  {
    label: "Fame",
    description: "to be known and recognized",
  },
  {
    label: "Family",
    description: "to have a happy, loving family",
  },
  {
    label: "Fitness",
    description: "to be physically fit and strong",
  },
  {
    label: "Flexibility",
    description: "to adjust to new circumstances easily",
  },
  {
    label: "Forgiveness",
    description: "to be forgiving of others",
  },
  {
    label: "Freedom",
    description: "to be free from restrictions and limitations",
  },
  {
    label: "Friendship",
    description: "to have close, supportive friends",
  },
  {
    label: "Fun",
    description: "to play and have fun",
  },
  {
    label: "Generosity",
    description: "to give what I have to others",
  },
  {
    label: "Genuineness",
    description: "to act in a manner that is true to who I am",
  },
  {
    label: "God's Will",
    description: "to seek and obey the will of God",
  },
  {
    label: "Growth",
    description: "to keep changing and growing",
  },
  {
    label: "Health",
    description: "to be physically well and healthy",
  },
  {
    label: "Helpfulness",
    description: "to be helpful to others",
  },
  {
    label: "Honesty",
    description: "to be honest and truthful",
  },
  {
    label: "Hope",
    description: "to maintain a positive and optimistic outlook",
  },
  {
    label: "Humility",
    description: "to be modest and unassuming",
  },
  {
    label: "Humor",
    description: "to see the humorous side of myself and the world",
  },
  {
    label: "Independence",
    description: "to be free from depending on others",
  },
  {
    label: "Industry",
    description: "to work hard and well at my life tasks",
  },
  {
    label: "Inner Peace",
    description: "to experience personal peace",
  },
  {
    label: "Intimacy",
    description: "to share my innermost experiences with others",
  },
  {
    label: "Justice",
    description: "to promote fair and equal treatment for all",
  },
  {
    label: "Knowledge",
    description: "to learn and contribute valuable knowledge",
  },
  {
    label: "Leisure",
    description: "to take time to relax and enjoy",
  },
  {
    label: "Loved",
    description: "to be loved by those close to me",
  },
  {
    label: "Loving",
    description: "to give love to others",
  },
  {
    label: "Mastery",
    description: "to be competent in my everyday activities",
  },
  {
    label: "Mindfulness",
    description: "to live conscious and mindful of the present moment",
  },
  {
    label: "Moderation",
    description: "to avoid excesses and find a middle ground",
  },
  {
    label: "Monogamy",
    description: "to have one close, loving relationship",
  },
  {
    label: "Nonconformity",
    description: "to question and challenge authority and norms",
  },
  {
    label: "Nurturance",
    description: "to encourage and support others",
  },
  {
    label: "Openness",
    description: "to be open to new experiences, ideas, and options",
  },
  {
    label: "Order",
    description: "to have a life that is well-ordered and organized",
  },
  {
    label: "Passion",
    description: "to have deep feelings about ideas, activities, or people",
  },
  {
    label: "Pleasure",
    description: "to feel good",
  },
  {
    label: "Popularity",
    description: "to be well-liked by many people",
  },
  {
    label: "Power",
    description: "to have control over others",
  },
  {
    label: "Purpose",
    description: "to have meaning and direction in my life",
  },
  {
    label: "Rationality",
    description: "to be guided by reason and logic",
  },
  {
    label: "Realism",
    description: "to see and act realistically and practically",
  },
  {
    label: "Responsibility",
    description: "to make and carry out responsible decisions",
  },
  {
    label: "Risk",
    description: "to take risks and chances",
  },
  {
    label: "Romance",
    description: "to have intense, exciting love in my life",
  },
  {
    label: "Safety",
    description: "to be safe and secure",
  },
  {
    label: "Self-Acceptance",
    description: "to accept myself as I am",
  },
  {
    label: "Self-Control",
    description: "to be disciplined in my own actions",
  },
  {
    label: "Self-Esteem",
    description: "to feel good about myself",
  },
  {
    label: "Self-Knowledge",
    description: "to have a deep and honest understanding of myself",
  },
  {
    label: "Service",
    description: "to be of service to others",
  },
  {
    label: "Sexuality",
    description: "to have an active and satisfying sex life",
  },
  {
    label: "Simplicity",
    description: "to live life simply, with minimal needs",
  },
  {
    label: "Solitude",
    description: "to have time and space where I can be apart from others",
  },
  {
    label: "Spirituality",
    description: "to grow and mature spiritually",
  },
  {
    label: "Stability",
    description: "to have a life that stays fairly consistent",
  },
  {
    label: "Tolerance",
    description: "to accept and respect those who differ from me",
  },
  {
    label: "Tradition",
    description: "to follow respected patterns of the past",
  },
  {
    label: "Virtue",
    description: "to live a morally pure and excellent life",
  },
  {
    label: "Wealth",
    description: "to have plenty of money",
  },
  {
    label: "World Peace",
    description: "to work to promote peace in the world",
  },
];

function shuffleArray(array) {
  return [...array]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function createValueItem(value) {
  const label = typeof value === "string" ? value : value.label;
  const description =
    typeof value === "string"
      ? "A custom value you added to the deck."
      : value.description;

  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${label}-${Date.now()}-${Math.random()}`,
    label,
    description,
  };
}

function getValueLengthClass(label) {
  const length = label.length;

  if (length >= 26) return "value-title-xxl-long";
  if (length >= 21) return "value-title-xl-long";
  if (length >= 16) return "value-title-long";
  if (length >= 11) return "value-title-medium";

  return "value-title-short";
}

function createInitialColumns() {
  return {
    available: shuffleArray(valueDeck).map((value) => createValueItem(value)),
    notImportant: [],
    somewhatImportant: [],
    important: [],
    veryImportant: [],
  };
}

const columnMeta = {
  available: {
    title: "Value Deck",
    description: "Review each value one at a time.",
  },
  notImportant: {
    title: "Not Important",
    description: "Values that do not strongly guide you right now.",
  },
  somewhatImportant: {
    title: "Somewhat Important",
    description: "Values that matter, but are not central.",
  },
  important: {
    title: "Important",
    description: "Values that meaningfully guide your choices.",
  },
  veryImportant: {
    title: "Very Important",
    description: "Values that feel essential to who you are.",
  },
};

const steps = [
  {
    id: 1,
    label: "Sort",
    title: "Sort your values",
    description:
      "Review each value one at a time. Swipe left or click No if it is not important. Swipe right or click Yes to choose its importance level.",
  },
  {
    id: 2,
    label: "Reflect",
    title: "Reflect and export",
    description:
      "Write a few notes about what your values mean and how you want to live them.",
  },
];

function removeItemFromAllColumns(columns, itemId) {
  const updated = {};

  for (const [columnId, items] of Object.entries(columns)) {
    updated[columnId] = items.filter((item) => item.id !== itemId);
  }

  return updated;
}

function StepIndicator({ currentStep, setCurrentStep }) {
  return (
    <div className="stepper">
      {steps.map((step) => (
        <button
          key={step.id}
          type="button"
          onClick={() => setCurrentStep(step.id)}
          className={[
            "step-button",
            currentStep === step.id ? "step-button-active" : "",
            currentStep > step.id ? "step-button-complete" : "",
          ].join(" ")}
        >
          <span>
            {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
          </span>
          {step.label}
        </button>
      ))}
    </div>
  );
}

function SmallValueCard({
  item,
  onRemove,
  selected = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      className={[
        "small-value-card",
        selected ? "small-value-card-selected" : "",
        disabled ? "small-value-card-disabled" : "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{item.label}</span>

      {selected && (
        <span className="selected-badge">
          <Check size={14} strokeWidth={3} />
        </span>
      )}

      {onRemove && (
        <span
          className="remove-badge"
          role="button"
          tabIndex={0}
          aria-label={`Remove ${item.label}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(item.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onRemove(item.id);
            }
          }}
        >
          <X size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function ValueColumn({ id, items, searchTerm, removeMode, onRemove }) {
  const meta = columnMeta[id];

  const visibleItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    return items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <section className="drop-column">
      <div className="column-header">
        <div>
          <h3>{meta.title}</h3>
          <p>{meta.description}</p>
        </div>

        <div className="count-pill">{items.length}</div>
      </div>

      <div className="card-stack">
        {visibleItems.map((item) => (
          <SmallValueCard
            key={item.id}
            item={item}
            onRemove={removeMode ? onRemove : undefined}
          />
        ))}

        {visibleItems.length === 0 && (
          <div className="empty-state">
            {searchTerm ? "No matching values here." : "No values here yet."}
          </div>
        )}
      </div>
    </section>
  );
}

function ImportanceModal({ value, onClose, onChoose }) {
  if (!value) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="importance-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="importance-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-button"
          aria-label="Close modal"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <p className="section-kicker">Choose importance</p>

        <h2 id="importance-modal-title">{value.label}</h2>

        <p>{value.description}</p>

        <div className="importance-options">
          <button
            type="button"
            className="importance-option somewhat-option"
            onClick={() => onChoose("somewhatImportant")}
          >
            <span>Somewhat Important</span>
            <small>It matters, but is not central.</small>
          </button>

          <button
            type="button"
            className="importance-option important-option"
            onClick={() => onChoose("important")}
          >
            <span>Important</span>
            <small>It meaningfully guides your choices.</small>
          </button>

          <button
            type="button"
            className="importance-option very-important-option"
            onClick={() => onChoose("veryImportant")}
          >
            <span>Very Important</span>
            <small>It feels essential to who you are.</small>
          </button>
        </div>
      </section>
    </div>
  );
}

function SwipeDeck({
  currentValue,
  remainingCount,
  totalCount,
  onNo,
  onYes,
  searchTerm,
  animatingDirection,
  isDecisionLocked,
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef(null);

  const rotate = Math.max(Math.min(dragOffset.x / 16, 16), -16);
  const decisionHint =
    dragOffset.x > 70 ? "yes" : dragOffset.x < -70 ? "no" : null;

  function handlePointerDown(event) {
    if (!currentValue || isDecisionLocked || animatingDirection) return;

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!pointerStart.current || !isDragging || isDecisionLocked) return;

    setDragOffset({
      x: event.clientX - pointerStart.current.x,
      y: event.clientY - pointerStart.current.y,
    });
  }

  function handlePointerUp() {
    if (!pointerStart.current || isDecisionLocked) return;

    const finalX = dragOffset.x;

    pointerStart.current = null;
    setIsDragging(false);

    if (finalX <= -120) {
      onNo();
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    if (finalX >= 120) {
      onYes();
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    setDragOffset({ x: 0, y: 0 });
  }

  if (!currentValue) {
    return (
      <section className="swipe-feature">
        <div className="deck-empty-state">
          <CheckCircle2 size={48} />
          <h3>
            {searchTerm
              ? "No values match your search."
              : "You reviewed every value."}
          </h3>
          <p>
            {searchTerm
              ? "Clear your search to continue reviewing the full value deck."
              : "Move to Step 2 when you are ready to reflect on your values."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="swipe-feature">
      <div className="deck-status-row">
        <span>
          {remainingCount} value{remainingCount === 1 ? "" : "s"} left
        </span>

        <span>
          {Math.max(totalCount - remainingCount + 1, 1)} / {totalCount || 1}
        </span>
      </div>

      <div className="dating-phone-frame">
        <div className="swipe-card-stage">
          <div className="swipe-card swipe-card-back swipe-card-back-three" />
          <div className="swipe-card swipe-card-back swipe-card-back-two" />
          <div className="swipe-card swipe-card-back" />

          <article
            className={[
              "swipe-card",
              "active-swipe-card",
              isDragging ? "active-swipe-card-dragging" : "",
              decisionHint === "yes" ? "swipe-card-yes" : "",
              decisionHint === "no" ? "swipe-card-no" : "",
              animatingDirection === "yes" ? "swipe-card-exit-right" : "",
              animatingDirection === "no" ? "swipe-card-exit-left" : "",
            ].join(" ")}
            style={{
              transform:
                animatingDirection || !isDragging
                  ? undefined
                  : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotate}deg)`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="swipe-decision swipe-decision-no">Nope</div>
            <div className="swipe-decision swipe-decision-yes">Yes</div>

            <div className="dating-card-glow" />

            <p className="section-kicker">Current value</p>

            <h3
              className={[
                "value-title",
                getValueLengthClass(currentValue.label),
              ].join(" ")}
              title={currentValue.label}
            >
              {currentValue.label}
            </h3>

            <p>{currentValue.description}</p>
          </article>
        </div>
      </div>

      <div className="swipe-actions dating-actions">
        <button
          type="button"
          className="no-button dating-action-button"
          onClick={onNo}
          disabled={isDecisionLocked}
          aria-label="Mark as not important"
        >
          <X size={30} />
        </button>

        <button
          type="button"
          className="yes-button dating-action-button"
          onClick={onYes}
          disabled={isDecisionLocked}
          aria-label="Mark as important"
        >
          <Check size={30} />
        </button>
      </div>

      <p className="swipe-help">Swipe left for No. Swipe right for Yes.</p>
    </section>
  );
}

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return createInitialColumns();

    try {
      return JSON.parse(saved).columns || createInitialColumns();
    } catch {
      return createInitialColumns();
    }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return 1;

    try {
      return JSON.parse(saved).currentStep || 1;
    } catch {
      return 1;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [removeMode, setRemoveMode] = useState(false);
  const [pendingImportanceValue, setPendingImportanceValue] = useState(null);
  const [animatingDirection, setAnimatingDirection] = useState(null);
  const [isDecisionLocked, setIsDecisionLocked] = useState(false);

  const [reflection, setReflection] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return "";

    try {
      return JSON.parse(saved).reflection || "";
    } catch {
      return "";
    }
  });

  const currentStepData = steps.find((step) => step.id === currentStep);

  const filteredAvailableValues = useMemo(() => {
    if (!searchTerm.trim()) return columns.available;

    return columns.available.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [columns.available, searchTerm]);

  const currentValue = filteredAvailableValues[0] || null;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        columns,
        currentStep,
        reflection,
      })
    );
  }, [columns, currentStep, reflection]);

  function moveValueToColumn(item, columnId) {
    setColumns((previous) => {
      const cleanedColumns = removeItemFromAllColumns(previous, item.id);

      return {
        ...cleanedColumns,
        [columnId]: [...cleanedColumns[columnId], item],
      };
    });
  }

  function handleNo() {
    if (!currentValue || isDecisionLocked) return;

    const valueToMove = currentValue;

    setIsDecisionLocked(true);
    setAnimatingDirection("no");

    window.setTimeout(() => {
      moveValueToColumn(valueToMove, "notImportant");
      setAnimatingDirection(null);
      setIsDecisionLocked(false);
    }, 380);
  }

  function handleYes() {
    if (!currentValue || isDecisionLocked) return;

    const valueToReview = currentValue;

    setIsDecisionLocked(true);
    setAnimatingDirection("yes");

    window.setTimeout(() => {
      setPendingImportanceValue(valueToReview);
      setAnimatingDirection(null);
      setIsDecisionLocked(false);
    }, 380);
  }

  function handleChooseImportance(columnId) {
    if (!pendingImportanceValue) return;

    moveValueToColumn(pendingImportanceValue, columnId);
    setPendingImportanceValue(null);
  }

  function removeValue(itemId) {
    setColumns((previous) => removeItemFromAllColumns(previous, itemId));
  }

  function addCustomValue() {
    const trimmed = customValue.trim();

    if (!trimmed) return;

    const alreadyExists = Object.values(columns)
      .flat()
      .some((item) => item.label.toLowerCase() === trimmed.toLowerCase());

    if (alreadyExists) {
      setCustomValue("");
      return;
    }

    setColumns((previous) => ({
      ...previous,
      available: [createValueItem(trimmed), ...previous.available],
    }));

    setCustomValue("");
  }

  function resetExercise() {
    const confirmed = window.confirm(
      "Reset the exercise? This will clear your sorted values and reflection."
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    setColumns(createInitialColumns());
    setReflection("");
    setSearchTerm("");
    setCustomValue("");
    setRemoveMode(false);
    setPendingImportanceValue(null);
    setAnimatingDirection(null);
    setIsDecisionLocked(false);
    setCurrentStep(1);
  }

  function exportResults() {
    const content = `
Values Sort Exercise Results

Very Important
${
  columns.veryImportant.length
    ? columns.veryImportant
        .map((item) => `- ${item.label}: ${item.description}`)
        .join("\n")
    : "None selected."
}

Important
${
  columns.important.length
    ? columns.important
        .map((item) => `- ${item.label}: ${item.description}`)
        .join("\n")
    : "None selected."
}

Somewhat Important
${
  columns.somewhatImportant.length
    ? columns.somewhatImportant
        .map((item) => `- ${item.label}: ${item.description}`)
        .join("\n")
    : "None selected."
}

Not Important
${
  columns.notImportant.length
    ? columns.notImportant
        .map((item) => `- ${item.label}: ${item.description}`)
        .join("\n")
    : "None selected."
}

Reflection
${reflection || "No reflection added yet."}
`.trim();

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "values-sort-results.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Values Sort Exercise
          </div>

          <h1>Discover the values that guide your choices.</h1>

          <p>
            Sort and reflect on the values that matter most to you. Your
            progress saves automatically in this browser.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 2))}
            >
              Continue Exercise
              <ArrowRight size={18} />
            </button>

            <button type="button" className="ghost-button" onClick={resetExercise}>
              <RefreshCcw size={18} />
              Reset
            </button>
          </div>
        </div>
      </section>

      <StepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

      <section className="instruction-panel">
        <div>
          <p className="section-kicker">Step {currentStep}</p>
          <h2>{currentStepData.title}</h2>
          <p>{currentStepData.description}</p>
        </div>

        <div className="tool-row">
          {currentStep === 1 && (
            <>
              <div className="search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search value deck..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />

                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm("")}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="add-box">
                <input
                  type="text"
                  placeholder="Add custom value"
                  value={customValue}
                  onChange={(event) => setCustomValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addCustomValue();
                  }}
                />

                <button type="button" onClick={addCustomValue}>
                  <Plus size={18} />
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            className={
              removeMode
                ? "remove-mode-button remove-mode-button-active"
                : "remove-mode-button"
            }
            onClick={() => setRemoveMode((value) => !value)}
            aria-label={removeMode ? "Done removing" : "Remove values"}
            title={removeMode ? "Done" : "Remove values"}
          >
            <Trash2 size={18} />
            {removeMode ? "Done" : "Remove a Value"}
          </button>
        </div>
      </section>

      {currentStep === 1 && (
        <section className="sort-stage">
          <SwipeDeck
            currentValue={currentValue}
            remainingCount={filteredAvailableValues.length}
            totalCount={columns.available.length}
            onNo={handleNo}
            onYes={handleYes}
            searchTerm={searchTerm}
            animatingDirection={animatingDirection}
            isDecisionLocked={isDecisionLocked}
          />

          <section className="importance-results-section">
            <div className="importance-results-header">
              <p className="section-kicker">Your selections</p>
              <h2>Sorted Values</h2>
              <p>
                As you swipe, each value will appear below in its selected
                importance category.
              </p>
            </div>

            <section className="importance-results-grid">
              <ValueColumn
                id="veryImportant"
                items={columns.veryImportant}
                searchTerm=""
                removeMode={removeMode}
                onRemove={removeValue}
              />

              <ValueColumn
                id="important"
                items={columns.important}
                searchTerm=""
                removeMode={removeMode}
                onRemove={removeValue}
              />

              <ValueColumn
                id="somewhatImportant"
                items={columns.somewhatImportant}
                searchTerm=""
                removeMode={removeMode}
                onRemove={removeValue}
              />

              <ValueColumn
                id="notImportant"
                items={columns.notImportant}
                searchTerm=""
                removeMode={removeMode}
                onRemove={removeValue}
              />
            </section>
          </section>
        </section>
      )}

      {currentStep === 2 && (
        <section className="reflection-layout">
          <div className="results-card">
            <p className="section-kicker">Your result</p>
            <h2>Very Important Values</h2>

            {columns.veryImportant.length > 0 ? (
              <ol className="results-list">
                {columns.veryImportant.map((item) => (
                  <li key={item.id}>
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty-results">
                No values marked Very Important yet. Go back to Step 1 to sort
                your values.
              </p>
            )}

            <div className="export-actions">
              <button
                type="button"
                className="primary-button"
                onClick={exportResults}
              >
                <Download size={18} />
                Export Text
              </button>

              <button
                type="button"
                className="ghost-button"
                onClick={() => window.print()}
              >
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>

          <div className="reflection-card">
            <p className="section-kicker">Reflection</p>
            <h2>What do these values mean for you?</h2>

            <label htmlFor="reflection">
              Use this space to write how these values show up in your life,
              relationships, goals, or decisions.
            </label>

            <textarea
              id="reflection"
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="Example: Integrity matters to me because I want my choices to match my words, even when it is inconvenient..."
            />
          </div>
        </section>
      )}

      <footer className="footer-nav">
        <button
          type="button"
          className="ghost-button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={currentStep === 2}
          onClick={() => setCurrentStep(Math.min(currentStep + 1, 2))}
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      </footer>

      <ImportanceModal
        value={pendingImportanceValue}
        onClose={() => setPendingImportanceValue(null)}
        onChoose={handleChooseImportance}
      />
    </main>
  );
}

export default App;