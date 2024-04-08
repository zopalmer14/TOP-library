
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
        
        this.displayProp = (prop) => {
            switch(prop) {
                case 'title':
                    return this[prop];
                case 'author':
                    return `By: ${this[prop]}`;
                case 'num_pages':
                    return `Pages: ${this[prop]}`;
                case 'have_read':
                    return 'Read';
                case 'flipRead':
                    return 'Remove';
            }
        };
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

        // grab the sort input and determine the variable to sort by 
        const sort_input = document.querySelector('#sort-variable');
        const sort_variable = sort_input.value;
        console.log("sort input: " + sort_input);
        console.log("sort variable: " + sort_variable);

        // grab the sort DESC input  
        const sort_descending = document.querySelector('#sort-descending');
        const sort_desc = sort_descending.checked;

        // SORTING FUNCTIONS

        // function to sort the books by title
        const sortByTitle = function sortByTitle(bookA, bookB) {
            if (bookA.title < bookB.title) {
                return -1;
            } else if (bookA.title > bookB.title) {
                return 1;
            } else {
                return 0;
            }
        };

        // function to sort the books by author
        const sortByAuthor = function sortByAuthor(bookA, bookB) {
            if (bookA.author < bookB.author) {
                return -1;
            } else if (bookA.author > bookB.author) {
                return 1;
            } else {
                return 0;
            }
        };

        // function to sort the books by the number of pages
        const sortByPageNum = function sortByPageNum(bookA, bookB) {
            if (bookA.num_pages < bookB.num_pages) {
                return -1;
            } else if (bookA.num_pages > bookB.num_pages) {
                return 1;
            } else {
                return 0;
            }
        };

        // function to sort the books by read status
        const sortByReadStatus = function sortByReadStatus(bookA, bookB) {
            if (bookB.have_read && !bookA.have_read) {
                return 1;
            } else if (bookA.have_read && !bookB.have_read) {
                return -1;
            } else {
                return 0;
            }
        };

        // sort the books accordingly based on the value of sort_variable 
        switch(sort_variable) {
            case 'title': 
                books.sort(sortByTitle);
                break;
            case 'author': 
                books.sort(sortByAuthor);
                break;
            case 'pages': 
                books.sort(sortByPageNum);
                break;
            case 'read': 
                books.sort(sortByReadStatus);
        }

        // reverse the book order if the DESC option is true (checked)
        if (sort_desc) {
            books.reverse();
        }

        // iterate over the books and create a visual representation of each
        for (let i = 0; i < books.length; i++) {
            const book = books[i];

            // create a flex-container to hold the book's info
            const book_container = document.createElement('div');
            book_container.classList.add('book-container');
            book_container.dataset.index = i;
    
            // create elements to display each property of the books
            for (prop in book) {
                // if it's 'displayProp' -- the last property -- THEN SKIP
                if (prop === 'displayProp') {
                    continue;
                } 

                // create a div/button and add the appropriate text content based on the property -- unless it's 'have_read'
                if (prop !== 'have_read') {
                    // create a new element to represent the property
                    const elem_type = prop === 'flipRead' ? 'button' : 'div';
                    const tile = document.createElement(elem_type);

                    // if it's 'flipRead', add the eventListener that handles removing the book
                    if (prop === 'flipRead') {
                        libraryInterface.setupRemoveButton(tile);
                    } 

                    // add the property info and append to the book container
                    tile.textContent = book.displayProp(prop);
                    book_container.appendChild(tile);
                } else { // otherwise
                    // if it's 'have_read' - create a label that acts as a container for a checkbox within it
                    const read_label = document.createElement('label');
                    read_label.classList.add('read-label');
                    read_label.textContent = book.displayProp(prop);

                    // add the eventListener that handles toggling the 'read' value in the backend
                    libraryInterface.setupReadCheckbox(read_label);

                    // create the checkbox
                    const read_checkbox = document.createElement('input');
                    read_checkbox.classList.add('read-input');
                    read_checkbox.type = 'checkbox';

                    // check the checkbox if the 'have_read' value is true
                    read_checkbox.checked = book[prop] ? true : false;

                    // append the checkbox to the label, then the label to the book_container
                    read_label.appendChild(read_checkbox);
                    book_container.appendChild(read_label);
                }
            }

            // append the book_container to the library grid
            grid_container.appendChild(book_container);
        }
    };

    return { displayBooks }
}();

