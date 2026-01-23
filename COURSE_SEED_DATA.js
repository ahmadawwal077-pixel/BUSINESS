// Run this in your MongoDB to seed sample courses
db.courses.insertMany([
  {
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development including HTML, CSS, and JavaScript. Build responsive and interactive websites from scratch.",
    category: "Web Development",
    level: "Beginner",
    price: 15000,
    duration: 8,
    maxStudents: 30,
    enrolledStudents: 5,
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-03-31"),
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      startTime: "10:00 AM",
      endTime: "12:00 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Advanced JavaScript & React",
    description: "Master advanced JavaScript concepts and build production-ready React applications. Learn state management, hooks, and modern development practices.",
    category: "Web Development",
    level: "Intermediate",
    price: 25000,
    duration: 10,
    maxStudents: 25,
    enrolledStudents: 8,
    startDate: new Date("2026-02-03"),
    endDate: new Date("2026-04-15"),
    schedule: {
      days: ["Tuesday", "Thursday"],
      startTime: "2:00 PM",
      endTime: "5:00 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Server Security & Deployment",
    description: "Learn how to secure your servers, implement SSL certificates, configure firewalls, and deploy applications safely to production environments.",
    category: "Server Security",
    level: "Intermediate",
    price: 22000,
    duration: 6,
    maxStudents: 20,
    enrolledStudents: 3,
    startDate: new Date("2026-02-05"),
    endDate: new Date("2026-03-20"),
    schedule: {
      days: ["Monday", "Wednesday"],
      startTime: "3:00 PM",
      endTime: "5:30 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Data Science with Python",
    description: "Learn data analysis, visualization, and machine learning with Python. Work with pandas, NumPy, matplotlib, and scikit-learn.",
    category: "Data Science",
    level: "Intermediate",
    price: 28000,
    duration: 12,
    maxStudents: 25,
    enrolledStudents: 12,
    startDate: new Date("2026-02-02"),
    endDate: new Date("2026-04-30"),
    schedule: {
      days: ["Tuesday", "Thursday", "Saturday"],
      startTime: "11:00 AM",
      endTime: "1:00 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Mobile App Development",
    description: "Build native and cross-platform mobile applications. Learn React Native, Flutter, and best practices for mobile development.",
    category: "Mobile Development",
    level: "Intermediate",
    price: 26000,
    duration: 10,
    maxStudents: 22,
    enrolledStudents: 7,
    startDate: new Date("2026-02-04"),
    endDate: new Date("2026-04-15"),
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      startTime: "1:00 PM",
      endTime: "3:30 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cloud Computing with AWS",
    description: "Master cloud computing with Amazon Web Services. Learn EC2, S3, Lambda, RDS, and other AWS services for scalable applications.",
    category: "Cloud Computing",
    level: "Advanced",
    price: 35000,
    duration: 8,
    maxStudents: 20,
    enrolledStudents: 4,
    startDate: new Date("2026-02-06"),
    endDate: new Date("2026-04-03"),
    schedule: {
      days: ["Tuesday", "Thursday"],
      startTime: "4:00 PM",
      endTime: "6:30 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Introduction to AI & Machine Learning",
    description: "Explore artificial intelligence and machine learning fundamentals. Build predictive models and understand neural networks.",
    category: "AI/ML",
    level: "Beginner",
    price: 24000,
    duration: 9,
    maxStudents: 28,
    enrolledStudents: 10,
    startDate: new Date("2026-02-08"),
    endTime: new Date("2026-04-10"),
    schedule: {
      days: ["Saturday", "Sunday"],
      startTime: "9:00 AM",
      endTime: "12:00 PM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Full Stack Development Mastery",
    description: "Complete full stack developer training. Learn MERN stack, databases, APIs, and deploy complete web applications.",
    category: "Web Development",
    level: "Advanced",
    price: 45000,
    duration: 16,
    maxStudents: 30,
    enrolledStudents: 15,
    startDate: new Date("2026-01-27"),
    endDate: new Date("2026-05-15"),
    schedule: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "9:00 AM",
      endTime: "11:00 AM"
    },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
