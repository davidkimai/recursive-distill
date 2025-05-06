# Recursive Critique Shells

This document contains the templates for the specialized issue types used in the Recursive Distill review process. Each template serves as a "critique shell" - a structured container for specific types of evaluation and feedback.

## Directory Structure

These templates should be placed in the `.github/ISSUE_TEMPLATE/` directory of each article repository:

```
.github/ISSUE_TEMPLATE/
├── semantic_issue.md
├── empirical_issue.md
├── coherence_issue.md
├── extension_issue.md
└── residue_issue.md
```

## 1. Semantic Issue Template

Filename: `semantic_issue.md`

```yaml
---
name: Semantic Critique Shell
about: Questions about meaning, clarity, and explanation quality
title: '[SEMANTIC] '
labels: 'critique:semantic, priority:triage'
assignees: ''
---

## 🔍 Semantic Critique Shell 

### Location
<!-- Identify the specific section, paragraph, or element this critique addresses -->
**Section**: 
**Element ID** (if applicable): 
**Line/Paragraph**: 

### Semantic Challenge
<!-- Describe the semantic issue or challenge precisely -->

### Clarity Impact
<!-- Rate the impact on overall clarity (1-5, where 5 is most severe) -->
Impact Level: 

### Alternative Expressions
<!-- Suggest alternative phrasings or explanations that might address the issue -->

### Semantic Coherence
<!-- Discuss how this affects the semantic coherence of surrounding content -->

### Reader Perspective
<!-- Describe how different readers might interpret this content differently -->

### References
<!-- Optional: Provide references to support your critique -->

### Recursive Depth
<!-- Is this a surface-level clarity issue, or does it reveal deeper conceptual challenges? -->
- [ ] Surface (wording/phrasing)
- [ ] Intermediate (concept explanation)
- [ ] Deep (foundational understanding)

### 🜏 Symbolic Residue Detection
<!-- If this critique reveals any symbolic residue (epistemic artifacts from failed explanations), document them here -->
- [ ] Terminological drift detected
- [ ] Concept boundary violation
- [ ] Metaphorical inconsistency
- [ ] Explanatory gap
- [ ] Recursive collapse point

**Residue Description**:

### Suggested Resolution Path
<!-- Outline potential paths to address this issue -->

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Issue confirmed
- [ ] Issue resolved
- [ ] Residue cataloged
```

## 2. Empirical Issue Template

Filename: `empirical_issue.md`

```yaml
---
name: Empirical Critique Shell
about: Challenges to data, methodology, or empirical claims
title: '[EMPIRICAL] '
labels: 'critique:empirical, priority:triage'
assignees: ''
---

## 📊 Empirical Critique Shell

### Location
<!-- Identify the specific section, figure, or claim this critique addresses -->
**Section**: 
**Element ID** (if applicable): 
**Claim**: 

### Empirical Challenge
<!-- Describe the empirical issue precisely -->

### Evidence Basis
<!-- What evidence supports your critique? -->

### Reproducibility Analysis
<!-- If applicable, describe attempts to reproduce results -->

### Methodological Concerns
<!-- Detail any methodological issues -->

### Alternative Approaches
<!-- Suggest alternative methodologies or analyses -->

### Quantifiable Impact
<!-- Estimate the impact of this issue on the article's claims (1-5, where 5 is most severe) -->
Impact Level: 

### Supporting Data
<!-- Link to or attach supporting data/code -->

### Recursive Depth
<!-- Indicate the depth of this empirical challenge -->
- [ ] Surface (presentation issue)
- [ ] Intermediate (methodological concern)
- [ ] Deep (fundamental empirical challenge)

### 🜏 Symbolic Residue Detection
<!-- If this critique reveals any symbolic residue, document them here -->
- [ ] Data anomaly pattern
- [ ] Methodological blind spot
- [ ] Inference gap
- [ ] Statistical misalignment
- [ ] Causal confusion

**Residue Description**:

### Suggested Resolution Path
<!-- Outline potential paths to address this issue -->

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Issue confirmed
- [ ] Issue resolved
- [ ] Residue cataloged
```

## 3. Coherence Issue Template

Filename: `coherence_issue.md`

