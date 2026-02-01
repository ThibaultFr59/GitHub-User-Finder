import "./style.css";

/**
 * GITHUB USER FINDER
 * ------------------
 * Main script managing search logic, API calls,
 * and dynamic UI rendering.
 */

// --- DOM ELEMENTS ---
// Caching DOM selectors to avoid repetitive querying
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("text-field");
const mainContainer = document.getElementById("profile-container");

// --- EVENT LISTENERS ---

/**
 * Form submission handler.
 * Prevents page reload and triggers the search flow
 * if the user input is valid.
 */
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = searchInput.value.trim(); // Trimming unnecessary whitespace
  if (username) {
    getUserProfile(username);
  }
});

// --- CONTROLLER LOGIC ---

/**
 * Fetches profile data and latest repositories from the GitHub API.
 * @param {string} username - The GitHub username to search for.
 */
async function getUserProfile(username) {
  try {
    // Fetch user information
    const userUrl = `https://api.github.com/users/${username}`;
    const userResponse = await fetch(userUrl);

    // Explicit handling of 404 errors (User not found)
    if (!userResponse.ok) throw new Error("User not found");

    const userData = await userResponse.json();

    // Fetch repositories (Repos)
    // Parameters: sorted by update date (desc), limited to the last 6
    const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
    const reposResponse = await fetch(reposUrl);
    const reposData = await reposResponse.json();

    // Render the interface if all requests succeed
    renderProfile(userData, reposData);
  } catch (error) {
    // User feedback on error (displaying a visual alert)
    console.error(error);
    mainContainer.innerHTML = `
      <div class="bg-[#161b22] border border-[#30363d] rounded-xl p-10 text-center shadow-lg max-w-lg mx-auto">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#30363d] text-[#8b949e] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-[#f0f6fc] mb-2">User not found</h3>
        <p class="text-[#8b949e] text-base">
            The username you entered doesn't seem to exist on GitHub. <br>Please check the spelling and try again.
        </p>
      </div>`;
  }
}

// --- VIEW / RENDERING LOGIC ---

/**
 * Generates and injects the full profile HTML into the main container.
 * @param {Object} user - JSON object containing profile info.
 * @param {Array} repos - JSON array containing the list of repositories.
 */
function renderProfile(user, repos) {
  // Formatting the join date (e.g., January 6, 2021) for readability
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Building the list of repository cards
  const reposHTML = repos
    .map((repo) => {
      const updatedDate = new Date(repo.updated_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" },
      );

      return `
      <a href="${repo.html_url}" target="_blank" class="bg-[#161b22] p-6 rounded-xl border border-[#30363d] hover:border-[#58a6ff] transition-all group flex flex-col h-full shadow-sm text-left">
        
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-[#58a6ff] font-bold text-xl group-hover:underline truncate pr-2">${repo.name}</h3>
          <span class="text-xs border border-[#30363d] text-[#8b949e] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap">${repo.visibility}</span>
        </div>
        
        <p class="text-[#8b949e] text-base mb-6 line-clamp-2 flex-grow">${repo.description || "No description provided."}</p>
        
        <div class="flex items-center gap-5 text-sm text-[#8b949e] mt-auto">
          ${repo.language ? `<div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-yellow-400"></span>${repo.language}</div>` : ""}
          
          <div class="flex items-center gap-1.5 hover:text-[#58a6ff]">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="fill-current"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
            ${repo.stargazers_count}
          </div>
          
          <div class="flex items-center gap-1.5 hover:text-[#58a6ff]">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" class="fill-current"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
            ${repo.forks_count}
          </div>
          
          <div class="ml-auto whitespace-nowrap text-xs">Updated on ${updatedDate}</div>
        </div>
      </a>
    `;
    })
    .join("");

  // Injection into the main DOM
  // Using a max-w-7xl wrapper for wide display
  mainContainer.innerHTML = `
    <div class="w-full max-w-7xl mx-auto space-y-8">
      
      <div class="bg-[#161b22] rounded-xl overflow-hidden shadow-xl border border-[#30363d]">
        
        <div class="h-32 bg-[#161b22] relative">
            <div class="absolute top-4 right-4">
                <a href="${user.html_url}" target="_blank" class="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all border border-white/20">
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </a>
            </div>
        </div>

        <div class="px-6 pb-6 md:px-10 md:pb-10">
          <div class="flex flex-col md:flex-row gap-8 relative">
              
              <div class="-mt-12 flex-shrink-0">
                  <img src="${user.avatar_url}" alt="${user.login}" class="w-32 h-32 rounded-full border-[4px] border-[#161b22] bg-[#161b22] shadow-sm">
              </div>
              
              <div class="flex-1 mt-3 w-full text-left">
                  
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                      <div>
                          <h2 class="text-4xl font-bold text-[#f0f6fc] tracking-tight">${user.name || user.login}</h2>
                          <p class="text-[#58a6ff] text-xl">@${user.login}</p>
                      </div>
                      <div class="mt-2 md:mt-0 text-[#8b949e] text-sm bg-[#0d1117] px-3 py-1.5 rounded-full border border-[#30363d] shadow-sm">
                          Joined on ${joinedDate}
                      </div>
                  </div>
                  
                  <p class="text-[#c9d1d9] italic leading-relaxed text-lg mb-8 max-w-4xl">${user.bio || "This user has no bio."}</p>
                  
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div class="bg-[#0d1117] p-5 rounded-lg flex flex-col items-center justify-center border border-[#30363d]">
                          <div class="mb-2 text-[#58a6ff]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></div>
                          <span class="text-2xl font-bold text-[#f0f6fc]">${user.public_repos}</span>
                          <span class="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mt-1">Repos</span>
                      </div>

                      <div class="bg-[#0d1117] p-5 rounded-lg flex flex-col items-center justify-center border border-[#30363d]">
                          <div class="mb-2 text-[#3fb950]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg></div>
                          <span class="text-2xl font-bold text-[#f0f6fc]">${user.followers}</span>
                          <span class="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mt-1">Followers</span>
                      </div>

                      <div class="bg-[#0d1117] p-5 rounded-lg flex flex-col items-center justify-center border border-[#30363d]">
                          <div class="mb-2 text-[#a371f7]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg></div>
                          <span class="text-2xl font-bold text-[#f0f6fc]">${user.following}</span>
                          <span class="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mt-1">Following</span>
                      </div>

                      <div class="bg-[#0d1117] p-5 rounded-lg flex flex-col items-center justify-center border border-[#30363d]">
                          <div class="mb-2 text-[#f78166]"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" /></svg></div>
                          <span class="text-lg font-bold text-[#f0f6fc] truncate max-w-full px-1">${user.location || "Earth"}</span>
                          <span class="text-xs uppercase tracking-wider text-[#8b949e] font-semibold mt-1">Location</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <div>
          <h3 class="text-2xl font-bold text-[#f0f6fc] mb-6 flex items-center gap-3">
              <svg aria-hidden="true" height="24" viewBox="0 0 16 16" width="24" class="fill-[#58a6ff]"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1H4.5a1 1 0 0 0-1 0.983L9 2.5Zm1.679 5.5H5.117l3.5 1.342ZM8.75 6.5l-4.75 1.825V2.5A1 1 0 0 1 4.5 1.5h8.25Z"></path></svg>
              Latest Repositories
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              ${reposHTML}
          </div>
          
          <div class="flex justify-center pb-10">
              <a href="${user.html_url}?tab=repositories" target="_blank" class="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg text-base">
                  View all repositories on GitHub
              </a>
          </div>
      </div>

    </div>
  `;
}
