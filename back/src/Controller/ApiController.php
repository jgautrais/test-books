<?php

namespace App\Controller;

use App\DTO\CreateBookingDTO;
use App\Entity\Booking;
use App\Repository\BookingRepository;
use App\Repository\BookRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{
    #[Route('/', name: '', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to API controller!',
        ]);
    }

    #[Route('/books', name: '_book', methods: ['GET'])]
    public function getBooksWithFilters(
        BookRepository $bookRepository,
        #[MapQueryParameter(filter: \FILTER_VALIDATE_REGEXP, options: ['regexp' => '/^[a-zA-Z0-9\s]{1,}$/'])] string|null $title,
        #[MapQueryParameter] string|null $genre,
        #[MapQueryParameter(filter: \FILTER_VALIDATE_INT)] int|null $publicationYear,
        #[MapQueryParameter] bool|null $isAvailable,
    ): JsonResponse
    {
        return $this->json([
            'data' => $bookRepository->findByFilters($title, $genre, $publicationYear, $isAvailable)
        ]);
    }

    #[Route('/books/{id}', name: '_book_id', methods: ['GET'])]
    public function getBookById(
        BookRepository $bookRepository,
        int $id,
    ): JsonResponse
    {
        return $this->json([
            'data' => $bookRepository->findById($id)
        ]);
    }

    #[Route('/bookings/{id}', name: '_bookings', methods: ['GET'])]
    public function getBookingsFromUser(
        BookingRepository $bookingRepository,
        UserRepository $userRepository,
        int $id,
    ): JsonResponse
    {
        $user = $userRepository->find($id);

        if (is_null($user)) {
            return $this->json([
                'error' => 'User not found with id ' . $id
            ])->setStatusCode(404);
        }

        return $this->json([
            'data' => $bookingRepository->findActiveBookingsByUserId($id)
        ]);
    }

    #[Route('/bookings', name: '_bookings_create', methods: ['POST'])]
    public function createBooking(
        #[MapRequestPayload] CreateBookingDTO $payload,
        BookRepository $bookRepository,
        BookingRepository $bookingRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $user = $userRepository->find($payload->userId);

        if (is_null($user)) {
            return $this->json([
                'errors' => 'User not found with id ' . $payload->userId
            ])->setStatusCode(404);
        }

        $book = $bookRepository->find($payload->bookId);

        if (is_null($book)) {
            return $this->json([
                'errors' => 'Book not found with id ' . $payload->bookId
            ])->setStatusCode(404);
        }

        if ($payload->startDate === $payload->endDate || new \DateTime($payload->startDate) >= new \DateTime($payload->endDate)) {
            return $this->json([
                'errors' => 'End date must be strictly after start date'
            ])->setStatusCode(400);
        }

        $activeBookings = $bookingRepository->findActiveBookingsByBookIdAndDateRange($payload->bookId, $payload->startDate, $payload->endDate);

        if (count($activeBookings) > 0) {
            return $this->json([
                'errors' => 'The Book is already loaned'
            ])->setStatusCode(400);
        }

        $booking = new Booking();
        $booking->setBook($book)
            ->setUserBooking($user)
            ->setStartDate(new \DateTimeImmutable($payload->startDate))
            ->setEndDate(new \DateTimeImmutable($payload->endDate))
            ->setStatus('active');

        $entityManager->persist($booking);

        $entityManager->flush();

        return $this->json([
            'id' => $booking->getId()
        ])->setStatusCode(201);
    }

    #[Route('/bookings/cancel/{id}', name: '_bookings_cancel', methods: ['PUT'])]
    public function cancelBooking(
        BookingRepository $bookingRepository,
        EntityManagerInterface $entityManager,
        int $id
    ): JsonResponse
    {
        $booking = $bookingRepository->find($id);

        if (is_null($booking)) {
            return $this->json([
                'errors' => 'Booking not found with id ' . $id
            ])->setStatusCode(404);
        }

        $booking->setStatus('cancelled');

        $entityManager->persist($booking);

        $entityManager->flush();

        return $this->json(null)->setStatusCode(204);
    }
}
