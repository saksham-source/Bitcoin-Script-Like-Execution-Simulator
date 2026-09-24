# Bitcoin Script Execution Simulator

An interactive, educational simulator for stack-based Bitcoin Script execution built for Blockchain Lab evaluation.

![Simulator Interface](https://img.shields.io/badge/Status-Complete-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![Tests](https://img.shields.io/badge/Tests-34%20Passed-emerald)

---

## 🎯 Purpose & Scope

Bitcoin Script is a Forth-like stack-based language used to define transaction spending conditions. Because execution modifies an internal stack sequentially, understanding how opcodes like `PUSH`, `ADD`, `EQUAL`, and `VERIFY` behave can be difficult for beginners.

This simulator provides:
- **Interactive Multi-Line Editor:** Enter custom scripts or load demo presets.
- **Visual Stack Chamber:** Animated vertical card visualizer with clear `TOP OF STACK` pointer and data type badges.
- **Step-by-Step Stepping:** Step through instructions one at a time and inspect stack before/after states.
- **Execution Trace Table:** Comprehensive audit log recording every transition, opcode, and status.
- **Student-Friendly Error Handling:** Explanatory messages for syntax errors, unknown opcodes, type mismatches, and stack underflows.
- **Deterministic Validation:** Explicit `VALID` or `INVALID` final evaluation.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Test Suites
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Supported Opcodes

| Opcode | Description | Input Stack | Output Stack |
|---|---|---|---|
| `PUSH <n>` | Pushes a numeric constant onto the stack | None | `[...stack, n]` |
| `ADD` | Pops top 2 numbers, adds them, pushes sum | Top 2 numeric values | `[...stack, a + b]` |
| `EQUAL` | Pops top 2 values, pushes `TRUE` if equal, `FALSE` otherwise | Top 2 values | `[...stack, a == b]` |
| `VERIFY` | Pops top value, halts with failure if `FALSE` or `0` | Top 1 value | Pops top value |

---

## 📋 Evaluation Scenarios

The simulator includes pre-configured presets:
1. **Standard Arithmetic (`VALID`):** `PUSH 5 \n PUSH 3 \n ADD \n PUSH 8 \n EQUAL` &rarr; `[TRUE]` (`VALID`)
2. **Equality Failure (`INVALID`):** `PUSH 5 \n PUSH 3 \n EQUAL` &rarr; `[FALSE]` (`INVALID`)
3. **Stack Underflow:** `ADD` on empty stack &rarr; Clear error reporting required items
4. **Unknown Opcode:** `PUSH 5 \n MAGIC` &rarr; Parser rejection with line number
5. **Missing Argument:** `PUSH` &rarr; Parser validation rejection
6. **Condition Verification:** `PUSH 10 \n PUSH 10 \n EQUAL \n VERIFY \n PUSH 1` &rarr; Spending condition verified

---

## 🏗 Architecture

The simulator is built with a strictly decoupled architecture:
- **`src/engine/`**: Pure TypeScript engine independent of any UI framework.
  - `types.ts`: Data models for `StackValue`, `Instruction`, `TraceEntry`, `ExecutionResult`.
  - `parser.ts`: Tokenization and instruction validation with line numbers.
  - `stack.ts`: Encapsulated stack engine with underflow protection and immutable state cloning.
  - `opcodes.ts`: Opcode dispatch registry.
  - `executor.ts`: Deterministic execution pipeline and step machine.
- **`src/features/simulator/`**: React integration container coordinating state.
- **`src/components/`**: Modular presentation components (Editor, Visualizer, Inspector, Trace, Header).

---

## 📄 License
MIT
