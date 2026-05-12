export const buildCV = (data) => {
  return {
    name: data.name || "No Name",
    bio: data.bio || "",
    avatar: data.avatar_url || "",
    location: data.location || null,
    company: data.company || null,
    repos: data.public_repos || 0,
    followers: data.followers || 0,
    following: data.following || 0,
  };
};