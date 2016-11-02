<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Product;

class ProductController extends Controller
{
    /**
     * @Route("/api/product/create")
     */
    public function createAction(Request $request)
    {
        $product = new Product();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "name": "Freddo Espresso",
            *   "description": "Κρύος καφές espresso",
            *   "price": 2.5,
            *   "cid": 3
            * }
            */
            $params = json_decode($content, true);
            $name = $params['name'];
            $description = $params['description'];
            $price = $params['price'];
            $cid = $params['cid'];

            $product->setName($name);
            $product->setDescription($description);
            $product->setPrice($price);
            $product->setCid($cid);

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($product);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $rId = $product->getId();
            return new JsonResponse(array('response' => 'New category was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }
}

