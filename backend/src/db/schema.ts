import * as t from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";

export const invitationStatusEnum = t.pgEnum("status", [
  "accepted",
  "pending",
  "rejected",
]);

const timestamps = {
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
  deletedAt: t.timestamp("deleted_at"),
};

export const users = t.pgTable("users", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  email: t.varchar({ length: 255 }).notNull().unique(),
  username: t.varchar({ length: 255 }).notNull(),
  passwordHash: t.varchar("password_hash", { length: 255 }).notNull(),
  isOnboarded: t.boolean("is_onboarded").default(false),
  ...timestamps,
});

export const invitations = t.pgTable("invitations", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  senderId: t
    .uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  receiverId: t
    .uuid("partner_id")
    .references(() => users.id, { onDelete: "cascade" }),
  token: t.uuid("token").defaultRandom().notNull().unique(),
  addictionId: t
    .uuid("addiction_id")
    .notNull()
    .references(() => addictions.id, { onDelete: "cascade" }),
  status: invitationStatusEnum().default("pending"),
  ...timestamps,
});

export const addictions = t.pgTable(
  "addictions",
  {
    id: t.uuid("id").primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    userId: t
      .uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    partnerId: t
      .uuid("partner_id")
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [t.unique("user_partner_idx").on(table.userId, table.partnerId)],
);

export const journalEntries = t.pgTable("journal_entries", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  content: t.text(),
  succeeded: t.boolean(),
  date: t.date(),
  addictionId: t
    .uuid("addiction_id")
    .notNull()
    .references(() => addictions.id),
  ...timestamps,
});

export const relations = defineRelations(
  { users, addictions, journalEntries, invitations },
  (r) => ({
    addictions: {
      user: r.one.users({
        from: r.addictions.userId,
        to: r.users.id,
        alias: "user_addictions",
      }),
      partner: r.one.users({
        from: r.addictions.partnerId,
        to: r.users.id,
        alias: "partner_addictions",
      }),
      journalEntries: r.many.journalEntries(),
    },
    invitations: {
      sender: r.one.users({
        from: r.invitations.senderId,
        to: r.users.id,
        alias: "sent_invitations",
      }),

      receiver: r.one.users({
        from: r.invitations.receiverId,
        to: r.users.id,
        alias: "received_invitations",
      }),
    },
    journalEntries: {
      addiction: r.one.addictions({
        from: r.journalEntries.addictionId,
        to: r.addictions.id,
      }),
    },
    users: {
      myAddictions: r.many.addictions({
        alias: "user_addictions",
      }),
      accountabilityPartnerFor: r.many.addictions({
        alias: "partner_addictions",
      }),
      sentInvitations: r.many.invitations({
        alias: "sent_invitations",
      }),
      receivedInvitations: r.many.invitations({
        alias: "received_invitations",
      }),
    },
  }),
);
