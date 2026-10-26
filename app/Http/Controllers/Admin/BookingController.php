<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    /**
     * Display all bookings and transactions.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'string', 'in:pending,confirmed,completed,cancelled,all'],
            'q' => ['nullable', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
        ]);

        $status = $filters['status'] ?? 'all';

        $baseQuery = Booking::query();

        $counts = [
            'all' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', BookingStatus::Pending)->count(),
            'confirmed' => (clone $baseQuery)->where('status', BookingStatus::Confirmed)->count(),
            'completed' => (clone $baseQuery)->where('status', BookingStatus::Completed)->count(),
            'cancelled' => (clone $baseQuery)->where('status', BookingStatus::Cancelled)->count(),
            'revenue' => (float) (clone $baseQuery)
                ->where('payment_status', PaymentStatus::Paid)
                ->where('status', '!=', BookingStatus::Cancelled)
                ->sum('total_price'),
        ];

        $query = Booking::query()
            ->with(['user:id,name,email', 'field.venue:id,name', 'latestPayment'])
            ->latest('booking_date')
            ->latest('start_time');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (isset($filters['q'])) {
            $search = $filters['q'];
            $query->where(function ($query) use ($search): void {
                $query->whereHas('user', fn ($query) => $query
                    ->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%"))
                    ->orWhereHas('field.venue', fn ($query) => $query->where('name', 'ilike', "%{$search}%"));
            });
        }

        if (isset($filters['date'])) {
            $query->whereDate('booking_date', $filters['date']);
        }

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'status' => $status,
                'q' => $filters['q'] ?? '',
                'date' => $filters['date'] ?? '',
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Cancel a booking as an administrator.
     */
    public function cancel(Booking $booking): RedirectResponse
    {
        $this->authorize('manage', $booking);

        if (in_array($booking->status, [BookingStatus::Completed, BookingStatus::Cancelled], true)) {
            return back()->with('error', 'Booking ini tidak dapat dibatalkan.');
        }

        $this->paymentService->refund($booking);

        $booking->refresh();

        $booking->update([
            'status' => BookingStatus::Cancelled,
        ]);

        $message = 'Booking berhasil dibatalkan oleh admin.';

        if ($booking->payment_status === PaymentStatus::Refunded) {
            $message .= ' Dana sebesar Rp '.number_format((float) $booking->total_price, 0, ',', '.').' telah direfund ke customer.';
        }

        return back()->with('success', $message);
    }
}
