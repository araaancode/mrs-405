const request = require("request");

module.exports.sendOtp = async (req, res) => {
    const { phone } = req.body;
    const code = Math.floor(Math.random() * 99999);
    console.log("OTP Code ->", code);

    try {
        request.post(
            {
                url: "http://ippanel.com/api/select",
                body: {
                    op: "pattern",
                    user: "araaancode",
                    pass: "36247602i@Aran",
                    fromNum: "3000505",
                    toNum: phone,
                    patternCode: "v696kiixlx49cpv",
                    inputData: [{ "verification-code": code }],
                },
                json: true,
            },
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
                    console.log(response.body);
                } else {
                    console.log("whatever you want");
                }
            }
        );

        return res.json({ message: "OTP Code sent successfully :))" });
    } catch (err) {
        // Codes 500
    }
};