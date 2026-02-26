

# Enhance Shapes Mode: Richer Progression with 10 Shapes by Level 10

## Current Problems
- Shapes are introduced too slowly (2 levels per shape at age 5+)
- Only 6 question types, mostly recognition-based
- By level 10, kids have only done: identify, count sides/corners, color, curved/straight, odd-one-out
- No spatial reasoning, symmetry, pattern, or real-world connection activities

## New Shape Introduction Rate (Age 5+)

Each level adds 2 new shapes, starting with 3 at Level 1:

```text
Level 1:  circle, square, triangle (3)
Level 2:  + rectangle, oval (5)
Level 3:  + diamond, heart (7)
Level 4:  + star, pentagon (9)
Level 5:  + hexagon (10 — all shapes unlocked)
Level 6-10: All 10 shapes, increasingly complex activities
```

Younger ages (3-4) get a slightly slower ramp but still reach all 10 by level 7-8.

## New Activity Types (Beyond Recognition)

| Level Range | Activity Types | Examples |
|---|---|---|
| 1-2 | **Identify**, **Count sides** | "What shape is this?", "How many sides?" |
| 3-4 | **Match description**, **Sort by property** | "Which shape has 4 equal sides?", "Which shapes are curved?" |
| 5-6 | **Symmetry**, **Compare shapes** | "Is this shape symmetrical?", "Which has more sides: pentagon or triangle?" |
| 7-8 | **Real-world match**, **Build from parts** | "Which shape is a stop sign?", "2 triangles make a..." |
| 9-10 | **Pattern completion**, **Multi-property reasoning** | "What comes next: ○ □ △ ○ □ ?", "Name a shape with 4 sides but NOT a square" |

Total: **11 question types** (up from 6), covering recognition, properties, spatial reasoning, real-world application, and logical thinking.

## File Changes

### 1. `src/utils/mathProblems.ts`

**`getShapesForLevel`** (lines 814-838): Rewrite to add +2 shapes per level, all 10 by level 5.

**`getQuestionTypesForLevel`** (lines 844-850): Expand from 6 to 11 types:
- `identify`, `sides`, `corners` (L1-2)
- `match_description`, `sort_property` (L3-4)
- `symmetry`, `compare_shapes` (L5-6)
- `real_world`, `build_from_parts` (L7-8)
- `pattern_completion`, `multi_property` (L9-10)

**`generateShapeProblems`** (lines 852-1010): Add switch cases for the 5 new question types:
- **match_description**: Show a text description, pick the shape that matches
- **sort_property**: "Which of these shapes are curved?" (multiple valid, pick the correct one from choices)
- **symmetry**: "Is this shape symmetrical?" (yes/no with shape visual)
- **compare_shapes**: "Which has more sides?" (show two shapes, pick one)
- **real_world**: "What shape is a clock/stop sign/pizza slice?" (text-only, no visual aid)
- **pattern_completion**: Shape pattern sequence, pick what comes next
- **multi_property**: "Name a shape that is curved AND has no corners" (combining two properties)

### 2. `src/components/math/shared/ShapeDisplay.tsx`
No changes needed — already renders all 10 shapes.

## Expected Outcome
- Level 1 introduces 3 shapes with simple recognition
- Every level adds 2 new shapes, keeping it fresh
- All 10 shapes are known by Level 5
- Levels 5-10 shift focus from "what is this?" to reasoning, real-world connections, and pattern thinking
- The mode becomes a substantive learning feature, not just a naming exercise

