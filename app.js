// Commutr - Interactive Prototype JavaScript

// Global state
let currentScreen = 'loading-screen';
let selectedCommute = null;
let selectedMood = null;
let selectedTopics = [];
let selectedContent = null;
let currentLessonSection = 0;
let lessonTimer = null;
let isPaused = false;
let userProfile = null;
let selectedPath = null;
let currentQuizQuestion = 0;
let quizScore = 0;

// Dynamic lesson pool with varied content
const lessonPool = [
  {
    id: 'ai-leadership',
    title: 'Leading Through AI Transformation',
    type: 'Executive Brief',
    duration: 8,
    difficulty: 'Advanced',
    creator: 'Sarah Chen, McKinsey',
    summary: 'Strategic insights for executives navigating AI adoption in finance',
    moods: ['focused', 'reflective'],
    topics: ['AI & Leadership', 'Executive Skills'],
    sections: [
      {
        title: "The Leadership Paradox",
        content: "While AI automates routine tasks, it amplifies the need for uniquely human leadership skills. Executives must balance technological adoption with human-centered decision making.",
        takeaway: "Focus on developing emotional intelligence and strategic thinking as AI handles operational complexity."
      },
      {
        title: "Building AI-Ready Culture",
        content: "Cultural transformation precedes technological transformation. Leaders must create psychological safety for experimentation while addressing employee fears about job displacement.",
        takeaway: "Invest in change management and transparent communication about AI's role in augmenting, not replacing, human capabilities."
      },
      {
        title: "Data-Driven Decision Making",
        content: "AI effectiveness depends on data quality and organizational data literacy. Leaders must champion data governance and ensure teams understand how to interpret AI insights.",
        takeaway: "Establish clear data governance frameworks and invest in team training on AI interpretation and decision-making."
      },
      {
        title: "Strategic Implementation",
        content: "Successful AI transformation requires a phased approach. Start with pilot programs in non-critical areas to build confidence and learn before scaling to core business functions.",
        takeaway: "Begin with low-risk, high-impact AI implementations to demonstrate value and build organizational buy-in."
      },
      {
        title: "Measuring AI ROI",
        content: "Traditional ROI metrics may not capture AI's full value. Consider productivity gains, decision speed improvements, and risk reduction alongside direct cost savings.",
        takeaway: "Develop comprehensive metrics that capture both quantitative and qualitative benefits of AI implementation."
      },
      {
        title: "Ethical AI Leadership",
        content: "Leaders must establish ethical guidelines for AI use, ensuring fairness, transparency, and accountability in automated decision-making processes.",
        takeaway: "Create clear ethical AI policies and governance structures to maintain trust and regulatory compliance."
      },
      {
        title: "Future-Proofing Your Organization",
        content: "AI technology evolves rapidly. Build adaptive capabilities and continuous learning systems rather than betting on specific technologies.",
        takeaway: "Focus on building organizational agility and learning capacity rather than committing to specific AI solutions."
      }
    ],
    quiz: [
      {
        question: "What is the key leadership challenge with AI adoption?",
        options: ["Technical complexity", "Balancing automation with human skills", "Cost management", "Timeline pressure"],
        correct: 1
      },
      {
        question: "What's the recommended approach for AI implementation?",
        options: ["Full deployment immediately", "Phased pilot programs", "Wait for competitors", "Outsource completely"],
        correct: 1
      }
    ]
  },
  {
    id: 'fintech-trends',
    title: 'Q4 Fintech Market Pulse',
    type: 'Market Analysis',
    duration: 12,
    difficulty: 'Intermediate',
    creator: 'Bloomberg Intelligence',
    summary: 'Key market movements and emerging opportunities in fintech',
    moods: ['curious', 'focused'],
    topics: ['Fintech Trends', 'Market Analysis'],
    sections: [
      {
        title: "Digital Banking Evolution",
        content: "Traditional banks are accelerating digital transformation, with 73% increasing tech budgets. Neo-banks face profitability pressure as interest rates rise.",
        takeaway: "Focus on sustainable unit economics over rapid growth in current market conditions."
      },
      {
        title: "Embedded Finance Revolution",
        content: "Non-financial companies are integrating payment and lending services. Shopify's merchant lending and Uber's instant pay demonstrate the $7 trillion embedded finance opportunity.",
        takeaway: "Consider how financial services can be seamlessly integrated into your customer journey."
      },
      {
        title: "RegTech Investment Surge",
        content: "Regulatory technology spending will reach $55B by 2025. AI-powered compliance monitoring and automated reporting are becoming competitive advantages.",
        takeaway: "Invest in RegTech solutions to turn compliance from cost center to competitive advantage."
      },
      {
        title: "Cryptocurrency Institutional Adoption",
        content: "Major institutions are building crypto capabilities. BlackRock's Bitcoin ETF and JPMorgan's blockchain initiatives signal mainstream acceptance.",
        takeaway: "Develop a clear cryptocurrency strategy aligned with institutional risk tolerance and regulatory requirements."
      },
      {
        title: "Open Banking Expansion",
        content: "Open banking APIs enable third-party financial services. PSD2 in Europe and similar regulations globally are creating new partnership opportunities.",
        takeaway: "Explore open banking partnerships to expand service offerings without building from scratch."
      },
      {
        title: "AI in Risk Management",
        content: "Machine learning models are revolutionizing credit scoring and fraud detection. Real-time risk assessment enables instant lending decisions.",
        takeaway: "Implement AI-driven risk models to improve decision speed while maintaining risk quality."
      },
      {
        title: "Sustainable Finance Growth",
        content: "ESG-focused fintech solutions are growing 40% annually. Green bonds and carbon credit trading platforms represent emerging opportunities.",
        takeaway: "Integrate sustainability metrics into financial products to meet growing ESG demand."
      }
    ],
    quiz: [
      {
        question: "What percentage of traditional banks increased tech budgets?",
        options: ["63%", "73%", "83%", "93%"],
        correct: 1
      }
    ]
  },
  {
    id: 'negotiation-tactics',
    title: 'Executive Negotiation Mastery',
    type: 'Skill Builder',
    duration: 15,
    difficulty: 'Advanced',
    creator: 'Harvard Business Review',
    summary: 'Advanced techniques for high-stakes business negotiations',
    moods: ['focused', 'energetic'],
    topics: ['Executive Skills', 'Team Management'],
    sections: [
      {
        title: "Anchoring Strategies",
        content: "The first number mentioned in a negotiation disproportionately influences the final outcome. Strategic anchoring can shift negotiations by 20-30%.",
        takeaway: "Always prepare multiple anchor points and lead with ambitious but justifiable positions."
      },
      {
        title: "Reading Body Language",
        content: "Non-verbal cues reveal true intentions. Watch for micro-expressions, posture changes, and vocal tone shifts that indicate comfort levels and decision points.",
        takeaway: "Develop your ability to read and control non-verbal communication for negotiation advantage."
      },
      {
        title: "The Power of Silence",
        content: "Strategic pauses create pressure and encourage the other party to reveal information. Silence after making an offer often leads to concessions.",
        takeaway: "Use silence as a negotiation tool - resist the urge to fill every pause with words."
      },
      {
        title: "BATNA Development",
        content: "Your Best Alternative to a Negotiated Agreement determines your negotiating power. Strong BATNAs enable confident decision-making and walking away.",
        takeaway: "Always develop multiple alternatives before entering any negotiation to strengthen your position."
      },
      {
        title: "Emotional Intelligence in Negotiations",
        content: "Managing emotions - both yours and theirs - is crucial for successful outcomes. Recognize emotional triggers and use empathy strategically.",
        takeaway: "Master emotional regulation and use emotional intelligence to build rapport and influence outcomes."
      },
      {
        title: "Multi-Party Negotiation Dynamics",
        content: "Complex negotiations involve multiple stakeholders with different interests. Map all parties, understand their motivations, and build coalitions.",
        takeaway: "In multi-party negotiations, focus on building alliances and managing competing interests strategically."
      }
    ],
    quiz: [
      {
        question: "How much can strategic anchoring influence negotiations?",
        options: ["10-15%", "20-30%", "40-50%", "60-70%"],
        correct: 1
      }
    ]
  },
  {
    id: 'strategic-thinking',
    title: 'Strategic Thinking for Executives',
    type: 'Leadership Framework',
    duration: 18,
    difficulty: 'Advanced',
    creator: 'Michael Porter, Harvard',
    summary: 'Develop systematic approaches to strategic analysis and decision-making',
    moods: ['reflective', 'focused'],
    topics: ['Executive Skills', 'Strategy'],
    sections: [
      {
        title: "Systems Thinking Fundamentals",
        content: "Strategic leaders see interconnections and feedback loops. Understanding how decisions ripple through complex systems prevents unintended consequences.",
        takeaway: "Always consider second and third-order effects when making strategic decisions."
      },
      {
        title: "Competitive Advantage Analysis",
        content: "Sustainable competitive advantages are rare and valuable. Use Porter's Five Forces to analyze industry structure and identify defensible positions.",
        takeaway: "Focus on building advantages that are difficult for competitors to replicate or substitute."
      },
      {
        title: "Scenario Planning Techniques",
        content: "The future is uncertain, but not random. Develop multiple plausible scenarios to stress-test strategies and build adaptive capacity.",
        takeaway: "Plan for multiple futures simultaneously to build organizational resilience."
      },
      {
        title: "Resource-Based Strategy",
        content: "Your unique resources and capabilities determine strategic options. Audit internal strengths and align strategy with distinctive competencies.",
        takeaway: "Build strategy around your unique strengths rather than copying competitors."
      },
      {
        title: "Strategic Trade-offs",
        content: "Strategy is about choosing what not to do. Clear trade-offs create focus and prevent strategic drift that dilutes competitive position.",
        takeaway: "Make explicit trade-offs and communicate them clearly throughout the organization."
      },
      {
        title: "Innovation Strategy",
        content: "Innovation requires systematic processes, not just creativity. Balance exploration of new opportunities with exploitation of existing capabilities.",
        takeaway: "Create structured innovation processes while maintaining operational excellence."
      }
    ],
    quiz: [
      {
        question: "What is the primary purpose of scenario planning?",
        options: ["Predict the future", "Build organizational resilience", "Reduce costs", "Increase efficiency"],
        correct: 1
      }
    ]
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation Leadership',
    type: 'Change Management',
    duration: 20,
    difficulty: 'Advanced',
    creator: 'MIT Sloan Executive Education',
    summary: 'Lead successful digital transformation initiatives in traditional organizations',
    moods: ['energetic', 'focused'],
    topics: ['Digital Strategy', 'Change Management'],
    sections: [
      {
        title: "Digital Maturity Assessment",
        content: "Transformation starts with honest assessment. Evaluate current digital capabilities across technology, data, processes, and culture dimensions.",
        takeaway: "Conduct comprehensive digital maturity audits before planning transformation initiatives."
      },
      {
        title: "Platform Strategy Development",
        content: "Digital platforms create exponential value through network effects. Shift from linear value chains to platform-based business models.",
        takeaway: "Think platforms, not products - focus on enabling ecosystems rather than controlling value chains."
      },
      {
        title: "Data as Strategic Asset",
        content: "Data is the new oil, but only if refined properly. Develop data governance, analytics capabilities, and data-driven decision cultures.",
        takeaway: "Treat data as a strategic asset requiring investment in governance, quality, and analytics capabilities."
      },
      {
        title: "Agile Operating Models",
        content: "Digital organizations operate differently. Implement agile methodologies, cross-functional teams, and rapid iteration cycles.",
        takeaway: "Adopt agile operating models that enable rapid experimentation and learning."
      },
      {
        title: "Customer Experience Redesign",
        content: "Digital transformation is ultimately about customer experience. Map customer journeys and eliminate friction points through technology.",
        takeaway: "Start with customer needs and work backward to design digital solutions."
      },
      {
        title: "Change Management at Scale",
        content: "Digital transformation affects everyone. Develop comprehensive change management strategies addressing skills, culture, and mindset shifts.",
        takeaway: "Invest heavily in change management - technology is easy, changing people is hard."
      },
      {
        title: "Measuring Digital Success",
        content: "Traditional metrics may not capture digital value. Develop new KPIs for digital initiatives including user engagement and platform effects.",
        takeaway: "Create new measurement frameworks that capture the full value of digital transformation."
      }
    ],
    quiz: [
      {
        question: "What should be the starting point for digital transformation?",
        options: ["Technology selection", "Customer needs assessment", "Cost reduction targets", "Competitor analysis"],
        correct: 1
      }
    ]
  },
  {
    id: 'crisis-leadership',
    title: 'Crisis Leadership Essentials',
    type: 'Executive Response',
    duration: 16,
    difficulty: 'Advanced',
    creator: 'Wharton Crisis Management',
    summary: 'Lead effectively through uncertainty, disruption, and organizational crisis',
    moods: ['focused', 'reflective'],
    topics: ['Leadership', 'Crisis Management'],
    sections: [
      {
        title: "Crisis Recognition Patterns",
        content: "Crises often follow predictable patterns. Learn to recognize early warning signals and distinguish between temporary setbacks and systemic threats.",
        takeaway: "Develop early warning systems and pattern recognition skills to identify crises before they escalate."
      },
      {
        title: "Rapid Decision-Making Frameworks",
        content: "Crisis demands fast decisions with incomplete information. Use structured frameworks like OODA loops to accelerate decision cycles.",
        takeaway: "Implement rapid decision-making processes that balance speed with quality under pressure."
      },
      {
        title: "Stakeholder Communication Strategy",
        content: "Crisis communication requires transparency, frequency, and consistency. Different stakeholders need different messages and channels.",
        takeaway: "Develop multi-stakeholder communication plans with clear, consistent messaging across all channels."
      },
      {
        title: "Team Psychology Under Pressure",
        content: "Stress affects team performance and decision-making. Understand psychological responses to crisis and maintain team effectiveness.",
        takeaway: "Monitor team psychological health and implement stress management techniques during crisis periods."
      },
      {
        title: "Resource Reallocation Speed",
        content: "Crises require rapid resource shifts. Develop capabilities to quickly reallocate people, capital, and attention to critical priorities.",
        takeaway: "Build organizational flexibility to rapidly redeploy resources when circumstances change."
      },
      {
        title: "Learning from Crisis",
        content: "Every crisis contains lessons for future resilience. Conduct thorough post-crisis analysis to strengthen organizational capabilities.",
        takeaway: "Systematically capture crisis lessons to build organizational resilience and preparedness."
      }
    ],
    quiz: [
      {
        question: "What is the most important element of crisis communication?",
        options: ["Speed", "Transparency and consistency", "Positive messaging", "Technical accuracy"],
        correct: 1
      }
    ]
  }
];

