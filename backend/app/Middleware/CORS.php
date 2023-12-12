<?php

namespace App\Middleware;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Middleware\MiddlewareInterface;

class CORS implements MiddlewareInterface
{
    public function before(RequestInterface $request)
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response)
    {
        // You can perform additional tasks here after the request has been handled
        return $response;
    }
}
