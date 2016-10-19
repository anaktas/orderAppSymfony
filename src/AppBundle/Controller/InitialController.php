<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class InitialController extends Controller
{
    /**
     * @Route("/initial/init", name="initpage")
     */
    public function initAction(Request $request)
    {
        $name = 'Tasos';
        return new JsonResponse(array('name' => $name));
    }
}