// Badge system
const badges = [
  { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', requirement: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day learning streak', icon: '💎', requirement: 30 },
  { id: 'topics_5', name: 'Curious Mind', description: 'Explored 5 different topics', icon: '🧠', requirement: 5 },
  { id: 'advanced_3', name: 'Expert Level', description: 'Completed 3 advanced lessons', icon: '🎯', requirement: 3 }
];

// User persistence and profile management
function loadUserProfile() {
  const saved = localStorage.getItem('commutr_profile');
  if (saved) {
    userProfile = JSON.parse(saved);
    updateWelcomeStats();
  } else {
    userProfile = {
      name: 'Quinn',
      streak: 47,
      topicsMastered: 12,
      lessonsCompleted: 156,
      badges: ['streak_7', 'streak_30', 'topics_5'],
      preferredDifficulty: 'Advanced',
      isPremium: true,
      totalMinutesLearned: 1240,
      reflections: [],
      lastSessionDate: null
    };
    saveUserProfile();
  }
}

function saveUserProfile() {
  localStorage.setItem('commutr_profile', JSON.stringify(userProfile));
}

function updateWelcomeStats() {
  if (userProfile) {
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = userProfile.streak;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = userProfile.topicsMastered;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = userProfile.lessonsCompleted;
  }
}

