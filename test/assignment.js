import supertest from "supertest";
const request = supertest("https://gorest.co.in/public-api/");

import { expect } from "chai";
const mysql = require("mysql2");

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "kasundb",
});

mysqlConnection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log(`error: ${JSON.stringify(err, null, 4)}`);
    console.log("Connection Failed");
  }
});

//insert a record
describe("DB testing", () => {
  it("Inserting a product name", () => {
    let products = { product_name: "kasuntestten" };
    let query = "INSERT INTO products SET ?";
    return mysqlConnection
      .promise()
      .query(query, products)
      .then((result) => {
        expect(result).to.not.be.null;
      })
      .catch((err) => {
        expect(err).to.be.null;
      });
  });
  it("Checking regression", () => {
    let query = "SELECT * FROM products WHERE product_name REGEXP '[0-9]'";
    return mysqlConnection
      .promise()
      .query(query)
      .catch(console.log)
      .then(([rows, fields]) => {
        expect(rows.length).equal(0);
      });
  });
});

describe("Users", () => {
  const TOKEN =
    "4e5a7688d35bd35d3a1748336915f162a78fd8ce2b39bcf74f07f3fe78c11feb";
  it("Status health check", () => {
    return request.get(`users?access-token=${TOKEN}`).then((res) => {
      expect(res.status).equal(200);
    });
  });

  it("Verify not empty", () => {
    return request.get(`users?access-token=${TOKEN}`).then((res) => {
      expect(res.body.data).to.not.be.empty;
    });
  });

  it("GET /users with query params", () => {
    const url = `users?access-token=${TOKEN}&page=5&gender=Female&status=Active`;

    return request.get(url).then((res) => {
      expect(res.body.data).to.not.be.empty;
      res.body.data.forEach((data) => {
        expect(data.gender).to.eq("Female");
        expect(data.status).to.eq("Active");
      });
    });
  });
});
