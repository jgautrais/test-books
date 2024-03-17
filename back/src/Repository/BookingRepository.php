<?php

namespace App\Repository;

use App\Entity\Booking;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 *
 * @method Booking|null find($id, $lockMode = null, $lockVersion = null)
 * @method Booking|null findOneBy(array $criteria, array $orderBy = null)
 * @method Booking[]    findAll()
 * @method Booking[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

        /**
         * @return Booking[] Returns an array of Booking objects
         */
        public function findActiveBookingsByUserId(int $userId): array
        {
            return $this->createQueryBuilder('b')
                ->select('b.id, b.startDate, b.endDate, b.status, book.id as bookId, book.title as bookTitle')
                ->join('b.book', 'book', 'b.book = book.id')
                ->andWhere('b.userBooking = :id')
                ->setParameter('id', $userId)
                ->andWhere('b.status = :status')
                ->setParameter('status', 'active')
                ->orderBy('b.id', 'ASC')
                ->getQuery()
                ->getResult()
            ;
        }

    /**
     * @return Booking[] Returns an array of Booking objects
     */
    public function findActiveBookingsByBookIdAndDateRange(int $bookId, string $startDate, string $endDate): array
    {
        $from = new \DateTime($startDate);
        $to = new \DateTime($endDate);

        return $this->createQueryBuilder('b')
            ->andWhere('b.book = :book')
            ->setParameter('book', $bookId)
            ->andWhere('(:from >= b.startDate AND :from <= b.endDate) OR (:to <= b.endDate AND :to >= b.startDate)')
            ->setParameter('from', $from)
            ->setParameter('to', $to)
            ->andWhere('b.status = :status')
            ->setParameter('status', 'active')
            ->orderBy('b.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