// Dynamic content recommendation engine
function getRecommendedLessons(commuteDuration, mood, topics, path = 'focus') {
  let availableLessons = lessonPool.filter(lesson => {
    const durationMatch = lesson.duration <= commuteDuration + 2;
    const moodMatch = lesson.moods.includes(mood);
    const topicMatch = path === 'explore' || lesson.topics.some(topic => topics.includes(topic));
    return durationMatch && (moodMatch || path === 'explore') && topicMatch;
  });

  if (userProfile.preferredDifficulty) {
    const preferredLessons = availableLessons.filter(l => l.difficulty === userProfile.preferredDifficulty);
    const otherLessons = availableLessons.filter(l => l.difficulty !== userProfile.preferredDifficulty);
    availableLessons = [...preferredLessons, ...otherLessons];
  }

  if (path === 'explore') {
    const surpriseLessons = lessonPool.filter(lesson => 
      lesson.duration <= commuteDuration + 2 && 
      !lesson.topics.some(topic => topics.includes(topic))
    );
    availableLessons = [...availableLessons, ...surpriseLessons.slice(0, 1)];
  }

  return shuffleArray(availableLessons).slice(0, 3);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate mood-based explanation
function getMoodExplanation(mood, path) {
  const explanations = {
    focused: `Because you chose <strong>Focused</strong>, we prioritized strategic leadership content with clear takeaways.`,
    curious: `Because you chose <strong>Curious</strong>, we included diverse topics and emerging trends to explore.`,
    energetic: `Because you chose <strong>Energetic</strong>, we selected dynamic content with actionable insights.`,
    reflective: `Because you chose <strong>Reflective</strong>, we prioritized leadership strategy and thoughtful analysis.`
  };
  
  const pathNote = path === 'explore' ? ' We also added surprise recommendations to broaden your perspective.' : '';
  
  return `<p class="mood-explanation-text">${explanations[mood] || explanations.focused}${pathNote}</p>`;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadUserProfile();
  simulateAIProcessing();
  
  setTimeout(() => {
    showScreen('welcome-screen');
  }, 2000);
});

