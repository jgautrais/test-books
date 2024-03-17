<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateBookingDTO
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Type('integer')]
        public readonly int $userId,

        #[Assert\NotBlank]
        #[Assert\Type('integer')]
        public readonly int $bookId,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        public readonly string $startDate,

        #[Assert\NotBlank]
        #[Assert\Type('string')]
        public readonly string $endDate,
    ) {
    }
}