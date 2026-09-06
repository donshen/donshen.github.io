---
layout: post
title: "Promptimus: Improving already good LLM prompts with zero manual engineering"
external: https://www.amazon.science/blog/promptimus-improving-already-good-llm-prompts-with-zero-manual-engineering
venue: Amazon Science
byline: "with Yunfei Bai, Sullam Jeoung and Shuai Wang"
dek: "Most prompt optimisers assume you are starting from something bad. This one starts from a prompt that already works, and finds what is still wrong with it."
date: 2026-05-14
---

Automatic prompt optimisation usually assumes a weak starting point, which is not the situation most teams are in. You have a prompt that took real effort, it works well enough to ship, and you have no idea which of its parts are load-bearing.

Promptimus is a model-agnostic framework for that case. It runs a four-step loop: evaluate, generate feedback, propose a strategy and an edit, then evaluate the candidate. Metric-analysing agents diagnose *where* a prompt fails rather than scoring it as a whole, and the edits are surgical instead of full rewrites, so whatever already worked tends to survive.

It reaches the best result on 16 of 20 benchmarks against six leading automatic prompt optimisation methods, averaging 0.792 against 0.765 for the strongest baseline, from only 20 to 50 samples. Across enterprise tasks on seven target models the gains ran from 3.18% to 90.27%.
