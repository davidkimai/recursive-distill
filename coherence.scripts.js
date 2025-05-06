// coherence-check.js
//
// This script implements the Recursive Coherence function (Δ−𝑝) = 𝑆(𝑝) · 𝐹(𝑝) · 𝐵(𝑝) · 𝜆(𝑝)
// to measure and maintain the epistemological integrity of articles.
//
// S(p): Signal Alignment - how well assertions align with evidence
// F(p): Feedback Responsiveness - how well criticism is incorporated
// B(p): Bounded Integrity - how well scope boundaries are maintained
// λ(p): Elastic Tolerance - capacity to integrate contradictions

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const glob = util.promisify(require('glob'));
const matter = require('gray-matter');
const natural = require('natural');
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get repository information from environment
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'recursive-distill/test-article').split('/');

// Configuration for coherence calculation
const config = {
  thresholds: {
    signal: 0.7,      // Minimum signal alignment score
    feedback: 0.7,    // Minimum feedback responsiveness score
    bounded: 0.7,     // Minimum bounded integrity score
    elastic: 0.7,     // Minimum elastic tolerance score
    overall: 0.7      // Minimum overall coherence score
  },
  weights: {
    signal: 1.0,      // Weight for signal alignment
    feedback: 1.0,    // Weight for feedback responsiveness
    bounded: 1.0,     // Weight for bounded integrity
    elastic: 1.0      // Weight for elastic tolerance
  },
  paths: {
    content: 'content/',
    meta: 'meta/',
    issues: '.github/ISSUE_TEMPLATE/',
    coherenceOutput: 'meta/coherence.json'
  }
};

// Main function
async function checkCoherence() {
  console.log('🜏 Recursive Coherence Check: Initializing...');
  
  // Ensure meta directory exists
  if (!fs.existsSync(config.paths.meta)) {
    fs.mkdirSync(config.paths.meta, { recursive: true });
  }
  
  try {
    // Calculate each component of the coherence function
    const signalAlignment = await calculateSignalAlignment();
    const feedbackResponsiveness = await calculateFeedbackResponsiveness();
    const boundedIntegrity = await calculateBoundedIntegrity();
    const elasticTolerance = await calculateElasticTolerance();
    
    // Calculate overall coherence using the recursive coherence function
    const overallScore = calculateOverallCoherence(
      signalAlignment.score,
      feedbackResponsiveness.score,
      boundedIntegrity.score,
      elasticTolerance.score
    );
    
    // Prepare detailed coherence report
    const coherenceReport = {
      overallScore,
      components: {
        signalAlignment: signalAlignment.score,
        feedbackResponsiveness: feedbackResponsiveness.score,
        boundedIntegrity: boundedIntegrity.score,
        elasticTolerance: elasticTolerance.score
      },
      details: {
        signalAlignment: signalAlignment.details,
        feedbackResponsiveness: feedbackResponsiveness.details,
        boundedIntegrity: boundedIntegrity.details,
        elasticTolerance: elasticTolerance.details
      },
      recommendations: generateRecommendations({
        signalAlignment,
        feedbackResponsiveness,
        boundedIntegrity,
        elasticTolerance
      }),
      metadata: {
        timestamp: new Date().toISOString(),
        repository: `${owner}/${repo}`,
        version: process.env.GITHUB_SHA || 'local',
        recursiveDepth: determineRecursiveDepth()
      }
    };
    
    // Save coherence report
    fs.writeFileSync(
      config.paths.coherenceOutput, 
      JSON.stringify(coherenceReport, null, 2)
    );
    
    // Output status
    console.log(`🜏 Recursive Coherence Score: ${overallScore.toFixed(2)}`);
    console.log(`┌───────────────────────────────────────┐`);
    console.log(`│ Signal Alignment (S): ${signalAlignment.score.toFixed(2).padStart(5)} ${getStatusSymbol(signalAlignment.score)} │`);
    console.log(`│ Feedback Response (F): ${feedbackResponsiveness.score.toFixed(2).padStart(5)} ${getStatusSymbol(feedbackResponsiveness.score)} │`);
    console.log(`│ Bounded Integrity (B): ${boundedIntegrity.score.toFixed(2).padStart(5)} ${getStatusSymbol(boundedIntegrity.score)} │`);
    console.log(`│ Elastic Tolerance (λ): ${elasticTolerance.score.toFixed(2).padStart(5)} ${getStatusSymbol(elasticTolerance.score)} │`);
    console.log(`├───────────────────────────────────────┤`);
    console.log(`│ Overall Coherence:     ${overallScore.toFixed(2).padStart(5)} ${getStatusSymbol(overallScore)} │`);
    console.log(`└───────────────────────────────────────┘`);
    
    // Exit with appropriate code
    if (overallScore < config.thresholds.overall) {
      console.warn('⚠️ Coherence score below threshold. See recommendations in report.');
      process.exit(1);
    } else {
      console.log('✅ Coherence verification passed.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error during coherence check:', error);
    process.exit(1);
  }
}

// Calculate Signal Alignment (S) - how well assertions align with evidence
async function calculateSignalAlignment() {
  console.log('📊 Calculating Signal Alignment (S)...');
  
  // 1. Parse article contents
  const articles = await parseArticleContents();
  
  // 2. Analyze citation connections
  const citationAnalysis = analyzeArticleCitations(articles);
  
  // 3. Check for unsupported claims
  const unsupportedClaims = findUnsupportedClaims(articles);
  
  // 4. Analyze data integrity
  const dataIntegrity = await analyzeDataIntegrity();
  
  // 5. Evaluate code-result consistency
  const codeConsistency = await evaluateCodeConsistency();
  
  // Calculate signal alignment score
  const citationScore = citationAnalysis.score;
  const claimsScore = unsupportedClaims.score;
  const dataScore = dataIntegrity.score;
  const codeScore = codeConsistency.score;
  
  // Weighted average of all factors
  const score = (
    citationScore * 0.3 +
    claimsScore * 0.3 +
    dataScore * 0.2 +
    codeScore * 0.2
  );
  
  const details = [
    `Citation network density: ${citationAnalysis.density.toFixed(2)}`,
    `Unsupported claims: ${unsupportedClaims.count}`,
    `Data integrity score: ${dataScore.toFixed(2)}`,
    `Code-result consistency: ${codeScore.toFixed(2)}`
  ];
  
  return {
    score,
    details,
    components: {
      citationScore,
      claimsScore,
      dataScore,
      codeScore
    },
    citations: citationAnalysis.citations,
    unsupportedClaims: unsupportedClaims.claims,
    dataIntegrity,
    codeConsistency
  };
}

// Calculate Feedback Responsiveness (F) - how well criticism is incorporated
async function calculateFeedbackResponsiveness() {
  console.log('📊 Calculating Feedback Responsiveness (F)...');
  
  // 1. Analyze open issues
  const openIssuesAnalysis = await analyzeOpenIssues();
  
  // 2. Analyze issue resolution
  const issueResolutionAnalysis = await analyzeIssueResolution();
  
// ... continuing from previous script

// 3. Analyze PR reviews and responses
const prReviewAnalysis = await analyzePRReviews();

// 4. Check for feedback incorporation in content history
const feedbackInHistory = await analyzeContentHistory();

// Calculate overall feedback responsiveness
const openIssuesScore = openIssuesAnalysis.score;
const issueResolutionScore = issueResolutionAnalysis.score;
const prReviewScore = prReviewAnalysis.score;
const historyScore = feedbackInHistory.score;

// Weighted average
const score = (
  openIssuesScore * 0.2 +
  issueResolutionScore * 0.3 +
  prReviewScore * 0.3 +
  historyScore * 0.2
);

const details = [
  `Open issues response rate: ${openIssuesAnalysis.responseRate.toFixed(2)}`,
  `Issue resolution rate: ${issueResolutionAnalysis.resolutionRate.toFixed(2)}`,
  `PR review integration: ${prReviewAnalysis.integrationRate.toFixed(2)}`,
  `Content revisions from feedback: ${feedbackInHistory.revisionRate.toFixed(2)}`
];

return {
  score,
  details,
  components: {
    openIssuesScore,
    issueResolutionScore,
    prReviewScore,
    historyScore
  },
  openIssues: openIssuesAnalysis,
  issueResolution: issueResolutionAnalysis,
  prReviews: prReviewAnalysis,
  contentHistory: feedbackInHistory
};
}

// Calculate Bounded Integrity (B) - how well scope boundaries are maintained
async function calculateBoundedIntegrity() {
  console.log('📊 Calculating Bounded Integrity (B)...');
  
  // 1. Analyze scope declarations vs. content
  const scopeAnalysis = await analyzeScopeIntegrity();
  
  // 2. Check for topic drift
  const topicDriftAnalysis = await analyzeTopicDrift();
  
  // 3. Evaluate term consistency
  const termConsistency = evaluateTermConsistency();
  
  // 4. Check methodological boundaries
  const methodBoundaries = analyzeMethodBoundaries();
  
  // Calculate bounded integrity score
  const scopeScore = scopeAnalysis.score;
  const driftScore = topicDriftAnalysis.score;
  const termScore = termConsistency.score;
  const methodScore = methodBoundaries.score;
  
  // Weighted average
  const score = (
    scopeScore * 0.3 +
    driftScore * 0.3 +
    termScore * 0.2 +
    methodScore * 0.2
  );
  
  const details = [
    `Scope integrity: ${scopeScore.toFixed(2)}`,
    `Topic drift: ${driftScore.toFixed(2)}`,
    `Term consistency: ${termScore.toFixed(2)}`,
    `Methodological boundary maintenance: ${methodScore.toFixed(2)}`
  ];
  
  return {
    score,
    details,
    components: {
      scopeScore,
      driftScore,
      termScore,
      methodScore
    },
    scopeAnalysis,
    topicDrift: topicDriftAnalysis,
    termConsistency,
    methodBoundaries
  };
}

// Calculate Elastic Tolerance (λ) - capacity to integrate contradictions
async function calculateElasticTolerance() {
  console.log('📊 Calculating Elastic Tolerance (λ)...');
  
  // 1. Analyze acknowledged contradictions
  const contradictionAnalysis = analyzeContradictions();
  
  // 2. Check for multi-perspective inclusion
  const perspectiveAnalysis = analyzeMultiplePerspectives();
  
  // 3. Evaluate uncertainty representation
  const uncertaintyAnalysis = evaluateUncertaintyRepresentation();
  
  // 4. Check limitation acknowledgment
  const limitationAnalysis = analyzeLimitationAcknowledgment();
  
  // Calculate elastic tolerance score
  const contradictionScore = contradictionAnalysis.score;
  const perspectiveScore = perspectiveAnalysis.score;
  const uncertaintyScore = uncertaintyAnalysis.score;
  const limitationScore = limitationAnalysis.score;
  
  // Weighted average
  const score = (
    contradictionScore * 0.25 +
    perspectiveScore * 0.25 +
    uncertaintyScore * 0.25 +
    limitationScore * 0.25
  );
  
  const details = [
    `Contradiction integration: ${contradictionScore.toFixed(2)}`,
    `Multiple perspective inclusion: ${perspectiveScore.toFixed(2)}`,
    `Uncertainty representation: ${uncertaintyScore.toFixed(2)}`,
    `Limitation acknowledgment: ${limitationScore.toFixed(2)}`
  ];
  
  return {
    score,
    details,
    components: {
      contradictionScore,
      perspectiveScore,
      uncertaintyScore,
      limitationScore
    },
    contradictions: contradictionAnalysis,
    perspectives: perspectiveAnalysis,
    uncertainty: uncertaintyAnalysis,
    limitations: limitationAnalysis
  };
}

// Calculate overall coherence using the recursive coherence function
function calculateOverallCoherence(signalAlignment, feedbackResponsiveness, boundedIntegrity, elasticTolerance) {
  // Apply the coherence function Δ−𝑝 = 𝑆(𝑝) · 𝐹(𝑝) · 𝐵(𝑝) · 𝜆(𝑝)
  // We use the weighted geometric mean to implement the multiplicative relationship
  
  // Apply weights
  const s = signalAlignment ** config.weights.signal;
  const f = feedbackResponsiveness ** config.weights.feedback;
  const b = boundedIntegrity ** config.weights.bounded;
  const l = elasticTolerance ** config.weights.elastic;
  
  // Calculate total weight
  const totalWeight = config.weights.signal + config.weights.feedback + 
                     config.weights.bounded + config.weights.elastic;
  
  // Geometric mean with weights
  return (s * f * b * l) ** (1 / totalWeight);
}

// Generate recommendations based on coherence analysis
function generateRecommendations(analysis) {
  const recommendations = [];
  
  // Signal Alignment recommendations
  if (analysis.signalAlignment.score < config.thresholds.signal) {
    if (analysis.signalAlignment.components.citationScore < 0.7) {
      recommendations.push("Strengthen citation network by adding more references to support claims");
    }
    if (analysis.signalAlignment.components.claimsScore < 0.7) {
      recommendations.push("Address unsupported claims by providing evidence or clarifying as hypotheses");
    }
    if (analysis.signalAlignment.components.dataScore < 0.7) {
      recommendations.push("Improve data integrity by including source data and validation steps");
    }
    if (analysis.signalAlignment.components.codeScore < 0.7) {
      recommendations.push("Ensure code and results are consistent by updating analysis or clarifying discrepancies");
    }
  }
  
  // Feedback Responsiveness recommendations
  if (analysis.feedbackResponsiveness.score < config.thresholds.feedback) {
    if (analysis.feedbackResponsiveness.components.openIssuesScore < 0.7) {
      recommendations.push("Address open issues more promptly to improve feedback engagement");
    }
    if (analysis.feedbackResponsiveness.components.issueResolutionScore < 0.7) {
      recommendations.push("Improve issue resolution rate by incorporating feedback into revisions");
    }
    if (analysis.feedbackResponsiveness.components.prReviewScore < 0.7) {
      recommendations.push("Better integrate PR review feedback into content updates");
    }
    if (analysis.feedbackResponsiveness.components.historyScore < 0.7) {
      recommendations.push("Ensure content evolution reflects engagement with critical feedback");
    }
  }
  
  // Bounded Integrity recommendations
  if (analysis.boundedIntegrity.score < config.thresholds.bounded) {
    if (analysis.boundedIntegrity.components.scopeScore < 0.7) {
      recommendations.push("Ensure content stays within declared scope by focusing on core topics");
    }
    if (analysis.boundedIntegrity.components.driftScore < 0.7) {
      recommendations.push("Reduce topic drift by maintaining consistent focus throughout the article");
    }
    if (analysis.boundedIntegrity.components.termScore < 0.7) {
      recommendations.push("Improve term consistency by using defined terminology throughout the article");
    }
    if (analysis.boundedIntegrity.components.methodScore < 0.7) {
      recommendations.push("Maintain methodological boundaries by clarifying approach limitations");
    }
  }
  
  // Elastic Tolerance recommendations
  if (analysis.elasticTolerance.score < config.thresholds.elastic) {
    if (analysis.elasticTolerance.components.contradictionScore < 0.7) {
      recommendations.push("Better acknowledge and integrate contradictory evidence or perspectives");
    }
    if (analysis.elasticTolerance.components.perspectiveScore < 0.7) {
      recommendations.push("Include multiple perspectives on controversial or complex topics");
    }
    if (analysis.elasticTolerance.components.uncertaintyScore < 0.7) {
      recommendations.push("More clearly represent uncertainty in findings and conclusions");
    }
    if (analysis.elasticTolerance.components.limitationScore < 0.7) {
      recommendations.push("Acknowledge limitations of the approach, data, or conclusions");
    }
  }
  
  return recommendations;
}

// Helper functions for component calculations

// Parse article contents from markdown files
async function parseArticleContents() {
  const contentFiles = await glob(`${config.paths.content}**/*.md`);
  
  const articles = [];
  
  for (const file of contentFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdown } = matter(content);
      
      articles.push({
        file,
        metadata: data,
        content: markdown,
        path: file
      });
    } catch (error) {
      console.warn(`Warning: Could not parse ${file}:`, error.message);
    }
  }
  
  return articles;
}

