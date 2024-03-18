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
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/bookings', name: 'app_api_bookings')]
class BookingController extends AbstractController
{
    #[Route('/{id}', name: '', methods: ['GET'])]
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

    #[Route('', name: '_create', methods: ['POST'])]
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

    #[Route('/cancel/{id}', name: '_cancel', methods: ['PUT'])]
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
