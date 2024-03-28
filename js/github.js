
const message = "Add new file via API";

function generateTitle() {
  const path = generateAndDisplayFilePath(
    document.getElementById("nameInput").innerText
  );
  console.log(path);
  return path;
}

function generateMetadata() {
  const tags = document.getElementById("tags").value;
  const title = document.getElementById("nameInput").value;
  const metadata = `---
title: ${title}
tags: ${tags}
---

`;
  return metadata;
}
function generateContent() {
 
  const content =
    generateMetadata() + document.getElementById("wmd-input-second").value;
  console.log(content);
  return content;
}
function logNonUnicodeCharacters(str) {
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode > 255) {
      console.log(
        `Non-Unicode Character Found: '${str[i]}' (Unicode Code Point: ${charCode})`
      );
    }
  }
}
function sendToGithub() {
  const content = btoa(unescape(encodeURIComponent(generateContent())));
  const token = document.getElementById("token").value;
  const owner = document.getElementById("username").value;
  const repo = owner + ".github.io";
  const requestOptions = {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
      content: content,
      branch: "master", // Replace 'main' with the name of your branch
    }),
  };
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${generateTitle()}`;

  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        console.log("File added successfully.");
      } else {
        console.error("Failed to add file.");
        return response.json().then((data) => console.error(data));
      }
    })
    .catch((error) => console.error("Error adding file:", error));
}
