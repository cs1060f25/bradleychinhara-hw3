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
let quizAnswers = [];

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
        title: "Strategic Implementation",
        content: "Successful AI transformation requires a phased approach. Start with pilot programs in non-critical areas to build confidence and learn before scaling to core business functions.",
        takeaway: "Begin with low-risk, high-impact AI implementations to demonstrate value and build organizational buy-in."
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
        title: "Regulatory Landscape Shifts",
        content: "New regulations around crypto and open banking create both challenges and opportunities. Compliance-first companies are gaining competitive advantages.",
        takeaway: "Early regulatory compliance investment pays dividends in market access and customer trust."
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
        title: "Reading Micro-Signals",
        content: "Successful negotiators read verbal and non-verbal cues to understand true positions. Watch for hesitation patterns and body language shifts.",
        takeaway: "Pause after key statements to observe reactions and gather intelligence on counterpart priorities."
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
    id: 'blockchain-basics',
    title: 'Blockchain for Finance Leaders',
    type: 'Tech Primer',
    duration: 10,
    difficulty: 'Beginner',
    creator: 'MIT Sloan',
    summary: 'Essential blockchain concepts every finance executive should know',
    moods: ['curious', 'reflective'],
    topics: ['Blockchain', 'Fintech Trends'],
    sections: [
      {
        title: "Beyond Cryptocurrency",
        content: "Blockchain's real value lies in immutable record-keeping and smart contracts. JPMorgan processes $6B daily through blockchain networks.",
        takeaway: "Focus on blockchain's efficiency gains in clearing, settlement, and compliance rather than speculative assets."
      }
    ],
    quiz: [
      {
        question: "What's blockchain's primary business value?",
        options: ["Cryptocurrency trading", "Immutable records and smart contracts", "Social media", "Gaming"],
        correct: 1
      }
    ]
  },
  {
    id: 'team-psychology',
    title: 'Remote Team Dynamics',
    type: 'Leadership',
    duration: 7,
    difficulty: 'Intermediate',
    creator: 'Stanford GSB',
    summary: 'Building high-performance distributed teams in finance',
    moods: ['reflective', 'focused'],
    topics: ['Team Management', 'Executive Skills'],
    sections: [
      {
        title: "Trust at Distance",
        content: "Remote teams require explicit trust-building mechanisms. Weekly one-on-ones and transparent goal-setting increase team performance by 40%.",
        takeaway: "Over-communicate expectations and create structured touchpoints to maintain team cohesion."
      }
    ],
    quiz: [
      {
        question: "How much can structured remote management improve performance?",
        options: ["20%", "30%", "40%", "50%"],
        correct: 2
      }
    ]
  },
  {
    id: 'market-volatility',
    title: 'Leading Through Market Uncertainty',
    type: 'Crisis Management',
    duration: 9,
    difficulty: 'Advanced',
    creator: 'Wharton Executive Education',
    summary: 'Decision-making frameworks for volatile market conditions',
    moods: ['focused', 'reflective'],
    topics: ['Market Analysis', 'Executive Skills'],
    sections: [
      {
        title: "Scenario Planning Excellence",
        content: "Top-performing firms use 3-scenario planning: optimistic, realistic, pessimistic. This approach reduces decision paralysis by 60% during crises.",
        takeaway: "Prepare multiple contingency plans and communicate decision triggers clearly to your team."
      }
    ],
    quiz: [
      {
        question: "How many scenarios should leaders prepare?",
        options: ["2", "3", "4", "5"],
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
  { id: 'advanced_3', name: 'Expert Level', description: 'Completed 3 advanced lessons', icon: '🎯', requirement: 3 },
  { id: 'quiz_perfect', name: 'Perfect Score', description: 'Aced 5 quizzes in a row', icon: '⭐', requirement: 5 }
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
      quizHistory: [],
      preferredDifficulty: 'Advanced',
      isPremium: true,
      totalMinutesLearned: 1240,
      lastCommute: null,
      nextCommutePlan: null
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
    // Filter by commute duration (allow some flexibility)
    const durationMatch = lesson.duration <= commuteDuration + 2;
    
    // Filter by mood
    const moodMatch = lesson.moods.includes(mood);
    
    // Filter by topics (if focusing)
    const topicMatch = path === 'explore' || 
      lesson.topics.some(topic => topics.includes(topic));
    
    return durationMatch && (moodMatch || path === 'explore') && topicMatch;
  });

  // Add difficulty preference filtering
  if (userProfile.preferredDifficulty) {
    const preferredLessons = availableLessons.filter(l => l.difficulty === userProfile.preferredDifficulty);
    const otherLessons = availableLessons.filter(l => l.difficulty !== userProfile.preferredDifficulty);
    availableLessons = [...preferredLessons, ...otherLessons];
  }

  // Add surprise element for explore mode
  if (path === 'explore') {
    const surpriseLessons = lessonPool.filter(lesson => 
      lesson.duration <= commuteDuration + 2 && 
      !lesson.topics.some(topic => topics.includes(topic))
    );
    availableLessons = [...availableLessons, ...surpriseLessons.slice(0, 1)];
  }

  // Shuffle and return top 3
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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadUserProfile();
  
  // Simulate loading with dynamic messages
  simulateAIProcessing();
  
  setTimeout(() => {
    showScreen('welcome-screen');
  }, 2000);
});

