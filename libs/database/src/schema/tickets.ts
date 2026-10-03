import { integer, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { events } from "./events.js";
import { users } from "./users.js";




export const ticketStatusEnum = pgEnum('ticket_status', [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CANCELLED"
])

export const tickets = pgTable('tickets', {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id').references(() => events.id).notNull(),
    userId: uuid('user_id')
        .references(() => users.id).notNull(),
    quantity: integer('quantity').default(1).notNull(),
    totalPrice: integer('total_price').notNull(),
    status: ticketStatusEnum('status').default('PENDING').notNull(),
    ticketCode: varchar('ticket_code', { length: 20 }).notNull()
})