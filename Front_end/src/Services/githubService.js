

const BASE = "https://api.github.com";

const ghFetch = async (url) => {
  const res = await fetch(url);
  if (res.status === 404) throw new Error("GitHub user not found. Check the username.");
  if (res.status === 403) {
    const reset = res.headers.get("X-RateLimit-Reset");
    const resetTime = reset
      ? new Date(reset * 1000).toLocaleTimeString()
      : "a few minutes";
    throw new Error(
      `GitHub API rate limit reached (60 req/hr for unauthenticated users). Resets at ${resetTime}. Please wait and try again.`
    );
  }
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
};

const ghFetchSafe = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
};

// ── paginated repo fetch ────────────────────────────────────────
const fetchAllRepos = async (username) => {
  let page = 1, all = [];
  while (true) {
    const res = await fetch(`${BASE}/users/${username}/repos?per_page=100&page=${page}&sort=pushed`);
    if (!res.ok) break;
    const data = await res.json();
    if (!data.length) break;
    all = [...all, ...data];
    if (data.length < 100) break;
    page++;
  }
  return all;
};

// ── decode + strip markdown from README ────────────────────────
const fetchReadme = async (username, repoName) => {
  try {
    const res = await fetch(`${BASE}/repos/${username}/${repoName}/readme`);
    if (!res.ok) return null;
    const data = await res.json();
    const decoded = atob(data.content.replace(/\n/g, ""));
    return decoded
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/[-*+]\s/g, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 500);
  } catch { return null; }
};

// ── aggregate languages across up to 30 non-fork repos ─────────
const fetchLanguages = async (username, repos) => {
  const langMap = {};
  const targets = repos.filter((r) => !r.fork).slice(0, 30);
  await Promise.all(targets.map(async (repo) => {
    const data = await ghFetchSafe(`${BASE}/repos/${username}/${repo.name}/languages`);
    if (data) Object.entries(data).forEach(([lang, bytes]) => {
      langMap[lang] = (langMap[lang] || 0) + bytes;
    });
  }));
  return langMap;
};

// ── organizations ───────────────────────────────────────────────
const fetchOrgs = async (username) => {
  const data = await ghFetchSafe(`${BASE}/users/${username}/orgs`);
  return (data || []).map((o) => ({
    login: o.login, avatar: o.avatar_url,
    description: o.description, url: `https://github.com/${o.login}`,
  }));
};

// ── recent public events → contribution counts ─────────────────
const fetchContributions = async (username) => {
  const data = await ghFetchSafe(`${BASE}/users/${username}/events/public?per_page=100`);
  if (!data) return { commits: 0, prs: 0, issues: 0, reviews: 0 };
  let commits = 0, prs = 0, issues = 0, reviews = 0;
  data.forEach((e) => {
    if (e.type === "PushEvent") commits += e.payload?.commits?.length || 0;
    if (e.type === "PullRequestEvent") prs++;
    if (e.type === "IssuesEvent") issues++;
    if (e.type === "PullRequestReviewEvent") reviews++;
  });
  return { commits, prs, issues, reviews };
};

// ── MASTER FETCH ────────────────────────────────────────────────
export const fetchAllGitHubData = async (username) => {
  const profile = await ghFetch(`${BASE}/users/${username}`);
  const repos   = await fetchAllRepos(username);

  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6);

  const allReposSorted = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  const [languages, orgs, contributions] = await Promise.all([
    fetchLanguages(username, repos),
    fetchOrgs(username),
    fetchContributions(username),
  ]);

  // READMEs for top 3 repos
  const readmes = {};
  await Promise.all(topRepos.slice(0, 3).map(async (repo) => {
    const readme = await fetchReadme(username, repo.name);
    if (readme) readmes[repo.name] = readme;
  }));

  // infer topics / skills
  const topicSet = new Set();
  repos.forEach((r) => (r.topics || []).forEach((t) => topicSet.add(t)));

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const mostUsedLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    login: profile.login,        name: profile.name,
    bio: profile.bio,            avatar_url: profile.avatar_url,
    html_url: profile.html_url,  location: profile.location,
    company: profile.company,    blog: profile.blog,
    email: profile.email,        twitter: profile.twitter_username,
    hireable: profile.hireable,  created_at: profile.created_at,
    public_repos: profile.public_repos,
    followers: profile.followers, following: profile.following,
    totalStars, totalForks, mostUsedLang,
    repos: allReposSorted,
    topRepos,
    languages,
    orgs,
    contributions,
    readmes,
    topics: [...topicSet].slice(0, 20),
  };
};