// Screen navigation
function showScreen(screenId) {
  const currentScreenEl = document.querySelector('.screen.active');
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
  }
  
  setTimeout(() => {
    const newScreen = document.getElementById(screenId);
    newScreen.classList.add('active');
    currentScreen = screenId;
    
    // Handle screen-specific initialization
    if (screenId === 'content-screen') {
      const contentGrid = document.querySelector('.content-grid');
      if (contentGrid && contentGrid.children.length === 0) {
        generateContentRecommendations();
      }
    } else if (screenId === 'mood-screen') {
      // Set the correct difficulty button as active
      if (userProfile && userProfile.preferredDifficulty) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.level === userProfile.preferredDifficulty) {
            btn.classList.add('active');
          }
        });
      }
    }
  }, 150);
}

// Start commute flow
function startCommute() {
  showScreen('commute-screen');
}

// Commute selection
function selectCommute(duration, type) {
  document.querySelectorAll('.commute-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.commute-card').classList.add('selected');
  
  if (type === 'manual') {
    // Prompt for manual entry
    const manualDuration = prompt('Enter your commute length in minutes:', '25');
    if (manualDuration && !isNaN(manualDuration) && manualDuration > 0) {
      selectedCommute = { duration: parseInt(manualDuration), type: 'manual' };
      setTimeout(() => {
        showScreen('mood-screen');
      }, 800);
    } else {
      // Remove selection if cancelled or invalid
      event.target.closest('.commute-card').classList.remove('selected');
      return;
    }
  } else {
    selectedCommute = { duration, type };
    setTimeout(() => {
      showScreen('mood-screen');
    }, 800);
  }
}

