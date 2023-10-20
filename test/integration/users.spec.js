const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let user = {};

describe("test POST /api/v1/users endpoint", () => {
  test("test email belum terdaftar -> sukses", async () => {
    const name = "usertest1";
    const email = "usertest1@mail.com";
    const password = "pasword123";
    const identity_type = "123456789";
    const identity_number = "KTP";
    const address = "Surabaya";

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("identity_type");
    expect(response.body.data).toHaveProperty("identity_number");
    expect(response.body.data).toHaveProperty("address");
    expect(response.body.data.name).toBe(name);
    expect(response.body.data.email).toBe(email);
    expect(response.body.data.identity_type).toBe(identity_type);
    expect(response.body.data.identity_number).toBe(identity_number);
    expect(response.body.data.address).toBe(address);
  });

  test("test email sudah terdaftar -> error", async () => {
    const name = "usertest baru";
    const email = "usertestbaru@mail.com";
    const password = "111111";
    const identity_type = "KTP";
    const identity_number = "123456798";
    const address = "Sidoarjo";

    const response = await request(app).post("/api/v1/users").send({
      name,
      email,
      password,
      identity_type,
      identity_number,
      address,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("email sudah dipakai");
  });
});

describe("test GET /api/v1/users endpoint", () => {
  test("test get all users -> Success", async () => {
    const response = await request(app).get("/api/v1/users");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/users/{id} endpoint", () => {
  test("test cari user dengan id yang terdaftar -> sukses", async () => {
    const response = await request(app).get("/api/v1/users/1"); // Ganti 1 dengan ID yang benar

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
  });

  test("test cari user dengan id yang tidak terdaftar -> error", async () => {
    const response = await request(app).get("/api/v1/users/9999"); // Ganti 9999 dengan ID yang tidak terdaftar

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
  });
});
