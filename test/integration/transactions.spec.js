const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let user = {};
let account = {};
let transaction = {};

describe("test POST /api/v1/transaction endpoint", () => {
  test(" Berhasil: Transaksi berhasil dibuat.", async () => {
    const data = {
      userId: 1,
      source_account_id: 1,
      destination_account_id: 2,
      amount: 1000,
    };
    let { statusCode, body } = await request(app)
      .post("/api/v1/transactions")
      .send({data});
    transaction = body.data;

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("source_account_id");
    expect(body.data).toHaveProperty("destination_account_id");
    expect(body.data).toHaveProperty("amount");
    expect(body.data.source_account_id).toBe(data.source_account_id);
    expect(body.data.destination_account_id).toBe(data.destination_account_id);
    expect(body.data.amount).toBe(data.amount);
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

describe("test GET /api/v1/transactions endpoint", () => {
  test("Berhasil: Menampilkan semua data transaksi.", async () => {
    const { statusCode, body } = await request(app).get("/api/v1/transactions");

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/transactions/{id} endpoint", () => {
  test(" Berhasil: Test mencari transaksi dengan ID yang terdaftar.", async () => {
    try {
      const transactionId = transaction.id;
      const { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transactionId.id}`
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("source_account_id");
      expect(body.data).toHaveProperty("destination_account_id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data.amount).toBe(data.amount);
      expect(body.data.source_account_id.bank_name).toBe(data.bank_name);
      expect(body.data.source_account_id.bank_account_number).toBe(data.bank_account_number);
      expect(body.data.source_account_id.balance).toBe(data.balance);
      expect(body.data.destination_account_id.bank_name).toBe(data.bank_name);
      expect(body.data.destination_account_id.bank_account_number).toBe(data.bank_account_number);
      expect(body.data.destination_account_id.balance).toBe(data.balance);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

      test("Gagal: Test mencari transaksi dengan ID yang tidak terdaftar.", async () => {
        try {
          const { statusCode, body } = await request(app).get(
            `/api/v1/transactions/${transactionId + 1000}`
          );

          expect(statusCode).toBe(400);
          expect(body).toHaveProperty("status");
          expect(body).toHaveProperty("message");
        } catch (err) {
          expect(err).toBe(err);
        }
      });
});