// Mood selection
function selectMood(mood) {
  document.querySelectorAll('.mood-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.mood-card').classList.add('selected');
  selectedMood = mood;
  updateMoodContinueButton();
}

// Topic selection
function toggleTopic(topicElement) {
  topicElement.classList.toggle('selected');
  
  const topicText = topicElement.textContent;
  if (selectedTopics.includes(topicText)) {
    selectedTopics = selectedTopics.filter(topic => topic !== topicText);
  } else {
    selectedTopics.push(topicText);
  }
  
  updateMoodContinueButton();
}

// Update mood continue button state
function updateMoodContinueButton() {
  const continueBtn = document.getElementById('mood-continue-btn');
  if (selectedMood && selectedTopics.length > 0) {
    continueBtn.disabled = false;
  } else {
    continueBtn.disabled = true;
  }
}

// Path selection
function selectPath(path) {
  document.querySelectorAll('.path-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.path-card').classList.add('selected');
  selectedPath = path;
  
  setTimeout(() => {
    generateContentRecommendations();
    showScreen('content-screen');
  }, 800);
}

// Difficulty selection
function setDifficulty(level) {
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  userProfile.preferredDifficulty = level;
  saveUserProfile();
}

// Generate content recommendations
function generateContentRecommendations() {
  const contentGrid = document.querySelector('.content-grid');
  const loadingShimmer = document.getElementById('content-loading');
  
  // Show loading shimmer
  if (loadingShimmer) {
    loadingShimmer.style.display = 'block';
  }
  contentGrid.style.display = 'none';
  
  setTimeout(() => {
    // Use defaults if not set
    const commuteDuration = selectedCommute ? selectedCommute.duration : 15;
    const mood = selectedMood || 'focused';
    const topics = selectedTopics.length > 0 ? selectedTopics : ['AI & Leadership'];
    const path = selectedPath || 'focus';
    
    let recommendations = getRecommendedLessons(commuteDuration, mood, topics, path);
    
    // Ensure we always have content to show
    if (!recommendations || recommendations.length === 0) {
      // Fallback to first 3 lessons from the pool
      recommendations = lessonPool.slice(0, 3);
    }
    
    // Add mood personalization explanation
    const headerInfo = document.querySelector('.content-header-info');
    if (headerInfo) {
      const existingExplanation = headerInfo.querySelector('.mood-explanation');
      if (existingExplanation) {
        existingExplanation.remove();
      }
      
      const moodExplanation = document.createElement('div');
      moodExplanation.className = 'mood-explanation';
      moodExplanation.innerHTML = getMoodExplanation(mood, path);
      headerInfo.appendChild(moodExplanation);
    }
    
    contentGrid.innerHTML = '';
    
    recommendations.forEach((lesson, index) => {
      const card = createContentCard(lesson, index === 0);
      contentGrid.appendChild(card);
    });
    
    // Hide loading and show content
    if (loadingShimmer) {
      loadingShimmer.style.display = 'none';
    }
    contentGrid.style.display = 'flex';
    
    // Enable continue button
    const continueBtn = document.getElementById('content-continue-btn');
    if (continueBtn) {
      continueBtn.disabled = false;
    }
    
  }, 1500);
}