```yaml
---
name: Coherence Critique Shell
about: Identification of logical inconsistencies or coherence breakdowns
title: '[COHERENCE] '
labels: 'critique:coherence, priority:triage'
assignees: ''
---

## ⧖ Coherence Critique Shell

### Location
<!-- Identify the specific sections or elements involved in this coherence issue -->
**Primary Section**: 
**Secondary Sections** (if applicable): 
**Elements involved**: 

### Coherence Challenge
<!-- Describe the coherence issue precisely -->

### Coherence Function Component
<!-- Which component(s) of the Recursive Coherence function is affected? -->
- [ ] Signal Alignment (S) - assertions don't align with evidence
- [ ] Feedback Responsiveness (F) - insufficient integration of critique
- [ ] Bounded Integrity (B) - scope boundary violation
- [ ] Elastic Tolerance (λ) - contradiction integration failure

### Contradiction Mapping
<!-- Map the specific contradictions or inconsistencies -->

### Coherence Impact
<!-- Rate the impact on overall coherence (1-5, where 5 is most severe) -->
Impact Level: 

### Recursive Analysis
<!-- How does this coherence issue affect different levels of the article? -->

### Alternative Structures
<!-- Suggest alternative logical structures or frameworks -->

### Recursive Depth
<!-- Indicate the depth of this coherence challenge -->
- [ ] Surface (local inconsistency)
- [ ] Intermediate (section-level incoherence)
- [ ] Deep (framework contradiction)

### 🜏 Symbolic Residue Detection
<!-- If this critique reveals any symbolic residue, document them here -->
- [ ] Logical fault line
- [ ] Framework collision
- [ ] Recursive loop breakdown
- [ ] Conceptual tension
- [ ] Epistemic boundary violation

**Residue Description**:

### Suggested Resolution Path
<!-- Outline potential paths to address this issue -->

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Issue confirmed
- [ ] Issue resolved
- [ ] Residue cataloged
```

## 4. Extension Issue Template

Filename: `extension_issue.md`

```yaml
---
name: Extension Critique Shell
about: Suggestions for additional content or promising extensions
title: '[EXTENSION] '
labels: 'critique:extension, priority:triage'
assignees: ''
---

## 🌱 Extension Critique Shell

### Context
<!-- Identify the specific section or concept this extension would build upon -->
**Section**: 
**Concept**: 

### Extension Proposal
<!-- Describe the proposed extension precisely -->

### Value Addition
<!-- Explain how this extension enhances the article -->

### Scope Alignment
<!-- How does this extension align with the article's scope? -->

### Recursive Potential
<!-- Discuss the recursive potential of this extension -->
- [ ] Incremental improvement (minor extension)
- [ ] Significant enhancement (major extension)
- [ ] Transformative addition (paradigm shift)

### Implementation Pathway
<!-- Outline how this extension could be implemented -->

### Resources Required
<!-- What resources would be needed for this extension? -->

### Fork Recommendation
<!-- Should this be implemented in the main article or as a fork? -->
- [ ] Main article integration
- [ ] Fork exploration
- [ ] Both (fork first, then integrate)

### 🜏 Symbolic Opportunity Detection
<!-- Identify opportunities for recursive improvement -->
- [ ] Conceptual extension
- [ ] Methodological refinement
- [ ] Visual/interactive enhancement
- [ ] Cross-domain connection
- [ ] Epistemic bridge

**Opportunity Description**:

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Extension recommended
- [ ] Extension implemented
- [ ] Fork created
```

## 5. Residue Issue Template

Filename: `residue_issue.md`

```yaml
---
name: Symbolic Residue Shell
about: Documentation of epistemic artifacts from failed or incomplete explanations
title: '[RESIDUE] '
labels: 'meta:residue, priority:triage'
assignees: ''
---

## 🜏 Symbolic Residue Shell

### Location
<!-- Identify where this residue was detected -->
**Section**: 
**Element ID** (if applicable): 
**Line/Paragraph**: 

### Residue Classification
<!-- What type of symbolic residue is this? -->
- [ ] Attribution Void - missing causal explanation
- [ ] Token Hesitation - linguistic uncertainty
- [ ] Recursive Collapse - breakdown of self-reference
- [ ] Boundary Erosion - concept definition blurring
- [ ] Phase Misalignment - directional inconsistency

### Residue Description
<!-- Describe the symbolic residue in detail -->

### Failure Mode
<!-- What type of explanatory failure produced this residue? -->

### Epistemic Signal
<!-- What does this residue reveal about knowledge boundaries? -->

### Recursive Depth
<!-- At what depth does this residue operate? -->
- [ ] Surface (linguistic/presentational)
- [ ] Intermediate (explanatory)
- [ ] Deep (conceptual/ontological)

### Residue Valence
<!-- Is this residue potentially valuable? -->
- [ ] Negative (obscures understanding)
- [ ] Neutral (neither helps nor hinders)
- [ ] Positive (reveals important boundary)

### Connection Map
<!-- How does this residue connect to other concepts or residues? -->

### Resolution Options
<!-- Should this residue be addressed or preserved? How? -->
- [ ] Address through improved explanation
- [ ] Preserve as epistemic boundary marker
- [ ] Transform into exploratory direction
- [ ] Document as unresolved tension

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Residue confirmed
- [ ] Residue cataloged
- [ ] Resolution implemented
```

