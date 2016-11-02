<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Category;

class ProductController extends Controller
{
    /**
     * @Route("/api/category/create")
     */
    public function createAction(Request $request)
    {
        $category = new Category();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * {
            *   "name": "Ζεστά ροφήματα",
            *   "description": "Καφέδες, σοκολάτες"
            * }
            */
            $params = json_decode($content, true);
            $name = $params['name'];
            $description = $params['description'];

            $category->setName($name);
            $category->setDescription($description);

            $em = $this->getDoctrine()->getManager();
            $em->persist($category);
            $em->flush();
            $rId = $category->getId();
            return new JsonResponse(array('response' => 'New category was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }
}

