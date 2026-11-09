# IruBasha – Bilingual Vocabulary Learning Platform

## Project Overview

IruBasha is a bilingual vocabulary learning web platform designed to support Sinhala and Tamil language learning among Sri Lankan children. It provides an interactive environment for learning vocabulary, pronunciation and basic grammar.

This project was developed as a group academic project for the Diploma in Computer Science with Artificial Intelligence at the National Institute of Business Management (NIBM).

## Features

- Sinhala and Tamil vocabulary translation
- Rule-based translation using SWI-Prolog
- Neural translation service as a fallback
- Audio pronunciation and recording features
- Interactive vocabulary quizzes
- Personal word bank
- Basic learning progress tracking
- Daily learning challenges

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Logic and Translation:** SWI-Prolog
- **Authentication:** JSON Web Tokens (JWT)
- **Architecture:** Client-server architecture with REST APIs

## Project Architecture

The platform uses a client-server architecture. The frontend communicates with the Node.js backend through REST APIs. SWI-Prolog supports rule-based dictionary and translation functionality.

## Project Documentation

The `docs` folder contains the final project report and presentation.

## Limitations

- The Prolog dictionary has limited vocabulary coverage.
- Automated pronunciation scoring is not currently implemented.
- Browser-based speech functionality may vary across devices and platforms.

## Future Improvements

- Expand the Sinhala and Tamil vocabulary database.
- Introduce automated pronunciation assessment.
- Develop teacher and administrator dashboards.
- Implement adaptive learning features.

## Contributors

This was a collaborative academic project developed by Group 06.

- Fathima Imam
- Dilmini Dasunika
- Sewmini Dissanayake
- Piratheesha Ambikaipakan

## Live Demo

Try the deployed application:

[Open IruBasha](https://irubasha-frontend.onrender.com/)