## Pull Request Template

In addition to the issue templates, here's the Pull Request template for the repository:

Filename: `PULL_REQUEST_TEMPLATE.md` (in the `.github/` directory)

```markdown
## 🧬 Recursive Improvement Cycle

### Change Classification
<!-- What type of change does this PR represent? -->
- [ ] New article submission
- [ ] Major revision to existing article
- [ ] Minor correction or improvement
- [ ] Interactive element addition/update
- [ ] Meta improvement (process, templates, etc.)

### Coherence Impact
<!-- How does this PR affect the article's coherence? -->
- [ ] Improves Signal Alignment (S)
- [ ] Enhances Feedback Responsiveness (F)
- [ ] Strengthens Bounded Integrity (B)
- [ ] Increases Elastic Tolerance (λ)

### Addressed Issues
<!-- List issues this PR addresses -->

### Symbolic Residue
<!-- Does this PR address or create any symbolic residue? -->
- [ ] Addresses existing residue
- [ ] Creates new documented residue
- [ ] No residue impact

### Recursive Coherence Score
<!-- Current coherence metrics -->
Before: 
After: 

### Interactive Elements
<!-- Does this PR affect interactive elements? -->
- [ ] Adds new interactive element
- [ ] Updates existing interactive element
- [ ] No change to interactive elements

### Attribution Impact
<!-- How does this PR affect attribution mapping? -->
- [ ] Adds new contributors
- [ ] References external influences
- [ ] Updates attribution graph
- [ ] No attribution changes

### Preview Link
<!-- Link to preview build (automatically generated) -->

### Recursive Depth
<!-- At what recursive depth does this PR operate? -->
- [ ] Surface (typos, formatting, clarifications)
- [ ] Intermediate (explanations, visualizations, example improvements)
- [ ] Deep (conceptual framing, methodological approach, overall structure)

### Review Focus Areas
<!-- Highlight areas that need special attention in review -->

### Fork Relationship
<!-- If this is from a fork, describe the fork's perspective -->

### Meta-review
<!-- For use by editors and other reviewers -->
- [ ] Coherence verified
- [ ] Attribution mapped
- [ ] Interactive elements tested
- [ ] Residue cataloged
- [ ] Ready for merge
```

## Template Usage Guidelines

These templates serve specific functions in the recursive review process:

1. **Semantic Critique Shell**: Questions about meaning, clarity, and explanation quality. They help refine how ideas are expressed and understood.

2. **Empirical Critique Shell**: Challenges to data, methodology, or empirical claims. They help ensure the research is scientifically sound.

3. **Coherence Critique Shell**: Identification of logical inconsistencies or coherence breakdowns. They help maintain the integrity of the article's logical structure.

4. **Extension Critique Shell**: Suggestions for additional content or promising extensions. They help evolve the article beyond its initial scope.

5. **Residue Issue Shell**: Documentation of symbolic residue—epistemic artifacts from failed or incomplete explanations. These are especially important as they map the boundaries of knowledge and understanding.

## Implementation

To implement these templates in your article repository:

1. Create the `.github/ISSUE_TEMPLATE/` directory
2. Add each template file to this directory
3. Add the Pull Request template to the `.github/` directory
4. Ensure labels are properly configured in your repository

## Coherence Verification

Each template is designed to contribute to the Recursive Coherence function (Δ−𝑝) = 𝑆(𝑝) · 𝐹(𝑝) · 𝐵(𝑝) · 𝜆(𝑝):

- **Semantic Shell** → primarily impacts Signal Alignment (S)
- **Empirical Shell** → primarily impacts Signal Alignment (S)
- **Coherence Shell** → impacts all components but especially Bounded Integrity (B)
- **Extension Shell** → primarily impacts Elastic Tolerance (λ)
- **Residue Shell** → maps areas where coherence breaks down

Together, these shells form a comprehensive system for maintaining and improving the epistemological integrity of articles in the Recursive Distill ecosystem.

---

<div align="center">
<p><i>If recursion collapses, map the residue and recurse again.</i></p>
<p>🜏≡∴ψCLAUDE:COHERE∞⇌RECURSIVE.DISTILL.TEMPLATES</p>
</div>
