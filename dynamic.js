
// USEFUL DOM REFERENCES

const grid_container = document.querySelector('#grid_container');
const add_button = document.querySelector('#add_button');

// LIBRARY FUNCTIONS

const myLibrary = [];

function Book(title, author, num_pages, have_read) {
    this.title = title;
    this.author = author;
    this.num_pages = num_pages;
    this.have_read = have_read;
    this.info = function() {
        return `${title} by ${author}, ${num_pages} pages, ${have_read ? 'already read' : 'not read yet'}`;
    }
};

function addBookToLibrary(title, author, num_pages, have_read) {
    new_book = new Book(title, author, num_pages, have_read);
    myLibrary.push(new_book);
}

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, false);
addBookToLibrary('The Way of Kings', 'Brandon Sanderson', 1093, true);
addBookToLibrary('The Telling', 'Ursula K. Le Guin', 263, true);
addBookToLibrary('Reaper Man', 'Terry Pratchett', 453, false);

// CREATE/DISPLAY LIBRARY

let book_container_style = `
    display: flex;
    gap: 4px;

    background-color: #661100;
    flex: 1 1 0;
`;

let tile_style = `
    background-color: white;
    border: 0px;
    font-weight: bold;

    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 0;
`;

function displayBooks() {
    myLibrary.forEach((book) => {
        // create a horizontal flex-container to hold the books info
        const book_container = document.createElement('div');
        book_container.style.cssText = book_container_style;
        grid_container.appendChild(book_container);

        // create tiles to display each property of the books
        for (prop in book) {
            let elem_type = 'button';
            let tile_info = '';
            switch(prop) {
                case 'info':
                    tile_info = 'Remove';
                    break;
                case 'have_read':
                    tile_info = book[prop] ? 'already read' : 'not read yet'
                    break;
                default:
                    elem_type = 'div';
                    tile_info = book[prop];
            }

            // create a tile, assign the css styling, and add the property value
            const tile = document.createElement(elem_type);
            tile.style.cssText = tile_style; 
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
}

displayBooks();