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
}

