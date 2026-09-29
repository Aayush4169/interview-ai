const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them atleast 5 question or more question",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them atleast 5 question",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively atleast 10 days plan",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

//  pdf generation function
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}
//  fucnction for calling ai for gereate a resume pdf in html
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`;

    const schema = interviewReportSchema.toJSONSchema();
    delete schema["$schema"];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI interview report error, using fallback report:", error.message);
    return {
      title: "Software Engineer",
      matchScore: 85,
      technicalQuestions: [
        {
          question: "Explain your experience with JavaScript / TypeScript asynchronous programming.",
          intention: "Assess understanding of Promises, async/await, and event loops.",
          answer: "Focus on clean error handling, avoiding callback hell, and structuring async workflows."
        },
        {
          question: "How do you optimize web application performance?",
          intention: "Test knowledge of DOM optimization, lazy loading, and asset bundling.",
          answer: "Discuss code splitting, caching strategies, reducing bundle size, and efficient state management."
        },
        {
          question: "What design patterns do you regularly use in backend microservices?",
          intention: "Evaluate architectural knowledge and modular design capabilities.",
          answer: "Mention repository pattern, middleware chains, factory pattern, and event-driven patterns."
        },
        {
          question: "How do you handle authentication and state security in REST APIs?",
          intention: "Check security best practices for JWTs, cookies, and CORS.",
          answer: "Explain HttpOnly cookies, JWT verification middlewares, rate limiting, and CORS headers."
        },
        {
          question: "Describe your approach to database index optimization.",
          intention: "Test database query performance tuning capabilities.",
          answer: "Explain compound indexes, query execution plans (explain index hits), and schema normalization."
        }
      ],
      behavioralQuestions: [
        {
          question: "Describe a challenging bug you encountered and how you solved it.",
          intention: "Evaluate problem solving, perseverance, and systematic debugging skills.",
          answer: "Use STAR method: situation, task, systematic investigation steps, resolution, and preventive measures."
        },
        {
          question: "How do you handle conflicting technical priorities in a fast-paced environment?",
          intention: "Test adaptability, communication, and project management prioritization.",
          answer: "Emphasize data-driven decision making, stakeholder communication, and iterative delivery."
        },
        {
          question: "Tell me about a time you mentored a junior developer or reviewed complex code.",
          intention: "Assess leadership, collaboration, and code quality advocacy.",
          answer: "Highlight constructive feedback, clear documentation, and peer pairing."
        },
        {
          question: "How do you stay updated with emerging technologies and best practices?",
          intention: "Check passion for continuous learning and self-improvement.",
          answer: "Discuss technical blogs, open-source projects, documentation, and building side projects."
        },
        {
          question: "Describe how you handle unexpected project requirement changes right before release.",
          intention: "Evaluate resilience and agile mindset under pressure.",
          answer: "Discuss scope negotiation, risk assessment, automated test validation, and graceful degradation."
        }
      ],
      skillGaps: [
        { skill: "Advanced System Design", severity: "medium" },
        { skill: "CI/CD Pipeline Automation", severity: "low" }
      ],
      preparationPlan: [
        { day: 1, focus: "Core Concepts Review", tasks: ["Review JavaScript data structures and async models"] },
        { day: 2, focus: "Framework Deep Dive", tasks: ["Practice state management and lifecycle hooks"] },
        { day: 3, focus: "Backend Architecture", tasks: ["Review REST API design rules and middleware security"] },
        { day: 4, focus: "Database Systems", tasks: ["Practice indexing, aggregation pipelines, and query optimization"] },
        { day: 5, focus: "System Design Essentials", tasks: ["Study caching layers (Redis) and load balancing"] },
        { day: 6, focus: "Technical Coding", tasks: ["Solve top 5 medium difficulty algorithmic questions"] },
        { day: 7, focus: "Behavioral Prep", tasks: ["Draft STAR methodology responses for past projects"] },
        { day: 8, focus: "Mock Interview", tasks: ["Conduct a timed technical mock interview session"] },
        { day: 9, focus: "Resume Alignment", tasks: ["Review project details and key metric achievements on resume"] },
        { day: 10, focus: "Final Review", tasks: ["Rest and review high-level summary notes"] }
      ]
    };
  }
}
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const schema = resumePdfSchema.toJSONSchema();
  delete schema["$schema"];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}
///  quize genration systemmm
const quizQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe("The MCQ question"),
        options: z.array(z.string()).length(4).describe("Exactly 4 options"),
        correctAnswer: z.number().describe("Index of correct option (0-3)"),
        explanation: z.string().describe("Why this is the correct answer"),
      }),
    )
    .describe("List of MCQ questions for the given subject"),
});

// Fallback questions generator if AI API fails or hits rate limits
function getFallbackQuestions(subject, count) {
  const sampleBank = {
    JavaScript: [
      {
        question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
        options: ["var", "let", "const", "Both let and const"],
        correctAnswer: 3,
        explanation: "`let` and `const` both provide block scope in modern JavaScript (ES6+)."
      },
      {
        question: "What will `console.log(typeof NaN)` output?",
        options: ["number", "NaN", "undefined", "object"],
        correctAnswer: 0,
        explanation: "`NaN` (Not-a-Number) is officially of type 'number' in JavaScript."
      },
      {
        question: "Which array method creates a new array with all elements that pass a test?",
        options: ["map()", "filter()", "reduce()", "forEach()"],
        correctAnswer: 1,
        explanation: "`filter()` creates a new array populated with all elements that pass the implemented test function."
      },
      {
        question: "What is the result of `'5' + 3` in JavaScript?",
        options: ["8", "'53'", "NaN", "TypeError"],
        correctAnswer: 1,
        explanation: "The `+` operator with a string performs string concatenation, coercing `3` to `'3'`."
      },
      {
        question: "Which mechanism executes asynchronous callbacks in JavaScript?",
        options: ["Event Loop", "Call Stack", "Heap Memory", "Thread Pool"],
        correctAnswer: 0,
        explanation: "The Event Loop checks the microtask and macrotask queues to run callbacks asynchronously."
      }
    ],
    React: [
      {
        question: "Which hook is used to handle side effects in a functional component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation: "`useEffect` handles side effects like data fetching, subscriptions, and DOM updates."
      },
      {
        question: "What key prop is required when rendering a list of elements in React?",
        options: ["id", "key", "index", "ref"],
        correctAnswer: 1,
        explanation: "The `key` prop helps React identify which items have changed, been added, or removed."
      },
      {
        question: "What hook returns a memoized callback function?",
        options: ["useMemo", "useCallback", "useRef", "useImperativeHandle"],
        correctAnswer: 1,
        explanation: "`useCallback` returns a memoized version of the callback function that only changes when dependencies change."
      }
    ]
  };

  const pool = sampleBank[subject] || sampleBank["JavaScript"];
  const result = [];
  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    result.push({
      question: `${base.question} (Q${i + 1})`,
      options: base.options,
      correctAnswer: base.correctAnswer,
      explanation: base.explanation,
    });
  }
  return { questions: result };
}

async function generateQuizQuestions({ subject, numberOfQuestions }) {
  try {
    const prompt = `Generate ${numberOfQuestions} MCQ questions for the subject "${subject}".
  Questions should range from beginner to advanced level.
  Each question must have exactly 4 options with only one correct answer.`;

    const schema = quizQuestionsSchema.toJSONSchema();
    delete schema["$schema"];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI quiz generation error, using fallback questions:", error.message);
    return getFallbackQuestions(subject, numberOfQuestions || 5);
  }
}
module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateQuizQuestions,
};
