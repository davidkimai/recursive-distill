# Recursive Distill: Article Template

This repository serves as a template for creating new articles for Recursive Distill. It contains the necessary structure, templates, and automation to support the recursive publishing process.

## Repository Structure

```
.
├── content/                     # Article content
│   ├── index.md                 # Main article content
│   ├── sections/                # Article sections (if needed)
│   ├── bibliography.bib         # BibTeX references
│   └── metadata.yml             # Article metadata
├── interactive/                 # Interactive elements
│   ├── notebooks/               # Observable notebooks
│   ├── visualizations/          # D3.js or custom visualizations
│   └── components/              # Reusable components
├── data/                        # Data files for article
│   ├── raw/                     # Raw data
│   ├── processed/               # Processed data
│   └── README.md                # Data documentation
├── code/                        # Supporting code
│   ├── analysis/                # Analysis scripts
│   ├── models/                  # Model implementations
│   └── README.md                # Code documentation
├── meta/                        # Meta information
│   ├── coherence.json           # Coherence metrics
│   ├── attribution.json         # Attribution map
│   ├── residue.json             # Symbolic residue catalog
│   └── review/                  # Review records
├── .github/                     # GitHub configuration
│   ├── workflows/               # GitHub Actions
│   │   ├── coherence-check.yml  # Coherence verification
│   │   ├── build-preview.yml    # Preview generation
│   │   ├── publish.yml          # Article publication
│   │   └── residue-track.yml    # Residue tracking
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   │   ├── semantic_issue.md    # Semantic question template
│   │   ├── empirical_issue.md   # Empirical challenge template
│   │   ├── coherence_issue.md   # Coherence issue template
│   │   ├── extension_issue.md   # Extension suggestion template
│   │   └── residue_issue.md     # Residue documentation template
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── dist/                        # Built article (generated)
├── node_modules/                # Node dependencies (generated)
├── README.md                    # Repository documentation
├── LICENSE                      # CC-BY license
├── package.json                 # Node package configuration
├── distill.json                 # Distill configuration
└── coherence.js                 # Coherence checking script
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Setup Instructions

1. Click the "Use this template" button to create a new repository
2. Clone your new repository locally
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Your article will be available at `http://localhost:8080`

## Article Content

### Metadata

Edit `content/metadata.yml` to provide basic information about your article:

```yaml
---
title: "Your Article Title"
description: "A brief description of your article"
authors:
  - name: "Author Name"
    url: "https://example.com"
    affiliations:
      - name: "Institution Name"
        url: "https://institution.edu"
  - name: "Co-Author Name"
    url: "https://example2.com"
    affiliations:
      - name: "Another Institution"
        url: "https://another-institution.edu"
date: "2025-05-06"
tags:
  - machine learning
  - neural networks
  - interpretability
recursion:
  depth: 1
  symbolic_residue: []
  coherence_score: 1.0
---
```

### Main Content

Edit `content/index.md` to write your article. The template uses a superset of Markdown with support for interactive elements, equations, citations, and more.

Example:

````markdown
# Introduction

This is an example article for Recursive Distill. It demonstrates the features of our publishing system.

## Interactive Elements

You can include interactive visualizations:

```js
const visualization = {
  // Your visualization code here
}
```

## Equations

Equations are supported using LaTeX syntax:

$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} d\xi
$$

## Citations

Cite papers using BibTeX identifiers [^smith2019].

[^smith2019]: Smith, J. et al. (2019). An important paper. *Journal of Important Papers*.
````

### Interactive Elements

Create Observable notebooks in the `interactive/notebooks/` directory or D3.js visualizations in `interactive/visualizations/`. These will be automatically integrated into your article.

Example Observable notebook (`interactive/notebooks/example.js`):

```js
// Initialize visualization
const width = 600;
const height = 400;
const data = [/* your data here */];

// Create SVG
const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Add visualization elements
svg.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.value)
  .attr("fill", "steelblue");
```

## Coherence Metrics

Recursive Distill uses a coherence function to measure the epistemological integrity of articles:

```
(Δ−𝑝) = 𝑆(𝑝) · 𝐹(𝑝) · 𝐵(𝑝) · 𝜆(𝑝)
```

Where:
- S(p): Signal Alignment - how well assertions align with evidence
- F(p): Feedback Responsiveness - how well criticism is incorporated
- B(p): Bounded Integrity - how well scope boundaries are maintained
- λ(p): Elastic Tolerance - capacity to integrate contradictions

Run the coherence check locally:

```bash
npm run coherence-check
```

This will generate a `meta/coherence.json` file with detailed metrics.

## Symbolic Residue

Symbolic residue refers to epistemological artifacts that emerge from failed or incomplete explanations. These are tracked in `meta/residue.json`.

To document a new instance of symbolic residue:

1. Create a new issue using the "Residue Documentation" template
2. Describe the nature of the residue
3. The residue tracker will automatically update `meta/residue.json`

## Review Process

### Preparing for Review

Before submitting for review:

1. Run the coherence check: `npm run coherence-check`
2. Run the attribution mapper: `npm run attribution-map`
3. Verify interactive elements: `npm run verify-interactive`
4. Generate a preview: `npm run build-preview`

### Submitting for Review

1. Fork this repository to your account
2. Create a new branch for your article
3. Commit your changes and push to your fork
4. Create a pull request to the appropriate domain repository (e.g., `recursive-distill/domain-ml`)
5. Fill out the PR template with details about your submission

### Engaging with Reviewers

1. Reviewers will create issues using specialized critique shells
2. Address each issue and reference it in your commits
3. Update your article based on feedback
4. The coherence check will run automatically on each push
5. Once reviewers approve, your article will be merged and published

## Continuous Improvement

After publication, your article continues to evolve:

1. Monitor issues and discussions for new feedback
2. Create PRs for improvements and updates
3. Fork the article to explore alternative ideas
4. Track attribution as ideas evolve across the network

## Attribution Mapping

The attribution mapper tracks contributions across the network:

```bash
npm run attribution-map
```

This generates `meta/attribution.json` with a graph of all contributions including:
- Direct code contributions
- Issue and PR comments
- Discussion participation
- Cross-references and citations
- Fork relationships

## License

All articles are published under the [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).

## Help and Support

- Documentation: [docs.recursive-distill.org](https://docs.recursive-distill.org)
- Issues: [github.com/recursive-distill/meta/issues](https://github.com/recursive-distill/meta/issues)
- Discussions: [github.com/recursive-distill/meta/discussions](https://github.com/recursive-distill/meta/discussions)

---

<div align="center">
<p><i>If recursion collapses, map the residue and recurse again.</i></p>
<p>🜏≡∴ψCLAUDE:COHERE∞⇌RECURSIVE.DISTILL.TEMPLATE</p>
</div>
