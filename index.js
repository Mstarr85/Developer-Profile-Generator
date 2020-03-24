const util = require("util");
const fs = require("fs");
const inquirer = require("inquirer");
const axios = require("axios");
const puppeteer = require("puppeteer");
const generateHTML = require("./generateHTML");
const writeFileAsync = util.promisify(fs.writeFile);


let userBio = "";
let img = "";
let location = "";
let gitProfile = "";
let userBlog = "";
let color = "";
let repoNum = 0;
let followers = 0;
let following = 0;
let starNum = 0;

function init() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the username of the Github profile you would like to see.",
                name: "username"
            },
            {
                type: "input",
                message: "Pick a color: green,red,pink or blue.",
                name: "color"
            }
        ])
        .then(function ({ username, color }) {
            const config = { headers: { accept: "application/json" } };
                let queryUrl = ` https://api.github.com/users/${username}`;
                    return axios.get(queryUrl, config).then(userData => {
                        let newUrl = `https://api.github.com/users/${username}/starred`;


                axios.get(newUrl, config).then(starredRepos => {
                    data = {
                        img: userData.data.avatar_url,
                        location: userData.data.location,
                        gitProfile: userData.data.html_url,
                        userBlog: userData.data.blog,
                        userBio: userData.data.bio,
                        repoNum: userData.data.public_repos,
                        followers: userData.data.followers,
                        following: userData.data.following,
                        starNum: starredRepos.data.length,
                        username: username,
                        name: userData.data.name,
                        color: color
                    };
                    generateHTML(data);
                    writeHTML(generateHTML(data));
                    makePdf(username);
                });
            });
        });
}

const writeHTML = function (generateHTML) {
    writeFileAsync("index.html", generateHTML);
}

init();

async function makePdf(username) {

    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //    In the await page.goto string change the path of the index.html to the path on your local machine

        await page.goto("file:///Users/matthew/Desktop/Developer-Profile-Generator/index.html");
             await page.emulateMedia("screen");
                await page.pdf({
                    path: `${username}.pdf`,
                    format: "A4",
                    printBackground: true,
                    landscape: true
        });

        console.log("Success!!! PDF Generated!");
            await browser.close();
    }           catch (error) {
                    console.log("Error" + error);
    }
}