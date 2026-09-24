# Bitcoin Script-Like Execution Simulator

## Project Build Plan for Antigravity

> **Purpose:** Build a working educational simulator for the Blockchain Lab project within a very limited development window.
>
> **Primary source of truth:** `Bitcoin-Smart-Contract-Like-Script-Execution-Simulator.pdf` provided with the assignment/project brief.
>
> **Important:** This project is an **educational simulator**, not Bitcoin Core, not a real Bitcoin transaction validator, and not a production smart-contract platform. The simulator should make stack-based Script execution visible and understandable.

---

# 1. Project Overview

## 1.1 Project title

**Bitcoin Smart-Contract-Like Script Execution Simulator**

## 1.2 Core idea

Bitcoin uses a stack-based scripting language called **Bitcoin Script** to define transaction spending conditions. Script execution happens sequentially: instructions push, pop, and transform values on a stack.

The educational problem is that beginners normally have to mentally trace these stack changes. The project solves this by providing an **interactive simulator** where a user can:

1. Enter a simplified Bitcoin Script program.
2. Parse and validate the instructions.
3. Execute the program step-by-step.
4. See the stack after every instruction.
5. See errors when execution is invalid.
6. Review the complete execution trace.
7. See the final VALID/INVALID result.

The project brief explicitly describes the lifecycle as:

**User enters script → script tokenized → instructions validated → execution begins → opcodes modify stack → each state recorded → final result generated.**

---

# 2. Problem Statement

Bitcoin Script execution is difficult for beginners because the important state is hidden inside a stack. The project brief identifies three major learning problems:

- Stack state is normally invisible.
- Opcode behavior such as `ADD`, `EQUAL`, and `VERIFY` is difficult for beginners to internalize.
- Static explanations do not show the complete execution journey.

Therefore, the simulator must prioritize **visual feedback**, **step-by-step execution**, and **clear error reporting**.

---

# 3. Project Goal

Build a polished browser-based educational simulator that makes simplified Bitcoin Script execution observable.

The minimum successful experience should look like this:

```text
User enters:

PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL

Simulator shows:

Initial      []
PUSH 5       [5]
PUSH 3       [5, 3]
ADD          [8]
PUSH 8       [8, 8]
EQUAL        [TRUE]

Final Result: VALID
```

This exact example is shown in the project brief and should be supported end-to-end.

---

# 4. Scope Boundary

## 4.1 In scope

The implementation must include:

- Script text input.
- Tokenization/parsing.
- Instruction/opcode validation.
- Stack-based execution engine.
- Supported opcode execution.
- Step-by-step execution.
- Stack visualization.
- Execution trace/history.
- VALID/INVALID final result.
- Execution error handling.
- Educational explanations of what each operation does.
- Clean, understandable UI.

## 4.2 Explicitly out of scope

Do **not** turn this into a real Bitcoin node, wallet, blockchain explorer, or production smart-contract platform.

Do not add:

- Real Bitcoin transaction broadcasting.
- Mainnet/Testnet transaction signing.
- Wallet integration.
- UTXO synchronization.
- P2P networking.
- Mining.
- Real consensus validation.
- Real private-key handling.
- External blockchain RPC requirements.

The project brief explicitly states that the simulator is educational and is not a replacement for Bitcoin Core or a real smart-contract platform.

---

# 5. Recommended Technology Direction

The assignment document does not mandate a specific technology stack. For the 24-hour implementation window, use the simplest reliable web stack already supported by the environment.

### Recommended stack

- **Frontend:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Execution engine:** TypeScript modules running locally in the browser
- **State management:** React state/hooks unless complexity requires a small dedicated store
- **Testing:** Jest/Vitest + React Testing Library, or the existing test setup if the project already has one

### Important architecture rule

Keep the **execution engine independent from the UI**.

The parser/executor must be testable without rendering React components.

Recommended high-level structure:

```text
UI
 ├── Script Editor
 ├── Controls
 ├── Current Stack View
 ├── Step Information
 ├── Execution Trace
 └── Final Result

Core Engine
 ├── Tokenizer / Parser
 ├── Instruction Validator
 ├── Opcode Registry
 ├── Stack Engine
 ├── Execution Engine
 ├── Error System
 └── Trace Builder
```

