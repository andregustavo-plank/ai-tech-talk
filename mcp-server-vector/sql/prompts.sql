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
    (1, 'Prompt 1', 'Description for prompt 1', 'What is the capital of France?'),
    (2, 'Prompt 2', 'Description for prompt 2', 'Explain the theory of relativity.'),
    (3, 'Prompt 3', 'Description for prompt 3', 'What are the benefits of exercise?'),
    (4, 'Prompt 4', 'Description for prompt 4', 'Describe the process of photosynthesis.'),
    (5, 'Prompt 5', 'Description for prompt 5', 'What is the largest mammal on Earth?'),
    (6, 'Prompt 6', 'Description for prompt 6', 'How does a computer work?'),
    (7, 'Prompt 7', 'Description for prompt 7', 'What is the Pythagorean theorem?'),
    (8, 'Prompt 8', 'Description for prompt 8', 'Explain the water cycle.'),
    (9, 'Prompt 9', 'Description for prompt 9', 'What is the speed of light?'),
    (10, 'Prompt 10', 'Description for prompt 10', 'Describe the human digestive system.'),
    (11, 'Prompt 11', 'Description for prompt 11', 'What is quantum mechanics?'),
    (12, 'Prompt 12', 'Description for prompt 12', 'How do plants grow?'),
    (13, 'Prompt 13', 'Description for prompt 13', 'What is the function of the heart?'),
    (14, 'Prompt 14', 'Description for prompt 14', 'Explain the concept of gravity.'),
    (15, 'Prompt 15', 'Description for prompt 15', 'What is the structure of an atom?'),
    (16, 'Prompt 16', 'Description for prompt 16', 'How does photosynthesis work?'),
    (17, 'Prompt 17', 'Description for prompt 17', 'What is the theory of evolution?'),
    (18, 'Prompt 18', 'Description for prompt 18', 'Describe the solar system.'),
    (19, 'Prompt 19', 'Description for prompt 19', 'What is the importance of biodiversity?'),
    (20, 'Prompt 20', 'Description for prompt 20', 'Explain the process of mitosis.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    prompt = EXCLUDED.prompt,
    created_at = EXCLUDED.created_at;