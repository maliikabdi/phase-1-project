document.addEventListener('DOMContentLoaded', () => {
    const moviesSection = document.getElementById('movies-section');
    const searchBar = document.getElementById('search-bar');
    const addMovieBtn = document.getElementById('add-movie-btn');
    const genreLinks = document.querySelectorAll('.dropdown-content a');

    let movies = []; // Store movies in a local array
    let editingMovieId = null; // Track the movie being edited

    // Fetch movies from database.json
    function fetchMovies() {
        fetch('http://localhost:3000/movies') // Path to your database.json file
            .then(response => response.json())
            .then(data => {
                movies = data; // Store fetched movies
                renderMovies(movies);
            });
    }

    // Render movies to the DOM
    function renderMovies(moviesToRender) {
        moviesSection.innerHTML = ''; // Clear previous content
        moviesToRender.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster">
                <h4>${movie.title}</h4>
                <p>Year: ${movie.year}</p>
                <p>Genre: ${movie.genre}</p>
                <p class="movie-description">${movie.description}</p>
                <a href="${movie.trailer}" target="_blank">Watch Trailer</a>
                <button class="edit-button" data-id="${movie.id}">Edit</button>
                <button class="delete-button" data-id="${movie.id}">Delete</button>
            `;
            moviesSection.appendChild(movieCard);
        });

        // Attach delete and edit functionality to newly created buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => deleteMovie(button.getAttribute('data-id')));
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => editMovie(button.getAttribute('data-id')));
        });
    }

    // Save a movie (this function handles both adding and updating)
    function saveMovie() {
        const title = document.getElementById('new-movie-title').value;
        const year = document.getElementById('new-movie-year').value;
        const genre = document.getElementById('new-movie-genre').value;
        const trailer = document.getElementById('new-movie-trailer').value;
        const description = document.getElementById('new-movie-description').value;
        const poster = document.getElementById('new-movie-poster').value;

        if (title && year && genre && trailer && description && poster) {
            const movieData = {
                id: editingMovieId !== null ? editingMovieId : Date.now(), // Use the existing id if editing
                title,
                year,
                genre,
                trailer,
                description,
                poster
            };

            if (editingMovieId === null) {
                // Simulate adding the movie to the local array
                movies.push(movieData);
            } else {
                // Update existing movie
                movies = movies.map(movie => (movie.id === editingMovieId ? movieData : movie));
                editingMovieId = null; // Reset editingMovieId after updating
            }

            renderMovies(movies); // Re-render movies after saving

            // Clear input fields
            clearInputFields();
        } else {
            alert('Please fill in all the fields.');
        }
    }

    // Delete a movie from the local array
    function deleteMovie(id) {
        movies = movies.filter(movie => movie.id != id); // Remove the movie from the array
        renderMovies(movies); // Re-render the movies
    }

    // Edit a movie
    function editMovie(id) {
        const movieToEdit = movies.find(movie => movie.id == id);
        if (movieToEdit) {
            document.getElementById('new-movie-title').value = movieToEdit.title;
            document.getElementById('new-movie-year').value = movieToEdit.year;
            document.getElementById('new-movie-genre').value = movieToEdit.genre;
            document.getElementById('new-movie-trailer').value = movieToEdit.trailer;
            document.getElementById('new-movie-description').value = movieToEdit.description;
            document.getElementById('new-movie-poster').value = movieToEdit.poster;

            editingMovieId = movieToEdit.id; // Set the editingMovieId to track the movie being edited

            // Change the button text to "Update" for clarity
            addMovieBtn.textContent = 'Update Movie';
        }
    }

    // Clear input fields
    function clearInputFields() {
        document.getElementById('new-movie-title').value = '';
        document.getElementById('new-movie-year').value = '';
        document.getElementById('new-movie-genre').value = '';
        document.getElementById('new-movie-trailer').value = '';
        document.getElementById('new-movie-description').value = '';
        document.getElementById('new-movie-poster').value = '';
        addMovieBtn.textContent = 'Add Movie'; // Reset button text
    }

    // Search functionality
    searchBar.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(query));
        renderMovies(filteredMovies);
    });

    // Genre filter functionality
    genreLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            const selectedGenre = this.getAttribute('data-genre');
            if (selectedGenre === 'All') {
                renderMovies(movies); // Show all movies
            } else {
                const filteredMovies = movies.filter(movie => movie.genre === selectedGenre);
                renderMovies(filteredMovies); // Show only selected genre
            }
        });
    });

    // Add movie event listener
    addMovieBtn.addEventListener('click', saveMovie);

    // Initial fetch of movies
    fetchMovies();
});
