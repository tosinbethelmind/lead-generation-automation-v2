// ============================================================================
// GitHub Commit Helper Module
// ============================================================================

export interface CommitFileParams {
  owner: string;
  repo: string;
  filePath: string;
  content: string;
  commitMessage: string;
  token: string;
  branch?: string;
}

export async function commitFileToGitHub({
  owner,
  repo,
  filePath,
  content,
  commitMessage,
  token,
  branch = 'main'
}: CommitFileParams) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  
  // 1. Try to fetch existing file to get its SHA (required for updating files on Git)
  let sha: string | undefined;
  try {
    const checkResp = await fetch(`${url}?ref=${branch}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (checkResp.ok) {
      const fileData = await checkResp.json();
      sha = fileData.sha;
    }
  } catch (err) {
    console.warn('Checking file existence on GitHub failed or file is new:', err);
  }

  // 2. Commit the file contents
  const base64Content = Buffer.from(content).toString('base64');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    message: commitMessage,
    content: base64Content,
    branch,
  };
  if (sha) {
    body.sha = sha;
  }

  const putResp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!putResp.ok) {
    const errData = await putResp.json();
    throw new Error(`GitHub Commit error: ${errData.message || putResp.statusText}`);
  }

  return await putResp.json();
}
