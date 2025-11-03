import express from "express";
import cors from "cors";
import z from "zod";
import jwt from "jsonwebtoken";

const app = express();

const USERS = [
  {
    username: "john_doe",
    address: "123 Maple Street, New York, USA",
    occupation: "Software Engineer",
  },
  {
    username: "emma_wilson",
    address: "45 Rose Avenue, London, UK",
    occupation: "Graphic Designer",
  },
  {
    username: "liam_smith",
    address: "789 Elm Road, Toronto, Canada",
    occupation: "Data Analyst",
  },
];

app.use(cors());
app.use(express.json());

const auth = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const email = req.headers.email;

  const userSchema = z.object({
    username: z.string().min(2).max(100),
    password: z.string().min(6).max(100),
    email: z.email(),
  });

  const result = userSchema.safeParse({ username, password, email });

  if (!result.success) {
    return res
      .status(400)
      .send({ success: false, errors: result.error.format() });
  }

  next();
};

app.post("/signup", auth, (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const email = req.headers.email;

  const token = jwt.sign(
    { username: username, password: password, email: email },
    "secretkey"
  );

  res
    .status(200)
    .send({ success: true, message: "User signed in successfully", token });
});

app.get("/", (req, res) => {
  const token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey");
    // sending the list of users as response
    res.status(200).send({ success: true, users: USERS });
  } catch (err) {
    res.status(401).send({ success: false, message: "Invalid token" });
  }
});

app.listen(8000, () => {
  console.log("app is running on 8000 port");
});