---

# 6. Non-Negotiable Functional Requirements

Antigravity must not mark the project complete until all of the following work:

### A. Input

The user can enter a script in a readable multi-line editor.

### B. Parsing

The application converts the script into ordered instructions/tokens.

### C. Validation

Unsupported instructions and malformed input are rejected with a human-readable error.

### D. Execution

The execution engine processes instructions sequentially against a stack.

### E. Stack state

The current stack is visible at all times during execution.

### F. Step-by-step mode

The user can move through execution one instruction at a time.

### G. Full execution

The user can execute the complete script without manually stepping.

### H. Trace

Every executed instruction records enough information to reconstruct the execution journey.

### I. Errors

Stack underflow and invalid instructions must be detected and displayed clearly.

### J. Final result

The simulator clearly displays whether the script is `VALID` or `INVALID`.

---

# 7. Phase Plan

The implementation must be completed in the following phases. Do not skip a phase. Each phase ends with a verification checkpoint.

---

# PHASE 0 — Project Setup and Safety Baseline

## Objective

Create the project foundation without overengineering it.

## Tasks

### 0.1 Repository/project inspection

- Inspect the existing repository before making changes.
- Identify current framework, package manager, scripts, and folder structure.
- Reuse existing project setup where practical.
- Do not delete or rewrite unrelated files.

### 0.2 Create/confirm application structure

Create clear modules for:

```text
src/
  app/ or pages/
  components/
  features/simulator/
  engine/
  types/
  utils/
```

Adapt paths to the actual project structure rather than forcing this exact layout.

### 0.3 Establish development commands

Confirm that these work:

- install dependencies
- start development server
- build production bundle
- run tests/lint if configured

### 0.4 Establish coding rules

- TypeScript strictness where practical.
- No `any` unless genuinely unavoidable.
- No hard-coded UI behavior inside the execution engine.
- No fake execution results.
- No backend unless required by the existing project.

## Phase 0 checkpoint

The application boots successfully and the repository is clean.

---

# PHASE 1 — Data Model and Script Representation

## Objective

Define the data structures used throughout the simulator.

## Tasks

### 1.1 Define stack value type

Support at minimum:

```text
Number / integer values
Boolean values
```

The implementation may use a unified internal value model such as:

```ts
{ type: 'number', value: 5 }
{ type: 'boolean', value: true }
```

Do not mix raw values and formatted UI strings inside the execution engine.

### 1.2 Define instruction model

Each parsed instruction should contain enough information for the UI and executor, such as:

- opcode/name
- optional argument
- original source text
- instruction index

### 1.3 Define execution state

The engine should be able to represent:

- current instruction index
- current stack
- execution status
- error state
- trace/history
- final result

### 1.4 Define trace entry

Each trace entry should capture at minimum:

- step number
- instruction/opcode
- stack before execution
- stack after execution
- status
- optional explanation/error

This is required to support step-by-step visualization and history review.

## Phase 1 checkpoint

Types/interfaces exist and can represent a complete execution without depending on React components.

---

# PHASE 2 — Parser and Instruction Validator

## Objective

Convert the user's script text into valid instructions.

## Tasks

### 2.1 Input normalization

Handle:

- multiple lines
- extra spaces
- blank lines
- leading/trailing whitespace
- case normalization where appropriate

### 2.2 Tokenization

For example:

```text
PUSH 5
PUSH 3
ADD
```

becomes ordered instructions such as:

```text
PUSH(5)
PUSH(3)
ADD
```

### 2.3 Instruction validation

Validate:

- opcode exists
- opcode spelling is valid
- required arguments exist
- argument types are valid
- instruction format is correct

### 2.4 Parser error messages

Errors must be understandable to a student.

Bad:

```text
SyntaxError
```

Better:

```text
Line 2: PUSH requires one numeric value.
```

### 2.5 Preserve source location

Where possible, retain line number/source text so an error can point back to the relevant instruction.

