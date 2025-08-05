# 📝 Blog Management API

The Blog Management API is a scalable and secure RESTful API designed to manage a blogging platform with multiple levels of user access. Built with Node.js, Express, and MongoDB, it provides a clear separation of privileges across three user roles: Admin, Author, and Reader. Admins can manage the entire platform by creating or deleting authors and blogs. Authors can write, publish, and manage their own blogs. Readers can explore blog content, like or dislike posts, add blogs to their favourites, and subscribe to authors to receive notifications. The API is documented with Swagger, tested using Jest, and integrates Firebase Cloud Messaging (FCM) to send real-time push notifications for activities like new blog posts, likes, and subscriptions. This API is ideal for building full-featured blogging platforms, content-sharing portals, or educational writing systems with fine-grained access control.

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

📄 API Documentation
Interactive Swagger documentation is available at:
```bash
http://localhost:3000/api/docs
```

✅ Testing
Tests are written using Jest and include unit and integration coverage.
```bash
npm run test
```
