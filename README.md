# FormulaForge Web

Interactive calculator playground for engineering and math formulas. Build, browse, and use calculators with live results and clean formula displays.

## What's New

- Full-width layout: the sidebar navigation has been removed for a cleaner workspace.
- Home page search bar: quickly find calculators by title or description.
- Better validation UX: inputs only show errors after the user interacts with them.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- mathjs for evaluation
- KaTeX for formula rendering

## Getting Started

Prerequisites: Node.js 18+ and npm, pnpm, or bun.

```sh
# Clone
git clone <YOUR_REPO_URL>
cd formulaforge-web

# Install (choose one)
npm i
# pnpm i
# bun install

# Run
npm run dev
# pnpm dev
# bun run dev
```

The app runs at `http://localhost:3000` (or the port Vite chooses).

## Usage

### Browse Calculators

- Open the home page to see all available calculators as cards.

### Search Calculators

- Use the search bar on the home page to filter calculators.
- Matches on calculator title and description (case-insensitive, instant updates).
- Shows helpful result counts and a clear button to reset the query.

### Calculator View

- Enter values in the Inputs panel; results update automatically.
- Validation runs only after you interact with a field.
- The Formula section displays the equation with symbols using KaTeX.

## Project Structure

- `src/pages/CalculatorsList.tsx`: Home page with search and calculator cards.
- `src/pages/CalculatorView.tsx`: Individual calculator page.
- `src/components/Layout.tsx`: App layout (full-width, no sidebar).
- `src/data/calculators.json`: Calculator definitions (inputs, outputs, formulas).
- `src/hooks/useCalculator.ts`: State, validation, and result computation.

## Add a New Calculator

1. Add a new entry to `src/data/calculators.json` with inputs and outputs.
2. Each output must include a `formula` using input/output ids and mathjs syntax.
3. Optionally set `formula_display` for custom KaTeX output.

## Scripts

```sh
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
```

## License

MIT

## Prompt

```

## Generate new JSON

You are given the contents of an electronics calculator webpage (title, description, inputs, formula, etc.).  
Your job is to convert it into a structured JSON definition in the exact format below.

---

### JSON FORMAT

```json
{
  "id": "<unique-id-kebab-case>",
  "title": "<Calculator Title>",
  "description": "<One or two sentence description of what the calculator does>",
  "inputs": [
    {
      "id": "<snake_case_id>",
      "label": "<Human-friendly label>",
      "symbol": "<math symbol>",
      "unit": "<unit (leave empty if none)>",
      "type": "number",
      "required": true,
      "placeholder": "<help text>"
    }
  ],
  "outputs": [
    {
      "id": "<snake_case_id>",
      "label": "<Human-friendly output label>",
      "symbol": "<math symbol>",
      "unit": "<unit>",
      "formula": "<valid JavaScript math expression, directly executable>",
      "formula_display": "<LaTeX-style readable formula>"
    }
  ]
}
```

---

### RULES

- Use valid JavaScript Math expressions (`Math.log10`, `Math.pow`, `Math.sqrt`, `*`, `/`, `+`, `-`).
- Each input/output id must be in `snake_case`.
- Top-level `id` must be in kebab-case.
- `formula_display` must use LaTeX formatting. Escape backslashes properly.
- Do not include trailing commas.
- Always include all inputs and outputs shown in the page.
- Units should match the website (e.g., "mm", "inches", "Ω"). If none, leave empty.
- Replace variable names (`d, l, n`) with their matching input IDs.

---

### ✅ Example (taken directly from a real webpage)

**Input webpage text:**

PCB Microstrip Crosstalk Calculator  
Inputs: Substrate Height (H, mm), Trace Spacing (S, mm)  
Formula:  
CTdb = 20 log10(1 / (1 + (S/H)^2))

**Correct JSON output:**

```json
{
  "id": "pcb-microstrip-crosstalk-calculator",
  "title": "PCB Microstrip Crosstalk Calculator",
  "description": "Calculate PCB microstrip crosstalk based on substrate height and trace spacing to estimate interconnection noise.",
  "inputs": [
    {
      "id": "substrate_height",
      "label": "Substrate Height",
      "symbol": "H",
      "unit": "mm",
      "type": "number",
      "required": true,
      "placeholder": "Enter substrate height"
    },
    {
      "id": "trace_spacing",
      "label": "Trace Spacing",
      "symbol": "S",
      "unit": "mm",
      "type": "number",
      "required": true,
      "placeholder": "Enter trace spacing"
    }
  ],
  "outputs": [
    {
      "id": "crosstalk",
      "label": "CrossTalk",
      "symbol": "CTdb",
      "unit": "dB",
      "formula": "20 * Math.log10(1 / (1 + Math.pow(trace_spacing / substrate_height, 2)))",
      "formula_display": "CT_{db} = 20 \\log_{10}\\left(\\frac{1}{1 + (S/H)^2}\\right)"
    }
  ]
}
```

---

### TASK

Whenever I paste a new calculator webpage (title, description, inputs, formulas, etc.),  
convert it into JSON using the exact format and rules above.

```

### Steps to use this prompt

1. Open the target calculator webpage in your browser.
2. Press Ctrl+A (Cmd+A on macOS) to select the entire page and copy it.
3. Paste the copied page contents into an LLM (e.g., ChatGPT) alongside the prompt above.
4. Verify the generated JSON for correctness (ids, units, formulas, LaTeX).
5. Append the verified object to `src/data/calculators.json`.
   - Keep the JSON array valid and sorted if desired.
   - Do not add trailing commas.
