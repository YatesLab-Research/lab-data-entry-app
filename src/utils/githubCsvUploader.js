import { Base64 } from 'js-base64';

const token = import.meta.env.VITE_GITHUB_TOKEN;
const repo = import.meta.env.VITE_GITHUB_REPO;
const branch = import.meta.env.VITE_GITHUB_BRANCH;
const filePath = import.meta.env.VITE_CSV_PATH;

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github.v3+json',
};

export async function pushEntryToGitHub(newEntryObj) {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  try {
    // Step 1: Get existing file content and SHA
    const res = await fetch(`${url}?ref=${branch}`, { headers });
    const json = await res.json();

    let csv = Base64.decode(json.content);
    const sha = json.sha;

    // Step 2: Append new row
    const newRow = Object.values(newEntryObj).join(',') + '\n';
    const updatedCsv = csv + newRow;

    // Step 3: Push update
    const commitBody = {
      message: `Add new lab entry - ${new Date().toISOString()}`,
      content: Base64.encode(updatedCsv),
      sha,
      branch,
    };

    const pushRes = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitBody),
    });

    if (!pushRes.ok) {
      throw new Error(`GitHub update failed: ${pushRes.status}`);
    }

    const pushJson = await pushRes.json();
    console.log('✅ Entry committed to GitHub:', pushJson.content.path);
    return true;
  } catch (err) {
    console.error('❌ Failed to push entry to GitHub:', err);
    return false;
  }
}
