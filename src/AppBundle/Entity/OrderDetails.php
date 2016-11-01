<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * OrderDetails
 * @ORM\Entity
 * @ORM\Table(name="order_details")
 */
class OrderDetails
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
    private $oId;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $orderListId;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $pid;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private $quantity;


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
     * Set oId
     *
     * @param integer $oId
     *
     * @return OrderDetails
     */
    public function setOId($oId)
    {
        $this->oId = $oId;

        return $this;
    }

    /**
     * Get oId
     *
     * @return int
     */
    public function getOId()
    {
        return $this->oId;
    }

    /**
     * Set orderListId
     *
     * @param integer $orderListId
     *
     * @return OrderDetails
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
     * Set pid
     *
     * @param integer $pid
     *
     * @return OrderDetails
     */
    public function setPid($pid)
    {
        $this->pid = $pid;

        return $this;
    }

    /**
     * Get pid
     *
     * @return int
     */
    public function getPid()
    {
        return $this->pid;
    }

    /**
     * Set quantity
     *
     * @param integer $quantity
     *
     * @return OrderDetails
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Get quantity
     *
     * @return int
     */
    public function getQuantity()
    {
        return $this->quantity;
    }
}

