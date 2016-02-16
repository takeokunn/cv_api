<?php

namespace Cv\Http\Controllers;

use Illuminate\Http\Request;

use Cv\Http\Controllers\Controller;

class PaymentController extends Controller
{

    private $auth;

    public function __construct(
        \Cv\Service\AuthService $auth,
        \Cv\Service\AppointmentService $appointment,
        \Cv\Service\TransactionService $transaction
    ) 
    {
        $this->auth = $auth;
        $this->appointment = $appointment;
        $this->transaction = $transaction;
    }

    public function yahooFastpayCallback(Request $request)
    {
        $action = $request->get('action');
        $id     = $request->get('id');
        
        if(!$request->has('action') || !$request->has('id') || !$request->has('fastpayToken')) {
            return "error";
        }


        try {

            $user = $this->auth->getLoginedUser();

            $appointment = $this->appointment->get( $id ,$user);

            if($appointment->paid) {
                // this appointment already paid
                return redirect("/".$action."/".$id);   
            }

            $token = $request->get("fastpayToken");
            $amount = 3000;
            $this->transaction->makeAppointmentPaymentTransaction( $amount , $token ,$appointment);


            return redirect("/".$action."/".$id);

        } catch (\Cv\Exceptions\NoPermissionModel $e) {
            return "error";
        }

        return "error";
    }
}
