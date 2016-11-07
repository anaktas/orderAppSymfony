<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\OrderList;
use AppBundle\Entity\OrderDetails;

class OrderingController extends Controller
{
    /**
     * @Route("/api/ordering/create")
     */
    public function createAction(Request $request)
    {
        $orderList = new OrderList();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "tableNumber": 2,
            *   "status": "opened",
            *   "details": [
            *       {
            *           "pid": 2,
            *           "quantity": 2,
            *           "description": "Γλυκός, Γάλα"
            *       },
            *       {
            *           "pid": 3,
            *           "quantity": 1,
            *           "description": ""
            *       }
            *   ]
            * }
            */
            $params = json_decode($content, true);
            $tableNumber = $params['tableNumber'];
            $status = $params['status'];
            $details = $params['details'];

            $orderList->setTableId($tableNumber);
            $orderList->setStatus($status);
            $orderList->setOrderListId(0);

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($orderList);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $oId = $orderList->getId();
            foreach ($details as $detail) {
                $orderDetail = new OrderDetails();
                $orderDetail->setOId(0);
                $orderDetail->setOrderListId($oId);
                $orderDetail->setPid($detail['pid']);
                $orderDetail->setQuantity($detail['quantity']);
                $orderDetail->setDescription($detail['description']);
                try {
                    $em2 = $this->getDoctrine()->getManager();
                    $em2->persist($orderDetail);
                    $em2->flush();
                } catch(\Doctrine\ORM\ORMException $e) {
                    return new JsonResponse(array('error' => $e->getMessage()));
                } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                    return new JsonResponse(array('error' => $e->getMessage()));
                }
            }
            return new JsonResponse(array('response' => 'New order was created with id: ' . $oId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/ordering/getopened")
     */
    public function getOpenOrdersAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery('SELECT o.id FROM AppBundle:OrderList o WHERE o.status = :status');
            $query->setParameter('status', 'opened');
            $orders = $query->getResult();

            return new JsonResponse(array('response' => $orders));
        } catch(\Doctrine\ORM\ORMException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        }       
    }

    /**
     * @Route("/api/ordering/getopeneddetails")
     */
    public function getOpenOrderDetailsAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "id": 1
            * }
            */
            $params = json_decode($content, true);
            $id = $params['id'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT (SELECT p.name FROM AppBundle:Product p WHERE p.id = o.pid) as name, o.quantity, o.description FROM AppBundle:OrderDetails o WHERE o.orderListId = :id');
                $query->setParameter('id', $id);
                $orderDetails = $query->getResult();

                return new JsonResponse(array('response' => $orderDetails));
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/ordering/setready")
     */
    public function setOrderToReadyAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "id": 1   
            * }
            */
            $params = json_decode($content, true);
            $id = $params['id'];

            try {
                $em = $this->getDoctrine()->getManager();
                $orderList = $em->getRepository('AppBundle:OrderList')->find($id);

                if (!$orderList) {
                    # code...
                    return new JsonResponse(array('response' => 'Error'));
                }

                $orderList->setStatus('ready');
                $em->flush();

                return new JsonResponse(array('response' => 'OK'));
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/ordering/setcancelled")
     */
    public function setOrderToCancelledAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "id": 1   
            * }
            */
            $params = json_decode($content, true);
            $id = $params['id'];

            try {
                $em = $this->getDoctrine()->getManager();
                $orderList = $em->getRepository('AppBundle:OrderList')->find($id);

                if (!$orderList) {
                    # code...
                    return new JsonResponse(array('response' => 'Error'));
                }

                $orderList->setStatus('canceled');
                $em->flush();

                return new JsonResponse(array('response' => 'OK'));
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }
}

