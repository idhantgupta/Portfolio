const themeButton = document.getElementById("themeToggle");
const projectSearch = document.getElementById("projectSearch");
const technologyFilter = document.getElementById("technologyFilter");
const projectCards = Array.from(document.querySelectorAll(".projects > li"));
const projectResults = document.getElementById("projectResults");
const noProjects = document.getElementById("noProjects");
const navigationLinks = Array.from(document.querySelectorAll(".site-nav a"));
const pageSections = Array.from(document.querySelectorAll("main > section"));

// Theme Toggle Handler
if (themeButton) {
  themeButton.addEventListener("click", function () {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    themeButton.setAttribute("aria-pressed", String(isDarkMode));

    const labelSpan = themeButton.querySelector(".theme-label");
    const labelText = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    if (labelSpan) {
      labelSpan.textContent = labelText;
    } else {
      themeButton.textContent = labelText;
    }
  });
}

// Project Search & Technology Filtering
function filterProjects() {
  if (!projectSearch || !technologyFilter) return;

  const searchTerm = projectSearch.value.trim().toLowerCase();
  const selectedTechnology = technologyFilter.value;
  let visibleProjects = 0;

  projectCards.forEach(function (project) {
    const searchableText = `${project.textContent} ${project.dataset.tags || ""}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm);
    const tags = (project.dataset.tags || "").split(" ").filter(Boolean);
    const matchesTechnology = !selectedTechnology || tags.includes(selectedTechnology);
    const isVisible = matchesSearch && matchesTechnology;

    project.hidden = !isVisible;
    if (isVisible) {
      visibleProjects += 1;
    }
  });

  if (projectResults) {
    projectResults.textContent = `${visibleProjects} ${visibleProjects === 1 ? "project" : "projects"} found`;
  }
  if (noProjects) {
    noProjects.hidden = visibleProjects > 0;
  }
}

if (projectSearch) {
  projectSearch.addEventListener("input", filterProjects);
}
if (technologyFilter) {
  technologyFilter.addEventListener("change", filterProjects);
}
filterProjects();

// Intersection Observer for Section Reveal
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("has-reveal");

  pageSections.forEach(function (section) {
    section.classList.add("reveal");
  });

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );

  pageSections.forEach(function (section) {
    sectionObserver.observe(section);
  });
}

// Scrollspy for Active Navigation Highlight
function updateActiveNavigation() {
  const navElement = document.querySelector(".site-nav");
  if (!navElement || pageSections.length === 0) return;

  const activationPoint = navElement.offsetHeight + 32;
  let currentSection = pageSections[0];

  const isAtPageBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

  if (isAtPageBottom) {
    currentSection = pageSections[pageSections.length - 1];
  } else {
    pageSections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= activationPoint) {
        currentSection = section;
      }
    });
  }

  navigationLinks.forEach(function (link) {
    const isCurrentSection = link.hash === `#${currentSection.id}`;
    link.classList.toggle("is-active", isCurrentSection);

    if (isCurrentSection) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
window.addEventListener("resize", updateActiveNavigation);
updateActiveNavigation();

// Chatbot Suggestion Chips Integration
const suggestionChips = document.querySelectorAll(".suggestion-chip");
const chatInputElement = document.getElementById("userInput");

if (suggestionChips.length > 0 && chatInputElement) {
  suggestionChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const promptText = chip.getAttribute("data-prompt");
      if (promptText) {
        chatInputElement.value = promptText;
        chatInputElement.focus();
      }
    });
  });
}

// Copy Email Helper with Tooltip Feedback
const copyEmailBtn = document.getElementById("copyEmailBtn");
const emailLink = document.getElementById("emailLink");

if (copyEmailBtn && emailLink) {
  copyEmailBtn.addEventListener("click", function () {
    const email = emailLink.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () {
        const tooltip = copyEmailBtn.querySelector(".copy-tooltip");
        if (tooltip) {
          const originalText = tooltip.textContent;
          tooltip.textContent = "Copied!";
          setTimeout(function () {
            tooltip.textContent = originalText;
          }, 2000);
        }
      }).catch(function (err) {
        console.error("Could not copy email: ", err);
      });
    }
  });
}