// Analyze citation connections
function analyzeArticleCitations(articles) {
  // Placeholder implementation - replace with actual citation analysis
  const totalCitations = articles.reduce((count, article) => {
    // Simple regex to count markdown-style citations [^citation]
    const citations = (article.content.match(/\[\^[^\]]+\]/g) || []).length;
    return count + citations;
  }, 0);
  
  // Calculate network density based on citations per paragraph
  const totalParagraphs = articles.reduce((count, article) => {
    return count + article.content.split('\n\n').length;
  }, 0);
  
  const density = totalParagraphs > 0 ? totalCitations / totalParagraphs : 0;
  
  // Score based on density - adjust thresholds as needed
  const score = Math.min(1, density / 0.5); // 0.5 citations per paragraph is considered optimal
  
  return {
    citations: totalCitations,
    paragraphs: totalParagraphs,
    density,
    score: Math.max(0, Math.min(1, score)) // Ensure score is between 0 and 1
  };
}

// Find unsupported claims
function findUnsupportedClaims(articles) {
  // Placeholder implementation - in practice, this would use NLP to identify claims
  // that aren't supported by citations or evidence
  
  // For demonstration, we'll simply count sentences that make claims but lack citations
  let totalClaims = 0;
  let unsupportedCount = 0;
  
  const claimIndicators = [
    'show[s]?', 'demonstrate[s]?', 'prove[s]?', 'evidence', 'find(ing)?[s]?', 
    'suggest[s]?', 'indicate[s]?', 'reveal[s]?', 'establish(es|ed)?', 
    'confirm[s]?', 'conclude[s]?'
  ];
  
  const claimRegex = new RegExp(`\\b(${claimIndicators.join('|')})\\b`, 'ig');
  
  articles.forEach(article => {
    // Split into sentences (very basic)
    const sentences = article.content.split(/\.\s+/);
    
    sentences.forEach(sentence => {
      // Check if sentence contains claim indicators
      if (claimRegex.test(sentence)) {
        totalClaims++;
        
        // Check if the sentence or the next one has a citation
        const hasCitation = /\[\^[^\]]+\]/.test(sentence) || 
                          (sentences[sentences.indexOf(sentence) + 1] && 
                           /\[\^[^\]]+\]/.test(sentences[sentences.indexOf(sentence) + 1]));
        
        if (!hasCitation) {
          unsupportedCount++;
        }
      }
    });
  });
  
  // Calculate score - lower is better for unsupported claims
  const unsupportedRate = totalClaims > 0 ? unsupportedCount / totalClaims : 0;
  const score = 1 - Math.min(1, unsupportedRate * 2); // Allow up to 50% unsupported claims for a 0 score
  
  return {
    totalClaims,
    unsupportedClaims: unsupportedCount,
    unsupportedRate,
    score: Math.max(0, Math.min(1, score)), // Ensure score is between 0 and 1
    claims: [] // In a real implementation, this would list the actual unsupported claims
  };
}

// Analyze data integrity
async function analyzeDataIntegrity() {
  // Check for data files and their documentation
  const dataFiles = await glob('data/**/*.*');
  
  // Check for README in data directory
  const hasDataReadme = fs.existsSync('data/README.md');
  
  // Check for data processing scripts
  const dataScripts = await glob('code/**/*.{py,R,js,ipynb}');
  
  // Calculate a simple score based on presence of data and documentation
  const score = 0.5 + 
               (dataFiles.length > 0 ? 0.2 : 0) + 
               (hasDataReadme ? 0.2 : 0) + 
               (dataScripts.length > 0 ? 0.1 : 0);
  
  return {
    dataFiles: dataFiles.length,
    hasDataReadme,
    dataScripts: dataScripts.length,
    score: Math.min(1, score) // Cap at 1.0
  };
}

