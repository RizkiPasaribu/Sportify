<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display all platform users.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'string', 'in:customer,owner,admin'],
        ]);

        $users = User::query()
            ->withCount(['bookings', 'venues'])
            ->when($filters['q'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->where('name', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, string $role) => $query->where('role', $role))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'role' => $filters['role'] ?? '',
            ],
            'counts' => [
                'all' => User::count(),
                'customer' => User::where('role', UserRole::Customer)->count(),
                'owner' => User::where('role', UserRole::Owner)->count(),
                'admin' => User::where('role', UserRole::Admin)->count(),
            ],
            'roles' => UserRole::options(),
        ]);
    }

    /**
     * Update a user's role.
     */
    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(array_keys(UserRole::options()))],
        ]);

        if ($user->is($request->user())) {
            return back()->with('error', 'Anda tidak dapat mengubah role akun sendiri.');
        }

        $user->update([
            'role' => $validated['role'],
        ]);

        return back()->with('success', "Role {$user->name} berhasil diperbarui.");
    }

    /**
     * Remove a user from the platform.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
