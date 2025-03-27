document.addEventListener("DOMContentLoaded", () => {
    // Form submission handler
    const reportForm = document.getElementById("reportForm");
    const successMessage = document.getElementById("successMessage");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const reportsContainer = document.getElementById("reportsContainer");
    
    // Load leaderboard and reports from localStorage
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    updateLeaderboard();
    updateReportsDisplay();
    
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
        successMessage.classList.add("fade-in");
        
        setTimeout(() => {
            successMessage.classList.remove("fade-in");
            successMessage.classList.add("fade-out");
            setTimeout(() => { successMessage.style.display = "none"; successMessage.classList.remove("fade-out"); }, 500);
        }, 3000);
        
        addLeaderboardEntry(location);
        this.reset();
    });
    
    function updateReportsDisplay() {
        reportsContainer.innerHTML = "";
        if (reports.length === 0) {
            reportsContainer.innerHTML = "<p>No reports yet.</p>";
            return;
        }
        
        reports.forEach((report, index) => {
            let div = document.createElement("div");
            div.classList.add("report-entry");
            div.innerHTML = `
                <strong>${report.location}</strong>: ${report.description} <br>
                <small>🕒 ${report.timestamp}</small>
                <button class="delete-report" data-index="${index}">❌</button>
            `;
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
        
        const sortedEntries = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);
        sortedEntries.forEach(([location, count], index) => {
            let li = document.createElement("li");
            let medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
            li.textContent = `${medal} ${location}: ${count} reports`;
            li.classList.add("leaderboard-entry");
            leaderboardContainer.appendChild(li);
        });
    }
    
    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });
    
    // Load Dark Mode State
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }
});
