// lib/smsService.js
import https from "https";

const TOKEN = "2783a430de89451a8499166485b11b68";

export function sendSharedSMS({ to, bodyId, args }) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            bodyId: bodyId,
            to: to,
            args: args,
        });

        const options = {
            hostname: "console.melipayamak.com",
            port: 443,
            path: `/api/send/shared/${TOKEN}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
            },
        };

        const req = https.request(options, (res) => {
            let responseData = "";
            res.on("data", (d) => (responseData += d));
            res.on("end", () => {
                try {
                    const result = JSON.parse(responseData);

                    if (result.recId && result.recId > 0) {
                        return resolve({
                            success: true,
                            recId: result.recId,
                            phone: to,
                        });
                    }

                    return resolve({
                        success: false,
                        error: result.status || "SMS send failed",
                        raw: result,
                    });
                } catch (err) {
                    resolve({ success: false, error: err.message, raw: responseData });
                }
            });
        });

        req.on("error", (err) =>
            resolve({ success: false, error: err.message })
        );

        req.write(data);
        req.end();
    });
}