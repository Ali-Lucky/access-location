const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/route.js");
const maxmind = require('maxmind-db-reader');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.use('/', route);

async function getCountryFromIP(ipAddress) {
    try {
        const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
        const data = response.data;
        console.log(data.country);
        return data.country;
    } catch (error) {
        console.error('Error retrieving country information:', error);
        return null;
    }
}

var requestIP = require('request-ip');

app.get('/t',function(request, response) {

    var clientIp = requestIP.getClientIp(request);
    return response.send(clientIp)
    console.log(clientIp);

});

app.get('/test', async (req, res) => {
    try {
        const ip = req.ip; // Get the IP address from the request

        // Use the IPinfo API to get geolocation and ISP information
        const ipinfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);

        if (ipinfoResponse.status === 200) {
            const data = ipinfoResponse.data;

            const response = {
                ip: ip,
                country: data.country || 'Unknown',
                service_provider: data.org || 'Unknown',
                network: data.hostname || 'Unknown',
            };

            return res.json(response);
        } else {
            return res.status(500).json({ error: 'Unable to fetch data' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/test', async (req, res) => {
    const userIpAddress = req.ip; // Get the user's IP address from the request
    console.log(userIpAddress);

    // Get the country based on the IP address
    const country = await getCountryFromIP(userIpAddress);

    if (country) {
        return res.json({ message: 'Hello', country });
    } else {
        return res.json({ message: 'Hii' });
    }
});

app.use((req, res) => {
    return res.status(404).send({ status: false, message: "Incorrect URL! Please enter valid URL" });
});

mongoose.connect("mongodb+srv://luckybigwings:738xp7MiKEIJWrz8@cluster0.kbmybtj.mongodb.net/testing", { useNewUrlParser: true })
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`App running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });


//   const otpGen = require("otp-generator")
// let otp = otpGen.generate(6, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets:
//      false, specialChars: false })

// var sid = "AC36ee19bb91d56a14be03a162175beda3";
// var auth_token = "67c17e708cbb2d90692b6b9076abd093";
// var twilio = require("twilio")(sid, auth_token);

// twilio.messages
//     .create({
//         from: "+15595408159",
//         to: "+917007124083",
//         body: `this is testing otp is ${otp}`,
//     })
//     .then(function (res) { console.log("message has sent!") })
//     .catch(function (err) {
//         console.log(err);
//     });