// Create content card
function createContentCard(lesson, isFeatured = false) {
  const card = document.createElement('div');
  card.className = `content-card ${isFeatured ? 'featured' : ''}`;
  card.onclick = () => selectContent(card, lesson);
  
  card.innerHTML = `
    <div class="content-header">
      <span class="content-type">${lesson.type}</span>
      <span class="duration">${lesson.duration} min</span>
      <span class="difficulty-chip ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
    </div>
    <h3>${lesson.title}</h3>
    <p>${lesson.summary}</p>
    <div class="content-meta">
      <span class="creator">by ${lesson.creator}</span>
    </div>
    ${isFeatured ? '<div class="recommended-badge">🎯 Perfect Match</div>' : ''}
  `;
  
  return card;
}

// Content selection
function selectContent(contentElement, lessonData) {
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  contentElement.classList.add('selected');
  selectedContent = lessonData;
  
  const continueBtn = document.getElementById('content-continue-btn');
  continueBtn.disabled = false;
}

// Start learning
function startLearning() {
  showScreen('learning-screen');
  initializeLearning();
}

// Initialize learning interface
function initializeLearning() {
  currentLessonSection = 0;
  updateLessonContent();
  startLessonTimer();
}

// Update lesson content
function updateLessonContent() {
  if (!selectedContent || !selectedContent.sections) return;
  
  const section = selectedContent.sections[currentLessonSection];
  
  document.getElementById('lesson-title').textContent = selectedContent.title;
  document.querySelector('#lesson-section h3').textContent = section.title;
  document.querySelector('#lesson-section p').textContent = section.content;
  document.querySelector('.insight-highlight').innerHTML = `💡 <strong>Takeaway:</strong> ${section.takeaway}`;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  prevBtn.disabled = currentLessonSection === 0;
  nextBtn.textContent = currentLessonSection === selectedContent.sections.length - 1 ? 'Complete' : 'Continue';
  
  const progress = ((currentLessonSection + 1) / selectedContent.sections.length) * 100;
  document.getElementById('lesson-progress-fill').style.width = progress + '%';
}

// Lesson navigation
function nextSection() {
  if (currentLessonSection < selectedContent.sections.length - 1) {
    currentLessonSection++;
    updateLessonContent();
  } else {
    if (lessonTimer) {
      clearInterval(lessonTimer);
    }
    startQuiz();
  }
}

function previousSection() {
  if (currentLessonSection > 0) {
    currentLessonSection--;
    updateLessonContent();
  }
}

