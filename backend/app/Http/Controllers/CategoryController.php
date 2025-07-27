<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Traits\AdminActivityLogger;

class CategoryController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $category = Category::create($request->all());
        $this->logCreate('Thể loại', ['name' => $category->name, 'id' => $category->id]);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        return Category::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        $this->logUpdate('Thể loại', $id, ['name' => $category->name]);
        return response()->json($category, 200);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        $this->logDelete('Thể loại', $id);
        return response()->json(null, 204);
    }
}
