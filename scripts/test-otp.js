// scripts/test-otp.js
const https = require("https");

const TOKEN = "2783a430de89451a8499166485b11b68";
const BODY_ID = 448907;
const PHONE = "09383901146";
const CODE = "123456";

const body = {
    bodyId: BODY_ID,
    to: PHONE,
    args: [CODE],
};

const data = JSON.stringify(body);
const buffer = Buffer.from(data, "utf8");

const options = {
    hostname: "console.melipayamak.com",
    port: 443,
    path: `/api/send/shared/${TOKEN}`,
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": buffer.length,
    },
};

const req = https.request(options, (res) => {
    let responseData = "";
    res.setEncoding("utf8");
    res.on("data", (d) => (responseData += d));
    res.on("end", () => {
        console.log("Status Code:", res.statusCode);
        console.log("Response:", responseData);
    });
});

req.on("error", (e) => console.error("Error:", e.message));
req.write(buffer);
req.end();