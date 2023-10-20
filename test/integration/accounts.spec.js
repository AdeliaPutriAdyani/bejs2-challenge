const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let user = {};
let account = {};

describe("test POST /api/v1/accounts endpoint", () => {
  test("Berhasil: test userId sudah terdaftar", async () => {
    const data = {
      userId: 1,
      bank_name: "Bank BTN",
      bank_account_number: "123456789",
      balance: 350000,
    };
    const response = await request(app).post("/api/v1/accounts").send(data);

    account = response.body.data;

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("userId");
    expect(response.body.data).toHaveProperty("bank_name");
    expect(response.body.data).toHaveProperty("bank_account_number");
    expect(response.body.data).toHaveProperty("balance");
    expect(response.body.data.userId).toBe(data.userId);
    expect(response.body.data.bank_name).toBe(data.bank_name);
    expect(response.body.data.bank_account_number).toBe(data.bank_account_number);
    expect(response.body.data.balance).toBe(data.balance);
  });

  test("Error: test userId belum terdaftar ", async () => {
    const data = {
      userId: 0,
      bank_name: "Bank BTN",
      bank_account_number: "123456789",
      balance: 350000,
    };
    const response = await request(app).post("/api/v1/accounts").send(data);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
  });
});

describe("test GET /api/v1/accounts endpoint", () => {
  test("berhasil : menampilkan semua data", async () => {
    const { statusCode, body } = await request(app).get("/api/v1/accounts");

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/accounts/{id} endpoint", () => {
  test(" berhasil : test cari account dengan id yang terdaftar", async () => {
    try {
      const accountId = account.id;
      const { statusCode, body } = await request(app).get(
        `/api/v1/users/${accountId}`
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("userId");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data.userId).toBe(data.userId);
      expect(body.data.bank_name).toBe(data.bank_name);
      expect(body.data.bank_account_number).toBe(data.bank_account_number);
      expect(body.data.balance).toBe(data.balance);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

    test("failed : test cari account dengan id yang tidak terdaftar", async () => {
      try {
        const { statusCode, body } = await request(app).get(
          `/api/v1/accounts/${account.id + 1000}`
        );

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
      } catch (err) {
        expect(err).toBe(err);
      }
    });
});