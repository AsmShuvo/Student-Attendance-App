# Attendance System – Digital Student Attendance App

A modern and user-friendly **attendance management system** designed for schools, colleges and universities.  
This application replaces traditional paperwork and helps institutions **digitize attendance**, manage multiple grades/classes and view **monthly & yearly analytics**

---

## Overview

Attendance System provides:

- Digital attendance marking (present/absent)
- Multi-level support (grades, classes, sections)
- Clean and interactive UI for managing students
- Dashboard analytics for Monthly & yearly attendance matrix
- Secure authentication

---

## 🧱 Tech Stack

<div align="left">

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![NeonDB](https://img.shields.io/badge/NeonDB-000000?logo=neondatabase&logoColor=00E699)
![DrizzleORM](https://img.shields.io/badge/Drizzle_ORM-1e293b?logo=drizzle&logoColor=white)
![Kinde](https://img.shields.io/badge/Kinde_Auth-0B1725?logo=kinde&logoColor=18E299)
![AG Grid](https://img.shields.io/badge/AG_Grid-1E90FF?logo=ag-grid&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-10b981?logo=react&logoColor=ffffff)

</div>

---

## 📦 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/AsmShuvo/Student-Attendance-App.git
cd Student-Attendance-App
npm install
```

## Environment Setup

Create .env

```
DATABASE_URL="your_neon_postgre_url"
```

Create a .env.local

```
KINDE_CLIENT_ID=d351f7081e3346b39a1760597c7e59c9
KINDE_CLIENT_SECRET=OOiI9Y84YE0V43OXxpuoHOtu9vXnhPKAB48Bl2h4l5LunHarDuJO
KINDE_ISSUER_URL=https://myattendancetracking.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard
```

database commands:
```
npm run db:push
npm run db:studio
```

Run the app:

```
npm run dev
```

And the app is ready to be used.
