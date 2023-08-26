// Select DOM elements
const searchBox = $("#search-box");
const searchButton = $("#search-button");
const modal = $("#modalAlert");
const resultsDiv = $("#results");
const nextButton = $("<button>Next 10</button>");
const prevButton = $("<button>Previous 10</button>");

// Set text for next and previous buttons
nextButton.html("Next 10");
prevButton.html("Previous 10");

// Initialize currentPage variable
let currentPage = 0;

// Event listener for search button click
searchButton.on("click", function() {
  // Display modal if no terms entered
  if (!searchBox.val() || searchBox.val() === "Search for books...") {
    modal.css("display", "block");
    return;
  }
  // Set loading message
  resultsDiv.html(`
    <div id="animationContainer"></div>
    <p class="loading">Fetching Results</p>
  `);

  // Circle sizes
  let circleX, circleY;
  let circleRadius = 5;

  // Create sketch for loading animation
  const mySketch = function(p) {
    // Setup canvas and dims
    p.setup = function() {
      var myCanvas = p.createCanvas(30, 30);
      myCanvas.parent("animationContainer");
      circleX = p.width / 2;
      circleY = p.height / 2;
    };

    // Draw circles
    p.draw = function() {
      p.clear(); // Clears canvas background
      p.strokeWeight(0);
      let angle1 = p.millis() / 1000 * 2; // Set orbit speed
      let angle2 = angle1 + (2 * p.PI) / 5;
      let angle3 = angle1 + 2 * (2 * p.PI) / 5;
      let angle4 = angle1 + 3 * (2 * p.PI) / 5;
      let angle5 = angle1 + 4 * (2 * p.PI) / 5;

      // Orbit navigation
      let x1 = circleX + 8 * p.cos(angle1);
      let y1 = circleY + 8 * p.sin(angle1);
      let x2 = circleX + 8 * p.cos(angle2);
      let y2 = circleY + 8 * p.sin(angle2);
      let x3 = circleX + 8 * p.cos(angle3);
      let y3 = circleY + 8 * p.sin(angle3);
      let x4 = circleX + 8 * p.cos(angle4);
      let y4 = circleY + 8 * p.sin(angle4);
      let x5 = circleX + 8 * p.cos(angle5);
      let y5 = circleY + 8 * p.sin(angle5);

      p.fill(256);
      p.ellipse(x1, y1, circleRadius, circleRadius);
      p.ellipse(x2, y2, circleRadius, circleRadius);
      p.ellipse(x3, y3, circleRadius, circleRadius);
      p.ellipse(x4, y4, circleRadius, circleRadius);
      p.ellipse(x5, y5, circleRadius, circleRadius);
    };
  };

  // Create loading animation instance
  new p5(mySketch, "animationContainer");

  // Retrieve term from searchbox
  const searchTerm = searchBox.val();
  // Create URL for API request
  const url = `https://openlibrary.org/search.json?q=${searchTerm}`;

  // Fetch data from API using jQuery AJAX
  $.ajax({
    url: url,
dataType: "json",
    success: function(data) {
      console.log(data);
      displayResults(data);
    },
    error: function(error) {
      console.error(error);
    }
  });
});

// Initiate search on 'enter'
searchBox.on("keyup", function(event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

// Next button click event using jQuery
nextButton.on("click", function() {
  // Increment current page by 1
  currentPage++;
  // Call displayResults
  displayResults(currentData, currentPage);
  // Scroll to top of results
  resultsDiv[0].scrollIntoView({ behavior: "smooth" });
});

// Previous button click event using jQuery
prevButton.on("click", function() {
  currentPage--; // Decrement current page by 2
  // Call displayResults
  displayResults(currentData, currentPage);
  // Scroll to top of results
  resultsDiv[0].scrollIntoView({ behavior: "smooth" });
});

// Function to display results
function displayResults(data, page = 0) {
  currentData = data; // Set currentData var
  const books = data.docs; // Retrieve books from JSON

  // Clear contents of resultsDiv
  resultsDiv.html("");

  // If no results found, display message
  if (books.length === 0) {
    resultsDiv.html("<p>No Results</p>");
    return;
  }

  // Loop to display books on page
  for (let i = page * 10; i < (page + 1) * 10 && i < books.length; i++) {
    // Retrieve book info
    const book = books[i];
    const title = book.title;
    const author = book.author_name;
    const coverID = book.cover_i; // ID for cover image

    // Create Div for each book info
    const bookDiv = $("<div></div>").html(`
      <img src="http://covers.openlibrary.org/b/id/${coverID}-M.jpg">
      <p style="display: inline-block;">Title: ${title}</p>
      <a href="https://www.worldcat.org/search?q=${title}+${author}" target="_blank" style="float: right;">
        WorldCat <i class="fas fa-external-link-alt"></i>
      </a>
      <p>Author: ${author}</p>
    `);
    bookDiv.addClass("result");
    resultsDiv.append(bookDiv);
  }

  // Div for previous-next buttons
  const buttonDiv = $("<div></div>").css({
    display: "flex",
    justifyContent: "center"
  });

  // Hide previous button on first page
  if (page === 0) {
    prevButton.css("display", "none");
  } else {
    prevButton.css("display", "inline-block");
  }

  // Append prev and next buttons
  buttonDiv.append(prevButton);
  buttonDiv.append(nextButton);
  resultsDiv.append(buttonDiv);
}

// Set default text for search-box
const input = $("#search-box");
// On focus clear box
input.on("focus", function() {
  if (input.val() === "Search for books...") {
    input.val("");
    input.css("color", "black");
  }
});
// On blur use default text
input.on("blur", function() {
  if (input.val() === "") {
    input.val("Search for books...");
    input.css("color", "#909090");
  }
});
// On page load use default text
$(window).on("load", function() {
  input.val("Search for books...");
  input.css("color", "#909090");
});


const close = $(".close");

// Close the modal when close button is clicked
if (close) {
  close.on("click", function() {
    modal.css("display", "none");
  });
}

// Close the modal when anywhere outside the modal is clicked
$(window).on("click", function(event) {
  if (event.target === modal[0]) {
    modal.css("display", "none");
  }
});
