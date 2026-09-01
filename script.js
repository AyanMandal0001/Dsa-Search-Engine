const form = document.getElementById("search-form");
const input = document.getElementById("query-input");
const resultsDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");

// Dynamic URL setup: detects if you are running locally or on the live web
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const backendUrl = isLocal ? 'http://localhost:3000' : 'https://dsa-search-engine-bnf6.onrender.com'; // <-- PASTE YOUR LINK HERE

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "";
  spinner.classList.remove("hidden");

  try {
    // Fetch now uses the dynamic backendUrl variable
    const res = await fetch(`${backendUrl}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const { results } = await res.json();

    spinner.classList.add("hidden");

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No matches found.</p>";
      return;
    }

    resultsDiv.innerHTML = results
      .map((r, i) => {
        return `
            <div class="card${i === 0 ? " featured" : ""}">
                <div class="card-header">
                    <img src="assets/logos/${r.platform.toLowerCase()}.png"
                        alt="${r.platform} logo"
                        class="platform-logo"/>
                    <a href="${r.url}" target="_blank" class="card-title">
                    [${r.platform}] ${r.title}
                    </a>
                </div>
            </div>
        `;
      })
      .join("");
  } catch (err) {
    spinner.classList.add("hidden");
    console.error(err);
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});