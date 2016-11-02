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
            $params = json_decode($content, true);
            $number = $params['number'];
            $status = $params['status'];

            $customerTable->setTableNumber($number);
            $customerTable->setStatus($status);

            $em = $this->getDoctrine()->getManager();
            $em->persist($customerTable);
            $em->flush();
            $rId = $customerTable->getId();
            return new JsonResponse(array('output' => 'New customer table was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }
}