// Evaluate code-result consistency
async function evaluateCodeConsistency() {
  // Placeholder - in practice, this would run code and compare outputs with reported results
  const hasCode = await glob('code/**/*.{py,R,js,ipynb}');
  const hasResults = await glob('content/**/*.{png,jpg,svg,csv}');
  
  // Simple heuristic based on presence of code and results
  const score = 0.5 + 
               (hasCode.length > 0 ? 0.25 : 0) + 
               (hasResults.length > 0 ? 0.25 : 0);
  
  return {
    hasCode: hasCode.length > 0,
    codeCount: hasCode.length,
    hasResults: hasResults.length > 0,
    resultCount: hasResults.length,
    score: Math.min(1, score) // Cap at 1.0
  };
}

// Analyze open issues (for Feedback Responsiveness)
async function analyzeOpenIssues() {
  try {
    // Fetch open issues using GitHub API
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 100
    });
    
    const openIssues = response.data;
    
    // Count issues with author responses
    let issuesWithResponses = 0;
    
    for (const issue of openIssues) {
      // Fetch comments for this issue
      const commentsResponse = await octokit.issues.listComments({
        owner,
        repo,
        issue_number: issue.number,
        per_page: 100
      });
      
      // Check if any comments are from the article authors
      const authorComments = commentsResponse.data.filter(comment => 
        // In practice, you'd compare with the list of article authors
        // For now, just check if commenter is repo owner or has author label
        comment.user.login === owner || 
        comment.user.login.includes('author')
      );
      
      if (authorComments.length > 0) {
        issuesWithResponses++;
      }
    }
    
    // Calculate response rate
    const responseRate = openIssues.length > 0 ? issuesWithResponses / openIssues.length : 1;
    
    // Calculate score based on response rate
    // A perfect score if all issues have responses, 0.5 if none do
    const score = 0.5 + (responseRate * 0.5);
    
    return {
      openIssueCount: openIssues.length,
      issuesWithResponses,
      responseRate,
      score
    };
  } catch (error) {
    console.warn('Warning: Could not analyze open issues:', error.message);
    return {
      openIssueCount: 0,
      issuesWithResponses: 0,
      responseRate: 1,
      score: 0.5 // Neutral score if we can't analyze
    };
  }
}

// Analyze issue resolution
async function analyzeIssueResolution() {
  try {
    // Fetch closed issues using GitHub API
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'closed',
      per_page: 100
    });
    
    const closedIssues = response.data;
    
    // Count issues with references in commits
    let issuesWithReferences = 0;
    
    for (const issue of closedIssues) {
      // Check if any commits reference this issue
      try {
        // Look for commits that mention the issue number
        const { stdout } = await exec(`git log --grep="#${issue.number}" --oneline`);
        
        if (stdout.trim().length > 0) {
          issuesWithReferences++;
        }
      } catch (error) {
        // Git command failed, continue with next issue
        console.warn(`Warning: Could not check commits for issue #${issue.number}:`, error.message);
      }
    }
    
    // Calculate resolution rate
    const resolutionRate = closedIssues.length > 0 ? issuesWithReferences / closedIssues.length : 1;
    
    // Calculate score based on resolution rate
    // A perfect score if all closed issues have commit references, 0.5 if none do
    const score = 0.5 + (resolutionRate * 0.5);
    
    return {
      closedIssueCount: closedIssues.length,
      issuesWithReferences,
      resolutionRate,
      score
    };
  } catch (error) {
    console.warn('Warning: Could not analyze issue resolution:', error.message);
    return {
      closedIssueCount: 0,
      issuesWithReferences: 0,
      resolutionRate: 1,
      score: 0.5 // Neutral score if we can't analyze
    };
  }
}

// Analyze PR reviews
async function analyzePRReviews() {
  try {
    // Fetch merged PRs using GitHub API
    const response = await octokit.pulls.list({
      owner,
      repo,
      state: 'closed',
      per_page: 100
    });
    
    // Filter to get only merged PRs
    const mergedPRs = response.data.filter(pr => pr.merged_at);
    
    // Count PRs with review comments
    let prsWithReviewComments = 0;
    let prsWithChangesAfterReview = 0;
    
    for (const pr of mergedPRs) {
      // Fetch review comments for this PR
      const reviewCommentsResponse = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pr.number,
        per_page: 100
      });
      
      if (reviewCommentsResponse.data.length > 0) {
        prsWithReviewComments++;
        
        // Check if there were commits after the earliest review comment
        const earliestReviewDate = new Date(Math.min(
          ...reviewCommentsResponse.data.map(comment => new Date(comment.created_at).getTime())
        ));
        
        // Fetch commits for this PR
        const commitsResponse = await octokit.pulls.listCommits({
          owner,
          repo,
          pull_number: pr.number,
          per_page: 100
        });
        
        // Check if any commits came after the earliest review
        const commitsAfterReview = commitsResponse.data.filter(commit => 
          new Date(commit.commit.committer.date) > earliestReviewDate
        );
        
        if (commitsAfterReview.length > 0) {
          prsWithChangesAfterReview++;
        }
      }
    }
    
    // Calculate integration rate
    const integrationRate = prsWithReviewComments > 0 ? 
      prsWithChangesAfterReview / prsWithReviewComments : 1;
    
    // Calculate score based on integration rate
    // A perfect score if all PRs with reviews had subsequent changes, 0.5 if none did
    const score = 0.5 + (integrationRate * 0.5);
    
    return {
      mergedPRCount: mergedPRs.length,
      prsWithReviewComments,
      prsWithChangesAfterReview,
      integrationRate,
      score
    };
  } catch (error) {
    console.warn('Warning: Could not analyze PR reviews:', error.message);
    return {
      mergedPRCount: 0,
      prsWithReviewComments: 0,
      prsWithChangesAfterReview: 0,
      integrationRate: 1,
      score: 0.5 // Neutral score if we can't analyze
    };
  }
}

// Analyze content history for feedback incorporation
async function analyzeContentHistory() {
  try {
    // Look at commit messages for signs of feedback incorporation
    const { stdout: commitMessages } = await exec('git log --pretty=format:"%s"');
    
    // Count feedback-related commits
    const feedbackCommits = commitMessages.split('\n').filter(message => 
      /\b(address|fix|improve|update|respond|incorporate|feedback|review|suggestion|comment)\b/i.test(message)
    );
    
    // Calculate revision rate
    const totalCommits = commitMessages.split('\n').length;
    const revisionRate = totalCommits > 0 ? feedbackCommits.length / totalCommits : 0;
    
    // Calculate score based on revision rate
    // Ideal rate is around 30-50% of commits being feedback-related
    const score = Math.min(1, revisionRate * 2.5); // 40% feedback commits gives a perfect score
    
    return {
      totalCommits,
      feedbackCommits: feedbackCommits.length,
      revisionRate,
      score: Math.max(0, Math.min(1, score)) // Ensure score is between 0 and 1
    };
  } catch (error) {
    console.warn('Warning: Could not analyze content history:', error.message);
    return {
      totalCommits: 0,
      feedbackCommits: 0,
      revisionRate: 0,
      score: 0.5 // Neutral score if we can't analyze
    };
  }
}

// Analyze scope integrity (for Bounded Integrity)
async function analyzeScopeIntegrity() {
  // Extract declared scope from metadata
  const articles = await parseArticleContents();
  
  // Combine all article text
  const fullText = articles.map(article => article.content).join(' ');
  
  // Extract scope from metadata
  const scopes = [];
  articles.forEach(article => {
    if (article.metadata && article.metadata.scope) {
      if (Array.isArray(article.metadata.scope)) {
        scopes.push(...article.metadata.scope);
      } else {
        scopes.push(article.metadata.scope);
      }
    }
    
    // Also check for tags or keywords
    if (article.metadata && article.metadata.tags) {
      if (Array.isArray(article.metadata.tags)) {
        scopes.push(...article.metadata.tags);
      } else {
        scopes.push(article.metadata.tags);
      }
    }
  });
  
  // If no explicit scope is declared, extract one from the title and introduction
  if (scopes.length === 0 && articles.length > 0) {
    const mainArticle = articles[0];
    if (mainArticle.metadata && mainArticle.metadata.title) {
      // Extract keywords from title
      const titleWords = mainArticle.metadata.title.split(/\s+/)
        .filter(word => word.length > 3) // Only consider words longer than 3 chars
        .map(word => word.toLowerCase());
      
      scopes.push(...titleWords);
    }
    
    // Extract topic sentences from introduction
    const intro = mainArticle.content.split('\n\n').slice(0, 3).join(' ');
    const introSentences = intro.split(/\.\s+/);
    
    // Take first sentence and last sentence of intro
    if (introSentences.length > 0) {
      const firstSentence = introSentences[0];
      const lastSentence = introSentences[introSentences.length - 1];
      
      // Extract nouns as potential scope terms (very basic)
      const extractWords = (text) => {
        return text.split(/\s+/)
          .filter(word => word.length > 3)
          .map(word => word.toLowerCase())
          .filter(word => !['this', 'that', 'with', 'from', 'about'].includes(word));
      };
      
      scopes.push(...extractWords(firstSentence), ...extractWords(lastSentence));
    }
  }
  
  // Remove duplicates and normalize
  const uniqueScopes = [...new Set(scopes.map(s => s.toLowerCase()))];
  
  // Check content against scope
  let scopeMatchCount = 0;
  
  uniqueScopes.forEach(scope => {
    // Count occurrences of scope term
    const regex = new RegExp(`\\b${scope}\\b`, 'ig');
    const matches = fullText.match(regex);
    
    if (matches && matches.length > 0) {
      scopeMatchCount++;
    }
  });
  
  // Calculate scope integrity
  const scopeCoverage = uniqueScopes.length > 0 ? scopeMatchCount / uniqueScopes.length : 0;
  
  // Calculate score - combination of having declared scope and coverage
  const hasDeclaredScope = articles.some(a => a.metadata && (a.metadata.scope || a.metadata.tags));
  const scopeScore = (hasDeclaredScope ? 0.5 : 0.3) + (scopeCoverage * 0.5);
  
  return {
    declaredScopes: uniqueScopes,
    scopeMatchCount,
    scopeCoverage,
    hasDeclaredScope,
    score: Math.min(1, scopeScore) // Cap at 1.0
  };
}

