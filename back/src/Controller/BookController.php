<?php

namespace App\Controller;

use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books', name: 'app_api_book')]
class BookController extends AbstractController
{
    #[Route('', name: '', methods: ['GET'])]
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

    #[Route('/{id}', name: '_id', methods: ['GET'])]
    public function getBookById(
        BookRepository $bookRepository,
        int $id,
    ): JsonResponse
    {
        return $this->json([
            'data' => $bookRepository->findById($id)
        ]);
    }
}
