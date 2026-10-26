<?php

namespace App\Http\Controllers\Owner;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Venue;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService) {}

    /**
     * Display bookings across all venues owned by the authenticated owner.
     */
    public function index(Request $request): Response
    {
        $venueIds = $request->user()->venues()->pluck('id');

        $filters = $request->validate([
            'status' => ['nullable', 'string', 'in:pending,confirmed,completed,cancelled,all'],
            'venue_id' => ['nullable', 'uuid'],
            'q' => ['nullable', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
        ]);

        $status = $filters['status'] ?? 'all';

        $baseQuery = Booking::query()
            ->whereHas('field', fn ($query) => $query->whereIn('venue_id', $venueIds));

        $counts = [
            'pending' => (clone $baseQuery)->where('status', BookingStatus::Pending)->count(),
            'confirmed' => (clone $baseQuery)->where('status', BookingStatus::Confirmed)->count(),
            'completed' => (clone $baseQuery)->where('status', BookingStatus::Completed)->count(),
            'cancelled' => (clone $baseQuery)->where('status', BookingStatus::Cancelled)->count(),
            'all' => (clone $baseQuery)->count(),
        ];

        $query = (clone $baseQuery)
            ->with(['user:id,name,email', 'field.venue:id,name', 'latestPayment'])
            ->latest('booking_date')
            ->latest('start_time');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (isset($filters['venue_id'])) {
            $query->whereHas('field', fn ($query) => $query
                ->where('venue_id', $filters['venue_id'])
                ->whereIn('venue_id', $venueIds));
        }

        if (isset($filters['q'])) {
            $search = $filters['q'];
            $query->whereHas('user', fn ($query) => $query
                ->where('name', 'ilike', "%{$search}%")
                ->orWhere('email', 'ilike', "%{$search}%"));
        }

        if (isset($filters['date'])) {
            $query->whereDate('booking_date', $filters['date']);
        }

        return Inertia::render('Owner/Bookings/Index', [
            'bookings' => $query->paginate(12)->withQueryString(),
            'filters' => [
                'status' => $status,
                'venue_id' => $filters['venue_id'] ?? '',
                'q' => $filters['q'] ?? '',
                'date' => $filters['date'] ?? '',
            ],
            'counts' => $counts,
            'venues' => Venue::query()
                ->whereIn('id', $venueIds)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    /**
     * Confirm a pending booking.
     */
    public function confirm(Booking $booking): RedirectResponse
    {
        $this->authorize('manage', $booking);

        if ($booking->status !== BookingStatus::Pending) {
            return back()->with('error', 'Hanya booking dengan status menunggu konfirmasi yang dapat dikonfirmasi.');
        }

        if ($booking->payment_status !== PaymentStatus::Paid) {
            return back()->with('error', 'Booking belum dibayar. Minta customer menyelesaikan pembayaran terlebih dahulu.');
        }

        $booking->update([
            'status' => BookingStatus::Confirmed,
        ]);

        return back()->with('success', 'Booking berhasil dikonfirmasi.');
    }

    /**
     * Cancel a booking and refund the payment when applicable.
     */
    public function cancel(Booking $booking): RedirectResponse
    {
        $this->authorize('manage', $booking);

        if (in_array($booking->status, [BookingStatus::Completed, BookingStatus::Cancelled], true)) {
            return back()->with('error', 'Booking yang sudah selesai atau dibatalkan tidak dapat dibatalkan lagi.');
        }

        $this->paymentService->refund($booking);

        $booking->refresh();

        $booking->update([
            'status' => BookingStatus::Cancelled,
        ]);

        return back()->with('success', 'Booking dibatalkan.'.($booking->payment_status === PaymentStatus::Refunded ? ' Pembayaran telah direfund.' : ''));
    }

    /**
     * Mark a confirmed booking as completed.
     */
    public function complete(Booking $booking): RedirectResponse
    {
        $this->authorize('manage', $booking);

        if ($booking->status !== BookingStatus::Confirmed) {
            return back()->with('error', 'Hanya booking terkonfirmasi yang dapat diselesaikan.');
        }

        $booking->update([
            'status' => BookingStatus::Completed,
        ]);

        return back()->with('success', 'Booking ditandai sebagai selesai.');
    }
}
