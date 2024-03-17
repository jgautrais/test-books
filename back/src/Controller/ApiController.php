<?php

namespace App\Controller;

use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;

#[Route('/api', name: 'app_api')]
class ApiController extends AbstractController
{
    #[Route('/', name: '')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to API controller!',
        ]);
    }

    #[Route('/books', name: '_book')]
    public function getBooksWithFilters(
        BookRepository $bookRepository,
        #[MapQueryParameter(filter: \FILTER_VALIDATE_REGEXP, options: ['regexp' => '/^[a-zA-Z0-9\s]{1,}$/'])] string|null $title,
        #[MapQueryParameter] string|null $genre,
        #[MapQueryParameter(filter: \FILTER_VALIDATE_INT)] int|null $publicationYear,
    ): JsonResponse
    {
        return $this->json([
            'data' => $bookRepository->findByFilters($title, $genre, $publicationYear)
        ]);
    }
}
