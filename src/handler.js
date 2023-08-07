const { nanoid } = require('nanoid');
const storeBooks = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (name != null && readPage <= pageCount) {
    const newBook = {
      // eslint-disable-next-line max-len
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    storeBooks.push(newBook);
    const isSuccess = storeBooks.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  if (request.query.reading === '1') {
    const filterBooks = storeBooks.filter((n) => n.reading === true);

    const books = filterBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    return response;
  } if (request.query.reading === '0') {
    const filterBooks = storeBooks.filter((n) => n.reading === false);

    const books = filterBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    return response;
    // eslint-disable-next-line eqeqeq
  } if (request.query.finished == true) {
    const filterBooks = storeBooks.filter((n) => n.finished === true);

    const books = filterBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    return response;
    // eslint-disable-next-line eqeqeq
  } if (request.query.finished == false) {
    const filterBooks = storeBooks.filter((n) => n.finished === false);

    const books = filterBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    return response;
  } if (request.query.name === 'Dicoding') {
    const filterBooks = storeBooks.filter((n) => n.name.includes('dicoding') || n.name.includes('Dicoding'));
    const books = filterBooks.map((item) => ({
      id: item.id,
      name: item.name,
      publisher: item.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    return response;
  }
  const books = storeBooks.map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = storeBooks.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = storeBooks.findIndex((book) => book.id === id);

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    storeBooks[index] = {
      ...storeBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = storeBooks.findIndex((book) => book.id === id);

  if (index !== -1) {
    storeBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
