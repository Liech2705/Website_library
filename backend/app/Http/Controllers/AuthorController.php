<?php
namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use App\Traits\AdminActivityLogger;

class AuthorController extends Controller
{
    use AdminActivityLogger;

    public function index()
    {
        return Author::all();
    }

    public function store(Request $request)
    {
        $author = Author::create($request->all());
        $this->logCreate('Tác giả', ['name' => $author->name, 'id' => $author->id]);
        return response()->json($author, 201);
    }

    public function show($id)
    {
        return Author::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);
        $author->update($request->all());
        $this->logUpdate('Tác giả', $id, ['name' => $author->name]);
        return response()->json($author, 200);
    }

    public function destroy($id)
    {
        $author = Author::findOrFail($id);
        $author->delete();
        $this->logDelete('Tác giả', $id);
        return response()->json(null, 204);
    }
}
