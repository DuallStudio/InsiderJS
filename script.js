// Loading Screen
document.addEventListener("DOMContentLoaded", function () {
  gsap.set(".loader", { display: "flex" });

  let loaderCounter = {
    value: 0,
  };

  let loaderDuration = 3;

  if (sessionStorage.getItem("visited") !== null) {
    loaderDuration = 1;
    loaderCounter = {
      value: 75,
    };
  }

  sessionStorage.setItem("visited", "true");

  function updateLoaderText() {
    let progress = Math.round(loaderCounter.value);
    $(".loader-number").text(progress);
  }

  function endLoaderAnimation() {
    gsap.to(".loader", {
      duration: 1,
      ease: "power3.inOut",
      y: "-100vh",
    });

    gsap.to(".loader-wrapper", {
      duration: 1,
      ease: "power3.inOut",
      y: "-100vh",
      delay: 0.5,
    });
  }

  let tl = gsap.timeline({ onComplete: endLoaderAnimation });
  tl.to(loaderCounter, {
    onUpdate: updateLoaderText,
    value: 100,
    ease: "power3.inOut",
    duration: loaderDuration,
  });
});

// Page Transition
gsap.to(".transition", {
  duration: 1,
  ease: "power3.inOut",
  y: "-100vh",
  onComplete: () => {
    gsap.set(".transition", { display: "none" });
  },
});

$(document).ready(function () {
  $("a").on("click", function (e) {
    if (
      $(this).prop("hostname") === window.location.host &&
      $(this).attr("href").indexOf("#") === -1 &&
      $(this).attr("target") !== "_blank"
    ) {
      e.preventDefault();
      let destination = $(this).attr("href");
      gsap.set(".transition", { display: "flex" });
      gsap.fromTo(
        ".transition",
        { y: "-100vh" },
        {
          duration: 1,
          ease: "power3.inOut",
          y: "0%",
          onComplete: () => {
            window.location = destination;
          },
        }
      );
    }
  });
});


