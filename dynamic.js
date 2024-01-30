
function Book(title, author, num_pages, have_read) {
    this.title = title;
    this.author = author;
    this.num_pages = num_pages;
    this.have_read = have_read;
    this.info = function() {
        return `${title} by ${author}, ${num_pages} pages, ${have_read ? 'already read' : 'not read yet'}`;
    }
};