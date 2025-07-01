<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return Reservation::all();
    }

    public function store(Request $request)
    {
        $reservation = Reservation::create($request->all());
        return response()->json($reservation, 201);
    }

    public function show($id)
    {
        return Reservation::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->all());
        return response()->json($reservation, 200);
    }

    public function destroy($id)
    {
        Reservation::destroy($id);
        return response()->json(null, 204);
    }
}
