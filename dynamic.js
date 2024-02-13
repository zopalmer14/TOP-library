
// LIBRARY FUNCTIONS

const libraryManager = function libraryManager() {
    // represent the library as an array of Book objects
    const myLibrary = [];

    // getter for the library
    const getBooks = () => myLibrary;

    // constructor for our Book objects
    function Book(title, author, num_pages, have_read) {
        this.title = title;
        this.author = author;
        this.num_pages = num_pages;
        this.have_read = have_read;
        this.info = function() {
            return `${title} by ${author}, ${num_pages} pages, ${have_read ? 'already read' : 'not read yet'}`;
        }
    }

    // function to add a new book to the library
    const addBookToLibrary = function addBookToLibrary(title, author, num_pages, have_read) {
        new_book = new Book(title, author, num_pages, have_read);
        myLibrary.push(new_book);
    };

    return { getBooks, addBookToLibrary }
}();

// DOM MANIPULATION

const DOMController = function DOMController() {
    // function to handle the event of the user clicking the read status
    function toggleRead(target) {
        currentColor = target.style.backgroundColor;
        currentText = target.textContent;
    
        // swap the color and text of the read? button when clicked
        target.style.backgroundColor = currentColor === 'red' ? 'green' : 'red';
        target.textContent = currentText === 'already read' ? 'have not read' : 'already read';
    };

    const displayBooks = function displayBooks(books) {
        // container that holds all the books
        const grid_container = document.querySelector('#grid-container');

        books.forEach((book) => {
            // create a horizontal flex-container to hold the books info
            const book_container = document.createElement('div');
            book_container.classList.add('book-container');
            grid_container.appendChild(book_container);
    
            // create tiles to display each property of the books
            for (prop in book) {
                let elem_type = 'button';
                let tile_info = '';
                let tile_color = 'white';
                switch(prop) {
                    case 'info':
                        tile_info = 'Remove';
                        tile_color = 'lightgray';
                        break;
                    case 'have_read':
                        tile_info = book[prop] ? 'already read' : 'not read yet'
                        tile_color = book[prop] ? 'green' : 'red';
                        break;
                    default:
                        elem_type = 'div';
                        tile_info = book[prop];
                }
    
                // create a tile, assign the css styling, and add the property value
                const tile = document.createElement(elem_type);
                tile.classList.add('book-tile'); 
                tile.style.backgroundColor = tile_color;
                tile.textContent = tile_info;
                book_container.appendChild(tile);
    
                // add an eventListener to the read? button to toggle the value
                if (prop === 'have_read') {
                    tile.addEventListener('click', (e) => {
                        toggleRead(e.target);
                    });
                }
    
                // add an eventListener to the remove? button to remove the book
                if (prop === 'info') {
                    tile.addEventListener('click', (e) => {
                        // remove the book from the library
                        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                    });
                } 
            }
        });
    };

    return { displayBooks }
}();

// eventListeners & CONTROL FLOW 

// useful DOM references
const add_button = document.querySelector('#add-button');
const dialog = document.querySelector("dialog");
const add_book_form = document.querySelector('[name="book-form"]');

// setup the add_book dialog / form 
add_button.addEventListener('click', () => {
    dialog.showModal();
});

// setup the form processing / handling FORM PROCESSING / HANDLING
add_book_form.addEventListener('submit', (event) => {
    // add the book to the library 
    libraryManager.addBookToLibrary(event.target.title.value, event.target.author.value, event.target.pages.value, event.target.read.value);
});

// debug / run script

libraryManager.addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, false);
libraryManager.addBookToLibrary('The Way of Kings', 'Brandon Sanderson', 1093, true);
libraryManager.addBookToLibrary('The Telling', 'Ursula K. Le Guin', 263, true);
libraryManager.addBookToLibrary('Reaper Man', 'Terry Pratchett', 453, false);

DOMController.displayBooks(libraryManager.getBooks());