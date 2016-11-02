<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Store;

class StoreController extends Controller
{
    /**
     * @Route("/api/store/create")
     */
    public function createAction(Request $request)
    {
        $store = new Store();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "pid": 12,
            *   "quantity": 120
            * }
            */
            $params = json_decode($content, true);
            $pid = $params['pid'];
            $quantity = $params['quantity'];

            $store->setPid($pid);
            $store->setQuantity($quantity);

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($store);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $rId = $store->getId();
            return new JsonResponse(array('response' => 'A quantity for a product was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }
}