## Phase 2 checkpoint

Valid scripts produce structured instructions; invalid scripts produce clear validation errors and do not start execution.

---

# PHASE 3 — Core Stack Engine

## Objective

Implement the fundamental stack behavior independently from the UI.

## Tasks

### 3.1 Stack operations

Implement safe operations for:

- push
- pop
- peek
- size
- clear/reset

### 3.2 Underflow protection

Any operation that requires more values than currently exist must fail safely.

Example:

```text
ADD
```

on an empty stack should produce a clear error such as:

```text
ADD requires 2 stack values, but only 0 are available.
```

### 3.3 Immutability of recorded states

Trace snapshots must not accidentally point to the same mutable stack object.

Each recorded stack state must be a snapshot.

### 3.4 Utility formatting

Create a consistent way to render stack values for the UI.

## Phase 3 checkpoint

The stack engine passes unit tests for push/pop/peek/underflow and state snapshots.

---

# PHASE 4 — Opcode Execution Engine

## Objective

Implement the simplified Script opcode set required by the project brief.

## Required MVP opcodes

### 4.1 `PUSH <number>`

Push a numeric value onto the stack.

Example:

```text
PUSH 5
```

Result:

```text
[5]
```

### 4.2 `ADD`

Pop the top two numeric values, add them, and push the result.

Example:

```text
[5, 3]
```

becomes:

```text
[8]
```

### 4.3 `EQUAL`

Pop the top two values, compare them, and push a boolean result.

Example:

```text
[8, 8]
```

becomes:

```text
[TRUE]
```

### 4.4 `VERIFY`

Use the opcode as a validation step: it should require a valid truth value at the top of the stack and fail execution when the required condition is not satisfied.

The exact behavior should be kept consistent throughout the simulator and explained in the UI.

> **Important:** The PDF names `VERIFY` as an important opcode example but does not provide a complete formal semantics for it. Therefore, implement only the simplified educational behavior needed for this simulator and document that this is a simplified model.

## 4.5 Opcode registry

Do not write a large `if/else` chain directly inside the main executor.

Prefer a registry/dispatch design:

```text
opcode name → execution handler + metadata
```

Metadata can include:

- opcode name
- short description
- expected input count
- output behavior

This will make future opcode additions easy.

## 4.6 Invalid opcode handling

Unsupported instructions should fail before execution or at execution validation with an explanatory message.

## Phase 4 checkpoint

The engine can correctly execute the project's working example:

```text
PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL
```

and returns `VALID` with final stack `[TRUE]`.

---

# PHASE 5 — Execution Lifecycle and Trace System

## Objective

Connect parsing + validation + stack + opcodes into one deterministic execution pipeline.

## Tasks

### 5.1 Build the execution pipeline

```text
Raw Script
   ↓
Parse
   ↓
Validate
   ↓
Create Initial State
   ↓
Execute Instruction 0
   ↓
Record Trace
   ↓
Execute Instruction 1
   ↓
Record Trace
   ↓
...
   ↓
Final Result
```

### 5.2 Record every state

The trace must begin with:

```text
Initial []
```

Then record the stack after each instruction.

### 5.3 Capture failed steps

When an instruction fails, record:

- failing instruction
- stack before failure
- error message
- execution status

### 5.4 Final validation result

For this educational simulator, final status must be explicitly represented as:

```text
VALID
```

or

```text
INVALID
```

The UI must not infer the result merely from whether the JavaScript function returned without throwing.

### 5.5 Deterministic execution

The same script must always produce the same result.

## Phase 5 checkpoint

The complete simulator core can produce a full execution trace without the UI.

---

# PHASE 6 — Simulator UI

## Objective

Turn the engine into the interactive educational tool described in the project brief.

## 6.1 Main layout

Use a clear educational dashboard layout.

Recommended sections:

```text
┌────────────────────────────────────────────┐
│ Header / Project Title                     │
├───────────────────┬────────────────────────┤
│ Script Editor      │ Current Stack          │
│                   │                        │
│                   │ Step Information       │
│                   │                        │
├───────────────────┴────────────────────────┤
│ Controls                                   │
├────────────────────────────────────────────┤
│ Execution Trace                            │
├────────────────────────────────────────────┤
│ Final Result / Error                       │
└────────────────────────────────────────────┘
```

