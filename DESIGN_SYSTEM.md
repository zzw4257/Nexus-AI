# Nexus AI - Design System & Visual Language
*Version 1.0*

This document outlines the core visual principles for the Nexus AI platform, embracing a retro-futuristic, pixel-art aesthetic.

## 1. Typography

**Primary Font:** `DotGothic16`

- **Source:** Google Fonts
- **Rationale:** A high-quality, open-source 16x16 bitmap-style font that perfectly captures the desired retro-tech feel. It offers excellent readability for a pixel font.
- **Usage:** To be used for all UI elements, including titles, labels, body text, and terminal output.

## 2. Color Palette

The palette is designed to be reminiscent of classic terminal interfaces, with a dark background and vibrant, glowing foreground colors.

- **Backgrounds:**
  - `Primary (BG-Primary)`: `#0D0221` (Deep Space Indigo)
  - `Secondary (BG-Secondary)`: `#261447` (Dark Violet)
  - `Tertiary (BG-Tertiary)`: `#3E2F5B` (Abyssal Purple)

- **Foregrounds & Text:**
  - `Primary Text`: `#F0F0F0` (Ghost White)
  - `Secondary Text`: `#A0A0A0` (Medium Gray)
  - `Accent/Highlight`: `#00F0FF` (Electric Cyan)

- **Semantic Colors:**
  - `Success`: `#00FF7F` (Spring Green)
  - `Warning`: `#FFD700` (Gold)
  - `Error`: `#F44336` (Crimson Red)
  - `Info`: `#2196F3` (Sky Blue)
  - `Active/Running`: `#7CFC00` (Lawn Green)

## 3. Iconography

Icons will be simple, blocky, and constructed from basic geometric shapes or characters, adhering to the pixel-art style. They should be clear and instantly recognizable.

- **Style:** Monochrome, using `Primary Text` or `Accent` color.
- **Examples:**
  - `Model`: `[M]` or a 3x3 block grid
  - `Tool`: `[T]` or a simple hammer/wrench shape
  - `Agent`: `[A]` or a simple robot head shape
  - `Settings`: `[S]` or a gear shape
  - `Add/New`: `[+]`
  - `Delete`: `[-]` or `[X]`

## 4. Core Component Styles

### Button
- **Default:** `[ Button Text ]` - A simple bracketed text. Background is transparent. Text is `Primary Text`.
- **Hover:** `[>Button Text<]` - Add arrows to indicate interactivity. Text color changes to `Accent`.
- **Primary Action:** `[███ Button ███]` - A solid block background (`Accent` color) with `BG-Primary` text.

### Card
- A container with a solid border, using box-drawing characters for a retro look.
- It will have a header and a body.

```
┌─ Card Title ──────────┐
│                       │
│  Card content goes    │
│  here.                │
│                       │
└───────────────────────┘
```

## 5. High-Level Mockups (ASCII Art)

### Mockup 1: Hybrid Resource Monitoring Dashboard

```
========================= NEXUS AI - v0.1a =========================
[Dashboard] [Models] [Studio] [Marketplace] [Settings]       [Logout]
┌── Hybrid Resource Monitor ────────────────────────────────────────┐
│                                                                    │
│  CLOUD RESOURCES                                LOCAL NODES        │
│  ┌──────────────────┐                           ┌────────────────┐ │
│  │ OpenAI API       │                           │ node-01 (Local)│ │
│  │ Quota: [■■■■■■■■■■□□□□□] 70% │                           │ Status: [ONLINE] │ │
│  │ Cost: $12.34 (this month)│                           │ GPU: RTX 4090  │ │
│  └──────────────────┘                           │ Util: [■■■■■□□□□□] 50% │ │
│  ┌──────────────────┐                           │ VRAM: [■■■■■■■□□□] 75% │ │
│  │ Anthropic API    │                           └────────────────┘ │
│  │ Quota: [■■■■■□□□□□□□□□□] 35% │                           ┌────────────────┐ │
│  │ Cost: $5.67 (this month) │                           │ node-02 (Cloud)│ │
│  └──────────────────┘                           │ Status: [OFFLINE]│ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
┌── Recent Activity ────────────────────────────────────────────────┐
│ [10:34] Agent "research-bot" completed run successfully.           │
│ [10:32] Model "llama3-8b" was stopped on node-01.                  │
│ [10:30] ERROR: ComfyUI workflow "gen-video-01" failed.             │
└────────────────────────────────────────────────────────────────────┘
```

### Mockup 2: Visual Agent Builder

```
======================== Agent Studio: "News-Summarizer" =========================
[Save] [Run Agent] [Debug]                                     [Back to Studio]
┌─ NODES ──────────┐ ┌── CANVAS ────────────────────────────────────────────────┐ ┌─ INSPECTOR ───────┐
│ ▨ LLM            │ │                                                         │ │ Node: LLM Call    │
│  [+] LLM Call    │ │  ┌──────────────┐      ┌───────────────┐      ┌────────┐  │ │ ID: fetch_news_llm│
│  [+] Classifier  │ │  │ User Input   ├─────>│ Tool:         ├─────>│ Output │  │ ├───────────────────┤
│                  │ │  │ "Topic?"     │      │ search_web()  │      │        │  │ │ Model:            │
│ ▨ Tools          │ │  └──────────────┘      └───────────────┘      └────────┘  │ │ [Claude-3-Opus ▼] │
│  [T] Web Search  │ │         │                                                 │ │ Prompt:           │
│  [T] Calculator  │ │         │           ┌───────────────┐                     │ │ "Find 3 recent... │
│                  │ │         └──────────>│ LLM Call:     │                     │ │ Temperature:      │
│ ▨ Logic          │ │                     │ "Summarize"   │                     │ │ [ 0.7 ]           │
│  [?] Condition   │ │                     └───────────────┘                     │ │                   │
│  [L] Loop        │ │                                                         │ │                   │
└──────────────────┘ └─────────────────────────────────────────────────────────┘ └───────────────────┘
```
