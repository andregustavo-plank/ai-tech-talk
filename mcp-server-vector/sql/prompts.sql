-- Install the pgvector extension to enable the 'vector' type
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the LLM_PROMPTS table if it does not exist
CREATE TABLE IF NOT EXISTS LLM_PROMPTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Upsert 20 random prompts into the LLM_PROMPTS table
INSERT INTO LLM_PROMPTS (id, name, description, prompt)
VALUES
    (1, 'Code Review', 'Request a review of a code snippet for best practices and potential issues.', 'Please review the following code for best practices and potential bugs: <insert code here>'),
    (2, 'Debugging Help', 'Ask for help identifying and fixing a bug in your code.', 'I am encountering a bug in this code. Can you help me identify and fix it? <insert code here>'),
    (3, 'Refactoring Suggestion', 'Request suggestions for refactoring a piece of code to improve readability or performance.', 'How can I refactor this code to make it more readable or efficient? <insert code here>'),
    (4, 'Write Unit Tests', 'Ask for unit tests to be written for a given function or module.', 'Please write unit tests for the following function: <insert code here>'),
    (5, 'Explain Code', 'Request an explanation of what a code snippet does.', 'Can you explain what this code does? <insert code here>'),
    (6, 'API Documentation', 'Request documentation for a function, class, or API endpoint.', 'Please generate documentation for the following API/function: <insert code here>'),
    (7, 'Suggest Libraries', 'Ask for library or tool recommendations for a specific task.', 'What libraries or tools would you recommend for <insert task or technology>?'),
    (8, 'Optimize SQL Query', 'Request optimization suggestions for a SQL query.', 'How can I optimize this SQL query? <insert SQL here>'),
    (9, 'Regex Help', 'Ask for help writing or understanding a regular expression.', 'Can you help me write or understand this regular expression? <insert regex here>'),
    (10, 'Architecture Advice', 'Request advice on designing the architecture for a new project or feature.', 'What architecture would you recommend for a project that needs to <insert requirements>?'),
    (11, 'Security Review', 'Request a security review of a code snippet or system design.', 'Please review this code/system for potential security vulnerabilities: <insert code or description here>'),
    (12, 'Performance Profiling', 'Ask for advice on profiling and improving application performance.', 'How can I profile and improve the performance of my application? <insert context here>'),
    (13, 'DevOps Automation', 'Request help automating a development or deployment workflow.', 'How can I automate the following workflow using DevOps tools? <insert workflow description here>'),
    (14, 'CI/CD Pipeline', 'Ask for help setting up or improving a CI/CD pipeline.', 'Can you help me set up or improve a CI/CD pipeline for my project? <insert project details here>'),
    (15, 'Code Migration', 'Request guidance on migrating code from one language, framework, or version to another.', 'What steps should I take to migrate my code from <source> to <target>?'),
    (16, 'Design Patterns', 'Ask for advice on applying design patterns to solve a problem.', 'Which design pattern would be suitable for solving this problem? <insert problem description here>'),
    (17, 'Error Explanation', 'Request an explanation and solution for a specific error message.', 'I am getting this error: <insert error message>. What does it mean and how can I fix it?'),
    (18, 'Code Generation', 'Ask for code to be generated for a specific task or algorithm.', 'Can you generate code that accomplishes the following task? <insert task description here>'),
    (19, 'Best Practices', 'Request best practices for a specific technology, language, or workflow.', 'What are the best practices for <insert technology, language, or workflow>?'),
    (20, 'Learning Path', 'Ask for a recommended learning path for a technology or role.', 'What is a good learning path to become proficient in <insert technology or role>?')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    prompt = EXCLUDED.prompt,
    created_at = EXCLUDED.created_at;