The exact layout can differ, but all important information must remain visible and easy to understand.

## 6.2 Script editor

Include:

- multiline input
- clear formatting
- sample script
- reset button

### Recommended default example

```text
PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL
```

## 6.3 Execution controls

Include at minimum:

- **Run** / Execute All
- **Step** / Execute Next
- **Reset**

Optional if time permits:

- Pause
- Replay
- Jump to step

Do not allow optional controls to destabilize the core flow.

## 6.4 Current stack visualization

Make the stack visually obvious.

Each stack item should look like a separate value/block/card.

For example:

```text
TOP
┌─────────┐
│ TRUE    │
└─────────┘
```

or for numeric values:

```text
TOP
┌─────────┐
│ 8       │
└─────────┘
┌─────────┐
│ 5       │
└─────────┘
```

Clearly communicate which side is the top of the stack.

## 6.5 Current instruction panel

Show:

- current step number
- current opcode
- operation description
- stack before
- stack after

Example:

```text
Step 3
ADD
Adds the top two numbers.

Before: [5, 3]
After:  [8]
```

## 6.6 Execution trace

Display the complete history in a table or timeline.

Recommended columns:

```text
Step | Opcode | Stack Before | Stack After | Status
```

Example:

```text
0    | Initial | []           | []          | —
1    | PUSH 5  | []           | [5]         | OK
2    | PUSH 3  | [5]          | [5,3]       | OK
3    | ADD     | [5,3]        | [8]         | OK
4    | PUSH 8  | [8]          | [8,8]       | OK
5    | EQUAL   | [8,8]        | [TRUE]      | OK
```

## Phase 6 checkpoint

A user can enter a script, run it, step through it, see the stack change, and inspect the complete trace.

---

# PHASE 7 — Error Handling and Educational Feedback

## Objective

Make failures understandable rather than technical.

## Required error categories

### 7.1 Parser errors

Example:

```text
Line 2: Unknown opcode `ADDD`.
```

### 7.2 Missing argument errors

Example:

```text
Line 1: PUSH requires one numeric value.
```

### 7.3 Type errors

Example:

```text
ADD requires numeric values on the top of the stack.
```

### 7.4 Stack underflow

Example:

```text
EQUAL requires 2 values, but only 1 is available.
```

### 7.5 VERIFY failure

Provide a readable explanation of why the validation failed.

## 7.6 Educational explanations

Each supported opcode should have a short description visible somewhere in the interface.

For example:

```text
ADD
Takes the top two numbers and pushes their sum.
```

Avoid unnecessary blockchain jargon.

## Phase 7 checkpoint

Every expected failure mode is caught, presented clearly, and does not crash the application.

---

# PHASE 8 — Validation, Testing, and Final Polish

## Objective

Prove that the project works and make it presentation-ready for evaluation.

## 8.1 Unit tests

Test the core engine, not just the UI.

### Parser tests

- valid PUSH
- valid opcode
- unknown opcode
- malformed instruction
- missing PUSH argument
- invalid PUSH value

### Stack tests

- push
- pop
- peek
- multiple values
- underflow
- reset

### Opcode tests

- PUSH
- ADD
- EQUAL
- VERIFY

### Execution tests

- successful complete script
- invalid script
- insufficient stack values
- invalid types
- final VALID result
- final INVALID result
- trace generation

## 8.2 End-to-end manual scenarios

At minimum, manually verify these scenarios.

### Scenario A — Working example

```text
PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL
```

Expected:

```text
VALID
Final stack: [TRUE]
```

### Scenario B — Equality failure

```text
PUSH 5
PUSH 3
EQUAL
```

Expected: result must reflect a false equality condition according to the simplified execution model.

### Scenario C — ADD underflow

```text
ADD
```

Expected: clear stack-underflow error.

### Scenario D — Invalid opcode

```text
PUSH 5
MAGIC
```