// Screen navigation
function showScreen(screenId) {
  // Hide current screen
  const currentScreenEl = document.querySelector('.screen.active');
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
  }
  
  // Show new screen
  setTimeout(() => {
    const newScreen = document.getElementById(screenId);
    newScreen.classList.add('active');
    currentScreen = screenId;
  }, 150);
}

// Start commute flow
function startCommute() {
  showScreen('commute-screen');
}

// Commute selection
function selectCommute(duration, type) {
  // Remove previous selections
  document.querySelectorAll('.commute-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
  event.target.closest('.commute-card').classList.add('selected');
  
  selectedCommute = { duration, type };
  
  // Auto-advance after selection
  setTimeout(() => {
    showScreen('mood-screen');
  }, 800);
}

// Mood selection
function selectMood(mood) {
  // Remove previous selections
  document.querySelectorAll('.mood-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
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

// Content selection
function selectContent(contentElement) {
  // Remove previous selections
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current card
  contentElement.classList.add('selected');
  
  selectedContent = {
    title: contentElement.querySelector('h3').textContent,
    type: contentElement.querySelector('.content-type').textContent,
    duration: contentElement.querySelector('.duration').textContent
  };
  
  // Enable continue button
  document.getElementById('content-continue-btn').disabled = false;
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
  const section = lessonSections[currentLessonSection];
  
  document.getElementById('lesson-title').textContent = selectedContent.title;
  document.querySelector('#lesson-section h3').textContent = section.title;
  document.querySelector('#lesson-section p').textContent = section.content;
  document.querySelector('.insight-highlight').innerHTML = `💡 <strong>Takeaway:</strong> ${section.takeaway}`;
  
  // Update navigation buttons
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  prevBtn.disabled = currentLessonSection === 0;
  nextBtn.textContent = currentLessonSection === lessonSections.length - 1 ? 'Complete' : 'Continue';
  
  // Update progress
  const progress = ((currentLessonSection + 1) / lessonSections.length) * 100;
  document.getElementById('lesson-progress-fill').style.width = progress + '%';
}

// Lesson navigation
function nextSection() {
  if (currentLessonSection < lessonSections.length - 1) {
    currentLessonSection++;
    updateLessonContent();
  } else {
    // Complete lesson
    completeLearning();
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
  let timeRemaining = 8 * 60; // 8 minutes in seconds
  
  lessonTimer = setInterval(() => {
    if (!isPaused) {
      timeRemaining--;
      
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      document.getElementById('time-remaining').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
      
      if (timeRemaining <= 0) {
        clearInterval(lessonTimer);
        completeLearning();
      }
    }
  }, 1000);
}

// Pause/resume functionality
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
}

// Minimize learning (placeholder)
function minimizeLearning() {
  alert('Minimize feature would allow background learning while using other apps.');
}

// Complete learning
function completeLearning() {
  if (lessonTimer) {
    clearInterval(lessonTimer);
  }
  showScreen('completion-screen');
}

// Completion actions
function shareInsights() {
  // Simulate sharing functionality
  const insights = lessonSections.map(section => `• ${section.takeaway}`).join('\n');
  const shareText = `Just completed a micro-learning session on "${selectedContent.title}" with @Commutr!\n\nKey takeaways:\n${insights}\n\n#MicroLearning #ProfessionalDevelopment`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Commutr Learning Insights',
      text: shareText
    });
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Insights copied to clipboard! Share them on your favorite platform.');
    });
  }
}

function planNextCommute() {
  // Reset state for next session
  selectedCommute = null;
  selectedMood = null;
  selectedTopics = [];
  selectedContent = null;
  currentLessonSection = 0;
  
  // Clear selections
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Reset buttons
  document.getElementById('mood-continue-btn').disabled = true;
  document.getElementById('content-continue-btn').disabled = true;
  
  showScreen('welcome-screen');
}

// Search functionality (placeholder)
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
          // Simulate adding custom topic
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

// Add some interactive feedback
document.addEventListener('DOMContentLoaded', function() {
  // Add click feedback to all interactive elements
  document.addEventListener('click', function(e) {
    if (e.target.matches('button, .card, .btn-primary, .btn-secondary')) {
      e.target.style.transform = 'scale(0.98)';
      setTimeout(() => {
        e.target.style.transform = '';
      }, 150);
    }
  });
  
  // Initialize loading simulation
  simulateAIProcessing();
});

// Performance optimization - preload next screen content
function preloadScreen(screenId) {
  const screen = document.getElementById(screenId);
  if (screen && !screen.dataset.loaded) {
    // Mark as loaded to avoid duplicate processing
    screen.dataset.loaded = 'true';
  }
}

// Add smooth transitions and micro-interactions
document.addEventListener('DOMContentLoaded', function() {
  // Preload critical screens
  setTimeout(() => {
    preloadScreen('welcome-screen');
    preloadScreen('commute-screen');
  }, 1000);
});
