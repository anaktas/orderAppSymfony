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
            return new JsonResponse(array('response' => 'Ένα νέο προϊόν δημιουργήθηκε με id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/product/getbyid")
     */
    public function getProductByIdAction(Request $request)
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
                $query = $em->createQuery('SELECT p.id, p.name, p.description, p.price, p.cid FROM AppBundle:Product p WHERE p.id = :id');
                $query->setParameter('id', $id);
                $product = $query->getResult();

                return new JsonResponse(array('response' => $product));
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
     * @Route("/api/product/getall")
     */
    public function getAllProductsAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery('SELECT p.id, p.name, p.description, p.price, p.cid FROM AppBundle:Product p');
            $products = $query->getResult();
            //$products = $em->getRepository('AppBundle:Product')->getAll();

            return new JsonResponse(array('response' => $products));
        } catch(\Doctrine\ORM\ORMException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        }     
    }

    /**
     * @Route("/api/product/getbycid")
     */
    public function getProductByCategoryIdAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "cid": 1
            * }
            */
            $params = json_decode($content, true);
            $cid = $params['cid'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT p.id, p.name, p.description, p.price, p.cid FROM AppBundle:Product p WHERE p.cid = :cid');
                $query->setParameter('cid', $cid);
                $products = $query->getResult();

                return new JsonResponse(array('response' => $products));
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
     * @Route("/api/product/getbyname")
     */
    public function getProductByNameAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "name": "Coffe"
            * }
            */
            $params = json_decode($content, true);
            $name = $params['name'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT p.id, p.name, p.description, p.price, p.cid FROM AppBundle:Product p WHERE p.name LIKE :name');
                $query->setParameter('name', $name);
                $products = $query->getResult();

                return new JsonResponse(array('response' => $products));
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

