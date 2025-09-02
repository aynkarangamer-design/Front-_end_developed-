// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Attach login event
  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("post-btn").addEventListener("click", addPost);
  document.getElementById("edit-profile-btn").addEventListener("click", openEditProfileModal);
  document.getElementById("save-profile-btn").addEventListener("click", saveProfile);
  document.getElementById("cancel-profile-btn").addEventListener("click", closeEditProfileModal);

  // Check if the user is already logged in
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    showDashboard(savedUser);
  }

  // Load posts if any
  loadPosts();
});

// Login function
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user && pass) {
    localStorage.setItem("user", user); // Save user in localStorage
    showDashboard(user); // Show dashboard after login
  } else {
    alert("Please enter both username and password.");
  }
}

// Show dashboard after successful login
function showDashboard(user) {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("profile-name").innerText = user; // Display logged in username
}

// Logout function
function logout() {
  localStorage.removeItem("user"); // Clear user from localStorage
  document.getElementById("dashboard").style.display = "none"; // Hide dashboard
  document.getElementById("login-page").style.display = "block"; // Show login page
}

// Save posts to LocalStorage
function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Load posts from LocalStorage
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  posts.forEach((post, index) => {
    displayPost(post, index);
  });
}

// Add a new post
function addPost() {
  const content = document.getElementById("post-content").value.trim();
  const imageInput = document.getElementById("post-image");
  const user = localStorage.getItem("user");

  if (!content && !imageInput.files[0]) {
    alert("Please write something or upload an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const newPost = {
      user: user,
      content: content,
      image: e.target.result || null,
      likes: 0,
      comments: []
    };

    posts.push(newPost);
    savePosts(posts);
    displayPost(newPost, posts.length - 1);
    document.getElementById("post-content").value = "";
    document.getElementById("post-image").value = "";
  };

  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reader.onload({ target: { result: null } });
  }
}

// Display post
function displayPost(post, index) {
  const container = document.getElementById("posts-container");
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `
    <p><b>${post.user}</b>: ${post.content}</p>
    ${post.image ? `<img src="${post.image}">` : ""}
    <button onclick="likePost(${index})">👍 Like (${post.likes})</button>
    <button onclick="sharePost(${index})">🔗 Share</button>
    <div class="comment-box">
      <input type="text" id="comment-${index}" placeholder="Add a comment...">
      <button onclick="addComment(${index})">Comment</button>
      <div id="comments-${index}">
        ${post.comments.map(c => `<p>💬 ${c}</p>`).join("")}
      </div>
    </div>
  `;
  container.prepend(div);
}

// Like post
function likePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts"));
  posts[index].likes++;
  savePosts(posts);
  loadPosts();
}

// Add comment to post
function addComment(index) {
  const commentInput = document.getElementById(`comment-${index}`);
  const comment = commentInput.value.trim();
  if (!comment) return;

  const posts = JSON.parse(localStorage.getItem("posts"));
  if (!Array.isArray(posts[index].comments)) posts[index].comments = [];
  posts[index].comments.push(comment);
  savePosts(posts);
  loadPosts();
}

// Share post (dummy alert for now)
function sharePost(index) {
  alert("Post shared!");
}

// Open Edit Profile Modal
function openEditProfileModal() {
  document.getElementById("edit-profile-modal").style.display = "block";
}

// Close Edit Profile Modal
function closeEditProfileModal() {
  document.getElementById("edit-profile-modal").style.display = "none";
}

// Save Profile Changes
function saveProfile() {
  const newUsername = document.getElementById("new-username").value.trim();
  const newBio = document.getElementById("new-bio").value.trim();

  if (newUsername) {
    localStorage.setItem("user", newUsername);
    document.getElementById("profile-name").innerText = newUsername;
    closeEditProfileModal();
  }
  // You can add functionality to save the bio if needed.
}
