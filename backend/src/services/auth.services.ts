import { AppError, AuthenticationError, NotFoundError } from "./../util/error";
import { users } from "./../db/schema";
import db from "../db/index";
import * as t from "../db/schema";
import bcrypt from "bcrypt";
import config from "../config/index";
import { eq } from "drizzle-orm";

export async function signupService(
  username: string,
  email: string,
  password: string,
) {
  const saltRounds = Number(config.saltRounds);
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await db.query.users.findFirst({
    where: {
      email,
    },
  });

  if (user) throw new AuthenticationError("User already exists");

  const [newUser] = await db
    .insert(t.users)
    .values({ username, email, passwordHash })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
    });

  if (!newUser) {
    throw new AppError("Failed to create user", 500);
  }
  return newUser;
}

export async function loginService(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: {
      email,
    },
    columns: {
      id: true,
      email: true,
      username: true,
      passwordHash: true,
    },
  });

  if (!user) throw new AuthenticationError();

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AuthenticationError();
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}

export async function getCurrentUserService(userId: string) {
  const user = await db.query.users.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) throw new NotFoundError("This user does not exist");

  return user;
}

export async function resetPasswordService(
  userId: string,
  newPassword: string,
) {
  const user = await db.query.users.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) throw new NotFoundError("This user does not exist");

  const saltRounds = config.saltRounds;

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await db
    .update(t.users)
    .set({ passwordHash: hashedPassword })
    .where(eq(t.users.id, userId));
}
