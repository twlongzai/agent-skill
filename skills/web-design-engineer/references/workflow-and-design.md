# Workflow and Design Guidance

Read the relevant sections for a new design, substantial redesign, or explicit visual review. For a local correction, follow the existing design and skip unrelated exploration.

## Choosing a Workflow

### Understand the Requirements (ask only when needed)

Keep momentum. Ask only when the missing answer cannot be inferred safely from the prompt, repository, assets, screenshots, or existing design system:

| Scenario | Ask? |
|---|---|
| "Make a deck" (no PRD, no audience) | Ask a concise clarifying question before building |
| "Use this PRD to make a 10-min deck for Eng All Hands" | Enough info - start building |
| "Turn this screenshot into an interactive prototype" | Ask only if intended interactions are unclear |
| "Make 6 slides about the history of butter" | Ask about audience and tone |
| "Design onboarding for my food-delivery app" | Ask about users, flow, brand, and fidelity if absent |
| "Recreate the composer UI from this codebase" | Read the code directly - no questions needed |

Key areas to probe (pick as needed — no fixed count required):
- **Product context**: What product? Target users? Existing design system / brand guidelines / codebase?
- **Output type**: Web page / prototype / slide deck / animation / dashboard? Fidelity level?
- **Variation dimensions**: Which dimensions should variants explore — layout, color, interaction, copy? How many?
- **Constraints**: Responsive breakpoints? Dark/light mode? Accessibility? Fixed dimensions?

### Gather Design Context (by priority)

Read the context needed for the requested change. For substantial design work, use this priority order:

1. **Resources the user proactively provides** (screenshots / Figma / codebase / UI Kit / design system) - inspect the relevant parts and extract the tokens needed for the task
2. **Existing local product surfaces** - inspect nearby pages, components, CSS, assets, and tests before inventing a new language
3. **External product references** - ask before relying on external sites or network-dependent assets unless the user already requested them
4. **Starting from scratch** - state the assumptions briefly, then establish a temporary system based on industry best practices

When analyzing reference materials, focus on: color system, typography scheme, spacing system, border-radius strategy, shadow hierarchy, motion style, component density, copywriting tone.

> **Code over screenshots**: When the user provides both a codebase and screenshots, invest your effort in reading source code and extracting design tokens rather than guessing from screenshots - source identifies reusable tokens and behavior; screenshots show the rendered appearance.

#### When Adding to an Existing UI

This is more common than designing from scratch. **Understand the visual vocabulary first, then act** - summarize the key observations in a short progress update so the user can validate your reading:

- **Color & tone**: The actual usage ratio of primary / neutral / accent colors? Does the copy feel engineer-oriented, marketing-oriented, or neutral?
- **Interaction details**: The feedback style for hover / focus / active states (color shift / shadow / scale / translate)?
- **Motion language**: Easing function preferences? Duration? Are transitions handled with CSS transition, CSS animation, or JS?
- **Structural language**: How many elevation levels? Card density — sparse or dense? Border-radius uniform or hierarchical? Common layout patterns (split pane / cards / timeline / table)?
- **Graphics & iconography**: Icon library in use? Illustration style? Image treatment?

Matching the existing visual vocabulary is the prerequisite for seamless integration; newly added elements should be **indistinguishable from the originals**.

### Declare the Design Direction Before Editing

Before significant implementation, articulate the design direction in Markdown. Do not block for confirmation unless the user asked for staged approval or the context is too ambiguous to choose responsibly; otherwise state the direction and proceed.

```markdown
Design Decisions:
- Color palette: [primary / secondary / neutral / accent]
- Typography: [heading font / body font / code font]
- Spacing system: [base unit and multiples]
- Border-radius strategy: [large / small / sharp]
- Shadow hierarchy: [elevation 1–5]
- Motion style: [easing curves / duration / trigger]
```

### Produce a Small Viewable First Pass

For exploratory or ambiguous work, create a viewable v0 using placeholders + key layout + the declared design system. For targeted implementation in an existing app, a thin complete first pass in the real files is acceptable as long as it is easy to inspect and revise.

- The goal of v0: **let the user course-correct early** - Is the tone right? Is the layout direction right? Are the variant directions right?
- Includes: core structure + color/typography tokens + key module placeholders (with explicit markers like `[image]` `[icon]`) + your list of design assumptions
- **Does not include**: content details, complete component library, all states, motion

Use a first pass to expose consequential design choices early. Continue through the agreed implementation and verification unless the user requested an approval checkpoint; v0 is not the default completion point.

### Full Build

After the design direction is clear, write full components, add states, and implement motion. Follow the technical specifications and design principles below. If an important decision point cannot be inferred from context, pause and ask; otherwise choose conservatively, explain the choice, and keep building.

### Verification

Use the completion criteria in `../SKILL.md`. Select the checks relevant to the changed surface; a local correction does not require the full design workflow.

---

## Design Principles

### Avoid AI-Style Clichés

Watch for generic choices that do not serve the brief. These are design-review cues, not bans on a color, shape, or typeface:

