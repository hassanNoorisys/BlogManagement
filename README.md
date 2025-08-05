# 📝 Blog Management API

A robust and role-based Blog Management API built with **Node.js**, designed to handle content creation, interaction, and user access control.

---

## 🔐 Access Levels

This API implements 3 levels of user access:

| Role   | Permissions |
|--------|-------------|
| **Admin** | ✅ Create/Delete Authors<br>✅ Create/Delete Blogs, Readers, Mark Active or inactive Blogs and Authors |
| **Author** | ✅ Create Blogs<br>✅ Delete Own Blogs |
| **Reader** | ✅ Read Blogs<br>✅ Like/Dislike Blogs<br>✅ Add Blogs to Favourites<br>✅ Subscribe to Authors |

---

## 🚀 Tech Stack & Tools

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![Firebase FCM](https://img.shields.io/badge/Firebase_FCM-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)

### 🛠️ Tools

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black&style=for-the-badge)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white&style=for-the-badge)

---

## 📦 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hassanNoorisys/BlogManagement.git
cd BlogManagement
```

### Install dependencies
```bash
npm install
```

### setup environment varibles and Firebase FCM
- Copy the environment variables from .env.example to .env.dev
- Get the token from FCM and ServiceAccount key from firebase console
- Get App password of yout Gmail to setup the mail sending using nodemailer

### Run the local development server
```bash
npm run dev
```
