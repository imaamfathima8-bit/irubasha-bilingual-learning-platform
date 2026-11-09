const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');



const db = new Database('irubasha.db');
db.pragma('journal_mode = WAL');


db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    age INTEGER,
    grade TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0
  )
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    english_word TEXT NOT NULL,
    sinhala_options TEXT NOT NULL,
    selected_option TEXT,
    correct_option TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_ms INTEGER,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS learned_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    english TEXT NOT NULL,
    sinhala TEXT NOT NULL,
    tamil TEXT NOT NULL,
    times_practiced INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0,
    last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, english)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS audio_recordings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word_english TEXT NOT NULL,
    word_language TEXT NOT NULL,
    audio_blob BLOB NOT NULL,
    audio_format TEXT DEFAULT 'webm',
    duration_ms INTEGER,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS daily_streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    streak_date DATE NOT NULL,
    quizzes_completed INTEGER DEFAULT 0,
    words_learned INTEGER DEFAULT 0,
    audio_recorded INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, streak_date)
  )
`);


db.exec(`
  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id INTEGER PRIMARY KEY,
    preferred_language TEXT DEFAULT 'sinhala',
    audio_enabled BOOLEAN DEFAULT 1,
    difficulty_level TEXT DEFAULT 'easy',
    theme TEXT DEFAULT 'light',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

console.log('✅ Database schema created successfully');


const registerUser = db.prepare(`
  INSERT INTO users (username, email, password_hash, full_name, age, grade)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const getUserByUsername = db.prepare(`
  SELECT * FROM users WHERE username = ?
`);

const getUserByEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);


const updateStreak = db.prepare(`
  UPDATE users 
  SET current_streak = ?, longest_streak = MAX(longest_streak, ?), last_login = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const saveQuizAttempt = db.prepare(`
  INSERT INTO quiz_attempts (user_id, english_word, sinhala_options, selected_option, correct_option, is_correct, time_taken_ms)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);


const updateUserStats = db.prepare(`
  UPDATE users 
  SET total_quizzes = total_quizzes + 1, total_score = total_score + ?
  WHERE id = ?
`);


const saveLearnedWord = db.prepare(`
  INSERT OR REPLACE INTO learned_words (user_id, english, sinhala, tamil, times_practiced, mastery_level, last_practiced)
  VALUES (?, ?, ?, ?, COALESCE((SELECT times_practiced FROM learned_words WHERE user_id = ? AND english = ?), 0) + 1, ?, CURRENT_TIMESTAMP)
`);


const saveAudioRecording = db.prepare(`
  INSERT INTO audio_recordings (user_id, word_english, word_language, audio_blob, audio_format, duration_ms)
  VALUES (?, ?, ?, ?, ?, ?)
`);


const updateDailyStreak = db.prepare(`
  INSERT INTO daily_streaks (user_id, streak_date, quizzes_completed, words_learned, audio_recorded)
  VALUES (?, DATE('now'), 1, 0, 0)
  ON CONFLICT(user_id, streak_date) 
  DO UPDATE SET quizzes_completed = quizzes_completed + 1
`);

const getUserStats = db.prepare(`
  SELECT 
    u.username, u.full_name, u.current_streak, u.longest_streak,
    u.total_quizzes, u.total_score,
    COUNT(DISTINCT lw.id) as words_learned,
    COUNT(DISTINCT ar.id) as audio_recordings
  FROM users u
  LEFT JOIN learned_words lw ON u.id = lw.user_id
  LEFT JOIN audio_recordings ar ON u.id = ar.user_id
  WHERE u.id = ?
  GROUP BY u.id
`);

module.exports = {
  db,
  registerUser,
  getUserByUsername,
  getUserByEmail,
  updateStreak,
  saveQuizAttempt,
  updateUserStats,
  saveLearnedWord,
  saveAudioRecording,
  updateDailyStreak,
  getUserStats,
};
