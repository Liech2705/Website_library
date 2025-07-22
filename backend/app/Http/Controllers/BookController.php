<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BorrowRecord;
use App\Traits\AdminActivityLogger;
use Illuminate\Http\Request;

class BookController extends Controller
{
    use AdminActivityLogger;

    public function index(Request $request)
    {
        $query = Book::with(['authors:id,name', 'category:id,name', 'availableBookCopies']);

        if ($request->has('search')) {
            $keyword = $request->input('search');
            $query->where('title', 'like', "%$keyword%");
            // Nếu muốn tìm cả theo tác giả:
            // $query->orWhereHas('authors', function($q) use ($keyword) {
            //     $q->where('name', 'like', \"%$keyword%\");
            // });
        }

        $books = $query->get();

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
                'description' => $book->description,
                'year' => $book->year,
                'book_copies' => $book->availableBookCopies,
                'views' => $book->views,
                'image' => $book->image,
            ];
        });

        return response()->json($books);
    }

    public function _index()
    {
        $books = Book::with(['authors:id,name', 'category:id,name', 'availableBookCopies'])->get();
        
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
                'book_copies' => $book->availableBookCopies,
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
        $book = Book::with(['authors:id,name', 'category:id,name', 'availableBookCopies'])->findOrFail($id);

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
            'book_copies' => $book->availableBookCopies,
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

    public function search(Request $request)
    {
        $query = Book::query();

        if ($request->has('search')) {
            $keyword = $request->input('search');
            $query->where('title', 'like', "%$keyword%");
            // Nếu muốn tìm cả theo tác giả, thêm join hoặc whereHas với bảng author
        }

        return $query->get();
    }

    public function statistics(Request $request)
    {
        $books = Book::with('authors', 'bookCopies')->get();
        $borrowRecords = BorrowRecord::with('bookCopy')->get();

        $result = $books->map(function ($book) use ($borrowRecords) {
            $monthlyData = [];
            foreach (range(1, 12) as $month) {
                $monthlyData[$month] = $borrowRecords
                    ->filter(function ($record) use ($book, $month) {
                        // Kiểm tra bookCopy tồn tại và book_id trùng với sách
                        return $record->bookCopy
                            && $record->bookCopy->id_book == $book->id
                            && date('n', strtotime($record->start_time)) == $month;
                    })
                    ->count();
            }

            return [
                'id' => $book->id,
                'title' => $book->title,
                'authors' => $book->authors->pluck('name')->join(', '),
                'quantity' => $book->bookCopies ? $book->bookCopies->count() : 0,
                'monthlyData' => $monthlyData,
            ];
        });

        return response()->json($result);
    }
}
