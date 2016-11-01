<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CustomerTable
 * @ORM\Entity
 * @ORM\Table(name="customer_table")
 */
class CustomerTable
{
    /**
     * @var int
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $tableId;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $tableNumber;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $status;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set tableId
     *
     * @param integer $tableId
     *
     * @return CustomerTable
     */
    public function setTableId($tableId)
    {
        $this->tableId = $tableId;

        return $this;
    }

    /**
     * Get tableId
     *
     * @return int
     */
    public function getTableId()
    {
        return $this->tableId;
    }

    /**
     * Set tableNumber
     *
     * @param integer $tableNumber
     *
     * @return CustomerTable
     */
    public function setTableNumber($tableNumber)
    {
        $this->tableNumber = $tableNumber;

        return $this;
    }

    /**
     * Get tableNumber
     *
     * @return int
     */
    public function getTableNumber()
    {
        return $this->tableNumber;
    }

    /**
     * Set status
     *
     * @param string $status
     *
     * @return CustomerTable
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }
}

