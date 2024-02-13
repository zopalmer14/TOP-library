
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
        this.flipRead = () => this.have_read = (this.have_read) ? false : true; 
    }

    // function to add a new book to the library
    const addBook = function addBook(title, author, num_pages, have_read) {
        new_book = new Book(title, author, num_pages, have_read);
        myLibrary.push(new_book);
    };

    // function to remove a book from the library
    const removeBook = function removeBook(index) {
        myLibrary.splice(index, 1);
    }

    // function to toggle the read value of a book
    const toggleRead = function toggleRead(index) {
        myLibrary[index].flipRead();
    }

    return { getBooks, removeBook, addBook, toggleRead }
}();

// DOM MANIPULATION

const DOMController = function DOMController() {
    const displayBooks = function displayBooks(books) {
        // grab the container that holds all the books
        const grid_container = document.querySelector('#grid-container');

        // remove all children in case of re-render
        grid_container.replaceChildren();

        // iterate over the books and create a visual representation of each
        for (let i = 0; i < books.length; i++) {
            const book = books[i];

            // create a horizontal flex-container to hold the book's info
            const book_container = document.createElement('div');
            book_container.classList.add('book-container');
            book_container.id = i;
            grid_container.appendChild(book_container);
    
            // create tiles to display each property of the books
            for (prop in book) {
                let elem_type = 'button';
                let tile_info = '';
                let tile_color = 'white';
                switch(prop) {
                    case 'flipRead':
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
    
                // add an eventListener to the 'read' button to toggle the value
                if (prop === 'have_read') {
                    setupReadButton(tile);
                }
    
                // add an eventListener to the 'remove' button to remove the book
                if (prop === 'flipRead') {
                    setupRemoveButton(tile);
                } 
            }
        }
    };

    return { displayBooks }
}();

// eventListeners & CONTROL FLOW 

// function that makes the 'read' button dynamic / interactable
function setupReadButton(button) {
    button.addEventListener('click', (event) => {
        // toggle the read value of the selected book
        const index = event.target.parentNode.id;
        libraryManager.toggleRead(index);

        // also adjust the styling appropriately
        // grab the current values
        currentColor = event.target.style.backgroundColor;
        currentText = event.target.textContent;
    
        // swap the color and text of the 'read' button
        event.target.style.backgroundColor = currentColor === 'red' ? 'green' : 'red';
        event.target.textContent = currentText === 'already read' ? 'have not read' : 'already read';
    });
}

// function that makes the 'remove' button dynamic / interactable
function setupRemoveButton(button) {
    button.addEventListener('click', (event) => {
        // remove the book from the library
        const index = event.target.parentNode.id;
        libraryManager.removeBook(index);
        
        // now we must re-render the library (reorder the indices - DOM to backend link)
        DOMController.displayBooks(libraryManager.getBooks());
    });
}

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
    libraryManager.addBook(event.target.title.value, event.target.author.value, event.target.pages.value, event.target.read.value);

    // now we must re-render the library (reorder the indices - DOM to backend link)
    DOMController.displayBooks(libraryManager.getBooks());
});

// debug / run script

libraryManager.addBook('The Hobbit', 'J.R.R. Tolkien', 295, false);
libraryManager.addBook('The Way of Kings', 'Brandon Sanderson', 1093, true);
libraryManager.addBook('The Telling', 'Ursula K. Le Guin', 263, true);
libraryManager.addBook('Reaper Man', 'Terry Pratchett', 453, false);

DOMController.displayBooks(libraryManager.getBooks());