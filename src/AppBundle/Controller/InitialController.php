<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Product;

class InitialController extends Controller
{
    /**
     * @Route("/initial/init", name="initpage")
     */
    public function initAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            $params = json_decode($content, true);
            return new JsonResponse(array('name' => $params['name']));
        }        
    }

    /**
     * @Route("/initial/insert", name="initpage2")
     */
    public function init2Action(Request $request)
    {
        $product = new Product();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            $params = json_decode($content, true);
            $name = $params['name'];
            $description = $params['description'];
            $price = $params['price'];

            $product->setName($name);
            $product->setDescription($description);
            $product->setPrice($price);

            $em = $this->getDoctrine()->getManager();
            $em->persist($product);
            $em->flush();
            return new JsonResponse(array('output' => 'OK'));
        } else {
            return new JsonResponse(array('error' => 'Failed!'));
        }       
    }
}

