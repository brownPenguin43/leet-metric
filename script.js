document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
    const aboutLink = document.getElementById("about-link");

    // landing page fade out
    const landingPage = document.getElementById("landing-page");

    setTimeout(() => {
        landingPage.style.display = "none";
    }, 4000);
    // landing page fade out ends here


    // aboutLink.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
    // });//you can remove this , no use here.
    

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }

            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);

            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function animateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        let currentProgress = 0;
        const increment = progressDegree / 60;

        const animationInterval = setInterval(() => {
            if (currentProgress >= progressDegree) {
                clearInterval(animationInterval);
            } else {
                currentProgress += increment;
                circle.style.setProperty("--progress-degree", `${currentProgress}%`);
            }
        }, 16);
        if(label===easyLabel)
        label.innerHTML = `<span style="color:#1CBABA;font-weight:bold;">${solved}</span><span style="font-size:1.5rem;">/</span>${total}`;
        if(label===mediumLabel)
        label.innerHTML = `<span style="color:#FFB700;font-weight:bold;">${solved}</span><span style="font-size:1.5rem;">/</span>${total}`;
        if(label===hardLabel)
        label.innerHTML = `<span style="color:#F63737;font-weight:bold;">${solved}</span><span style="font-size:1.5rem;">/</span>${total}`;
    }

    function displayUserData(parsedData) {
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;

        const solvedTotalEasyQues = parsedData.easySolved;
        const solvedTotalMediumQues = parsedData.mediumSolved;
        const solvedTotalHardQues = parsedData.hardSolved;

        animateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        animateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        animateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            { label: "Total Questions", value: parsedData.totalSolved },
            { label: "Total Easy Solved", value: solvedTotalEasyQues },
            { label: "Total Medium Solved", value: solvedTotalMediumQues },
            { label: "Total Hard Solved", value: solvedTotalHardQues },
        ];

        cardStatsContainer.innerHTML = cardsData
            .map(
                (data, index) =>
                    `<div class="card fade-in" style="animation-delay: ${index * 0.2}s">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                    </div>`
            )
            .join("");
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Logging username: ", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