Expected: unknown-opcode error.

### Scenario E — Missing PUSH argument

```text
PUSH
```

Expected: parser/validation error.

## 8.3 UI checks

Verify:

- responsive layout
- no console errors during normal use
- buttons work
- reset actually resets all state
- step mode does not skip instructions
- trace remains consistent with displayed stack
- error state is visually obvious
- result state is obvious

## 8.4 Build check

Run a production build.

The project must compile without errors.

## 8.5 Final cleanup

Remove:

- unused imports
- dead components
- console debugging logs
- temporary test UI
- unnecessary packages
- duplicate logic

Do not remove source files that are part of the working architecture merely because they are not directly rendered.

## Phase 8 checkpoint

The project is stable, demonstrable, and ready for lab evaluation.

---

# 8. Recommended UI/UX Direction

The visual goal should be a **developer-tool / blockchain-lab simulator**, not a generic marketing website.

Use:

- clear hierarchy
- strong typography
- high contrast for code and stack values
- subtle status indicators
- cards/panels for execution state
- readable monospace styling for scripts and stack values
- obvious VALID / INVALID states
- restrained animations only where they improve understanding

Avoid:

- excessive gradients
- huge hero sections
- irrelevant marketing copy
- decorative blockchain graphics that distract from execution
- excessive animations
- complex navigation

The user should understand the simulator within a few seconds of opening it.

---

# 9. Suggested Screen Components

## Header

Display:

**Bitcoin Script Execution Simulator**

Subtitle:

**Visualize stack-based Script execution step-by-step**

## Script input panel

Include:

- editor
- Load Example
- Reset
- Run
- Step

## Stack panel

Display:

- current stack
- top-of-stack indicator
- current step

## Opcode information panel

Display:

- opcode name
- short explanation
- input requirement
- resulting operation

## Trace panel

Display every instruction and stack transition.

## Result panel

Display:

```text
VALID
```

or

```text
INVALID
```

plus a concise explanation.

---

# 10. Suggested Internal API

Keep internal interfaces predictable.

Example conceptual interfaces:

```ts
parseScript(source: string): ParseResult

validateInstructions(instructions: Instruction[]): ValidationResult

executeInstruction(
  instruction: Instruction,
  stack: Stack
): InstructionExecutionResult

executeScript(
  instructions: Instruction[]
): ExecutionResult
```

Suggested result model:

```ts
ExecutionResult {
  status: 'VALID' | 'INVALID'
  finalStack: StackValue[]
  trace: TraceEntry[]
  error?: ExecutionError
}
```

These are implementation guidance, not a requirement to use identical type names.

---

# 11. Definition of Done

The project is considered complete only when all of these are true:

## Core engine

- [ ] Script can be parsed.
- [ ] Instructions are validated.
- [ ] Stack engine works.
- [ ] Required opcodes work.
- [ ] Stack underflow is handled.
- [ ] Invalid instructions are handled.
- [ ] Execution is deterministic.
- [ ] Trace is generated.
- [ ] Final result is produced.

## UI

- [ ] Script editor works.
- [ ] Example script is available.
- [ ] Run works.
- [ ] Step works.
- [ ] Reset works.
- [ ] Current stack is visible.
- [ ] Current operation is visible.
- [ ] Trace is visible.
- [ ] Errors are visible.
- [ ] VALID/INVALID status is visible.

## Quality

- [ ] Core logic has tests.
- [ ] Working example passes.
- [ ] Invalid cases are demonstrated.
- [ ] Production build succeeds.
- [ ] No obvious console errors.
- [ ] No unnecessary files or dependencies remain.

---

# 12. Demo Script Set for Evaluation

Keep these scripts available as presets/examples in the UI or in a clearly documented demo section.

## Demo 1 — Main successful example

```text
PUSH 5
PUSH 3
ADD
PUSH 8
EQUAL
```

## Demo 2 — Arithmetic + equality variation

Use another small valid arithmetic sequence that demonstrates the same engine without requiring additional blockchain behavior.

## Demo 3 — Stack underflow

```text
ADD
```

## Demo 4 — Invalid opcode

