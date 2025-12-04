-- Add media_type column to design_media table
ALTER TABLE design_media ADD COLUMN media_type VARCHAR(50) DEFAULT 'image';

-- Update existing records to be 'image' (assuming they are all images for now)
UPDATE design_media SET media_type = 'image';

-- Add constraint to ensure valid types
ALTER TABLE design_media ADD CONSTRAINT check_media_type CHECK (media_type IN ('image', 'video', 'cad'));
