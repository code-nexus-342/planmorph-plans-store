CREATE TABLE professional_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL, -- 'approve', 'reject', 'upload', 'purchase'
    entity_type VARCHAR(50) NOT NULL, -- 'application', 'design', 'user'
    entity_id INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
