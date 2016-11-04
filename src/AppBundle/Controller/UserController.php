<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\User;

class UserController extends Controller
{
    /**
     * @Route("/api/user/create")
     */
    public function createAction(Request $request)
    {
        $user = new User();
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "username": "test1",
            *   "password": "1234",
            *   "roleId": 1
            * }
            */
            $params = json_decode($content, true);
            $username = $params['username'];
            $password = $params['password'];
            $roleId = $params['roleId'];

            $user->setUsername($username);
            $user->setPassword($password);
            $user->setRoleId($roleId);

            try {
                $em = $this->getDoctrine()->getManager();
                $em->persist($user);
                $em->flush();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }
            
            $rId = $user->getId();
            return new JsonResponse(array('response' => 'Ένας νέος χρήστης δημιουργήθηκε με id: ' . $rId));
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }       
    }

    /**
     * @Route("/api/user/getall")
     */
    public function getAllUsersAction(Request $request)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $query = $em->createQuery('SELECT u.id, u.username, (SELECT r.rolename FROM AppBundle:Role r WHERE r.id = u.roleId) as roleName FROM AppBundle:User u');
            $users = $query->getResult();

            return new JsonResponse(array('response' => $users));
        } catch(\Doctrine\ORM\ORMException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
            return new JsonResponse(array('error' => $e->getMessage()));
        }     
    }

    /**
     * @Route("/api/user/getbyid")
     */
    public function getUserByIdAction(Request $request)
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
                $query = $em->createQuery('SELECT u.id, u.username, (SELECT r.rolename FROM AppBundle:Role r WHERE r.id = u.roleId) as roleName FROM AppBundle:User u WHERE u.id = :id');
                $query->setParameter('id', $id);
                $user = $query->getResult();

                return new JsonResponse(array('response' => $user));
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
     * @Route("/api/user/getbyuname")
     */
    public function getUserByUsernameAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "username": "test1"
            * }
            */
            $params = json_decode($content, true);
            $username = $params['username'];

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT u.id, u.username, (SELECT r.rolename FROM AppBundle:Role r WHERE r.id = u.roleId) as roleName FROM AppBundle:User u WHERE u.username = :username');
                $query->setParameter('username', $username);
                $user = $query->getResult();

                return new JsonResponse(array('response' => $user));
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
     * @Route("/api/user/login")
     */
    public function loginAction(Request $request)
    {
        $params = array();
        $content = $request->getContent();
        if (!empty($content))
        {
            /*
            * EXAMPLE:
            * {
            *   "username": "test1",
            *   "password": "1234",
            *   "roleId": 1
            * }
            */
            $params = json_decode($content, true);
            $username = $params['username'];
            $password = sha1($params['password']);
            $roleId = $params['roleId'];
            $count = 0;

            try {
                $em = $this->getDoctrine()->getManager();
                $query = $em->createQuery('SELECT COUNT(u.id) FROM AppBundle:User u WHERE u.username = :username AND u.password = :password AND u.roleId = :roleId');
                $query->setParameter('username', $username);
                $query->setParameter('password', $password);
                $query->setParameter('roleId', $roleId);
                $count = $query->getSingleScalarResult();
            } catch(\Doctrine\ORM\ORMException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            } catch(\Doctrine\DBAL\Exception\NotNullConstraintViolationException $e) {
                return new JsonResponse(array('error' => $e->getMessage()));
            }

            if($count != 0)
            {
                return new JsonResponse(array('response' => 'match'));
            } else {
                return new JsonResponse(array('response' => 'mismatch'));
            }  
        } else {
            return new JsonResponse(array('error' => 'Empty request.'));
        }          
    }
}

