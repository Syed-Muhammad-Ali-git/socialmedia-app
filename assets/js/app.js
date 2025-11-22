// Initialize app
let currentUser = null;
let posts = [];

// Load data from localStorage on page load
function init() {
  // Check if user is logged in
  const loggedInEmail = localStorage.getItem("loggedInUser");

  if (!loggedInEmail) {
    window.location.href = "./loginform/login.html";
    return;
  }

  // Load user info
  const users = JSON.parse(localStorage.getItem("users")) || [];
  currentUser = users.find((u) => u.email === loggedInEmail);

  if (!currentUser) {
    window.location.href = "./loginform/login.html";
    return;
  }

  // Display user info
  displayUserInfo();

  // Show or hide the remove avatar button
  toggleRemoveAvatarBtn();

  // Load posts from localStorage
  loadPosts();

  // Set up image upload handler
  setupImageUpload();

  // Set up avatar upload handler
  setupAvatarUpload();

  // Setup quick links sidebar toggle button
  setupQuickLinksToggle();

  // Setup remove avatar button click
  setupRemoveAvatarBtn();

  // Close menus when clicking outside
  document.addEventListener("click", function (e) {
    // Close post menus
    if (!e.target.closest(".post-menu-dropdown")) {
      document.querySelectorAll(".post-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
    // Close comment menus
    if (!e.target.closest(".comment-menu-dropdown")) {
      document.querySelectorAll(".comment-menu").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });

  // Toggle Quick Links sidebar visibility on small screens
  function setupQuickLinksToggle() {
    const toggleBtn = document.getElementById("quickLinksToggleBtn");
    const quickLinksSidebar = document.getElementById("quickLinksSidebar");
    if (toggleBtn && quickLinksSidebar) {
      toggleBtn.addEventListener("click", () => {
        if (quickLinksSidebar.classList.contains("d-none")) {
          quickLinksSidebar.classList.remove("d-none");
          quickLinksSidebar.classList.add(
            "d-block",
            "position-fixed",
            "bg-white",
            "shadow",
            "vh-100",
            "overflow-auto"
          );
          quickLinksSidebar.style.top = "56px"; // below navbar
          quickLinksSidebar.style.left = "0";
          quickLinksSidebar.style.zIndex = "1050";
          document.body.style.overflow = "hidden"; // prevent body scroll
        } else {
          quickLinksSidebar.classList.add("d-none");
          quickLinksSidebar.classList.remove(
            "d-block",
            "position-fixed",
            "bg-white",
            "shadow",
            "vh-100",
            "overflow-auto"
          );
          quickLinksSidebar.style.top = "";
          quickLinksSidebar.style.left = "";
          quickLinksSidebar.style.zIndex = "";
          document.body.style.overflow = ""; // restore scroll
        }
      });
    }
  }

  // Show or hide remove avatar button
  function toggleRemoveAvatarBtn() {
    const avatar = localStorage.getItem(`avatar_${currentUser.email}`);
    const removeBtn = document.getElementById("removeAvatarBtn");
    if (removeBtn) {
      removeBtn.style.display = avatar ? "block" : "none";
    }
  }

  // Setup remove avatar button event handler
  function setupRemoveAvatarBtn() {
    const removeBtn = document.getElementById("removeAvatarBtn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        Swal.fire({
          title: "Remove Avatar?",
          text: "Are you sure you want to remove your profile avatar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#344F7E",
          confirmButtonText: "Yes, remove it!",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem(`avatar_${currentUser.email}`);
            displayAvatar();
            toggleRemoveAvatarBtn();
            Swal.fire({
              icon: "success",
              title: "Avatar removed!",
              confirmButtonColor: "#344F7E",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
      });
    }
  }
}

// Display user information
function displayUserInfo() {
  if (currentUser) {
    const fullName = currentUser.firstName + " " + currentUser.lastName;

    const fullNameEl = document.getElementById("userFullName");
    const emailEl = document.getElementById("userEmail");
    const userNameNav = document.getElementById("userNameNav");

    if (fullNameEl) fullNameEl.textContent = fullName;
    if (emailEl) emailEl.textContent = currentUser.email;
    if (userNameNav) userNameNav.textContent = fullName;

    // Display avatar if exists
    displayAvatar();
  }
}

// Display avatar everywhere
function displayAvatar() {
  const avatar = localStorage.getItem(`avatar_${currentUser.email}`);
  if (avatar) {
    // Profile sidebar avatar
    const profileAvatar = document.getElementById("profileAvatar");
    const profileIcon = document.getElementById("profileIcon");
    if (profileAvatar && profileIcon) {
      profileAvatar.src = avatar;
      profileAvatar.style.display = "block";
      profileIcon.style.display = "none";
    }

    // Create post avatar
    const createPostAvatar = document.getElementById("createPostAvatar");
    const createPostIcon = document.getElementById("createPostIcon");
    if (createPostAvatar && createPostIcon) {
      createPostAvatar.src = avatar;
      createPostAvatar.style.display = "block";
      createPostIcon.style.display = "none";
    }
  }
}

// Setup avatar upload
function setupAvatarUpload() {
  const avatarUpload = document.getElementById("avatarUpload");
  if (avatarUpload) {
    avatarUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: "File Too Large",
            text: "Image size should be less than 5MB.",
            confirmButtonColor: "#344F7E",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          localStorage.setItem(`avatar_${currentUser.email}`, e.target.result);
          displayAvatar();
          Swal.fire({
            icon: "success",
            title: "Avatar Updated!",
            text: "Your profile picture has been updated.",
            confirmButtonColor: "#344F7E",
            timer: 1500,
            showConfirmButton: false,
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Setup image upload
function setupImageUpload() {
  const postImageInput = document.getElementById("postImage");
  const imageFileName = document.getElementById("imageFileName");

  if (postImageInput && imageFileName) {
    postImageInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        imageFileName.textContent = file.name;
      } else {
        imageFileName.textContent = "";
      }
    });
  }
}

// Load posts from localStorage and filter posts by current user
function loadPosts() {
  const savedPosts = localStorage.getItem("posts");
  if (savedPosts) {
    const allPosts = JSON.parse(savedPosts);
    posts = allPosts.filter((post) => post.author.email === currentUser.email);
  } else {
    posts = [];
  }
  renderPosts();
}

// Save posts to localStorage
function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Create a new post
function createPost() {
  const postText = document.getElementById("postText");
  const postImageInput = document.getElementById("postImage");
  const imageFileName = document.getElementById("imageFileName");

  const text = postText.value.trim();
  const imageFile = postImageInput.files[0];

  if (!text && !imageFile) {
    Swal.fire({
      icon: "warning",
      title: "Empty Post",
      text: "Please add some text or an image to your post.",
      confirmButtonColor: "#344F7E",
    });
    return;
  }

  const newPost = {
    id: Date.now().toString(),
    author: {
      name: currentUser.firstName + " " + currentUser.lastName,
      email: currentUser.email,
    },
    text: text,
    image: null,
    likes: [],
    comments: [],
    timestamp: new Date().toISOString(),
  };

  // Handle image upload
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      newPost.image = e.target.result;
      posts.unshift(newPost);
      savePosts();
      renderPosts();
      resetPostForm();
    };
    reader.readAsDataURL(imageFile);
  } else {
    posts.unshift(newPost);
    savePosts();
    renderPosts();
    resetPostForm();
  }
}

// Reset post form
function resetPostForm() {
  document.getElementById("postText").value = "";
  document.getElementById("postImage").value = "";
  document.getElementById("imageFileName").textContent = "";
}

// Render all posts
function renderPosts() {
  const container = document.getElementById("postsContainer");

  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="card post-card">
        <div class="card-body empty-state">
          <i class="fas fa-inbox"></i>
          <p>No posts yet. Be the first to share something!</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map((post) => createPostHTML(post)).join("");

  // Attach event listeners
  posts.forEach((post) => {
    attachPostListeners(post.id);
  });
}

// Get avatar for user
function getUserAvatar(email) {
  return localStorage.getItem(`avatar_${email}`) || null;
}

// Create HTML for a single post
function createPostHTML(post) {
  const timeAgo = getTimeAgo(new Date(post.timestamp));
  const isLiked = post.likes.includes(currentUser.email);
  const likesCount = post.likes.length;
  const commentsCount = post.comments.length;
  const isOwner = post.author.email === currentUser.email;
  const authorAvatar = getUserAvatar(post.author.email);

  return `
    <div class="card post-card" data-post-id="${post.id}">
      <div class="post-header">
        <div class="post-author-pic">
          ${
            authorAvatar
              ? `<img src="${authorAvatar}" alt="Avatar" class="post-avatar-img" />`
              : `<i class="fas fa-user"></i>`
          }
        </div>
        <div class="post-author-info">
          <h6 class="post-author-name">${escapeHtml(post.author.name)}</h6>
          <p class="post-time">${timeAgo}</p>
        </div>
        ${
          isOwner
            ? `
        <div class="post-menu-dropdown">
          <button class="post-menu-btn" onclick="togglePostMenu('${post.id}')">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="post-menu" id="post-menu-${post.id}" style="display: none;">
            <button onclick="editPost('${post.id}')">
              <i class="fas fa-edit me-2"></i>Edit
            </button>
            <button onclick="deletePost('${post.id}')">
              <i class="fas fa-trash me-2"></i>Delete
            </button>
          </div>
        </div>
        `
            : ""
        }
      </div>
      <div class="post-content">
        ${post.text ? `<p class="post-text">${escapeHtml(post.text)}</p>` : ""}
        ${
          post.image
            ? `
          <div class="post-image-container">
            <img src="${post.image}" alt="Post image" class="post-image" />
          </div>
        `
            : ""
        }
      </div>
      <div class="post-actions">
        <button class="post-action-btn ${
          isLiked ? "liked" : ""
        }" onclick="toggleLike('${post.id}')">
          <i class="${isLiked ? "fas" : "far"} fa-heart"></i>
          <span>${likesCount}</span>
        </button>
        <button class="post-action-btn" onclick="toggleComments('${post.id}')">
          <i class="fas fa-comment"></i>
          <span>${commentsCount}</span>
        </button>
      </div>
      <div class="comments-section" id="comments-${
        post.id
      }" style="display: none;">
        <div class="comments-list" id="comments-list-${post.id}">
          ${post.comments
            .map((comment) => createCommentHTML(comment, post.id))
            .join("")}
        </div>
        <div class="comment-input-group">
          <input
            type="text"
            class="form-control comment-input"
            id="comment-input-${post.id}"
            placeholder="Write a comment..."
            onkeypress="if(event.key === 'Enter') addComment('${post.id}')"
          />
          <button class="btn comment-btn" onclick="addComment('${post.id}')">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Create HTML for a comment
function createCommentHTML(comment, postId) {
  const isOwner = comment.author.email === currentUser.email;
  const authorAvatar = getUserAvatar(comment.author.email);

  return `
    <div class="comment-item" data-comment-id="${comment.id}">
      <div class="comment-author-pic">
        ${
          authorAvatar
            ? `<img src="${authorAvatar}" alt="Avatar" class="comment-avatar-img" />`
            : `<i class="fas fa-user"></i>`
        }
      </div>
      <div class="comment-content">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h6 class="comment-author-name">${escapeHtml(
              comment.author.name
            )}</h6>
            <p class="comment-text" id="comment-text-${
              comment.id
            }">${escapeHtml(comment.text)}</p>
          </div>
          ${
            isOwner
              ? `
          <div class="comment-menu-dropdown">
            <button class="comment-menu-btn" onclick="toggleCommentMenu('${postId}', '${comment.id}')">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="comment-menu" id="comment-menu-${comment.id}" style="display: none;">
              <button onclick="editComment('${postId}', '${comment.id}')">
                <i class="fas fa-edit me-2"></i>Edit
              </button>
              <button onclick="deleteComment('${postId}', '${comment.id}')">
                <i class="fas fa-trash me-2"></i>Delete
              </button>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

// Attach event listeners to a post
function attachPostListeners(postId) {
  // Listeners are attached via onclick in HTML
}

// Toggle like on a post
function toggleLike(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const index = post.likes.indexOf(currentUser.email);
  if (index > -1) {
    post.likes.splice(index, 1);
  } else {
    post.likes.push(currentUser.email);
  }

  savePosts();
  renderPosts();
}

// Toggle comments section
function toggleComments(postId) {
  const commentsSection = document.getElementById(`comments-${postId}`);
  if (commentsSection) {
    const isVisible = commentsSection.style.display !== "none";
    commentsSection.style.display = isVisible ? "none" : "block";

    // Focus on comment input when opened
    if (!isVisible) {
      setTimeout(() => {
        const commentInput = document.getElementById(`comment-input-${postId}`);
        if (commentInput) commentInput.focus();
      }, 100);
    }
  }
}

// Add a comment to a post
function addComment(postId) {
  const commentInput = document.getElementById(`comment-input-${postId}`);
  if (!commentInput) return;

  const text = commentInput.value.trim();
  if (!text) return;

  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const comment = {
    id: Date.now().toString(),
    author: {
      name: currentUser.firstName + " " + currentUser.lastName,
      email: currentUser.email,
    },
    text: text,
    timestamp: new Date().toISOString(),
  };

  post.comments.push(comment);
  savePosts();
  renderPosts();

  // Keep comments section open
  const commentsSection = document.getElementById(`comments-${postId}`);
  if (commentsSection) {
    commentsSection.style.display = "block";
  }
}

// Get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Toggle post menu
function togglePostMenu(postId) {
  const menu = document.getElementById(`post-menu-${postId}`);
  if (menu) {
    // Close all other menus
    document.querySelectorAll(".post-menu").forEach((m) => {
      if (m.id !== `post-menu-${postId}`) {
        m.style.display = "none";
      }
    });
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
}

// Edit post
function editPost(postId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  Swal.fire({
    title: "Edit Post",
    html: `
      <textarea id="edit-post-text" class="swal2-textarea" placeholder="Edit your post...">${escapeHtml(
        post.text
      )}</textarea>
      <input type="file" id="edit-post-image" accept="image/*" class="swal2-file mt-3" />
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#344F7E",
    preConfirm: () => {
      const text = document.getElementById("edit-post-text").value.trim();
      const imageFile = document.getElementById("edit-post-image").files[0];

      if (!text && !imageFile && !post.image) {
        Swal.showValidationMessage("Please add some text or an image.");
        return false;
      }

      return { text, imageFile };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      post.text = result.value.text;

      if (result.value.imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          post.image = e.target.result;
          savePosts();
          renderPosts();
          Swal.fire({
            icon: "success",
            title: "Post Updated!",
            confirmButtonColor: "#344F7E",
            timer: 1500,
            showConfirmButton: false,
          });
        };
        reader.readAsDataURL(result.value.imageFile);
      } else {
        savePosts();
        renderPosts();
        Swal.fire({
          icon: "success",
          title: "Post Updated!",
          confirmButtonColor: "#344F7E",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  });

  // Close menu
  document.getElementById(`post-menu-${postId}`).style.display = "none";
}

// Delete post
function deletePost(postId) {
  Swal.fire({
    title: "Delete Post?",
    text: "Are you sure you want to delete this post? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#344F7E",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      posts = posts.filter((p) => p.id !== postId);
      savePosts();
      renderPosts();
      Swal.fire({
        icon: "success",
        title: "Post Deleted!",
        confirmButtonColor: "#344F7E",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// Toggle comment menu
function toggleCommentMenu(postId, commentId) {
  const menu = document.getElementById(`comment-menu-${commentId}`);
  if (menu) {
    // Close all other comment menus
    document.querySelectorAll(".comment-menu").forEach((m) => {
      if (m.id !== `comment-menu-${commentId}`) {
        m.style.display = "none";
      }
    });
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  }
}

// Edit comment
function editComment(postId, commentId) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment) return;

  Swal.fire({
    title: "Edit Comment",
    input: "text",
    inputValue: comment.text,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#344F7E",
    inputValidator: (value) => {
      if (!value.trim()) {
        return "Please enter a comment!";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      comment.text = result.value.trim();
      savePosts();
      renderPosts();

      // Keep comments section open
      const commentsSection = document.getElementById(`comments-${postId}`);
      if (commentsSection) {
        commentsSection.style.display = "block";
      }

      Swal.fire({
        icon: "success",
        title: "Comment Updated!",
        confirmButtonColor: "#344F7E",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });

  // Close menu
  document.getElementById(`comment-menu-${commentId}`).style.display = "none";
}

// Delete comment
function deleteComment(postId, commentId) {
  Swal.fire({
    title: "Delete Comment?",
    text: "Are you sure you want to delete this comment?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#344F7E",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.comments = post.comments.filter((c) => c.id !== commentId);
        savePosts();
        renderPosts();

        // Keep comments section open
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (commentsSection) {
          commentsSection.style.display = "block";
        }

        Swal.fire({
          icon: "success",
          title: "Comment Deleted!",
          confirmButtonColor: "#344F7E",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  });
}

// Logout function
function logout() {
  Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#344F7E",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, logout!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "./loginform/login.html";
    }
  });
}

// Initialize app when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
