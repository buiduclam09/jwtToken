/*
    Code by Teamkoder
*/

const header = {
    alg: "RS256",
    typ: "JWT"
}

const now = new Date().getTime() / 1000;
const oneHour = 60 * 60;
const expireTime = now + oneHour;

const claimSet = {
    iss: "android-deploy@pc-api-7032877599319263962-537.iam.gserviceaccount.com",
    iat: now,
    exp: expireTime,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token"
}

function toBase64URL(json) {
    const jsonString = JSON.stringify(json);
    const btyeArray = Buffer.from(jsonString);
    return btyeArray.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

const encodedHeader = toBase64URL(header);
const encodedClaimSet = toBase64URL(claimSet);

const crypto = require("crypto");
const signer = crypto.createSign("RSA-SHA256");

signer.write(encodedHeader + "." + encodedClaimSet);
signer.end();

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMVoGVZadKz8fu\nHPuYy1pMVy/Hc7rQrKyyhoDsW1cV/J3lDVPWIBXcaoMg89TK8b3oFDDO8E1gTitQ\nsKrvaRW2ztXYXCu/5dnry2YYg4UTQ0cfikKPDyJUGGLHHSn3hGA7kZfmlt7HYVMN\nOEIZ5KxpkXhjQzDzQ2A3eDwXigkjNsZegmX1jiqdUHojq178GK7K2zOygE6Um2wC\nNUDf1HCgpHPT9EswO3k7HVvCW23Ik4IbQcF9P1O90Jg/+mn69SwPO7vq97Ws5OSK\nSlyouCGtq6Ja5M4/PCflqggK8f8SbpiDIcLaJcL1KFgx97XpHMEBh930+uhJK4Ex\nl2x0SBAdAgMBAAECggEAHK+uTHtzY3DNGBQQjDBMMnhw+Da6jM4ZBo0Ub1oZXThU\nMFJRKTfi6ck4NHmWr5EFgJ3JBlw8+J6wvQi4Tpj5l+rsoY27BJsvn0c0Q4+/MGeb\nBgYCdxQAVT8BKwPgnuOCIQq9AP3AM8xpfOsfeIQeYkmuVX0a06PrT449HW7e/obT\nOYkLSjygiqk9H22ZOhyh9TWdGAqDvaKl0FirRpWY6kCkQM4zIbqJUcSBmMeA3A5a\n2RCOUYkGCMHxtbEguIUlAA6eASVZlZ9c3yW96K70VRP3uqEWILRV/h3WIKhF0xHN\nzahgnmWPHnpANTcUwdCkm6Kx8WccVgt72e6GAplN0QKBgQDyfqqKeIHARMdk1jW9\nw7JLMXDSV5kyPdRrmLrI1/98Mvbel7yO+hypFk9aWpnctYiKQ5LzreDTzYdKDnV5\nfHrYsFDtrw1Xa1C66j7ifbWyiXMSJKaRBwOqpqQEi8oG2+yCte6S/NoInj11drdm\nHUJ876uqIIvyXof8zWqIr08ZCQKBgQDXt9Lv8hS6KqGMCg/tN5/xN4NGXGb8Duxp\nxRruBw5pnaVjcdK0tvUWuevkkjMg+z8ykYotF77I5pcP54KslYU0WsvAbPz59pfO\nyqQfC2sjOKLGbOVN/V9pC/97ZJmwan6qkRR2AKfpBzQoEjyZD7ES4dAG6xE2hVkv\nywS6AFdndQKBgQDehnYhU6xdr7/6PMhcN3Upo1kQ7OncPPjtM95T6EK+ylXYtg2G\nduZOE/cFxxZifwOpPZFgpDMoqfZ4cwRCU4S3zDS3qGfpzMTsgYDrfsh56b/66j8f\n3vvyYbEpqs3dtXs4B5PCtt2uAugLHsH1puwYkidJm0xRQYYw6p/UhmtjYQKBgAi9\nMrdzyDEujvLcaX7DtSARjqjoD2gAtsUmLgwcjxHqSAv6TX3yt4UfLRZKcfXRF+NV\nkBJ5lsoOxWnoiBuzxvyy/PQjti/uNII1JWb4kHOR1M5TFQsOy7G2wbffAHbsKYuB\nayHIrwS6vPsumfPddd/88++D0GO0DUPpZpyebOwNAoGBAID30qCiniLPXVrFO+Ez\nuVPSZ8d5s9K9nZ9u3SiuclCqwzHVdixF1Dlh8+ShPqOQwUqR/KR12mPnVu5nTXIt\nzDzpc1l0p57OsYRECeykERRvpXai0jk3Uk/mRyS9OZLeL82fObjBQ38FugMZqoyD\ncCusm5BbuzhpUqFR6fWgE9Fl\n-----END PRIVATE KEY-----\n";
const signature = signer.sign(privateKey, "base64");
const encodedSignature = signature.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const jwt = `${encodedHeader}.${encodedClaimSet}.${encodedSignature}`;
console.log(jwt);


const https = require("https");

function getOAuthToken(jwt) {
    return new Promise(
        (resolve, reject) => {
            // request option
            var option = {
                hostname: "oauth2.googleapis.com",
                path: `/token?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
                method: 'POST',
                port: 443,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            var req = https.request(option, (res) => {
                var result = '';
                res.on('data', function (chunk) {
                    result += chunk;
                });
                res.on('end', () => {
                    resolve(result);
                });
            });

            req.on('error', function (err) {
                reject(err);
            });

            req.end();
            
        }
    );
}

async function test(){
    let result = await getOAuthToken(jwt).catch(err => { console.log(err)});
    let json = JSON.parse(result);
    console.log(json);
}


test();