// Lesson timer
function startLessonTimer() {
  const commuteMinutes = selectedCommute ? selectedCommute.duration : selectedContent.duration;
  let timeRemaining = selectedContent.duration * 60; // Actual lesson time
  
  // Initially show commute match, not remaining time
  const timeDisplay = document.getElementById('time-remaining');
  timeDisplay.textContent = `Matched to your ${commuteMinutes}-minute commute`;
  
  // Start the actual timer after a brief delay
  setTimeout(() => {
    lessonTimer = setInterval(() => {
      if (!isPaused) {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        
        if (timeRemaining <= 0) {
          clearInterval(lessonTimer);
          startQuiz();
        }
      }
    }, 1000);
  }, 2000); // Show commute match for 2 seconds before starting countdown
}

// Pause/resume functionality
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
}

// Minimize learning
function minimizeLearning() {
  showToast('Minimize feature would allow background learning while using other apps.');
}

// Quiz functionality
function startQuiz() {
  if (!selectedContent || !selectedContent.quiz) {
    showScreen('reflection-screen');
    return;
  }
  
  currentQuizQuestion = 0;
  quizScore = 0;
  showScreen('quiz-screen');
  loadQuizQuestion();
}

function loadQuizQuestion() {
  const quiz = selectedContent.quiz;
  const question = quiz[currentQuizQuestion];
  
  document.getElementById('quiz-question-text').textContent = question.question;
  document.getElementById('quiz-question-number').textContent = currentQuizQuestion + 1;
  document.getElementById('quiz-total-questions').textContent = quiz.length;
  
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'quiz-option';
    optionElement.textContent = option;
    optionElement.onclick = () => selectQuizOption(optionElement, index, question.correct);
    optionsContainer.appendChild(optionElement);
  });
  
  document.getElementById('quiz-next-btn').disabled = true;
  document.getElementById('quiz-feedback').style.display = 'none';
}

function selectQuizOption(optionElement, selectedIndex, correctIndex) {
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.classList.remove('selected', 'correct', 'incorrect');
  });
  
  optionElement.classList.add('selected');
  
  const isCorrect = selectedIndex === correctIndex;
  if (isCorrect) {
    optionElement.classList.add('correct');
    quizScore++;
  } else {
    optionElement.classList.add('incorrect');
    document.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
  }
  
  const feedback = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  
  feedbackIcon.textContent = isCorrect ? '✅' : '❌';
  feedbackText.textContent = isCorrect ? 'Correct! Great job.' : 'Not quite right. The correct answer is highlighted.';
  feedback.style.display = 'block';
  
  document.getElementById('quiz-next-btn').disabled = false;
}

function nextQuizQuestion() {
  currentQuizQuestion++;
  if (currentQuizQuestion < selectedContent.quiz.length) {
    loadQuizQuestion();
  } else {
    showScreen('reflection-screen');
  }
}

function skipQuiz() {
  showScreen('reflection-screen');
}

// Reflection functionality
function saveReflection() {
  const reflectionText = document.getElementById('reflection-text').value;
  if (reflectionText.trim()) {
    userProfile.reflections = userProfile.reflections || [];
    userProfile.reflections.push({
      lesson: selectedContent.title,
      reflection: reflectionText,
      date: new Date().toISOString()
    });
    saveUserProfile();
  }
  completeLearning();
}

function skipReflection() {
  completeLearning();
}

// Enhanced completion
function completeLearning() {
  // Calculate actual session time based on commute duration
  const sessionMinutes = selectedCommute ? selectedCommute.duration : selectedContent.duration;
  
  userProfile.lessonsCompleted++;
  userProfile.totalMinutesLearned += sessionMinutes;
  
  // Only increment streak once per day (check if last session was today)
  const today = new Date().toDateString();
  const lastSessionDate = userProfile.lastSessionDate;
  
  if (lastSessionDate !== today) {
    userProfile.streak++;
    userProfile.lastSessionDate = today;
  }
  
  const newBadges = checkForNewBadges();
  updateCompletionScreen(newBadges, sessionMinutes);
  
  saveUserProfile();
  showScreen('completion-screen');
}

function checkForNewBadges() {
  const newBadges = [];
  badges.forEach(badge => {
    if (!userProfile.badges.includes(badge.id)) {
      let earned = false;
      
      switch(badge.id) {
        case 'streak_7':
          earned = userProfile.streak >= 7;
          break;
        case 'streak_30':
          earned = userProfile.streak >= 30;
          break;
        case 'topics_5':
          earned = userProfile.topicsMastered >= 5;
          break;
        case 'advanced_3':
          earned = userProfile.lessonsCompleted >= 3;
          break;
      }
      
      if (earned) {
        userProfile.badges.push(badge.id);
        newBadges.push(badge);
      }
    }
  });
  
  return newBadges;
}

