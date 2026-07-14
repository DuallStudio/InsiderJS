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
   Each circular icon button (.btn-icon-wrapper) holds two Lottie arrows:
   .white-arrow and .black-arrow. Webflow natively hides the black one
   (.arrow-icon.black-arrow { display:none }), so interior pages show the
   white arrow on their dark circle with no help from us. The HOME page runs
   its own GSAP nav timeline that sets BOTH arrows to display:block and
   cross-fades them (white circle+black arrow at top -> dark circle+white
   arrow on scroll).

   The only thing we need to fix is the layout: when both arrows are visible
   (home), they sit side-by-side in normal flow and push each other off
   centre, and the Lottie SVG can overflow the circle at large resolutions.
   Stacking both arrows in a single centred grid cell and clamping the SVG to
   the padded box solves both — WITHOUT touching `display`, so Webflow's
   native black-arrow hiding keeps working on interior pages. */
(function fixArrowIcons() {
  const style = document.createElement("style");
  style.textContent = `
    .btn-icon-wrapper {
      display: grid !important;
      place-items: center !important;
      overflow: hidden !important;
    }
    /* Both arrows share one grid cell so they overlap, centred, instead of
       taking separate space. The display property is intentionally left
       alone so Webflow's native black-arrow hiding keeps working. */
    .btn-icon-wrapper .arrow-icon {
      grid-area: 1 / 1 !important;
      width: 100% !important;
      height: 100% !important;
    }
    /* Fill the box symmetrically and scale with the circle (which is sized in
       rem and grows on wide viewports); the Lottie SVG's preserveAspectRatio
       keeps the arrow shape and centres it. */
    .btn-icon-wrapper .arrow-icon svg {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }

    /* Members nav button (.btn-icon-wrapper.nav): draw a static arrow as a real
       grid item so it inherits the wrapper's place-items:center and is always
       dead-centre, instead of depending on Webflow/Lottie layer visibility.
       JS below keeps the arrow dark on the white circle and white after the
       GSAP nav timeline turns the circle dark. */
    .btn-icon-wrapper.nav {
      isolation: isolate !important;
      --nav-arrow-color: #201f1d;
    }
    .btn-icon-wrapper.nav .arrow-icon {
      opacity: 0 !important;
      visibility: hidden !important;
    }
    /* The glyph shares the single grid cell with the (hidden) arrows and is
       centred by the wrapper's place-items:center. aspect-ratio:1 forces it
       square so the mask never distorts or drifts on a non-square wrapper. */
    .btn-icon-wrapper.nav .nav-arrow-glyph {
      grid-area: 1 / 1 !important;
      align-self: center !important;
      justify-self: center !important;
      width: 78% !important;
      height: auto !important;
      aspect-ratio: 1 / 1 !important;
      z-index: 1 !important;
      pointer-events: none !important;
      background-color: var(--nav-arrow-color) !important;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5.5 18.5 18.5 5.5M8.5 5.5H18.5V15.5'/%3E%3C/svg%3E") center / contain no-repeat;
              mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5.5 18.5 18.5 5.5M8.5 5.5H18.5V15.5'/%3E%3C/svg%3E") center / contain no-repeat;
    }

    /* Latest Insights slider controls: keep prev/next on the left and push the
       "View all" button to the far right. */
    .slider-btn-wrap { align-items: center !important; }
    .slider-btn-wrap .button-icon { margin-left: auto !important; }

    /* Latest Insights cards: make every card fill its slide (desktop base CSS
       pins a fixed 27.8125em width) so they're all the same size. */
    .swiper.blog .swiper-slide { height: auto !important; }
    .swiper.blog .blog-section-item { width: 100% !important; height: 100% !important; }
  `;
  document.head.appendChild(style);

  // Add the centred arrow glyph as a real grid item inside each nav wrapper.
  document.querySelectorAll(".btn-icon-wrapper.nav").forEach((wrapper) => {
    if (!wrapper.querySelector(".nav-arrow-glyph")) {
      const glyph = document.createElement("span");
      glyph.className = "nav-arrow-glyph";
      wrapper.appendChild(glyph);
    }
  });

  function syncNavArrowColor() {
    document.querySelectorAll(".btn-icon-wrapper.nav").forEach((wrapper) => {
      const bg = getComputedStyle(wrapper).backgroundColor;
      const channels = bg.match(/\d+(\.\d+)?/g);

      if (!channels || channels.length < 3) return;

      const [r, g, b] = channels.map(Number);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      wrapper.style.setProperty(
        "--nav-arrow-color",
        brightness > 150 ? "#201f1d" : "#ffffff"
      );
    });
  }

  window.addEventListener("load", syncNavArrowColor);
  window.addEventListener("scroll", syncNavArrowColor, { passive: true });
  window.addEventListener("resize", syncNavArrowColor);
  requestAnimationFrame(syncNavArrowColor);
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
