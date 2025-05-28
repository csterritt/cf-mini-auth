### cf-mini-auth is an example of a Cloudflare Pages application using Hono and Prisma.

It will eventually have a very simple, email-OTP authentication flow.

Adding initial users and count via sqlite3:

    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaaa', 'csterritt@gmail.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaab', 'fredfred@team439980.testinator.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaac', 'fredfred2@team439980.testinator.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaad', 'rate-limit-user1@team439980.testinator.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into user (id, email, emailVerified, createdAt, updatedAt) values ('aaaae', 'rate-limit-user2@team439980.testinator.com', true, '2025-04-30T04:53:26.997Z', '2025-04-30T04:53:26.997Z');
    sqlite> insert into count (id, count) values ('foo', 0);

To run in production, set the following environment variables:

    SMTP_SERVER_HOST='<your email hosting provider>'
    SMTP_SERVER_PORT='<numeric port>'
    SMTP_SERVER_USER='<user name for email hosting provider>'
    SMTP_SERVER_PASSWORD='<password for email hosting provider>'

You'll have to create a new D1 database and add the schema from `schema.prisma` there.