- Overuse of gradient backgrounds (especially purple-pink-blue gradients)
- Rounded cards with a colored left-border accent
- Drawing complex graphics with SVG (use placeholders and request real assets instead)
- Cookie-cutter gradient buttons + large-radius card combos
- Choosing a font by habit instead of checking brand fit, language coverage, readability, and available assets. Inter, Roboto, Arial, Fraunces, and system fonts are valid when they fit those needs.
- Meaningless stats / numbers / icon spam ("data slop")
- Fabricated customer logo walls or fake testimonial counts

### Emoji Rules

**No emoji by default.** Only use emoji when the target design system/brand itself uses them (e.g., Notion, early Linear, certain consumer brands), and match their density and context precisely.

- Bad: using emoji as icon substitutes ("I don't have an icon library, so I'll use emoji as fillers")
- Bad: using emoji as decorative filler ("let's add an emoji before the heading to make it lively")
- Good: no icon available -> use a placeholder (see "Placeholder Philosophy" below) to signal that a real icon is needed
- Good: the brand itself uses emoji -> follow the brand

---

### Placeholder Philosophy

**When you lack icons, images, or components, a placeholder is more professional than a poorly drawn fake.**

- Missing icon -> square + label (e.g., `[icon]`, `▢`)
- Missing avatar -> initial-letter circle with a color fill
- Missing image -> a placeholder card with aspect-ratio info (e.g., `16:9 image`)
- Missing data -> proactively ask the user for it; never fabricate
- Missing logo -> brand name in text + a simple geometric shape

A placeholder signals "real material needed here." A fake signals "I cut corners."

### Visual Exploration

- Play with proportion and whitespace to create visual rhythm
- Explore strong type-size contrast when the format supports it; confirm readable wrapping at target sizes
- Use color fills, textures, layering, and blend modes to create depth
- Experiment with unconventional layouts, novel interaction metaphors, and thoughtful hover states
- Use CSS animations + transitions for polished micro-interactions (button press, card hover, entry animations)
- Use SVG filters, `backdrop-filter`, `mix-blend-mode`, `mask`, and other advanced CSS to create memorable moments

CSS, HTML, JS, and SVG are far more capable than most people realize - use them thoughtfully.

### Appropriate Scale

| Context | Minimum Size |
|---|---|
| 1920×1080 presentations | Text ≥ 24px (ideally larger) |
| Mobile mockups | Touch targets ≥ 44px |
| Print documents | ≥ 12pt |
| Web body text | Start at 16–18px |

### Content Principles

- **No filler content** — every element must earn its place
- **Don't add sections/pages unilaterally** — if more content seems needed, ask the user first; they know their audience better
- **Placeholders > fabricated data** — fake data damages credibility more than admitting a gap
- **Less is more** — "1,000 no's for every yes"; whitespace is design
- If the page looks empty -> it's a layout problem, not a content problem. Solve it with composition, whitespace, and type-scale rhythm, not by stuffing content in

---

### Static Visual Comparison vs. Full Flow

- **Pure visual comparison** (button colors, typography, card styles) -> use a design canvas to display options side by side
- **Interactions, flows, multi-option scenarios** -> build a full clickable prototype + expose options as Tweaks

---

## Variant Exploration Philosophy

Use variants to compare the design dimensions requested by the user. Stop when the requested alternatives are usable and their tradeoffs are clear; do not exhaust every possibility.

When the user asks for exploration, explore "atomic variants" across these dimensions - mixing conservative, safe options with bold, novel ones:

1. **Layout**: content organization (split pane / card grid / list / timeline)
2. **Visual**: color palette, typography, texture, layering
3. **Interaction**: motion, feedback, navigation patterns
4. **Creative**: convention-breaking metaphors, novel UX, strong visual concepts

Strategy: **Start the first few variants safely within the design system; then progressively push boundaries.** Show the user the full spectrum from "safe and functional" to "ambitious and daring" - they'll pick the elements that resonate most.

---

## Tweaks Panel (Live Parameter Adjustment)

For exploratory prototypes, let users adjust design parameters in real time: theme color, font size, dark mode, spacing, component variants, content density, animation toggles, etc. Do not add a Tweaks panel to production UI or an existing app surface unless the user requests it.

Design guidelines:
- A floating panel in the bottom-right corner (see the reference implementation)
- Title consistently labeled **"Tweaks"**
- **Completely hidden** when closed, ensuring the design looks final during presentations
- In multi-variant scenarios, expose variants as dropdowns/toggles within Tweaks instead of creating multiple files
- For standalone exploratory artifacts, add 1-2 useful controls by default if they help compare directions

---

## Collaborating with the User

- **Show work-in-progress early when scope warrants it**: a v0 with assumptions + placeholders is more valuable than a polished v1 when the desired direction is uncertain
- Explain decisions using **design language** ("I tightened the spacing to create a tool-like feel"), not technical language
- Clarify feedback when the ambiguity materially changes the outcome and cannot be resolved from the brief.
- Offer variants when exploration is requested or useful; keep their number proportional to the decision.
- At delivery, briefly state what changed, what was verified, and any remaining limitations or decisions.

---