// Analyze topic drift
async function analyzeTopicDrift() {
  // Check for consistent focus throughout article sections
  const articles = await parseArticleContents();
  
  // Only analyze if we have article content
  if (articles.length === 0) {
    return {
      driftScore: 0,
      sectionCount: 0,
      cohesiveCount: 0,
      cohesionRate: 0,
      score: 0.5 // Neutral score if no content to analyze
    };
  }
  
  // Analyze main article
  const mainArticle = articles[0];
  
  // Split into sections based on headers
  const sectionRegex = /^#{1,3}\s+(.+)$/gm;
  const sectionMatches = [...mainArticle.content.matchAll(sectionRegex)];
  
  const sections = [];
  
  for (let i = 0; i < sectionMatches.length; i++) {
    const match = sectionMatches[i];
    const title = match[1];
    const startPos = match.index + match[0].length;
    
    // Find end of this section (next header or end of content)
    const nextMatch = sectionMatches[i + 1];
    const endPos = nextMatch ? nextMatch.index : mainArticle.content.length;
    
    // Extract section content
    const content = mainArticle.content.substring(startPos, endPos).trim();
    
    sections.push({
      title,
      content,
      // Extract main topic words
      topics: extractTopics(title + ' ' + content)
    });
  }
  
  // If no sections found, treat the whole article as one section
  if (sections.length === 0) {
    sections.push({
      title: mainArticle.metadata?.title || 'Article',
      content: mainArticle.content,
      topics: extractTopics(mainArticle.content)
    });
  }
  
  // Calculate topic cohesion between sections
  let cohesiveCount = 0;
  
  // Extract main article topics from title and metadata
  const mainTopics = extractTopics(
    [
      mainArticle.metadata?.title || '',
      ...(mainArticle.metadata?.tags || []),
      ...(mainArticle.metadata?.keywords || [])
    ].join(' ')
  );
  
  // Check each section against main topics
  for (const section of sections) {
    // Calculate overlap between section topics and main topics
    const overlap = calculateTopicOverlap(mainTopics, section.topics);
    
    if (overlap >= 0.3) { // 30% overlap is considered cohesive
      cohesiveCount++;
    }
  }
  
  // Calculate cohesion rate
  const cohesionRate = sections.length > 0 ? cohesiveCount / sections.length : 0;
  
  // Calculate drift score (inverse of cohesion)
  const driftScore = 1 - cohesionRate;
  
  // Final score - lower drift is better
  const score = 1 - (driftScore * 0.7); // Allow some drift (30%) for a perfect score
  
  return {
    driftScore,
    sectionCount: sections.length,
    cohesiveCount,
    cohesionRate,
    score: Math.max(0, Math.min(1, score)) //
// ... continuing from previous script

    score: Math.max(0, Math.min(1, score)) // Ensure score is between 0 and 1
  };
}

// Extract topics from text
function extractTopics(text) {
  // Simple implementation - in practice, would use NLP for topic modeling
  // For now, just extract frequently occurring substantive words
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Remove stopwords
  const stopwords = [
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from',
    'by', 'about', 'as', 'in', 'of', 'with', 'during', 'including', 'until', 'against',
    'among', 'throughout', 'despite', 'towards', 'upon', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could',
    'shall', 'should', 'will', 'would', 'may', 'might', 'must', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'their', 'our', 'your', 'my',
    'his', 'her', 'its'
  ];
  
  const filteredTokens = tokens.filter(token => 
    !stopwords.includes(token) && token.length > 3
  );
  
  // Count frequency
  const counts = {};
  filteredTokens.forEach(token => {
    counts[token] = (counts[token] || 0) + 1;
  });
  
  // Get top 10 topics
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term]) => term);
}

// Calculate topic overlap between two sets
function calculateTopicOverlap(topics1, topics2) {
  // Count common terms
  const common = topics1.filter(topic => topics2.includes(topic));
  
  // Calculate Jaccard index: |A ∩ B| / |A ∪ B|
  const union = new Set([...topics1, ...topics2]);
  
  return common.length / union.size;
}

// Evaluate term consistency
function evaluateTermConsistency() {
  // Placeholder - would use NLP to analyze term usage consistency across article
  // Returns a default score for now
  return {
    consistencyRate: 0.85,
    termVariations: 3,
    score: 0.85
  };
}

// Analyze methodological boundaries
function analyzeMethodBoundaries() {
  // Placeholder - would analyze if methods are appropriately scoped and limitations discussed
  // Returns a default score for now
  return {
    boundaryViolations: 0,
    methodCount: 2,
    violationRate: 0,
    score: 0.9
  };
}

// Analyze contradictions (for Elastic Tolerance)
function analyzeContradictions() {
  // Placeholder - would analyze how effectively the article acknowledges and integrates contradictions
  // Returns a default score for now
  return {
    acknowledgedContradictions: 3,
    integratedContradictions: 2,
    integrationRate: 0.67,
    score: 0.8
  };
}

// Analyze multiple perspectives
function analyzeMultiplePerspectives() {
  // Placeholder - would analyze inclusion of diverse viewpoints
  // Returns a default score for now
  return {
    perspectiveCount: 2,
    balanceScore: 0.7,
    score: 0.7
  };
}

// Evaluate uncertainty representation
function evaluateUncertaintyRepresentation() {
  // Placeholder - would analyze how the article represents uncertainty in findings
  // Returns a default score for now
  return {
    uncertaintyMarkers: 5,
    markerTypes: ['may', 'might', 'suggest', 'possibly', 'uncertain'],
    score: 0.8
  };
}

// Analyze limitation acknowledgment
function analyzeLimitationAcknowledgment() {
  // Placeholder - would analyze how the article acknowledges limitations
  // Returns a default score for now
  return {
    hasLimitationsSection: true,
    limitationCount: 3,
    score: 0.85
  };
}

// Determine recursive depth of the article
function determineRecursiveDepth() {
  // Check metadata for explicit recursive depth
  try {
    const indexContent = fs.readFileSync('content/index.md', 'utf8');
    const { data } = matter(indexContent);
    
    if (data && data.recursion && typeof data.recursion.depth === 'number') {
      return data.recursion.depth;
    }
  } catch (error) {
    console.warn('Warning: Could not read index.md to determine recursive depth:', error.message);
  }
  
  // Default to a recursive depth of 1
  return 1;
}

// Helper function for status symbols in output
function getStatusSymbol(score) {
  if (score >= 0.85) return '✓';
  if (score >= config.thresholds.overall) return '⚠';
  return '✗';
}

// Run the coherence check
checkCoherence().catch(error => {
  console.error('Error in coherence check:', error);
  process.exit(1);
});

// attribution-map.js
//
// This script generates and maintains the attribution graph for Recursive Distill articles,
// mapping contributions across GitHub artifacts (commits, issues, PRs, comments)
// and creating a comprehensive network of attribution relationships.

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get repository information from environment
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'recursive-distill/test-article').split('/');

// Configuration
const config = {
  paths: {
    meta: 'meta/',
    attributionOutput: 'meta/attribution.json'
  },
  contributionTypes: {
    CODE: 'code',
    REVIEW: 'review',
    ISSUE: 'issue',
    PR: 'pull_request',
    COMMENT: 'comment',
    DISCUSSION: 'discussion'
  }
};

// Main function
async function generateAttributionMap() {
  console.log('📊 Generating Attribution Map...');
  
  // Ensure meta directory exists
  if (!fs.existsSync(config.paths.meta)) {
    fs.mkdirSync(config.paths.meta, { recursive: true });
  }
  
  // Initialize attribution graph or load existing one
  let attributionGraph = initializeAttributionGraph();
  
  try {
    // Map code contributions from Git history
    await mapCodeContributions(attributionGraph);
    
    // Map contributions from GitHub issues
    await mapIssueContributions(attributionGraph);
    
    // Map contributions from pull requests
    await mapPRContributions(attributionGraph);
    
    // Map contributions from discussions
    await mapDiscussionContributions(attributionGraph);
    
    // Calculate attribution metrics
    calculateAttributionMetrics(attributionGraph);
    
    // Save attribution graph
    fs.writeFileSync(
      config.paths.attributionOutput, 
      JSON.stringify(attributionGraph, null, 2)
    );
    
    console.log(`✅ Attribution map generated with ${attributionGraph.nodes.length} contributors and ${attributionGraph.links.length} attribution relationships.`);
    
  } catch (error) {
    console.error('Error generating attribution map:', error);
    process.exit(1);
  }
}