// eventListeners & CONTROL FLOW

const libraryInterface = function libraryInterface() {
    // initialize and make the library dynamic / responsive
    const initializeLibrary = function initializeLibrary() {
        DOMController.displayBooks(libraryManager.getBooks());
        styleSelectDropDown();
        setupBookAddition();
        setupBookSorting();
    };

    function styleSelectDropDown() {
        // DOM references 
        const select_input = document.querySelector('select');
        const select_container = document.querySelector('.select-wrapper');
    
        // toggle the styling when the select input is clicked
        select_input.addEventListener('click', () => {
            select_input.classList.toggle('showing');
            console.log('select input is clicked');
        })
    
        // if the user clicks outside the select input, remove the styling
        window.addEventListener("click", (e) => {
            if (!select_container.contains(e.target)) {
                select_input.classList.remove("showing");
                console.log('outside of select container is clicked');
            }
        });
    }

    // function that sets up the add book functionality
    function setupBookAddition() {
        // DOM references
        const add_book_button = document.querySelector('#add-book-button');
        const dialog = document.querySelector("dialog");
        const add_book_form = document.querySelector('#book-form');

        // setup the add_book dialog / form 
        add_book_button.addEventListener('click', () => {
            dialog.showModal();
        });

        // setup the form processing / handling FORM PROCESSING / HANDLING
        add_book_form.addEventListener('submit', (event) => {
            // add the book to the library 
            libraryManager.addBook (
                event.target.title.value, 
                event.target.author.value, 
                event.target.pages.value, 
                event.target.read.checked
            );

            // reset the form inputs
            add_book_form.reset(); 

            // now we must re-render the library 
            DOMController.displayBooks(libraryManager.getBooks());
        });
    }

    // function that re-renders books when the sorting options is changed / toggled
    function setupBookSorting() {
        // DOM references
        const sort_variable = document.querySelector('#sort-variable');
        const sort_descending = document.querySelector('#sort-descending');

        // if the sort variable is changed we must re-render the library
        sort_variable.addEventListener('change', () => {
            DOMController.displayBooks(libraryManager.getBooks());
        });

        // if the sort DESC option is changed we must re-render the library
        sort_descending.addEventListener('change', () => {
            DOMController.displayBooks(libraryManager.getBooks());
        });
    }

    // function that makes the 'read' checkbox dynamic / interactable
    const setupReadCheckbox = function setupReadCheckbox(checkbox) {
        checkbox.addEventListener('change', (event) => {
            // toggle the read value of the selected book -- one level up the DOM tree
            const index = event.currentTarget.parentNode.dataset.index;
            libraryManager.toggleRead(index);
        });
    };

    // function that makes the 'remove' button dynamic / interactable
    const setupRemoveButton = function setupRemoveButton(button) {
        button.addEventListener('click', (event) => {
            // remove the book -- one level up the DOM tree -- from the library
            const index = event.target.parentNode.dataset.index;
            libraryManager.removeBook(index);
            
            // now we must re-render the library
            DOMController.displayBooks(libraryManager.getBooks());
        });
    };

    return { initializeLibrary, setupReadCheckbox, setupRemoveButton }
}();


// debug / run script

libraryManager.addBook (
    'The Hobbit',
    'J.R.R. Tolkien', 
    295, 
    false
);

libraryManager.addBook (
    'The Way of Kings', 
    'Brandon Sanderson', 
    1093, 
    true
);

libraryManager.addBook (
    'The Telling', 
    'Ursula K. Le Guin', 
    263, 
    true
);

libraryManager.addBook (
    'Reaper Man', 
    'Terry Pratchett', 
    453, 
    false
);

libraryInterface.initializeLibrary();