<?php

namespace App\Http\Controllers\Customer;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Field;
use App\Models\Review;
use App\Services\BookingService;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
        private readonly PaymentService $paymentService,
    ) {}

    /**
     * Display the authenticated customer's bookings.
     */
    public function index(Request $request): Response
    {
        $this->bookingService->completePastBookings($request->user()->id);

        $status = $request->string('status')->toString() ?: 'active';
        $status = in_array($status, ['active', 'completed', 'cancelled', 'all'], true) ? $status : 'active';

        $baseQuery = $request->user()->bookings();

        $counts = [
            'active' => (clone $baseQuery)
                ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
                ->whereDate('booking_date', '>=', today())
                ->count(),
            'completed' => (clone $baseQuery)->where('status', BookingStatus::Completed)->count(),
            'cancelled' => (clone $baseQuery)->where('status', BookingStatus::Cancelled)->count(),
            'all' => (clone $baseQuery)->count(),
        ];

        $query = (clone $baseQuery)
            ->with(['field.venue', 'latestPayment', 'review'])
            ->orderByDesc('booking_date')
            ->orderByDesc('start_time');

        match ($status) {
            'active' => $query
                ->whereIn('status', [BookingStatus::Pending, BookingStatus::Confirmed])
                ->whereDate('booking_date', '>=', today()),
            'completed' => $query->where('status', BookingStatus::Completed),
            'cancelled' => $query->where('status', BookingStatus::Cancelled),
            default => null,
        };

        return Inertia::render('Customer/Bookings/Index', [
            'bookings' => $query->paginate(8)->withQueryString(),
            'status' => $status,
            'counts' => $counts,
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreBookingRequest $request, Field $field): RedirectResponse
    {
        $booking = $this->bookingService->createBooking(
            $request->user(),
            $field,
            $request->validated(),
        );

        return redirect()
            ->route('customer.bookings.show', $booking)
            ->with('success', 'Booking berhasil dibuat. Selesaikan pembayaran untuk mengunci jadwal.');
    }

    /**
     * Display the booking checkout and detail page.
     */
    public function show(Request $request, Booking $booking): Response
    {
        $this->authorize('view', $booking);

        $this->bookingService->completePastBookings($request->user()->id);

        $booking->refresh();

        $booking->load([
            'field.venue.owner',
            'payments' => fn ($query) => $query->latest(),
            'review',
        ]);

        return Inertia::render('Customer/Bookings/Show', [
            'booking' => $booking,
            'canPay' => $booking->payment_status === PaymentStatus::Unpaid
                && $booking->status !== BookingStatus::Cancelled,
            'canCancel' => $booking->canBeCancelledByCustomer(),
            'canReview' => $booking->canBeReviewed(),
        ]);
    }

    /**
     * Simulate payment for a booking.
     */
    public function pay(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('pay', $booking);

        $validated = $request->validate([
            'payment_method' => ['required', Rule::in(['bank_transfer', 'ewallet', 'qris', 'cash'])],
        ]);

        $this->paymentService->pay($booking, $validated['payment_method']);

        return back()->with('success', 'Pembayaran berhasil disimulasikan. Menunggu konfirmasi dari mitra.');
    }

    /**
     * Cancel a booking owned by the customer.
     */
    public function cancel(Booking $booking): RedirectResponse
    {
        $this->authorize('cancel', $booking);

        if (! $booking->canBeCancelledByCustomer()) {
            return back()->with('error', 'Booking ini tidak dapat dibatalkan karena sudah lewat atau selesai.');
        }

        $this->paymentService->refund($booking);

        $booking->refresh();

        $booking->update([
            'status' => BookingStatus::Cancelled,
        ]);

        return redirect()
            ->route('customer.bookings.index')
            ->with('success', 'Booking berhasil dibatalkan.'.($booking->payment_status === PaymentStatus::Refunded ? ' Dana akan dikembalikan sesuai kebijakan mitra.' : ''));
    }

    /**
     * Store a review for a completed booking.
     */
    public function review(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('review', $booking);

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        Review::create([
            'booking_id' => $booking->id,
            'user_id' => $request->user()->id,
            'venue_id' => $booking->field->venue_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan Anda sudah tersimpan.');
    }
}
