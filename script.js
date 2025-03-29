document.addEventListener("DOMContentLoaded", () => {
    const reportForm = document.getElementById("reportForm");
    const successMessage = document.getElementById("successMessage");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const reportsContainer = document.getElementById("reportsContainer");

    // Load saved data
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    updateLeaderboard();
    updateReportsDisplay();

    // Report Submission
    reportForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let location = document.getElementById("location").value.trim();
        let description = document.getElementById("description").value.trim();

        if (!location || !description) {
            alert("Please fill in all required fields!");
            return;
        }

        const reportData = { location, description, timestamp: new Date().toLocaleString() };
        reports.push(reportData);
        localStorage.setItem("reports", JSON.stringify(reports));
        updateReportsDisplay();

        successMessage.textContent = "✅ Waste hotspot reported successfully!";
        successMessage.style.display = "block";
        
        setTimeout(() => successMessage.style.display = "none", 3000);

        addLeaderboardEntry(location);
        this.reset();
    });

    function updateReportsDisplay() {
        reportsContainer.innerHTML = reports.length === 0 ? "<p>No reports yet.</p>" : "";
        reports.forEach((report, index) => {
            let div = document.createElement("div");
            div.innerHTML = `<strong>${report.location}</strong>: ${report.description} <br>
                <small>🕒 ${report.timestamp}</small> 
                <button class="delete-report" data-index="${index}">❌</button>`;
            reportsContainer.appendChild(div);
        });

        document.querySelectorAll(".delete-report").forEach(button => {
            button.addEventListener("click", function() {
                let index = this.getAttribute("data-index");
                reports.splice(index, 1);
                localStorage.setItem("reports", JSON.stringify(reports));
                updateReportsDisplay();
            });
        });
    }

    function addLeaderboardEntry(location) {
        leaderboard[location] = (leaderboard[location] || 0) + 1;
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        updateLeaderboard();
    }

    function updateLeaderboard() {
        const leaderboardContainer = document.getElementById("leaderboard");
        leaderboardContainer.innerHTML = "";
        Object.entries(leaderboard).sort((a, b) => b[1] - a[1])
            .forEach(([location, count], index) => {
                let li = document.createElement("li");
                let medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
                li.textContent = `${medal} ${location}: ${count} reports`;
                leaderboardContainer.appendChild(li);
            });
    }

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
});