function updateCompletionScreen(newBadges, sessionMinutes) {
  // Use actual session time, not just lesson duration
  const minutesLearned = sessionMinutes || selectedContent.duration;
  
  document.getElementById('completion-minutes').textContent = minutesLearned;
  document.getElementById('completion-insights').textContent = selectedContent.sections.length;
  document.getElementById('completion-streak').textContent = userProfile.streak;
  
  if (userProfile.isPremium) {
    document.getElementById('total-time').textContent = (userProfile.totalMinutesLearned / 60).toFixed(1);
    document.getElementById('skills-advanced').textContent = userProfile.topicsMastered;
  }
  
  if (newBadges.length > 0) {
    const badgeEarned = document.getElementById('badge-earned');
    badgeEarned.style.display = 'block';
    badgeEarned.querySelector('.badge-icon').textContent = newBadges[0].icon;
    badgeEarned.querySelector('.badge-text').textContent = `${newBadges[0].name} Earned!`;
  }
  
  const takeawaysList = document.getElementById('takeaways-list');
  takeawaysList.innerHTML = '';
  selectedContent.sections.forEach(section => {
    const li = document.createElement('li');
    li.textContent = section.takeaway;
    takeawaysList.appendChild(li);
  });
}

// Enhanced sharing - LinkedIn-style
function shareInsights() {
  const sessionMinutes = selectedCommute ? selectedCommute.duration : selectedContent.duration;
  const topicArea = selectedContent.topics ? selectedContent.topics[0] : 'leadership';
  
  const shareText = `Day ${userProfile.streak} on Commutr — learned ${topicArea.toLowerCase()} strategies during my ${sessionMinutes}-minute commute. 

Key insight: ${selectedContent.sections[0].takeaway}

#microlearning #commute #executivelearning`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Commutr Learning Insights',
      text: shareText
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('LinkedIn post copied to clipboard!');
    });
  }
}

// Plan next commute with pre-setting
function planNextCommute() {
  // Save current preferences for next session
  const nextCommutePlan = {
    duration: selectedCommute ? selectedCommute.duration : 15,
    mood: selectedMood || 'focused',
    difficulty: userProfile.preferredDifficulty
  };
  
  userProfile.nextCommutePlan = nextCommutePlan;
  saveUserProfile();
  
  // Reset current session
  selectedCommute = null;
  selectedMood = null;
  selectedTopics = [];
  selectedContent = null;
  selectedPath = null;
  currentLessonSection = 0;
  
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  document.getElementById('mood-continue-btn').disabled = true;
  document.getElementById('content-continue-btn').disabled = true;
  
  showToast('Next commute preferences saved!');
  showScreen('welcome-screen');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}


// Simulate realistic loading states
function simulateAIProcessing() {
  const messages = [
    "Analyzing your preferences...",
    "Curating personalized content...",
    "Optimizing for your commute duration...",
    "Preparing your learning journey..."
  ];
  
  let messageIndex = 0;
  const loadingText = document.querySelector('.loading-container p');
  
  const messageInterval = setInterval(() => {
    if (messageIndex < messages.length) {
      loadingText.textContent = messages[messageIndex];
      messageIndex++;
    } else {
      clearInterval(messageInterval);
    }
  }, 500);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
          const topicCloud = document.querySelector('.topic-cloud');
          const newTopic = document.createElement('span');
          newTopic.className = 'topic-tag selected';
          newTopic.textContent = searchTerm;
          newTopic.onclick = () => toggleTopic(newTopic);
          topicCloud.appendChild(newTopic);
          
          selectedTopics.push(searchTerm);
          updateMoodContinueButton();
          
          e.target.value = '';
        }
      }
    });
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (currentScreen === 'learning-screen') {
    switch(e.key) {
      case 'ArrowLeft':
        if (!document.getElementById('prev-btn').disabled) {
          previousSection();
        }
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSection();
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
    }
  }
});

// Add click feedback to interactive elements
document.addEventListener('click', function(e) {
  if (e.target.matches('button, .card, .btn-primary, .btn-secondary')) {
    e.target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 150);
  }
});
