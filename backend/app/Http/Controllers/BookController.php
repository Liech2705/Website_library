<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Traits\AdminActivityLogger;
use Illuminate\Http\Request;

class BookController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        return Book::all();
    }

    public function _index()
    {
        $books = Book::with(['authors:id,name', 'category:id,name', 'bookCopies'])->get();

        // Đổi tên key cho đúng format frontend nếu cần
        $books = $books->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'authors' => $book->authors->map(function ($author) {
                    return [
                        'id' => $author->id,
                        'name' => $author->name,
                    ];
                }),
                'category' => [
                    'id' => $book->category->id,
                    'name' => $book->category->name,
                ],
                'publisher' => $book->publisher,
                'year' => $book->year,
                'views' => $book->views,
                'book_copies' => $book->bookCopies,
                'image' => $book->image,
            ];
        });

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $book = Book::create($request->all());
        $this->logCreate('Sách', ['title' => $book->title, 'id' => $book->id]);
        return response()->json($book, 201);
    }

    public function show($id)
    {
        //return Book::findOrFail($id);
        $book = Book::with(['authors:id,name', 'category:id,name', 'bookCopies'])->findOrFail($id);

        // Format the response to match frontend expectations
        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'authors' => $book->authors->map(function ($author) {
                return [
                    'id' => $author->id,
                    'name' => $author->name,
                ];
            }),
            'category' => $book->category ? [
                'id' => $book->category->id,
                'name' => $book->category->name,
            ] : null,
            'publisher' => $book->publisher,
            'year' => $book->year,
            'views' => $book->views,
            'description' => $book->description,
            'image_url' => $book->image,
            'book_copies' => $book->bookCopies,
        ]);
    }

    public function update(Request $request, $id)
    {
        $book = Book::findOrFail($id);
        $book->update($request->all());
        $this->logUpdate('Sách', $id, ['title' => $book->title]);
        return response()->json($book, 200);
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $bookTitle = $book->title;
        Book::destroy($id);
        $this->logDelete('Sách', $id);
        return response()->json(null, 204);
    }
}
