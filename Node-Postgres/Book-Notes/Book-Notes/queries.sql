create table books(
	id serial primary key,
	title text,
	authors text,
	thumbnail text,
	published_date text,
	keyword text
);

-- Then you insert into table from google books api

-- Then you run the below queries in any postgresql GUI provider
ALTER TABLE books
ADD COLUMN rating NUMERIC,
ADD COLUMN summary TEXT;

-- Random rating from 1-10
UPDATE books
SET rating = ROUND((RANDOM() * 9 + 1)::numeric, 1)::integer;

-- Random Summary insertion
UPDATE books
SET summary = CASE
  WHEN RANDOM() < 0.2 THEN 'A thought-provoking journey through ideas and emotions.'
  WHEN RANDOM() < 0.4 THEN 'A compelling narrative that explores human nature deeply.'
  WHEN RANDOM() < 0.6 THEN 'A delightful mix of insight, creativity, and storytelling.'
  WHEN RANDOM() < 0.8 THEN 'A reflective and beautifully written piece of literature.'
  ELSE 'An inspiring read that challenges perspectives and ignites curiosity.'
END;