```text
PUSH 5
MAGIC
```

## Demo 5 — Missing argument

```text
PUSH
```

---

# 13. Optional Extensions — ONLY After the Core Project Is Stable

These are not required for the core submission and must not delay completion.

Possible extensions:

- additional stack manipulation opcodes
- richer opcode reference panel
- animated stack transitions
- trace replay controls
- keyboard shortcuts
- script presets
- export trace as text/JSON
- educational glossary

Do not implement optional extensions until the Definition of Done is satisfied.

---

# 14. Antigravity Execution Rules

Antigravity should follow these rules throughout implementation:

### Rule 1 — Build phase by phase

Complete one phase, verify it, then continue.

### Rule 2 — Do not skip verification

After each phase, run the relevant tests or manual checks.

### Rule 3 — Keep engine and UI separate

The simulator core must not depend on React rendering.

### Rule 4 — Do not fabricate blockchain behavior

Only implement behavior that is explicitly required or clearly defined as a simplified educational behavior.

### Rule 5 — Prefer a working MVP over unnecessary complexity

This is a 24-hour lab project. Reliability and demonstrability are more important than production-scale architecture.

### Rule 6 — Preserve trace consistency

The trace, current stack, and final stack must all come from the same execution state.

### Rule 7 — Make errors useful to students

Error messages should answer:

**What went wrong? Where did it happen? What did the engine expect?**

### Rule 8 — Do not leave fake buttons

Every visible primary control must work.

### Rule 9 — Do not introduce unnecessary backend services

If the simulator can run entirely in the browser, keep it local.

### Rule 10 — Document simplifications

Where the simulator differs from complete Bitcoin Script semantics, label it as a simplified educational model rather than implying full protocol compatibility.

---

# 15. Final Presentation Narrative

For the final lab evaluation, the project should be explainable in this sequence:

### Step 1 — Problem

Bitcoin Script is stack-based, so beginners cannot easily see how an opcode changes the internal stack.

### Step 2 — Solution

This simulator makes each execution step visible.

### Step 3 — Input

The user enters a simplified Script program.

### Step 4 — Parsing

The program is tokenized and validated.

### Step 5 — Execution

Opcodes execute sequentially against a stack.

### Step 6 — Visualization

After every operation, the new stack state is shown.

### Step 7 — Trace

The complete execution history is recorded.

### Step 8 — Validation

The user sees a final VALID/INVALID result and useful error information.

### Step 9 — Educational value

The user can learn Script execution by observing it rather than mentally simulating every stack operation.

---

# 16. Source Alignment

This implementation plan is derived from the uploaded project brief:

- The introduction describes Bitcoin Script as a stack-based, non-Turing-complete scripting system used to define spending conditions.
- The problem statement emphasizes the lack of interactive stack visualization.
- The proposed solution specifies script input, parsing, execution, stack-state display, validation, errors, and execution trace.
- The architecture describes the seven-step execution lifecycle.
- The working example uses `PUSH 5`, `PUSH 3`, `ADD`, `PUSH 8`, `EQUAL` and ends with `VALID` and `[TRUE]`.
- The results section expects parsed scripts, executed opcodes, stack visualization, detected errors, and an execution trace.

Where this README makes implementation choices beyond the brief—such as the recommended frontend stack, folder organization, internal interfaces, and test organization—those are practical engineering recommendations for completing the project quickly and reliably, not claims that the assignment document mandates them.

---

# 17. Build Order Summary

Implement in exactly this order:

```text
PHASE 0  → Setup
PHASE 1  → Data Model
PHASE 2  → Parser + Validator
PHASE 3  → Stack Engine
PHASE 4  → Opcode Engine
PHASE 5  → Execution + Trace
PHASE 6  → UI
PHASE 7  → Errors + Educational Feedback
PHASE 8  → Testing + Polish + Final Demo
```

**Critical path:**

```text
Parser
  ↓
Stack Engine
  ↓
Opcodes
  ↓
Execution Trace
  ↓
UI
  ↓
Testing
```

Do not spend the majority of the available time on visual polish before the core execution engine works.
