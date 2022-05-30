const books = [];

const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
   const submitForm = document.getElementById("form");
   submitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();
   });

   filterBook();
});

function addBook() {
   const title = document.getElementById("title").value;
   const author = document.getElementById("author").value;
   const year = document.getElementById("year").value;
   const finished = document.getElementById("finished").checked;

   const generateID = generateId();
   const bookObject = toObjectBook(generateID, title, author, year, finished);
   books.push(bookObject);

   // console.log(title, author, year, finished, generateID);
   // console.log(books);
   document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
   // Function for generate random ID
   return +new Date();
}

function toObjectBook(id, title, author, year, isFinished) {
   // function for create object book
   return {
      id,
      title,
      author,
      year,
      isFinished,
   };
}

document.addEventListener(RENDER_EVENT, function () {
   const unfinishedReadingBooksList = document.getElementById("unfinished-book");
   unfinishedReadingBooksList.innerHTML = "";

   const finishedReadingBooksList = document.getElementById("finished-book");
   finishedReadingBooksList.innerHTML = "";

   for (const book of books) {
      const bookElement = makeBookContainer(book);

      if (!book.isFinished) {
         unfinishedReadingBooksList.append(bookElement);
      } else {
         finishedReadingBooksList.append(bookElement);
      }
   }
});

function makeBookContainer(bookObject) {
   const textTitle = document.createElement("h2");
   textTitle.innerText = bookObject.title;

   const textAuthor = document.createElement("h4");
   textAuthor.innerText = bookObject.author;

   const textYear = document.createElement("p");
   textYear.innerText = bookObject.year;

   const bookContainer = document.createElement("div");
   bookContainer.classList.add("book-item");
   bookContainer.append(textTitle, textAuthor, textYear);
   bookContainer.setAttribute("id", `book-${bookObject.id}`);

   if (bookObject.isFinished) {
      const removeBook = document.createElement("button");
      removeBook.innerText = "Hapus";
      removeBook.classList.add("remove-book");

      removeBook.addEventListener("click", function () {
         removeBookItem(bookObject.id);
      });

      const backToRead = document.createElement("button");
      backToRead.innerText = "Kembali Membaca";
      backToRead.classList.add("backto-read");

      backToRead.addEventListener("click", function () {
         backToReadBook(bookObject.id);
      });

      const containerButton = document.createElement("div");
      containerButton.append(removeBook, backToRead);

      bookContainer.appendChild(containerButton);
   } else {
      const removeBook = document.createElement("button");
      removeBook.innerText = "Hapus";
      removeBook.classList.add("remove-book");

      removeBook.addEventListener("click", function () {
         removeBookItem(bookObject.id);
      });

      const doneButton = document.createElement("button");
      doneButton.innerText = "Sudah dibaca";
      doneButton.classList.add("done-button");

      doneButton.addEventListener("click", function () {
         finishedRead(bookObject.id);
      });

      const containerButton = document.createElement("div");
      containerButton.append(removeBook, doneButton);

      bookContainer.appendChild(containerButton);
   }

   return bookContainer;
}

function removeBookItem(bookId) {
   const bookTarget = cariIndexBuku(bookId);

   if (bookTarget === -1) return;

   const confirmRemove = confirm("Yakin ingin dihapus?");
   if (confirmRemove) {
      books.splice(bookTarget, 1);

      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}

function backToReadBook(bookId) {
   const bookTarget = findBook(bookId);

   // console.log(bookTarget);

   if (bookTarget == null) return;

   bookTarget.isFinished = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
}

function finishedRead(bookId) {
   const bookTarget = findBook(bookId);

   if (bookTarget == null) return;

   bookTarget.isFinished = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
}

function filterBook() {
   const filter = document.getElementById("filter-book");
   filter.addEventListener("input", function () {
      const valueFilter = filter.value.toLowerCase();

      const bookTarget = findBookBySearch(valueFilter);

      // console.log(bookTarget);

      if (bookTarget == null) {
         document.dispatchEvent(new Event(RENDER_EVENT));
      } else {
         const unfinishedReadingBooksList = document.getElementById("unfinished-book");
         unfinishedReadingBooksList.innerHTML = "";

         const finishedReadingBooksList = document.getElementById("finished-book");
         finishedReadingBooksList.innerHTML = "";

         for (const book of bookTarget) {
            const bookElement = makeBookContainer(book);

            if (!book.isFinished) {
               unfinishedReadingBooksList.append(bookElement);
            } else {
               finishedReadingBooksList.append(bookElement);
            }
         }
      }
   });
}

function findBookBySearch(keyword) {
   const totalBook = [];
   for (const book of books) {
      if (book.title.toLowerCase() == keyword) {
         totalBook.push(book);
      } else if (book.author.toLowerCase() == keyword) {
         totalBook.push(book);
      } else if (book.year.toLowerCase() == keyword) {
         totalBook.push(book);
      } else;
   }
   if (totalBook.length === 0) {
      return null;
   }
   return totalBook;
}

function findBook(bookId) {
   for (const bookItem of books) {
      if (bookItem.id === bookId) {
         return bookItem;
      }
   }
   return null;
}

function cariIndexBuku(bookId) {
   for (const index in books) {
      if (books[index].id === bookId) {
         return index;
      }
   }

   return -1;
}
