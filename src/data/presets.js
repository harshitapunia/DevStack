// ╔═══════════════════════════════════════════════════════════════╗
// ║  Preset Roadmap Templates                                   ║
// ║  Each template has nodes with descriptions, links,          ║
// ║  and properly connected prerequisite edges.                 ║
// ╚═══════════════════════════════════════════════════════════════╝

const node = (id, title, description, x, y, links = []) => ({
  id,
  type: 'skillNode',
  position: { x, y },
  data: {
    title,
    label: title,
    description,
    links,
    status: 'pending',
    unlocked: false,
  },
})

const edge = (source, target) => ({
  id: `e_${source}_${target}`,
  source,
  target,
  animated: true,
  style: { stroke: '#4f46e5', strokeWidth: 2 },
})

// ─── Web Development Roadmap ────────────────────────────────────
const webDevNodes = [
  node('web_1', 'HTML Fundamentals', 'Learn semantic HTML5, forms, tables, media elements, and accessibility basics.', 400, 0, [
    { label: 'MDN HTML', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    { label: 'W3Schools HTML', url: 'https://www.w3schools.com/html/' },
  ]),
  node('web_2', 'CSS Mastery', 'Flexbox, Grid, animations, responsive design, CSS variables, and modern layout techniques.', 150, 180, [
    { label: 'CSS-Tricks Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
    { label: 'Grid Garden', url: 'https://cssgridgarden.com/' },
  ]),
  node('web_3', 'JavaScript Core', 'ES6+, closures, promises, async/await, DOM manipulation, event handling.', 650, 180, [
    { label: 'JavaScript.info', url: 'https://javascript.info/' },
    { label: 'Eloquent JS', url: 'https://eloquentjavascript.net/' },
  ]),
  node('web_4', 'Tailwind CSS', 'Utility-first CSS framework for rapid UI development.', 0, 360, [
    { label: 'Tailwind Docs', url: 'https://tailwindcss.com/docs' },
  ]),
  node('web_5', 'TypeScript', 'Static typing for JavaScript — interfaces, generics, type guards.', 300, 360, [
    { label: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/' },
  ]),
  node('web_6', 'React', 'Components, hooks, state management, JSX, virtual DOM.', 550, 360, [
    { label: 'React Docs', url: 'https://react.dev/' },
    { label: 'React Tutorial', url: 'https://react.dev/learn' },
  ]),
  node('web_7', 'Node.js & Express', 'Server-side JavaScript, REST APIs, middleware, routing.', 850, 360, [
    { label: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
    { label: 'Express Guide', url: 'https://expressjs.com/en/guide/routing.html' },
  ]),
  node('web_8', 'Next.js', 'Production React framework — SSR, SSG, API routes, file-based routing.', 300, 540, [
    { label: 'Next.js Docs', url: 'https://nextjs.org/docs' },
  ]),
  node('web_9', 'Databases', 'PostgreSQL, MongoDB, ORMs (Prisma/Drizzle), query optimization.', 650, 540, [
    { label: 'Prisma Docs', url: 'https://www.prisma.io/docs' },
    { label: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' },
  ]),
  node('web_10', 'Authentication', 'JWT, OAuth, session management, Supabase Auth, NextAuth.', 150, 720, [
    { label: 'Supabase Auth', url: 'https://supabase.com/docs/guides/auth' },
  ]),
  node('web_11', 'Deployment', 'Vercel, Docker, CI/CD, environment variables, domain setup.', 500, 720, [
    { label: 'Vercel Docs', url: 'https://vercel.com/docs' },
  ]),
  node('web_12', 'Testing', 'Unit testing (Vitest), integration, E2E (Playwright), TDD methodology.', 850, 720, [
    { label: 'Vitest', url: 'https://vitest.dev/' },
    { label: 'Playwright', url: 'https://playwright.dev/' },
  ]),
]
webDevNodes[0].data.unlocked = true

const webDevEdges = [
  edge('web_1', 'web_2'), edge('web_1', 'web_3'),
  edge('web_2', 'web_4'), edge('web_3', 'web_5'), edge('web_3', 'web_6'), edge('web_3', 'web_7'),
  edge('web_5', 'web_8'), edge('web_6', 'web_8'), edge('web_7', 'web_9'),
  edge('web_8', 'web_10'), edge('web_8', 'web_11'), edge('web_9', 'web_10'),
  edge('web_9', 'web_12'),
]

// ─── Python Data Science Roadmap ────────────────────────────────
const pythonNodes = [
  node('py_1', 'Python Basics', 'Variables, data types, control flow, functions, OOP fundamentals.', 400, 0, [
    { label: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/' },
    { label: 'Automate Boring Stuff', url: 'https://automatetheboringstuff.com/' },
  ]),
  node('py_2', 'NumPy', 'Array operations, broadcasting, linear algebra, random generation.', 150, 180, [
    { label: 'NumPy Docs', url: 'https://numpy.org/doc/stable/' },
  ]),
  node('py_3', 'Pandas', 'DataFrames, data cleaning, groupby, merge, time series.', 650, 180, [
    { label: 'Pandas Docs', url: 'https://pandas.pydata.org/docs/' },
  ]),
  node('py_4', 'Data Visualization', 'Matplotlib, Seaborn, Plotly — charts, heatmaps, interactive plots.', 150, 360, [
    { label: 'Matplotlib', url: 'https://matplotlib.org/' },
    { label: 'Seaborn', url: 'https://seaborn.pydata.org/' },
  ]),
  node('py_5', 'Statistics & Probability', 'Hypothesis testing, distributions, Bayesian thinking, A/B testing.', 650, 360, [
    { label: 'Khan Academy Stats', url: 'https://www.khanacademy.org/math/statistics-probability' },
  ]),
  node('py_6', 'Scikit-Learn', 'Classification, regression, clustering, model evaluation, pipelines.', 400, 540, [
    { label: 'Scikit-Learn Docs', url: 'https://scikit-learn.org/stable/' },
  ]),
  node('py_7', 'Deep Learning', 'Neural networks, CNNs, RNNs, transformers — PyTorch or TensorFlow.', 150, 720, [
    { label: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' },
    { label: 'Fast.ai', url: 'https://www.fast.ai/' },
  ]),
  node('py_8', 'NLP', 'Tokenization, embeddings, sentiment analysis, LLMs, Hugging Face.', 650, 720, [
    { label: 'Hugging Face', url: 'https://huggingface.co/docs' },
  ]),
  node('py_9', 'MLOps', 'Model deployment, MLflow, Docker, monitoring, CI/CD for ML.', 400, 900, [
    { label: 'MLflow', url: 'https://mlflow.org/' },
  ]),
]
pythonNodes[0].data.unlocked = true

const pythonEdges = [
  edge('py_1', 'py_2'), edge('py_1', 'py_3'),
  edge('py_2', 'py_4'), edge('py_3', 'py_4'), edge('py_2', 'py_5'), edge('py_3', 'py_5'),
  edge('py_4', 'py_6'), edge('py_5', 'py_6'),
  edge('py_6', 'py_7'), edge('py_6', 'py_8'),
  edge('py_7', 'py_9'), edge('py_8', 'py_9'),
]

// ─── Mobile Dev Roadmap ─────────────────────────────────────────
const mobileNodes = [
  node('mob_1', 'Programming Fundamentals', 'Core CS concepts — OOP, data structures, algorithms.', 400, 0, [
    { label: 'CS50', url: 'https://cs50.harvard.edu/' },
  ]),
  node('mob_2', 'Kotlin', 'Modern JVM language — null safety, coroutines, extension functions.', 200, 180, [
    { label: 'Kotlin Docs', url: 'https://kotlinlang.org/docs/' },
  ]),
  node('mob_3', 'Swift', 'Apple ecosystem language — optionals, protocols, value types.', 600, 180, [
    { label: 'Swift.org', url: 'https://www.swift.org/documentation/' },
  ]),
  node('mob_4', 'Android SDK', 'Activities, fragments, intents, lifecycle, permissions.', 100, 360, [
    { label: 'Android Docs', url: 'https://developer.android.com/docs' },
  ]),
  node('mob_5', 'Jetpack Compose', 'Declarative UI toolkit for Android — composables, state, navigation.', 350, 360, [
    { label: 'Compose Docs', url: 'https://developer.android.com/jetpack/compose' },
  ]),
  node('mob_6', 'SwiftUI', 'Declarative UI for iOS — views, modifiers, data flow.', 600, 360, [
    { label: 'SwiftUI Docs', url: 'https://developer.apple.com/xcode/swiftui/' },
  ]),
  node('mob_7', 'React Native', 'Cross-platform mobile with JavaScript/TypeScript.', 850, 360, [
    { label: 'RN Docs', url: 'https://reactnative.dev/' },
  ]),
  node('mob_8', 'App Architecture', 'MVVM, Clean Architecture, dependency injection, state management.', 300, 540, [
    { label: 'Guide to App Architecture', url: 'https://developer.android.com/topic/architecture' },
  ]),
  node('mob_9', 'Publishing', 'Play Store, App Store — signing, screenshots, ASO, review guidelines.', 600, 540, [
    { label: 'Play Console', url: 'https://play.google.com/console/' },
  ]),
]
mobileNodes[0].data.unlocked = true

const mobileEdges = [
  edge('mob_1', 'mob_2'), edge('mob_1', 'mob_3'),
  edge('mob_2', 'mob_4'), edge('mob_2', 'mob_5'),
  edge('mob_3', 'mob_6'), edge('mob_1', 'mob_7'),
  edge('mob_4', 'mob_8'), edge('mob_5', 'mob_8'), edge('mob_6', 'mob_8'),
  edge('mob_8', 'mob_9'),
]

// ─── DevOps Roadmap ─────────────────────────────────────────────
const devopsNodes = [
  node('ops_1', 'Linux Fundamentals', 'Shell scripting, file system, permissions, processes, networking basics.', 400, 0, [
    { label: 'Linux Journey', url: 'https://linuxjourney.com/' },
  ]),
  node('ops_2', 'Networking', 'TCP/IP, DNS, HTTP/HTTPS, load balancing, firewalls.', 150, 180, [
    { label: 'Networking Basics', url: 'https://www.cloudflare.com/learning/' },
  ]),
  node('ops_3', 'Git Advanced', 'Rebasing, cherry-pick, submodules, hooks, monorepo strategies.', 650, 180, [
    { label: 'Pro Git Book', url: 'https://git-scm.com/book' },
  ]),
  node('ops_4', 'Docker', 'Containers, images, Dockerfile, docker-compose, volumes, networks.', 150, 360, [
    { label: 'Docker Docs', url: 'https://docs.docker.com/' },
  ]),
  node('ops_5', 'CI/CD', 'GitHub Actions, Jenkins, GitLab CI — pipelines, testing, deployment automation.', 650, 360, [
    { label: 'GH Actions', url: 'https://docs.github.com/en/actions' },
  ]),
  node('ops_6', 'Kubernetes', 'Pods, services, deployments, Helm, scaling, monitoring.', 150, 540, [
    { label: 'K8s Docs', url: 'https://kubernetes.io/docs/' },
  ]),
  node('ops_7', 'Cloud (AWS/GCP)', 'EC2, S3, Lambda, Cloud Functions, IAM, VPC.', 650, 540, [
    { label: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
  ]),
  node('ops_8', 'Monitoring', 'Prometheus, Grafana, logging (ELK), alerting, SLOs.', 400, 720, [
    { label: 'Grafana', url: 'https://grafana.com/docs/' },
  ]),
  node('ops_9', 'Infrastructure as Code', 'Terraform, Pulumi — declarative infrastructure management.', 400, 900, [
    { label: 'Terraform', url: 'https://developer.hashicorp.com/terraform' },
  ]),
]
devopsNodes[0].data.unlocked = true

const devopsEdges = [
  edge('ops_1', 'ops_2'), edge('ops_1', 'ops_3'),
  edge('ops_2', 'ops_4'), edge('ops_3', 'ops_5'),
  edge('ops_4', 'ops_6'), edge('ops_5', 'ops_7'),
  edge('ops_6', 'ops_8'), edge('ops_7', 'ops_8'),
  edge('ops_8', 'ops_9'),
]

// ─── AI/ML Roadmap ──────────────────────────────────────────────
const aiNodes = [
  node('ai_1', 'Mathematics', 'Linear algebra, calculus, probability — the foundation for all ML.', 400, 0, [
    { label: '3Blue1Brown', url: 'https://www.3blue1brown.com/' },
    { label: 'Khan Academy', url: 'https://www.khanacademy.org/math/linear-algebra' },
  ]),
  node('ai_2', 'Python for ML', 'NumPy, Pandas, Matplotlib — data manipulation essentials.', 400, 180, [
    { label: 'Python DS Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
  ]),
  node('ai_3', 'Classical ML', 'Regression, SVMs, decision trees, ensembles, cross-validation.', 150, 360, [
    { label: 'Scikit-Learn', url: 'https://scikit-learn.org/' },
    { label: 'ML Course', url: 'https://www.coursera.org/learn/machine-learning' },
  ]),
  node('ai_4', 'Feature Engineering', 'Encoding, scaling, selection, dimensionality reduction (PCA).', 650, 360, [
    { label: 'Feature Engine', url: 'https://feature-engine.trainindata.com/' },
  ]),
  node('ai_5', 'Deep Learning', 'Neural networks, backpropagation, CNNs, RNNs, attention.', 400, 540, [
    { label: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/' },
    { label: 'PyTorch', url: 'https://pytorch.org/tutorials/' },
  ]),
  node('ai_6', 'Computer Vision', 'Image classification, object detection, segmentation, GANs.', 100, 720, [
    { label: 'CS231n', url: 'https://cs231n.stanford.edu/' },
  ]),
  node('ai_7', 'NLP & LLMs', 'Transformers, BERT, GPT, fine-tuning, RAG, prompt engineering.', 400, 720, [
    { label: 'Hugging Face', url: 'https://huggingface.co/learn' },
  ]),
  node('ai_8', 'Reinforcement Learning', 'Q-learning, policy gradients, PPO, environments.', 700, 720, [
    { label: 'Spinning Up', url: 'https://spinningup.openai.com/' },
  ]),
  node('ai_9', 'ML Systems & Deployment', 'Model serving, A/B testing, monitoring, MLOps, edge deployment.', 400, 900, [
    { label: 'Made With ML', url: 'https://madewithml.com/' },
  ]),
]
aiNodes[0].data.unlocked = true

const aiEdges = [
  edge('ai_1', 'ai_2'),
  edge('ai_2', 'ai_3'), edge('ai_2', 'ai_4'),
  edge('ai_3', 'ai_5'), edge('ai_4', 'ai_5'),
  edge('ai_5', 'ai_6'), edge('ai_5', 'ai_7'), edge('ai_5', 'ai_8'),
  edge('ai_6', 'ai_9'), edge('ai_7', 'ai_9'), edge('ai_8', 'ai_9'),
]

// ─── Export all presets ─────────────────────────────────────────
export const PRESET_ROADMAPS = [
  {
    id: 'preset_webdev',
    title: 'Web Development',
    summary: 'Full-stack web development from HTML basics to deployment and testing. Covers React, Next.js, Node.js, databases, and modern tooling.',
    icon: '🌐',
    color: '#3b82f6',
    nodes: webDevNodes,
    edges: webDevEdges,
  },
  {
    id: 'preset_python_ds',
    title: 'Python & Data Science',
    summary: 'From Python fundamentals through data analysis, machine learning, deep learning, NLP, and MLOps deployment.',
    icon: '🐍',
    color: '#10b981',
    nodes: pythonNodes,
    edges: pythonEdges,
  },
  {
    id: 'preset_mobile',
    title: 'Mobile Development',
    summary: 'Native and cross-platform mobile development — Android (Kotlin/Compose), iOS (Swift/SwiftUI), and React Native.',
    icon: '📱',
    color: '#8b5cf6',
    nodes: mobileNodes,
    edges: mobileEdges,
  },
  {
    id: 'preset_devops',
    title: 'DevOps & Cloud',
    summary: 'Linux, Docker, Kubernetes, CI/CD, cloud providers, monitoring, and Infrastructure as Code.',
    icon: '☁️',
    color: '#f59e0b',
    nodes: devopsNodes,
    edges: devopsEdges,
  },
  {
    id: 'preset_ai',
    title: 'AI & Machine Learning',
    summary: 'Mathematics foundations through classical ML, deep learning, computer vision, NLP/LLMs, and ML systems.',
    icon: '🤖',
    color: '#ef4444',
    nodes: aiNodes,
    edges: aiEdges,
  },
]
