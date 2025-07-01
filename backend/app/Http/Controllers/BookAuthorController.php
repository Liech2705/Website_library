<?php

namespace App\Http\Controllers;

use App\Models\BookAuthor;
use Illuminate\Http\Request;

class BookAuthorController extends Controller
{
    public function index()
    {
        return BookAuthor::all();
    }

    public function store(Request $request)
    {
        $bookAuthor = BookAuthor::create($request->all());
        return response()->json($bookAuthor, 201);
    }

    public function show($id_book)
    {
        return BookAuthor::where('id_book', $id_book)->get();
    }

    public function update(Request $request, $id_book)
    {
        $bookAuthor = BookAuthor::where('id_book', $id_book)->firstOrFail();
        $bookAuthor->update($request->all());
        return response()->json($bookAuthor, 200);
    }

    public function destroy($id_book)
    {
        BookAuthor::where('id_book', $id_book)->delete();
        return response()->json(null, 204);
    }
}
