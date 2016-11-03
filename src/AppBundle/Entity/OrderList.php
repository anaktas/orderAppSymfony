<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * OrderList
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Table(name="order_list")
 */
class OrderList
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
    private $orderListId;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $tableId;

    /**
     * @var string
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $ts;


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
     * Set orderListId
     *
     * @param integer $orderListId
     *
     * @return OrderList
     */
    public function setOrderListId($orderListId)
    {
        $this->orderListId = $orderListId;

        return $this;
    }

    /**
     * Get orderListId
     *
     * @return int
     */
    public function getOrderListId()
    {
        return $this->orderListId;
    }

    /**
     * Set tableId
     *
     * @param integer $tableId
     *
     * @return OrderList
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
     * Set status
     *
     * @param string $status
     *
     * @return OrderList
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

    /**
     * Get ts
     *
     * @return \DateTime
     */
    public function getTs()
    {
        return $this->ts;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function createTs()
    {
        $this->ts = new \DateTime();
    }
}

