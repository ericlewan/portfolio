---
title: "Why I stopped making Figma<br /><em>components for everything</em>"
date: "2025-03-01"
description: "When component libraries help and when they slow you down. A designer's honest take on Figma component overengineering."
---

There was a time when I thought the right move was to componentize everything. Buttons, obviously. Cards, sure. But also one-off modals, specific page sections, that little divider I used twice.

I was wrong. Not about components in general — they're essential. But about the threshold for when something should become one.

---

## The overhead nobody talks about

Every component you create is a promise. A promise that you'll maintain it, update it when the design changes, document it well enough for someone else to use it.

Most one-off things don't earn that promise.

When I was building Quidget's design system from scratch, I started with good intentions: componentize as you go. By month three, I had a library of 200+ components, half of which only appeared once in the entire product. Changing anything required auditing every instance. It was slower than just having static frames.

## When components actually make sense

Things that benefit from being components: UI elements that appear in more than two or three different contexts. Elements that need to stay in sync across pages — buttons, inputs, nav. Anything with defined states (hover, disabled, error) you'll need to show in mockups. Design tokens.

Things that don't: a header that only exists on one page. A section layout built specifically for one screen. That one illustration wrapper you used that one time.

## The question I ask now

Before making something a component: *will I use this in a meaningfully different context in the next two weeks?* If not, I leave it as a frame. I can always promote it to a component later. I can't easily un-make a bloated library.

The goal is a design system that's useful, not one that's comprehensive.
