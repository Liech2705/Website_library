<?php

namespace App\Http\Controllers;

use App\Models\BorrowRecord;
use Illuminate\Http\Request;

class BorrowRecordController extends Controller
{
    public function index()
    {
        return BorrowRecord::all();
    }

    public function store(Request $request)
    {
        $borrowRecord = BorrowRecord::create($request->all());
        return response()->json($borrowRecord, 201);
    }

    public function show($id)
    {
        return BorrowRecord::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $borrowRecord = BorrowRecord::findOrFail($id);
        $borrowRecord->update($request->all());
        return response()->json($borrowRecord, 200);
    }

    public function destroy($id)
    {
        BorrowRecord::destroy($id);
        return response()->json(null, 204);
    }
}
