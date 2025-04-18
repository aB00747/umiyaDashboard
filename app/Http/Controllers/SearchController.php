<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
// Import other models as needed

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        $results = collect();
        
        // Search users
        $users = User::where('name', 'like', "%{$query}%")
            ->orWhere('email', 'like', "%{$query}%")
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'title' => $user->name,
                    'type' => 'User',
                    // 'url' => route('users.show', $user->id)
                ];
            });

        $results = $results->concat($users);
        
        // Add other search types as needed

        return $results->take(10);
    }
}
