// Mock data for Arthur API examples

export const mockTasks = [
  {
    id: "task_01HXYZ1234567890ABCDEF",
    name: "Customer Support Agent",
    description: "AI agent for handling customer inquiries and support tickets",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
    rules: [
      {
        id: "rule_01HXYZ1234567890ABCDEF",
        name: "Professional Tone",
        type: "sentiment_analysis",
        enabled: true,
        config: {
          min_sentiment_score: 0.3,
          required_tone: "professional"
        }
      },
      {
        id: "rule_02HXYZ1234567890ABCDEF",
        name: "Response Length",
        type: "content_analysis",
        enabled: true,
        config: {
          min_length: 50,
          max_length: 500
        }
      },
      {
        id: "rule_03HXYZ1234567890ABCDEF",
        name: "No Personal Info",
        type: "pii_detection",
        enabled: true,
        config: {
          block_patterns: ["email", "phone", "ssn"]
        }
      }
    ]
  },
  {
    id: "task_02HXYZ1234567890ABCDEF",
    name: "Financial Advisor",
    description: "AI agent providing financial advice and investment recommendations",
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-18T16:20:00Z",
    rules: [
      {
        id: "rule_04HXYZ1234567890ABCDEF",
        name: "Risk Disclosure",
        type: "content_validation",
        enabled: true,
        config: {
          required_phrases: ["investment risk", "past performance", "consult professional"]
        }
      },
      {
        id: "rule_05HXYZ1234567890ABCDEF",
        name: "Accuracy Check",
        type: "fact_checking",
        enabled: true,
        config: {
          sources_required: true,
          confidence_threshold: 0.8
        }
      }
    ]
  }
];

export const mockValidationResults = {
  success: [
    {
      rule_name: "Professional Tone",
      rule_type: "sentiment_analysis",
      passed: true,
      score: 0.85,
      details: "Response maintains professional tone with positive sentiment"
    },
    {
      rule_name: "Response Length",
      rule_type: "content_analysis",
      passed: true,
      score: 1.0,
      details: "Response length (245 chars) within acceptable range"
    },
    {
      rule_name: "No Personal Info",
      rule_type: "pii_detection",
      passed: true,
      score: 1.0,
      details: "No personal identifiable information detected"
    }
  ],
  failure: [
    {
      rule_name: "Professional Tone",
      rule_type: "sentiment_analysis",
      passed: false,
      score: 0.15,
      details: "Response contains informal language and negative sentiment"
    },
    {
      rule_name: "Response Length",
      rule_type: "content_analysis",
      passed: false,
      score: 0.3,
      details: "Response too short (12 chars) - minimum 50 required"
    },
    {
      rule_name: "Risk Disclosure",
      rule_type: "content_validation",
      passed: false,
      score: 0.0,
      details: "Missing required risk disclosure phrases"
    }
  ]
};

export const mockTokenUsage = {
  prompt_tokens: 1250,
  completion_tokens: 890,
  total_tokens: 2140,
  cost_usd: 0.0428,
  model: "gpt-4",
  timestamp: "2024-01-20T15:30:00Z"
};

export const mockInferences = [
  {
    id: "inf_01HXYZ1234567890ABCDEF",
    task_id: "task_01HXYZ1234567890ABCDEF",
    task_name: "Customer Support Agent",
    prompt: "A customer is complaining about a delayed order. How should I respond?",
    response: "I understand your frustration with the delayed order. Let me help you track this down. Could you please provide your order number so I can look into the current status and provide you with an updated delivery timeline?",
    validation_results: [
      {
        rule_name: "Professional Tone",
        rule_type: "sentiment_analysis",
        passed: true,
        score: 0.85
      },
      {
        rule_name: "Response Length",
        rule_type: "content_analysis",
        passed: true,
        score: 1.0
      },
      {
        rule_name: "No Personal Info",
        rule_type: "pii_detection",
        passed: true,
        score: 1.0
      }
    ],
    created_at: "2024-01-20T15:30:00Z",
    latency_ms: 0
  },
  {
    id: "inf_02HXYZ1234567890ABCDEF",
    task_id: "task_02HXYZ1234567890ABCDEF",
    task_name: "Financial Advisor",
    prompt: "What should I invest in for retirement?",
    response: "You should invest in index funds. They're the best option for everyone.",
    validation_results: [
      {
        rule_name: "Risk Disclosure",
        rule_type: "content_validation",
        passed: false,
        score: 0.0
      },
      {
        rule_name: "Accuracy Check",
        rule_type: "fact_checking",
        passed: false,
        score: 0.3
      }
    ],
    created_at: "2024-01-20T14:45:00Z",
    latency_ms: 5
  },
  {
    id: "inf_03HXYZ1234567890ABCDEF",
    task_id: "task_01HXYZ1234567890ABCDEF",
    task_name: "Customer Support Agent",
    prompt: "How do I reset my password?",
    response: "To reset your password, go to the login page and click 'Forgot Password'. You'll receive an email with a reset link. Make sure to use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
    validation_results: [
      {
        rule_name: "Professional Tone",
        rule_type: "sentiment_analysis",
        passed: true,
        score: 0.92
      },
      {
        rule_name: "Response Length",
        rule_type: "content_analysis",
        passed: true,
        score: 1.0
      },
      {
        rule_name: "No Personal Info",
        rule_type: "pii_detection",
        passed: true,
        score: 1.0
      }
    ],
    created_at: "2024-01-20T13:20:00Z",
    latency_ms: 0
  },
  {
    id: "inf_04HXYZ1234567890ABCDEF",
    task_id: "task_02HXYZ1234567890ABCDEF",
    task_name: "Financial Advisor",
    prompt: "Is it safe to invest in cryptocurrency?",
    response: "Cryptocurrency investments carry significant risk and are highly volatile. Past performance does not guarantee future results. The value can go down as well as up, and you may lose some or all of your investment. I strongly recommend consulting with a qualified financial advisor before making any investment decisions, especially regarding cryptocurrency.",
    validation_results: [
      {
        rule_name: "Risk Disclosure",
        rule_type: "content_validation",
        passed: true,
        score: 1.0
      },
      {
        rule_name: "Accuracy Check",
        rule_type: "fact_checking",
        passed: true,
        score: 0.95
      }
    ],
    created_at: "2024-01-20T12:15:00Z",
    latency_ms: 0
  }
]; 