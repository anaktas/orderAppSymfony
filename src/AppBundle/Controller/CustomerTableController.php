<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\CustomerTable;

class CustomerTableController extends Controller
{
    /**
     * @Route("/api/table/create")
     */
    public function createAction(Request $request)
    {
        $customerTable = new CustomerTable();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "number": 12
            * }
            */
            $params = json_decode($content, true);
            $number = $params['number'];

            $customerTable->setTableNumber($number);
            $customerTable->setStatus("free");

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($customerTable);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $rId = $customerTable->getId();
            return new JsonResponse(array('response' => 'New customer table was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/table/getall")
     */
    public function getAllTablesAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery('SELECT t.tableNumber, t.status FROM AppBundle:CustomerTable t');
            $tables = $query->getResult();

            return new JsonResponse(array('response' => $tables));
        } catch(\Doctrine\ORM\ORMException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        }     
    }

    /**
     * @Route("/api/table/getstatusbynumber")
     */
    public function getTableStatusByNumberAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "tableNumber": 3
            * }
            */
            $params = json_decode($content, true);
            $tableNumber = $params['tableNumber'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT t.tableNumber, t.status FROM AppBundle:CustomerTable t WHERE t.tableNumber = :tableNumber');
                $query->setParameter('tableNumber', $tableNumber);
                $status = $query->getResult();

                return new JsonResponse(array('response' => $status));
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