import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MinusCircle,
  Plus,
  Printer,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { starterValues } from "./data/values";

const STORAGE_KEY = "values-sort-exercise-v1";

function createValueItem(label) {
  return {
    id: crypto.randomUUID(),
    label,
  };
}

const initialColumns = {
  available: starterValues.map((value) => createValueItem(value)),
  notImportant: [],
  somewhatImportant: [],
  important: [],
  veryImportant: [],
  top10: [],
  top5: [],
};

const columnMeta = {
  available: {
    title: "Value Bank",
    description: "Start here. Drag values into a category.",
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
  top10: {
    title: "Top 10",
    description: "Choose up to 10 values that matter most.",
    limit: 10,
  },
  top5: {
    title: "Top 5 Core Values",
    description: "Choose your final 5 core values.",
    limit: 5,
  },
};

const steps = [
  {
    id: 1,
    label: "Sort",
    title: "Sort your values",
    description:
      "Drag each value into the category that best matches how important it feels to you right now.",
  },
  {
    id: 2,
    label: "Top 10",
    title: "Narrow to your Top 10",
    description:
      "Review your Important and Very Important values, then drag your strongest choices into Top 10.",
  },
  {
    id: 3,
    label: "Top 5",
    title: "Choose your Top 5",
    description:
      "From your Top 10, choose the five values that feel most essential.",
  },
  {
    id: 4,
    label: "Reflect",
    title: "Reflect and export",
    description:
      "Write a few notes about what your values mean and how you want to live them.",
  },
];

function findColumnByItemId(columns, itemId) {
  return Object.keys(columns).find((columnId) =>
    columns[columnId].some((item) => item.id === itemId)
  );
}

function getItemById(columns, itemId) {
  for (const items of Object.values(columns)) {
    const found = items.find((item) => item.id === itemId);
    if (found) return found;
  }

  return null;
}

function canDropIntoColumn(columns, columnId, itemId) {
  const limit = columnMeta[columnId]?.limit;

  if (!limit) return true;

  const alreadyInColumn = columns[columnId].some((item) => item.id === itemId);

  if (alreadyInColumn) return true;

  return columns[columnId].length < limit;
}

function SortableValueCard({ item, muted = false, removeMode = false, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "value-card",
        muted ? "value-card-muted" : "",
        isDragging ? "value-card-dragging" : "",
        removeMode ? "value-card-remove-mode" : "",
      ].join(" ")}
      {...attributes}
      {...(!removeMode ? listeners : {})}
    >
      <span className="value-card-label">{item.label}</span>
      {removeMode && (
        <button
          type="button"
          className="remove-badge"
          aria-label={`Remove ${item.label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

function DroppableColumn({
  id,
  items,
  searchTerm,
  allowSearchFilter = true,
  ripple,
  removeMode = false,
  onRemove,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const columnRef = useRef(null);
  const setRef = useCallback(
    (node) => {
      columnRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef]
  );
  const meta = columnMeta[id];

  const visibleItems = useMemo(() => {
    if (!allowSearchFilter || !searchTerm.trim()) return items;

    return items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allowSearchFilter, items, searchTerm]);

  const isLimited = Boolean(meta.limit);
  const isFull = isLimited && items.length >= meta.limit;

  let ripplePos = null;
  if (ripple?.id === id && columnRef.current) {
    const rect = columnRef.current.getBoundingClientRect();
    ripplePos = { x: ripple.x - rect.left, y: ripple.y - rect.top };
  }

  return (
    <section
      ref={setRef}
      className={[
        "drop-column",
        isOver ? "drop-column-over" : "",
        isFull ? "drop-column-full" : "",
      ].join(" ")}
    >
      {ripplePos && (
        <div className="ripple-container" key={ripple.key}>
          <span className="ripple-ring" style={{ left: ripplePos.x, top: ripplePos.y }} />
          <span className="ripple-ring" style={{ left: ripplePos.x, top: ripplePos.y }} />
          <span className="ripple-ring" style={{ left: ripplePos.x, top: ripplePos.y }} />
        </div>
      )}
      <div className="column-header">
        <div>
          <h3>{meta.title}</h3>
          <p>{meta.description}</p>
        </div>

        <div className="count-pill">
          {items.length}
          {meta.limit ? `/${meta.limit}` : ""}
        </div>
      </div>

      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="card-stack">
          {visibleItems.map((item) => (
            <SortableValueCard
              key={item.id}
              item={item}
              removeMode={removeMode}
              onRemove={onRemove}
            />
          ))}

          {visibleItems.length === 0 && (
            <div className="empty-state">
              {searchTerm && allowSearchFilter
                ? "No matching values here."
                : "Drop values here."}
            </div>
          )}
        </div>
      </SortableContext>

      {isFull && (
        <p className="limit-note">
          This section is full. Move one value out before adding another.
        </p>
      )}
    </section>
  );
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

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialColumns;

    try {
      return JSON.parse(saved).columns || initialColumns;
    } catch {
      return initialColumns;
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
  const [activeId, setActiveId] = useState(null);
  const [ripple, setRipple] = useState(null);
  const [removeMode, setRemoveMode] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const rippleTimeout = useRef(null);
  const [reflection, setReflection] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return "";

    try {
      return JSON.parse(saved).reflection || "";
    } catch {
      return "";
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  const activeItem = activeId ? getItemById(columns, activeId) : null;

  const totalValues = Object.values(columns).reduce(
    (total, list) => total + list.length,
    0
  );

  const sortedCount =
    columns.notImportant.length +
    columns.somewhatImportant.length +
    columns.important.length +
    columns.veryImportant.length;

  const sortProgress =
    totalValues > 0 ? Math.round((sortedCount / totalValues) * 100) : 0;

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

  useEffect(() => {
    const track = (e) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", track);
    return () => window.removeEventListener("pointermove", track);
  }, []);

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const fromColumn = findColumnByItemId(columns, activeId);
    const toColumn =
      columns[overId] !== undefined ? overId : findColumnByItemId(columns, overId);

    if (!fromColumn || !toColumn) return;

    if (!canDropIntoColumn(columns, toColumn, activeId)) return;

    if (fromColumn === toColumn) {
      const oldIndex = columns[fromColumn].findIndex(
        (item) => item.id === activeId
      );
      const newIndex = columns[toColumn].findIndex((item) => item.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      setColumns((previous) => ({
        ...previous,
        [fromColumn]: arrayMove(previous[fromColumn], oldIndex, newIndex),
      }));

      return;
    }

    setColumns((previous) => {
      const movingItem = previous[fromColumn].find(
        (item) => item.id === activeId
      );

      if (!movingItem) return previous;

      const nextFrom = previous[fromColumn].filter(
        (item) => item.id !== activeId
      );
      const nextTo = [...previous[toColumn]];

      const overIndex = nextTo.findIndex((item) => item.id === overId);

      if (overIndex >= 0) {
        nextTo.splice(overIndex, 0, movingItem);
      } else {
        nextTo.push(movingItem);
      }

      return {
        ...previous,
        [fromColumn]: nextFrom,
        [toColumn]: nextTo,
      };
    });

    clearTimeout(rippleTimeout.current);
    setRipple({
      id: toColumn,
      x: lastPointer.current.x,
      y: lastPointer.current.y,
      key: Date.now(),
    });
    rippleTimeout.current = setTimeout(() => setRipple(null), 1100);
  }

  function removeValue(itemId) {
    setColumns((previous) => {
      const updated = {};
      for (const [colId, items] of Object.entries(previous)) {
        updated[colId] = items.filter((item) => item.id !== itemId);
      }
      return updated;
    });
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
    setColumns(initialColumns);
    setReflection("");
    setSearchTerm("");
    setCustomValue("");
    setCurrentStep(1);
  }

  function exportResults() {
    const top5 = columns.top5.map((item, index) => `${index + 1}. ${item.label}`);
    const top10 = columns.top10.map(
      (item, index) => `${index + 1}. ${item.label}`
    );

    const content = `
Values Sort Exercise Results

Top 5 Core Values
${top5.length ? top5.join("\n") : "No Top 5 values selected yet."}

Top 10 Values
${top10.length ? top10.join("\n") : "No Top 10 values selected yet."}

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

  const currentStepData = steps.find((step) => step.id === currentStep);

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
            Sort, narrow, and reflect on the values that matter most to you.
            Your progress saves automatically in this browser.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
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

        <div className="summary-card">
          <div
            className="progress-track"
            style={{ "--progress": `${sortProgress}%` }}
          >
            <div className="progress-fill" />
          </div>

          <div className="summary-stats">
            <p className="summary-label">Progress</p>
            <strong>{sortProgress}%</strong>

            <div className="summary-grid">
              <div>
                <span>{sortedCount}</span>
                <small>Sorted</small>
              </div>

              <div>
                <span>{columns.top10.length}/10</span>
                <small>Top 10</small>
              </div>

              <div>
                <span>{columns.top5.length}/5</span>
                <small>Top 5</small>
              </div>
            </div>
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
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search values..."
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

          <button
            type="button"
            className={removeMode ? "remove-mode-button remove-mode-button-active" : "remove-mode-button"}
            onClick={() => setRemoveMode((v) => !v)}
            aria-label={removeMode ? "Done removing" : "Remove values"}
            title={removeMode ? "Done" : "Remove values"}
          >
            <Trash2 size={18} />
            {removeMode ? "Done" : "Remove a Value"}
          </button>
        </div>
      </section>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {currentStep === 1 && (
          <section className="board board-sort">
            <DroppableColumn
              id="available"
              items={columns.available}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="veryImportant"
              items={columns.veryImportant}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="important"
              items={columns.important}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="somewhatImportant"
              items={columns.somewhatImportant}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="notImportant"
              items={columns.notImportant}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />
          </section>
        )}

        {currentStep === 2 && (
          <section className="board board-focus">
            <DroppableColumn
              id="important"
              items={columns.important}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="veryImportant"
              items={columns.veryImportant}
              searchTerm={searchTerm}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="top10"
              items={columns.top10}
              searchTerm={searchTerm}
              allowSearchFilter={false}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />
          </section>
        )}

        {currentStep === 3 && (
          <section className="board board-focus">
            <DroppableColumn
              id="top10"
              items={columns.top10}
              searchTerm={searchTerm}
              allowSearchFilter={false}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />

            <DroppableColumn
              id="top5"
              items={columns.top5}
              searchTerm={searchTerm}
              allowSearchFilter={false}
              ripple={ripple}
              removeMode={removeMode}
              onRemove={removeValue}
            />
          </section>
        )}

        <DragOverlay>
          {activeItem ? <SortableValueCard item={activeItem} muted /> : null}
        </DragOverlay>
      </DndContext>

      {currentStep === 4 && (
        <section className="reflection-layout">
          <div className="results-card">
            <p className="section-kicker">Your result</p>
            <h2>Top 5 Core Values</h2>

            {columns.top5.length > 0 ? (
              <ol className="results-list">
                {columns.top5.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ol>
            ) : (
              <p className="empty-results">
                You have not selected your Top 5 yet. Go back to Step 3 to
                finish.
              </p>
            )}

            <div className="export-actions">
              <button type="button" className="primary-button" onClick={exportResults}>
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
          Previous
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={currentStep === 4}
          onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}

export default App;