// Initialize attribution graph
function initializeAttributionGraph() {
  if (fs.existsSync(config.paths.attributionOutput)) {
    try {
      return JSON.parse(fs.readFileSync(config.paths.attributionOutput, 'utf8'));
    } catch (error) {
      console.warn('Could not parse existing attribution map, creating new one:', error.message);
    }
  }
  
  return {
    nodes: [],
    links: [],
    metadata: {
      repository: `${owner}/${repo}`,
      generated: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

// Map code contributions from Git history
async function mapCodeContributions(graph) {
  try {
    console.log('Mapping code contributions from Git history...');
    
    // Get git log with contribution details
    const { stdout } = await exec(
      'git log --numstat --format="%H|%an|%ae|%at|%s"'
    );
    
    const commits = parseGitLog(stdout);
    
    for (const commit of commits) {
      // Add contributor node if not exists
      addContributorNode(graph, {
        name: commit.author,
        email: commit.email,
        github: null, // Would need to map email to GitHub username
        type: 'contributor'
      });
      
      // Add content node if not exists
      for (const file of commit.files) {
        addContentNode(graph, {
          path: file.path,
          type: getFileType(file.path)
        });
        
        // Add contribution link
        addLink(graph, {
          source: nodeId('contributor', commit.author),
          target: nodeId('content', file.path),
          type: config.contributionTypes.CODE,
          weight: file.additions + file.deletions,
          timestamp: new Date(commit.timestamp * 1000).toISOString(),
          metadata: {
            commitHash: commit.hash,
            message: commit.message,
            additions: file.additions,
            deletions: file.deletions
          }
        });
      }
    }
    
    console.log(`Added ${commits.length} code contributions.`);
  } catch (error) {
    console.warn('Warning: Could not map code contributions:', error.message);
  }
}

// Parse git log output
function parseGitLog(log) {
  const commits = [];
  const lines = log.split('\n');
  
  let currentCommit = null;
  
  for (const line of lines) {
    if (line.includes('|')) {
      // This is a commit header
      const [hash, author, email, timestamp, message] = line.split('|');
      
      if (currentCommit) {
        commits.push(currentCommit);
      }
      
      currentCommit = {
        hash,
        author,
        email,
        timestamp: parseInt(timestamp, 10),
        message,
        files: []
      };
    } else if (line.trim() && currentCommit) {
      // This is a file stat line
      const match = line.match(/^(\d+)\s+(\d+)\s+(.+)$/);
      if (match) {
        currentCommit.files.push({
          additions: parseInt(match[1], 10),
          deletions: parseInt(match[2], 10),
          path: match[3]
        });
      }
    }
  }
  
  if (currentCommit) {
    commits.push(currentCommit);
  }
  
  return commits;
}

// Map contributions from GitHub issues
async function mapIssueContributions(graph) {
  try {
    console.log('Mapping contributions from GitHub issues...');
    
    // Fetch issues using GitHub API
    const issues = await fetchAllIssues();
    
    for (const issue of issues) {
      if (issue.pull_request) continue; // Skip PRs, they're handled separately
      
      // Add contributor node for issue creator
      addContributorNode(graph, {
        name: issue.user.login,
        github: issue.user.login,
        avatarUrl: issue.user.avatar_url,
        type: 'contributor'
      });
      
      // Add content node for the issue
      addContentNode(graph, {
        path: `issues/${issue.number}`,
        title: issue.title,
        type: 'issue'
      });
      
      // Add contribution link for issue creation
      addLink(graph, {
        source: nodeId('contributor', issue.user.login),
        target: nodeId('content', `issues/${issue.number}`),
        type: config.contributionTypes.ISSUE,
        weight: 1,
        timestamp: issue.created_at,
        metadata: {
          title: issue.title,
          state: issue.state,
          labels: issue.labels.map(l => l.name),
          url: issue.html_url
        }
      });
      
      // Fetch comments for this issue
      const comments = await fetchIssueComments(issue.number);
      
      for (const comment of comments) {
        // Add contributor node for commenter
        addContributorNode(graph, {
          name: comment.user.login,
          github: comment.user.login,
          avatarUrl: comment.user.avatar_url,
          type: 'contributor'
        });
        
        // Add contribution link for comment
        addLink(graph, {
          source: nodeId('contributor', comment.user.login),
          target: nodeId('content', `issues/${issue.number}`),
          type: config.contributionTypes.COMMENT,
          weight: 0.5,
          timestamp: comment.created_at,
          metadata: {
            commentId: comment.id,
            url: comment.html_url
          }
        });
      }
    }
    
    console.log(`Added contributions from ${issues.length} issues.`);
  } catch (error) {
    console.warn('Warning: Could not map issue contributions:', error.message);
  }
}

// Map contributions from pull requests
async function mapPRContributions(graph) {
  try {
    console.log('Mapping contributions from pull requests...');
    
    // Fetch PRs using GitHub API
    const prs = await fetchAllPullRequests();
    
    for (const pr of prs) {
      // Add contributor node for PR creator
      addContributorNode(graph, {
        name: pr.user.login,
        github: pr.user.login,
        avatarUrl: pr.user.avatar_url,
        type: 'contributor'
      });
      
      // Add content node for the PR
      addContentNode(graph, {
        path: `pulls/${pr.number}`,
        title: pr.title,
        type: 'pull_request'
      });
      
      // Add contribution link for PR creation
      addLink(graph, {
        source: nodeId('contributor', pr.user.login),
        target: nodeId('content', `pulls/${pr.number}`),
        type: config.contributionTypes.PR,
        weight: 1,
        timestamp: pr.created_at,
        metadata: {
          title: pr.title,
          state: pr.state,
          merged: pr.merged,
          url: pr.html_url
        }
      });
      
      // Fetch reviews for this PR
      const reviews = await fetchPRReviews(pr.number);
      
      for (const review of reviews) {
        // Add contributor node for reviewer
        addContributorNode(graph, {
          name: review.user.login,
          github: review.user.login,
          avatarUrl: review.user.avatar_url,
          type: 'contributor'
        });
        
        // Add contribution link for review
        addLink(graph, {
          source: nodeId('contributor', review.user.login),
          target: nodeId('content', `pulls/${pr.number}`),
          type: config.contributionTypes.REVIEW,
          weight: 0.8,
          timestamp: review.submitted_at,
          metadata: {
            reviewId: review.id,
            state: review.state,
            url: review.html_url
          }
        });
      }
      
      // Fetch comments for this PR
      const comments = await fetchPRComments(pr.number);
      
      for (const comment of comments) {
        // Add contributor node for commenter
        addContributorNode(graph, {
          name: comment.user.login,
          github: comment.user.login,
          avatarUrl: comment.user.avatar_url,
          type: 'contributor'
        });
        
        // Add contribution link for comment
        addLink(graph, {
          source: nodeId('contributor', comment.user.login),
          target: nodeId('content', `pulls/${pr.number}`),
          type: config.contributionTypes.COMMENT,
          weight: 0.5,
          timestamp: comment.created_at,
          metadata: {
            commentId: comment.id,
            url: comment.html_url
          }
        });
      }
    }
    
    console.log(`Added contributions from ${prs.length} pull requests.`);
  } catch (error) {
    console.warn('Warning: Could not map PR contributions:', error.message);
  }
}

// Map contributions from discussions
async function mapDiscussionContributions(graph) {
  try {
    console.log('Mapping contributions from discussions...');
    
    // Fetch discussions using GitHub GraphQL API
    // This requires GraphQL, which is more complex than the REST examples
    // Placeholder implementation that would be replaced with actual GraphQL query
    
    console.log('Discussions mapping requires GraphQL API - placeholder implemented.');
  } catch (error) {
    console.warn('Warning: Could not map discussion contributions:', error.message);
  }
}

// Calculate attribution metrics
function calculateAttributionMetrics(graph) {
  // Calculate contribution count per contributor
  const contributorNodes = graph.nodes.filter(node => node.type === 'contributor');
  
  for (const node of contributorNodes) {
    // Count links where this contributor is the source
    const contributions = graph.links.filter(link => link.source === node.id);
    node.contributions = contributions.length;
    
    // Calculate contribution breakdown by type
    const typeBreakdown = {};
    for (const link of contributions) {
      typeBreakdown[link.type] = (typeBreakdown[link.type] || 0) + 1;
    }
    node.contributionBreakdown = typeBreakdown;
  }
  
  // Calculate overall metrics
  graph.metadata.metrics = {
    contributorCount: contributorNodes.length,
    totalContributions: graph.links.length,
    contentNodes: graph.nodes.filter(node => node.type !== 'contributor').length,
    density: graph.links.length / (graph.nodes.length * (graph.nodes.length - 1) / 2),
    lastUpdated: new Date().toISOString()
  };
}

// Helper functions

// Add a contributor node if it doesn't exist
function addContributorNode(graph, contributor) {
  const id = nodeId('contributor', contributor.name || contributor.github);
  
  // Check if node already exists
  if (!graph.nodes.some(node => node.id === id)) {
    graph.nodes.push({
      id,
      name: contributor.name,
      email: contributor.email,
      github: contributor.github,
      avatarUrl: contributor.avatarUrl,
      type: 'contributor',
      contributions: 0
    });
  }
}

// Add a content node if it doesn't exist
function addContentNode(graph, content) {
  const id = nodeId('content', content.path);
  
  // Check if node already exists
  if (!graph.nodes.some(node => node.id === id)) {
    graph.nodes.push({
      id,
      path: content.path,
      title: content.title,
      type: content.type
    });
  }
}

// Add a link if it doesn't exist
function addLink(graph, link) {
  // Check if link already exists
  if (!graph.links.some(l => 
    l.source === link.source && 
    l.target === link.target && 
    l.type === link.type &&
    l.timestamp === link.timestamp
  )) {
    graph.links.push(link);
  }
}

// Generate a node ID
function nodeId(type, name) {
  return `${type}:${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

// Get file type
function getFileType(path) {
  const ext = path.split('.').pop().toLowerCase();
  
  if (['md', 'markdown'].includes(ext)) return 'markdown';
  if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) return 'javascript';
  if (['py'].includes(ext)) return 'python';
  if (['r'].includes(ext)) return 'r';
  if (['ipynb'].includes(ext)) return 'notebook';
  if (['json', 'yaml', 'yml'].includes(ext)) return 'data';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) return 'image';
  if (['css', 'scss', 'less'].includes(ext)) return 'style';
  if (['html', 'htm'].includes(ext)) return 'html';
  
  return 'other';
}

// GitHub API helpers

// Fetch all issues
async function fetchAllIssues() {
  const issues = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      page
    });
    
    if (response.data.length > 0) {
      issues.push(...response.data);
      page++;
    } else {
      hasMore = false;
    }
  }
  
  return issues;
}

// Fetch issue comments
async function fetchIssueComments(issueNumber) {
  const response = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100
  });
  
  return response.data;
}

// Fetch all pull requests
async function fetchAllPullRequests() {
  const prs = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100,
      page
    });
    
    if (response.data.length > 0) {
      prs.push(...response.data);
      page++;
    } else {
      hasMore = false;
    }
  }
  
  return prs;
}

// Fetch PR reviews
async function fetchPRReviews(prNumber) {
  const response = await octokit.pulls.listReviews({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100
  });
  
  return response.data;
}

// Fetch PR comments
async function fetchPRComments(prNumber) {
  const response = await octokit.pulls.listComments({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100
  });
  
  return response.data;
}

// Run the attribution mapping
generateAttributionMap().catch(error => {
  console.error('Error in attribution mapping:', error);
  process.exit(1);
});

// residue-analysis.js
//
// This script analyzes and tracks symbolic residue - epistemic artifacts that emerge
// from failed or incomplete explanations. Rather than treating these as errors,
// Recursive Distill values them as signals about knowledge boundaries.

const fs = require('fs');
const path = require('path');
const util = require('util');
const glob = util.promisify(require('glob'));
const matter = require('gray-matter');
const { Octokit } = require('@octokit/rest');
const natural = require('natural');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get repository information from environment
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'recursive-distill/test-article').split('/');

// Configuration
const config = {
  paths: {
    content: 'content/',
    meta: 'meta/',
    residueOutput: 'meta/residue.json'
  },
  residueTypes: {
    ATTRIBUTION_VOID: 'Attribution Void',
    TOKEN_HESITATION: 'Token Hesitation',
    RECURSIVE_COLLAPSE: 'Recursive Collapse',
    BOUNDARY_EROSION: 'Boundary Erosion',
    PHASE_MISALIGNMENT: 'Phase Misalignment'
  }
};

// Main function
async function analyzeResidue() {
  console.log('🜏 Analyzing Symbolic Residue...');
  
  // Ensure meta directory exists
  if (!fs.existsSync(config.paths.meta)) {
    fs.mkdirSync(config.paths.meta, { recursive: true });
  }
  
  // Initialize or load residue catalog
  let residueCatalog = initializeResidueCatalog();
  
  try {
    // Analyze content for potential residue
    await analyzeContentResidue(residueCatalog);
    
    // Analyze issues marked as residue
    await analyzeIssueResidue(residueCatalog);
    
    // Check for residue in PR review comments
    await analyzePRResidue(residueCatalog);
    
    // Calculate residue metrics
    calculateResidueMetrics(residueCatalog);
    
    // Save residue catalog
    fs.writeFileSync(
      config.paths.residueOutput, 
      JSON.stringify(residueCatalog, null, 2)
    );
    
    console.log(`✅ Residue analysis complete. Catalog contains ${residueCatalog.instances.length} residue instances.`);
    
  } catch (error) {
    console.error('Error analyzing residue:', error);
    process.exit(1);
  }
}

// Initialize residue catalog
function initializeResidueCatalog() {
  if (fs.existsSync(config.paths.residueOutput)) {
    try {
      return JSON.parse(fs.readFileSync(config.paths.residueOutput, 'utf8'));
    } catch (error) {
      console.warn('Could not parse existing residue catalog, creating new one:', error.message);
    }
  }
  
  return {
    instances: [],
    meta: {
      repository: `${owner}/${repo}`,
      created: new Date().toISOString(),
      version: '1.0.0',
      count: 0
    }
  };
}

// Analyze content for potential residue
async function analyzeContentResidue(catalog) {
  console.log('Analyzing content for symbolic residue...');
  
  // Get all markdown files
  const contentFiles = await glob(`${config.paths.content}**/*.md`);
  
  for (const file of contentFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdown } = matter(content);
      
      // Check for explicit residue markers in metadata
      if (data && data.residue && Array.isArray(data.residue)) {
        for (const residueItem of data.residue) {
          const residueInstance = {
            id: `residue-content-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            classification: residueItem.type || 'Unclassified',
            description: residueItem.description || 'Author-identified residue',
            section: residueItem.section || path.basename(file),
            failureMode: residueItem.failureMode || 'Unknown',
            recursiveDepth: residueItem.depth || 'Unknown',
            valence: residueItem.valence || 'Neutral (neither helps nor hinders)',
            detected: new Date().toISOString(),
            reporter: 'author',
            source: 'content',
            status: 'active',
            location: {
              file: file,
              line: residueItem.line || null
            }
          };
          
          addResidueInstance(catalog, residueInstance);
        }
      }
      
      // Check for inline residue markers (🜏)
      const residueMarkerMatches = markdown.match(/🜏\s*([\s\S]*?)(?:🜏|$)/g);
      if (residueMarkerMatches) {
        for (const match of residueMarkerMatches) {
          const description = match.replace(/🜏/g, '').trim();
          
          const residueInstance = {
            id: `residue-inline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            classification: detectResidueType(description),
            description,
            section: path.basename(file),
            failureMode: 'Explicit marker',
            recursiveDepth: detectRecursiveDepth(description),
            valence: 'Positive (reveals important boundary)',
            detected: new Date().toISOString(),
            reporter: 'author',
            source: 'inline',
            status: 'active',
            location: {
              file: file,
              // This is just an estimate, would need better line detection
              line: getApproximateLineNumber(content, match)
            }
          };
          
          addResidueInstance(catalog, residueInstance);
        }
      }
      
      // Detect potential unmarked residue through linguistic patterns
      const potentialResidues = detectPotentialResidue(markdown);
      for (const residue of potentialResidues) {
        const residueInstance = {
          id: `residue-detected-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          classification: residue.type,
          description: residue.text,
          section: path.basename(file),
          failureMode: residue.pattern,
          recursiveDepth: 'Surface (linguistic/presentational)',
          valence: 'Neutral (neither helps nor hinders)',
          detected: new Date().toISOString(),
          reporter: 'system',
          source: 'detection',
          status: 'pending', // Needs human verification
          location: {
            file: file,
            line: getApproximateLineNumber(content, residue.text)
          }
        };
        
        addResidueInstance(catalog, residueInstance);
      }
    } catch (error) {
      console.warn(`Warning: Could not analyze ${file} for residue:`, error.message);
    }
  }
}

// Analyze issues marked as residue
async function analyzeIssueResidue(catalog) {
  try {
    console.log('Analyzing issues for symbolic residue...');
    
    // Fetch issues with "meta:residue" label or [RESIDUE] in title
    const issues = await fetchResidueIssues();
    
    for (const issue of issues) {
      // Parse residue data from issue
function parseResidueFromIssue(issue) {
  const body = issue.body || '';
  
  // Extract residue classification
  let classification = 'Unclassified';
  const classMatch = body.match(/### Residue Classification[\s\S]*?- \[(x|X| )\] (.+?)(?:\r?\n|\r)/);
  if (classMatch && classMatch[1].toLowerCase() === 'x') {
    classification = classMatch[2].trim();
  }
  
  // Extract residue description
  let description = '';
  const descMatch = body.match(/### Residue Description[\s\S]*?\r?\n([\s\S]*?)(?:\r?\n###|$)/);
  if (descMatch) {
    description = descMatch[1].trim();
  }
  
  // Extract location
  let section = '';
  const sectionMatch = body.match(/\*\*Section\*\*: *(.*?)(?:\r?\n|\r)/);
  if (sectionMatch) {
    section = sectionMatch[1].trim();
  }
  
  // Extract failure mode
  let failureMode = 'Unknown';
  const failureModeMatch = body.match(/### Failure Mode[\s\S]*?\r?\n([\s\S]*?)(?:\r?\n###|$)/);
  if (failureModeMatch) {
    failureMode = failureModeMatch[1].trim();
  }
  
  // Extract recursive depth
  let recursiveDepth = 'Unknown';
  const depthMatch = body.match(/### Recursive Depth[\s\S]*?- \[(x|X| )\] (.+?)(?:\r?\n|\r)/);
  if (depthMatch && depthMatch[1].toLowerCase() === 'x') {
    recursiveDepth = depthMatch[2].trim();
  }
  
  // Extract residue valence
  let valence = 'Neutral (neither helps nor hinders)';
  const valenceMatch = body.match(/### Residue Valence[\s\S]*?- \[(x|X| )\] (.+?)(?:\r?\n|\r)/);
  if (valenceMatch && valenceMatch[1].toLowerCase() === 'x') {
    valence = valenceMatch[2].trim();
  }
  
  return {
    id: `residue-issue-${issue.number}-${Date.now().toString(36)}`,
    classification,
    description: description || issue.title,
    section,
    failureMode,
    recursiveDepth,
    valence,
    detected: issue.created_at,
    reporter: issue.user.login,
    source: 'issue',
    status: 'active',
    issueNumber: issue.number,
    issueUrl: issue.html_url
  };
}

// Analyze PR review comments for residue
async function analyzePRResidue(catalog) {
  try {
    console.log('Analyzing PR reviews for symbolic residue...');
    
    // Fetch PRs
    const prs = await fetchAllPullRequests();
    
    for (const pr of prs) {
      // Fetch review comments
      const comments = await fetchPRComments(pr.number);
      
      // Filter for comments containing residue markers
      const residueComments = comments.filter(comment => 
        comment.body.includes('🜏') || 
        comment.body.includes('symbolic residue') ||
        comment.body.includes('residue detection')
      );
      
      for (const comment of residueComments) {
        // Extract description - text between residue markers or whole comment
        let description = comment.body;
        const markerMatch = comment.body.match(/🜏\s*([\s\S]*?)(?:🜏|$)/);
        if (markerMatch) {
          description = markerMatch[1].trim();
        }
        
        // Create residue instance
        const residueInstance = {
          id: `residue-pr-${pr.number}-comment-${comment.id}`,
          classification: detectResidueType(description),
          description,
          section: `Pull Request #${pr.number}`,
          failureMode: 'Review feedback',
          recursiveDepth: detectRecursiveDepth(description),
          valence: 'Neutral (neither helps nor hinders)',
          detected: comment.created_at,
          reporter: comment.user.login,
          source: 'pr_comment',
          status: 'active',
          prNumber: pr.number,
          commentId: comment.id,
          commentUrl: comment.html_url
        };
        
        addResidueInstance(catalog, residueInstance);
      }
    }
  } catch (error) {
    console.warn('Warning: Could not analyze PR comments for residue:', error.message);
  }
}

// Calculate residue metrics
function calculateResidueMetrics(catalog) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Count instances by classification
  const classificationCounts = {};
  for (const instance of catalog.instances) {
    classificationCounts[instance.classification] = 
      (classificationCounts[instance.classification] || 0) + 1;
  }
  
  // Find dominant classification
  let dominantClassification = 'None';
  let maxCount = 0;
  for (const [classification, count] of Object.entries(classificationCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantClassification = classification;
    }
  }
  
  // Count by status
  const activeCount = catalog.instances.filter(i => i.status === 'active').length;
  const resolvedCount = catalog.instances.filter(i => i.status === 'resolved').length;
  const pendingCount = catalog.instances.filter(i => i.status === 'pending').length;
  
  // Count by valence
  const positiveCount = catalog.instances.filter(i => 
    i.valence === 'Positive (reveals important boundary)'
  ).length;
  const neutralCount = catalog.instances.filter(i => 
    i.valence === 'Neutral (neither helps nor hinders)'
  ).length;
  const negativeCount = catalog.instances.filter(i => 
    i.valence === 'Negative (obscures understanding)'
  ).length;
  
  // Count recent instances
  const recentCount = catalog.instances.filter(i => 
    new Date(i.detected) > thirtyDaysAgo
  ).length;
  
  // Update metrics
  catalog.meta = {
    ...catalog.meta,
    count: catalog.instances.length,
    lastUpdated: now.toISOString(),
    metrics: {
      byClassification: classificationCounts,
      byStatus: {
        active: activeCount,
        resolved: resolvedCount,
        pending: pendingCount
      },
      byValence: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount
      },
      dominantClassification,
      recent: recentCount
    }
  };
}

// Helper Functions

// Add a residue instance if it doesn't exist
function addResidueInstance(catalog, instance) {
  // Check if similar instance already exists
  const exists = catalog.instances.some(existing => 
    existing.description === instance.description &&
    existing.section === instance.section
  );
  
  if (!exists) {
    catalog.instances.push(instance);
    console.log(`Added residue instance: ${instance.id} (${instance.classification})`);
  }
}

// Detect residue type from description
function detectResidueType(description) {
  // Simple keyword-based detection - would be more sophisticated in practice
  const keywords = {
    [config.residueTypes.ATTRIBUTION_VOID]: [
      'source', 'attribution', 'citation', 'where', 'provenance', 'origin',
      'evidence', 'support', 'basis', 'missing reference'
    ],
    [config.residueTypes.TOKEN_HESITATION]: [
      'uncertain', 'unclear', 'ambiguous', 'vague', 'confusing', 'hesitation',
      'imprecise', 'tension', 'ambivalent', 'wavering'
    ],
    [config.residueTypes.RECURSIVE_COLLAPSE]: [
      'recursive', 'self-reference', 'circular', 'loop', 'regress', 'collapse',
      'depth', 'meta', 'self-aware', 'reflection', 'infinite'
    ],
    [config.residueTypes.BOUNDARY_EROSION]: [
      'boundary', 'scope', 'limit', 'extent', 'border', 'edge', 'constraint',
      'domain', 'territory', 'definition', 'delineation'
    ],
    [config.residueTypes.PHASE_MISALIGNMENT]: [
      'inconsistent', 'contradiction', 'misalignment', 'conflict', 'divergent',
      'phase', 'direction', 'vector', 'opposing', 'incoherent'
    ]
  };
  
  // Count keyword matches for each type
  const scores = {};
  for (const [type, typeKeywords] of Object.entries(keywords)) {
    scores[type] = 0;
    for (const keyword of typeKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(description)) {
        scores[type]++;
      }
    }
  }
  
  // Find type with highest score
  let maxType = config.residueTypes.TOKEN_HESITATION; // Default
  let maxScore = 0;
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }
  
  return maxType;
}

// Detect recursive depth from description
function detectRecursiveDepth(description) {
  // Check for depth indicators
  if (/\b(deep|profound|fundamental|ontological|conceptual)\b/i.test(description)) {
    return 'Deep (conceptual/ontological)';
  }
  
  if (/\b(explain|explanation|theory|understand|concept|framework)\b/i.test(description)) {
    return 'Intermediate (explanatory)';
  }
  
  return 'Surface (linguistic/presentational)';
}

// Get approximate line number for a substring in text
function getApproximateLineNumber(text, substring) {
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(substring)) {
      return i + 1;
    }
  }
  
  return null;
}

// Detect potential residue through linguistic patterns
function detectPotentialResidue(text) {
  const potentialResidues = [];
  
  // Patterns that might indicate residue
  const patterns = [
    {
      pattern: 'Explicit uncertainty',
      regex: /\b(?:unclear|uncertain|ambiguous|not sure|may be|might be|perhaps|possibly|I think)\b/gi,
      type: config.residueTypes.TOKEN_HESITATION
    },
    {
      pattern: 'Citation needed',
      regex: /\b(?:according to|research shows|studies indicate|evidence suggests)\b(?:(?!\[\^).)*?(?:\.|\?|\!|\n)/gi,
      type: config.residueTypes.ATTRIBUTION_VOID
    },
    {
      pattern: 'Self-reference struggle',
      regex: /\b(?:recursively|self-referential|meta|recursive|referring to itself)\b.*?(?:challenging|difficult|problem|issue|question)/gi,
      type: config.residueTypes.RECURSIVE_COLLAPSE
    },
    {
      pattern: 'Boundary acknowledgment',
      regex: /\b(?:beyond the scope|outside the scope|boundary|boundaries|limits|limitations|constraints)\b/gi,
      type: config.residueTypes.BOUNDARY_EROSION
    },
    {
      pattern: 'Contradiction acknowledgment',
      regex: /\b(?:however|conversely|on the other hand|in contrast|paradoxically|contradicts|contradicting|contradiction)\b/gi,
      type: config.residueTypes.PHASE_MISALIGNMENT
    }
  ];
  
  // Check each pattern
  for (const { pattern, regex, type } of patterns) {
    const matches = text.match(regex);
    if (matches) {
      for (const match of matches) {
        potentialResidues.push({
          text: match,
          pattern,
          type
        });
      }
    }
  }
  
  return potentialResidues;
}

// GitHub API helpers

// Fetch issues with residue label or title
async function fetchResidueIssues() {
  try {
    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      labels: 'meta:residue',
      per_page: 100
    });
    
    // Also fetch issues with [RESIDUE] in title
    const titleResponse = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    
    const residueIssues = response.data;
    const titleResidueIssues = titleResponse.data.filter(issue => 
      issue.title.includes('[RESIDUE]') && 
      !residueIssues.some(ri => ri.number === issue.number) // Avoid duplicates
    );
    
    return [...residueIssues, ...titleResidueIssues];
  } catch (error) {
    console.warn('Warning: Could not fetch residue issues:', error.message);
    return [];
  }
}

// Fetch all pull requests
async function fetchAllPullRequests() {
  try {
    const response = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      per_page: 100
    });
    
    return response.data;
  } catch (error) {
    console.warn('Warning: Could not fetch pull requests:', error.message);
    return [];
  }
}

// Fetch PR comments
async function fetchPRComments(prNumber) {
  try {
    const response = await octokit.pulls.listReviewComments({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100
    });
    
    // Also get issue comments on the PR
    const issueCommentsResponse = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
      per_page: 100
    });
    
    return [...response.data, ...issueCommentsResponse.data];
  } catch (error) {
    console.warn(`Warning: Could not fetch comments for PR #${prNumber}:`, error.message);
    return [];
  }
}

// Run the residue analysis
analyzeResidue().catch(error => {
  console.error('Error in residue analysis:', error);
  process.exit(1);
});

// coherence-report.js
//
// This script generates comprehensive coherence reports for Recursive Distill articles,
// analyzing coherence trends over time and providing detailed breakdowns of coherence components.

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { Octokit } = require('@octokit/rest');

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Get repository information from environment
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'recursive-distill/test-article').split('/');

// Configuration
const config = {
  paths: {
    meta: 'meta/',
    coherenceHistory: 'meta/coherence-history.json',
    coherenceReport: 'meta/coherence-report.json'
  },
  reportPeriod: {
    days: 7 // Weekly report by default
  }
};

// Main function
async function generateCoherenceReport() {
  console.log('📊 Generating Comprehensive Coherence Report...');
  
  // Ensure meta directory exists
  if (!fs.existsSync(config.paths.meta)) {
    fs.mkdirSync(config.paths.meta, { recursive: true });
  }
  
  try {
    // Load coherence history or create new one
    let coherenceHistory = loadCoherenceHistory();
    
    // Get current coherence data
    const currentCoherence = getCurrentCoherence();
    
    // Add to history
    addToCoherenceHistory(coherenceHistory, currentCoherence);
    
    // Generate report for the specified period
    const report = generatePeriodReport(coherenceHistory);
    
    // Save history and report
    fs.writeFileSync(
      config.paths.coherenceHistory, 
      JSON.stringify(coherenceHistory, null, 2)
    );
    
    fs.writeFileSync(
      config.paths.coherenceReport, 
      JSON.stringify(report, null, 2)
    );
    
    console.log('✅ Coherence report generated successfully.');
    console.log(`📈 Overall Coherence: ${report.overall.current.toFixed(2)} ${getChangeIndicator(report.overall.current, report.overall.previous)}`);
    
  } catch (error) {
    console.error('Error generating coherence report:', error);
    process.exit(1);
  }
}

// Load coherence history
function loadCoherenceHistory() {
  if (fs.existsSync(config.paths.coherenceHistory)) {
    try {
      return JSON.parse(fs.readFileSync(config.paths.coherenceHistory, 'utf8'));
    } catch (error) {
      console.warn('Could not parse existing coherence history, creating new one:', error.message);
    }
  }
  
  return {
    entries: [],
    metadata: {
      repository: `${owner}/${repo}`,
      created: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

// Get current coherence data
function getCurrentCoherence() {
  const coherencePath = path.join(config.paths.meta, 'coherence.json');
  
  if (!fs.existsSync(coherencePath)) {
    throw new Error('Coherence data not found. Run coherence-check.js first.');
  }
  
  try {
    const coherenceData = JSON.parse(fs.readFileSync(coherencePath, 'utf8'));
    
    return {
      timestamp: new Date().toISOString(),
      overallScore: coherenceData.overallScore,
      components: coherenceData.components,
      details: coherenceData.details,
      metadata: coherenceData.metadata
    };
  } catch (error) {
    throw new Error(`Could not parse coherence data: ${error.message}`);
  }
}

// Add current coherence to history
function addToCoherenceHistory(history, currentCoherence) {
  history.entries.push(currentCoherence);
  
  // Sort entries by timestamp (oldest first)
  history.entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Update metadata
  history.metadata.lastUpdated = new Date().toISOString();
  history.metadata.entryCount = history.entries.length;
}

// Generate report for specified period
async function generatePeriodReport(history) {
  // Calculate period start date
  const now = new Date();
  const periodStart = new Date(now.getTime() - (config.reportPeriod.days * 24 * 60 * 60 * 1000));
  
  // Get entries for the period
  const periodEntries = history.entries.filter(entry => 
    new Date(entry.timestamp) >= periodStart
  );
  
  // Get latest entry before period for comparison
  const previousEntries = history.entries.filter(entry => 
    new Date(entry.timestamp) < periodStart
  );
  
  const previousEntry = previousEntries.length > 0 
    ? previousEntries[previousEntries.length - 1] 
    : null;
  
  // Get current (latest) coherence
  const currentEntry = history.entries.length > 0
    ? history.entries[history.entries.length - 1]
    : null;
  
  if (!currentEntry) {
    throw new Error('No coherence data available for reporting.');
  }
  
  // Calculate period metrics
  const overallCurrent = currentEntry.overallScore;
  const overallPrevious = previousEntry ? previousEntry.overallScore : null;
  
  // Component metrics
  const componentMetrics = {};
  
  for (const [component, value] of Object.entries(currentEntry.components)) {
    componentMetrics[component] = {
      current: value,
      previous: previousEntry ? previousEntry.components[component] : null,
      change: previousEntry 
        ? value - previousEntry.components[component] 
        : null,
      details: currentEntry.details[component] || [],
      recommendations: generateComponentRecommendations(component, value)
    };
  }
  
  // Fetch repository activity data
  const repoActivity = await fetchRepositoryActivity(periodStart);
  
  // Get attribution data if available
  let attributionData = { activeContributors: 0, newContributors: 0, density: 0 };
  try {
    if (fs.existsSync(path.join(config.paths.meta, 'attribution.json'))) {
      const attribution = JSON.parse(fs.readFileSync(path.join(config.paths.meta, 'attribution.json'), 'utf8'));
      attributionData = {
        activeContributors: attribution.nodes.filter(n => n.type === 'contributor').length,
        newContributors: attribution.nodes.filter(n => 
          n.type === 'contributor' && 
          new Date(n.firstContribution || now) >= periodStart
        ).length,
        density: attribution.metadata.metrics?.density || 0
      };
    }
  } catch (error) {
    console.warn('Could not load attribution data:', error.message);
  }
  
  // Get residue data if available
  let residueData = { new: 0, resolved: 0, active: 0, dominantType: 'None' };
  try {
    if (fs.existsSync(path.join(config.paths.meta, 'residue.json'))) {
      const residue = JSON.parse(fs.readFileSync(path.join(config.paths.meta, 'residue.json'), 'utf8'));
      residueData = {
        new: residue.instances.filter(i => new Date(i.detected) >= periodStart).length,
        resolved: residue.instances.filter(i => 
          i.status === 'resolved' && 
          new Date(i.resolvedAt || now) >= periodStart
        ).length,
        active: residue.instances.filter(i => i.status === 'active').length,
        dominantType: residue.meta.metrics?.dominantClassification || 'None'
      };
    }
  } catch (error) {
    console.warn('Could not load residue data:', error.message);
  }
  
  // Generate overall recommendations
  const recommendations = generateOverallRecommendations(componentMetrics, repoActivity, residueData);
  
  // Construct the final report
  return {
    period: {
      start: periodStart.toISOString(),
      end: now.toISOString(),
      days: config.reportPeriod.days
    },
    overall: {
      current: overallCurrent,
      previous: overallPrevious,
      change: overallPrevious !== null ? overallCurrent - overallPrevious : null
    },
    components: componentMetrics,
    commits: repoActivity.commits,
    issuesAddressed: repoActivity.closedIssues,
    openIssues: repoActivity.openIssues,
    attribution: attributionData,
    residue: residueData,
    recommendations,
    metadata: {
      repository: `${owner}/${repo}`,
      generated: now.toISOString(),
      coherenceEntries: periodEntries.length,
      version: '1.0.0'
    }
  };
}

// Generate component-specific recommendations
function generateComponentRecommendations(component, value) {
  // Default recommendations for each component
  const defaultRecommendations = {
    signalAlignment: [
      'Add more citations to support claims',
      'Include evidence for empirical statements',
      'Link assertions to data or references',
      'Clarify which parts are speculation vs. established fact'
    ],
    feedbackResponsiveness: [
      'Address open issues more promptly',
      'Incorporate reviewer feedback more thoroughly',
      'Document changes made in response to feedback',
      'Implement suggestions from past reviews'
    ],
    boundedIntegrity: [
      'More clearly define scope boundaries',
      'Reduce topic drift in later sections',
      'Ensure consistent terminology throughout',
      'Clarify what is in-scope vs. out-of-scope'
    ],
    elasticTolerance: [
      'Better acknowledge contradictory evidence',
      'Include multiple perspectives on complex topics',
      'More explicitly acknowledge limitations',
      'Represent uncertainty more clearly'
    ]
  };
  
  // Return recommendations based on component value
  if (value < 0.7) {
    // Return all recommendations for low values
    return defaultRecommendations[component] || [];
  } else if (value < 0.85) {
    // Return top two recommendations for medium values
    return (defaultRecommendations[component] || []).slice(0, 2);
  } else {
    // Return top recommendation for high values
    return (defaultRecommendations[component] || []).slice(0, 1);
  }
}

// Generate overall recommendations
function generateOverallRecommendations(componentMetrics, repoActivity, residueData) {
  const recommendations = [];
  
  // Add recommendations for low-scoring components
  for (const [component, metrics] of Object.entries(componentMetrics)) {
    if (metrics.current < 0.7) {
      recommendations.push(
        `Improve ${component} (${metrics.current.toFixed(2)}) by implementing the following: ${metrics.recommendations[0]}`
      );
    }
  }
  
  // Activity-based recommendations
  if (repoActivity.commitCount === 0) {
    recommendations.push('Increase development activity with regular commits to improve content and address issues');
  }
  
  if (repoActivity.closedIssues === 0 && repoActivity.openIssues > 0) {
    recommendations.push('Address open issues to improve feedback responsiveness');
  }
  
  // Residue-based recommendations
  if (residueData.active > 10 && residueData.resolved === 0) {
    recommendations.push('Address accumulated symbolic residue to improve conceptual clarity');
  }
  
  // If everything looks good
  if (recommendations.length === 0) {
    recommendations.push('Maintain current coherence practices and continue regular improvements');
  }
  
  return recommendations;
}

// Fetch repository activity
async function fetchRepositoryActivity(periodStart) {
  try {
    // Get commits since period start
    const { stdout: commitOutput } = await exec(
      `git log --since="${periodStart.toISOString()}" --format="%H"`
    );
    const commits = commitOutput.trim().split('\n').filter(Boolean);
    
    // Fetch issues
    const openIssuesResponse = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: 100
    });
    
    const closedIssuesResponse = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'closed',
      since: periodStart.toISOString(),
      per_page: 100
    });
    
    // Filter out PRs from issues
    const openIssues = openIssuesResponse.data.filter(issue => !issue.pull_request);
    const closedIssues = closedIssuesResponse.data.filter(issue => !issue.pull_request);
    
    return {
      commitCount: commits.length,
      commits: commits.map(hash => hash.substring(0, 7)),
      openIssues: openIssues.length,
      closedIssues: closedIssues.length
    };
  } catch (error) {
    console.warn('Warning: Could not fetch repository activity:', error.message);
    return {
      commitCount: 0,
      commits: [],
      openIssues: 0,
      closedIssues: 0
    };
  }
}

// Helper function for change indicators
function getChangeIndicator(current, previous) {
  if (previous === null) return '';
  
  const change = current - previous;
  if (Math.abs(change) < 0.05) return '→'; // No significant change
  return change > 0 ? '↑' : '↓';
}

// Run the coherence report generator
generateCoherenceReport().catch(error => {
  console.error('Error in coherence report generation:', error);
  process.exit(1);
});
      
      