// Wait for Webflow to load the page before running the script
Webflow.push(function () {
  // Check if the viewport width is 991px or greater
  if (window.innerWidth >= 991) {
    // Select all elements that have the custom attribute 'data-animate="hover-text"'
    const animatedElements = document.querySelectorAll(
      '[data-animate="hover-text"]'
    );

    // Loop through each element to apply SplitType and GSAP animations
    animatedElements.forEach((element) => {
      const splitText = new SplitType(element, { types: "chars" });

      // Hover event listener for each element
      element.addEventListener("mouseenter", () => {
        // Set all characters to opacity: 0 initially before animating them
        gsap.set(splitText.chars, { opacity: 0 });

        // Animate the opacity to 1 in staggered, random order
        gsap.to(splitText.chars, {
          opacity: 1,
          stagger: {
            amount: 0.5,
            from: "random",
          },
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });
  }
});

/* Form checkboxed fill */

$(".checkbox").on("click", function () {
  $(this).closest(".checkbox-field").toggleClass("checked");
});
$(".checkbox").on("click", function () {
  $(this).siblings(".checkbox-label").toggleClass("checked");
});

/* Allows page scroll and form scroll */
$(".form-modal").on("mousewheel DOMMouseScroll", function (e) {
  e.stopPropagation();
});

// Open form
$(".open-form").on("click", function () {
  $(".form-modal").addClass("active");
});

// Close form and reset all fields, including checkboxes, radio buttons, and custom classes
$(".close-form").on("click", function () {
  $(".form-modal").removeClass("active");

  // Reset all form fields within the modal
  const form = $(".form-modal form")[0];
  form.reset();

  // Explicitly reset all checkboxes and radio buttons
  $(form)
    .find("input[type='checkbox'], input[type='radio']")
    .prop("checked", false);

  // Remove custom '.checked' classes from checkboxes and radio buttons
  $(form).find(".checkbox-field, .checkbox-label").removeClass("checked");
});

// Close the form when clicking outside the banner (on the backdrop)
$(".form-modal").on("click", function (e) {
  if (!$(e.target).closest(".form-menu, .close-form").length) {
    $(".close-form").trigger("click");
  }
});

/* Email Window Form */

document.addEventListener("DOMContentLoaded", function () {
  // Select the email field by ID
  const emailField = document.querySelector("#emailTo");

  // Check if the email field exists
  if (emailField) {
    // Set the fixed email value
    const fixedEmail = "info@insidermadeira.com";

    // Set the email field value
    emailField.value = fixedEmail;

    // Make the field read-only
    emailField.setAttribute("readonly", true);
  }
});

// Open Email Window Form
$(".open-email").on("click", function () {
  $(".email-modal").addClass("active");
});

$(".email-background, .red").on("click", function () {
  $(".email-modal").removeClass("active");
});

/* Insider Tips Highlights */

document.addEventListener("DOMContentLoaded", function () {
  const blogCards = document.querySelectorAll(".highlights-item"); // All blog post cards
  const tipContents = document.querySelectorAll(".tip-content"); // All tips from the hidden list
  let tipCounter = 0; // To track which tip to insert

  let insertPosition = 2; // Every 5 blog posts we will insert a tip

  // Loop through all blog post cards with a while loop
  for (let i = 0; i < blogCards.length; i++) {
    // Check if we're at the correct position to insert a tip
    if (i === insertPosition - 1 && tipCounter < tipContents.length) {
      const tip = tipContents[tipCounter].cloneNode(true); // Clone the next tip from the hidden tips

      const tipPlaceholder = document.createElement("div"); // Create a new div for the tip
      tipPlaceholder.classList.add("tip-placeholder"); // Add a class to style the tip if needed
      tipPlaceholder.style.display = "block"; // Make sure it's visible
      tipPlaceholder.appendChild(tip); // Insert the tip content into the new div

      blogCards[i].parentNode.insertBefore(tipPlaceholder, blogCards[i + 1]); // Insert the tip before the next blog post

      tipCounter++; // Move to the next tip
      insertPosition += 2; // Set the next position for the next tip insertion
    }
  }
});

/* Arrow icon fix
   Every circular icon button (.btn-icon-wrapper — navbar and hero/page
   buttons alike) holds Lottie arrows (.white-arrow / .black-arrow) that
   cross-fade depending on the background. Two problems show up, especially at
   larger resolutions:
     1. By default the arrows sit stacked in normal flow, so the second arrow
        duplicates below the circle. Stacking both in the same grid cell keeps
        them centered on top of each other — only the opacity changes.
     2. The Lottie SVG itself is not constrained to the arrow-icon box, so it
        renders oversized and pokes out the top-right of the circle. Clamping
        the SVG to 100% of the (14px) box and clipping wrapper overflow keeps
        the arrow inside the circle, centered, no matter how the circle scales. */
(function fixArrowIcons() {
  const style = document.createElement("style");
  style.textContent = `
    .btn-icon-wrapper {
      display: grid !important;
      place-items: center !important;
      overflow: hidden;
    }
    /* Fill the circle's padded box relative to the circle itself (which is
       sized in rem and scales up on wide viewports) instead of a fixed px,
       so the arrow stays centered and proportional at any resolution. */
    .btn-icon-wrapper .arrow-icon {
      grid-area: 1 / 1 !important;
      width: 100% !important;
      height: 100% !important;
      display: grid !important;
      place-items: center !important;
    }
    /* Keep the Lottie SVG inside the box, scaling with it while preserving
       the arrow's aspect ratio (no stretching on non-square buttons). */
    .btn-icon-wrapper .arrow-icon svg {
      width: auto !important;
      height: 100% !important;
      max-width: 100% !important;
      display: block !important;
    }
    /* Keep the black arrow on top so it stays visible on light/white circles.
       On dark backgrounds the cross-fade sets the black arrow to opacity 0,
       so the white arrow underneath still shows through. */
    .btn-icon-wrapper .black-arrow { z-index: 2 !important; }
    .btn-icon-wrapper .white-arrow { z-index: 1 !important; }

    /* Only the home page runs the GSAP nav timeline that fades the circle
       from white (black arrow) at the top to dark (white arrow) on scroll —
       leave that alone. On every other page the members circle is permanently
       dark, so force the white arrow there. The 'nav-dark-icon' class is added
       to <html> below for non-home pages. */
    html.nav-dark-icon .button-icon.menu .arrow-icon.black-arrow {
      opacity: 0 !important;
      visibility: hidden !important;
    }
    html.nav-dark-icon .button-icon.menu .arrow-icon.white-arrow {
      opacity: 1 !important;
      visibility: visible !important;
    }
  `;
  document.head.appendChild(style);

  // Flag non-home pages so the CSS above can force the white arrow on their
  // permanently-dark members circle. Home ("/", "/pt/home", etc.) is left to
  // the page's own GSAP scroll animation.
  const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
  const homePaths = ["/", "/index.html", "/pt", "/pt/home", "/pt/index.html"];
  if (homePaths.indexOf(path) === -1) {
    document.documentElement.classList.add("nav-dark-icon");
  }
})();

// Open Login
// $(".open-login").on("click", function () {
//   $(".login-modal").addClass("active");
// });

// $(".close-login").on("click", function () {
//   $(".login-modal").removeClass("active");
// });

// Password Validation
// document.addEventListener("DOMContentLoaded", function () {
//   const submitPasswordBtn = document.getElementById("submit-password");
//   const passwordInput = document.getElementById("password-input");
//   const errorMessage = document.querySelector(".login-error-message");

//   // Define the correct password
//   const correctPassword = "inmadeira2026"; // Replace this with your actual password
//   const membersPageURL = "/members"; // Replace with your members-only page URL

//   // Function to check the password and redirect if correct
//   function checkPassword() {
//     const enteredPassword = passwordInput.value;

//     if (enteredPassword === correctPassword) {
//       // Password is correct, redirect to the members-only page
//       window.location.href = membersPageURL;
//     } else {
//       // Password is incorrect, show an alert
//       alert("Incorrect password. Please try again."); // Display the alert message
//     }
//   }
//   // Event listener for the submit button (div)
//   submitPasswordBtn.addEventListener("click", checkPassword);

//   // Prevent the form submission and handle 'Enter' key press
//   passwordInput.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent the default form submission behavior
//       checkPassword(); // Call the checkPassword function when 'Enter' is pressed
//     }
//   });
// });
