<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Book>
 *
 * @method Book|null find($id, $lockMode = null, $lockVersion = null)
 * @method Book|null findOneBy(array $criteria, array $orderBy = null)
 * @method Book[]    findAll()
 * @method Book[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

        /**
         * @return Book[] Returns an array of Book objects
         */
        public function findByFilters(string|null $title, string|null $genre, int|null $publicationYear): array
        {
            $qb = $this
                ->createQueryBuilder('b')
                ->select('b');

            if (!is_null($title)) {
                $qb->andWhere('b.title LIKE :title')
                    ->setParameter('title', '%' . $title . '%');
            }

            if (!is_null($genre)) {
                $qb->andWhere('b.category = :genre')
                    ->setParameter('genre', $genre);
            }

            if (!is_null($publicationYear)) {
                $from = new \DateTime($publicationYear . '-01-01');
                $to = new \DateTime(($publicationYear + 1) . '-01-01');
                $qb->andWhere('b.publishedAt >= :from')
                    ->andWhere('b.publishedAt < :to')
                    ->setParameter('from', $from)
                    ->setParameter('to', $to);
            }

            return $qb
                ->orderBy('b.id', 'ASC')
                ->getQuery()
                ->getArrayResult()
            ;
        }
}
