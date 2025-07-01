<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use Illuminate\Http\Request;

class BookCopyController extends Controller
{
    public function index()
    {
        return BookCopy::all();
    }

    public function store(Request $request)
    {
        $bookCopy = BookCopy::create($request->all());
        return response()->json($bookCopy, 201);
    }

    public function show($id)
    {
        return BookCopy::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $bookCopy = BookCopy::findOrFail($id);
        $bookCopy->update($request->all());
        return response()->json($bookCopy, 200);
    }

    public function destroy($id)
    {
        BookCopy::destroy($id);
        return response()->json(null, 204);
    }
}
