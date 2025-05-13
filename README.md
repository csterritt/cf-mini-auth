### cf-mini-auth is an example of a Cloudflare Pages application using Hono and Prisma.

It will eventually have a very simple, email-OTP authentication flow.

Adding initial users and count via sqlite3:

    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaaa', 'csterritt@gmail.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaab', 'fredfred@team439980.testinator.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into count (id, count) values ('foo', 0);
