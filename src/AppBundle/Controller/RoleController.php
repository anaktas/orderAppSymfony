<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Role;

class RoleController extends Controller
{
    /**
     * @Route("/api/role/create")
     */
    public function createAction(Request $request)
    {
        $role = new Role();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "rolename": "user",
            *   "description": "test test",
            * }
            */
            $params = json_decode($content, true);
            $rolename = $params['rolename'];
            $description = $params['description'];

            $role->setRolename($rolename);
            $role->setDescription($description);

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($role);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $rId = $role->getId();
            return new JsonResponse(array('response' => 'New role was created with id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/role/getall")
     */
    public function getAllRolesAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery('SELECT r.id, r.rolename, r.description FROM AppBundle:Role r');
            $roles = $query->getResult();

            return new JsonResponse(array('response' => $roles));
        } catch(\Doctrine\ORM\ORMException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        }     
    }

    /**
     * @Route("/api/role/getbyid")
     */
    public function getRoleByIdAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "id": 3
            * }
            */
            $params = json_decode($content, true);
            $id = $params['id'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT r.id, r.rolename, r.description FROM AppBundle:Role r WHERE r.id = :id');
                $query->setParameter('id', $id);
                $role = $query->getResult();

                return new JsonResponse(array('response' => $role));
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
     * @Route("/api/role/getbyname")
     */
    public function getRoleByNameAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "rolename": "user"
            * }
            */
            $params = json_decode($content, true);
            $rolename = $params['rolename'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT r.id, r.rolename, r.description FROM AppBundle:Role r WHERE r.rolename = :rolename');
                $query->setParameter('rolename', $rolename);
                $role = $query->getResult();

                return new JsonResponse(array('response' => $role));
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

